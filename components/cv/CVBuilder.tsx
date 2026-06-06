'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Plus, X, Save, RefreshCw, Check, Briefcase, GraduationCap, Wrench, FolderOpen, Award, User, Camera, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import UpgradeModal from '@/components/premium/UpgradeModal';
import { saveCV, getCVs, deleteCV, type CVDoc, type ExperienceEntry, type EducationEntry, type ProjectEntry } from '@/lib/firestore';

type CVFormat = 'standard' | 'african';

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
function TF({ label, value, onChange, placeholder='', full=false, type='text' }: {
  label:string; value:string; onChange:(v:string)=>void; placeholder?:string; full?:boolean; type?:string;
}) {
  return (
    <div className={full?'col-span-2':''}>
      <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400 transition-all"/>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CVBuilder({ lang = 'en' }: { lang?: 'en' | 'fr' }) {
  const { user } = useAuth();
  const { can } = usePremium();
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
  const [format, setFormat]     = useState<CVFormat>('standard');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  // African extra fields (stored alongside personalInfo)
  const [photoBase64, setPhotoBase64] = useState('');
  const [dob,         setDob]         = useState('');
  const [placeOfBirth,setPlaceOfBirth]= useState('');
  const [nationality, setNationality] = useState('');
  const [gender,      setGender]      = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [langs, setLangs]             = useState<{lang:string; level:string}[]>([]);
  const [refs,  setRefs]              = useState<{name:string; title:string; phone:string; email:string}[]>([]);
  const [newLang, setNewLang]         = useState({ lang:'', level:'B2' });

  const isFr = lang === 'fr';
  const t = (en: string, fr: string) => isFr ? fr : en;

  function handleFormatSwitch(f: CVFormat) {
    if (f === 'african' && !can('africanCVFormat')) {
      setShowUpgrade(true);
      return;
    }
    setFormat(f);
  }

  function handlePhoto(file: File) {
    const reader = new FileReader();
    reader.onload = e => setPhotoBase64(e.target?.result as string ?? '');
    reader.readAsDataURL(file);
  }

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
          <h2 className="text-lg font-black text-zinc-900">{t('CV Builder', 'Créateur de CV')}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{t('ATS-friendly, professionally structured CV — saved to your account.','CV professionnel structuré, compatible ATS — sauvegardé sur votre compte.')}</p>
        </div>
        <div className="flex gap-2">
          {/* Format tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1">
            {([
              { id:'standard', en:'Standard', fr:'Standard' },
              { id:'african',  en:'African / Europass', fr:'Africain / Europass', premium:true },
            ] as const).map(f => (
              <button key={f.id} onClick={() => handleFormatSwitch(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  format === f.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                }`}>
                {isFr ? f.fr : f.en}
                {'premium' in f && !can('africanCVFormat') && <Lock size={9} className="text-amber-500"/>}
              </button>
            ))}
          </div>
          <button onClick={loadSaved} className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
            {t('Saved CVs','CVs sauvegardés')}
          </button>
          <button onClick={()=>setPreview(v=>!v)} className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50 transition-all">
            <Eye size={12}/>{preview? t('Edit','Modifier') : t('Preview','Aperçu')}
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all disabled:opacity-50">
            {loading?<RefreshCw size={12} className="animate-spin"/>:saved?<Check size={12}/>:<Save size={12}/>}
            {saved? t('Saved!','Sauvegardé!') :loading? t('Saving…','Sauvegarde…') : t('Save','Sauvegarder')}
          </button>
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <UpgradeModal
          featureName="African / Europass CV Format"
          featureNameFr="Format CV Africain / Europass"
          onClose={() => setShowUpgrade(false)}
        />
      )}

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
                <h3 className="text-sm font-semibold text-zinc-900">{t('Personal Information','Informations personnelles')}</h3>

                {/* Photo upload — African format only */}
                {format === 'african' && (
                  <div className="flex items-start gap-4">
                    <div
                      onClick={() => photoRef.current?.click()}
                      className="w-20 h-24 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all overflow-hidden shrink-0">
                      {photoBase64
                        ? <img src={photoBase64} alt="Photo" className="w-full h-full object-cover"/>
                        : <><Camera size={18} className="text-zinc-400"/><span className="text-[10px] text-zinc-400">Photo</span></>}
                      <input ref={photoRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { if(e.target.files?.[0]) handlePhoto(e.target.files[0]); }}/>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-xs font-medium text-zinc-700">{t('Professional photo','Photo professionnelle')}</p>
                      <p className="text-[10px] text-zinc-400">{t('Required on most African CVs. Smart, professional attire.','Obligatoire sur la plupart des CV africains. Tenue professionnelle.')}</p>
                      {photoBase64 && (
                        <button onClick={() => setPhotoBase64('')} className="text-[10px] text-red-500 hover:text-red-700">
                          {t('Remove photo','Supprimer la photo')}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <TF label={t('Full name','Nom complet')} value={cv.personalInfo.fullName} onChange={v=>pi('fullName',v)} placeholder="Jean-Pierre Nkoa" full/>
                  <TF label={t('Email','E-mail')} value={cv.personalInfo.email} onChange={v=>pi('email',v)} placeholder="j.nkoa@email.com"/>
                  <TF label={t('Phone','Téléphone')} value={cv.personalInfo.phone} onChange={v=>pi('phone',v)} placeholder="+237 6 00 00 00 00"/>
                  <TF label={t('Location / City','Ville / Lieu')} value={cv.personalInfo.location} onChange={v=>pi('location',v)} placeholder="Douala, Cameroun"/>
                  <TF label="LinkedIn" value={cv.personalInfo.linkedin} onChange={v=>pi('linkedin',v)} placeholder="linkedin.com/in/..."/>
                  <TF label={t('Website / GitHub','Site web / GitHub')} value={cv.personalInfo.website} onChange={v=>pi('website',v)} placeholder="github.com/..."/>
                </div>

                {/* African format extra personal fields */}
                {format === 'african' && (
                  <div className="space-y-3 pt-2 border-t border-zinc-100">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Globe size={11}/> {t('Additional details (African CV standard)','Informations complémentaires (norme CV africain)')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <TF label={t('Date of birth','Date de naissance')} value={dob} onChange={setDob} placeholder="15/03/1995" type="text"/>
                      <TF label={t('Place of birth','Lieu de naissance')} value={placeOfBirth} onChange={setPlaceOfBirth} placeholder="Yaoundé, Cameroun"/>
                      <TF label={t('Nationality','Nationalité')} value={nationality} onChange={setNationality} placeholder="Camerounaise"/>
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 mb-1">{t('Gender / Sexe','Sexe')}</label>
                        <select value={gender} onChange={e=>setGender(e.target.value)}
                          className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
                          <option value="">—</option>
                          <option value="Male">Male / Masculin</option>
                          <option value="Female">Female / Féminin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 mb-1">{t('Marital status','Situation matrimoniale')}</label>
                        <select value={maritalStatus} onChange={e=>setMaritalStatus(e.target.value)}
                          className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
                          <option value="">—</option>
                          <option value="Single">Single / Célibataire</option>
                          <option value="Married">Married / Marié(e)</option>
                          <option value="Divorced">Divorced / Divorcé(e)</option>
                          <option value="Widowed">Widowed / Veuf/Veuve</option>
                        </select>
                      </div>
                    </div>

                    {/* Languages section */}
                    <div>
                      <p className="text-xs font-semibold text-zinc-700 mb-2">{t('Languages','Langues')}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {langs.map((l,i) => (
                          <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full">
                            {l.lang} ({l.level})
                            <button onClick={() => setLangs(prev=>prev.filter((_,j)=>j!==i))} className="text-blue-400 hover:text-blue-700"><X size={10}/></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={newLang.lang} onChange={e=>setNewLang(p=>({...p,lang:e.target.value}))}
                          placeholder={t('Language (e.g. French)','Langue (ex. Français)')}
                          className="flex-1 text-xs border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200"/>
                        <select value={newLang.level} onChange={e=>setNewLang(p=>({...p,level:e.target.value}))}
                          className="text-xs border border-zinc-200 rounded-xl px-2 py-2 bg-zinc-50 focus:outline-none">
                          {['A1','A2','B1','B2','C1','C2','Native/Natif'].map(l=><option key={l} value={l}>{l}</option>)}
                        </select>
                        <button onClick={() => { if(newLang.lang.trim()) { setLangs(p=>[...p,{...newLang}]); setNewLang({lang:'',level:'B2'}); }}}
                          className="px-3 py-2 bg-zinc-950 text-white rounded-xl text-xs hover:bg-zinc-800"><Plus size={13}/></button>
                      </div>
                    </div>

                    {/* References */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-zinc-700">{t('References','Références')}</p>
                        <button onClick={() => setRefs(p=>[...p,{name:'',title:'',phone:'',email:''}])}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><Plus size={11}/>{t('Add','Ajouter')}</button>
                      </div>
                      {refs.map((ref, i) => (
                        <div key={i} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2 mb-2 relative">
                          <button onClick={() => setRefs(p=>p.filter((_,j)=>j!==i))} className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"><X size={12}/></button>
                          <div className="grid grid-cols-2 gap-2 pr-6">
                            <TF label={t('Full name','Nom complet')} value={ref.name} onChange={v=>setRefs(p=>{const r=[...p];r[i]={...r[i],name:v};return r;})} placeholder="Dr. Jean Dupont"/>
                            <TF label={t('Title / Role','Titre / Poste')} value={ref.title} onChange={v=>setRefs(p=>{const r=[...p];r[i]={...r[i],title:v};return r;})} placeholder="Directeur General"/>
                            <TF label={t('Phone','Téléphone')} value={ref.phone} onChange={v=>setRefs(p=>{const r=[...p];r[i]={...r[i],phone:v};return r;})} placeholder="+237 6 00 00 00 00"/>
                            <TF label="Email" value={ref.email} onChange={v=>setRefs(p=>{const r=[...p];r[i]={...r[i],email:v};return r;})} placeholder="j.dupont@company.cm"/>
                          </div>
                        </div>
                      ))}
                      {refs.length === 0 && (
                        <p className="text-[11px] text-zinc-400">{t('Add at least 2 professional references — expected on African CVs.','Ajoutez au moins 2 références professionnelles — attendues sur les CV africains.')}</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    {format==='african'
                      ? t('Objective / Profil professionnel','Objectif professionnel / Profil')
                      : t('Professional summary','Résumé professionnel')}
                  </label>
                  <textarea value={cv.personalInfo.summary} onChange={e=>pi('summary',e.target.value)} rows={4}
                    placeholder={format==='african'
                      ? t('Ingénieur informatique de 5 ans d\'expérience, spécialisé en...','Software Engineer with 5 years experience, specialising in...')
                      : t('3–4 lines: who you are, what you bring, and what you\'re looking for...','3–4 lignes: qui vous êtes, ce que vous apportez...')}
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
