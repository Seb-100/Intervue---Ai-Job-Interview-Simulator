"use client";

import React, { useState } from 'react';
import { Upload, Search, RefreshCw, CheckCircle, AlertCircle, XCircle, Check, Info, FileText, AlignLeft } from 'lucide-react';
import { ScoreRing } from '../ui/ScoreRing';

export default function CVReviewer() {
  const [step, setStep] = useState<"upload" | "result">("upload");
  const [cvUploaded, setCvUploaded] = useState(false);
  const [jd, setJd] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep("result");
    }, 2000);
  };

  const atsScore = 73;
  const sections = [
    { name: "Work Experience", score: 88, status: "good", tip: "Strong metrics. Add 2 more quantified results." },
    { name: "Skills match", score: 61, status: "warn", tip: "Missing: Docker, Kubernetes — required in the JD." },
    { name: "Summary", score: 45, status: "bad", tip: "Too generic. Rewrite to target this specific role." },
    { name: "Education", score: 90, status: "good", tip: "Well formatted. Degree is relevant." },
    { name: "Keywords (ATS)", score: 67, status: "warn", tip: "Add: 'cross-functional', 'agile', 'CI/CD' from JD." },
    { name: "Formatting", score: 95, status: "good", tip: "Clean, ATS-friendly layout detected." },
  ];

  if (step === "result") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-900">CV Analysis Report</h2>
            <p className="text-xs text-zinc-400 font-normal mt-0.5">vs. Frontend Developer at Stripe</p>
          </div>
          <button 
            onClick={() => setStep("upload")} 
            className="text-xs px-3 py-1.5 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50"
          >
            Analyse another CV
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
            <ScoreRing score={atsScore} size={80} />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-900">ATS Match Score</p>
              <p className="text-xs text-zinc-400 font-normal mt-0.5">vs. job description</p>
            </div>
            <div className={`text-xs px-3 py-1 rounded-full font-medium ${atsScore >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
              {atsScore >= 80 ? "Strong match" : "Needs improvement"}
            </div>
          </div>

          <div className="col-span-2 bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-zinc-900 mb-4">Section breakdown</h3>
            {sections.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-32 text-xs text-zinc-600 font-normal shrink-0">{s.name}</div>
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${s.status === "good" ? "bg-emerald-500" : s.status === "warn" ? "bg-amber-500" : "bg-red-500"}`} 
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right text-zinc-700">{s.score}%</span>
                {s.status === "good" ? <CheckCircle size={14} className="text-emerald-500" /> :
                 s.status === "warn" ? <AlertCircle size={14} className="text-amber-500" /> :
                 <XCircle size={14} className="text-red-500" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <CheckCircle size={15} className="text-emerald-500" /> Strengths
            </h3>
            {["Strong quantified achievements (↑40% revenue, 3x speed)", "Clean ATS-friendly formatting", "Education perfectly matches role requirements", "6+ years relevant experience demonstrated"].map(t => (
              <div key={t} className="flex items-start gap-2 text-xs text-zinc-600">
                <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />{t}
              </div>
            ))}
          </div>

          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <AlertCircle size={15} className="text-amber-500" /> Improvements
            </h3>
            {sections.filter(s => s.status !== "good").map(s => (
              <div key={s.name} className="flex items-start gap-2 text-xs text-zinc-600">
                <Info size={12} className="text-amber-500 shrink-0 mt-0.5" />
                <span><span className="font-medium text-zinc-800">{s.name}:</span> {s.tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-zinc-900">Missing keywords from job description</h3>
          <div className="flex flex-wrap gap-2">
            {["Docker", "Kubernetes", "CI/CD", "cross-functional", "agile", "TypeScript", "REST APIs", "system design", "microservices"].map(k => (
              <span key={k} className="text-xs px-2.5 py-1 bg-red-50 border border-red-100 text-red-700 rounded-full">{k}</span>
            ))}
          </div>
          <p className="text-xs text-zinc-400 font-normal">Add these naturally to your bullets — don't keyword stuff.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-black text-zinc-900">CV Reviewer</h2>
        <p className="text-xs text-zinc-400 font-normal mt-0.5">ATS score, keyword analysis, and section-by-section feedback.</p>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <Upload size={15} className="text-blue-600" /> Upload your CV
        </h3>
        <div 
          onClick={() => setCvUploaded(true)}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${cvUploaded ? "border-emerald-300 bg-emerald-50" : "border-zinc-200 hover:border-blue-300 hover:bg-blue-50/30"}`}
        >
          {cvUploaded ? (
            <>
              <CheckCircle size={28} className="text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700">john_doe_cv.pdf uploaded</p>
            </>
          ) : (
            <>
              <FileText size={28} className="text-zinc-300" />
              <p className="text-sm font-medium text-zinc-600">Drop your CV here or click to browse</p>
              <p className="text-xs text-zinc-400">PDF or DOCX · max 5MB</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <AlignLeft size={15} className="text-blue-600" /> Paste job description 
          <span className="text-[10px] font-normal text-zinc-400 ml-1">(optional — enables ATS score)</span>
        </h3>
        <textarea 
          value={jd} 
          onChange={e => setJd(e.target.value)} 
          placeholder="Paste the full job description here..." 
          rows={5}
          className="w-full text-sm font-normal text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"
        />
      </div>

      <button 
        onClick={handleAnalyze} 
        disabled={!cvUploaded || analyzing}
        className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-40"
      >
        {analyzing ? (
          <><RefreshCw size={15} className="animate-spin" /> Analysing...</>
        ) : (
          <><Search size={15} /> Analyse my CV</>
        )}
      </button>
    </div>
  );
}