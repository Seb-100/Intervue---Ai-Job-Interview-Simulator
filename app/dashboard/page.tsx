"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import InterviewRoom from '@/components/interview/InterviewRoom';
import HistoryPanel from '@/components/history/HistoryPanel';
import CVReviewer from '@/components/cv/CVReviewer';
import CVBuilder from '@/components/cv/CVBuilder';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import JobTracker from '@/components/job-tracker/JobTracker';

type View = "dashboard" | "interview" | "history" | "cv-review" | "cv-builder" | "cover-letter" | "job-tracker";

const VIEW_LABELS: Record<View, string> = {
  dashboard:    'Overview',
  interview:    'Interview Room',
  history:      'History',
  'cv-review':  'CV Reviewer',
  'cv-builder': 'CV Builder',
  'cover-letter': 'Cover Letter',
  'job-tracker': 'Job Tracker',
};

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>("dashboard");

  // Auth guard — redirect to sign-in if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
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
                Welcome back, <span className="font-medium text-zinc-800">{profile.name.split(' ')[0]}</span>
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
          {currentView === "dashboard"     && <StatsOverview onLaunchInterview={() => setCurrentView("interview")} />}
          {currentView === "interview"     && <InterviewRoom onBack={() => setCurrentView("dashboard")} />}
          {currentView === "history"       && <HistoryPanel />}
          {currentView === "cv-review"     && <CVReviewer />}
          {currentView === "cv-builder"    && <CVBuilder />}
          {currentView === "cover-letter"  && <CoverLetterGenerator />}
          {currentView === "job-tracker"   && <JobTracker />}
        </div>
      </div>
    </div>
  );
}
