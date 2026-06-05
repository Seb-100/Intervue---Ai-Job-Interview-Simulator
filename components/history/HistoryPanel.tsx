"use client";

import React from 'react';
import { TYPE_ICONS, LEVEL_COLORS } from '../mockData';
import { MOCK_INTERVIEWS } from '../mockData';

export default function HistoryPanel() {
  const completed = MOCK_INTERVIEWS.filter(i => i.status === "completed");
  const avg = Math.round(completed.reduce((a, i) => a + (i.score ?? 0), 0) / completed.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900">Interview history</h2>
          <p className="text-xs text-zinc-400 font-normal mt-0.5">
            {completed.length} sessions · avg {avg}%
          </p>
        </div>
        <div className="flex gap-2">
          {["All", "Technical", "Behavioral", "Mixed"].map((f, i) => (
            <button 
              key={f} 
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                i === 0 ? "bg-zinc-950 text-white border-zinc-950 font-medium" : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-100 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
          <div className="col-span-4">Session</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Level</div>
          <div className="col-span-1 text-center">Q</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-2">Score</div>
          <div className="col-span-1">Date</div>
        </div>

        {completed.map((iv, idx) => {
          const lc = LEVEL_COLORS[iv.level];
          const sc = iv.score! >= 80 ? "text-emerald-600" : iv.score! >= 65 ? "text-blue-600" : "text-amber-600";
          const bc = iv.score! >= 80 ? "bg-emerald-500" : iv.score! >= 65 ? "bg-blue-500" : "bg-amber-500";

          return (
            <div 
              key={iv.id} 
              className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-zinc-50/70 cursor-pointer ${idx < completed.length - 1 ? "border-b border-zinc-100" : ""}`}
            >
              <div className="col-span-4">
                <p className="text-xs font-medium text-zinc-900">{iv.title}</p>
                <p className="text-[10px] text-zinc-400">{iv.field}</p>
              </div>
              <div className="col-span-2">
                <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                  {React.createElement(TYPE_ICONS[iv.type])}{iv.type}
                </span>
              </div>
              <div className="col-span-1">
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${lc.bg} ${lc.text}`}>
                  {iv.level}
                </span>
              </div>
              <div className="col-span-1 text-center text-xs text-zinc-500">{iv.questionCount}</div>
              <div className="col-span-1 text-xs text-zinc-500">{iv.duration}</div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bc}`} style={{ width: `${iv.score}%` }} />
                </div>
                <span className={`text-xs font-medium ${sc}`}>{iv.score}%</span>
              </div>
              <div className="col-span-1 text-[10px] text-zinc-400">{iv.date}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Best score", value: "91%", sub: "Behavioral", color: "text-emerald-600" },
          { label: "Avg duration", value: "24 min", sub: "Per session", color: "text-blue-600" },
          { label: "Top skill", value: "STAR", sub: "+91% avg", color: "text-violet-600" },
          { label: "Weakest area", value: "Depth", sub: "72% avg", color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-zinc-200/60 rounded-2xl p-4">
            <p className="text-[10px] text-zinc-400 font-normal uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}