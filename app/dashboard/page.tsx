"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Video, Zap, User, Target, BarChart2, Globe, Lock, Crown, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { SECTOR_PACKS, type SectorPack } from '@/lib/sectorPacks';
import Sidebar from '@/components/Sidebar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import InterviewRoom, { type InterviewConfig } from '@/components/interview/InterviewRoom';
import HistoryPanel from '@/components/history/HistoryPanel';
import CVReviewer from '@/components/cv/CVReviewer';
import CVBuilder from '@/components/cv/CVBuilder';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import JobTracker from '@/components/job-tracker/JobTracker';
import PricingPage from '@/components/premium/PricingPage';
import UpgradeModal from '@/components/premium/UpgradeModal';

type View = "dashboard"|"interview"|"history"|"cv-review"|"cv-builder"|"cover-letter"|"job-tracker"|"pricing";
type Lang = 'en' | 'fr';

const VIEW_LABELS: Record<View, { en: string; fr: string }> = {
  dashboard:      { en:'Overview',      fr:'Tableau de bord' },
  interview:      { en:'Interview Room',fr:'Salle d\'entretien' },
  history:        { en:'History',       fr:'Historique' },
  'cv-review':    { en:'CV Reviewer',   fr:'Révision CV' },
  'cv-builder':   { en:'CV Builder',    fr:'Créateur de CV' },
  'cover-letter': { en:'Cover Letter',  fr:'Lettre de motivation' },
  'job-tracker':  { en:'Job Tracker',   fr:'Suivi des candidatures' },
  'pricing':      { en:'Upgrade',       fr:'Abonnement' },
};

const INTERVIEW_TYPES = [
  { id:'technical',  en:'Technical',  fr:'Technique',        icon:<Zap size={15}/>,      sub:{en:'Algorithms & system design',fr:'Algorithmes & systèmes'} },
  { id:'behavioral', en:'Behavioral', fr:'Comportemental',   icon:<User size={15}/>,      sub:{en:'STAR & soft skills',fr:'STAR & compétences douces'} },
  { id:'mixed',      en:'Mixed',      fr:'Mixte',            icon:<Target size={15}/>,    sub:{en:'Technical + behavioral',fr:'Technique + comportemental'} },
  { id:'case-study', en:'Case Study', fr:'Étude de cas',     icon:<BarChart2 size={15}/>, sub:{en:'Problem solving',fr:'Résolution de problèmes'} },
] as const;

const LEVELS: { id: string; en: string; fr: string }[] = [
  { id:'junior', en:'Junior',  fr:'Junior'  },
  { id:'mid',    en:'Mid',     fr:'Confirmé'},
  { id:'senior', en:'Senior',  fr:'Senior'  },
  { id:'lead',   en:'Lead',    fr:'Lead'    },
];

const Q_COUNTS = [5, 8, 10, 12, 15] as const;

// ─── Language toggle ──────────────────────────────────────────────────────────
function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <button
      onClick={() => onChange(lang === 'en' ? 'fr' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-all"
      title="Switch language / Changer de langue"
    >
      <Globe size={13}/>
      {lang === 'en' ? '🇬🇧 EN → FR' : '🇫🇷 FR → EN'}
    </button>
  );
}

// ─── Interview setup modal ────────────────────────────────────────────────────
function SetupModal({ lang, onStart, onClose }: {
  lang: Lang;
  onStart: (cfg: InterviewConfig & { language: Lang; sectorId?: string }) => void;
  onClose: () => void;
}) {
  const { can, plan } = usePremium();
  const [field,    setField]    = useState('Software Engineering');
  const [type,     setType]     = useState<typeof INTERVIEW_TYPES[number]['id']>('technical');
  const [level,    setLevel]    = useState('mid');
  const [qCount,   setQCount]   = useState(8);
  const [selLang,  setSelLang]  = useState<Lang>(lang);
  const [sector,   setSector]   = useState<SectorPack | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isFr = selLang === 'fr';
  const t = (en: string, fr: string) => isFr ? fr : en;

  function handleSectorClick(sp: SectorPack) {
    if (sp.tier !== 'free' && !can('africanSectors')) {
      setShowUpgrade(true);
      return;
    }
    setSector(prev => prev?.id === sp.id ? null : sp);
    if (sp.id !== 'free') {
      setField(isFr ? sp.nameFr : sp.nameEn);
    }
  }

  function handleLangChange(l: Lang) {
    if (l === 'fr' && !can('frenchMode')) {
      setShowUpgrade(true);
      return;
    }
    setSelLang(l);
  }

  function handleStart() {
    onStart({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Interview — ${field}`,
      field, type: type as any, level: level as any, questionCount: qCount,
      language: selLang,
      sectorId: sector?.id,
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-black text-zinc-900">
                {t('Set up your interview', 'Configurer votre entretien')}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t('Configure then go live with Jordan', 'Configurez puis démarrez avec Jordan')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Language picker */}
              <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1">
                {(['en','fr'] as const).map(l => (
                  <button key={l} onClick={() => handleLangChange(l)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${selLang===l?'bg-white shadow-sm text-zinc-900':'text-zinc-500 hover:text-zinc-700'}`}>
                    {l === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
                    {l === 'fr' && !can('frenchMode') && <Lock size={9} className="text-zinc-400"/>}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-all"><X size={16}/></button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Sector packs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-700">
                  {t('Sector Pack', 'Pack sectoriel')}
                  <span className="text-zinc-400 font-normal ml-1">({t('optional', 'optionnel')})</span>
                </label>
                <span className="text-[10px] text-zinc-400">
                  {t('African sectors require Starter plan', 'Les secteurs africains nécessitent le plan Starter')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                {SECTOR_PACKS.map(sp => {
                  const isPremium = sp.tier !== 'free' && !can('africanSectors');
                  const isSelected = sector?.id === sp.id;
                  return (
                    <button key={sp.id} onClick={() => handleSectorClick(sp)}
                      className={`relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all text-xs ${
                        isSelected
                          ? `${sp.color.replace('bg-','bg-')} ${sp.borderColor} ring-2 ring-offset-1 ring-zinc-900`
                          : `${sp.color} ${sp.borderColor} hover:ring-1 hover:ring-zinc-300`
                      }`}>
                      {isPremium && (
                        <div className="absolute top-1.5 right-1.5">
                          <Crown size={9} className="text-amber-500"/>
                        </div>
                      )}
                      <span className="text-base mb-1">{sp.icon}</span>
                      <span className={`font-semibold leading-tight ${sp.textColor}`}>
                        {isFr ? sp.nameFr : sp.nameEn}
                      </span>
                      {sp.region === 'africa' && (
                        <span className="text-[9px] text-zinc-400 mt-0.5">🌍 Africa</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role/Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                {t('Role / Field', 'Poste / Domaine')}
              </label>
              <input value={field} onChange={e => setField(e.target.value)}
                placeholder={t('e.g. Software Engineer, Product Manager, Banking Officer...', 'ex. Ingénieur logiciel, Chef de produit, Chargé clientèle...')}
                className="w-full text-sm border border-zinc-200 rounded-xl px-3.5 py-2.5 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400 transition-all"/>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                {t('Interview type', 'Type d\'entretien')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {INTERVIEW_TYPES.map(it => (
                  <button key={it.id} onClick={() => setType(it.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      type === it.id ? 'border-zinc-900 bg-zinc-950 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}>
                    <span className={`mb-1 ${type===it.id?'text-white':'text-zinc-400'}`}>{it.icon}</span>
                    <span className="text-xs font-semibold">{isFr ? it.fr : it.en}</span>
                    <span className={`text-[10px] mt-0.5 ${type===it.id?'text-zinc-400':'text-zinc-400'}`}>{isFr ? it.sub.fr : it.sub.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level + Q count */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  {t('Experience level', 'Niveau d\'expérience')}
                </label>
                <div className="flex gap-1.5">
                  {LEVELS.map(l => (
                    <button key={l.id} onClick={() => setLevel(l.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        level === l.id ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                      }`}>
                      {isFr ? l.fr : l.en}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  {t('Questions', 'Questions')}
                </label>
                <div className="flex gap-1.5">
                  {Q_COUNTS.map(n => (
                    <button key={n} onClick={() => setQCount(n)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        qCount === n ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                      }`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected sector tips preview */}
            {sector && (
              <div className={`p-4 rounded-xl border ${sector.color} ${sector.borderColor} space-y-2`}>
                <p className={`text-xs font-semibold ${sector.textColor}`}>
                  {sector.icon} {isFr ? sector.nameFr : sector.nameEn} — {t('Interview tips', 'Conseils d\'entretien')}
                </p>
                {sector.tips.slice(0, 2).map((tip, i) => (
                  <p key={i} className="text-[11px] text-zinc-600">• {isFr ? tip.fr : tip.en}</p>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-100 transition-all">
              {t('Cancel', 'Annuler')}
            </button>
            <button onClick={handleStart} disabled={!field.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-40">
              <Video size={14}/>
              {selLang === 'fr' ? '🇫🇷 Commencer en français' : '🇬🇧 Start in English'}
            </button>
          </div>
        </div>
      </div>

      {showUpgrade && (
        <UpgradeModal
          featureName={can('africanSectors') ? 'French Mode' : 'African Sector Packs'}
          featureNameFr={can('africanSectors') ? 'Mode français' : 'Packs sectoriels africains'}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const { plan } = usePremium();
  const router = useRouter();

  const [currentView, setCurrentView]         = useState<View>("dashboard");
  const [lang, setLang]                       = useState<Lang>('en');
  const [showSetup, setShowSetup]             = useState(false);
  const [interviewConfig, setInterviewConfig] = useState<(InterviewConfig & { language: Lang }) | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/sign-in');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F9F8F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"/>
          <p className="text-xs text-zinc-500">Loading workspace…</p>
        </div>
      </div>
    );
  }

  const isFr = lang === 'fr';
  const vLabel = VIEW_LABELS[currentView];

  return (
    <div className="flex h-screen w-screen bg-[#F9F8F6] text-zinc-900 overflow-hidden font-sans antialiased">
      <Sidebar currentView={currentView} onViewChange={v => setCurrentView(v as View)} lang={lang}/>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-zinc-200/60 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Intervue.ai</span>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-medium text-zinc-700">{isFr ? vLabel.fr : vLabel.en}</span>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <span className="text-xs text-zinc-500">
                {isFr ? 'Bienvenue,' : 'Welcome back,'}{' '}
                <span className="font-semibold text-zinc-800">{profile.name.split(' ')[0]}</span>
              </span>
            )}
            {/* Plan badge */}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${
              plan === 'pro'     ? 'bg-violet-50 text-violet-700 border-violet-200' :
              plan === 'starter' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}>
              {plan === 'free' ? 'Free' : plan === 'starter' ? '⚡ Starter' : '👑 Pro'}
            </span>
            {/* Language toggle in header */}
            <LangToggle lang={lang} onChange={setLang}/>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              {isFr ? 'Connecté' : 'Connected'}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentView === "dashboard"    && <StatsOverview onLaunchInterview={() => setShowSetup(true)} />}
          {currentView === "interview"    && (
            <InterviewRoom
              config={interviewConfig ?? undefined}
              onBack={() => setCurrentView("dashboard")}
            />
          )}
          {currentView === "history"      && <HistoryPanel />}
          {currentView === "cv-review"    && <CVReviewer />}
          {currentView === "cv-builder"   && <CVBuilder />}
          {currentView === "cover-letter" && <CoverLetterGenerator />}
          {currentView === "job-tracker"  && <JobTracker />}
          {currentView === "pricing"      && <PricingPage/>}
        </div>
      </div>

      {showSetup && (
        <SetupModal
          lang={lang}
          onStart={cfg => { setInterviewConfig(cfg); setShowSetup(false); setCurrentView("interview"); }}
          onClose={() => setShowSetup(false)}
        />
      )}
    </div>
  );
}
