"use client";

import React from 'react';
import { Mail, Lock, User, ArrowRight, Video, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();

    const handleSignUp = async () => {
        //sign up logic with firebase

        router.push('/dashboard');
    };

  return (
    <div className="h-screen p-3 w-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden font-sans bg-white text-slate-900 select-none">
      
      {/* Left Column: Fixed Viewport Visual Showcase */}
      <div className="bg-black rounded-4xl ml-2  p-16 flex-col justify-center relative overflow-hidden hidden lg:flex h-full">
        <div className="absolute top-10 left-10 w-24 h-24 border-4 border-zinc-800 rounded-full animate-pulse opacity-70" />
        <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 border-[16px] border-zinc-900 rounded-full opacity-80" />
        <div className="absolute bottom-[70px] left-[-60px] w-48 h-48 border-[16px] border-zinc-900 rounded-full opacity-80" />
        
        <div className="relative z-10 p-4  space-y-3 max-w-md mx-auto w-full">
          
          {/* Top Row: Total Hours Practiced */}
          <div className="bg-white/95 backdrop-blur-md p-5 mt-4 rounded-2xl shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-300 ml-auto max-w-[240px] border border-zinc-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <Trophy size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-zinc-900 uppercase tracking-tight">Total Hours Practiced</h4>
                <p className="text-[10px] text-zinc-400 font-medium">User Practice Stats</p>
              </div>
            </div>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-zinc-500 text-xs">Total Hours: <strong className="text-zinc-900">325.5</strong></span>
              <span className="text-green-600 font-bold text-sm">85% <span className="text-[10px] text-zinc-400 font-normal">Avg. Score</span></span>
            </div>
          </div>

          {/* Middle Main Content: AI Interview Practice Card */}
          <div className="bg-white rounded-[32px] p-5 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 border border-zinc-100 relative group">
            <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider z-10">
              Simulation
            </span>
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-zinc-950">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
                alt="AI Interview Smart Studio Terminal" 
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg">
                <Video size={20} className="animate-pulse" />
              </div>
            </div>

            <h3 className="text-zinc-900 font-black text-xl leading-snug tracking-tight">
              AI Interview Practice: Ace Your Interview
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-medium">by AI Career Coach</p>
            
            <div className="flex items-center justify-between border-t border-zinc-100 mt-4 pt-4">
              <div className="flex gap-4 text-[11px] text-zinc-500 font-bold">
                <span className="flex items-center gap-1">🗓️ 12 Practice Modules</span>
                <span className="flex items-center gap-1 text-emerald-600">🛡️ Unlimited Mock Sessions</span>
              </div>
            </div>
          </div>

          {/* Overlay Floating Box: Success Stories */}
          <div className="bg-blue-600 backdrop-blur-md p-4 mb-3 rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-300 max-w-[280px] -translate-y-8 -translate-x-6 border border-zinc-100">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                <Users size={16} />
              </div>
              <p className="text-xs font-black text-white">Happy Users: <span className="text-white">2K+</span></p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <span className="text-[10px] text-white font-bold tracking-tight">Success Stories: <span className="text-white cursor-pointer hover:underline">View All</span></span>
              <div className="flex gap-2 items-center opacity-100  hover:grayscale-0 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-2.5 mt-1" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Column: Direct Sign Up Form */}
      <div className="bg-white px-8 md:px-16 lg:px-24 flex flex-col justify-center h-full">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-zinc-950 text-2xl font-black tracking-tighter mb-7 -mt-7">INTER<span className = "text-blue-600 font-serif italic">VUE</span></h2>
            <p className="text-blue-600 font-bold text-2xs tracking-wide uppercase mb-1">Get Started</p>
            <h1 className="text-zinc-900 text-4xl font-black leading-none tracking-tight">
              CREATE YOUR ACCOUNT
            </h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">
              Join Intervue today and unlock interactive workspace simulations.
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 ml-1 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-zinc-900 transition-all font-medium placeholder-zinc-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="email" 
                  placeholder="candidate@email.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-zinc-900 transition-all font-medium placeholder-zinc-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-zinc-900 transition-all font-medium"
                />
              </div>
            </div>

            <button onClick = { handleSignUp } className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group mt-2 text-sm tracking-wide">
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
             <p className = "text-center" >OR Continue with</p>
             <button className="w-full bg-white border border-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group mt-2 text-sm tracking-wide">
              {/* Google */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-7" />
            </button>
          </form>

          <p className="text-center text-zinc-500 text-xs font-medium">
            Already have an account? <Link href="/sign-in" className="text-blue-600 font-bold hover:underline ml-1">Login</Link>
          </p>
        </div>
      </div>

    </div>
  );
}