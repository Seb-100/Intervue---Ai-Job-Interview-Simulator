"use client";

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Video, Trophy, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SigninPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-3 w-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden font-sans bg-white text-slate-900 select-none">

      {/* Left Column */}
      <div className="bg-black p-12 flex-col rounded-4xl justify-center relative overflow-hidden hidden lg:flex h-full">
        <div className="absolute top-10 left-10 w-24 h-24 border-4 border-zinc-800 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 border-[16px] border-zinc-900 rounded-full opacity-60" />

        <div className="relative z-10 space-y-3 max-w-md mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-300 ml-auto max-w-[240px] border border-zinc-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><Trophy size={20} /></div>
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

          <div className="bg-white rounded-[32px] p-5 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 border border-zinc-100 relative group">
            <span className="absolute top-4 right-4 bg-zinc-100 text-zinc-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider z-10">Simulation</span>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-zinc-950">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" alt="AI Interview" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg"><Video size={20} className="animate-pulse" /></div>
            </div>
            <h3 className="text-zinc-900 font-black text-xl leading-snug tracking-tight">AI Interview Practice: Ace Your Interview</h3>
            <p className="text-xs text-zinc-400 mt-1 font-medium">by AI Career Coach</p>
            <div className="flex items-center justify-between border-t border-zinc-100 mt-4 pt-4">
              <div className="flex gap-4 text-[11px] text-zinc-500 font-bold">
                <span>🗓️ 12 Practice Modules</span>
                <span className="text-emerald-600">🛡️ Unlimited Mock Sessions</span>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-300 max-w-[280px] -translate-y-8 -translate-x-6 border border-zinc-100">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Users size={16} /></div>
              <p className="text-xs font-black text-zinc-900">Happy Users: <span className="text-blue-600">2K+</span></p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <span className="text-[10px] text-zinc-400 font-bold tracking-tight">Placed at top companies</span>
              <div className="flex gap-2 items-center opacity-60">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-2.5 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="bg-white px-8 md:px-16 lg:px-24 flex flex-col justify-center h-full">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-zinc-950 text-2xl font-black tracking-tighter mb-7 -mt-7">INTER<span className="text-blue-600 font-serif italic">VUE</span></h2>
            <p className="text-blue-600 font-bold text-xs tracking-wide uppercase mb-1">Welcome Back</p>
            <h1 className="text-zinc-900 text-4xl font-black leading-none tracking-tight">LOG IN TO INTERVUE</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">Pick up right where you left off and keep sharpening your interview skills.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">
              <AlertCircle size={15} className="shrink-0" />{error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-zinc-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="candidate@email.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-zinc-900 transition-all font-medium placeholder-zinc-300" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-zinc-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-[11px] text-blue-600 font-bold hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-zinc-900 transition-all font-medium" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group mt-2 text-sm tracking-wide">
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>

            <p className="text-center text-zinc-400 text-xs">OR Continue with</p>

            <button type="button" onClick={handleGoogle} disabled={loading}
              className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50 text-zinc-800 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 text-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5" />
              Continue with Google
            </button>
          </form>

          <p className="text-center text-zinc-500 text-xs font-medium">
            Don&apos;t have an account yet?{' '}
            <Link href="/sign-up" className="text-blue-600 font-bold hover:underline ml-1">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function friendlyError(code: string): string {
  const m: Record<string, string> = {
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts — try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  };
  return m[code] ?? 'Something went wrong. Please try again.';
}
