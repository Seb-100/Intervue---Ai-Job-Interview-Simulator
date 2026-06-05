import React from 'react';
import { ChevronUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

export function StatCard({ label, value, sub, icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 space-y-3 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
        {trend !== undefined && (
          <span className={`text-[10px] font-medium flex items-center gap-0.5 ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            <ChevronUp size={11} className={trend < 0 ? "rotate-180" : ""} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-black text-zinc-900">{value}</div>
        <div className="text-xs font-normal text-zinc-500 mt-0.5">{label}</div>
      </div>
      <div className="text-[10px] text-zinc-400 font-normal">{sub}</div>
    </div>
  );
}