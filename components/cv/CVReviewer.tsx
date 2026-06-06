'use client';

import React, { useState, useRef } from 'react';
import { Upload, Search, RefreshCw, CheckCircle, AlertCircle, XCircle, Check, Info, FileText, AlignLeft, ChevronRight, Star } from 'lucide-react';

// ─── Scoring engine (keyword-based, no AI needed) ─────────────────────────────
function analyzeCV(cvText: string, jd: string): AnalysisResult {
  const cv  = cvText.toLowerCase();
  const jdL = jd.toLowerCase();

  // ATS keywords from JD
  const jdKeywords = jd.length > 20
    ? jd.match(/\b[a-zA-Z][a-zA-Z+#.]{2,}\b/g)?.filter(w => w.length > 3) ?? []
    : ['javascript','typescript','react','node','python','sql','api','git','agile','communication'];

  const uniqueJdKw = [...new Set(jdKeywords.map(k=>k.toLowerCase()))];
  const matched    = uniqueJdKw.filter(k => cv.includes(k));
  const missing    = uniqueJdKw.filter(k => !cv.includes(k)).slice(0,12);
  const kwScore    = Math.min(100, Math.round((matched.length / Math.max(uniqueJdKw.length, 1)) * 100));

  // Section scores
  const hasMetrics    = /\d+%|\d+x|\$[\d,]+|increased|decreased|reduced|improved/i.test(cvText);
  const hasExperience = /experience|work history|employment|worked at/i.test(cv);
  const hasSummary    = /summary|objective|profile|about/i.test(cv);
  const hasEducation  = /education|university|college|degree|bachelor|master|phd/i.test(cv);
  const hasSkills     = /skills|technologies|tools|proficient/i.test(cv);
  const hasContact    = /email|phone|linkedin|github/i.test(cv);
  const isFormatted   = cvText.length > 300 && cvText.split('\n').length > 10;

  const experienceScore = hasExperience ? (hasMetrics ? 88 : 65) : 30;
  const summaryScore    = hasSummary ? 72 : 40;
  const educationScore  = hasEducation ? 90 : 50;
  const formattingScore = isFormatted && hasContact ? 93 : 60;
  const skillsScore     = hasSkills ? Math.max(kwScore, 55) : 40;

  const ats = Math.round((kwScore * 0.35 + experienceScore * 0.25 + skillsScore * 0.2 + formattingScore * 0.1 + summaryScore * 0.1));

  const sections: Section[] = [
    { name:'Work Experience',  score:experienceScore, status:experienceScore>=80?'good':experienceScore>=60?'warn':'bad', tip:hasMetrics?'Strong metrics detected. Add 2–3 more quantified results.':'Add metrics to bullets — numbers stand out to ATS and recruiters.' },
    { name:'Skills / Keywords',score:skillsScore,     status:skillsScore>=80?'good':skillsScore>=60?'warn':'bad',        tip:missing.length>0?`Missing keywords: ${missing.slice(0,5).join(', ')}.`:'Good keyword coverage for this role.' },
    { name:'Summary / Profile',score:summaryScore,    status:summaryScore>=75?'good':'warn',                            tip:hasSummary?'Rewrite to target this specific role and company.':'Add a 3–4 line professional summary at the top.' },
    { name:'Education',        score:educationScore,  status:educationScore>=80?'good':'warn',                         tip:'Well formatted. Ensure degree relevance is clear.' },
    { name:'ATS Keywords',     score:kwScore,         status:kwScore>=75?'good':kwScore>=55?'warn':'bad',              tip:`${matched.length}/${uniqueJdKw.length} JD keywords found. ${kwScore<75?`Add naturally: ${missing.slice(0,3).join(', ')}.`:'Good coverage.'}` },
    { name:'Formatting',       score:formattingScore, status:formattingScore>=80?'good':'warn',                        tip:isFormatted?'Clean layout detected. Ensure single-column format for ATS.':'Improve structure — use clear section headers and consistent spacing.' },
  ];

  const strengths = [
    hasMetrics    && 'Strong quantified achievements detected',
    hasExperience && 'Relevant work experience section present',
    hasEducation  && 'Education section properly formatted',
    hasContact    && 'Contact information included',
    hasSkills     && 'Dedicated skills section found',
  ].filter(Boolean) as string[];

  return { ats, sections, missing: missing.slice(0, 10), matched: matched.slice(0, 10), strengths };
}

interface Section { name:string; score:number; status:'good'|'warn'|'bad'; tip:string }
interface AnalysisResult { ats:number; sections:Section[]; missing:string[]; matched:string[]; strengths:string[] }

// ─── Score ring ───────────────────────────────────────────────────────────────
function Ring({ score }: { score: number }) {
  const r = 36, c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7"/>
      <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform="rotate(-90 48 48)" style={{transition:'stroke-dasharray 1s ease'}}/>
      <text x="48" y="52" textAnchor="middle" fontSize="18" fontWeight="800" fill={color} fontFamily="system-ui">{score}</text>
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CVReviewer() {
  const [step, setStep]         = useState<'upload'|'result'>('upload');
  const [cvText, setCvText]     = useState('');
  const [fileName, setFileName] = useState('');
  const [jd, setJd]             = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult]     = useState<AnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    const text = await file.text().catch(() => '');
    setCvText(text || `[${file.name}]`);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(analyzeCV(cvText, jd));
      setAnalyzing(false);
      setStep('result');
    }, 1600);
  }

  if (step === 'result' && result) {
    const { ats, sections, missing, matched, strengths } = result;
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-900">CV Analysis Report</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{fileName || 'Your CV'} · {jd ? 'vs. job description' : 'general review'}</p>
          </div>
          <button onClick={()=>{setStep('upload');setResult(null);}}
            className="text-xs px-3 py-1.5 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 transition-all">
            Analyse another
          </button>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-3 gap-4">
          {/* ATS score */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 flex flex-col items-center gap-3">
            <Ring score={ats}/>
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-900">ATS Match Score</p>
              <p className="text-xs text-zinc-400 mt-0.5">Overall compatibility</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${ats>=80?'bg-emerald-50 text-emerald-700 border-emerald-200':ats>=60?'bg-amber-50 text-amber-700 border-amber-200':'bg-red-50 text-red-700 border-red-200'}`}>
              {ats>=80?'Strong match':ats>=60?'Needs work':'Poor match'}
            </span>
          </div>

          {/* Section bars */}
          <div className="col-span-2 bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Section breakdown</h3>
            {sections.map(s=>(
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-32 text-xs text-zinc-600 shrink-0">{s.name}</span>
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${s.status==='good'?'bg-emerald-500':s.status==='warn'?'bg-amber-500':'bg-red-500'}`}
                    style={{width:`${s.score}%`}}/>
                </div>
                <span className="text-xs font-medium w-8 text-right text-zinc-700">{s.score}%</span>
                {s.status==='good'?<CheckCircle size={13} className="text-emerald-500 shrink-0"/>:s.status==='warn'?<AlertCircle size={13} className="text-amber-500 shrink-0"/>:<XCircle size={13} className="text-red-500 shrink-0"/>}
              </div>
            ))}
          </div>
        </div>

        {/* Strengths + Improvements */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-2.5">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><Star size={14} className="text-emerald-500"/>Strengths</h3>
            {(strengths.length>0?strengths:['Experience section present','Basic structure detected']).map(t=>(
              <div key={t} className="flex items-start gap-2 text-xs text-zinc-600">
                <Check size={12} className="text-emerald-500 shrink-0 mt-0.5"/>{t}
              </div>
            ))}
          </div>
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-2.5">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2"><AlertCircle size={14} className="text-amber-500"/>Improvements</h3>
            {sections.filter(s=>s.status!=='good').map(s=>(
              <div key={s.name} className="flex items-start gap-2 text-xs text-zinc-600">
                <Info size={12} className="text-amber-500 shrink-0 mt-0.5"/>
                <span><span className="font-medium text-zinc-800">{s.name}:</span> {s.tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing keywords */}
        {missing.length > 0 && (
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900">Missing keywords from job description</h3>
            <div className="flex flex-wrap gap-2">
              {missing.map(k=>(
                <span key={k} className="text-xs px-2.5 py-1 bg-red-50 border border-red-100 text-red-700 rounded-full">{k}</span>
              ))}
            </div>
            <p className="text-xs text-zinc-400">Add these naturally to your bullets — don&apos;t keyword-stuff.</p>
          </div>
        )}

        {/* Matched keywords */}
        {matched.length > 0 && (
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900">Keywords matched ✓</h3>
            <div className="flex flex-wrap gap-2">
              {matched.map(k=>(
                <span key={k} className="text-xs px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-black text-zinc-900">CV Reviewer</h2>
        <p className="text-xs text-zinc-400 mt-0.5">ATS score, keyword analysis & section-by-section feedback — instant, no API needed.</p>
      </div>

      {/* Upload */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2"><Upload size={14} className="text-blue-600"/>Upload your CV</h3>
        <div
          onDrop={handleDrop}
          onDragOver={e=>e.preventDefault()}
          onClick={()=>fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${fileName?'border-emerald-300 bg-emerald-50':'border-zinc-200 hover:border-blue-300 hover:bg-blue-50/30'}`}>
          {fileName
            ? <><CheckCircle size={28} className="text-emerald-500"/><p className="text-sm font-medium text-emerald-700">{fileName} uploaded</p></>
            : <><FileText size={28} className="text-zinc-300"/><p className="text-sm font-medium text-zinc-600">Drop your CV here or click to browse</p><p className="text-xs text-zinc-400">PDF, DOCX, or TXT · max 5 MB</p></>}
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden"
            onChange={e=>{ if(e.target.files?.[0]) handleFile(e.target.files[0]); }}/>
        </div>

        {/* Or paste text */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-400 text-center">— or paste CV text —</p>
          <textarea value={cvText} onChange={e=>{ setCvText(e.target.value); if(e.target.value) setFileName('Pasted text'); }}
            placeholder="Paste your CV content here..."
            rows={4}
            className="w-full text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
        </div>
      </div>

      {/* JD */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <AlignLeft size={14} className="text-blue-600"/>Job description
          <span className="text-[10px] text-zinc-400">(optional — improves ATS scoring)</span>
        </h3>
        <textarea value={jd} onChange={e=>setJd(e.target.value)} placeholder="Paste the full job description here..."
          rows={5}
          className="w-full text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
      </div>

      <button onClick={handleAnalyze} disabled={!cvText||analyzing}
        className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-40">
        {analyzing?<><RefreshCw size={15} className="animate-spin"/>Analysing…</>:<><Search size={15}/>Analyse my CV</>}
      </button>
    </div>
  );
}
