"""
Intervue.ai — ML Microservice
FastAPI server exposing 3 ML-powered endpoints:

  POST /ats-score       — AI-enhanced CV vs job description analysis
  POST /salary-predict  — Role + level + location salary prediction
  POST /answer-score    — Interview answer quality scoring (STAR + semantic)
  GET  /health          — Model status check

Run:
  python train_salary.py   (once, to train the salary model)
  uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import math
import re
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Paths ─────────────────────────────────────────────────────────────────────
MODELS_DIR = Path(__file__).parent / "models"

# ── Global model handles ──────────────────────────────────────────────────────
salary_model   = None
salary_encoder = None
sentence_model = None
good_embeddings = None
bad_embeddings  = None


# ── Reference answers for semantic scoring ────────────────────────────────────
GOOD_ANSWERS = [
    "When I was at my previous company as a senior engineer, our payment system was causing 15% cart abandonment. "
    "I was tasked with reducing this below 5%. I conducted a full audit, identified 3 bottlenecks in API calls, "
    "implemented Redis caching and async processing, and coordinated with DevOps. "
    "Within 8 weeks, we reduced abandonment to 3.2%, increasing monthly revenue by £180,000.",

    "In my role as team lead at a fintech startup, our deployment process took 3 hours and caused weekly outages. "
    "I proposed and led a migration to CI/CD using GitHub Actions and Docker. I wrote the pipeline, trained 6 engineers, "
    "and ran parallel deployments for 2 weeks. Deployment time dropped from 3 hours to 18 minutes and we had zero outages for 6 months.",

    "During a critical product launch, our main database went down 2 hours before go-live. "
    "As on-call engineer I immediately activated the read replica, coordinated with AWS support, "
    "implemented connection pooling to reduce load, and sent stakeholder updates every 15 minutes. "
    "The launch proceeded with a 45-minute delay. I then documented the incident to prevent recurrence.",

    "My manager asked me to improve onboarding time for new engineers. "
    "I interviewed 8 team members, identified that setup scripts were outdated, and rewrote the onboarding docs and automation. "
    "Average onboarding time fell from 3 days to 4 hours, and new-hire satisfaction scores rose 40%.",
]

BAD_ANSWERS = [
    "I worked on some projects and they went well. I usually figure things out.",
    "I don't know, I think I did okay. My team helped a lot.",
    "It was fine, we just fixed the problem.",
    "I'm a hard worker and I always try my best.",
    "I think maybe I could have done better but overall it was okay I guess.",
]


# ── Lifespan: load models once at startup ─────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global salary_model, salary_encoder, sentence_model, good_embeddings, bad_embeddings

    # 1. Salary model
    m_path = MODELS_DIR / "salary_model.joblib"
    e_path = MODELS_DIR / "salary_encoder.joblib"
    if m_path.exists() and e_path.exists():
        salary_model   = joblib.load(m_path)
        salary_encoder = joblib.load(e_path)
        print("✅ Salary model loaded")
    else:
        print("⚠️  Salary model not found — run: python train_salary.py")

    # 2. Sentence transformer + reference embeddings
    try:
        from sentence_transformers import SentenceTransformer, util as st_util
        sentence_model  = SentenceTransformer("all-MiniLM-L6-v2")
        good_embeddings = sentence_model.encode(GOOD_ANSWERS, convert_to_tensor=True)
        bad_embeddings  = sentence_model.encode(BAD_ANSWERS,  convert_to_tensor=True)
        print("✅ Sentence transformer + embeddings ready")
    except Exception as e:
        print(f"⚠️  Sentence transformer unavailable: {e}")

    yield  # app runs here


app = FastAPI(title="Intervue ML Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH
# ═══════════════════════════════════════════════════════════════════════════════
@app.get("/health")
def health():
    return {
        "status": "ok",
        "models": {
            "salary":      salary_model   is not None,
            "embeddings":  sentence_model is not None,
        },
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 1 — ATS SCORE
# ═══════════════════════════════════════════════════════════════════════════════

# ── Generic stop-words (English prose noise, job-description boilerplate) ──────
STOP_WORDS = {
    "the","and","for","with","this","that","have","will","from","your","their",
    "been","they","about","which","would","should","could","able","more","some",
    "such","into","than","then","when","where","also","other","both","each",
    # JD boilerplate — verbs / adjectives that are never real skills
    "need","needs","required","requirements","preferred","must","want","looking",
    "work","working","role","position","candidate","ideal","strong","good",
    "great","excellent","outstanding","proven","solid","deep","broad","high",
    "knowledge","understanding","familiarity","awareness","exposure","proficiency",
    "ability","skills","skill","using","use","used","uses","well","including",
    "include","join","create","creating","help","helping","plus","bonus","nice",
    "make","develop","engineer","engineers","developer","developers","designer",
    "designers","manager","managers","analyst","analysts","specialist",
    "senior","junior","lead","mid","level","years","year","least","minimum",
    "preferred","desired","benefit","benefits","opportunity","environment",
    "culture","company","startup","enterprise","fast","paced","passionate",
    "driven","motivated","self","starter","independently","cross","functional",
    "collaborate","collaboration","communicating","problem","solving","analytical",
    "thinking","ownership","responsible","responsibilities","duties","tasks",
    "manage","managing","deliver","delivering","maintaining","maintain",
    "support","supporting","ensure","ensured","day","days","week","weeks",
    "report","reports","reporting","based","office","hybrid","remote","london",
    "york","city","area","location","onsite","salary","competitive","package",
}

# ── Multi-domain skills bank ──────────────────────────────────────────────────
# Primary source for keyword matching. Covers 10 fields.
# Multi-word entries are checked against the raw text (not tokenised).
SKILLS_BANK: set[str] = {
    # ── Software Engineering ──────────────────────────────────────────────────
    "python","javascript","typescript","java","golang","go","rust","ruby","php",
    "swift","kotlin","scala","perl","bash","shell","powershell","elixir","haskell",
    "c++","c#","objective-c","dart","flutter","react","nextjs","next.js","angular",
    "vue","svelte","nuxt","gatsby","remix","ember","backbone","jquery",
    "nodejs","node.js","express","fastapi","django","flask","rails","spring",
    "laravel","symfony","gin","fiber","actix","rocket","asp.net","blazor",
    "postgresql","mysql","sqlite","mariadb","mongodb","redis","elasticsearch",
    "cassandra","dynamodb","firestore","supabase","planetscale","cockroachdb",
    "prisma","sqlalchemy","typeorm","sequelize","mongoose","drizzle",
    "docker","kubernetes","k8s","terraform","ansible","jenkins","github actions",
    "gitlab ci","circleci","travis","aws","gcp","azure","heroku","vercel",
    "netlify","cloudflare","digitalocean","linode","fly.io",
    "graphql","rest","grpc","websockets","webrtc","oauth","jwt","openid",
    "git","linux","nginx","apache","kafka","rabbitmq","nats","celery","redis",
    "microservices","serverless","cicd","ci/cd","devops","sre","devsecops",
    "agile","scrum","kanban","tdd","bdd","ddd","pair programming",
    "html","css","sass","scss","tailwind","tailwindcss","bootstrap","mui",
    "shadcn","radix","storybook","webpack","vite","esbuild","rollup","turbo",
    "jest","vitest","pytest","cypress","playwright","selenium","postman",
    "git","github","gitlab","bitbucket","jira","confluence","notion","linear",
    "aws lambda","ec2","s3","rds","sqs","sns","ecs","eks","fargate",
    "gke","gcs","bigquery","cloud run","cloud functions",
    "azure devops","azure functions","cosmos db","blob storage",
    # ── Machine Learning / AI ─────────────────────────────────────────────────
    "machine learning","deep learning","nlp","computer vision","llm","gen ai",
    "generative ai","reinforcement learning","mlops","data science",
    "tensorflow","pytorch","keras","scikit-learn","sklearn","xgboost","lightgbm",
    "hugging face","huggingface","langchain","llamaindex","openai","anthropic",
    "stable diffusion","transformers","bert","gpt","llama","mistral",
    "feature engineering","model deployment","rag","fine-tuning","embeddings",
    "vector database","pinecone","weaviate","chroma","faiss",
    # ── Data & Analytics ─────────────────────────────────────────────────────
    "sql","nosql","pandas","numpy","scipy","matplotlib","seaborn","plotly",
    "tableau","power bi","powerbi","looker","metabase","dbt","airflow",
    "apache spark","hadoop","hive","flink","kafka","databricks","snowflake",
    "redshift","bigquery","athena","data lake","data warehouse","data mesh",
    "etl","elt","data pipeline","data engineering","data modelling",
    "statistics","regression","clustering","classification","forecasting",
    "excel","vba","google sheets","power query","excel vba",
    "r","matlab","stata","spss","sas","julia",
    "google analytics","ga4","mixpanel","amplitude","segment","heap",
    "a/b testing","experimentation","statistical significance",
    # ── Finance & Banking ─────────────────────────────────────────────────────
    "bloomberg","reuters","excel","vba","financial modelling","dcf","lbo",
    "m&a","ipo","private equity","venture capital","hedge fund","asset management",
    "wealth management","investment banking","corporate finance","equity research",
    "credit analysis","risk management","market risk","credit risk","operational risk",
    "derivatives","equities","fixed income","bonds","forex","commodities","fx",
    "portfolio management","treasury","underwriting","syndication","securitisation",
    "aml","kyc","cdd","sow","pep","sanctions","compliance","regulatory",
    "basel","solvency ii","mifid","ifrs","gaap","cfa","acca","cpa","frm","caia",
    "bloomberg terminal","refinitiv","factset","pitchbook","capital iq",
    "risk","audit","internal audit","external audit","sox","pcaob",
    "financial reporting","consolidation","budgeting","forecasting","fp&a",
    "accounts payable","accounts receivable","reconciliation","month end","year end",
    "payroll","tax","vat","corporation tax","transfer pricing","tax compliance",
    "gdpr","pci dss","iso 27001","nist","sox compliance",
    # ── Marketing & Growth ────────────────────────────────────────────────────
    "seo","sem","ppc","cpc","cpm","roi","roas","ctr","cpa","ltv","cac","mrr","arr",
    "google ads","facebook ads","meta ads","tiktok ads","linkedin ads","programmatic",
    "google analytics","ga4","hubspot","salesforce","marketo","pardot","klaviyo",
    "mailchimp","intercom","drift","braze","iterable","sendgrid","twilio",
    "wordpress","shopify","webflow","contentful","strapi","cms","crm",
    "content marketing","email marketing","social media marketing","influencer marketing",
    "copywriting","brand strategy","positioning","demand generation","lead generation",
    "growth hacking","funnel optimisation","conversion rate","retention","acquisition",
    "churn reduction","product led growth","plg","viral coefficient","referral",
    "affiliate marketing","display advertising","native advertising","podcast advertising",
    # ── Design & UX ──────────────────────────────────────────────────────────
    "figma","sketch","adobe xd","photoshop","illustrator","indesign","after effects",
    "premiere pro","lightroom","invision","zeplin","framer","webflow","principle",
    "ux research","user research","usability testing","user testing","card sorting",
    "wireframing","prototyping","information architecture","interaction design",
    "visual design","brand design","motion design","design systems","design tokens",
    "typography","colour theory","grid systems","accessibility","wcag","aria",
    "responsive design","mobile first","atomic design","component library",
    "3d modelling","blender","cinema 4d","unity","unreal engine","webgl","three.js",
    # ── Product Management ────────────────────────────────────────────────────
    "product roadmap","product strategy","go to market","product discovery",
    "user stories","epics","sprints","backlog","prioritisation","feature flags",
    "product analytics","north star metric","okrs","kpis","product metrics",
    "stakeholder management","product vision","mvp","lean startup",
    "jobs to be done","jtbd","customer journey","pain points","personas",
    "competitive analysis","market research","product market fit","pmf",
    # ── Healthcare & Life Sciences ────────────────────────────────────────────
    "ehr","emr","hipaa","hl7","fhir","dicom","clinical trials","gcp","fda",
    "ce marking","mdr","iso 13485","ivd","clinical research","pharmacovigilance",
    "regulatory affairs","medical affairs","medical writing","clinical data",
    "nursing","pharmacy","diagnosis","icd-10","cpt coding","medical coding",
    "telehealth","digital health","patient care","care coordination",
    # ── Legal ────────────────────────────────────────────────────────────────
    "legal research","contract drafting","contract review","litigation","arbitration",
    "due diligence","corporate law","employment law","intellectual property","ip law",
    "data protection","gdpr","ccpa","legal writing","westlaw","lexisnexis",
    "company secretary","company secretarial","board minutes","articles",
    # ── HR & People Ops ──────────────────────────────────────────────────────
    "talent acquisition","recruitment","headhunting","executive search","sourcing",
    "applicant tracking","ats","onboarding","offboarding","hris","workday",
    "successfactors","bamboohr","greenhouse","lever","teamtailor","personio",
    "performance management","360 feedback","compensation","benchmarking",
    "employee relations","dei","learning development","l&d","organisational development",
    "workforce planning","succession planning","hr analytics","people analytics",
    # ── Operations & Project Management ──────────────────────────────────────
    "project management","programme management","pmp","prince2","msp",
    "change management","stakeholder engagement","risk register","governance",
    "six sigma","lean","kaizen","process improvement","bpm","process mapping",
    "supply chain","logistics","procurement","vendor management","contract management",
    "erp","sap","oracle","netsuite","dynamics 365","servicenow","zendesk",
    # ── Soft skills (genuine JD requirements, not filler adjectives) ──────────
    "leadership","mentoring","coaching","negotiation","public speaking",
    "presentation skills","facilitation","conflict resolution","strategic thinking",
    "stakeholder management","cross-functional","programme delivery",
}


class ATSRequest(BaseModel):
    cv_text: str
    job_description: Optional[str] = ""


def _extract_jd_keywords(jd: str) -> set[str]:
    """
    Two-pass keyword extraction:
      Pass 1 — match known skills from SKILLS_BANK (high precision, any field).
      Pass 2 — extract remaining long tokens not in STOP_WORDS (catches domain
               terms we haven't catalogued yet, e.g. niche certifications).
    """
    jd_lower = jd.lower()

    # Pass 1: multi-word and single-word skill-bank matches
    bank_hits: set[str] = set()
    for skill in SKILLS_BANK:
        if skill in jd_lower:
            bank_hits.add(skill)

    # Pass 2: single-token fallback — only words ≥ 5 chars not already covered
    bank_singles = {s for s in bank_hits if " " not in s}
    raw_tokens   = set(re.findall(r"\b[a-z][a-z+#./\-]{3,}\b", jd_lower))
    fallback = {
        w for w in raw_tokens
        if w not in STOP_WORDS
        and w not in bank_singles
        and len(w) >= 5
    }

    return bank_hits | fallback


def _match_cv_keywords(cv_text: str, jd_keywords: set[str]) -> tuple[list[str], list[str]]:
    """
    Return (matched, missing) lists.
    Handles both single-word and multi-word skills correctly.
    """
    cv_lower     = cv_text.lower()
    cv_tokens    = set(re.findall(r"\b[a-z][a-z+#./\-]{2,}\b", cv_lower))

    matched, missing = [], []
    for kw in sorted(jd_keywords):
        # Multi-word: check raw substring; single-word: check token set
        found = (kw in cv_lower) if " " in kw else (kw in cv_tokens)
        (matched if found else missing).append(kw)

    return matched, missing


def _tfidf_cosine(text1: str, text2: str) -> float:
    """Lightweight TF-IDF cosine similarity (no sklearn needed)."""
    def tok(t):
        return re.findall(r"\b[a-z][a-z+#.]{2,}\b", t.lower())

    t1, t2 = tok(text1), tok(text2)
    if not t1 or not t2:
        return 0.0

    vocab  = set(t1) | set(t2)
    n_docs = 2

    def tfidf(tokens, word):
        tf  = tokens.count(word) / len(tokens)
        df  = (word in t1) + (word in t2)
        idf = math.log((n_docs + 1) / (df + 1)) + 1
        return tf * idf

    v1 = [tfidf(t1, w) for w in vocab]
    v2 = [tfidf(t2, w) for w in vocab]

    dot  = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2 + 1e-9)


def _has_section_headings(text: str) -> bool:
    lines = text.split("\n")
    caps  = sum(1 for l in lines if l.strip().isupper() and 3 < len(l.strip()) < 40)
    return caps >= 2


@app.post("/ats-score")
def ats_score(req: ATSRequest):
    cv = req.cv_text.lower()
    jd = (req.job_description or "").strip()

    # ── Keyword extraction ───────────────────────────────────────────────────
    if jd:
        jd_keywords = _extract_jd_keywords(jd)
    else:
        # No JD: use a broad default skill set
        jd_keywords = {
            "python","javascript","typescript","react","sql","api","git",
            "agile","docker","aws","leadership","testing","figma","excel",
        }

    matched, missing = _match_cv_keywords(req.cv_text, jd_keywords)
    keyword_pct = min(100, round(len(matched) / max(len(jd_keywords), 1) * 100))

    # ── Semantic similarity ─────────────────────────────────────────────────
    if jd and sentence_model:
        try:
            from sentence_transformers import util as st_util
            cv_emb  = sentence_model.encode(req.cv_text[:1200], convert_to_tensor=True)
            jd_emb  = sentence_model.encode(jd[:1200], convert_to_tensor=True)
            sem_score = round(float(st_util.cos_sim(cv_emb, jd_emb)) * 100)
        except Exception:
            sem_score = round(keyword_pct * 0.9)
    elif jd:
        sem_score = round(_tfidf_cosine(req.cv_text, jd) * 100)
    else:
        sem_score = keyword_pct

    # ── Structure checks ────────────────────────────────────────────────────
    has_summary    = bool(re.search(r"\b(summary|objective|profile|about me)\b", cv))
    has_experience = bool(re.search(r"\b(experience|employment|worked at|work history)\b", cv))
    has_education  = bool(re.search(r"\b(education|university|college|degree|bachelor|master|phd)\b", cv))
    has_skills     = bool(re.search(r"\b(skills|technologies|tools|proficient|expertise)\b", cv))
    has_contact    = bool(re.search(r"\b(email|phone|linkedin|github|@)\b", cv))
    has_metrics    = bool(re.search(r"\d+\s*%|\d+x|£[\d,]+|\$[\d,]+|increased|reduced|improved|saved", req.cv_text, re.I))
    has_headings   = _has_section_headings(req.cv_text)
    word_count     = len(req.cv_text.split())

    action_verbs = ["led","built","created","managed","improved","reduced","increased",
                    "delivered","designed","launched","achieved","developed","implemented",
                    "deployed","architected","mentored","scaled","optimized","automated",
                    "established","coordinated","negotiated","streamlined","refactored"]
    verb_hits = sum(1 for v in action_verbs if v in cv)

    # ── Section scores ──────────────────────────────────────────────────────
    s_experience = min(100, 35 + (25 if has_experience else 0) + (25 if has_metrics else 0) + min(15, verb_hits * 3))
    s_keywords   = keyword_pct
    s_summary    = 82 if has_summary else 38
    s_education  = 88 if has_education else 48
    s_contact    = 92 if has_contact else 45
    s_formatting = min(100, 40
                       + (20 if 200 < word_count < 1400 else 0)
                       + (20 if has_headings else 0)
                       + (10 if has_skills else 0)
                       + (10 if has_contact else 0))

    sections_raw = {
        "Work Experience":   s_experience,
        "Skills / Keywords": s_keywords,
        "Summary / Profile": s_summary,
        "Education":         s_education,
        "Contact & Links":   s_contact,
        "Formatting":        s_formatting,
    }

    tips = {
        "Work Experience":   (f"Good metrics! {verb_hits} action verb(s) detected. Aim for 3+ per role."
                              if has_metrics else "Add measurable results to every bullet — numbers stand out to ATS."),
        "Skills / Keywords": (f"Add these naturally: {', '.join(missing[:5])}" if missing else "Great keyword coverage!"),
        "Summary / Profile": ("Add a 3–4 line professional summary targeting this role." if not has_summary
                              else "Mirror the job description language in your summary."),
        "Education":          "Ensure degree, institution and year are clearly formatted." if not has_education else "Well formatted.",
        "Contact & Links":   ("Add email, phone, LinkedIn, and GitHub." if not has_contact
                              else "Contact info detected. Add a LinkedIn URL if missing."),
        "Formatting":         ("Use clear ALL-CAPS section headers and consistent spacing." if not has_headings
                               else "Clean layout. Keep CV to 1–2 pages maximum."),
    }

    # ── Overall score ────────────────────────────────────────────────────────
    rule_score = round(
        s_experience * 0.30 +
        s_keywords   * 0.25 +
        s_summary    * 0.15 +
        s_education  * 0.10 +
        s_contact    * 0.10 +
        s_formatting * 0.10
    )
    overall = round(rule_score * 0.55 + sem_score * 0.45) if jd else rule_score

    # ── Strengths ────────────────────────────────────────────────────────────
    strengths = [s for s in [
        "Strong quantified achievements" if has_metrics else None,
        "Relevant work experience section" if has_experience else None,
        "Education section present" if has_education else None,
        "Contact information included" if has_contact else None,
        f"{verb_hits} action verbs detected — shows ownership" if verb_hits >= 4 else None,
        f"{len(matched)} keywords matched from job description" if len(matched) >= 5 else None,
    ] if s]

    return {
        "overall_score":    overall,
        "keyword_score":    keyword_pct,
        "semantic_score":   sem_score,
        "sections":         [
            {"name": k, "score": v,
             "tip": tips[k],
             "status": "good" if v >= 75 else "warn" if v >= 55 else "bad"}
            for k, v in sections_raw.items()
        ],
        "matched_keywords": matched[:20],
        "missing_keywords": missing[:15],
        "strengths":        strengths,
        "word_count":       word_count,
        "has_metrics":      has_metrics,
        "verb_count":       verb_hits,
        "ai_enhanced":      sentence_model is not None,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 2 — SALARY PREDICTOR
# ═══════════════════════════════════════════════════════════════════════════════
SALARY_FALLBACK = {
    ("software", "junior"): (28_000, 38_000, 48_000),
    ("software", "mid"):    (45_000, 62_000, 80_000),
    ("software", "senior"): (70_000, 90_000, 118_000),
    ("software", "lead"):   (92_000, 115_000, 148_000),
    ("data",     "junior"): (26_000, 36_000, 46_000),
    ("data",     "mid"):    (42_000, 58_000, 76_000),
    ("data",     "senior"): (65_000, 84_000, 108_000),
    ("data",     "lead"):   (85_000, 108_000, 138_000),
    ("product",  "junior"): (30_000, 40_000, 52_000),
    ("product",  "mid"):    (48_000, 65_000, 83_000),
    ("product",  "senior"): (72_000, 92_000, 118_000),
    ("product",  "lead"):   (92_000, 116_000, 148_000),
    ("design",   "junior"): (24_000, 32_000, 42_000),
    ("design",   "mid"):    (36_000, 52_000, 68_000),
    ("design",   "senior"): (55_000, 74_000, 96_000),
    ("design",   "lead"):   (75_000, 96_000, 122_000),
    ("devops",   "junior"): (30_000, 42_000, 54_000),
    ("devops",   "mid"):    (48_000, 65_000, 83_000),
    ("devops",   "senior"): (72_000, 92_000, 118_000),
    ("devops",   "lead"):   (92_000, 116_000, 148_000),
    ("marketing","junior"): (22_000, 29_000, 37_000),
    ("marketing","mid"):    (32_000, 44_000, 57_000),
    ("marketing","senior"): (48_000, 63_000, 80_000),
    ("marketing","lead"):   (62_000, 81_000, 102_000),
    ("general",  "junior"): (22_000, 30_000, 40_000),
    ("general",  "mid"):    (33_000, 46_000, 60_000),
    ("general",  "senior"): (52_000, 70_000, 90_000),
    ("general",  "lead"):   (68_000, 88_000, 112_000),
}

LOCATION_MULT = {
    "london": 1.25, "new york": 1.80, "san francisco": 2.00, "silicon valley": 2.00,
    "zurich": 1.90, "amsterdam": 1.30, "berlin": 1.10, "paris": 1.20,
    "manchester": 1.00, "birmingham": 0.95, "edinburgh": 1.00, "glasgow": 0.95,
    "remote": 1.10, "dubai": 1.15, "singapore": 1.50, "toronto": 1.30,
    "sydney": 1.35, "melbourne": 1.30, "austin": 1.45, "seattle": 1.65,
}

SKILL_PREMIUM = {
    "machine learning": 0.12, "deep learning": 0.13, "llm": 0.18, "ai": 0.12,
    "kubernetes": 0.10, "terraform": 0.09, "golang": 0.11, "rust": 0.13,
    "aws": 0.08, "gcp": 0.08, "azure": 0.07, "blockchain": 0.10,
    "solidity": 0.14, "pytorch": 0.12, "tensorflow": 0.10, "data science": 0.09,
}

VALID_LEVELS = {"junior", "mid", "senior", "lead"}


def _classify_role(role: str, field: str) -> str:
    t = (role + " " + field).lower()
    if any(w in t for w in ["software","engineer","developer","full stack","backend","frontend","sde","swe"]): return "software"
    if any(w in t for w in ["data","scientist","analyst","ml ","machine learning","nlp","ai "]): return "data"
    if any(w in t for w in ["product","pm ","growth hacking"]): return "product"
    if any(w in t for w in ["design","ux ","ui ","designer","figma"]): return "design"
    if any(w in t for w in ["devops","cloud","infra","sre","platform","kubernetes","docker","terraform"]): return "devops"
    if any(w in t for w in ["marketing","seo","content","social","brand","growth"]): return "marketing"
    return "general"


class SalaryRequest(BaseModel):
    role:     str
    level:    str
    location: str
    field:    Optional[str] = ""
    skills:   Optional[list[str]] = []


@app.post("/salary-predict")
def salary_predict(req: SalaryRequest):
    cat   = _classify_role(req.role, req.field or "")
    level = req.level.lower() if req.level.lower() in VALID_LEVELS else "mid"
    loc   = req.location.lower()

    # ── Base salary from model or fallback table ─────────────────────────────
    if salary_model and salary_encoder:
        try:
            feat    = salary_encoder.transform([[cat, level]])
            median  = round(float(salary_model.predict(feat)[0]))
            lo, hi  = SALARY_FALLBACK.get((cat, level), (20_000, 80_000))[:2]
            spread  = max(10_000, (hi - lo) * 0.40)
            base_min, base_med, base_max = median - spread * 0.5, median, median + spread * 0.7
        except Exception:
            base_min, base_med, base_max = SALARY_FALLBACK.get((cat, level), SALARY_FALLBACK[("general","mid")])
    else:
        base_min, base_med, base_max = SALARY_FALLBACK.get((cat, level), SALARY_FALLBACK[("general","mid")])

    # ── Location multiplier ─────────────────────────────────────────────────
    loc_mult = 1.0
    for city, mult in LOCATION_MULT.items():
        if city in loc:
            loc_mult = mult
            break

    # ── Skill premium ────────────────────────────────────────────────────────
    skills_l     = [s.lower() for s in (req.skills or [])]
    skill_bonus  = min(0.28, sum(SKILL_PREMIUM.get(s, 0) for s in skills_l))
    total_mult   = loc_mult * (1 + skill_bonus)

    def rnd(n): return round(n * total_mult / 1000) * 1000

    final_min = rnd(base_min)
    final_med = rnd(base_med)
    final_max = rnd(base_max)

    is_usd = any(c in loc for c in ["new york","san francisco","usa","austin","seattle","silicon"])
    sym, cur = ("$","USD") if is_usd else ("£","GBP")

    def fmt(n): return f"{sym}{n:,}"

    return {
        "min":               final_min,
        "median":            final_med,
        "max":               final_max,
        "display":           f"{fmt(final_min)} – {fmt(final_max)}",
        "median_display":    fmt(final_med),
        "currency":          cur,
        "role_category":     cat,
        "level":             level,
        "location_mult":     round(loc_mult, 2),
        "skill_premium_pct": round(skill_bonus * 100),
        "model_used":        salary_model is not None,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 3 — ANSWER QUALITY SCORER
# ═══════════════════════════════════════════════════════════════════════════════
class AnswerRequest(BaseModel):
    answer:         str
    question:       Optional[str] = ""
    interview_type: Optional[str] = "behavioral"


@app.post("/answer-score")
def answer_score(req: AnswerRequest):
    ans = req.answer.strip()
    if not ans:
        return {"score": 0, "feedback": ["No answer provided."], "breakdown": {}, "star": {}}

    a_lower    = ans.lower()
    words      = ans.split()
    word_count = len(words)
    sentences  = [s.strip() for s in re.split(r"[.!?]+", ans) if len(s.strip()) > 5]

    # ── Semantic quality (vs good/bad reference answers) ─────────────────────
    if sentence_model and good_embeddings is not None:
        try:
            from sentence_transformers import util as st_util
            ans_emb   = sentence_model.encode(ans, convert_to_tensor=True)
            good_sims = st_util.cos_sim(ans_emb, good_embeddings)[0]
            bad_sims  = st_util.cos_sim(ans_emb, bad_embeddings)[0]
            max_good  = float(good_sims.max())
            max_bad   = float(bad_sims.max())
            semantic  = max(0, min(100, round((max_good - max_bad * 0.45) * 130)))
        except Exception:
            semantic = 50
    else:
        semantic = 50

    # ── STAR structure ────────────────────────────────────────────────────────
    situation = bool(re.search(
        r"\b(when i was|at my (previous|last|current)|while working|during|in \d{4}|at (my company|my job|my role|my team))\b", a_lower))
    task = bool(re.search(
        r"\b(i (was responsible|needed to|had to|was tasked|was asked)|my (goal|objective|task|role) was|the (challenge|problem|issue) was)\b", a_lower))
    actions = re.findall(
        r"\b(decided|chose|implemented|built|created|developed|designed|led|managed|introduced|"
        r"proposed|wrote|refactored|fixed|deployed|launched|reduced|increased|coordinated|established|"
        r"automated|optimized|mentored|negotiated|scaled|delivered|streamlined)\b", a_lower)
    result = bool(re.search(
        r"\b(resulted in|increased|decreased|reduced|improved|saved|achieved|by \d+%|\d+%|"
        r"from .* to .*|the (outcome|result|impact) was|£[\d,]+|\$[\d,]+)\b", a_lower))

    star_score = min(100, round(
        (25 if situation else 0) +
        (25 if task      else 0) +
        min(25, len(actions) * 6) +
        (25 if result    else 0)
    ))

    # ── Communication ─────────────────────────────────────────────────────────
    fillers    = re.findall(r"\b(um+|uh+|like,|you know|basically|literally|kind of|sort of|i guess|i think i|maybe)\b", a_lower)
    filler_r   = len(fillers) / max(word_count, 1)
    has_nums   = bool(re.search(r"\d+\s*(%|x|k\b|£|\$|hours?|days?|weeks?|months?|people|engineers?|team)", ans, re.I))

    comm_score = min(100, round(
        min(35, (word_count / 100) * 35) +
        (22 if has_nums   else 0)        +
        max(0, 25 - len(fillers) * 5)    +
        min(18, len(sentences) * 3)
    ))

    # ── Confidence ────────────────────────────────────────────────────────────
    positive = re.findall(r"\b(i (am|have|can|did|built|led|created|know|understand|believe)|confident|experience|expertise|achieved|proven)\b", a_lower)
    hedges   = re.findall(r"\b(i think|i guess|maybe|perhaps|not sure|i don\'t know|possibly|sort of|might have)\b", a_lower)
    conf_score = min(100, max(20, round(50 + len(positive) * 5 - len(hedges) * 8)))

    # ── Technical depth ───────────────────────────────────────────────────────
    tech_terms = re.findall(
        r"\b(api|database|algorithm|complexity|cache|latency|sql|nosql|react|typescript|python|"
        r"kubernetes|docker|microservice|rest|graphql|async|thread|memory|cpu|scalab|deploy|"
        r"architecture|design pattern|solid|oop|recursion|data structure|tree|graph|hash|"
        r"sort|binary|stack|queue|heap|array|ci.?cd|redis|kafka|elasticsearch)\b", a_lower)
    tech_score = (min(100, 20 + len(tech_terms) * 8)
                  if req.interview_type != "behavioral" else 50)

    # ── Weighted overall ──────────────────────────────────────────────────────
    if req.interview_type == "technical":
        w = [0.20, 0.25, 0.20, 0.15, 0.20]   # semantic, star, comm, conf, tech
    else:
        w = [0.25, 0.30, 0.22, 0.18, 0.05]

    overall = round(
        semantic   * w[0] +
        star_score * w[1] +
        comm_score * w[2] +
        conf_score * w[3] +
        tech_score * w[4]
    )

    # ── Actionable feedback ───────────────────────────────────────────────────
    feedback = []
    if not situation:           feedback.append('Set the scene first: "When I was at [company]..." or "During [project]..."')
    if not task:                feedback.append('State your specific responsibility: "I was tasked with / responsible for..."')
    if len(actions) < 2:        feedback.append('Use strong action verbs: led, built, reduced, deployed, automated...')
    if not result:              feedback.append('Close with impact: "which reduced X by Y%" or "increasing revenue by £Z"')
    if word_count < 45:         feedback.append('Too brief — aim for 80–130 words per answer for best impression.')
    if filler_r > 0.05:         feedback.append(f'Reduce filler words ({len(fillers)} detected) — take a breath instead.')
    if not has_nums:            feedback.append('Quantify results: add %, £, team size, time saved...')
    if len(hedges) > 2:         feedback.append('Replace hedging language ("I think/guess") with assertive statements.')
    if not feedback:            feedback.append('Strong answer — clear structure, specific examples, measurable outcome.')

    return {
        "score":    overall,
        "breakdown": {
            "semantic_quality": semantic,
            "star_structure":   star_score,
            "communication":    comm_score,
            "confidence":       conf_score,
            "technical_depth":  tech_score,
        },
        "star": {
            "situation": situation,
            "task":      task,
            "action":    len(actions),
            "result":    result,
        },
        "feedback":     feedback[:4],
        "word_count":   word_count,
        "has_numbers":  has_nums,
        "filler_count": len(fillers),
        "ai_enhanced":  sentence_model is not None,
    }
