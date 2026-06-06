'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Radio, Mic, TrendingUp, Clock, Flame, ArrowRight,
  Zap, User, BarChart2, Target, Star, AlertCircle, Video,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeInterviews, type InterviewDoc } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDuration(sec: number | null): string {
  if (!sec) return '—';
  const m = Math.round(sec / 60);
  return `${m} min`;
}

function relativeDate(ts: Timestamp | null | undefined): string {
  if (!ts) return '';
  const d = ts.toDate();
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays}d ago`;
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
}

/** Count how many consecutive days ending today have at least 1 completed interview */
function calcStreak(interviews: InterviewDoc[]): number {
  if (!interviews.length) return 0;
  const completed = interviews.filter(i => i.status === 'completed' && i.completedAt);
  if (!completed.length) return 0;

  const daySet = new Set(
    completed.map(i => {
      const d = (i.completedAt as Timestamp).toDate();
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (daySet.has(key)) { streak++; } else if (i > 0) { break; }
  }
  return streak;
}

const LEVEL_COLORS: Record<string, { bg:string; text:string }> = {
  junior: { bg:'bg-emerald-50 border-emerald-200', text:'text-emerald-700' },
  mid:    { bg:'bg-blue-50 border-blue-200',        text:'text-blue-700'   },
  senior: { bg:'bg-violet-50 border-violet-200',    text:'text-violet-700' },
  lead:   { bg:'bg-amber-50 border-amber-200',      text:'text-amber-700'  },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  technical:    Zap,
  behavioral:   User,
  mixed:        Target,
  'case-study': BarChart2,
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color, trend }: {
  label:string; value:string; sub:string;
  icon:React.ReactNode; color:string; trend?: number;
}) {
  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
        {trend !== undefined && trend > 0 && (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            +{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-black text-zinc-900">{value}</p>
        <p className="text-xs text-zinc-400 mt-0.5 font-normal">{sub}</p>
      </div>
      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ─── Mini interview row ───────────────────────────────────────────────────────
function RecentRow({ iv, onStart }: { iv: InterviewDoc; onStart: () => void }) {
  const lc   = LEVEL_COLORS[iv.level] ?? LEVEL_COLORS.mid;
  const Icon = TYPE_ICONS[iv.type] ?? Zap;
  const scoreColor = (iv.score ?? 0) >= 80 ? 'text-emerald-600' : (iv.score ?? 0) >= 65 ? 'text-blue-600' : 'text-amber-600';

  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl px-4 py-3.5 flex items-center gap-4 hover:shadow-sm transition-all">
      {/* Score ring / icon */}
      <div className="shrink-0">
        {iv.score != null ? (
          <div className="relative w-11 h-11">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="17" fill="none" stroke="#f1f5f9" strokeWidth="4"/>
              <circle cx="22" cy="22" r="17" fill="none"
                stroke={(iv.score)>=80?'#22c55e':(iv.score)>=65?'#3b82f6':'#f59e0b'}
                strokeWidth="4"
                strokeDasharray={`${(iv.score/100)*(2*Math.PI*17)} ${2*Math.PI*17}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"/>
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${scoreColor}`}>{iv.score}</span>
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Video size={16} className="text-blue-500"/>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-zinc-900 truncate">{iv.title}</p>
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border capitalize shrink-0 ${lc.bg} ${lc.text}`}>{iv.level}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1 capitalize"><Icon size={10}/>{iv.type}</span>
          <span>·</span><span>{iv.questionCount}Q</span>
          {iv.duration && <><span>·</span><span className="flex items-center gap-0.5"><Clock size={9}/>{fmtDuration(iv.duration)}</span></>}
          <span>·</span><span>{relativeDate(iv.completedAt ?? iv.createdAt)}</span>
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {iv.status === 'ready' ? (
          <button onClick={onStart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all">
            Start
          </button>
        ) : (
          <span className="text-[10px] text-zinc-400 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full capitalize">{iv.status}</span>
        )}
      </div>
    </div>
  );
}

// ─── Score chart — built from real data ──────────────────────────────────────
function ScoreChart({ interviews }: { interviews: InterviewDoc[] }) {
  const points = useMemo(() => {
    const sorted = [...interviews]
      .filter(i => i.status === 'completed' && i.score != null && (i.completedAt ?? i.createdAt))
      .sort((a, b) => {
        const aTs = (a.completedAt ?? a.createdAt) as Timestamp;
        const bTs = (b.completedAt ?? b.createdAt) as Timestamp;
        return aTs.toMillis() - bTs.toMillis();
      })
      .slice(-8); // last 8 sessions

    return sorted.map(i => ({
      score: i.score!,
      label: relativeDate(i.completedAt ?? i.createdAt),
    }));
  }, [interviews]);

  if (points.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-xs text-zinc-400">
        Complete at least 2 interviews to see your progression
      </div>
    );
  }

  // Map scores to SVG y coords (score 0=bottom, 100=top in 0..100 range → y inverted)
  const W = 400, H = 100;
  const xStep = W / (points.length - 1);
  const coords = points.map((p, i) => ({
    x: i * xStep,
    y: H - (p.score / 100) * H,
    ...p,
  }));

  const polylinePoints = coords.map(c => `${c.x},${c.y}`).join(' ');
  const areaPoints     = `0,${H} ${polylinePoints} ${W},${H}`;

  return (
    <>
      <div className="relative h-32">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={H-(y/100)*H} x2={W} y2={H-(y/100)*H} stroke="#f4f4f5" strokeWidth="1"/>
          ))}
          <polygon points={areaPoints} fill="url(#scoreGrad)"/>
          <polyline points={polylinePoints} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {coords.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="#2563eb"/>
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-[9px] text-zinc-400 mt-1">
        {coords.map((c, i) => <span key={i}>{c.label}</span>)}
      </div>
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function FirstTimeState({ onLaunch, name }: { onLaunch: () => void; name: string }) {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-zinc-950 rounded-2xl p-8 flex items-center justify-between relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-full opacity-5 pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-white -translate-y-1/2 translate-x-1/4"/>
        </div>
        <div className="relative z-10 space-y-2">
          <p className="text-zinc-400 text-xs">Welcome, {name} 👋</p>
          <h2 className="text-white text-2xl font-black">Let&apos;s ace your next interview</h2>
          <p className="text-zinc-500 text-sm max-w-sm">
            Your stats, scores, and progress will appear here after your first session.
          </p>
        </div>
        <button onClick={onLaunch}
          className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all shrink-0 relative z-10">
          <Radio size={14} className="animate-pulse text-blue-600"/> Start Interview
        </button>
      </div>

      {/* Quick start cards */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-3">Jump straight in</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label:'Technical Interview',  sub:'Coding & system design',  icon:<Zap size={18}/>,    color:'bg-blue-50 border-blue-200 text-blue-700' },
            { label:'Behavioral Interview', sub:'STAR method & soft skills',icon:<User size={18}/>,   color:'bg-violet-50 border-violet-200 text-violet-700' },
            { label:'Mixed Round',          sub:'Technical + behavioral',   icon:<Target size={18}/>, color:'bg-amber-50 border-amber-200 text-amber-700' },
            { label:'Case Study',           sub:'Problem-solving scenarios',icon:<BarChart2 size={18}/>,color:'bg-emerald-50 border-emerald-200 text-emerald-700' },
          ].map(q => (
            <button key={q.label} onClick={onLaunch}
              className={`flex items-start gap-3 p-4 rounded-2xl border transition-all hover:shadow-sm text-left ${q.color}`}>
              <div className="mt-0.5">{q.icon}</div>
              <div>
                <p className="text-sm font-semibold">{q.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{q.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StatsOverview({ onLaunchInterview }: { onLaunchInterview: () => void }) {
  const { user, profile } = useAuth();
  const [interviews, setInterviews] = useState<InterviewDoc[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!user) return;
    return subscribeInterviews(user.uid, data => {
      setInterviews(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-zinc-100 rounded-2xl animate-pulse"/>
        <div className="grid grid-cols-4 gap-4">
          {Array(4).fill(0).map((_,i) => <div key={i} className="h-28 bg-zinc-100 rounded-2xl animate-pulse"/>)}
        </div>
      </div>
    );
  }

  const firstName = profile?.name?.split(' ')[0] ?? 'there';
  const completed = interviews.filter(i => i.status === 'completed');

  if (completed.length === 0) {
    return <FirstTimeState onLaunch={onLaunchInterview} name={firstName}/>;
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalSessions = interviews.length;
  const avgScore = Math.round(completed.reduce((a, i) => a + (i.score ?? 0), 0) / completed.length);
  const totalSeconds = completed.reduce((a, i) => a + (i.duration ?? 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);
  const streak = calcStreak(interviews);

  const bestSession  = completed.reduce((b, i) => (i.score ?? 0) > (b.score ?? 0) ? i : b, completed[0]);
  const worstSession = completed.reduce((w, i) => (i.score ?? 100) < (w.score ?? 100) ? i : w, completed[0]);

  const recent = interviews.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-zinc-950 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-5 pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/4"/>
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-zinc-400 text-xs">Welcome back, {firstName}</p>
          <h2 className="text-white text-xl font-black">Ready to practice today?</h2>
          <p className="text-zinc-500 text-xs">
            Your avg score is <span className="text-white font-semibold">{avgScore}%</span>
            {avgScore >= 80 ? ' — excellent work! 🔥' : avgScore >= 65 ? ' — keep pushing.' : ' — let\'s improve.'}
          </p>
        </div>
        <button onClick={onLaunchInterview}
          className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all shrink-0 relative z-10">
          <Radio size={14} className="animate-pulse text-blue-600"/> New Interview
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Sessions"  value={String(totalSessions)} sub="Since joining"
          icon={<Mic size={16} className="text-blue-600"/>} color="bg-blue-50"/>
        <StatCard label="Average Score"   value={`${avgScore}%`}        sub="All completed"
          icon={<TrendingUp size={16} className="text-emerald-600"/>} color="bg-emerald-50"
          trend={avgScore >= 80 ? 8 : undefined}/>
        <StatCard label="Hours Practiced" value={`${totalHours}h`}      sub="Total time"
          icon={<Clock size={16} className="text-violet-600"/>} color="bg-violet-50"/>
        <StatCard label="Current Streak"  value={streak > 0 ? `${streak}d` : '—'} sub={streak > 0 ? "Keep it going!" : "Start today"}
          icon={<Flame size={16} className="text-orange-500"/>} color="bg-orange-50"/>
      </div>

      {/* Score chart + highlights */}
      <div className="grid grid-cols-3 gap-4">
        {/* Highlights */}
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900">Performance highlights</h3>

          {/* Best */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-emerald-50 border-emerald-100">
            <div className="flex items-center gap-2 text-xs text-emerald-800">
              <Star size={13} fill="currentColor" className="text-emerald-500"/>Best session
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-emerald-900 max-w-[100px] truncate">{bestSession.title}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">{bestSession.score}%</p>
            </div>
          </div>

          {/* Needs work */}
          {worstSession.id !== bestSession.id && (
            <div className="flex items-center justify-between p-3 rounded-xl border bg-amber-50 border-amber-100">
              <div className="flex items-center gap-2 text-xs text-amber-800">
                <AlertCircle size={13} className="text-amber-500"/>Needs work
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-amber-900 max-w-[100px] truncate">{worstSession.title}</p>
                <p className="text-[10px] text-amber-600 font-semibold">{worstSession.score}%</p>
              </div>
            </div>
          )}

          {/* Completed count */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-blue-50 border-blue-100">
            <div className="flex items-center gap-2 text-xs text-blue-800">
              <TrendingUp size={13} className="text-blue-500"/>Completed
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-blue-900">{completed.length} sessions</p>
              <p className="text-[10px] text-blue-600">{totalHours}h total</p>
            </div>
          </div>
        </div>

        {/* Score progression */}
        <div className="col-span-2 bg-white border border-zinc-200/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-900">Score progression</h3>
            <span className="text-[10px] text-zinc-400">Last {Math.min(completed.length, 8)} sessions</span>
          </div>
          <ScoreChart interviews={interviews}/>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Recent sessions</h3>
          <span className="text-xs text-zinc-400">{totalSessions} total</span>
        </div>
        <div className="space-y-2">
          {recent.map(iv => (
            <RecentRow key={iv.id} iv={iv} onStart={onLaunchInterview}/>
          ))}
        </div>
      </div>

      {/* Quick practice */}
      <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900">Quick practice</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label:'Technical',  icon:<Zap size={13}/>,        color:'bg-blue-50 text-blue-700 border-blue-100' },
            { label:'Behavioral', icon:<User size={13}/>,        color:'bg-violet-50 text-violet-700 border-violet-100' },
            { label:'Case Study', icon:<BarChart2 size={13}/>,   color:'bg-amber-50 text-amber-700 border-amber-100' },
            { label:'Mixed',      icon:<Target size={13}/>,      color:'bg-emerald-50 text-emerald-700 border-emerald-100' },
          ].map(q => (
            <button key={q.label} onClick={onLaunchInterview}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all hover:shadow-sm ${q.color}`}>
              {q.icon}{q.label}
            </button>
          ))}
        </div>
        <button onClick={onLaunchInterview}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-all">
          <Radio size={12} className="animate-pulse"/> Custom interview setup
        </button>
      </div>
    </div>
  );
}
