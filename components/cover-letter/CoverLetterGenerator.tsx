"use client";

import React, { useState } from 'react';
import { Mail, RefreshCw, Download } from 'lucide-react';

export default function CoverLetterGenerator() {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1800);
  };

  const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Developer position at Stripe...`;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-black text-zinc-900">Cover Letter Generator</h2>
        <p className="text-xs text-zinc-400 font-normal mt-0.5">AI-generated, personalised to the role and your CV.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Form */}
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-4">
          {/* Job details form - same as original */}
          <button 
            onClick={generate} 
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {generating ? <><RefreshCw size={13} className="animate-spin" />Generating...</> : "✦ Generate cover letter"}
          </button>
        </div>

        {/* Result */}
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
          {/* Result area - same as original */}
        </div>
      </div>
    </div>
  );
}