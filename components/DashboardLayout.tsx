// components/DashboardLayout.tsx
"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Video, History, Settings, LogOut, Radio, User } from 'lucide-react';
import InterviewSession from './InterviewSession';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'interview' | 'history'>('dashboard');

  // Hardcoded setup credentials to feed into your chosen streaming handler
  const avatarCredentials = {
    apiKey: process.env.NEXT_PUBLIC_AVATAR_API_KEY || "YOUR_HIDDEN_KEY",
    avatarId: process.env.NEXT_PUBLIC_AVATAR_ID || "YOUR_TARGET_FACE_ID"
  };

  return (
    <div className="flex h-screen bg-[#F9F8F6] text-zinc-900 overflow-hidden font-sans">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-zinc-200/80 flex flex-col justify-between p-5 shrink-0 z-20">
        <div className="space-y-8">
          {/* Platform Identity */}
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-100 flex items-center justify-center">
              <Radio size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-zinc-950 text-xl tracking-tighter font-black">
              Inter<span className="text-blue-600">vue</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${activeTab === 'dashboard' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
            >
              <LayoutDashboard size={16} />
              Overview Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('interview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${activeTab === 'interview' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
            >
              <Video size={16} />
              Live Interview Room
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${activeTab === 'history' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
            >
              <History size={16} />
              Session History
            </button>
          </nav>
        </div>

        {/* Footer profile area */}
        <div className="border-t border-zinc-100 pt-4 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600">
              <User size={14} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 leading-none">Alex Dev</p>
              <span className="text-[10px] text-zinc-400 font-medium">Candidate</span>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50/60 transition-all">
            <LogOut size={14} />
            Disconnect
          </button>
        </div>
      </aside>

      {/* ================= MAIN VIEWPORT ================= */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto relative z-10">
        
        {/* Simple top header bar metadata placeholder */}
        <header className="h-14 bg-white border-b border-zinc-200/60 px-8 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {activeTab === 'dashboard' && "Overview / Insights"}
            {activeTab === 'interview' && "Simulator Engine Workspace"}
            {activeTab === 'history' && "Archived Transcripts"}
          </span>
          <div className="text-xs font-bold bg-zinc-100 border px-3 py-1 rounded-full text-zinc-600">
            Defense Status: Live Preview
          </div>
        </header>

        {/* Dynamic content rendering container depending on menu tab selections */}
        <div className="p-8 flex-grow">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white border p-6 rounded-2xl space-y-2 shadow-sm">
                <h1 className="text-zinc-950 font-black text-2xl tracking-tight">Welcome back, Alex!</h1>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl">
                  Select "Live Interview Room" from the sidebar to launch your real-time conversational streaming avatar interface[cite: 1].
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border p-4 rounded-xl text-left"><span className="text-[10px] text-zinc-400 font-black uppercase">Sessions Completed</span><p className="text-xl font-black mt-1">14</p></div>
                <div className="bg-white border p-4 rounded-xl text-left"><span className="text-[10px] text-zinc-400 font-black uppercase">Average Score</span><p className="text-xl font-black mt-1">7.8 / 10</p></div>
                <div className="bg-white border p-4 rounded-xl text-left"><span className="text-[10px] text-zinc-400 font-black uppercase">Next loop field</span><p className="text-xl font-black mt-1 text-blue-600">React Core</p></div>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <InterviewSession credentials={avatarCredentials} />
          )}

          {activeTab === 'history' && (
            <div className="bg-white border rounded-2xl p-8 text-center text-zinc-400 text-sm font-medium">
              No previous conversation histories found. Complete your first live room stream loop to log analytical breakdowns[cite: 1].
            </div>
          )}
        </div>
      </main>

    </div>
  );
}