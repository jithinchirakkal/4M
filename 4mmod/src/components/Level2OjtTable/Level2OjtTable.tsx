


// import React, { useEffect, useState } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import {
//   Save, CheckCircle, XCircle, Clock, ArrowLeft,
//   Calendar, BarChart3, Shield, Loader2, 
//   GraduationCap, TrendingUp, AlertTriangle, Award, Info
// } from 'lucide-react';

// // ────────────────────────────────────────────────
// // Types
// // ────────────────────────────────────────────────

// interface OJTRecordData {
//   changeId: string;
//   fourMChangeId: number;
//   shopfloorName: string;
//   lineName: string;
//   stationName: string;
//   departmentName: string;
//   processName: string;
// }

// interface DailyScore {
//   id?: number;
//   day: number;
//   date: string | null;
//   plan: number | string | null;
//   actual: number | string | null;
//   production_marks: number;
//   rejections: number | string | null;
//   quality_marks: number;
//   created_at?: string;
//   updated_at?: string;
// }

// interface OJTRecord {
//   id: number;
//   status: 'in_progress' | 'pass' | 'fail';
//   total_production_marks: number;
//   total_quality_marks: number;
//   overall_marks: number;
//   daily_scores: DailyScore[];
// }

// interface OnJobTrainingProps {
//   recordData?: OJTRecordData | null;
//   onBack?: () => void;
// }

// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// // ────────────────────────────────────────────────
// // Helpers – strict mark calculation
// // ────────────────────────────────────────────────

// const getProductionMarks = (plan: any, actual: any): number => {
//   // Important: only calculate when both values are meaningfully present
//   if (plan == null || actual == null) return 0;
//   if (plan === '' || actual === '') return 0;

//   const p = Number(plan);
//   const a = Number(actual);

//   if (isNaN(p) || isNaN(a) || p <= 0) return 0;

//   const percentage = (a / p) * 100;

//   if (percentage >= 90) return 4;
//   if (percentage >= 75) return 3;
//   if (percentage >= 60) return 2;
//   return a > 0 ? 1 : 0;
// };

// const getQualityMarks = (rejections: any): number => {
//   if (rejections == null || rejections === '') return 0;

//   const r = Number(rejections);
//   if (isNaN(r)) return 0;

//   if (r === 0) return 4;
//   if (r <= 2) return 3;
//   if (r <= 5) return 2;
//   return 1;
// };

// // ────────────────────────────────────────────────
// // UI Components (StatusBadge, MarkBadge, StatCard)
// // ────────────────────────────────────────────────

// const StatusBadge = ({ status }: { status: string }) => {
//   const config: Record<string, { bg: string; text: string; icon: any; label: string }> = {
//     pass:       { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle, label: 'PASSED' },
//     fail:       { bg: 'bg-rose-500',   text: 'text-white', icon: XCircle,    label: 'FAILED'  },
//     in_progress: { bg: 'bg-amber-500',  text: 'text-white', icon: Clock,      label: 'IN PROGRESS' }
//   };

//   const current = config[status] || config.in_progress;
//   const Icon = current.icon;

//   return (
//     <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-md ${current.bg} ${current.text}`}>
//       <Icon className="w-3.5 h-3.5" />
//       {current.label}
//     </span>
//   );
// };

// const MarkBadge = ({ marks }: { marks: number }) => {
//   const styleMap = {
//     4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//     3: 'bg-blue-100    text-blue-700    border-blue-200',
//     2: 'bg-amber-100  text-amber-700   border-amber-200',
//     1: 'bg-rose-100   text-rose-700    border-rose-200',
//     0: 'bg-gray-50    text-gray-400    border-gray-200'
//   };

//   const style = styleMap[marks as keyof typeof styleMap] || styleMap[0];

//   return (
//     <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${style}`}>
//       {marks}
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: {
//   title: string;
//   value: string | number;
//   icon: any;
//   colorClass: string;
//   subtext?: string;
// }) => (
//   <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
//     <div className="flex justify-between items-start mb-4">
//       <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '50')}`}>
//         <Icon className={`w-5 h-5 ${colorClass}`} />
//       </div>
//       {subtext && (
//         <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-tight">
//           {subtext}
//         </span>
//       )}
//     </div>
//     <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h3>
//     <p className="text-2xl font-black text-slate-800">{value}</p>
//   </div>
// );

// // ────────────────────────────────────────────────
// // Main Component
// // ────────────────────────────────────────────────

// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const getInitialRecordData = (): OJTRecordData => {
//     if (recordData) return recordData;
//     if (location.state) return location.state as OJTRecordData;

//     const stored = localStorage.getItem("ojt_record_data");
//     if (stored) {
//       try { return JSON.parse(stored); } catch {}
//     }

//     return {
//       changeId: '',
//       fourMChangeId: 0,
//       shopfloorName: '',
//       lineName: '',
//       stationName: '',
//       departmentName: '',
//       processName: ''
//     };
//   };

//   const initialData = getInitialRecordData();

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   const showToast = (msg: string, type: 'success' | 'error') => {
//     setToast({ message: msg, type });
//     setTimeout(() => setToast(null), 3400);
//   };

//   // Fetch or create record
//   useEffect(() => {
//     if (!initialData.changeId && !id) return;

//     const init = async () => {
//       setLoading(true);
//       try {
//         let url = id 
//           ? `${API_BASE_URL}/ojt-records/${id}/`
//           : `${API_BASE_URL}/ojt-records/create_from_change/`;

//         const method = id ? 'GET' : 'POST';
//         const body = id ? null : JSON.stringify({ four_m_change_record_id: initialData.changeId });

//         const res = await fetch(url, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body
//         });

//         if (!res.ok) throw new Error('API error');
//         const data = await res.json();

//         setOjtRecord(data);
//         setDailyScores(data.daily_scores || []);
//       } catch (err) {
//         showToast("Failed to load training record", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, [id, initialData.changeId]);

//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     setDailyScores(prev => {
//       const next = [...prev];
//       // @ts-expect-error
//       next[index][field] = value === '' ? null : value;

//       // Recalculate marks only when relevant fields change
//       if (field === 'plan' || field === 'actual') {
//         next[index].production_marks = getProductionMarks(
//           next[index].plan,
//           next[index].actual
//         );
//       }
//       if (field === 'rejections') {
//         next[index].quality_marks = getQualityMarks(next[index].rejections);
//       }

//       return next;
//     });
//   };

//   const saveDay = async (idx: number) => {
//     if (!ojtRecord?.id) return;
//     setSavingDay(idx);

//     const day = dailyScores[idx];

//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: day.day,
//           date: day.date || null,
//           plan: day.plan,
//           actual: day.actual,
//           rejections: day.rejections,
//         })
//       });

//       if (!res.ok) throw new Error();

//       const updated = await res.json();
//       setOjtRecord(updated);
//       setDailyScores(updated.daily_scores);
//       showToast(`Day ${day.day} saved • ${updated.status.toUpperCase()}`, "success");
//     } catch {
//       showToast("Could not save day", "error");
//     } finally {
//       setSavingDay(null);
//     }
//   };

//   const handleBack = () => {
//     localStorage.removeItem("ojt_record_data");
//     if (onBack) {
//       onBack();
//     } else {
//       const returnId = localStorage.getItem("return_to_detail_id");
//       if (returnId) {
//         navigate(`/change-requests/${returnId}`);
//       } else {
//         navigate(-1);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-50">
//         <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl bg-white border-l-4 ${toast.type === 'success' ? 'border-emerald-500' : 'border-rose-500'}`}>
//             {toast.type === 'success' ? <CheckCircle className="text-emerald-500" /> : <AlertTriangle className="text-rose-500" />}
//             <span className="font-semibold">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Top Nav */}
//       <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 md:px-10 justify-between">
//         <div className="flex items-center gap-5">
//           <button onClick={handleBack} className="p-2.5 hover:bg-slate-100 rounded-xl transition">
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h1 className="text-lg font-black tracking-tight flex items-center gap-2.5">
//             <GraduationCap className="text-blue-600 w-5 h-5" />
//             OJT Assessment
//           </h1>
//         </div>
//         {ojtRecord && <StatusBadge status={ojtRecord.status} />}
//       </nav>

//       <main className="max-w-7xl mx-auto px-5 md:px-8 pt-8 space-y-8">

//         {/* Hero / Summary */}
//         <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
//           <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
//           <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
//             <div>
//               <p className="text-blue-300 text-xs font-black uppercase tracking-wider mb-2">Workstation</p>
//               <h2 className="text-3xl md:text-4xl font-black tracking-tight">{initialData.stationName || '—'}</h2>
//               <div className="mt-3 flex flex-wrap gap-4 text-xs opacity-80 font-medium">
//                 <span>{initialData.changeId || '—'}</span>
//                 <span>•</span>
//                 <span>{initialData.lineName || '—'}</span>
//                 <span>•</span>
//                 <span>{initialData.shopfloorName || '—'}</span>
//               </div>
//             </div>

//             <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center min-w-[220px]">
//               <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-2">Total Score</p>
//               <div className="text-5xl md:text-6xl font-black">
//                 {ojtRecord?.overall_marks ?? 0}
//                 <span className="text-2xl opacity-40 ml-1">/48</span>
//               </div>
//               <div className={`mt-4 inline-block px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${ojtRecord?.status === 'pass' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
//                 {ojtRecord?.status?.replace('_', ' ') || 'in progress'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats row */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
//           <StatCard title="Production" value={`${ojtRecord?.total_production_marks ?? 0}/24`} icon={TrendingUp}    colorClass="text-blue-600"    subtext="Output" />
//           <StatCard title="Quality"    value={`${ojtRecord?.total_quality_marks ?? 0}/24`}    icon={Shield}        colorClass="text-emerald-600" subtext="Defects" />
//           <StatCard title="Progress"   value={`${dailyScores.filter(d => d.actual != null).length}/6`} icon={Calendar}     colorClass="text-indigo-600"  subtext="Days" />
//           <StatCard title="Status"     value={ojtRecord?.status?.toUpperCase() || '—'}        icon={Award}         colorClass={ojtRecord?.status === 'pass' ? 'text-emerald-600' : 'text-amber-600'} />
//         </div>

//         {/* Scoring table */}
//         <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
//           <div className="px-6 md:px-10 py-5 bg-slate-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm flex items-center gap-3">
//               <BarChart3 className="text-blue-600 w-5 h-5" />
//               Performance Log
//             </h3>
//             <button
//               onClick={() => setShowCriteria(!showCriteria)}
//               className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
//             >
//               <Info className="w-4 h-4" />
//               SCORING RULES
//             </button>
//           </div>

//           {showCriteria && (
//             <div className="px-6 md:px-10 py-6 bg-blue-50 border-b text-sm">
//               <h4 className="font-bold text-blue-900 mb-4">How marks are calculated</h4>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="font-semibold text-blue-800 mb-2">Production (plan vs actual)</p>
//                   <ul className="space-y-1.5 text-slate-700">
//                     <li>• ≥ 90% → 4 marks</li>
//                     <li>• 75–89% → 3 marks</li>
//                     <li>• 60–74% → 2 marks</li>
//                     <li>• 0 but 60% → 1 mark</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-blue-800 mb-2">Quality (rejections)</p>
//                   <ul className="space-y-1.5 text-slate-700">
//                     <li>• 0 rejections → 4 marks</li>
//                     <li>• 1–2 → 3 marks</li>
//                     <li>• 3–5 → 2 marks</li>
//                     <li>• 5 → 1 mark</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[720px]">
//               <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase border-b">
//                 <tr>
//                   <th className="px-8 py-5 text-left">Day</th>
//                   <th className="px-6 py-5 text-left">Date</th>
//                   <th className="px-4 py-5 text-center">Plan</th>
//                   <th className="px-4 py-5 text-center">Actual</th>
//                   <th className="px-4 py-5 text-center">Rej.</th>
//                   <th className="px-4 py-5 text-center">Prod</th>
//                   <th className="px-4 py-5 text-center">Qual</th>
//                   <th className="px-8 py-5 text-right">Save</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {dailyScores.map((row, idx) => (
//                   <tr key={row.id ?? idx} className="hover:bg-slate-50/60 transition-colors">
//                     <td className="px-8 py-5 font-black text-slate-800">Day {row.day}</td>
//                     <td className="px-6 py-5">
//                       <input
//                         type="date"
//                         value={row.date ?? ''}
//                         onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                         className={`w-full max-w-[140px] px-3 py-1.5 rounded-lg border text-sm font-medium focus:border-blue-400 outline-none transition-all ${
//                           !row.date && row.actual != null ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
//                         }`}
//                       />
//                     </td>
//                     <td className="px-4 py-5 text-center">
//                       <input
//                         type="number"
//                         value={row.plan ?? ''}
//                         onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                         className="w-16 text-center border-b-2 border-slate-200 focus:border-blue-400 outline-none font-medium text-sm"
//                         min="0"
//                       />
//                     </td>
//                     <td className="px-4 py-5 text-center">
//                       <input
//                         type="number"
//                         value={row.actual ?? ''}
//                         onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                         className="w-16 text-center border-b-2 border-slate-200 focus:border-blue-400 outline-none font-black text-blue-700 text-sm"
//                         min="0"
//                       />
//                     </td>
//                     <td className="px-4 py-5 text-center">
//                       <input
//                         type="number"
//                         value={row.rejections ?? ''}
//                         onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                         className="w-16 text-center border-b-2 border-slate-200 focus:border-rose-400 outline-none font-medium text-sm"
//                         min="0"
//                       />
//                     </td>
//                     <td className="px-4 py-5">
//                       <div className="flex justify-center">
//                         <MarkBadge marks={row.production_marks} />
//                       </div>
//                     </td>
//                     <td className="px-4 py-5">
//                       <div className="flex justify-center">
//                         <MarkBadge marks={row.quality_marks} />
//                       </div>
//                     </td>
//                     <td className="px-8 py-5 text-right">
//                       <button
//                         onClick={() => saveDay(idx)}
//                         disabled={savingDay === idx}
//                         className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition disabled:opacity-40"
//                       >
//                         {savingDay === idx ? (
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : (
//                           <Save className="w-4 h-4" />
//                         )}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default OnJobTraining;



import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Save, CheckCircle, XCircle, Clock, ArrowLeft,
  Calendar, BarChart3, Shield, Loader2,
  GraduationCap, TrendingUp, AlertTriangle, Award, Info, X
} from 'lucide-react';

// ────────────────────────────────────────────────
// Types (unchanged)
// ────────────────────────────────────────────────

interface OJTRecordData {
  changeId: string;
  fourMChangeId: number;
  shopfloorName: string;
  lineName: string;
  stationName: string;
  departmentName: string;
  processName: string;
}

interface DailyScore {
  id?: number;
  day: number;
  date: string | null;
  plan: number | string | null;
  actual: number | string | null;
  production_marks: number;
  rejections: number | string | null;
  quality_marks: number;
  created_at?: string;
  updated_at?: string;
}

interface OJTRecord {
  id: number;
  status: 'in_progress' | 'pass' | 'fail';
  total_production_marks: number;
  total_quality_marks: number;
  overall_marks: number;
  daily_scores: DailyScore[];
}

interface OnJobTrainingProps {
  recordData?: OJTRecordData | null;
  onBack?: () => void;           // ← This is what ChangeRequestDetail passes
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ────────────────────────────────────────────────
// Mark calculation helpers (unchanged)
// ────────────────────────────────────────────────

const getProductionMarks = (plan: any, actual: any): number => {
  if (plan == null || actual == null) return 0;
  if (plan === '' || actual === '') return 0;
  const p = Number(plan);
  const a = Number(actual);
  if (isNaN(p) || isNaN(a) || p <= 0) return 0;
  const percentage = (a / p) * 100;
  if (percentage >= 90) return 4;
  if (percentage >= 75) return 3;
  if (percentage >= 60) return 2;
  return a > 0 ? 1 : 0;
};

const getQualityMarks = (rejections: any): number => {
  if (rejections == null || rejections === '') return 0;
  const r = Number(rejections);
  if (isNaN(r)) return 0;
  if (r === 0) return 4;
  if (r <= 2) return 3;
  if (r <= 5) return 2;
  return 1;
};

// ────────────────────────────────────────────────
// Reusable UI pieces (slightly cleaned up)
// ────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    pass:        { bg: 'bg-emerald-500',   text: 'text-white', icon: CheckCircle, label: 'PASSED' },
    fail:        { bg: 'bg-rose-500',      text: 'text-white', icon: XCircle,    label: 'FAILED' },
    in_progress: { bg: 'bg-amber-500',     text: 'text-white', icon: Clock,      label: 'IN PROGRESS' }
  };
  const current = config[status as keyof typeof config] || config.in_progress;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-md ${current.bg} ${current.text}`}>
      <Icon className="w-4 h-4" />
      {current.label}
    </span>
  );
};

const MarkBadge = ({ marks }: { marks: number }) => {
  const styles = {
    4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    3: 'bg-blue-100 text-blue-700 border-blue-200',
    2: 'bg-amber-100 text-amber-700 border-amber-200',
    1: 'bg-rose-100 text-rose-700 border-rose-200',
    0: 'bg-gray-50 text-gray-400 border-gray-200'
  };
  const style = styles[marks as keyof typeof styles] || styles[0];

  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base border shadow-sm ${style}`}>
      {marks}
    </div>
  );
};

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────

const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const getInitialRecordData = (): OJTRecordData => {
    if (recordData) return recordData;
    if (location.state) return location.state as OJTRecordData;

    const stored = localStorage.getItem("ojt_record_data");
    if (stored) {
      try { return JSON.parse(stored); } catch {}
    }

    return {
      changeId: '',
      fourMChangeId: 0,
      shopfloorName: '',
      lineName: '',
      stationName: '',
      departmentName: '',
      processName: ''
    };
  };

  const initialData = getInitialRecordData();

  const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch / create record
  useEffect(() => {
    if (!initialData.changeId && !id) return;

    const init = async () => {
      setLoading(true);
      try {
        let url = id
          ? `${API_BASE_URL}/ojt-records/${id}/`
          : `${API_BASE_URL}/ojt-records/create_from_change/`;

        const method = id ? 'GET' : 'POST';
        const body = id ? null : JSON.stringify({ four_m_change_record_id: initialData.changeId });

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        setOjtRecord(data);
        setDailyScores(data.daily_scores || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load OJT record", "error");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, initialData.changeId]);

  const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
    setDailyScores(prev => {
      const next = [...prev];
      // @ts-expect-error
      next[index][field] = value === '' ? null : value;

      if (field === 'plan' || field === 'actual') {
        next[index].production_marks = getProductionMarks(next[index].plan, next[index].actual);
      }
      if (field === 'rejections') {
        next[index].quality_marks = getQualityMarks(next[index].rejections);
      }
      return next;
    });
  };

  const saveDay = async (idx: number) => {
    if (!ojtRecord?.id) return;
    setSavingDay(idx);

    const day = dailyScores[idx];

    try {
      const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: day.day,
          date: day.date || null,
          plan: day.plan,
          actual: day.actual,
          rejections: day.rejections,
        })
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setOjtRecord(updated);
      setDailyScores(updated.daily_scores);
      showToast(`Day ${day.day} saved`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save day", "error");
    } finally {
      setSavingDay(null);
    }
  };

  const isAllDaysCompleted = useMemo(() => {
    if (dailyScores.length !== 6) return false;
    return dailyScores.every(day =>
      day.date && day.date !== '' &&
      day.actual != null && day.actual !== '' &&
      day.plan != null &&
      day.rejections != null
    );
  }, [dailyScores]);

  const canFinalize = isAllDaysCompleted && ojtRecord?.status === 'in_progress';

  const handleFinalizeOJT = async () => {
    if (!ojtRecord?.id || !canFinalize) return;
    setFinalizing(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/finalize/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Finalize submit");
      }

      const updated = await res.json();
      setOjtRecord(updated);
      setDailyScores(updated.daily_scores || []);

      showToast("OJT finalized successfully ✓", "success");
      setShowSuccessModal(true);

      // Auto close & return (like Containment)
      setTimeout(() => {
        if (onBack) onBack();
        else navigate(-1);
      }, 7000);

    } catch (err: any) {
      showToast(err.message || "Could not finalize", "error");
    } finally {
      setFinalizing(false);
      setShowConfirmDialog(false);
    }
  };

  // ────────────────────────────────────────────────
  //  BACK BUTTON – behaves exactly like Containment
  // ────────────────────────────────────────────────
  const handleBack = () => {
    if (onBack) {
      onBack();           // ← This is what ChangeRequestDetail provides
      return;
    }
    navigate(-1);         // Fallback when opened directly / no parent
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const isFinalized = ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail';

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {toast.type === 'success' ? <CheckCircle /> : <AlertTriangle />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <nav className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">OJT Assessment</h1>
            </div>
          </div>
          {ojtRecord && <StatusBadge status={ojtRecord.status} />}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* Summary Hero */}
        <div className="bg-gradient-to-br from-indigo-800 to-blue-900 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <p className="text-indigo-200 uppercase text-xs font-bold tracking-wider mb-2">Workstation</p>
              <h2 className="text-4xl font-black">{initialData.stationName || '—'}</h2>
              <div className="mt-4 flex flex-wrap gap-4 text-sm opacity-90">
                <span>{initialData.changeId}</span>
                <span>•</span>
                <span>{initialData.lineName}</span>
                <span>•</span>
                <span>{initialData.shopfloorName}</span>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur border border-white/20 rounded-xl p-6 text-center min-w-[260px]">
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">TOTAL SCORE</p>
              <div className="text-6xl font-black">
                {ojtRecord?.overall_marks ?? 0}
                <span className="text-2xl opacity-70">/48</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold text-slate-500 uppercase">Output</span>
            </div>
            <p className="text-3xl font-black">{ojtRecord?.total_production_marks ?? 0}/24</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
              <span className="text-xs font-bold text-slate-500 uppercase">Quality</span>
            </div>
            <p className="text-3xl font-black">{ojtRecord?.total_quality_marks ?? 0}/24</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <span className="text-xs font-bold text-slate-500 uppercase">Days</span>
            </div>
            <p className="text-3xl font-black">{dailyScores.filter(d => d.actual != null).length}/6</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-amber-600" />
              <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
            </div>
            <p className="text-2xl font-bold uppercase">{ojtRecord?.status?.replace('_',' ')}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border shadow overflow-hidden">
          <div className="px-8 py-5 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-3">
              <BarChart3 className="text-blue-600" /> Daily Performance
            </h3>
            <button
              onClick={() => setShowCriteria(!showCriteria)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <Info className="w-5 h-5" /> Scoring Rules
            </button>
          </div>

          {showCriteria && (
            <div className="p-6 bg-blue-50 border-b grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-blue-900 mb-3">Production Marks</h4>
                <ul className="space-y-1.5">
                  <li>≥ 90% → <strong>4</strong></li>
                  <li>75–89% → <strong>3</strong></li>
                  <li>60–74% → <strong>2</strong></li>
                  <li>60% & 0 → <strong>1</strong></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-3">Quality Marks (Rejections)</h4>
                <ul className="space-y-1.5">
                  <li>0 → <strong>4</strong></li>
                  <li>1–2 → <strong>3</strong></li>
                  <li>3–5 → <strong>2</strong></li>
                  <li>5 → <strong>1</strong></li>
                </ul>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 text-xs font-bold text-gray-600 uppercase border-b">
                <tr>
                  <th className="px-8 py-5 text-left">Day</th>
                  <th className="px-6 py-5 text-left">Date</th>
                  <th className="px-6 py-5 text-center">Plan</th>
                  <th className="px-6 py-5 text-center">Actual</th>
                  <th className="px-6 py-5 text-center">Rej.</th>
                  <th className="px-6 py-5 text-center">Prod</th>
                  <th className="px-6 py-5 text-center">Qual</th>
                  <th className="px-8 py-5 text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dailyScores.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60">
                    <td className="px-8 py-5 font-bold">Day {row.day}</td>
                    <td className="px-6 py-5">
                      <input
                        type="date"
                        value={row.date ?? ''}
                        onChange={e => handleInputChange(i, 'date', e.target.value)}
                        disabled={isFinalized}
                        className="w-full max-w-[150px] px-3 py-2 border rounded-lg disabled:bg-gray-100"
                      />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <input
                        type="number"
                        value={row.plan ?? ''}
                        onChange={e => handleInputChange(i, 'plan', e.target.value)}
                        disabled={isFinalized}
                        className="w-20 text-center border-b-2 border-gray-300 focus:border-blue-500 outline-none disabled:bg-gray-100"
                        min={0}
                      />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <input
                        type="number"
                        value={row.actual ?? ''}
                        onChange={e => handleInputChange(i, 'actual', e.target.value)}
                        disabled={isFinalized}
                        className="w-20 text-center border-b-2 border-gray-300 focus:border-blue-500 outline-none font-bold disabled:bg-gray-100"
                        min={0}
                      />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <input
                        type="number"
                        value={row.rejections ?? ''}
                        onChange={e => handleInputChange(i, 'rejections', e.target.value)}
                        disabled={isFinalized}
                        className="w-20 text-center border-b-2 border-gray-300 focus:border-red-400 outline-none disabled:bg-gray-100"
                        min={0}
                      />
                    </td>
                    <td className="px-6 py-5"><div className="flex justify-center"><MarkBadge marks={row.production_marks} /></div></td>
                    <td className="px-6 py-5"><div className="flex justify-center"><MarkBadge marks={row.quality_marks} /></div></td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => saveDay(i)}
                        disabled={savingDay === i || isFinalized}
                        className="p-3 bg-white border rounded-lg hover:border-blue-400 disabled:opacity-40"
                      >
                        {savingDay === i ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        ) : (
                          <Save className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      {ojtRecord && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-30 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium flex items-center gap-3">
              {isFinalized ? (
                <span className="text-green-700 flex items-center gap-2">
                  <Award className="w-5 h-5" /> Training certified
                </span>
              ) : canFinalize ? (
                <span className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Ready to finalize
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Complete all 6 days
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-8 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Back to Change Detail
              </button>

              {!isFinalized && canFinalize && (
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={finalizing}
                  className={`px-10 py-3 rounded-xl font-bold text-white flex items-center gap-2 min-w-[200px] justify-center ${
                    finalizing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {finalizing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Finalizing...
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      FINALIZE OJT
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Finalize Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-emerald-600 px-6 py-5 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Award className="w-6 h-6" /> Finalize OJT?
              </h3>
              <button onClick={() => setShowConfirmDialog(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <p>Finalizing will lock this record and set final PASS/FAIL status.</p>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-800">
                After submission:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Record becomes read-only</li>
                  <li>Status updated to PASS or FAIL</li>
                  <li>You will return to Change Request detail</li>
                </ul>
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-6 py-2.5 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalizeOJT}
                  disabled={finalizing}
                  className={`px-8 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 ${
                    finalizing ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {finalizing ? 'Processing...' : 'Yes, Finalize'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal – similar to Containment */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-emerald-600 px-6 py-5 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Award className="w-7 h-7" /> OJT Completed
              </h2>
              <button onClick={() => setShowSuccessModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Success!</h3>
              <p className="text-gray-600">Operator training has been finalized and certified.</p>

              <div className="bg-gray-50 p-5 rounded-xl border text-left space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Record:</span>
                  <span className="font-bold">{initialData.changeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Final Score:</span>
                  <span className="font-bold text-emerald-700">{ojtRecord?.overall_marks ?? 0}/48</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" /> Back to Detail
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Redirecting to change detail in 7 seconds...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnJobTraining;