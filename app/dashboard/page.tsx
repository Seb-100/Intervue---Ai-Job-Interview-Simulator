"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import InterviewRoom from '@/components/interview/InterviewRoom';
import HistoryPanel from '@/components/history/HistoryPanel';
import CVReviewer from '@/components/cv/CVReviewer';
import CVBuilder from '@/components/cv/CVBuilder';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import JobTracker from '@/components/job-tracker/JobTracker';

type View = "dashboard" | "interview" | "history" | "cv-review" | "cv-builder" | "cover-letter" | "job-tracker";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
  };

  const handleLaunchInterview = () => {
    setCurrentView("interview");
  };

  return (
    <div className="flex h-screen w-screen bg-[#F9F8F6] text-zinc-900 overflow-hidden font-sans antialiased">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-zinc-200/60 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-normal text-zinc-400">Intervue</span>
            <span className="text-xs font-medium text-zinc-700 capitalize">{currentView.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-normal text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Profile connected
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {currentView === "dashboard" && <StatsOverview onLaunchInterview={handleLaunchInterview} />}
          {currentView === "interview" && <InterviewRoom onBack={() => setCurrentView("dashboard")} />}
          {currentView === "history" && <HistoryPanel />}
          {currentView === "cv-review" && <CVReviewer />}
          {currentView === "cv-builder" && <CVBuilder />}
          {currentView === "cover-letter" && <CoverLetterGenerator />}
          {currentView === "job-tracker" && <JobTracker />}
        </div>
      </div>
    </div>
  );
}