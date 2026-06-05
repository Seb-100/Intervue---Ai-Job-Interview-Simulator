import { Interview } from "./ui/types";
import { Zap, User, Target, BarChart2 } from "lucide-react";

export const MOCK_INTERVIEWS: Interview[] = [
  { id:"1", title:"Frontend Developer Interview", field:"Software Engineering", level:"mid", type:"technical", date:"Today, 2:30 PM", score:82, duration:"24 min", status:"completed", questionCount:8 },
  { id:"2", title:"System Design Round", field:"Software Engineering", level:"senior", type:"system-design", date:"Yesterday", score:74, duration:"31 min", status:"completed", questionCount:6 },
  { id:"3", title:"Behavioral Interview", field:"Product Management", level:"mid", type:"behavioral", date:"2 days ago", score:91, duration:"18 min", status:"completed", questionCount:10 },
  { id:"4", title:"Data Engineer Technical", field:"Data Science", level:"senior", type:"technical", date:"3 days ago", score:68, duration:"27 min", status:"completed", questionCount:8 },
  { id:"5", title:"Mixed PM Interview", field:"Product Management", level:"lead", type:"mixed", date:"5 days ago", score:79, duration:"22 min", status:"completed", questionCount:10 },
  { id:"6", title:"Backend Engineer Session", field:"Software Engineering", level:"junior", type:"technical", date:"Ready", duration:"—", status:"ready", questionCount:6 },
];

export const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  junior: { bg:"bg-emerald-50 border-emerald-100", text:"text-emerald-700" },
  mid:    { bg:"bg-blue-50 border-blue-100", text:"text-blue-700" },
  senior: { bg:"bg-violet-50 border-violet-100", text:"text-violet-700" },
  lead:   { bg:"bg-amber-50 border-amber-100", text:"text-amber-700" },
};

export const TYPE_ICONS: Record<string, typeof Zap> = {
  technical:       Zap,
  behavioral:      User,
  mixed:           Target,
  "system-design": BarChart2,
};