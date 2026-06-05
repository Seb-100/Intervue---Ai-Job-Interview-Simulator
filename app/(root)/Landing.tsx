"use client";

import React from 'react';
import { 
  Radio, ArrowRight, Star, Check, Flame, Award, Briefcase, Zap, Smile, MessageSquare, Compass, Shield
} from 'lucide-react';
// import Navbar from '@/components/Navbar'; 
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#F9F8F6] font-sans antialiased text-zinc-900 selection:bg-blue-100 overflow-x-hidden">
      
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-blue-100/70 border border-blue-200/50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <Radio size={12} className="animate-pulse stroke-[2.5]" />
            AI Job Interview Simulator
          </div>
          <h1 className="text-zinc-900 text-4xl sm:text-5xl lg:text-5xl font-black font-bold tracking-tight leading-[1.05]">
            Transform your interview fear into <span className="text-blue-600 font-serif italic font-normal tracking-normal block mt-1">absolute confidence</span>
          </h1>
          <p className="text-zinc-600 font-normal text-base sm:text-lg leading-relaxed max-w-md">
            Join the top 3% of candidates and become irresistible in interviews. Real practice. Actionable feedback. Guaranteed results.
          </p>
          <div className="pt-2">
            <Link href="/sign-up" className="inline-flex bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-base py-4 px-8 rounded-2xl items-center gap-2 group transition-all shadow-lg shadow-zinc-300">
              Start my interview
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2.5">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-[#F9F8F6] flex items-center justify-center text-[10px] font-medium">L</span>
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white border-2 border-[#F9F8F6] flex items-center justify-center text-[10px] font-medium">M</span>
              <span className="w-8 h-8 rounded-full bg-blue-400 text-white border-2 border-[#F9F8F6] flex items-center justify-center text-[10px] font-medium">T</span>
              <span className="w-8 h-8 rounded-full bg-blue-700 text-white border-2 border-[#F9F8F6] flex items-center justify-center text-[10px] font-medium">S</span>
            </div>
            <div>
              <div className="flex text-amber-500 gap-0.5"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><span className="text-zinc-900 font-normal text-xs ml-1.5">4.8/5</span></div>
              <p className="text-zinc-400 font-normal text-xs mt-0.5">+7,000 candidates trained this year</p>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="lg:col-span-7 relative flex justify-center">
          <style>{`
            @keyframes float-card-1 {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes float-card-2 {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes float-card-3 {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-7px); }
            }
            @keyframes orb-shake {
              0%, 100% { transform: translate(0, 0) scale(1); }
              10% { transform: translate(-3px, -2px) scale(1.02); }
              20% { transform: translate(3px, 2px) scale(0.98); }
              30% { transform: translate(-2px, 3px) scale(1.01); }
              40% { transform: translate(2px, -3px) scale(0.99); }
              50% { transform: translate(-3px, 1px) scale(1.02); }
              60% { transform: translate(3px, -1px) scale(0.98); }
              70% { transform: translate(-1px, 3px) scale(1.01); }
              80% { transform: translate(1px, -2px) scale(0.99); }
              90% { transform: translate(-2px, 2px) scale(1.01); }
            }
            @keyframes bar-wave {
              0%, 100% { height: 6px; }
              50% { height: 18px; }
            }
            .float-1 { animation: float-card-1 3s ease-in-out infinite; }
            .float-2 { animation: float-card-2 3.5s ease-in-out infinite 0.5s; }
            .float-3 { animation: float-card-3 4s ease-in-out infinite 1s; }
            .orb-shake { animation: orb-shake 2.5s ease-in-out infinite; }
            .bar1 { animation: bar-wave 0.9s ease-in-out infinite; }
            .bar2 { animation: bar-wave 0.9s ease-in-out infinite 0.15s; }
            .bar3 { animation: bar-wave 0.9s ease-in-out infinite 0.3s; }
            .bar4 { animation: bar-wave 0.9s ease-in-out infinite 0.45s; }
            .bar5 { animation: bar-wave 0.9s ease-in-out infinite 0.6s; }
          `}</style>

          <div className="bg-white/90 border border-zinc-200 shadow-2xl rounded-2xl w-full max-w-[580px] p-5 relative overflow-visible">
            <div className="flex items-center gap-1.5 pb-4 border-b border-zinc-100 text-xs text-zinc-400 font-normal">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 bg-zinc-50 border border-zinc-100 rounded px-2 py-0.5 text-[10px]">intervue.ai/interview</span>
            </div>

            <div className="pt-4 grid grid-cols-12 gap-4 items-center">
              {/* Candidate image */}
              <div className="col-span-6 relative">
                <div className="aspect-[4/3] rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                    alt="Candidate"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating: Strengths */}
                <div className="float-1 absolute -bottom-3 -left-4 bg-white/95 border border-zinc-100 p-3 rounded-xl shadow-xl flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded-lg text-blue-600"><Check size={14} /></div>
                  <div>
                    <h4 className="text-[10px] font-normal text-zinc-800 uppercase tracking-wide">Strengths</h4>
                    <p className="text-[9px] text-zinc-400 font-normal">Automatically detected</p>
                  </div>
                </div>
              </div>

              {/* Orb + Aria speaking */}
              <div className="col-span-6 flex flex-col items-center justify-center relative py-6 gap-5">
                {/* Shaking orb */}
                <div className="relative flex items-center justify-center">
                  <div className="orb-shake w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-200 relative z-10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                    </div>
                  </div>
                  {/* Subtle pulse ring */}
                  <div className="absolute w-24 h-24 rounded-full border border-blue-300 animate-ping opacity-30" />
                </div>

                {/* Modern Aria speaking indicator */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2 rounded-2xl shadow-lg">
                    <div className="flex items-end gap-[3px] h-5">
                      <div className="bar1 w-1 bg-blue-400 rounded-full" style={{minHeight:'6px'}} />
                      <div className="bar2 w-1 bg-blue-300 rounded-full" style={{minHeight:'6px'}} />
                      <div className="bar3 w-1 bg-blue-400 rounded-full" style={{minHeight:'6px'}} />
                      <div className="bar4 w-1 bg-blue-300 rounded-full" style={{minHeight:'6px'}} />
                      <div className="bar5 w-1 bg-blue-400 rounded-full" style={{minHeight:'6px'}} />
                    </div>
                    <span className="text-white text-[11px] font-normal tracking-wide">Aria is speaking</span>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  </div>
                  <span className="text-zinc-400 text-[10px] font-normal">Tell me about yourself...</span>
                </div>
              </div>
            </div>

            {/* Floating widgets */}
            <div className="float-2 absolute -top-6 -left-6 bg-white border border-zinc-100 p-3 rounded-xl shadow-xl flex items-center gap-2 max-w-[130px]">
              <div className="w-1.5 h-6 bg-blue-500 rounded" />
              <div>
                <h4 className="text-[10px] font-normal text-zinc-900">Motivation</h4>
                <div className="w-12 h-1.5 bg-zinc-100 rounded-full mt-1 overflow-hidden"><div className="w-4/5 h-full bg-blue-500" /></div>
              </div>
            </div>

            <div className="float-3 absolute top-10 -right-6 bg-white border border-zinc-100 p-3 rounded-xl shadow-xl flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><MessageSquare size={14} /></div>
              <div>
                <h4 className="text-[10px] font-normal text-zinc-900">Communication</h4>
                <div className="w-16 h-1.5 bg-zinc-100 rounded-full mt-1 overflow-hidden"><div className="w-11/12 h-full bg-blue-600" /></div>
              </div>
            </div>

            <div className="float-1 absolute -bottom-6 -right-4 bg-white border border-zinc-100 p-3 rounded-xl shadow-xl flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Zap size={14} /></div>
              <div>
                <h4 className="text-[10px] font-normal text-zinc-900">To improve</h4>
                <p className="text-[9px] text-zinc-400 font-normal">Growth areas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOGO TICKER */}
      <section className="bg-zinc-100/50 border-y border-zinc-200/50 py-10 text-center space-y-4">
        <p className="text-zinc-400 text-xs font-normal uppercase tracking-widest">They got hired at</p>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-100 ">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-5" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-4 mt-1" />
          <span className="font-sans text-lg font-normal text-zinc-900 tracking-tighter">LVMH</span>
          <span className="font-sans text-lg font-normal text-zinc-900 tracking-widest">CHANEL</span>
          <span className="font-serif text-lg font-normal text-zinc-900">BOSCH</span>
        </div>
      </section>

      {/* 3. STATS ROW */}
      <section className="py-16 max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-b border-zinc-200/40">
        <div>
          <h3 className="text-zinc-900 text-4xl font-black">98%</h3>
          <p className="text-zinc-400 text-xs font-normal mt-1 leading-normal max-w-[160px]">believe Intervue helped them improve</p>
        </div>
        <div>
          <h3 className="text-zinc-900 text-4xl font-black">7,000+</h3>
          <p className="text-zinc-400 text-xs font-normal mt-1 leading-normal">Trained candidates</p>
        </div>
        <div>
          <h3 className="text-zinc-900 text-4xl font-black">4.8/5</h3>
          <p className="text-zinc-400 text-xs font-normal mt-1 leading-normal">Average user rating</p>
        </div>
        <div>
          <h3 className="text-zinc-900 text-4xl font-black">2000+</h3>
          <p className="text-zinc-400 text-xs font-normal mt-1 leading-normal">Simulated interviews per month</p>
        </div>
      </section>

      {/* 4. THREE-STEP PROCESS */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 space-y-12">
        <div className="space-y-3">
          <span className="text-blue-600 font-normal text-xs uppercase tracking-wider block">How it works</span>
          <h2 className="text-zinc-900 text-4xl sm:text-5xl font-black  tracking-tight leading-none max-w-2xl">
            Most candidates <span className="bg-blue-100 px-2 py-0.5 rounded-lg text-blue-950 font-sans tracking-tight">improvise</span>.<br className="mt-1"/>
            You, you train<span className="text-blue-300 ml-0.5">.</span>
          </h2>
          <p className="text-zinc-500 font-normal text-sm sm:text-base max-w-xl leading-relaxed pt-1">
            Most people improvise. They focus on getting the interview, then leave the rest to chance. Until they leave regretting their answers. Intervue helps you level up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 border border-zinc-200/60 p-6 rounded-2xl space-y-4 hover:shadow-xl hover:bg-white transition-all duration-300">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-normal text-xs">1</span>
            <h3 className="text-zinc-900 font-medium text-lg">Describe your role</h3>
            <p className="text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed">Paste the job offer or pick a case. 30 seconds, you're set.</p>
          </div>
          <div className="bg-white/60 border border-zinc-200/60 p-6 rounded-2xl space-y-4 hover:shadow-xl hover:bg-white transition-all duration-300">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-normal text-xs">2</span>
            <h3 className="text-zinc-900 font-medium text-lg">Talk with the AI</h3>
            <p className="text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed">Realistic voice interview. It listens, follows up, digs deeper — like a real recruiter.</p>
          </div>
          <div className="bg-white/60 border border-zinc-200/60 p-6 rounded-2xl space-y-4 hover:shadow-xl hover:bg-white transition-all duration-300">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-normal text-xs">3</span>
            <h3 className="text-zinc-900 font-medium text-lg">Get your report</h3>
            <p className="text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed">Detailed score, strengths, hesitations. You know exactly what to work on.</p>
          </div>
        </div>

        <div className="pt-2">
          <a href="/sign-up" className="inline-flex bg-zinc-950 hover:bg-zinc-800 text-white font-normal text-sm py-3.5 px-6 rounded-xl items-center gap-2 group transition-all">
            Start my interview
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* 5. PERFORMANCE ANALYSIS */}
      <section className="py-20 bg-zinc-100/30 border-y border-zinc-200/40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-blue-600 font-normal text-xs uppercase tracking-wider block">The report</span>
            <h2 className="text-zinc-900 text-4xl sm:text-5xl font-black tracking-tight leading-none">
              Detailed analysis of your performance
            </h2>
            <p className="text-zinc-500 font-normal text-sm sm:text-base leading-relaxed">
              Receive comprehensive feedback on your content, communication and presence with personalized recommendations.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-2.5 text-zinc-800 text-sm font-normal">
                <Check size={16} className="text-blue-600 stroke-[3]" /> Detailed scores by skill
              </li>
              <li className="flex items-center gap-2.5 text-zinc-800 text-sm font-normal">
                <Check size={16} className="text-blue-600 stroke-[3]" /> Strengths and areas for improvement
              </li>
              <li className="flex items-center gap-2.5 text-zinc-800 text-sm font-normal">
                <Check size={16} className="text-blue-600 stroke-[3]" /> Personalized expert advice
              </li>
            </ul>
            <div className="pt-4">
              <Link href="/sign-up" className="inline-flex bg-zinc-950 hover:bg-zinc-800 text-white font-normal text-sm py-4 px-6 rounded-xl items-center gap-2 group transition-all">
                Start my simulation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-zinc-200/80 shadow-2xl rounded-2xl p-6 space-y-6">
              <div className="text-center space-y-1 border-b border-zinc-100 pb-4">
                <span className="text-[10px] text-zinc-400 font-normal uppercase tracking-wider bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">Product Manager Role • LVMH Simulation</span>
                <h3 className="text-zinc-900 text-lg font-medium pt-1">Your interview report</h3>
              </div>
              <div className="flex justify-center py-2">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-8 border-zinc-100 border-t-blue-500 border-r-blue-400">
                  <div className="text-center">
                    <span className="text-zinc-900 text-2xl font-black block leading-none">55%</span>
                    <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 font-normal rounded-full uppercase mt-1 inline-block">To Review</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="border border-zinc-100 bg-zinc-50/50 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-red-500 font-normal flex items-center gap-0.5">↓ 10%</span>
                  <p className="text-zinc-400 font-normal text-[9px] uppercase">Communication</p>
                  <p className="text-zinc-900 font-black text-base">60</p>
                </div>
                <div className="border border-zinc-100 bg-zinc-50/50 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-red-500 font-normal flex items-center gap-0.5">↓ 20%</span>
                  <p className="text-zinc-400 font-normal text-[9px] uppercase">Preparation</p>
                  <p className="text-zinc-900 font-black text-base">50</p>
                </div>
                <div className="border border-zinc-100 bg-zinc-50/50 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-green-600 font-normal flex items-center gap-0.5">↑ 0%</span>
                  <p className="text-zinc-400 font-normal text-[9px] uppercase">Motivation</p>
                  <p className="text-zinc-900 font-black text-base">70</p>
                </div>
                <div className="border border-zinc-100 bg-zinc-50/50 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] text-red-500 font-normal flex items-center gap-0.5">↓ 5%</span>
                  <p className="text-zinc-400 font-normal text-[9px] uppercase">Technical</p>
                  <p className="text-zinc-900 font-black text-base">65</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DAILY TRAINING */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-blue-600 font-normal text-xs uppercase tracking-wider block">Daily training</span>
          <h2 className="text-zinc-900 text-4xl sm:text-5xl font-black tracking-tight leading-none">
            5 minutes a day to <span className=" px-2 -py-2 rounded-lg text-blue-400">sharpen</span> your answers<span className="text-blue-300 font-sans">.</span>
          </h2>
          <p className="text-zinc-500 font-normal text-sm sm:text-base leading-relaxed">
            Between full simulations, work on your answers with targeted questions. Question of the day, categories, mastery levels — a real gym for your speaking skills.
          </p>
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Flame size={15} /></div>
              <p className="text-zinc-800 text-sm font-normal">Question of the day & daily streak</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Briefcase size={15} /></div>
              <p className="text-zinc-800 text-sm font-normal">6 categories: pitch, soft skills, traps...</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Award size={15} /></div>
              <p className="text-zinc-800 text-sm font-normal">Mastery levels and visible progress</p>
            </div>
          </div>
          <div className="pt-4">
            <Link href="/sign-up" className="inline-flex bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm py-4 px-6 rounded-xl items-center gap-2 group transition-all">
              Start training
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-normal text-zinc-400 border-b border-zinc-100 pb-3">
              <span className="text-orange-500 flex items-center gap-1"><Flame size={14} fill="currentColor" /> Current streak • 7 days</span>
              <span className="text-blue-600">+45 XP today</span>
            </div>
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-normal tracking-wider text-zinc-400">Question of the day</span>
              <p className="text-zinc-900 font-normal text-sm sm:text-base">"Tell me about a time you failed. What did you learn?"</p>
              <div className="pt-2 flex gap-2">
                <span className="bg-blue-100 text-blue-700 font-normal text-[10px] px-2 py-0.5 rounded-full">Behavioral</span>
                <span className="text-zinc-400 font-normal text-[10px] mt-0.5">~2 min</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-normal text-zinc-700 pt-2">
              <div className="p-3 border border-zinc-100 bg-zinc-50/50 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-zinc-50"><Smile size={14} className="text-blue-500" /> Classic questions</div>
              <div className="p-3 border border-zinc-100 bg-zinc-50/50 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-zinc-50"><Compass size={14} className="text-orange-500" /> Soft skills</div>
              <div className="p-3 border border-zinc-100 bg-zinc-50/50 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-zinc-50"><Award size={14} className="text-red-500" /> Behavioral</div>
              <div className="p-3 border border-zinc-100 bg-zinc-50/50 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-zinc-50"><Zap size={14} className="text-blue-500" /> Technical</div>
              <div className="p-3 border border-zinc-100 bg-zinc-50/50 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-zinc-50"><Shield size={14} className="text-amber-500" /> Traps</div>
              <div className="p-3 border border-zinc-100 bg-zinc-50/50 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-zinc-50"><Radio size={14} className="text-emerald-500" /> Role-playing</div>
            </div>
            <div className="pt-4 border-t border-zinc-100 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-normal text-zinc-400 uppercase">
                <span>Overall mastery</span>
                <span className="text-zinc-900">68%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="w-[68%] h-full bg-blue-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CARD BENEFITS */}
      <section className="py-24 bg-zinc-100/30 border-y border-zinc-200/40 px-6">
        <div className="max-w-7xl mx-auto space-y-12 text-center md:text-left">
          <div className="space-y-3">
            <span className="text-blue-600 font-normal text-xs uppercase tracking-wider block">The platform</span>
            <h2 className="text-zinc-900 text-4xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl">
              Do you want to be the only candidate who hasn't prepared well?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl text-left space-y-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Radio size={16} /></div>
              <h3 className="text-zinc-900 font-medium text-base">Realistic voice conversation</h3>
              <p className="text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed">Experience a real interview with our ultra-natural voice AI</p>
            </div>
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl text-left space-y-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Briefcase size={16} /></div>
              <h3 className="text-zinc-900 font-medium text-base">Personalized AI interview</h3>
              <p className="text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed">Our AI adapts to the position you're looking for and questions you in a 100% personalized way</p>
            </div>
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl text-left space-y-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><MessageSquare size={16} /></div>
              <h3 className="text-zinc-900 font-medium text-base">Constructive feedback</h3>
              <p className="text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed">Receive honest and actionable analyses to improve your technique</p>
            </div>
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl text-left space-y-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Zap size={16} /></div>
              <h3 className="text-zinc-900 font-medium text-base">Get better</h3>
              <p className="text-zinc-500 font-normal text-xs sm:text-sm leading-relaxed">Progress gradually in difficulty and master every interview level</p>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Link href="/sign-up" className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm py-4 px-8 rounded-xl flex items-center gap-2 group transition-all">
              Join over 1,000 candidates
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. COMPARISON */}
      <section className="py-24 max-w-7xl mx-auto px-6 space-y-12">
        <div className="space-y-3">
          <span className="text-blue-600 font-normal text-xs uppercase tracking-wider block">Why Intervue</span>
          <h2 className="text-zinc-900 text-4xl sm:text-5xl font-black tracking-tight leading-none">
            Why <span className="text-blue-600 font-serif italic font-normal tracking-normal">Intervue</span> changes everything
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-zinc-100/60 border border-zinc-200/60 rounded-2xl p-8 space-y-6">
            <h3 className="text-zinc-500 font-normal text-sm uppercase tracking-wider">Traditional preparation</h3>
            <ul className="space-y-4 text-zinc-500 font-normal text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-zinc-400 rounded-full shrink-0" />
                You go from one interview to another without knowing what you do well or poorly
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-zinc-400 rounded-full shrink-0" />
                You often leave without understanding why it didn't work
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-zinc-400 rounded-full shrink-0" />
                You feel like you're going in circles without ever improving
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-zinc-400 rounded-full shrink-0" />
                Impossible to measure your progress or identify your weak points
              </li>
            </ul>
          </div>
          <div className="border-2 border-blue-500 bg-white rounded-2xl p-8 space-y-6 relative shadow-xl">
            <span className="absolute -top-3 left-6 bg-blue-500 text-white font-normal text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
              Recommended
            </span>
            <h3 className="text-zinc-900 font-normal text-sm uppercase tracking-wider">With Intervue</h3>
            <ul className="space-y-4 text-zinc-800 font-normal text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <Check size={18} className="text-blue-600 shrink-0 stroke-[3] mt-0.5" />
                You train as much as you want, orally, in real conditions
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-blue-600 shrink-0 stroke-[3] mt-0.5" />
                You receive detailed feedback after each interview to know exactly where to improve
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-blue-600 shrink-0 stroke-[3] mt-0.5" />
                You gain confidence with each session, you feel ready on D-day
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-blue-600 shrink-0 stroke-[3] mt-0.5" />
                The AI adapts to your profile, your sector, your specific goals
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-24 bg-zinc-100/20 border-t border-zinc-200/40 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-blue-600 font-normal text-xs uppercase tracking-wider block">Testimonials</span>
            <h2 className="text-zinc-900 text-4xl sm:text-5xl font-black tracking-tight leading-none">
              What our users say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex text-amber-500 gap-0.5"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                <p className="text-zinc-700 font-normal text-sm leading-relaxed italic">
                  "Intervue gave me the confidence I needed for my Google interview. The simulations were very realistic!"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                <span className="w-9 h-9 rounded-full bg-blue-600 text-white font-normal text-xs flex items-center justify-center">M</span>
                <div>
                  <h4 className="text-zinc-900 font-normal text-xs">Marie L.</h4>
                  <p className="text-zinc-400 text-[10px] font-normal uppercase">Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex text-amber-500 gap-0.5"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                <p className="text-zinc-700 font-normal text-sm leading-relaxed italic">
                  "Perfect for preparing job interviews. The AI asks relevant questions and the feedback is very precise."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                <span className="w-9 h-9 rounded-full bg-blue-500 text-white font-normal text-xs flex items-center justify-center">T</span>
                <div>
                  <h4 className="text-zinc-900 font-normal text-xs">Thomas R.</h4>
                  <p className="text-zinc-400 text-[10px] font-normal uppercase">Law Student</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex text-amber-500 gap-0.5"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                <p className="text-zinc-700 font-normal text-sm leading-relaxed italic">
                  "I used Intervue to prepare my thesis defense. It helped me structure my answers."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                <span className="w-9 h-9 rounded-full bg-blue-400 text-white font-normal text-xs flex items-center justify-center">S</span>
                <div>
                  <h4 className="text-zinc-900 font-normal text-xs">Dr. Sophie M.</h4>
                  <p className="text-zinc-400 text-[10px] font-normal uppercase">PhD Student in Biology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-zinc-950 text-white rounded-[32px] px-8 py-16 sm:py-20 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="w-64 h-64 bg-blue-600/10 blur-[100px] absolute -top-12 -left-12 rounded-full" />
          <div className="w-64 h-64 bg-blue-600/10 blur-[100px] absolute -bottom-12 -right-12 rounded-full" />
          <h2 className="text-white text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-none relative z-10">
            The best way to train <span className="text-blue-400 font-serif italic font-normal tracking-normal">for landing your dream job</span>
          </h2>
          <p className="text-zinc-400 font-normal text-sm sm:text-base max-w-md mx-auto relative z-10">
            Every day, candidates go to interviews without preparation and miss opportunities. Don't make this mistake.
          </p>
          <div className="pt-4 relative z-10">
            <Link href="/sign-up" className="inline-flex bg-white hover:bg-zinc-100 text-zinc-950 font-normal text-sm sm:text-base py-4 px-8 rounded-xl items-center gap-2 group transition-all shadow-xl">
              Start my interview
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-zinc-950" />
            </Link>
          </div>
        </div>
      </section>
    <Footer />
    </div>
    </>
  );
}