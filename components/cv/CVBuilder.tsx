"use client";

import React, { useState } from 'react';
import { Eye, Download, Plus, X } from 'lucide-react';

export default function CVBuilder() {
  const [activeSection, setActiveSection] = useState("experience");
  const sections = ["summary", "experience", "skills", "education", "projects", "certifications"];

  const templates = [
    { name: "Clean", style: "border-l-4 border-blue-600 bg-white" },
    { name: "Minimal", style: "bg-zinc-50" },
    { name: "Modern", style: "bg-zinc-900" },
    { name: "Executive", style: "border-t-4 border-zinc-900 bg-white" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900">CV Builder</h2>
          <p className="text-xs text-zinc-400 font-normal mt-0.5">ATS-friendly CV with AI-assisted content suggestions.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 hover:bg-zinc-50">
            <Eye size={13} /> Preview
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800">
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sections Sidebar */}
        <div className="col-span-2 bg-white border border-zinc-200/60 rounded-2xl p-3 space-y-1 h-fit">
          {sections.map(s => (
            <button 
              key={s} 
              onClick={() => setActiveSection(s)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs capitalize transition-all ${activeSection === s ? "bg-zinc-950 text-white font-medium" : "text-zinc-500 hover:bg-zinc-50"}`}
            >
              {s}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-100 mt-2">
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs text-blue-600 flex items-center gap-1.5 hover:bg-blue-50 transition-all">
              <Plus size={12} /> Add section
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-5 space-y-4">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-900 capitalize">{activeSection}</h3>
              <button className="text-xs flex items-center gap-1 text-blue-600">✦ AI suggest</button>
            </div>

            {/* Example for Experience */}
            {activeSection === "experience" && (
              <div className="space-y-4">
                {/* ... (experience fields - same as original) */}
                <div className="p-4 bg-zinc-50 rounded-xl space-y-2 border border-zinc-100">
                  <div className="grid grid-cols-2 gap-2">
                    <input defaultValue="Senior Frontend Developer" className="text-xs border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    <input defaultValue="TechCorp" className="text-xs border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <input defaultValue="2021 – Present" className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  <textarea defaultValue="Led migration from React 16 to React 18..." rows={2} className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <button className="w-full py-2 border-2 border-dashed border-zinc-200 rounded-xl text-xs text-zinc-400 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-1">
                  <Plus size={12} /> Add experience
                </button>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "Python", "GraphQL", "PostgreSQL", "AWS", "Docker"].map(sk => (
                    <span key={sk} className="text-xs px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                      {sk}<button className="ml-1 text-blue-400 hover:text-blue-700"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                {/* Add skill input */}
              </div>
            )}

            {!["experience", "skills"].includes(activeSection) && (
              <div className="h-24 flex items-center justify-center text-sm text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
                Click to edit <span className="capitalize ml-1 font-medium">{activeSection}</span>
              </div>
            )}
          </div>

          {/* Templates */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-zinc-900">Template</h3>
            <div className="grid grid-cols-4 gap-2">
              {templates.map((t, i) => (
                <div key={t.name} className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${i === 0 ? "border-blue-500" : "border-transparent hover:border-zinc-200"}`}>
                  <div className={`h-14 ${t.style}`} />
                  <p className="text-[10px] text-zinc-600 text-center py-1">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="col-span-5 bg-white border border-zinc-200/60 rounded-2xl p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-3">Live preview</p>
          <div className="bg-white border border-zinc-100 rounded-xl p-4 space-y-3 text-[10px] leading-relaxed">
            {/* Preview content same as original */}
            <div className="border-l-4 border-blue-600 pl-3">
              <p className="text-sm font-bold text-zinc-900">John Doe</p>
              <p className="text-zinc-500">Senior Frontend Developer · john@email.com · LinkedIn</p>
            </div>
            {/* ... rest of preview */}
          </div>
        </div>
      </div>
    </div>
  );
}