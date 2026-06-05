"use client";

import React, { useState } from 'react';
import { Globe, ArrowRight, Menu, X, Radio } from 'lucide-react';
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-zinc-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left Side: Custom Dynamic Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          {/* <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center transition-transform group-hover:scale-105">
            <Radio size={20} className="stroke-[2.5]" />
          </div> */}
          <Link href = '/'><span className="text-zinc-900 text-2xl lg:text-5xl tracking-tighter">
            <span className="font-bold font-sans">Inter</span>
            <span className="text-blue-600 font-serif italic tracking-normal ml-0.5">vue.ai</span>
          </span></Link>
        </div>

        {/* Center: Main Navigation Menu (matches layout of image_888a83.png) */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-zinc-500 hover:text-zinc-900 font-medium text-sm transition-colors">
            For organizations
          </Link>
          <Link href="#" className="text-zinc-500 hover:text-zinc-900 font-medium text-sm transition-colors">
            Blog
          </Link>
        </div>

        {/* Right Side: Language Switcher, Log In, and CTA Button */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switcher Button (FR Support) */}
          <button className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-semibold text-sm transition-colors px-2 py-1 rounded-lg hover:bg-zinc-100">
            <Globe size={16} />
            <span>En</span>
          </button>

          {/* Login Action link */}
          <Link href="/sign-in" className="text-zinc-500 hover:text-zinc-900 font-semibold text-sm transition-colors">
            Login
          </Link>

          {/* Premium Rounded Pill Get Started Button */}
          <Link 
            href="/sign-up" 
            className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm py-3 px-6 rounded-full flex items-center gap-2 group shadow-md shadow-zinc-200 transition-all duration-200"
          >
            <span>Get started</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Layout Menu Button Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-700 hover:text-zinc-950 p-2 rounded-xl transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel Layer */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-zinc-200 p-6 space-y-6 flex flex-col shadow-xl animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4">
            <Link href="#" className="text-zinc-600 hover:text-zinc-950 font-bold text-base py-1">
              For organizations
            </Link>
            <Link href="#" className="text-zinc-600 hover:text-zinc-950 font-bold text-base py-1">
              Blog
            </Link>
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-2 text-zinc-600 font-bold text-base py-1">
              <Globe size={18} />
              <span>Switch to French (FR)</span>
            </button>
            <Link href="/sign-in" className="text-zinc-600 hover:text-zinc-950 font-bold text-base py-1">
              Login
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-center py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <span>Get started</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}