"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Video, Zap, User, Target, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import InterviewRoom, { type InterviewConfig } from '@/components/interview/InterviewRoom';
import HistoryPanel from '@/components/history/HistoryPanel';
import CVReviewer from '@/components/cv/CVReviewer';
import CVBuilder from '@/components/cv/CVBuilder';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import JobTracker from '@/components/job-tracker/JobTracker';

type View = "dashboard" | "interview" | "history" | "cv-review" | "cv-builder" | "cover-letter" | "job-tracker";

const VIEW_LABELS: Record<View, string> = {
  dashboard:      'Overview',
  interview:      'Interview Room',
  history:        'History',
  'cv-review':    'CV Reviewer',
  'cv-builder':   'CV Builder',
  'cover-letter': 'Cover Letter',
  'job-tracker':  'Job Tracker',
};

// ─── Interview setup modal ────────────────────────────────────────────────────
const TYPES = [
  { id:'technical',  label:'Technical',  icon:<Zap size={16}/>,      sub:'Coding, algorithms, system design' },
  { id:'behavioral', label:'Behavioral', icon:<User size={16}/>,      sub:'STAR method, soft skills, culture fit' },
  { id:'mixed',      label:'Mixed',      icon:<Target size={16}/>,    sub:'Both technical and behavioral' },
  { id:'case-study', label:'Case Study', icon:<BarChart2 size={16}/>, sub:'Problem-solving, business cases' },
] as const;

const LEVELS  = ['junior','mid','senior','lead'] as const;
const Q_COUNTS = [5, 8, 10, 12, 15] as const;

function SetupModal({
  onStart, onClose,
}: {
  onStart: (cfg: InterviewConfig) => void;
  onClose: () => void;
}) {
  const [field, setField]   = useState('Software Engineering');
  const [type,  setType]    = useState<typeof TYPES[number]['id']>('technical');
  const [level, setLevel]   = useState<typeof LEVELS[number]>('mid');
  const [qCount, setQCount] = useState(8);

  function handleStart() {
    onStart({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Interview — ${field}`,
      field,
      type:  type as any,
      level: level as any,
      questionCount: qCount,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-black text-zinc-900">Set up your interview</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Configure before going live with Jordan</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-all">
            <X size={16}/>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Field / role */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Role / Field</label>
            <input value={field} onChange={e=>setField(e.target.value)}
              placeholder="e.g. Software Engineering, Product Management, Data Science..."
              className="w-full text-sm border border-zinc-200 rounded-xl px-3.5 py-2.5 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400 transition-all"/>
          </div>

          {/* Interview type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Interview type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    type === t.id
                      ? 'border-zinc-900 bg-zinc-950 text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}>
                  <span className={`mt-0.5 shrink-0 ${type === t.id ? 'text-white' : 'text-zinc-400'}`}>{t.icon}</span>
                  <div>
                    <p className="text-xs font-semibold">{t.label}</p>
                    <p className={`text-[10px] mt-0.5 ${type === t.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{t.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Level + Q count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Experience level</label>
              <div className="flex gap-1.5 flex-wrap">
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${
                      level === l ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Number of questions</label>
              <div className="flex gap-1.5">
                {Q_COUNTS.map(n => (
                  <button key={n} onClick={() => setQCount(n)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                      qCount === n ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-100 transition-all">
            Cancel
          </button>
          <button onClick={handleStart} disabled={!field.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-40">
            <Video size={14}/> Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showSetup, setShowSetup]     = useState(false);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);

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

  function handleLaunchInterview() {
    setShowSetup(true);
  }

  function handleSetupConfirm(cfg: InterviewConfig) {
    setInterviewConfig(cfg);
    setShowSetup(false);
    setCurrentView("interview");
  }

  return (
    <div className="flex h-screen w-screen bg-[#F9F8F6] text-zinc-900 overflow-hidden font-sans antialiased">
      <Sidebar currentView={currentView} onViewChange={v => setCurrentView(v as View)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-zinc-200/60 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Intervue.ai</span>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-medium text-zinc-700">{VIEW_LABELS[currentView]}</span>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <span className="text-xs text-zinc-500">
                Welcome back, <span className="font-semibold text-zinc-800">{profile.name.split(' ')[0]}</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              Connected
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentView === "dashboard"    && <StatsOverview onLaunchInterview={handleLaunchInterview}/>}
          {currentView === "interview"    && (
            <InterviewRoom
              config={interviewConfig ?? undefined}
              onBack={() => setCurrentView("dashboard")}
            />
          )}
          {currentView === "history"      && <HistoryPanel/>}
          {currentView === "cv-review"    && <CVReviewer/>}
          {currentView === "cv-builder"   && <CVBuilder/>}
          {currentView === "cover-letter" && <CoverLetterGenerator/>}
          {currentView === "job-tracker"  && <JobTracker/>}
        </div>
      </div>

      {/* Setup modal */}
      {showSetup && (
        <SetupModal
          onStart={handleSetupConfirm}
          onClose={() => setShowSetup(false)}
        />
      )}
    </div>
  );
}
