// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import axios from 'axios'

// // --- Interfaces (Keep these as they are) ---
// interface TraineeInfo { id?: number; traineeId: string; trainee_name: string; trainer_name: string; line_name: string; revision_date: string; DOJ: string; line?: number; }
// interface LocationState { operatorId?: string; employeeName?: string; lineId?: string | number; lineName?: string; levelId?: number | string; levelName?: string; }
// interface OJTDay { id: number; name: string; day_number?: number }
// interface DailyScore { day: number; date: string; plan: string; actual: string; production_marks: number; rejections: string; quality_marks: number; submitted?: boolean; scoreId?: number; }
// interface Line { id: number; title: string; }
// interface Station { id: number; title: string; section: number }

// const OnJobTraining = () => {
//   const location = useLocation()

//   // 1. Setup Demo Data fallbacks
//   const demoState: LocationState = {
//     operatorId: "DEMO-001",
//     employeeName: "John Doe",
//     lineName: "Main Assembly Line",
//     lineId: 1,
//     levelName: "Level 2",
//     levelId: "2"
//   };

//   // 2. Extract data ONCE (Cleaned up your duplicate lines)
//   const state = (location.state as LocationState) || demoState;
//   const { 
//     operatorId = "DEMO-001", 
//     employeeName = "John Doe", 
//     lineName: passedLineName, 
//     lineId: passedLineId,
//     levelId: passedLevelId,
//     levelName: passedLevelName 
//   } = state;

//   // --- States ---
//   const [lines] = useState<Line[]>([{ id: 1, title: passedLineName || "Demo Line" }])
//   const [stations] = useState<Station[]>([{ id: 101, title: "Assembly Station 1", section: 1 }])
//   const [selectedLineId] = useState<number | null>(1)
//   const [selectedStationId] = useState<number | null>(101)
//   const [currentLineName] = useState<string>(passedLineName || "Demo Line")
//   const [currentStationName] = useState<string>("Assembly Station 1")
//   const [trainee, setTrainee] = useState<TraineeInfo | null>(null)
//   const [ojtDays] = useState<OJTDay[]>([
//     {id: 1, name: 'Day 1', day_number: 1}, {id: 2, name: 'Day 2', day_number: 2},
//     {id: 3, name: 'Day 3', day_number: 3}, {id: 4, name: 'Day 4', day_number: 4},
//     {id: 5, name: 'Day 5', day_number: 5}, {id: 6, name: 'Day 6', day_number: 6}
//   ])
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([
//     { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//     { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0, submitted: false },
//   ])
  
//   const [loading] = useState(false)
//   const [submitError] = useState('')
//   const [engineerJudge, setEngineerJudge] = useState('')
//   const [preparedBy, setPreparedBy] = useState('')
//   const [approvedBy, setApprovedBy] = useState('')
//   const [dojValue] = useState('01/01/2024') // Hardcoded for demo
//   const [totalProductionMarks, setTotalProductionMarks] = useState(0)
//   const [totalQualityMarks, setTotalQualityMarks] = useState(0)
//   const [overallResult, setOverallResult] = useState('Pending')
//   const [dataLoaded, setDataLoaded] = useState(true) // Force to true for demo

//   // --- Initialize trainee info for Demo ---
//   useEffect(() => {
//     setTrainee({
//       traineeId: operatorId,
//       trainee_name: employeeName,
//       trainer_name: 'Trainer Name',
//       line_name: currentLineName,
//       revision_date: new Date().toLocaleDateString(),
//       DOJ: dojValue,
//       line: 1,
//     })
//     setDataLoaded(true)
//   }, []);

//   // Helpers (Keep your original date helpers here)
//   const formatDateForInput = (d: string) => d; 
//   const formatDateForDisplay = (d: string) => d;

//   const handleInputChange = (index: number, field: string, value: string | number) => {
//     const updatedScores = [...dailyScores];
//     updatedScores[index] = { ...updatedScores[index], [field]: value };
    
//     // Simple demo logic for marks
//     if(field === 'actual') updatedScores[index].production_marks = 4;
//     if(field === 'rejections') updatedScores[index].quality_marks = 4;
    
//     setDailyScores(updatedScores);
    
//     const pTotal = updatedScores.reduce((sum, s) => sum + s.production_marks, 0);
//     const qTotal = updatedScores.reduce((sum, s) => sum + s.quality_marks, 0);
//     setTotalProductionMarks(pTotal);
//     setTotalQualityMarks(qTotal);
//     setOverallResult(pTotal > 10 ? 'Pass' : 'Pending');
//   }

//   return (
//     <div className="p-4 text-sm bg-white min-h-screen">
//       <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200">
//         <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-center">
//           <tbody>
//             <tr>
//               <td rowSpan={4} colSpan={2} className="border border-gray-300 bg-white">
//                 <div className="flex flex-col justify-center h-full items-center">
//                   <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">ON JOB TRAINING SHEET</h1>
//                 </div>
//               </td>
//               <td className="border border-gray-300 font-semibold bg-gray-50">Revision Date</td>
//               <td className="border border-gray-300 bg-white" colSpan={3}>{trainee?.revision_date}</td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 font-semibold bg-gray-50">TRAINEE NAME :</td>
//               <td className="border border-gray-300 bg-white">{trainee?.trainee_name}</td>
//               <td className="border border-gray-300 font-semibold bg-gray-50">TRAINER :</td>
//               <td className="border border-gray-300 bg-white">
//                 <input type="text" className="w-full p-1" placeholder="Enter trainer name" />
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 font-semibold bg-gray-50">EMP NO. :</td>
//               <td className="border border-gray-300 bg-white">{trainee?.traineeId}</td>
//               <td className="border border-gray-300 font-semibold bg-gray-50">LINE :</td>
//               <td className="border border-gray-300 bg-white">{currentLineName}</td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 font-semibold bg-gray-50">D.O.J. :</td>
//               <td className="border border-gray-300 bg-white" colSpan={3}>{dojValue}</td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 text-center font-semibold p-2 bg-blue-50" colSpan={7}>
//                 PROCESS NAME: {currentStationName}
//               </td>
//             </tr>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300" rowSpan={2}>DAYS</th>
//               <th className="border border-gray-300" rowSpan={2}>DATE</th>
//               <th className="border border-gray-300 text-blue-900" colSpan={3}>Production</th>
//               <th className="border border-gray-300 text-blue-900" colSpan={2}>QUALITY</th>
//             </tr>
//             <tr className="bg-gray-50">
//               <th className="border border-gray-300">PLAN</th>
//               <th className="border border-gray-300">ACT.</th>
//               <th className="border border-gray-300">Marks</th>
//               <th className="border border-gray-300">NO. OF REJ.</th>
//               <th className="border border-gray-300">Marks</th>
//             </tr>
//             {dailyScores.map((dayScore, index) => (
//               <tr key={dayScore.day}>
//                 <td className="border border-gray-300">{dayScore.day}</td>
//                 <td className="border border-gray-300">
//                   <input type="date" className="w-full p-1" onChange={(e) => handleInputChange(index, 'date', e.target.value)} />
//                 </td>
//                 <td className="border border-gray-300">
//                   <input type="number" className="w-full p-1" placeholder="0" onChange={(e) => handleInputChange(index, 'plan', e.target.value)} />
//                 </td>
//                 <td className="border border-gray-300">
//                   <input type="number" className="w-full p-1" placeholder="0" onChange={(e) => handleInputChange(index, 'actual', e.target.value)} />
//                 </td>
//                 <td className="border border-gray-300 font-bold text-blue-600">{dayScore.production_marks}</td>
//                 <td className="border border-gray-300">
//                   <input type="number" className="w-full p-1" placeholder="0" onChange={(e) => handleInputChange(index, 'rejections', e.target.value)} />
//                 </td>
//                 <td className="border border-gray-300 font-bold text-blue-600">{dayScore.quality_marks}</td>
//               </tr>
//             ))}
//             <tr className="bg-gray-100 font-bold">
//               <td className="border border-gray-300" colSpan={4}>Total Marks</td>
//               <td className="border border-gray-300 text-blue-700">{totalProductionMarks}</td>
//               <td className="border border-gray-300">Total Marks</td>
//               <td className="border border-gray-300 text-blue-700">{totalQualityMarks}</td>
//             </tr>
//             <tr className="bg-yellow-50 font-bold text-lg">
//               <td className="border border-gray-300 p-2" colSpan={5}>OVERALL RESULT:</td>
//               <td className="border border-gray-300 p-2 text-green-600" colSpan={2}>{overallResult}</td>
//             </tr>
//           </tbody>
//         </table>

//         <div className="mt-8 flex justify-center">
//           <button 
//             onClick={() => alert("Data saved Successfully")}
//             className="bg-blue-600 text-white px-12 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition"
//           >
//             Submit Data
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OnJobTraining




// import React, { useEffect, useState, useMemo } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import {
//   Save, CheckCircle, XCircle, Clock, ArrowLeft,
//   Calendar, Settings, Info, BarChart3, Shield,
//   Loader2, Download, Printer, GraduationCap, 
//   TrendingUp, AlertTriangle, Award
// } from 'lucide-react';

// // --- Types ---
// export interface OJTRecordData {
//   changeId: string;
//   fourMChangeId: number;
//   shopfloorName: string;
//   lineName: string;
//   stationName: string;
//   departmentName: string;
//   processName: string;
// }

// interface OnJobTrainingProps {
//   recordData?: OJTRecordData | null;
//   onBack?: () => void;
// }

// interface DailyScore {
//   id?: number;
//   day: number;
//   date: string | null;
//   plan: string | number;
//   actual: string | number;
//   production_marks: number;
//   rejections: string | number;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   status: 'in_progress' | 'pass' | 'fail';
//   total_production_marks: number;
//   total_quality_marks: number;
//   overall_marks: number;
//   daily_scores: DailyScore[];
// }

// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// // --- UI Sub-Components ---

// const StatusBadge = ({ status }: { status: string }) => {
//   const config: Record<string, any> = {
//     pass: { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle, label: 'PASSED' },
//     fail: { bg: 'bg-rose-500', text: 'text-white', icon: XCircle, label: 'FAILED' },
//     in_progress: { bg: 'bg-amber-500', text: 'text-white', icon: Clock, label: 'IN PROGRESS' }
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
//   const colors = {
//     4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//     3: 'bg-blue-100    text-blue-700    border-blue-200',
//     2: 'bg-amber-100  text-amber-700   border-amber-200',
//     1: 'bg-rose-100   text-rose-700    border-rose-200',
//     0: 'bg-gray-100   text-gray-400    border-gray-200',
//   };
//   return (
//     <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${(colors as any)[marks] || colors[0]}`}>
//       {marks || 0}
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
//   <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
//     <div className="flex justify-between items-start mb-4">
//       <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '50')}`}>
//         <Icon className={`w-5 h-5 ${colorClass}`} />
//       </div>
//       {subtext && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-tight">{subtext}</span>}
//     </div>
//     <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h3>
//     <p className="text-2xl font-black text-slate-800">{value}</p>
//   </div>
// );

// // --- Main Component ---

// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const state = (recordData || location.state || {}) as OJTRecordData;
  
//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   const showToast = (message: string, type: 'success' | 'error') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // 1. Initial Fetch
//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       try {
//         const url = id ? `${API_BASE_URL}/ojt-records/${id}/` : `${API_BASE_URL}/ojt-records/create_from_change/`;
//         const method = id ? 'GET' : 'POST';
//         const body = id ? null : JSON.stringify({ four_m_change_record_id: state.changeId });

//         const res = await fetch(url, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body
//         });
//         const data = await res.json();
//         setOjtRecord(data);
//         setDailyScores(data.daily_scores || []);
//       } catch (e) { showToast("Connection Error", "error"); }
//       finally { setLoading(false); }
//     };
//     init();
//   }, [id, state.changeId]);

//   // 2. Handle Inputs
//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     const updated = [...dailyScores];
//     // @ts-ignore
//     updated[index][field] = value === '' ? null : value;

//     // Frontend Preview Calculation (Matches Backend Logic)
//     if (field === 'actual' || field === 'plan') {
//       const p = parseFloat(updated[index].plan as string) || 0;
//       const a = parseFloat(updated[index].actual as string) || 0;
//       const pct = p > 0 ? (a / p) * 100 : 0;
//       updated[index].production_marks = pct >= 90 ? 4 : pct >= 75 ? 3 : pct >= 60 ? 2 : a > 0 ? 1 : 0;
//     }
//     if (field === 'rejections') {
//       const r = parseInt(value);
//       if (!isNaN(r)) updated[index].quality_marks = r === 0 ? 4 : r <= 2 ? 3 : r <= 5 ? 2 : 1;
//     }
//     setDailyScores(updated);
//   };

//   // 3. Save Logic (The Fix for Status Sync)
//   const saveDay = async (idx: number) => {
//     if (!ojtRecord?.id) return;
//     setSavingDay(idx);
//     const dayData = dailyScores[idx];
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: dayData.day,
//           date: dayData.date || null,
//           plan: dayData.plan,
//           actual: dayData.actual,
//           rejections: dayData.rejections,
//         }),
//       });

//       if (res.ok) {
//         const updatedRecord = await res.json();
//         // 🔥 UPDATE EVERYTHING FROM SERVER RESPONSE
//         setOjtRecord(updatedRecord);
//         setDailyScores(updatedRecord.daily_scores);
//         showToast(`Day ${dayData.day} Synced. Status: ${updatedRecord.status.toUpperCase()}`, "success");
//       }
//     } catch (e) { showToast("Save Failed", "error"); }
//     finally { setSavingDay(null); }
//   };

//   if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-8 right-8 z-[60] animate-in slide-in-from-right-10">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl bg-white border-l-4 ${toast.type === 'success' ? 'border-emerald-500' : 'border-rose-500'}`}>
//             {toast.type === 'success' ? <CheckCircle className="text-emerald-500" /> : <AlertTriangle className="text-rose-500" />}
//             <span className="font-bold text-slate-800">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Nav */}
//       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center px-8 justify-between">
//         <div className="flex items-center gap-6">
//           <button onClick={() => onBack ? onBack() : navigate(-1)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><ArrowLeft /></button>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
//             <GraduationCap className="text-blue-600 w-6 h-6"/> OJT Assessment
//           </h1>
//         </div>
//         <StatusBadge status={ojtRecord?.status || 'in_progress'} />
//       </nav>

//       <main className="max-w-7xl mx-auto p-8 space-y-8">
//         {/* Hero Section */}
//         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
//           <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
//           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
//             <div>
//               <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Target Station</p>
//               <h2 className="text-4xl font-black tracking-tight mb-4">{state.stationName || 'Precision Unit'}</h2>
//               <div className="flex gap-4 opacity-60 font-bold text-xs uppercase tracking-widest">
//                 <span>{state.changeId}</span>
//                 <span>•</span>
//                 <span>{state.lineName}</span>
//               </div>
//             </div>
//             <div className="text-center bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md min-w-[240px]">
//               <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Cumulative Score</p>
//               <div className="text-6xl font-black">{ojtRecord?.overall_marks || 0}<span className="text-xl opacity-20 ml-1">/48</span></div>
//               <div className={`mt-4 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${ojtRecord?.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
//                  {ojtRecord?.status?.replace('_', ' ')}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard title="Production" value={`${ojtRecord?.total_production_marks || 0}/24`} icon={TrendingUp} colorClass="text-blue-600" subtext="Output" />
//           <StatCard title="Quality" value={`${ojtRecord?.total_quality_marks || 0}/24`} icon={Shield} colorClass="text-emerald-600" subtext="Defects" />
//           <StatCard title="Completion" value={`${dailyScores.filter(d => d.date && d.actual).length}/6 Days`} icon={Calendar} colorClass="text-indigo-600" subtext="Log" />
//           <StatCard title="Assessment" value={ojtRecord?.status?.toUpperCase() || 'IN PROGRESS'} icon={Award} colorClass={ojtRecord?.status === 'pass' ? 'text-emerald-600' : 'text-amber-600'} />
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
//           <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
//             <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-3">
//               <BarChart3 className="text-blue-600 w-5 h-5"/> Training Performance Ledger
//             </h3>
//             <button onClick={() => setShowCriteria(!showCriteria)} className="text-[10px] font-black text-blue-600 flex items-center gap-2">
//               <Info className="w-4 h-4"/> SCORING RULES
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase border-b">
//                 <tr>
//                   <th className="px-8 py-6 text-left">Day</th>
//                   <th className="px-6 py-6 text-left">Date</th>
//                   <th className="px-4 py-6 text-center">Plan</th>
//                   <th className="px-4 py-6 text-center">Actual</th>
//                   <th className="px-4 py-6 text-center">Rej.</th>
//                   <th className="px-4 py-6 text-center">Prod</th>
//                   <th className="px-4 py-6 text-center">Qual</th>
//                   <th className="px-8 py-6 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {dailyScores.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-slate-50/50 transition-all group">
//                     <td className="px-8 py-6 font-black text-slate-800">D{row.day}</td>
//                     <td className="px-6 py-6">
//                       <input type="date" value={row.date || ''} onChange={(e) => handleInputChange(idx, 'date', e.target.value)}
//                         className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all outline-none ${!row.date && row.actual ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-blue-500'}`} />
//                     </td>
//                     <td className="px-4 py-6">
//                       <input type="number" value={row.plan || ''} onChange={(e) => handleInputChange(idx, 'plan', e.target.value)}
//                         className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-sm" />
//                     </td>
//                     <td className="px-4 py-6">
//                       <input type="number" value={row.actual || ''} onChange={(e) => handleInputChange(idx, 'actual', e.target.value)}
//                         className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-blue-500 outline-none font-black text-blue-600 text-sm" />
//                     </td>
//                     <td className="px-4 py-6">
//                       <input type="number" value={row.rejections || ''} onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)}
//                         className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-rose-500 outline-none font-bold text-sm" />
//                     </td>
//                     <td className="px-4 py-6"><div className="flex justify-center"><MarkBadge marks={row.production_marks} /></div></td>
//                     <td className="px-4 py-6"><div className="flex justify-center"><MarkBadge marks={row.quality_marks} /></div></td>
//                     <td className="px-8 py-6 text-right">
//                       <button onClick={() => saveDay(idx)} disabled={savingDay === idx}
//                         className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-30">
//                         {savingDay === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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


// import React, { useEffect, useState, useMemo } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import {
//   Save, CheckCircle, XCircle, Clock, ArrowLeft,
//   Calendar, Settings, Info, BarChart3, Shield,
//   Loader2, Download, Printer, GraduationCap, 
//   TrendingUp, AlertTriangle, Award
// } from 'lucide-react';

// // --- Types ---
// export interface OJTRecordData {
//   changeId: string;
//   fourMChangeId: number;
//   shopfloorName: string;
//   lineName: string;
//   stationName: string;
//   departmentName: string;
//   processName: string;
// }

// interface OnJobTrainingProps {
//   recordData?: OJTRecordData | null;
//   onBack?: () => void;
// }

// interface DailyScore {
//   id?: number;
//   day: number;
//   date: string | null;
//   plan: string | number;
//   actual: string | number;
//   production_marks: number;
//   rejections: string | number;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   status: 'in_progress' | 'pass' | 'fail';
//   total_production_marks: number;
//   total_quality_marks: number;
//   overall_marks: number;
//   daily_scores: DailyScore[];
// }

// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// // --- UI Sub-Components ---

// const StatusBadge = ({ status }: { status: string }) => {
//   const config: Record<string, any> = {
//     pass: { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle, label: 'PASSED' },
//     fail: { bg: 'bg-rose-500', text: 'text-white', icon: XCircle, label: 'FAILED' },
//     in_progress: { bg: 'bg-amber-500', text: 'text-white', icon: Clock, label: 'IN PROGRESS' }
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
//   const colors = {
//     4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//     3: 'bg-blue-100    text-blue-700    border-blue-200',
//     2: 'bg-amber-100  text-amber-700   border-amber-200',
//     1: 'bg-rose-100   text-rose-700    border-rose-200',
//     0: 'bg-gray-100   text-gray-400    border-gray-200',
//   };
//   return (
//     <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${(colors as any)[marks] || colors[0]}`}>
//       {marks || 0}
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
//   <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
//     <div className="flex justify-between items-start mb-4">
//       <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '50')}`}>
//         <Icon className={`w-5 h-5 ${colorClass}`} />
//       </div>
//       {subtext && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-tight">{subtext}</span>}
//     </div>
//     <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h3>
//     <p className="text-2xl font-black text-slate-800">{value}</p>
//   </div>
// );

// // --- Main Component ---

// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   // 🔥 RETRIEVE DATA FROM LOCALSTORAGE IF NOT PASSED AS PROP
//   const getRecordData = (): OJTRecordData => {
//     if (recordData) return recordData;
//     if (location.state) return location.state as OJTRecordData;
    
//     // Try localStorage
//     const stored = localStorage.getItem("ojt_record_data");
//     if (stored) {
//       try {
//         return JSON.parse(stored);
//       } catch (e) {
//         console.error("Failed to parse OJT data from localStorage", e);
//       }
//     }
    
//     // Fallback empty data
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

//   const state = getRecordData();
  
//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   const showToast = (message: string, type: 'success' | 'error') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // 1. Initial Fetch
//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       try {
//         const url = id ? `${API_BASE_URL}/ojt-records/${id}/` : `${API_BASE_URL}/ojt-records/create_from_change/`;
//         const method = id ? 'GET' : 'POST';
//         const body = id ? null : JSON.stringify({ four_m_change_record_id: state.changeId });

//         const res = await fetch(url, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body
//         });
//         const data = await res.json();
//         setOjtRecord(data);
//         setDailyScores(data.daily_scores || []);
//       } catch (e) { 
//         showToast("Connection Error", "error"); 
//       }
//       finally { setLoading(false); }
//     };
    
//     if (state.changeId || id) {
//       init();
//     }
//   }, [id, state.changeId]);

//   // 2. Handle Inputs
//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     const updated = [...dailyScores];
//     // @ts-ignore
//     updated[index][field] = value === '' ? null : value;

//     // Frontend Preview Calculation
//     if (field === 'actual' || field === 'plan') {
//       const p = parseFloat(updated[index].plan as string) || 0;
//       const a = parseFloat(updated[index].actual as string) || 0;
//       const pct = p > 0 ? (a / p) * 100 : 0;
//       updated[index].production_marks = pct >= 90 ? 4 : pct >= 75 ? 3 : pct >= 60 ? 2 : a > 0 ? 1 : 0;
//     }
//     if (field === 'rejections') {
//       const r = parseInt(value);
//       if (!isNaN(r)) updated[index].quality_marks = r === 0 ? 4 : r <= 2 ? 3 : r <= 5 ? 2 : 1;
//     }
//     setDailyScores(updated);
//   };

//   // 3. Save Logic
//   const saveDay = async (idx: number) => {
//     if (!ojtRecord?.id) return;
//     setSavingDay(idx);
//     const dayData = dailyScores[idx];
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: dayData.day,
//           date: dayData.date || null,
//           plan: dayData.plan,
//           actual: dayData.actual,
//           rejections: dayData.rejections,
//         }),
//       });

//       if (res.ok) {
//         const updatedRecord = await res.json();
//         setOjtRecord(updatedRecord);
//         setDailyScores(updatedRecord.daily_scores);
//         showToast(`Day ${dayData.day} Synced. Status: ${updatedRecord.status.toUpperCase()}`, "success");
//       }
//     } catch (e) { showToast("Save Failed", "error"); }
//     finally { setSavingDay(null); }
//   };

//   // 🔥 HANDLE BACK NAVIGATION
//   const handleBack = () => {
//     // Clear the stored data
//     localStorage.removeItem("ojt_record_data");
    
//     if (onBack) {
//       onBack();
//     } else {
//       const returnId = localStorage.getItem("return_to_detail_id");
//       if (returnId) {
//         // Navigate back to detail page - adjust this path to your routing structure
//         navigate(`/change-requests/${returnId}`);
//       } else {
//         navigate(-1);
//       }
//     }
//   };

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-8 right-8 z-[60] animate-in slide-in-from-right-10">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl bg-white border-l-4 ${toast.type === 'success' ? 'border-emerald-500' : 'border-rose-500'}`}>
//             {toast.type === 'success' ? <CheckCircle className="text-emerald-500" /> : <AlertTriangle className="text-rose-500" />}
//             <span className="font-bold text-slate-800">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Nav */}
//       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center px-8 justify-between">
//         <div className="flex items-center gap-6">
//           <button onClick={handleBack} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
//             <ArrowLeft />
//           </button>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
//             <GraduationCap className="text-blue-600 w-6 h-6"/> OJT Assessment
//           </h1>
//         </div>
//         <StatusBadge status={ojtRecord?.status || 'in_progress'} />
//       </nav>

//       <main className="max-w-7xl mx-auto p-8 space-y-8">
//         {/* Hero Section */}
//         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
//           <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
//           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
//             <div>
//               <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Target Station</p>
//               <h2 className="text-4xl font-black tracking-tight mb-4">{state.stationName || 'Precision Unit'}</h2>
//               <div className="flex gap-4 opacity-60 font-bold text-xs uppercase tracking-widest">
//                 <span>{state.changeId}</span>
//                 <span>•</span>
//                 <span>{state.lineName}</span>
//                 <span>•</span>
//                 <span>{state.shopfloorName}</span>
//               </div>
//             </div>
//             <div className="text-center bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md min-w-[240px]">
//               <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Cumulative Score</p>
//               <div className="text-6xl font-black">{ojtRecord?.overall_marks || 0}<span className="text-xl opacity-20 ml-1">/48</span></div>
//               <div className={`mt-4 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${ojtRecord?.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
//                  {ojtRecord?.status?.replace('_', ' ')}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard title="Production" value={`${ojtRecord?.total_production_marks || 0}/24`} icon={TrendingUp} colorClass="text-blue-600" subtext="Output" />
//           <StatCard title="Quality" value={`${ojtRecord?.total_quality_marks || 0}/24`} icon={Shield} colorClass="text-emerald-600" subtext="Defects" />
//           <StatCard title="Completion" value={`${dailyScores.filter(d => d.date && d.actual).length}/6 Days`} icon={Calendar} colorClass="text-indigo-600" subtext="Log" />
//           <StatCard title="Assessment" value={ojtRecord?.status?.toUpperCase() || 'IN PROGRESS'} icon={Award} colorClass={ojtRecord?.status === 'pass' ? 'text-emerald-600' : 'text-amber-600'} />
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
//           <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
//             <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-3">
//               <BarChart3 className="text-blue-600 w-5 h-5"/> Training Performance Ledger
//             </h3>
//             <button onClick={() => setShowCriteria(!showCriteria)} className="text-[10px] font-black text-blue-600 flex items-center gap-2">
//               <Info className="w-4 h-4"/> SCORING RULES
//             </button>
//           </div>

//           {showCriteria && (
//             <div className="px-8 py-6 bg-blue-50 border-b border-blue-100">
//               <h4 className="font-bold text-blue-900 mb-3">Scoring Criteria</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="font-bold text-blue-800 mb-2">Production Marks:</p>
//                   <ul className="space-y-1 text-slate-700">
//                     <li>• 4 marks: ≥90% of plan</li>
//                     <li>• 3 marks: 75-89% of plan</li>
//                     <li>• 2 marks: 60-74% of plan</li>
//                     <li>• 1 mark: &lt;60% but &gt;0</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <p className="font-bold text-blue-800 mb-2">Quality Marks:</p>
//                   <ul className="space-y-1 text-slate-700">
//                     <li>• 4 marks: 0 rejections</li>
//                     <li>• 3 marks: 1-2 rejections</li>
//                     <li>• 2 marks: 3-5 rejections</li>
//                     <li>• 1 mark: &gt;5 rejections</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase border-b">
//                 <tr>
//                   <th className="px-8 py-6 text-left">Day</th>
//                   <th className="px-6 py-6 text-left">Date</th>
//                   <th className="px-4 py-6 text-center">Plan</th>
//                   <th className="px-4 py-6 text-center">Actual</th>
//                   <th className="px-4 py-6 text-center">Rej.</th>
//                   <th className="px-4 py-6 text-center">Prod</th>
//                   <th className="px-4 py-6 text-center">Qual</th>
//                   <th className="px-8 py-6 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {dailyScores.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-slate-50/50 transition-all group">
//                     <td className="px-8 py-6 font-black text-slate-800">D{row.day}</td>
//                     <td className="px-6 py-6">
//                       <input type="date" value={row.date || ''} onChange={(e) => handleInputChange(idx, 'date', e.target.value)}
//                         className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all outline-none ${!row.date && row.actual ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-blue-500'}`} />
//                     </td>
//                     <td className="px-4 py-6">
//                       <input type="number" value={row.plan || ''} onChange={(e) => handleInputChange(idx, 'plan', e.target.value)}
//                         className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-sm" />
//                     </td>
//                     <td className="px-4 py-6">
//                       <input type="number" value={row.actual || ''} onChange={(e) => handleInputChange(idx, 'actual', e.target.value)}
//                         className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-blue-500 outline-none font-black text-blue-600 text-sm" />
//                     </td>
//                     <td className="px-4 py-6">
//                       <input type="number" value={row.rejections || ''} onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)}
//                         className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-rose-500 outline-none font-bold text-sm" />
//                     </td>
//                     <td className="px-4 py-6"><div className="flex justify-center"><MarkBadge marks={row.production_marks} /></div></td>
//                     <td className="px-4 py-6"><div className="flex justify-center"><MarkBadge marks={row.quality_marks} /></div></td>
//                     <td className="px-8 py-6 text-right">
//                       <button onClick={() => saveDay(idx)} disabled={savingDay === idx}
//                         className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-30">
//                         {savingDay === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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



import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Save, CheckCircle, XCircle, Clock, ArrowLeft,
  Calendar, BarChart3, Shield, Loader2, 
  GraduationCap, TrendingUp, AlertTriangle, Award, Info
} from 'lucide-react';

// ────────────────────────────────────────────────
// Types
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
  onBack?: () => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ────────────────────────────────────────────────
// Helpers – strict mark calculation
// ────────────────────────────────────────────────

const getProductionMarks = (plan: any, actual: any): number => {
  // Important: only calculate when both values are meaningfully present
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
// UI Components (StatusBadge, MarkBadge, StatCard)
// ────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    pass:       { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle, label: 'PASSED' },
    fail:       { bg: 'bg-rose-500',   text: 'text-white', icon: XCircle,    label: 'FAILED'  },
    in_progress: { bg: 'bg-amber-500',  text: 'text-white', icon: Clock,      label: 'IN PROGRESS' }
  };

  const current = config[status] || config.in_progress;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-md ${current.bg} ${current.text}`}>
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
};

const MarkBadge = ({ marks }: { marks: number }) => {
  const styleMap = {
    4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    3: 'bg-blue-100    text-blue-700    border-blue-200',
    2: 'bg-amber-100  text-amber-700   border-amber-200',
    1: 'bg-rose-100   text-rose-700    border-rose-200',
    0: 'bg-gray-50    text-gray-400    border-gray-200'
  };

  const style = styleMap[marks as keyof typeof styleMap] || styleMap[0];

  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${style}`}>
      {marks}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: {
  title: string;
  value: string | number;
  icon: any;
  colorClass: string;
  subtext?: string;
}) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '50')}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      {subtext && (
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-tight">
          {subtext}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-800">{value}</p>
  </div>
);

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

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3400);
  };

  // Fetch or create record
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

        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        setOjtRecord(data);
        setDailyScores(data.daily_scores || []);
      } catch (err) {
        showToast("Failed to load training record", "error");
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

      // Recalculate marks only when relevant fields change
      if (field === 'plan' || field === 'actual') {
        next[index].production_marks = getProductionMarks(
          next[index].plan,
          next[index].actual
        );
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

      if (!res.ok) throw new Error();

      const updated = await res.json();
      setOjtRecord(updated);
      setDailyScores(updated.daily_scores);
      showToast(`Day ${day.day} saved • ${updated.status.toUpperCase()}`, "success");
    } catch {
      showToast("Could not save day", "error");
    } finally {
      setSavingDay(null);
    }
  };

  const handleBack = () => {
    localStorage.removeItem("ojt_record_data");
    if (onBack) {
      onBack();
    } else {
      const returnId = localStorage.getItem("return_to_detail_id");
      if (returnId) {
        navigate(`/change-requests/${returnId}`);
      } else {
        navigate(-1);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl bg-white border-l-4 ${toast.type === 'success' ? 'border-emerald-500' : 'border-rose-500'}`}>
            {toast.type === 'success' ? <CheckCircle className="text-emerald-500" /> : <AlertTriangle className="text-rose-500" />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 md:px-10 justify-between">
        <div className="flex items-center gap-5">
          <button onClick={handleBack} className="p-2.5 hover:bg-slate-100 rounded-xl transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black tracking-tight flex items-center gap-2.5">
            <GraduationCap className="text-blue-600 w-5 h-5" />
            OJT Assessment
          </h1>
        </div>
        {ojtRecord && <StatusBadge status={ojtRecord.status} />}
      </nav>

      <main className="max-w-7xl mx-auto px-5 md:px-8 pt-8 space-y-8">

        {/* Hero / Summary */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div>
              <p className="text-blue-300 text-xs font-black uppercase tracking-wider mb-2">Workstation</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">{initialData.stationName || '—'}</h2>
              <div className="mt-3 flex flex-wrap gap-4 text-xs opacity-80 font-medium">
                <span>{initialData.changeId || '—'}</span>
                <span>•</span>
                <span>{initialData.lineName || '—'}</span>
                <span>•</span>
                <span>{initialData.shopfloorName || '—'}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center min-w-[220px]">
              <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-2">Total Score</p>
              <div className="text-5xl md:text-6xl font-black">
                {ojtRecord?.overall_marks ?? 0}
                <span className="text-2xl opacity-40 ml-1">/48</span>
              </div>
              <div className={`mt-4 inline-block px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${ojtRecord?.status === 'pass' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                {ojtRecord?.status?.replace('_', ' ') || 'in progress'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard title="Production" value={`${ojtRecord?.total_production_marks ?? 0}/24`} icon={TrendingUp}    colorClass="text-blue-600"    subtext="Output" />
          <StatCard title="Quality"    value={`${ojtRecord?.total_quality_marks ?? 0}/24`}    icon={Shield}        colorClass="text-emerald-600" subtext="Defects" />
          <StatCard title="Progress"   value={`${dailyScores.filter(d => d.actual != null).length}/6`} icon={Calendar}     colorClass="text-indigo-600"  subtext="Days" />
          <StatCard title="Status"     value={ojtRecord?.status?.toUpperCase() || '—'}        icon={Award}         colorClass={ojtRecord?.status === 'pass' ? 'text-emerald-600' : 'text-amber-600'} />
        </div>

        {/* Scoring table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-6 md:px-10 py-5 bg-slate-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm flex items-center gap-3">
              <BarChart3 className="text-blue-600 w-5 h-5" />
              Performance Log
            </h3>
            <button
              onClick={() => setShowCriteria(!showCriteria)}
              className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
            >
              <Info className="w-4 h-4" />
              SCORING RULES
            </button>
          </div>

          {showCriteria && (
            <div className="px-6 md:px-10 py-6 bg-blue-50 border-b text-sm">
              <h4 className="font-bold text-blue-900 mb-4">How marks are calculated</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-blue-800 mb-2">Production (plan vs actual)</p>
                  <ul className="space-y-1.5 text-slate-700">
                    <li>• ≥ 90% → 4 marks</li>
                    <li>• 75–89% → 3 marks</li>
                    <li>• 60–74% → 2 marks</li>
                    <li>• 0 but 60% → 1 mark</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-blue-800 mb-2">Quality (rejections)</p>
                  <ul className="space-y-1.5 text-slate-700">
                    <li>• 0 rejections → 4 marks</li>
                    <li>• 1–2 → 3 marks</li>
                    <li>• 3–5 → 2 marks</li>
                    <li>• 5 → 1 mark</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase border-b">
                <tr>
                  <th className="px-8 py-5 text-left">Day</th>
                  <th className="px-6 py-5 text-left">Date</th>
                  <th className="px-4 py-5 text-center">Plan</th>
                  <th className="px-4 py-5 text-center">Actual</th>
                  <th className="px-4 py-5 text-center">Rej.</th>
                  <th className="px-4 py-5 text-center">Prod</th>
                  <th className="px-4 py-5 text-center">Qual</th>
                  <th className="px-8 py-5 text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyScores.map((row, idx) => (
                  <tr key={row.id ?? idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-8 py-5 font-black text-slate-800">Day {row.day}</td>
                    <td className="px-6 py-5">
                      <input
                        type="date"
                        value={row.date ?? ''}
                        onChange={e => handleInputChange(idx, 'date', e.target.value)}
                        className={`w-full max-w-[140px] px-3 py-1.5 rounded-lg border text-sm font-medium focus:border-blue-400 outline-none transition-all ${
                          !row.date && row.actual != null ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
                        }`}
                      />
                    </td>
                    <td className="px-4 py-5 text-center">
                      <input
                        type="number"
                        value={row.plan ?? ''}
                        onChange={e => handleInputChange(idx, 'plan', e.target.value)}
                        className="w-16 text-center border-b-2 border-slate-200 focus:border-blue-400 outline-none font-medium text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-5 text-center">
                      <input
                        type="number"
                        value={row.actual ?? ''}
                        onChange={e => handleInputChange(idx, 'actual', e.target.value)}
                        className="w-16 text-center border-b-2 border-slate-200 focus:border-blue-400 outline-none font-black text-blue-700 text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-5 text-center">
                      <input
                        type="number"
                        value={row.rejections ?? ''}
                        onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
                        className="w-16 text-center border-b-2 border-slate-200 focus:border-rose-400 outline-none font-medium text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex justify-center">
                        <MarkBadge marks={row.production_marks} />
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex justify-center">
                        <MarkBadge marks={row.quality_marks} />
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => saveDay(idx)}
                        disabled={savingDay === idx}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition disabled:opacity-40"
                      >
                        {savingDay === idx ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
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
    </div>
  );
};

export default OnJobTraining;