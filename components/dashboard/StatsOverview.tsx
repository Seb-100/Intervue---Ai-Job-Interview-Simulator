"use client";

import React from 'react';
import { Radio, Mic, TrendingUp, Clock, Flame, ArrowRight, Zap, User, BarChart2, Target, Star, AlertCircle } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { SkillBar } from '../ui/SkillBar';
import { InterviewCard } from '../ui/InterviewCard';
import { MOCK_INTERVIEWS } from '../mockData';

interface StatsOverviewProps {
  onLaunchInterview: () => void;
}

export default function StatsOverview({ onLaunchInterview }: StatsOverviewProps) {
  const completed = MOCK_INTERVIEWS.filter(i => i.status === "completed");
  const avgScore = Math.round(completed.reduce((a, i) => a + (i.score ?? 0), 0) / completed.length);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-zinc-950 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-5 pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-zinc-400 text-xs font-normal">Welcome back, John</p>
          <h2 className="text-white text-xl font-black">Ready to practice today?</h2>
          <p className="text-zinc-500 text-xs font-normal">
            Your avg score is <span className="text-white font-medium">{avgScore}%</span> — keep pushing.
          </p>
        </div>
        <button 
          onClick={onLaunchInterview}
          className="flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-all shrink-0 relative z-10"
        >
          <Radio size={14} className="animate-pulse text-blue-600" /> New Interview
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          label="Total Sessions" 
          value="23" 
          sub="Since joining" 
          icon={<Mic size={16} className="text-blue-600" />} 
          color="bg-blue-50" 
          trend={12} 
        />
        <StatCard 
          label="Average Score" 
          value={`${avgScore}%`} 
          sub="All types" 
          icon={<TrendingUp size={16} className="text-emerald-600" />} 
          color="bg-emerald-50" 
          trend={8} 
        />
        <StatCard 
          label="Hours Practiced" 
          value="11.4" 
          sub="Total time" 
          icon={<Clock size={16} className="text-violet-600" />} 
          color="bg-violet-50" 
          trend={5} 
        />
        <StatCard 
          label="Current Streak" 
          value="7 days" 
          sub="Don't break it!" 
          icon={<Flame size={16} className="text-orange-500" />} 
          color="bg-orange-50" 
        />
      </div>

      {/* Skill Breakdown + Score Progression */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-900">Skill breakdown</h3>
            <span className="text-[10px] text-zinc-400">Last 5 sessions</span>
          </div>
          <div className="space-y-3">
            <SkillBar label="Communication" value={84} color="bg-blue-500" />
            <SkillBar label="Technical depth" value={72} color="bg-violet-500" />
            <SkillBar label="Problem solving" value={79} color="bg-emerald-500" />
            <SkillBar label="STAR structure" value={91} color="bg-amber-500" />
            <SkillBar label="Confidence" value={67} color="bg-pink-500" />
          </div>
        </div>

        <div className="col-span-2 bg-white border border-zinc-200/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-900">Score progression</h3>
            <div className="flex gap-1">
              {["1W", "1M", "All"].map((t, i) => (
                <button 
                  key={t} 
                  className={`text-[10px] px-2 py-1 rounded-lg ${i === 1 ? "bg-zinc-950 text-white font-medium" : "text-zinc-400 hover:bg-zinc-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-32">
            <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f4f4f5" strokeWidth="1" />
              ))}
              <path 
                d="M0,42 L57,38 L114,30 L171,26 L228,32 L285,18 L342,22 L400,8 L400,100 L0,100Z" 
                fill="url(#ag)" 
              />
              <polyline 
                points="0,42 57,38 114,30 171,26 228,32 285,18 342,22 400,8" 
                fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              />
              {[[0,42],[57,38],[114,30],[171,26],[228,32],[285,18],[342,22],[400,8]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="3" fill="#2563eb" />
              ))}
            </svg>
          </div>
          <div className="flex justify-between text-[9px] text-zinc-400 mt-1">
            {["May 28","May 29","May 30","May 31","Jun 1","Jun 2","Jun 3","Jun 4"].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-900">Recent sessions</h3>
          <button className="text-xs text-blue-600 flex items-center gap-1">View all <ArrowRight size={12} /></button>
        </div>
        <div className="space-y-2">
          {MOCK_INTERVIEWS.slice(0, 4).map(iv => (
            <InterviewCard key={iv.id} interview={iv} onStart={onLaunchInterview} />
          ))}
        </div>
      </div>

      {/* Highlights + Quick Practice */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-zinc-900">Performance highlights</h3>
          <div className="space-y-2">
            {[
              { bg:"bg-emerald-50 border-emerald-100", icon:<Star size={13} fill="currentColor" className="text-emerald-600"/>, label:"Best session", name:"Behavioral Interview", score:"91%", tc:"text-emerald-800", sc:"text-emerald-600" },
              { bg:"bg-red-50 border-red-100", icon:<AlertCircle size={13} className="text-red-500"/>, label:"Needs work", name:"Data Engineer Technical", score:"68%", tc:"text-red-800", sc:"text-red-500" },
              { bg:"bg-blue-50 border-blue-100", icon:<TrendingUp size={13} className="text-blue-600"/>, label:"Most improved", name:"Communication", score:"+14% this week", tc:"text-blue-800", sc:"text-blue-600" },
            ].map(h => (
              <div key={h.label} className={`flex items-center justify-between p-3 rounded-xl border ${h.bg}`}>
                <div className={`flex items-center gap-2 text-xs ${h.tc}`}>{h.icon}{h.label}</div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${h.tc}`}>{h.name}</p>
                  <p className={`text-[10px] ${h.sc}`}>{h.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-zinc-900">Quick practice</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label:"Frontend Technical", icon:<Zap size={13}/>, color:"bg-blue-50 text-blue-700 border-blue-100" },
              { label:"Behavioral", icon:<User size={13}/>, color:"bg-violet-50 text-violet-700 border-violet-100" },
              { label:"System Design", icon:<BarChart2 size={13}/>, color:"bg-amber-50 text-amber-700 border-amber-100" },
              { label:"Mixed Round", icon:<Target size={13}/>, color:"bg-emerald-50 text-emerald-700 border-emerald-100" },
            ].map(q => (
              <button 
                key={q.label} 
                onClick={onLaunchInterview}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-normal transition-all hover:shadow-sm ${q.color}`}
              >
                {q.icon}{q.label}
              </button>
            ))}
          </div>
          <button 
            onClick={onLaunchInterview}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all"
          >
            <Radio size={12} className="animate-pulse" /> Custom interview setup
          </button>
        </div>
      </div>
    </div>
  );
}