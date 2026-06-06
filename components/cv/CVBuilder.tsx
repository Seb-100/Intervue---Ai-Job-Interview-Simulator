'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, Plus, X, Save, RefreshCw, Check, Sparkles, Briefcase, GraduationCap, Wrench, FolderOpen, Award, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveCV, getCVs, deleteCV, type CVDoc, type ExperienceEntry, type EducationEntry, type ProjectEntry } from '@/lib/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────
const BLANK_CV: Omit<CVDoc,'id'|'createdAt'|'updatedAt'> = {
  name: 'My CV',
  templateId: 'clean',
  personalInfo: { fullName:'', email:'', phone:'', location:'', website:'', linkedin:'', summary:'' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

const BLANK_EXP: ExperienceEntry = { title:'', company:'', location:'', startDate:'', endDate:'', current:false, description:'' };
const BLANK_EDU: EducationEntry  = { degree:'', school:'', field:'', year:'', gpa:'' };
const BLANK_PRJ: ProjectEntry    = { name:'', description:'', tech:'', url:'' };

const SECTIONS = [
  { id:'personal',  label:'Personal Info', icon: User },
  { id:'experience',label:'Experience',    icon: Briefcase },
  { id:'education', label:'Education',     icon: GraduationCap },
  { id:'skills',    label:'Skills',        icon: Wrench },
  { id:'projects',  label:'Projects',      icon: FolderOpen },
  { id:'certifications', label:'Certifications', icon: Award },
];

const TEMPLATES = [
  { id:'clean',     name:'Clean',     accent:'#2563eb' },
  { id:'minimal',   name:'Minimal',   accent:'#000000' },
  { id:'modern',    name:'Modern',    accent:'#7c3aed' },
  { id:'executive', name:'Executive', accent:'#b45309' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function TF({ label, value, onChange, placeholder='', full=false }: {
  label:string; value:string; onChange:(v:string)=>void; placeholder?:string; full?:boolean;
}) {
  return (
    <div className={full?'col-span-2':''}>
      <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400 transition-all"/>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CVBuilder() {
  const { user } = useAuth();
  const [cv, setCV]             = useState<Omit<CVDoc,'id'|'createdAt'|'updatedAt'>>(BLANK_CV);
  const [cvId, setCvId]         = useState<string|null>(null);
  const [activeSection, setActive] = useState('personal');
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [preview, setPreview]   = useState(false);
  const [savedCVs, setSavedCVs] = useState<CVDoc[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert]   = useState('');

  const u = (path: string, val: any) => setCV(prev => setPath(prev, path, val));
  const pi = (k: keyof CVDoc['personalInfo'], v: string) => setCV(p=>({...p, personalInfo:{...p.personalInfo,[k]:v}}));

  async function handleSave() {
    if (!user) return;
    setLoading(true);
    const id = await saveCV(user.uid, cv, cvId ?? undefined);
    setCvId(id); setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
    setLoading(false);
  }

  async function loadSaved() {
    if (!user) return;
    const list = await getCVs(user.uid);
    setSavedCVs(list);
    setShowSaved(true);
  }

  function addExperience() { setCV(p=>({...p, experience:[...p.experience, {...BLANK_EXP}]})); }
  function removeExperience(i:number) { setCV(p=>({...p, experience:p.experience.filter((_,j)=>j!==i)})); }
  function updateExp(i:number, k:keyof ExperienceEntry, v:any) { setCV(p=>{ const e=[...p.experience]; e[i]={...e[i],[k]:v}; return {...p,experience:e}; }); }

  function addEducation() { setCV(p=>({...p, education:[...p.education, {...BLANK_EDU}]})); }
  function removeEducation(i:number) { setCV(p=>({...p, education:p.education.filter((_,j)=>j!==i)})); }
  function updateEdu(i:number, k:keyof EducationEntry, v:string) { setCV(p=>{ const e=[...p.education]; e[i]={...e[i],[k]:v}; return {...p,education:e}; }); }

  function addSkill() { if(newSkill.trim()&&!cv.skills.includes(newSkill.trim())) { setCV(p=>({...p,skills:[...p.skills,newSkill.trim()]})); setNewSkill(''); } }
  function removeSkill(s:string) { setCV(p=>({...p,skills:p.skills.filter(x=>x!==s)})); }

  function addProject() { setCV(p=>({...p, projects:[...p.projects,{...BLANK_PRJ}]})); }
  function removeProject(i:number) { setCV(p=>({...p,projects:p.projects.filter((_,j)=>j!==i)})); }
  function updatePrj(i:number, k:keyof ProjectEntry, v:string) { setCV(p=>{ const e=[...p.projects]; e[i]={...e[i],[k]:v}; return {...p,projects:e}; }); }

  function addCert() { if(newCert.trim()) { setCV(p=>({...p,certifications:[...p.certifications,newCert.trim()]})); setNewCert(''); } }
  function removeCert(c:string) { setCV(p=>({...p,certifications:p.certifications.filter(x=>x!==c)})); }

  const tmpl = TEMPLATES.find(t=>t.id===cv.templateId)||TEMPLATES[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900">CV Builder</h2>
          <p className="text-xs text-zinc-400 mt-0.5">ATS-friendly, professionally structured CV — saved to your account.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSaved} className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
            Saved CVs
          </button>
          <button onClick={()=>setPreview(v=>!v)} className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
            <Eye size={12}/>{preview?'Edit':'Preview'}
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all disabled:opacity-50">
            {loading?<RefreshCw size={12} className="animate-spin"/>:saved?<Check size={12}/>:<Save size={12}/>}
            {saved?'Saved!':loading?'Saving…':'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sections sidebar */}
        <div className="col-span-2 space-y-1">
          {SECTIONS.map(s=>{
            const Icon=s.icon;
            return (
              <button key={s.id} onClick={()=>setActive(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all ${activeSection===s.id?'bg-zinc-950 text-white font-medium':'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'}`}>
                <Icon size={13}/>{s.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-zinc-100 mt-2">
            <p className="text-[10px] text-zinc-400 px-3 mb-1.5 uppercase tracking-wide">Template</p>
            <div className="grid grid-cols-2 gap-1 px-1">
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>setCV(p=>({...p,templateId:t.id}))}
                  className={`py-1.5 rounded-lg text-[10px] transition-all border ${cv.templateId===t.id?'border-zinc-900 bg-zinc-950 text-white':'border-zinc-200 text-zinc-500 hover:border-zinc-400'}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        {!preview && (
          <div className="col-span-5 bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-4">
            {activeSection==='personal'&&(
              <>
                <h3 className="text-sm font-semibold text-zinc-900">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <TF label="Full name" value={cv.personalInfo.fullName} onChange={v=>pi('fullName',v)} placeholder="Jane Smith" full/>
                  <TF label="Email" value={cv.personalInfo.email} onChange={v=>pi('email',v)} placeholder="jane@email.com"/>
                  <TF label="Phone" value={cv.personalInfo.phone} onChange={v=>pi('phone',v)} placeholder="+44 7700 000000"/>
                  <TF label="Location" value={cv.personalInfo.location} onChange={v=>pi('location',v)} placeholder="London, UK"/>
                  <TF label="LinkedIn URL" value={cv.personalInfo.linkedin} onChange={v=>pi('linkedin',v)} placeholder="linkedin.com/in/jane"/>
                  <TF label="Website / GitHub" value={cv.personalInfo.website} onChange={v=>pi('website',v)} placeholder="github.com/jane"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Professional summary</label>
                  <textarea value={cv.personalInfo.summary} onChange={e=>pi('summary',e.target.value)} rows={4}
                    placeholder="3–4 lines: who you are, what you bring, and what you're looking for..."
                    className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2.5 bg-zinc-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
                </div>
              </>
            )}

            {activeSection==='experience'&&(
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900">Work Experience</h3>
                  <button onClick={addExperience} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus size={12}/>Add role</button>
                </div>
                {cv.experience.length===0&&<EmptySection label="No experience entries yet" onAdd={addExperience}/>}
                {cv.experience.map((exp,i)=>(
                  <div key={i} className="p-4 bg-zinc-50 rounded-xl space-y-3 border border-zinc-100 relative">
                    <button onClick={()=>removeExperience(i)} className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-all"><X size={13}/></button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <TF label="Job title" value={exp.title} onChange={v=>updateExp(i,'title',v)} placeholder="Senior Engineer"/>
                      <TF label="Company" value={exp.company} onChange={v=>updateExp(i,'company',v)} placeholder="Acme Corp"/>
                      <TF label="Location" value={exp.location} onChange={v=>updateExp(i,'location',v)} placeholder="London / Remote"/>
                      <TF label="Start date" value={exp.startDate} onChange={v=>updateExp(i,'startDate',v)} placeholder="Jan 2022"/>
                      {!exp.current&&<TF label="End date" value={exp.endDate} onChange={v=>updateExp(i,'endDate',v)} placeholder="Dec 2024"/>}
                    </div>
                    <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={e=>updateExp(i,'current',e.target.checked)} className="rounded"/>
                      Current role
                    </label>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">Description / bullet points</label>
                      <textarea value={exp.description} onChange={e=>updateExp(i,'description',e.target.value)} rows={3}
                        placeholder="• Increased revenue by 40% by redesigning the checkout flow&#10;• Led team of 5 engineers across 3 time zones"
                        className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeSection==='education'&&(
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900">Education</h3>
                  <button onClick={addEducation} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus size={12}/>Add</button>
                </div>
                {cv.education.length===0&&<EmptySection label="No education entries yet" onAdd={addEducation}/>}
                {cv.education.map((edu,i)=>(
                  <div key={i} className="p-4 bg-zinc-50 rounded-xl space-y-2 border border-zinc-100 relative">
                    <button onClick={()=>removeEducation(i)} className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-all"><X size={13}/></button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <TF label="Degree" value={edu.degree} onChange={v=>updateEdu(i,'degree',v)} placeholder="BSc Computer Science"/>
                      <TF label="School" value={edu.school} onChange={v=>updateEdu(i,'school',v)} placeholder="University of London"/>
                      <TF label="Field of study" value={edu.field} onChange={v=>updateEdu(i,'field',v)} placeholder="Computer Science"/>
                      <TF label="Year" value={edu.year} onChange={v=>updateEdu(i,'year',v)} placeholder="2019–2022"/>
                      <TF label="GPA / Grade" value={edu.gpa} onChange={v=>updateEdu(i,'gpa',v)} placeholder="First Class / 3.8"/>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeSection==='skills'&&(
              <>
                <h3 className="text-sm font-semibold text-zinc-900">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map(sk=>(
                    <span key={sk} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full">
                      {sk}<button onClick={()=>removeSkill(sk)} className="text-blue-400 hover:text-blue-700 ml-0.5"><X size={10}/></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newSkill} onChange={e=>setNewSkill(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&addSkill()}
                    placeholder="Add skill (press Enter)"
                    className="flex-1 text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
                  <button onClick={addSkill} className="px-3 py-2 bg-zinc-950 text-white rounded-xl text-sm hover:bg-zinc-800 transition-all"><Plus size={14}/></button>
                </div>
                <p className="text-[10px] text-zinc-400">Suggested: React, TypeScript, Node.js, Python, SQL, AWS, Docker, Git, Agile, REST APIs</p>
              </>
            )}

            {activeSection==='projects'&&(
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900">Projects</h3>
                  <button onClick={addProject} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus size={12}/>Add</button>
                </div>
                {cv.projects.length===0&&<EmptySection label="No projects yet" onAdd={addProject}/>}
                {cv.projects.map((prj,i)=>(
                  <div key={i} className="p-4 bg-zinc-50 rounded-xl space-y-2 border border-zinc-100 relative">
                    <button onClick={()=>removeProject(i)} className="absolute top-3 right-3 text-zinc-400 hover:text-red-500"><X size={13}/></button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <TF label="Project name" value={prj.name} onChange={v=>updatePrj(i,'name',v)} placeholder="E-commerce platform"/>
                      <TF label="Tech stack" value={prj.tech} onChange={v=>updatePrj(i,'tech',v)} placeholder="React, Node.js, PostgreSQL"/>
                      <TF label="URL / GitHub" value={prj.url} onChange={v=>updatePrj(i,'url',v)} placeholder="github.com/..."/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">Description</label>
                      <textarea value={prj.description} onChange={e=>updatePrj(i,'description',e.target.value)} rows={2}
                        placeholder="What it does, your role, impact..."
                        className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeSection==='certifications'&&(
              <>
                <h3 className="text-sm font-semibold text-zinc-900">Certifications & Awards</h3>
                <div className="space-y-2">
                  {cv.certifications.map(c=>(
                    <div key={c} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-700">
                      {c}
                      <button onClick={()=>removeCert(c)} className="text-zinc-400 hover:text-red-500 transition-all"><X size={13}/></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newCert} onChange={e=>setNewCert(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCert()}
                    placeholder="AWS Certified Developer, Google Cloud Associate..."
                    className="flex-1 text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400"/>
                  <button onClick={addCert} className="px-3 py-2 bg-zinc-950 text-white rounded-xl text-sm hover:bg-zinc-800 transition-all"><Plus size={14}/></button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Live Preview */}
        <div className={`${preview?'col-span-10':'col-span-5'} bg-white border border-zinc-200/60 rounded-2xl overflow-hidden`}>
          <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Live preview</p>
            <span className="text-[10px] text-zinc-400 capitalize">{tmpl.name} template</span>
          </div>
          <div className="p-4 overflow-y-auto max-h-[540px]">
            <CVPreview cv={cv} accentColor={tmpl.accent}/>
          </div>
        </div>
      </div>

      {/* Saved CVs drawer */}
      {showSaved&&(
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">Saved CVs ({savedCVs.length})</h3>
            <button onClick={()=>setShowSaved(false)} className="text-xs text-zinc-400 hover:text-zinc-600">Close</button>
          </div>
          {savedCVs.length===0
            ? <p className="text-xs text-zinc-400">No saved CVs yet. Click Save to store your current CV.</p>
            : <div className="grid grid-cols-3 gap-2">
                {savedCVs.map(s=>(
                  <div key={s.id} className="p-3 border border-zinc-200 rounded-xl space-y-2 hover:border-zinc-300 transition-all">
                    <p className="text-xs font-semibold text-zinc-900">{s.name}</p>
                    <p className="text-[10px] text-zinc-400">{s.personalInfo.fullName || 'Unnamed'} · {s.updatedAt?.toDate?.()?.toLocaleDateString?.()??''}</p>
                    <div className="flex gap-1">
                      <button onClick={()=>{ const {id,createdAt,updatedAt,...rest}=s; setCV(rest); setCvId(s.id); setShowSaved(false); }}
                        className="flex-1 text-xs py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all">Load</button>
                      <button onClick={async()=>{ if(!user) return; await deleteCV(user.uid,s.id); setSavedCVs(p=>p.filter(x=>x.id!==s.id)); }}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={11}/></button>
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

// ─── CV Preview ───────────────────────────────────────────────────────────────
function CVPreview({ cv, accentColor }: { cv: Omit<CVDoc,'id'|'createdAt'|'updatedAt'>; accentColor: string }) {
  const p = cv.personalInfo;
  return (
    <div className="text-xs leading-relaxed space-y-3 font-sans" style={{ fontFamily:'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ borderLeft:`4px solid ${accentColor}`, paddingLeft:'10px' }}>
        <p className="text-base font-bold text-zinc-900">{p.fullName || 'Your Name'}</p>
        <p className="text-zinc-500 text-[11px]">
          {[p.email, p.phone, p.location].filter(Boolean).join(' · ')}
        </p>
        {(p.linkedin||p.website)&&<p className="text-[10px] text-zinc-400">{[p.linkedin,p.website].filter(Boolean).join(' · ')}</p>}
      </div>
      {p.summary&&<p className="text-zinc-600 text-[11px] leading-relaxed">{p.summary}</p>}

      {/* Experience */}
      {cv.experience.length>0&&(
        <Section title="Experience" color={accentColor}>
          {cv.experience.map((e,i)=>(
            <div key={i} className="space-y-0.5">
              <div className="flex justify-between">
                <span className="font-semibold text-zinc-800">{e.title||'Role'} — {e.company||'Company'}</span>
                <span className="text-zinc-400">{e.startDate}{e.startDate&&(e.endDate||e.current)?'–':''}{e.current?'Present':e.endDate}</span>
              </div>
              {e.location&&<p className="text-zinc-400 text-[10px]">{e.location}</p>}
              {e.description&&<p className="text-zinc-600 whitespace-pre-line">{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {cv.education.length>0&&(
        <Section title="Education" color={accentColor}>
          {cv.education.map((e,i)=>(
            <div key={i} className="flex justify-between">
              <div>
                <span className="font-semibold text-zinc-800">{e.degree||'Degree'}</span>
                {e.school&&<span className="text-zinc-500"> · {e.school}</span>}
              </div>
              <span className="text-zinc-400">{e.year}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {cv.skills.length>0&&(
        <Section title="Skills" color={accentColor}>
          <p className="text-zinc-600">{cv.skills.join(' · ')}</p>
        </Section>
      )}

      {/* Projects */}
      {cv.projects.length>0&&(
        <Section title="Projects" color={accentColor}>
          {cv.projects.map((p,i)=>(
            <div key={i} className="space-y-0.5">
              <span className="font-semibold text-zinc-800">{p.name||'Project'}</span>
              {p.tech&&<span className="text-zinc-400"> · {p.tech}</span>}
              {p.description&&<p className="text-zinc-600">{p.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Certs */}
      {cv.certifications.length>0&&(
        <Section title="Certifications" color={accentColor}>
          {cv.certifications.map((c,i)=><p key={i} className="text-zinc-600">• {c}</p>)}
        </Section>
      )}

      {!p.fullName&&cv.experience.length===0&&(
        <p className="text-zinc-300 text-center py-4">Start filling in the form to see your CV preview</p>
      )}
    </div>
  );
}

function Section({ title, color, children }: { title:string; color:string; children:React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{title}</p>
      <div className="h-px mb-1" style={{ background: color, opacity:0.3 }}/>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function EmptySection({ label, onAdd }: { label:string; onAdd:()=>void }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2 border-2 border-dashed border-zinc-200 rounded-xl">
      <p className="text-xs text-zinc-400">{label}</p>
      <button onClick={onAdd} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
        <Plus size={12}/>Add entry
      </button>
    </div>
  );
}

function Trash2({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4h6v2"/></svg>;
}

function setPath(obj: any, path: string, val: any): any {
  const parts = path.split('.');
  if (parts.length === 1) return { ...obj, [parts[0]]: val };
  return { ...obj, [parts[0]]: setPath(obj[parts[0]], parts.slice(1).join('.'), val) };
}
