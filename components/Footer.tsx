"use client";

import React from 'react';
import { Radio, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-900 border-t border-zinc-200/60 pt-24 pb-12 relative overflow-hidden">
      
      {/* Main Footer Links & Content Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-100 flex items-center justify-center">
              <Radio size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-zinc-900 text-2xl tracking-tighter">
              <span className="font-bold text-white">Inter</span>
              <span className="text-blue-600 font-serif italic tracking-normal ml-0.5">vue</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
            The AI interview simulator that transforms career anxiety into unstoppable confidence. Practice real-time voice interviews and get expert analysis instantly.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            {/* <a href="#" className="hover:text-blue-600 transition-colors"><Twitter size={18} fill="currentColor" className="stroke-0" /></a>
            <a href="#" className="hover:text-blue-700 transition-colors"><Linkedin size={18} fill="currentColor" className="stroke-0" /></a>
            <a href="#" className="hover:text-zinc-900 transition-colors"><Github size={18} /></a> */}
          </div>
        </div>

        {/* Navigation Grid (Links) */}
        <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Platform</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-zinc-600">
              <li><a href="#features" className="hover:text-zinc-900 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Daily Training</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">For Teams</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Resources</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-zinc-600">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Interview Questions</a></li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Legal</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-zinc-600">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter/Updates Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Stay Sharp</h4>
          <p className="text-zinc-500 text-xs font-medium leading-relaxed">
            Get weekly actionable frameworks to clear senior behavioral and systemic loops.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-white border border-zinc-200/80 rounded-xl py-3 pl-4 pr-12 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-400"
            />
            <button type="submit" className="absolute right-1.5 p-2 bg-zinc-950 text-white rounded-lg hover:bg-zinc-800 transition-colors">
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
          </form>
        </div>

      </div>

      {/* Sub-footer metadata bottom bar */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-200/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-400 relative z-10">
        <p>&copy; {new Date().getFullYear()} Intervue AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-600 transition-colors">Status</a>
          <a href="#" className="hover:text-zinc-600 transition-colors">Contact Support</a>
        </div>
      </div>
          {/* HUGE BACKDROP WATERMARK AT THE BOTTOM */}
        
      <div className="absolute left-0 right-0 bottom-[-15px] sm:bottom-[-40px] md:bottom-[-60px] lg:bottom-[-30px] text-center select-none pointer-events-none z-0 overflow-hidden leading-none max-w-full">
        <span className="text-zinc-200/35 font-sans font-black tracking-tighter text-[14vw] sm:text-[15vw] inline-block uppercase w-full max-w-7xl mx-auto px-4">
          Inter<span className = " italic">vue</span>
        </span>
      </div>

    </footer>
  );
}