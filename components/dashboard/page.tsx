"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainWorkspace from '@/components/MainWorkspace';
import StatsOverview from '@/components/dashboard/StatsOverview';
import HistoryPanel from '@/components/history/HistoryPanel';

export default function DashboardPage() {
  // Simple view switcher: dashboard, live-interview, or history log options
  const [currentView, setCurrentView] = useState<string>('dashboard');

  return (
    <div className="flex h-screen w-screen bg-[#FAFAFA] text-zinc-900 overflow-hidden font-sans">
      {/* 1. Left Menu Drawer Panel Navigation */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* 2. Main Viewport Panel Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 bg-white border-b border-zinc-200/60 px-8 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Simulate Environment Room Console Matrix
          </span>
          <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            Active Profile Connected
          </div>
        </header>

        {/* Dynamic Content Frame Loader depending on State parameters */}
        <div className="p-8 flex-grow">
          {currentView === 'dashboard' && <StatsOverview onLaunchInterview={() => setCurrentView('interview')} />}
          {currentView === 'interview' && <MainWorkspace />}
          {currentView === 'history' && <HistoryPanel />}
        </div>
      </div>
    </div>
  );
}