"use client";

import React from 'react';
import Link from'next/link'
import { LayoutDashboard, Video, History, LogOut, ShieldAlert, FileText, Edit3, Mail, Briefcase } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'interview', label: 'Live Interview Room', icon: Video },
    { id: 'history', label: 'Session History Logs', icon: History },
    { id: 'cv-review', label: 'CV Reviewer', icon: FileText },
    { id: 'cv-builder', label: 'CV Builder', icon: Edit3 },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'job-tracker', label: 'Job Tracker', icon: Briefcase },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between p-5 shrink-0 z-20">
      <div className="space-y-8">
        <div className="flex items-center gap-2.5 px-2">
          {/* <div className="p-2 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
            <ShieldAlert size={16} className="stroke-[2.5]" />
          </div> */}
          <Link href = '/'><span className="text-zinc-950 text-lg font-black tracking-tight">
            Inter<span className="text-blue-600 fornt-serif italic">vue.ai</span>
          </span></Link>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                  isSelected 
                    ? 'bg-zinc-950 text-white shadow-md' 
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <IconComponent size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-100 pt-4">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50/60 transition-all">
          <LogOut size={14} />
          End Workspace Session
        </button>
      </div>
    </aside>
  );
}