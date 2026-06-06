'use client';

import React, { useMemo, useRef } from 'react';
import {
  CheckCircle, AlertCircle, TrendingUp, Clock, MessageSquare,
  Star, Download, RotateCcw, Home, Award, ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SessionData {
  config: {
    title:         string;
    field:         string;
    type:          string;
    level:         string;
    questionCount: number;
  };
  durationSec: number;
  userAnswers:    string[];   // each item = one spoken answer from the user
  avatarQuestions: string[];  // each item = one question from the avatar
  startedAt:      Date;
}

interface Dimension {
  label:  string;
  score:  number;           // 0–100
  badge:  'excellent' | 'good' | 'needs work';
  tips:   string[];
  desc:   string;
}

// ─── STAR / scoring engine ────────────────────────────────────────────────────
function analyze(data: SessionData): { overall: number; dimensions: Dimension[]; highlights: string[]; improvements: string[] } {
  const allAnswers = data.userAnswers.join(' ').toLowerCase();
  const wordCount  = allAnswers.split(/\s+/).filter(Boolean).length;

  // ── STAR component detection ────────────────────────────────────────────────
  const starPatterns = {
    situation: /\b(when i was|at my (previous|last|current)|while working|in \d{4}|during|at (google|amazon|microsoft|my (company|job|role|team|project))|i was (working|employed|a))\b/i,
    task:      /\b(i (was responsible|needed to|had to|was tasked|was asked)|my (goal|objective|task|role) was|the (challenge|problem|issue) was|i (needed|had) to (ensure|make sure|deliver|complete))\b/i,
    action:    /\b(i (decided|chose|implemented|built|created|developed|designed|led|managed|introduced|proposed|wrote|refactored|fixed|deployed|launched|optimised|optimized|coordinated|established|initiated))\b/gi,
    result:    /\b(which (resulted|led) in|increased|decreased|reduced|improved|saved|achieved|successfully|by \d+%|from .* to .*|the (outcome|result|impact) was|\d+[x%]|x faster|more (efficient|accurate|reliable))\b/i,
  };

  const hasSituation = starPatterns.situation.test(allAnswers);
  const hasTask      = starPatterns.task.test(allAnswers);
  const actionMatches = (allAnswers.match(starPatterns.action) || []).length;
  const hasResult    = starPatterns.result.test(allAnswers);

  const starScore = Math.min(100, Math.round(
    (hasSituation ? 25 : 0) +
    (hasTask      ? 25 : 0) +
    Math.min(25, actionMatches * 6) +
    (hasResult    ? 25 : 0)
  ));

  // ── Communication ────────────────────────────────────────────────────────────
  const avgAnswerLen = wordCount / Math.max(data.userAnswers.length, 1);
  const hasFillers   = (allAnswers.match(/\b(um+|uh+|like,|you know|basically|literally|kind of|sort of)\b/gi) || []).length;
  const fillerRatio  = hasFillers / Math.max(wordCount, 1);
  const commScore    = Math.min(100, Math.round(
    Math.min(40, (avgAnswerLen / 80) * 40) +        // ideal ~80 words/answer
    Math.min(30, (1 - fillerRatio * 10) * 30) +     // fewer fillers = better
    (data.userAnswers.length >= 3 ? 30 : data.userAnswers.length * 10)
  ));

  // ── Confidence ────────────────────────────────────────────────────────────────
  const positiveMarkers = (allAnswers.match(/\b(i am|i have|i can|i did|i built|i led|i created|i know|i understand|i believe|confident|experience|expertise|strong|excellent|proven)\b/gi) || []).length;
  const hedgeMarkers    = (allAnswers.match(/\b(i think|i guess|maybe|perhaps|not sure|i don't know|possibly|kind of|sort of|might)\b/gi) || []).length;
  const confScore       = Math.min(100, Math.max(20, Math.round(
    50 + (positiveMarkers * 5) - (hedgeMarkers * 8)
  )));

  // ── Technical depth (for technical interviews) ────────────────────────────────
  const techTerms = (allAnswers.match(/\b(api|database|algorithm|complexity|o\(|cache|latency|throughput|sql|nosql|react|typescript|python|kubernetes|docker|microservice|rest|graphql|async|thread|process|memory|cpu|scalab|deploy|ci.?cd|test|debug|refactor|architecture|design pattern|solid|mvc|oop|functional|recursion|data structure|tree|graph|hash|sort|search|binary|linked list|stack|queue|heap|array)\b/gi) || []).length;
  const techScore = Math.min(100, Math.round(
    data.config.type === 'behavioral' ? 50 :        // less relevant for behavioral
    Math.min(100, 20 + techTerms * 8)
  ));

  // ── Overall (weighted) ─────────────────────────────────────────────────────────
  const weights = data.config.type === 'technical'
    ? [0.30, 0.25, 0.25, 0.20]   // STAR, comm, tech, conf
    : [0.35, 0.30, 0.15, 0.20];  // STAR, comm, tech, conf

  const overall = Math.round(
    starScore  * weights[0] +
    commScore  * weights[1] +
    techScore  * weights[2] +
    confScore  * weights[3]
  );

  // ── Badges ─────────────────────────────────────────────────────────────────
  const badge = (s: number): 'excellent' | 'good' | 'needs work' =>
    s >= 80 ? 'excellent' : s >= 55 ? 'good' : 'needs work';

  // ── Tips ──────────────────────────────────────────────────────────────────────
  const starTips: string[] = [];
  if (!hasSituation) starTips.push('Open with context: "At my previous role at [company], when [situation]..."');
  if (!hasTask)      starTips.push('State your specific responsibility: "I was tasked with / responsible for..."');
  if (actionMatches < 3) starTips.push('Use strong action verbs: "I designed, implemented, led, reduced..."');
  if (!hasResult)    starTips.push('Always close with measurable impact: "which reduced load time by 40%"');
  if (starTips.length === 0) starTips.push('Excellent STAR structure — continue using this framework consistently.');

  const commTips: string[] = [];
  if (avgAnswerLen < 30)  commTips.push('Give more detailed answers — aim for 60–100 words per response.');
  if (avgAnswerLen > 200) commTips.push('Be more concise — interviewers prefer focused, structured answers.');
  if (fillerRatio > 0.05) commTips.push('Reduce filler words (um, like, you know) — pause and breathe instead.');
  if (commTips.length === 0) commTips.push('Communication was clear and well-paced. Keep it up.');

  const confTips: string[] = [];
  if (hedgeMarkers > 3) confTips.push('Replace hedging ("I think/guess") with assertive language ("I know/believe/have experience with").');
  if (positiveMarkers < 2) confTips.push('State your strengths directly — don\'t undersell your experience.');
  if (confTips.length === 0) confTips.push('You projected confidence well throughout the interview.');

  const techTips: string[] = [];
  if (data.config.type !== 'behavioral' && techTerms < 3) {
    techTips.push('Use technical terminology precisely to demonstrate domain depth.');
    techTips.push('Back claims with specific technologies, patterns, or metrics.');
  }
  if (techTips.length === 0) techTips.push('Good use of technical language relevant to the role.');

  // ── Highlights & improvements ─────────────────────────────────────────────────
  const highlights: string[] = [];
  const improvements: string[] = [];

  if (starScore  >= 75) highlights.push('Strong STAR structure — answers are well-organised with clear context and outcomes.');
  if (commScore  >= 75) highlights.push('Clear, confident communication — good pacing and articulation.');
  if (confScore  >= 75) highlights.push('Projected confidence — used assertive language and specific examples.');
  if (techScore  >= 75 && data.config.type !== 'behavioral') highlights.push('Demonstrated solid technical depth with specific terminology.');
  if (hasResult)        highlights.push('Quantified results mentioned — this greatly impresses interviewers.');
  if (actionMatches >= 4) highlights.push('Used strong action verbs throughout — shows ownership and initiative.');

  if (starScore  < 55) improvements.push('Work on STAR structure — practice answering with Situation, Task, Action, Result.');
  if (commScore  < 55) improvements.push('Develop longer, more structured answers — use the "30-second rule" per point.');
  if (confScore  < 55) improvements.push('Practice confident delivery — record yourself and listen back.');
  if (!hasResult)      improvements.push('Always include measurable results — numbers make your answers memorable.');

  // Ensure at least one highlight
  if (highlights.length === 0) highlights.push('Completed a full interview session — practice is the key to improvement.');

  return {
    overall,
    dimensions: [
      { label:'STAR Structure',   score:starScore, badge:badge(starScore), tips:starTips, desc:'How well you structured answers using Situation, Task, Action, Result' },
      { label:'Communication',    score:commScore, badge:badge(commScore), tips:commTips, desc:'Clarity, pacing, vocabulary and absence of filler words' },
      { label:'Technical Depth',  score:techScore, badge:badge(techScore), tips:techTips, desc:'Use of domain-specific terminology and technical precision' },
      { label:'Confidence',       score:confScore, badge:badge(confScore), tips:confTips, desc:'Assertiveness, ownership language and conviction in answers' },
    ],
    highlights,
    improvements,
  };
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function Ring({ score, size = 80 }: { score: number; size?: number }) {
  const r    = size * 0.38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={size*0.09}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.09}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dasharray 1.2s ease' }}/>
      <text x={size/2} y={size/2+2} textAnchor="middle" dominantBaseline="middle"
        fontSize={size*0.22} fontWeight="800" fill={color} fontFamily="system-ui">{score}</text>
    </svg>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  excellent:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  good:        'bg-blue-50 text-blue-700 border-blue-200',
  'needs work':'bg-amber-50 text-amber-700 border-amber-200',
};

function Badge({ type }: { type: 'excellent' | 'good' | 'needs work' }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${BADGE_STYLES[type]}`}>
      {type}
    </span>
  );
}

// ─── Main results component ────────────────────────────────────────────────────
interface InterviewResultsProps {
  data:     SessionData;
  onRetry:  () => void;
  onHome:   () => void;
}

export default function InterviewResults({ data, onRetry, onHome }: InterviewResultsProps) {
  const { overall, dimensions, highlights, improvements } = useMemo(() => analyze(data), [data]);
  const printRef = useRef<HTMLDivElement>(null);

  const durationMin = Math.round(data.durationSec / 60);
  const dateStr     = data.startedAt.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  const timeStr     = data.startedAt.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  const overallColor = overall >= 80 ? 'text-emerald-600' : overall >= 55 ? 'text-amber-600' : 'text-red-500';
  const overallBg    = overall >= 80 ? 'bg-emerald-50 border-emerald-200' : overall >= 55 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* ── Print stylesheet ────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #interview-report { display: block !important; }
          #interview-report { position: fixed; inset: 0; overflow: visible; }
          .no-print { display: none !important; }
          @page { margin: 20mm; size: A4; }
        }
        @media screen {
          #interview-report { display: block; }
        }
      `}</style>

      {/* ── Screenview (dark overlay, full-page modal) ────────────────────── */}
      <div className="fixed inset-0 bg-[#F9F8F6] overflow-y-auto z-50 no-print">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide font-medium">Session complete</p>
              <h1 className="text-2xl font-black text-zinc-900 mt-1">{data.config.title}</h1>
              <p className="text-xs text-zinc-500 mt-1">
                {dateStr} · {timeStr} · {durationMin} min · {data.userAnswers.length} answers recorded
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600 hover:bg-white transition-all">
                <Download size={13}/> Export PDF
              </button>
              <button onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600 hover:bg-white transition-all">
                <RotateCcw size={13}/> Retry
              </button>
              <button onClick={onHome}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all">
                <Home size={13}/> Dashboard
              </button>
            </div>
          </div>

          {/* Overall score + meta */}
          <div className={`rounded-2xl border p-6 flex items-center gap-6 ${overallBg}`}>
            <Ring score={overall} size={96}/>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Overall performance</p>
              <p className={`text-3xl font-black ${overallColor}`}>
                {overall >= 80 ? 'Excellent' : overall >= 65 ? 'Good' : overall >= 50 ? 'Developing' : 'Needs Practice'}
              </p>
              <p className="text-sm text-zinc-600">
                {overall >= 80
                  ? 'You demonstrated strong interview skills. Very likely to impress interviewers.'
                  : overall >= 65
                  ? 'Solid performance with clear strengths. A few areas to polish before interviews.'
                  : overall >= 50
                  ? 'You have a base to build on. Focus on STAR structure and specific examples.'
                  : 'Keep practising. Consistent effort with STAR technique will improve scores quickly.'}
              </p>
            </div>
            <div className="ml-auto text-right space-y-1 shrink-0">
              <div className="text-xs text-zinc-400">Field</div>
              <div className="text-sm font-semibold text-zinc-800 capitalize">{data.config.field}</div>
              <div className="text-xs text-zinc-400 mt-1">Type</div>
              <div className="text-sm font-semibold text-zinc-800 capitalize">{data.config.type}</div>
              <div className="text-xs text-zinc-400 mt-1">Level</div>
              <div className="text-sm font-semibold text-zinc-800 capitalize">{data.config.level}</div>
            </div>
          </div>

          {/* Dimension scores */}
          <div className="grid grid-cols-2 gap-4">
            {dimensions.map(dim => (
              <div key={dim.label} className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{dim.label}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{dim.desc}</p>
                  </div>
                  <Ring score={dim.score} size={52}/>
                </div>
                <Badge type={dim.badge}/>
                <div className="space-y-1.5 pt-1 border-t border-zinc-100">
                  {dim.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                      <ChevronRight size={12} className="text-zinc-400 shrink-0 mt-0.5"/>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Strengths + Improvements */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Star size={14} className="text-emerald-500" fill="currentColor"/> What you did well
              </h3>
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                  <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5"/>{h}
                </div>
              ))}
            </div>
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-500"/> Areas to improve
              </h3>
              {improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                  <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5"/>{imp}
                </div>
              ))}
              {improvements.length === 0 && (
                <p className="text-xs text-zinc-500">No major areas flagged — focus on consistency.</p>
              )}
            </div>
          </div>

          {/* STAR framework guide */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Award size={14} className="text-violet-500"/> STAR Framework Guide
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { letter:'S', label:'Situation',   color:'bg-blue-50 border-blue-200 text-blue-700',   desc:'Set the scene. Where were you? What was happening?' },
                { letter:'T', label:'Task',         color:'bg-violet-50 border-violet-200 text-violet-700', desc:'What was your role? What were you responsible for?' },
                { letter:'A', label:'Action',       color:'bg-amber-50 border-amber-200 text-amber-700',  desc:'What did YOU specifically do? Use "I", not "we".' },
                { letter:'R', label:'Result',       color:'bg-emerald-50 border-emerald-200 text-emerald-700',desc:'What was the measurable outcome? Quantify it.' },
              ].map(s => (
                <div key={s.letter} className={`rounded-xl border p-3 ${s.color}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl font-black">{s.letter}</span>
                    <span className="text-xs font-semibold">{s.label}</span>
                  </div>
                  <p className="text-[11px] opacity-80">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Session stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label:'Duration',   value:`${durationMin} min`,                    icon:<Clock size={14} className="text-blue-600"/>,    bg:'bg-blue-50' },
              { label:'Answers',    value:String(data.userAnswers.length),          icon:<MessageSquare size={14} className="text-violet-600"/>, bg:'bg-violet-50' },
              { label:'Questions',  value:String(data.avatarQuestions.length),      icon:<Star size={14} className="text-amber-600"/>,     bg:'bg-amber-50' },
              { label:'Score',      value:`${overall}%`,                            icon:<Award size={14} className="text-emerald-600"/>,  bg:'bg-emerald-50' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-zinc-200/60 rounded-xl p-4">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>{s.icon}</div>
                <p className="text-xl font-black text-zinc-900">{s.value}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Print-only report ─────────────────────────────────────────────── */}
      <div id="interview-report" style={{ display:'none', fontFamily:'system-ui, sans-serif', padding:'0', color:'#1e293b' }}>
        {/* Header */}
        <div style={{ borderBottom:'2px solid #0f172a', paddingBottom:16, marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>Interview Performance Report</div>
              <div style={{ fontSize:13, color:'#64748b', marginTop:4 }}>{data.config.title}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
                {dateStr} · {timeStr} · {durationMin} min · {data.config.field} · {data.config.level}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:40, fontWeight:900, color: overall >= 80 ? '#22c55e' : overall >= 55 ? '#f59e0b' : '#ef4444' }}>{overall}%</div>
              <div style={{ fontSize:12, color:'#64748b' }}>Overall Score</div>
            </div>
          </div>
        </div>

        {/* Dimension scores */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
          {dimensions.map(dim => (
            <div key={dim.label} style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{dim.label}</div>
                <div style={{ fontSize:20, fontWeight:900, color: dim.score>=80?'#22c55e':dim.score>=55?'#f59e0b':'#ef4444' }}>{dim.score}%</div>
              </div>
              <div style={{ fontSize:10, color:'#64748b', marginBottom:10 }}>{dim.desc}</div>
              <div style={{ width:'100%', height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden', marginBottom:12 }}>
                <div style={{ height:6, borderRadius:3, width:`${dim.score}%`, background: dim.score>=80?'#22c55e':dim.score>=55?'#f59e0b':'#ef4444' }}/>
              </div>
              {dim.tips.map((tip, i) => (
                <div key={i} style={{ fontSize:10, color:'#475569', marginBottom:4, paddingLeft:12, position:'relative' }}>
                  <span style={{ position:'absolute', left:0 }}>›</span>{tip}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Strengths and improvements */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
          <div style={{ border:'1px solid #d1fae5', borderRadius:12, padding:16, background:'#f0fdf4' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#15803d', marginBottom:10 }}>✓ What you did well</div>
            {highlights.map((h, i) => (
              <div key={i} style={{ fontSize:11, color:'#166534', marginBottom:6, paddingLeft:12, position:'relative' }}>
                <span style={{ position:'absolute', left:0 }}>•</span>{h}
              </div>
            ))}
          </div>
          <div style={{ border:'1px solid #fef3c7', borderRadius:12, padding:16, background:'#fffbeb' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#92400e', marginBottom:10 }}>↑ Areas to improve</div>
            {(improvements.length > 0 ? improvements : ['No major areas flagged.']).map((imp, i) => (
              <div key={i} style={{ fontSize:11, color:'#78350f', marginBottom:6, paddingLeft:12, position:'relative' }}>
                <span style={{ position:'absolute', left:0 }}>•</span>{imp}
              </div>
            ))}
          </div>
        </div>

        {/* STAR guide */}
        <div style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>STAR Framework Reference</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
            {[
              {l:'S',t:'Situation',d:'Set the context and background'},
              {l:'T',t:'Task',d:'Your role and responsibility'},
              {l:'A',t:'Action',d:'Specific steps YOU took'},
              {l:'R',t:'Result',d:'Measurable outcome achieved'},
            ].map(s=>(
              <div key={s.l} style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:10 }}>
                <div style={{ fontSize:20, fontWeight:900, color:'#2563eb' }}>{s.l}</div>
                <div style={{ fontSize:11, fontWeight:700, marginBottom:4 }}>{s.t}</div>
                <div style={{ fontSize:10, color:'#64748b' }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize:9, color:'#94a3b8', borderTop:'1px solid #e2e8f0', paddingTop:12, marginTop:12, textAlign:'center' }}>
          Generated by Intervue.ai · {dateStr}
        </div>
      </div>
    </>
  );
}
