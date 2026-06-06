'use client';

import React, { useState, useEffect } from 'react';
import { Zap, User, Target, BarChart2, Video, Filter, TrendingUp, Clock, Trophy, AlertCircle, CalendarDays } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeInterviews, type InterviewDoc } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const m = Math.round(seconds / 60);
  return m < 1 ? '<1 min' : `${m} min`;
}

function fmtDate(ts: Timestamp | null | undefined): string {
  if (!ts) return '—';
  const d = ts.toDate();
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays}d ago`;
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

const LEVEL_COLORS: Record<string, { bg:string; text:string }> = {
  junior: { bg:'bg-emerald-50 border-emerald-200', text:'text-emerald-700' },
  mid:    { bg:'bg-blue-50   border-blue-200',     text:'text-blue-700'    },
  senior: { bg:'bg-violet-50 border-violet-200',   text:'text-violet-700'  },
  lead:   { bg:'bg-amber-50  border-amber-200',    text:'text-amber-700'   },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  technical:    Zap,
  behavioral:   User,
  mixed:        Target,
  'case-study': BarChart2,
};

const TYPE_FILTERS = ['All', 'technical', 'behavioral', 'mixed', 'case-study'] as const;
type Filter = typeof TYPE_FILTERS[number];

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 65 ? 'bg-blue-500' : 'bg-amber-500';
  const text  = score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-blue-600' : 'text-amber-600';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${text}`}>{score}%</span>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label:string; value:string; sub:string; color:string }) {
  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-4">
      <p className="text-[10px] text-zinc-400 uppercase tracking-wide font-medium">{label}</p>
      <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
      <p className="text-[10px] text-zinc-400 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onStart }: { onStart?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <Video size={28} className="text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-900">No sessions yet</p>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs">
          Complete your first interview to see your history, scores, and progress here.
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HistoryPanel() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<InterviewDoc[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<Filter>('All');

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
        <div className="h-8 w-48 bg-zinc-100 rounded-xl animate-pulse" />
        <div className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="px-5 py-4 border-b border-zinc-100 flex gap-4">
              <div className="flex-1 h-4 bg-zinc-100 rounded animate-pulse" />
              <div className="w-16 h-4 bg-zinc-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const completed = interviews.filter(i => i.status === 'completed');
  const filtered  = filter === 'All' ? completed : completed.filter(i => i.type === filter);

  // ── Computed stats ────────────────────────────────────────────────────────
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, i) => a + (i.score ?? 0), 0) / completed.length)
    : 0;

  const bestSession = completed.length
    ? completed.reduce((best, i) => (i.score ?? 0) > (best.score ?? 0) ? i : best, completed[0])
    : null;

  const worstSession = completed.length
    ? completed.reduce((worst, i) => (i.score ?? 100) < (worst.score ?? 100) ? i : worst, completed[0])
    : null;

  const avgDurationMin = completed.length
    ? Math.round(completed.reduce((a, i) => a + (i.duration ?? 0), 0) / completed.length / 60)
    : 0;

  const totalHours = (completed.reduce((a, i) => a + (i.duration ?? 0), 0) / 3600).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900">Interview History</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {completed.length} completed sessions
            {completed.length > 0 && ` · avg ${avgScore}%`}
          </p>
        </div>

        {completed.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-zinc-400" />
            {TYPE_FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all capitalize ${
                  filter === f
                    ? 'bg-zinc-950 text-white border-zinc-950 font-medium'
                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                }`}>
                {f === 'All' ? 'All' : f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      {completed.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Best score"     value={bestSession ? `${bestSession.score ?? 0}%` : '—'} sub={bestSession?.field ?? '—'} color="text-emerald-600"/>
          <StatCard label="Average score"  value={completed.length ? `${avgScore}%` : '—'} sub="All sessions" color="text-blue-600"/>
          <StatCard label="Avg duration"   value={avgDurationMin ? `${avgDurationMin} min` : '—'} sub="Per session" color="text-violet-600"/>
          <StatCard label="Total practice" value={`${totalHours}h`} sub={`${completed.length} sessions`} color="text-amber-600"/>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-zinc-100 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            <div className="col-span-4">Session</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1">Level</div>
            <div className="col-span-1 text-center">Qs</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-1">Date</div>
          </div>

          {filtered.map((iv, idx) => {
            const lc  = LEVEL_COLORS[iv.level] ?? LEVEL_COLORS.mid;
            const Icon = TYPE_ICONS[iv.type] ?? Zap;
            const scoreVal = iv.score ?? 0;

            return (
              <div key={iv.id}
                className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-zinc-50/60 transition-colors ${
                  idx < filtered.length - 1 ? 'border-b border-zinc-100' : ''
                }`}>

                {/* Title + field */}
                <div className="col-span-4 min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 truncate">{iv.title}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{iv.field}</p>
                </div>

                {/* Type */}
                <div className="col-span-2">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 capitalize">
                    <Icon size={11} className="shrink-0" />{iv.type}
                  </span>
                </div>

                {/* Level badge */}
                <div className="col-span-1">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border capitalize ${lc.bg} ${lc.text}`}>
                    {iv.level}
                  </span>
                </div>

                {/* Question count */}
                <div className="col-span-1 text-center text-xs text-zinc-500">{iv.questionCount}</div>

                {/* Duration */}
                <div className="col-span-1 text-xs text-zinc-500">{fmtDuration(iv.duration)}</div>

                {/* Score bar */}
                <div className="col-span-2">
                  <ScoreBar score={scoreVal} />
                </div>

                {/* Date */}
                <div className="col-span-1 text-[10px] text-zinc-400 whitespace-nowrap">
                  {fmtDate(iv.completedAt ?? iv.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Performance highlights — only when data exists */}
      {completed.length >= 2 && (
        <div className="grid grid-cols-3 gap-4">
          {/* Best */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Trophy size={16} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">Best session</p>
              <p className="text-xs font-semibold text-emerald-900 truncate mt-0.5">{bestSession?.title ?? '—'}</p>
              <p className="text-sm font-black text-emerald-600">{bestSession?.score ?? 0}%</p>
            </div>
          </div>

          {/* Needs work */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle size={16} className="text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Needs work</p>
              <p className="text-xs font-semibold text-amber-900 truncate mt-0.5">{worstSession?.title ?? '—'}</p>
              <p className="text-sm font-black text-amber-600">{worstSession?.score ?? 0}%</p>
            </div>
          </div>

          {/* Total hours */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <CalendarDays size={16} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide">Total practice</p>
              <p className="text-xs font-semibold text-blue-900 mt-0.5">{completed.length} sessions completed</p>
              <p className="text-sm font-black text-blue-600">{totalHours}h practiced</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state for first-time user */}
      {completed.length === 0 && <EmptyState />}
    </div>
  );
}
