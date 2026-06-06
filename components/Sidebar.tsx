'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Video, History, LogOut, FileText, Edit3, Mail, Briefcase, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  lang?: 'en' | 'fr';
}

type MenuItem = { id: string; en: string; fr: string; icon: React.ElementType };

const MENU: MenuItem[] = [
  { id:'dashboard',    en:'Dashboard',     fr:'Tableau de bord', icon:LayoutDashboard },
  { id:'interview',    en:'Interview Room', fr:'Salle d\'entretien', icon:Video },
  { id:'history',      en:'History',        fr:'Historique',      icon:History },
  { id:'cv-review',    en:'CV Reviewer',    fr:'Révision CV',     icon:FileText },
  { id:'cv-builder',   en:'CV Builder',     fr:'Créateur de CV',  icon:Edit3 },
  { id:'cover-letter', en:'Cover Letter',   fr:'Lettre de motivation', icon:Mail },
  { id:'job-tracker',  en:'Job Tracker',    fr:'Suivi candidatures', icon:Briefcase },
];

export default function Sidebar({ currentView, onViewChange, lang = 'en' }: SidebarProps) {
  const { profile, logOut } = useAuth();
  const { plan } = usePremium();
  const router = useRouter();
  const isFr = lang === 'fr';

  async function handleLogout() {
    await logOut();
    router.push('/sign-in');
  }

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="w-60 bg-white border-r border-zinc-200/60 flex flex-col justify-between py-5 px-3 shrink-0 z-20">
      <div className="space-y-5">
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
                <Icon size={15} className={active ? 'text-white' : 'text-zinc-400'}/>
                {isFr ? item.fr : item.en}
              </button>
            );
          })}
        </nav>

        {/* Upgrade banner */}
        {plan === 'free' && (
          <button onClick={() => onViewChange('pricing')}
            className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-md shadow-blue-200">
            <Zap size={14} fill="currentColor"/>
            <div className="text-left">
              <p>{isFr ? 'Passer à Premium' : 'Upgrade to Premium'}</p>
              <p className="text-[10px] text-blue-200 font-normal">
                {isFr ? 'Dès 4 900 XAF/mois' : 'From 4,900 XAF/month'}
              </p>
            </div>
          </button>
        )}

        {plan === 'starter' && (
          <button onClick={() => onViewChange('pricing')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-all">
            <Crown size={13}/>
            {isFr ? 'Passer à Pro' : 'Upgrade to Pro'}
          </button>
        )}

        {plan === 'pro' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 border border-violet-200">
            <Crown size={13} className="text-violet-600"/>
            <span className="text-xs font-semibold text-violet-700">
              {isFr ? '👑 Plan Pro actif' : '👑 Pro plan active'}
            </span>
          </div>
        )}
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
          <LogOut size={14}/> {isFr ? 'Déconnexion' : 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
