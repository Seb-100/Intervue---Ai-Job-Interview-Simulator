'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, ChevronDown, Briefcase, MapPin, DollarSign, Calendar, StickyNote, X, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscribeJobApplications, addJobApplication, updateJobApplication, deleteJobApplication,
  type JobApplicationDoc, type AppStatus, type Priority,
} from '@/lib/firestore';

const COLUMNS: { id: AppStatus; label: string; color: string; dot: string }[] = [
  { id: 'wishlist',  label: 'Wishlist',  color: 'bg-zinc-50   border-zinc-200',   dot: 'bg-zinc-400' },
  { id: 'applied',   label: 'Applied',   color: 'bg-blue-50   border-blue-200',    dot: 'bg-blue-500' },
  { id: 'screening', label: 'Screening', color: 'bg-amber-50  border-amber-200',   dot: 'bg-amber-500' },
  { id: 'interview', label: 'Interview', color: 'bg-violet-50 border-violet-200',  dot: 'bg-violet-500' },
  { id: 'offer',     label: 'Offer 🎉',  color: 'bg-emerald-50 border-emerald-200',dot: 'bg-emerald-500' },
  { id: 'rejected',  label: 'Rejected',  color: 'bg-red-50    border-red-200',     dot: 'bg-red-400' },
];

const PRIORITY_STYLES: Record<Priority, string> = {
  high:   'text-red-600 bg-red-50 border-red-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low:    'text-zinc-500 bg-zinc-100 border-zinc-200',
};

const BLANK: Omit<JobApplicationDoc, 'id'|'createdAt'|'updatedAt'> = {
  company:'', role:'', location:'', salary:'', status:'wishlist',
  appliedDate: new Date().toISOString().split('T')[0],
  deadline:'', notes:'', jobUrl:'', priority:'medium',
};

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder='', type='text' }: {
  label:string; value:string; onChange:(v:string)=>void; placeholder?:string; type?:string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-zinc-400 transition-all"/>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function AppModal({ initial, onSave, onClose }: {
  initial: Omit<JobApplicationDoc,'id'|'createdAt'|'updatedAt'>;
  onSave: (d: Omit<JobApplicationDoc,'id'|'createdAt'|'updatedAt'>)=>void;
  onClose: ()=>void;
}) {
  const [f, setF] = useState(initial);
  const s = (k:string,v:string) => setF(p=>({...p,[k]:v}));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">{initial.company?'Edit application':'New application'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-all"><X size={15}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company *" value={f.company} onChange={v=>s('company',v)} placeholder="Google"/>
            <Field label="Role *" value={f.role} onChange={v=>s('role',v)} placeholder="Software Engineer"/>
            <Field label="Location" value={f.location} onChange={v=>s('location',v)} placeholder="Remote"/>
            <Field label="Salary" value={f.salary} onChange={v=>s('salary',v)} placeholder="£70k–£90k"/>
            <Field label="Applied Date" type="date" value={f.appliedDate} onChange={v=>s('appliedDate',v)}/>
            <Field label="Deadline" type="date" value={f.deadline} onChange={v=>s('deadline',v)}/>
            <Field label="Job URL" value={f.jobUrl} onChange={v=>s('jobUrl',v)} placeholder="https://..."/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['Status','Priority'] as const).map(lbl=>(
              <div key={lbl}>
                <label className="block text-xs font-medium text-zinc-600 mb-1">{lbl}</label>
                <select
                  value={lbl==='Status'?f.status:f.priority}
                  onChange={e=>s(lbl==='Status'?'status':'priority',e.target.value)}
                  className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {lbl==='Status'
                    ? COLUMNS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)
                    : ['high','medium','low'].map(p=><option key={p} value={p}>{p}</option>)
                  }
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Notes</label>
            <textarea value={f.notes} onChange={e=>s('notes',e.target.value)} rows={3}
              placeholder="Contacts, interview prep notes, next steps..."
              className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2.5 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none placeholder:text-zinc-400"/>
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 border-t border-zinc-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition-all">Cancel</button>
          <button onClick={()=>{if(f.company&&f.role) onSave(f);}} disabled={!f.company||!f.role}
            className="flex-1 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 disabled:opacity-40 transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function AppCard({ app, onEdit, onDelete, onMove }:{
  app:JobApplicationDoc; onEdit:()=>void; onDelete:()=>void; onMove:(s:AppStatus)=>void;
}) {
  const [menu,setMenu]=useState(false);
  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-zinc-900 truncate">{app.company}</p>
          <p className="text-[11px] text-zinc-500 truncate">{app.role}</p>
        </div>
        <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border font-medium capitalize ${PRIORITY_STYLES[app.priority]}`}>{app.priority}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {app.location&&<Chip icon={<MapPin size={8}/>}>{app.location}</Chip>}
        {app.salary&&<Chip icon={<DollarSign size={8}/>}>{app.salary}</Chip>}
        {app.appliedDate&&<Chip icon={<Calendar size={8}/>}>{app.appliedDate}</Chip>}
      </div>
      {app.notes&&<p className="text-[10px] text-zinc-400 line-clamp-2 flex items-start gap-1"><StickyNote size={9} className="shrink-0 mt-0.5"/>{app.notes}</p>}
      <div className="flex items-center gap-1 pt-1.5 border-t border-zinc-100">
        <button onClick={onEdit} className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Edit2 size={12}/></button>
        {app.jobUrl&&<a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"><ExternalLink size={12}/></a>}
        <button onClick={onDelete} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={12}/></button>
        <div className="relative ml-auto">
          <button onClick={()=>setMenu(v=>!v)} className="flex items-center gap-0.5 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-100 rounded-lg transition-all">
            Move<ChevronDown size={9}/>
          </button>
          {menu&&(
            <div className="absolute bottom-full right-0 mb-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-20 py-1 min-w-[110px]">
              {COLUMNS.filter(c=>c.id!==app.status).map(c=>(
                <button key={c.id} onClick={()=>{onMove(c.id);setMenu(false);}}
                  className="w-full text-left px-3 py-1.5 text-[11px] text-zinc-600 hover:bg-zinc-50">{c.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({icon,children}:{icon:React.ReactNode;children:React.ReactNode}){
  return <span className="flex items-center gap-0.5 text-[9px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-full">{icon}{children}</span>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function JobTracker() {
  const { user } = useAuth();
  const [apps,setApps] = useState<JobApplicationDoc[]>([]);
  const [loading,setLoading] = useState(true);
  const [modal,setModal] = useState<{mode:'add';status:AppStatus}|{mode:'edit';app:JobApplicationDoc}|null>(null);

  useEffect(()=>{
    if(!user) return;
    return subscribeJobApplications(user.uid, data=>{ setApps(data); setLoading(false); });
  },[user]);

  const save = async(data:Omit<JobApplicationDoc,'id'|'createdAt'|'updatedAt'>)=>{
    if(!user) return;
    if(modal?.mode==='edit') await updateJobApplication(user.uid,modal.app.id,data);
    else await addJobApplication(user.uid,{...data,status:modal?.mode==='add'?modal.status:data.status});
    setModal(null);
  };

  const remove = async(id:string)=>{
    if(!user||!confirm('Remove this application?')) return;
    await deleteJobApplication(user.uid,id);
  };

  const move = async(id:string,status:AppStatus)=>{
    if(!user) return;
    await updateJobApplication(user.uid,id,{status});
  };

  if(loading) return <div className="space-y-4">{Array(3).fill(0).map((_,i)=><div key={i} className="h-20 bg-zinc-100 rounded-2xl animate-pulse"/>)}</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900">Job Tracker</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{apps.length} applications · {apps.filter(a=>a.status==='interview').length} interviews · {apps.filter(a=>a.status==='offer').length} offers</p>
        </div>
        <button onClick={()=>setModal({mode:'add',status:'wishlist'})}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all">
          <Plus size={14}/> Add Application
        </button>
      </div>

      {apps.length>0&&(
        <div className="grid grid-cols-6 gap-2">
          {COLUMNS.map(col=>(
            <div key={col.id} className={`rounded-xl border p-3 text-center ${col.color}`}>
              <p className="text-xl font-black text-zinc-900">{apps.filter(a=>a.status===col.id).length}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{col.label.replace(' 🎉','')}</p>
            </div>
          ))}
        </div>
      )}

      {apps.length===0?(
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Briefcase size={28} className="text-blue-600"/>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">No applications yet</p>
            <p className="text-xs text-zinc-400 mt-1">Track every job you apply to — from wishlist to offer</p>
          </div>
          <button onClick={()=>setModal({mode:'add',status:'wishlist'})}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all">
            <Plus size={14}/> Add first application
          </button>
        </div>
      ):(
        <div className="grid grid-cols-6 gap-3 overflow-x-auto pb-2">
          {COLUMNS.map(col=>{
            const colApps = apps.filter(a=>a.status===col.id);
            return (
              <div key={col.id} className="min-w-[165px] space-y-2">
                <div className="flex items-center gap-1.5 px-1">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`}/>
                  <span className="text-xs font-semibold text-zinc-700 truncate">{col.label}</span>
                  <span className="text-[10px] text-zinc-400 ml-auto">{colApps.length}</span>
                </div>
                <div className="space-y-2 min-h-[60px]">
                  {colApps.map(app=>(
                    <AppCard key={app.id} app={app}
                      onEdit={()=>setModal({mode:'edit',app})}
                      onDelete={()=>remove(app.id)}
                      onMove={status=>move(app.id,status)}/>
                  ))}
                </div>
                <button onClick={()=>setModal({mode:'add',status:col.id})}
                  className="w-full py-2 border-2 border-dashed border-zinc-200 rounded-xl text-[11px] text-zinc-400 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-1">
                  <Plus size={10}/> Add
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modal&&<AppModal initial={modal.mode==='edit'?modal.app:{...BLANK,status:modal.status}} onSave={save} onClose={()=>setModal(null)}/>}
    </div>
  );
}
