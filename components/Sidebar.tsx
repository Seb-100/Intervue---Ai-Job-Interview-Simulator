'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Video, History, LogOut, FileText, Edit3, Mail, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps { currentView: string; onViewChange: (view: string) => void; }

const MENU = [
  { id:'dashboard',    label:'Dashboard',     icon:LayoutDashboard },
  { id:'interview',    label:'Interview Room', icon:Video },
  { id:'history',      label:'History',        icon:History },
  { id:'cv-review',    label:'CV Reviewer',    icon:FileText },
  { id:'cv-builder',   label:'CV Builder',     icon:Edit3 },
  { id:'cover-letter', label:'Cover Letter',   icon:Mail },
  { id:'job-tracker',  label:'Job Tracker',    icon:Briefcase },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { profile, logOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logOut();
    router.push('/sign-in');
  }

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="w-60 bg-white border-r border-zinc-200/60 flex flex-col justify-between py-5 px-3 shrink-0 z-20">
      <div className="space-y-6">
        {/* Logo */}
        <div className="px-3 pb-1">
          <Link href="/">
            <span className="text-zinc-950 text-lg font-black tracking-tight">
              Inter<span className="text-blue-600 font-serif italic">vue.ai</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="space-y-0.5">
          {MENU.map(item => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button key={item.id} onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium tracking-tight transition-all ${
                  active ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                }`}>
                <Icon size={15} className={active ? 'text-white' : 'text-zinc-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User + logout */}
      <div className="space-y-1 border-t border-zinc-100 pt-4">
        {profile && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-all cursor-default">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden">
              {profile.photoURL
                ? <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover"/>
                : <span className="text-[11px] font-bold text-white">{initials}</span>
              }
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">{profile.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{profile.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={14}/> Sign out
        </button>
      </div>
    </aside>
  );
}
