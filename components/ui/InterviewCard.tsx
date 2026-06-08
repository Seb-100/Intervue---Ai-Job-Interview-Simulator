// import React from 'react';
// import { Play, Clock, ChevronRight } from 'lucide-react';
// import { ScoreRing } from '../ui/ScoreRing';
// import { Interview } from '../ui/types';
// import { LEVEL_COLORS, TYPE_ICONS } from '../mockData'; // we'll create this

// interface InterviewCardProps {
//   interview: Interview;
//   onStart?: () => void;
// }

// export function InterviewCard({ interview, onStart }: InterviewCardProps) {
//   const lc = LEVEL_COLORS[interview.level];

//   return (
//     <div className="bg-white border border-zinc-200/60 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-all">
//       <div className="shrink-0">
//         {interview.score !== undefined ? (
//           <ScoreRing score={interview.score} />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
//             <Play size={16} fill="currentColor" />
//           </div>
//         )}
//       </div>

//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <p className="text-sm font-medium text-zinc-900 truncate">{interview.title}</p>
//           <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${lc.bg} ${lc.text} shrink-0`}>
//             {interview.level}
//           </span>
//         </div>
//         <div className="flex items-center gap-2 text-[11px] text-zinc-400">
//           <span className="flex items-center gap-1">{React.createElement(TYPE_ICONS[interview.type], { size: 12 })}{interview.type}</span>
//           <span>·</span><span>{interview.questionCount}Q</span>
//           <span>·</span><span className="flex items-center gap-1"><Clock size={10}/>{interview.duration}</span>
//           <span>·</span><span>{interview.date}</span>
//         </div>
//       </div>

//       <div className="shrink-0">
//         {interview.status === "ready" ? (
//           <button 
//             onClick={onStart}
//             className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all"
//           >
//             <Play size={11} fill="currentColor" /> Start
//           </button>
//         ) : (
//           <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-medium hover:bg-zinc-100 transition-all">
//             Report <ChevronRight size={11} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }