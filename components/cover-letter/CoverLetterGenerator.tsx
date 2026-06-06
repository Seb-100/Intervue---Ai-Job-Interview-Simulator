'use client';

import React, { useState } from 'react';
import { Mail, Copy, Download, Check, RefreshCw, Save, Trash2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveCoverLetter, getCoverLetters, deleteCoverLetter, type CoverLetterDoc } from '@/lib/firestore';

// ─── Template engine (no AI needed) ──────────────────────────────────────────
function generateLetter(fields: FormFields): string {
  const { name, jobTitle, company, recipientName, experience, skills, achievement, tone, jd } = fields;

  const toneMap = {
    professional: { open: 'I am writing to express my strong interest', close: 'I look forward to the opportunity' },
    enthusiastic: { open: 'I am thrilled to apply for',                  close: 'I am excited about the possibility' },
    concise:      { open: 'I would like to apply for',                   close: 'I welcome the opportunity' },
  };
  const t = toneMap[tone];

  // Extract top keywords from JD to weave in naturally
  const jdKws = jd
    ? [...new Set((jd.match(/\b[a-zA-Z+#]{3,}\b/g)||[]).filter(w=>!/^(the|and|for|with|that|this|will|have|from|they|been|were|your|our|are|not|can|all|but|its|you|we)$/i.test(w)))]
        .slice(0, 6).join(', ')
    : 'the requirements of this role';

  return `Dear ${recipientName || 'Hiring Manager'},

${t.open} the ${jobTitle} position at ${company}. ${company ? `Having researched ${company}'s work extensively, I am` : 'I am'} confident that my background makes me an excellent candidate for this role.

With ${experience || 'several years'} of relevant experience, I have developed deep expertise in ${skills || 'key areas relevant to this position'}. ${achievement ? `Most recently, ${achievement}.` : ''} My background aligns directly with the focus areas outlined in your job description, including ${jdKws}.

What excites me most about ${company || 'your organisation'} is the opportunity to ${jobTitle.toLowerCase().includes('engineer') || jobTitle.toLowerCase().includes('developer') ? 'build impactful products at scale' : jobTitle.toLowerCase().includes('manager') ? 'lead high-performing teams' : 'contribute meaningfully to your mission'}. I thrive in environments that value ${tone === 'professional' ? 'precision, ownership, and continuous improvement' : tone === 'enthusiastic' ? 'innovation, collaboration, and growth' : 'clear outcomes and focused execution'}.

I am particularly drawn to this role because it sits at the intersection of my skills and the challenges ${company || 'your team'} is solving. I would welcome the chance to discuss how I can add immediate value.

${t.close} to discuss my application further.

${name ? `Sincerely,\n${name}` : 'Sincerely,\n[Your Name]'}`;
}

interface FormFields {
  name: string; jobTitle: string; company: string; recipientName: string;
  experience: string; skills: string; achievement: string;
  tone: 'professional' | 'enthusiastic' | 'concise'; jd: string;
}

const BLANK: FormFields = {
  name:'', jobTitle:'', company:'', recipientName:'', experience:'', skills:'', achievement:'', tone:'professional', jd:'',
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CoverLetterGenerator() {
  const { user } = useAuth();
  const [fields, setFields] = useState<FormFields>(BLANK);
  const [letter, setLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [savedId, setSavedId]       = useState<string|null>(null);
  const [saved_letters, setSavedLetters] = useState<CoverLetterDoc[]>([]);
  const [showSaved, setShowSaved]   = useState(false);

  const set = (k: keyof FormFields, v: string) => setFields(f => ({ ...f, [k]: v }));

  function generate() {
    if (!fields.jobTitle || !fields.company) return;
    setGenerating(true);
    setSaved(false); setSavedId(null);
    setTimeout(() => {
      setLetter(generateLetter(fields));
      setGenerating(false);
    }, 800);
  }

  async function handleSave() {
    if (!user || !letter) return;
    const id = await saveCoverLetter(user.uid, {
      jobTitle: fields.jobTitle,
      company: fields.company,
      recipientName: fields.recipientName,
      jobDescription: fields.jd,
      content: letter,
    }, savedId ?? undefined);
    setSavedId(id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function loadSaved() {
    if (!user) return;
    const letters = await getCoverLetters(user.uid);
    setSavedLetters(letters);
    setShowSaved(true);
  }

  function copy() {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([letter], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cover-letter-${fields.company || 'draft'}.txt`;
    a.click();
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="text-lg font-black text-zinc-900">Cover Letter Generator</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Personalised cover letters — tailored to role, company, and your background.</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* ── Form ─────────────────────────────────────────────── */}
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900">Your details</h3>

          <div className="grid grid-cols-2 gap-3">
            <LF label="Your name" value={fields.name} onChange={v=>set('name',v)} placeholder="Jane Smith"/>
            <LF label="Recipient name" value={fields.recipientName} onChange={v=>set('recipientName',v)} placeholder="Mr. James / Hiring Manager"/>
            <LF label="Job title *" value={fields.jobTitle} onChange={v=>set('jobTitle',v)} placeholder="Software Engineer"/>
            <LF label="Company *" value={fields.company} onChange={v=>set('company',v)} placeholder="Google"/>
            <LF label="Years of experience" value={fields.experience} onChange={v=>set('experience',v)} placeholder="5+ years"/>
          </div>

          <LF label="Top skills (comma-separated)" value={fields.skills} onChange={v=>set('skills',v)} placeholder="React, TypeScript, Node.js, AWS"/>
          <LF label="Key achievement" value={fields.achievement} onChange={v=>set('achievement',v)} placeholder="I increased conversion by 40% by redesigning the checkout flow"/>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Tone</label>
            <div className="flex gap-2">
              {(['professional','enthusiastic','concise'] as const).map(t=>(
                <button key={t} onClick={()=>set('tone',t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${fields.tone===t?'bg-zinc-950 text-white border-zinc-950':'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Job description <span className="text-zinc-400">(optional — improves relevance)</span></label>
            <textarea value={fields.jd} onChange={e=>set('jd',e.target.value)} rows={4}
              placeholder="Paste the job description here..."
              className="w-full text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
          </div>

          <div className="flex gap-2">
            <button onClick={generate} disabled={!fields.jobTitle||!fields.company||generating}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-40">
              {generating?<><RefreshCw size={13} className="animate-spin"/>Generating…</>:<><Mail size={13}/>Generate</>}
            </button>
            <button onClick={loadSaved}
              className="px-3 py-2.5 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
              Saved
            </button>
          </div>
        </div>

        {/* ── Result ───────────────────────────────────────────── */}
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">Your letter</h3>
            {letter && (
              <div className="flex gap-1.5">
                <button onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
                  {saved?<><Check size={11} className="text-emerald-500"/>Saved</>:<><Save size={11}/>Save</>}
                </button>
                <button onClick={copy} className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
                  {copied?<><Check size={11} className="text-emerald-500"/>Copied</>:<><Copy size={11}/>Copy</>}
                </button>
                <button onClick={download} className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
                  <Download size={11}/>TXT
                </button>
              </div>
            )}
          </div>

          {letter ? (
            <textarea value={letter} onChange={e=>setLetter(e.target.value)}
              className="flex-1 min-h-[420px] text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 leading-relaxed"/>
          ) : (
            <div className="flex-1 min-h-[420px] flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-100 text-center px-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Mail size={20} className="text-blue-600"/>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700">Fill in your details and click Generate</p>
                <p className="text-xs text-zinc-400 mt-1">A personalised cover letter will appear here, ready to edit and send</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved letters drawer */}
      {showSaved && (
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">Saved letters ({saved_letters.length})</h3>
            <button onClick={()=>setShowSaved(false)} className="text-xs text-zinc-400 hover:text-zinc-600">Close</button>
          </div>
          {saved_letters.length===0
            ? <p className="text-xs text-zinc-400">No saved letters yet.</p>
            : <div className="space-y-2">
                {saved_letters.map(l=>(
                  <div key={l.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div>
                      <p className="text-xs font-medium text-zinc-900">{l.jobTitle} @ {l.company}</p>
                      <p className="text-[10px] text-zinc-400">{l.updatedAt?.toDate?.()?.toLocaleDateString?.() ?? ''}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={()=>{ setLetter(l.content); setFields(f=>({...f,jobTitle:l.jobTitle,company:l.company,recipientName:l.recipientName,jd:l.jobDescription})); setSavedId(l.id); setShowSaved(false); }}
                        className="px-2.5 py-1.5 text-xs border border-zinc-200 rounded-xl hover:bg-white transition-all">Load</button>
                      <button onClick={async()=>{ if(!user) return; await deleteCoverLetter(user.uid,l.id); setSavedLetters(p=>p.filter(x=>x.id!==l.id)); }}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  );
}

function LF({ label, value, onChange, placeholder='' }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400 transition-all col-span-2"/>
    </div>
  );
}
