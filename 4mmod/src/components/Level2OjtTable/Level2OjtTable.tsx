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




// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

// // --- Interfaces ---
// interface LocationState {
//   changeId?: string
//   employeeName?: string
//   lineId?: number | string
//   lineName?: string
//   departmentName?: string
//   shopfloorName?: string
//   processName?: string
// }

// interface DailyScore {
//   day: number
//   date: string
//   plan: string
//   actual: string
//   production_marks: number
//   rejections: string
//   quality_marks: number
// }

// // ---------------- COMPONENT ----------------
// const OnJobTraining = () => {
//   const location = useLocation()

//   // ---------- DEMO FALLBACK ----------
//   const demoState: LocationState = {
//     changeId: 'CHG-2024-001',
//     employeeName: 'John Doe',
//     lineName: 'Assembly Line A',
//     departmentName: 'Production',
//     shopfloorName: 'Shopfloor 1',
//     processName: 'Final Assembly',
//   }

//   const state = (location.state as LocationState) || demoState

//   const {
//     changeId,
//     employeeName,
//     lineName,
//     departmentName,
//     shopfloorName,
//     processName,
//   } = state

//   // ---------- STATES ----------
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([
//     { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//   ])

//   const [totalProductionMarks, setTotalProductionMarks] = useState(0)
//   const [totalQualityMarks, setTotalQualityMarks] = useState(0)
//   const [overallResult, setOverallResult] = useState('Pending')

//   // ---------- HANDLERS ----------
//   const handleInputChange = (index: number, field: string, value: string) => {
//     const updated = [...dailyScores]
//     updated[index] = { ...updated[index], [field]: value }

//     if (field === 'actual') updated[index].production_marks = 4
//     if (field === 'rejections') updated[index].quality_marks = 4

//     setDailyScores(updated)

//     const pTotal = updated.reduce((s, d) => s + d.production_marks, 0)
//     const qTotal = updated.reduce((s, d) => s + d.quality_marks, 0)

//     setTotalProductionMarks(pTotal)
//     setTotalQualityMarks(qTotal)
//     setOverallResult(pTotal >= 12 ? 'PASS' : 'PENDING')
//   }

//   // ---------- UI ----------
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6">

//         {/* ---------- HEADER ---------- */}
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-extrabold text-blue-900">
//             ON JOB TRAINING – DAILY PERFORMANCE SHEET
//           </h1>
//         </div>

//         {/* ---------- BASIC DETAILS ---------- */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-xl p-4 mb-6 bg-gray-50 text-sm">
//           <div><b>Change ID:</b> {changeId}</div>
//           <div><b>Trainee Name:</b> {employeeName}</div>
//           <div><b>Department:</b> {departmentName}</div>
//           <div><b>Line:</b> {lineName}</div>
//           <div><b>Shopfloor:</b> {shopfloorName}</div>
//           <div><b>Process Name:</b> {processName}</div>
//         </div>

//         {/* ---------- TABLE ---------- */}
//         <div className="overflow-x-auto">
//           <table className="w-full border text-center text-sm">
//             <thead>
//               <tr className="bg-blue-100 font-semibold">
//                 <th rowSpan={2} className="border p-2">Day</th>
//                 <th rowSpan={2} className="border p-2">Date</th>
//                 <th colSpan={3} className="border p-2">Production</th>
//                 <th colSpan={2} className="border p-2">Quality</th>
//               </tr>
//               <tr className="bg-blue-50">
//                 <th className="border p-2">Plan</th>
//                 <th className="border p-2">Actual</th>
//                 <th className="border p-2">Marks</th>
//                 <th className="border p-2">Rejections</th>
//                 <th className="border p-2">Marks</th>
//               </tr>
//             </thead>

//             <tbody>
//               {dailyScores.map((row, idx) => (
//                 <tr key={row.day}>
//                   <td className="border p-2">{row.day}</td>
//                   <td className="border p-1">
//                     <input type="date" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'date', e.target.value)} />
//                   </td>
//                   <td className="border p-1">
//                     <input type="number" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'plan', e.target.value)} />
//                   </td>
//                   <td className="border p-1">
//                     <input type="number" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'actual', e.target.value)} />
//                   </td>
//                   <td className="border font-bold text-blue-700">{row.production_marks}</td>
//                   <td className="border p-1">
//                     <input type="number" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)} />
//                   </td>
//                   <td className="border font-bold text-blue-700">{row.quality_marks}</td>
//                 </tr>
//               ))}
//             </tbody>

//             <tfoot>
//               <tr className="bg-gray-100 font-bold">
//                 <td colSpan={4} className="border p-2">Total Marks</td>
//                 <td className="border p-2 text-blue-800">{totalProductionMarks}</td>
//                 <td className="border p-2">Total Marks</td>
//                 <td className="border p-2 text-blue-800">{totalQualityMarks}</td>
//               </tr>
//               <tr className="bg-green-100 font-extrabold text-lg">
//                 <td colSpan={5} className="border p-2">OVERALL RESULT</td>
//                 <td colSpan={2} className="border p-2 text-green-700">
//                   {overallResult}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>

//         {/* ---------- ACTION ---------- */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => alert('Data Saved Successfully')}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-full font-bold shadow-lg"
//           >
//             Submit
//           </button>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default OnJobTraining




// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

// // --- Interfaces ---
// interface LocationState {
//   changeId?: string
//   employeeName?: string
//   lineId?: number | string
//   lineName?: string
//   departmentName?: string
//   shopfloorName?: string
//   processName?: string
// }

// interface DailyScore {
//   day: number
//   date: string
//   plan: string
//   actual: string
//   production_marks: number
//   rejections: string
//   quality_marks: number
// }

// // ---------------- COMPONENT ----------------
// const OnJobTraining = () => {
//   const location = useLocation()

//   // ---------- DEMO FALLBACK ----------
//   const demoState: LocationState = {
//     changeId: 'CHG-2024-001',
//     employeeName: 'John Doe',
//     lineName: 'Assembly Line A',
//     departmentName: 'Production',
//     shopfloorName: 'Shopfloor 1',
//     processName: 'Final Assembly',
//   }

//   const state = (location.state as LocationState) || demoState

//   const {
//     changeId,
//     employeeName,
//     lineName,
//     departmentName,
//     shopfloorName,
//     processName,
//   } = state

//   // ---------- STATES ----------
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([
//     { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//   ])

//   const [totalProductionMarks, setTotalProductionMarks] = useState(0)
//   const [totalQualityMarks, setTotalQualityMarks] = useState(0)
//   const [overallResult, setOverallResult] = useState('Pending')

//   // ---------- HANDLERS ----------
//   const handleInputChange = (index: number, field: string, value: string) => {
//     const updated = [...dailyScores]
//     updated[index] = { ...updated[index], [field]: value }

//     if (field === 'actual') updated[index].production_marks = 4
//     if (field === 'rejections') updated[index].quality_marks = 4

//     setDailyScores(updated)

//     const pTotal = updated.reduce((s, d) => s + d.production_marks, 0)
//     const qTotal = updated.reduce((s, d) => s + d.quality_marks, 0)

//     setTotalProductionMarks(pTotal)
//     setTotalQualityMarks(qTotal)
//     setOverallResult(pTotal >= 12 ? 'PASS' : 'PENDING')
//   }

//   // ---------- UI ----------
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6">

//         {/* ---------- HEADER ---------- */}
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-extrabold text-blue-900">
//             ON JOB TRAINING – DAILY PERFORMANCE SHEET
//           </h1>
//         </div>

//         {/* ---------- BASIC DETAILS ---------- */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-xl p-4 mb-6 bg-gray-50 text-sm">
//           <div><b>Change ID:</b> {changeId}</div>
//           <div><b>Trainee Name:</b> {employeeName}</div>
//           <div><b>Department:</b> {departmentName}</div>
//           <div><b>Line:</b> {lineName}</div>
//           <div><b>Shopfloor:</b> {shopfloorName}</div>
//           <div><b>Process Name:</b> {processName}</div>
//         </div>

//         {/* ---------- TABLE ---------- */}
//         <div className="overflow-x-auto">
//           <table className="w-full border text-center text-sm">
//             <thead>
//               <tr className="bg-blue-100 font-semibold">
//                 <th rowSpan={2} className="border p-2">Day</th>
//                 <th rowSpan={2} className="border p-2">Date</th>
//                 <th colSpan={3} className="border p-2">Production</th>
//                 <th colSpan={2} className="border p-2">Quality</th>
//               </tr>
//               <tr className="bg-blue-50">
//                 <th className="border p-2">Plan</th>
//                 <th className="border p-2">Actual</th>
//                 <th className="border p-2">Marks</th>
//                 <th className="border p-2">Rejections</th>
//                 <th className="border p-2">Marks</th>
//               </tr>
//             </thead>

//             <tbody>
//               {dailyScores.map((row, idx) => (
//                 <tr key={row.day}>
//                   <td className="border p-2">{row.day}</td>
//                   <td className="border p-1">
//                     <input type="date" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'date', e.target.value)} />
//                   </td>
//                   <td className="border p-1">
//                     <input type="number" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'plan', e.target.value)} />
//                   </td>
//                   <td className="border p-1">
//                     <input type="number" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'actual', e.target.value)} />
//                   </td>
//                   <td className="border font-bold text-blue-700">{row.production_marks}</td>
//                   <td className="border p-1">
//                     <input type="number" className="w-full border rounded p-1"
//                       onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)} />
//                   </td>
//                   <td className="border font-bold text-blue-700">{row.quality_marks}</td>
//                 </tr>
//               ))}
//             </tbody>

//             <tfoot>
//               <tr className="bg-gray-100 font-bold">
//                 <td colSpan={4} className="border p-2">Total Marks</td>
//                 <td className="border p-2 text-blue-800">{totalProductionMarks}</td>
//                 <td className="border p-2">Total Marks</td>
//                 <td className="border p-2 text-blue-800">{totalQualityMarks}</td>
//               </tr>
//               <tr className="bg-green-100 font-extrabold text-lg">
//                 <td colSpan={5} className="border p-2">OVERALL RESULT</td>
//                 <td colSpan={2} className="border p-2 text-green-700">
//                   {overallResult}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>

//         {/* ---------- ACTION ---------- */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => alert('Data Saved Successfully')}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-full font-bold shadow-lg"
//           >
//             Submit
//           </button>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default OnJobTraining


// import React, { useEffect, useState } from 'react'
// import { useLocation, useParams, useNavigate } from 'react-router-dom'
// import { Save, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'

// interface LocationState {
//   changeId?: string
//   fourMChangeId?: number
//   employeeName?: string
//   employeeId?: string
//   lineName?: string
//   departmentName?: string
//   shopfloorName?: string
//   stationName?: string
//   processName?: string
// }

// interface DailyScore {
//   id?: number
//   day: number
//   date: string
//   plan: string
//   actual: string
//   production_marks: number
//   rejections: string
//   quality_marks: number
// }

// interface OJTRecord {
//   id: number
//   change_record_id: string
//   trainee_name: string
//   trainee_employee_id: string
//   shopfloor_name: string
//   line_name: string
//   station_name: string
//   department_name: string
//   process_name: string
//   status: string
//   total_production_marks: number
//   total_quality_marks: number
//   overall_marks: number
//   daily_scores: DailyScore[]
//   created_at: string
//   updated_at: string
//   completed_at: string | null
// }

// const API_BASE_URL = '/' // Adjust this to your actual API URL

// const OnJobTraining = () => {
//   const location = useLocation()
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()

//   // Demo fallback state
//   const demoState: LocationState = {
//     changeId: 'REC-20240121-001',
//     fourMChangeId: 1,
//     employeeName: 'John Doe',
//     employeeId: 'EMP001',
//     lineName: 'Assembly Line A',
//     departmentName: 'Production',
//     shopfloorName: 'Shopfloor 1',
//     stationName: 'Station 1',
//     processName: 'Final Assembly',
//   }

//   const state = (location.state as LocationState) || demoState

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null)
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([
//     { day: 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 2, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 3, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 4, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 5, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//     { day: 6, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0 },
//   ])

//   const [totalProductionMarks, setTotalProductionMarks] = useState(0)
//   const [totalQualityMarks, setTotalQualityMarks] = useState(0)
//   const [overallResult, setOverallResult] = useState('in_progress')
//   const [loading, setLoading] = useState(false)
//   const [saveMessage, setSaveMessage] = useState('')
//   const [error, setError] = useState('')
//   const [isCreating, setIsCreating] = useState(false)

//   // Load existing OJT record or prepare for creation
//   useEffect(() => {
//     if (id) {
//       fetchOJTRecord(id)
//     } else if (state.fourMChangeId) {
//       // Check if OJT record exists for this change
//       checkExistingOJT(state.fourMChangeId, state.employeeId || '')
//     }
//   }, [id, state.fourMChangeId])

//   const checkExistingOJT = async (changeId: number, employeeId: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/ojt-records/?change_id=${state.changeId}&employee_id=${employeeId}`)
//       if (response.ok) {
//         const data = await response.json()
//         if (data.results && data.results.length > 0) {
//           setOjtRecord(data.results[0])
//           setDailyScores(data.results[0].daily_scores || dailyScores)
//           updateTotalsFromRecord(data.results[0])
//         }
//       }
//     } catch (error) {
//       console.error('Error checking existing OJT:', error)
//     }
//   }

//   const fetchOJTRecord = async (recordId: string) => {
//     setLoading(true)
//     setError('')
//     try {
//       const response = await fetch(`${API_BASE_URL}/ojt-records/${recordId}/`)
//       if (response.ok) {
//         const data = await response.json()
//         setOjtRecord(data)
//         setDailyScores(data.daily_scores || dailyScores)
//         updateTotalsFromRecord(data)
//       } else {
//         setError('Failed to load OJT record')
//       }
//     } catch (error) {
//       console.error('Error fetching OJT record:', error)
//       setError('Error loading OJT record')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateTotalsFromRecord = (record: OJTRecord) => {
//     setTotalProductionMarks(record.total_production_marks)
//     setTotalQualityMarks(record.total_quality_marks)
//     setOverallResult(record.status)
//   }

//   const createOJTRecord = async () => {
//     if (!state.fourMChangeId || !state.employeeName) {
//       setError('Missing required information to create OJT record')
//       return
//     }

//     setIsCreating(true)
//     setError('')

//     try {
//       const response = await fetch(`${API_BASE_URL}/ojt-records/create_from_change/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           four_m_change_id: state.fourMChangeId,
//           trainee_name: state.employeeName,
//           trainee_employee_id: state.employeeId || '',
//           process_name: state.processName || 'OJT Process',
//           department_name: state.departmentName || 'Production'
//         }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setOjtRecord(data)
//         setDailyScores(data.daily_scores || dailyScores)
//         updateTotalsFromRecord(data)
//         setSaveMessage('OJT record created successfully!')
//         setTimeout(() => setSaveMessage(''), 3000)
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || 'Failed to create OJT record')
//       }
//     } catch (error) {
//       console.error('Error creating OJT record:', error)
//       setError('Error creating OJT record')
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   const calculateMarks = (index: number, field: string, value: string) => {
//     const updated = [...dailyScores]
    
//     if (field === 'actual' && value) {
//       const plan = parseInt(updated[index].plan) || 0
//       const actual = parseInt(value) || 0
      
//       if (plan > 0) {
//         const percentage = (actual / plan) * 100
//         if (percentage >= 100) {
//           updated[index].production_marks = 4
//         } else if (percentage >= 90) {
//           updated[index].production_marks = 4
//         } else if (percentage >= 75) {
//           updated[index].production_marks = 3
//         } else if (percentage >= 60) {
//           updated[index].production_marks = 2
//         } else if (actual > 0) {
//           updated[index].production_marks = 1
//         } else {
//           updated[index].production_marks = 0
//         }
//       } else if (actual > 0) {
//         updated[index].production_marks = 4
//       }
//     }

//     if (field === 'rejections' && value !== '') {
//       const rejections = parseInt(value) || 0
//       if (rejections === 0) {
//         updated[index].quality_marks = 4
//       } else if (rejections <= 2) {
//         updated[index].quality_marks = 3
//       } else if (rejections <= 5) {
//         updated[index].quality_marks = 2
//       } else {
//         updated[index].quality_marks = 1
//       }
//     }

//     return updated
//   }

//   const handleInputChange = (index: number, field: string, value: string) => {
//     const updated = [...dailyScores]
//     updated[index] = { ...updated[index], [field]: value }

//     const calculatedScores = calculateMarks(index, field, value)
//     setDailyScores(calculatedScores)

//     const pTotal = calculatedScores.reduce((s, d) => s + d.production_marks, 0)
//     const qTotal = calculatedScores.reduce((s, d) => s + d.quality_marks, 0)

//     setTotalProductionMarks(pTotal)
//     setTotalQualityMarks(qTotal)

//     const completedDays = calculatedScores.filter(
//       d => d.date && d.plan && d.actual && d.rejections !== ''
//     ).length

//     if (completedDays === 6) {
//       setOverallResult(pTotal >= 12 ? 'pass' : 'fail')
//     } else {
//       setOverallResult('in_progress')
//     }
//   }

//   const handleSaveDailyScore = async (index: number) => {
//     if (!ojtRecord?.id) {
//       // Create OJT record first if it doesn't exist
//       await createOJTRecord()
//       return
//     }

//     setLoading(true)
//     setSaveMessage('')
//     setError('')

//     try {
//       const dayData = dailyScores[index]
//       const response = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: dayData.day,
//           date: dayData.date || null,
//           plan: dayData.plan ? parseInt(dayData.plan) : null,
//           actual: dayData.actual ? parseInt(dayData.actual) : null,
//           rejections: dayData.rejections !== '' ? parseInt(dayData.rejections) : null,
//         }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setSaveMessage(`Day ${dayData.day} saved successfully!`)
        
//         setDailyScores(data.daily_scores || dailyScores)
//         updateTotalsFromRecord(data)
        
//         setTimeout(() => setSaveMessage(''), 3000)
//       } else {
//         setError(`Failed to save Day ${dayData.day}`)
//       }
//     } catch (error) {
//       console.error('Error saving daily score:', error)
//       setError('Error saving data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSaveAll = async () => {
//     if (!ojtRecord?.id) {
//       await createOJTRecord()
//       return
//     }

//     setLoading(true)
//     setSaveMessage('')
//     setError('')

//     try {
//       for (let i = 0; i < dailyScores.length; i++) {
//         const dayData = dailyScores[i]
//         if (dayData.date || dayData.plan || dayData.actual || dayData.rejections !== '') {
//           await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               day: dayData.day,
//               date: dayData.date || null,
//               plan: dayData.plan ? parseInt(dayData.plan) : null,
//               actual: dayData.actual ? parseInt(dayData.actual) : null,
//               rejections: dayData.rejections !== '' ? parseInt(dayData.rejections) : null,
//             }),
//           })
//         }
//       }

//       await fetchOJTRecord(ojtRecord.id.toString())
//       setSaveMessage('All data saved successfully!')
//       setTimeout(() => setSaveMessage(''), 3000)
//     } catch (error) {
//       console.error('Error saving all scores:', error)
//       setError('Error saving data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async () => {
//     if (!ojtRecord?.id) {
//       setError('Please save the data first')
//       return
//     }

//     const completedDays = dailyScores.filter(
//       d => d.date && d.plan && d.actual && d.rejections !== ''
//     ).length

//     if (completedDays < 6) {
//       if (!window.confirm(`Only ${completedDays} days completed. Submit anyway?`)) {
//         return
//       }
//     }

//     setLoading(true)
//     setError('')

//     try {
//       const response = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/submit/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         alert(data.message)
//         await fetchOJTRecord(ojtRecord.id.toString())
//       } else {
//         setError('Failed to submit OJT record')
//       }
//     } catch (error) {
//       console.error('Error submitting:', error)
//       setError('Error submitting OJT record')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusDisplay = (status: string) => {
//     switch (status) {
//       case 'pass':
//         return { text: 'PASS', color: 'text-green-700 bg-green-100', icon: CheckCircle }
//       case 'fail':
//         return { text: 'FAIL', color: 'text-red-700 bg-red-100', icon: XCircle }
//       default:
//         return { text: 'IN PROGRESS', color: 'text-yellow-700 bg-yellow-100', icon: Clock }
//     }
//   }

//   const statusInfo = getStatusDisplay(overallResult)
//   const StatusIcon = statusInfo.icon

//   if (loading && !ojtRecord && !dailyScores[0].date) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//           <div className="text-xl text-gray-600">Loading OJT Record...</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-medium"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
          
//           {/* Header */}
//           <div className="text-center mb-6">
//             <h1 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-2">
//               ON JOB TRAINING – DAILY PERFORMANCE SHEET
//             </h1>
//             {ojtRecord && (
//               <div className="text-sm text-gray-600">
//                 Record ID: <span className="font-semibold">{ojtRecord.change_record_id}</span>
//               </div>
//             )}
//           </div>

//           {/* Messages */}
//           {saveMessage && (
//             <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
//               {saveMessage}
//             </div>
//           )}
          
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
//               {error}
//             </div>
//           )}

//           {/* Basic Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border rounded-xl p-4 mb-6 bg-gray-50 text-sm">
//             <div>
//               <span className="font-semibold text-gray-700">Change ID:</span>
//               <span className="ml-2">{state.changeId || ojtRecord?.change_record_id}</span>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Trainee Name:</span>
//               <span className="ml-2">{state.employeeName || ojtRecord?.trainee_name}</span>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Employee ID:</span>
//               <span className="ml-2">{state.employeeId || ojtRecord?.trainee_employee_id}</span>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Department:</span>
//               <span className="ml-2">{state.departmentName || ojtRecord?.department_name}</span>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Shopfloor:</span>
//               <span className="ml-2">{state.shopfloorName || ojtRecord?.shopfloor_name}</span>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Line:</span>
//               <span className="ml-2">{state.lineName || ojtRecord?.line_name}</span>
//             </div>
//             {(state.stationName || ojtRecord?.station_name) && (
//               <div>
//                 <span className="font-semibold text-gray-700">Station:</span>
//                 <span className="ml-2">{state.stationName || ojtRecord?.station_name}</span>
//               </div>
//             )}
//             <div>
//               <span className="font-semibold text-gray-700">Process:</span>
//               <span className="ml-2">{state.processName || ojtRecord?.process_name}</span>
//             </div>
//           </div>

//           {/* Create Record Button (if not created yet) */}
//           {!ojtRecord && (
//             <div className="mb-6 text-center">
//               <button
//                 onClick={createOJTRecord}
//                 disabled={isCreating}
//                 className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 {isCreating ? 'Creating...' : 'Create OJT Record'}
//               </button>
//             </div>
//           )}

//           {/* Table */}
//           <div className="overflow-x-auto -mx-4 md:mx-0">
//             <div className="inline-block min-w-full align-middle">
//               <table className="min-w-full border text-center text-xs md:text-sm">
//                 <thead>
//                   <tr className="bg-blue-100 font-semibold">
//                     <th rowSpan={2} className="border p-2">Day</th>
//                     <th rowSpan={2} className="border p-2">Date</th>
//                     <th colSpan={3} className="border p-2">Production</th>
//                     <th colSpan={2} className="border p-2">Quality</th>
//                     <th rowSpan={2} className="border p-2">Action</th>
//                   </tr>
//                   <tr className="bg-blue-50">
//                     <th className="border p-2">Plan</th>
//                     <th className="border p-2">Actual</th>
//                     <th className="border p-2">Marks</th>
//                     <th className="border p-2">Rejections</th>
//                     <th className="border p-2">Marks</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {dailyScores.map((row, idx) => (
//                     <tr key={row.day} className="hover:bg-gray-50">
//                       <td className="border p-2 font-semibold">{row.day}</td>
//                       <td className="border p-1">
//                         <input 
//                           type="date" 
//                           className="w-full border rounded p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           value={row.date}
//                           onChange={(e) => handleInputChange(idx, 'date', e.target.value)}
//                           disabled={ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail'}
//                         />
//                       </td>
//                       <td className="border p-1">
//                         <input 
//                           type="number" 
//                           placeholder="0"
//                           className="w-full border rounded p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           value={row.plan}
//                           onChange={(e) => handleInputChange(idx, 'plan', e.target.value)}
//                           disabled={ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail'}
//                         />
//                       </td>
//                       <td className="border p-1">
//                         <input 
//                           type="number" 
//                           placeholder="0"
//                           className="w-full border rounded p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           value={row.actual}
//                           onChange={(e) => handleInputChange(idx, 'actual', e.target.value)}
//                           disabled={ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail'}
//                         />
//                       </td>
//                       <td className="border p-2 font-bold text-blue-700 text-lg">
//                         {row.production_marks}
//                       </td>
//                       <td className="border p-1">
//                         <input 
//                           type="number" 
//                           placeholder="0"
//                           className="w-full border rounded p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           value={row.rejections}
//                           onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)}
//                           disabled={ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail'}
//                         />
//                       </td>
//                       <td className="border p-2 font-bold text-blue-700 text-lg">
//                         {row.quality_marks}
//                       </td>
//                       <td className="border p-1">
//                         <button
//                           onClick={() => handleSaveDailyScore(idx)}
//                           disabled={loading || ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail'}
//                           className="bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium shadow disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
//                         >
//                           <Save className="w-3 h-3 md:w-4 md:h-4 mr-1" />
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 <tfoot>
//                   <tr className="bg-gray-100 font-bold">
//                     <td colSpan={4} className="border p-3 text-right">Total Marks:</td>
//                     <td className="border p-3 text-blue-800 text-lg">{totalProductionMarks}</td>
//                     <td className="border p-3">Total Marks:</td>
//                     <td colSpan={2} className="border p-3 text-blue-800 text-lg">{totalQualityMarks}</td>
//                   </tr>
//                   <tr className={`${statusInfo.color} font-extrabold text-base md:text-lg`}>
//                     <td colSpan={5} className="border p-3 text-right flex items-center justify-end">
//                       <StatusIcon className="w-6 h-6 mr-2" />
//                       OVERALL RESULT:
//                     </td>
//                     <td colSpan={3} className="border p-3">
//                       {statusInfo.text}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>

//           {/* Marking Criteria Info */}
//           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
//             <h3 className="font-bold text-blue-900 mb-2">Marking Criteria:</h3>
//             <div className="grid md:grid-cols-2 gap-3">
//               <div>
//                 <p className="font-semibold text-blue-800">Production Marks:</p>
//                 <ul className="ml-4 text-gray-700 text-xs">
//                   <li>• 4 marks: ≥100% of plan achieved</li>
//                   <li>• 3 marks: 75-89% of plan</li>
//                   <li>• 2 marks: 60-74% of plan</li>
//                   <li>• 1 mark: &lt;60% of plan</li>
//                 </ul>
//               </div>
//               <div>
//                 <p className="font-semibold text-blue-800">Quality Marks:</p>
//                 <ul className="ml-4 text-gray-700 text-xs">
//                   <li>• 4 marks: 0 rejections</li>
//                   <li>• 3 marks: 1-2 rejections</li>
//                   <li>• 2 marks: 3-5 rejections</li>
//                   <li>• 1 mark: &gt;5 rejections</li>
//                 </ul>
//               </div>
//             </div>
//             <p className="mt-2 text-blue-800 font-semibold">
//               Pass Criteria: Minimum 12 production marks across 6 days
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
//             <button
//               onClick={handleSaveAll}
//               disabled={loading || !ojtRecord || ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail'}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               <Save className="w-5 h-5 mr-2" />
//               {loading ? 'Saving...' : 'Save All Data'}
//             </button>
            
//             <button
//               onClick={handleSubmit}
//               disabled={loading || !ojtRecord || ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail'}
//               className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               <CheckCircle className="w-5 h-5 mr-2" />
//               {loading ? 'Submitting...' : 'Submit Final'}
//             </button>
//           </div>

//           {/* Record Info */}
//           {ojtRecord && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
//               <p><span className="font-semibold">Created:</span> {new Date(ojtRecord.created_at).toLocaleString()}</p>
//               <p><span className="font-semibold">Last Updated:</span> {new Date(ojtRecord.updated_at).toLocaleString()}</p>
//               {ojtRecord.completed_at && (
//                 <p><span className="font-semibold">Completed:</span> {new Date(ojtRecord.completed_at).toLocaleString()}</p>
//               )}
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default OnJobTraining





// import React, { useEffect, useState } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import { Save, CheckCircle, XCircle, Clock, ArrowLeft, AlertCircle } from 'lucide-react';

// interface LocationState {
//   changeId?: string;           // e.g. "REC-20250121-042"
//   fourMChangeId?: number;      // optional – internal DB pk
//   shopfloorName?: string;
//   lineName?: string;
//   stationName?: string;
//   departmentName?: string;
//   processName?: string;
// }

// interface DailyScore {
//   id?: number;
//   day: number;
//   date: string;
//   plan: string;
//   actual: string;
//   production_marks: number;
//   rejections: string;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   change_record_id: string;
//   shopfloor_name: string;
//   line_name: string;
//   station_name: string | null;
//   department_name: string | null;
//   process_name: string | null;
//   status: 'in_progress' | 'pass' | 'fail';
//   total_production_marks: number;
//   total_quality_marks: number;
//   overall_marks: number;
//   daily_scores: DailyScore[];
//   created_at: string;
//   updated_at: string;
//   completed_at: string | null;
// }

// const API_BASE_URL = '/api'; // ← change to your real base URL if different

// const initialDailyScores: DailyScore[] = Array.from({ length: 6 }, (_, i) => ({
//   day: i + 1,
//   date: '',
//   plan: '',
//   actual: '',
//   production_marks: 0,
//   rejections: '',
//   quality_marks: 0,
// }));

// const OnJobTraining = () => {
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>(); // if editing by numeric pk
//   const navigate = useNavigate();

//   const state = (location.state as LocationState) || {};

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>(initialDailyScores);
//   const [totalProductionMarks, setTotalProductionMarks] = useState(0);
//   const [totalQualityMarks, setTotalQualityMarks] = useState(0);
//   const [overallResult, setOverallResult] = useState('in_progress');

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');

//   const changeRecordId = state.changeId || ojtRecord?.change_record_id;

//   // ────────────────────────────────────────────────
//   // Load or auto-create OJT when changeId is known
//   // ────────────────────────────────────────────────
//   useEffect(() => {
//     if (id) {
//       // Load by numeric pk (rare case)
//       fetchOjtById(id);
//     } else if (changeRecordId) {
//       // Main flow: lookup by change_record_id
//       loadOrCreateOjtForChange(changeRecordId);
//     }
//   }, [id, changeRecordId]);

//   const fetchOjtById = async (recordId: string) => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${recordId}/`);
//       if (!res.ok) throw new Error('Failed to load record');
//       const data = await res.json();
//       setOjtRecord(data);
//       setDailyScores(data.daily_scores || initialDailyScores);
//       updateTotals(data);
//     } catch (err) {
//       setError('Could not load OJT record');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadOrCreateOjtForChange = async (recId: string) => {
//     setLoading(true);
//     setError('');

//     try {
//       // 1. Check if exists
//       const checkRes = await fetch(`${API_BASE_URL}/ojt-records/?change_id=${encodeURIComponent(recId)}`);
//       if (!checkRes.ok) throw new Error();

//       const checkData = await checkRes.json();

//       if (checkData.results?.length > 0) {
//         // Exists → load it
//         const record = checkData.results[0];
//         setOjtRecord(record);
//         setDailyScores(record.daily_scores || initialDailyScores);
//         updateTotals(record);
//       } else {
//         // Does not exist → create
//         await createOjtForChange(recId);
//       }
//     } catch (err) {
//       setError('Failed to check/load OJT record');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createOjtForChange = async (recId: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/create_from_change/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           four_m_change_record_id: recId,
//           // optional – only if you want to override defaults
//           department_name: state.departmentName,
//           process_name: state.processName,
//         }),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.error || 'Creation failed');
//       }

//       const data = await res.json();
//       setOjtRecord(data);
//       setDailyScores(data.daily_scores || initialDailyScores);
//       updateTotals(data);
//       setSuccessMsg('OJT record created');
//       setTimeout(() => setSuccessMsg(''), 4000);
//     } catch (err: any) {
//       setError(err.message || 'Could not create OJT record');
//     }
//   };

//   const updateTotals = (record: OJTRecord) => {
//     setTotalProductionMarks(record.total_production_marks);
//     setTotalQualityMarks(record.total_quality_marks);
//     setOverallResult(record.status);
//   };

//   // ────────────────────────────────────────────────
//   // Local change → recalculate marks & totals
//   // ────────────────────────────────────────────────
//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;

//     const updated = [...dailyScores];
//     updated[index] = { ...updated[index], [field]: value };

//     // Calculate production marks
//     if (field === 'actual' || field === 'plan') {
//       const plan = parseInt(updated[index].plan) || 0;
//       const actual = parseInt(updated[index].actual) || 0;

//       if (actual === 0) {
//         updated[index].production_marks = 0;
//       } else if (plan === 0) {
//         updated[index].production_marks = actual > 0 ? 4 : 0;
//       } else {
//         const perc = (actual / plan) * 100;
//         if (perc >= 90) updated[index].production_marks = 4;
//         else if (perc >= 75) updated[index].production_marks = 3;
//         else if (perc >= 60) updated[index].production_marks = 2;
//         else updated[index].production_marks = 1;
//       }
//     }

//     // Calculate quality marks
//     if (field === 'rejections') {
//       const rej = parseInt(value) || 0;
//       if (rej === 0) updated[index].quality_marks = 4;
//       else if (rej <= 2) updated[index].quality_marks = 3;
//       else if (rej <= 5) updated[index].quality_marks = 2;
//       else updated[index].quality_marks = 1;
//     }

//     setDailyScores(updated);

//     const prodSum = updated.reduce((sum, d) => sum + d.production_marks, 0);
//     const qualSum = updated.reduce((sum, d) => sum + d.quality_marks, 0);
//     setTotalProductionMarks(prodSum);
//     setTotalQualityMarks(qualSum);

//     const completed = updated.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//     if (completed === 6) {
//       setOverallResult(prodSum >= 12 ? 'pass' : 'fail');
//     } else {
//       setOverallResult('in_progress');
//     }
//   };

//   // ────────────────────────────────────────────────
//   // Save single day
//   // ────────────────────────────────────────────────
//   const saveDay = async (index: number) => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;
//     setSaving(true);
//     setError('');
//     setSuccessMsg('');

//     const day = dailyScores[index];

//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: day.day,
//           date: day.date || null,
//           plan: day.plan ? parseInt(day.plan) : null,
//           actual: day.actual ? parseInt(day.actual) : null,
//           rejections: day.rejections !== '' ? parseInt(day.rejections) : null,
//         }),
//       });

//       if (!res.ok) throw new Error('Save failed');

//       const updatedRecord = await res.json();
//       setOjtRecord(updatedRecord);
//       setDailyScores(updatedRecord.daily_scores || dailyScores);
//       updateTotals(updatedRecord);
//       setSuccessMsg(`Day ${day.day} saved`);
//       setTimeout(() => setSuccessMsg(''), 3000);
//     } catch (err) {
//       setError('Failed to save day');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ────────────────────────────────────────────────
//   // Save all changed days
//   // ────────────────────────────────────────────────
//   const saveAll = async () => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;
//     setSaving(true);
//     setError('');
//     setSuccessMsg('');

//     try {
//       for (let i = 0; i < dailyScores.length; i++) {
//         const d = dailyScores[i];
//         if (d.date || d.plan || d.actual || d.rejections !== '') {
//           await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               day: d.day,
//               date: d.date || null,
//               plan: d.plan ? parseInt(d.plan) : null,
//               actual: d.actual ? parseInt(d.actual) : null,
//               rejections: d.rejections !== '' ? parseInt(d.rejections) : null,
//             }),
//           });
//         }
//       }

//       // Refresh full record
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/`);
//       const fresh = await res.json();
//       setOjtRecord(fresh);
//       setDailyScores(fresh.daily_scores || dailyScores);
//       updateTotals(fresh);
//       setSuccessMsg('All changes saved');
//       setTimeout(() => setSuccessMsg(''), 4000);
//     } catch (err) {
//       setError('Failed to save all data');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ────────────────────────────────────────────────
//   // Final submit
//   // ────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!ojtRecord) return;
//     if (ojtRecord.status !== 'in_progress') return;

//     const completed = dailyScores.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//     if (completed < 6 && !window.confirm(`Only ${completed}/6 days filled. Submit anyway?`)) {
//       return;
//     }

//     setSaving(true);
//     setError('');

//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/submit/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       setOjtRecord(data.data);
//       setDailyScores(data.data.daily_scores || dailyScores);
//       updateTotals(data.data);
//       setSuccessMsg(data.message || 'Submitted successfully');
//     } catch (err) {
//       setError('Failed to submit final record');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const isFinal = ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail';
//   const canEdit = !isFinal;

//   const getStatusStyle = () => {
//     if (overallResult === 'pass') return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
//     if (overallResult === 'fail') return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
//     return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
//   };

//   const StatusInfo = getStatusStyle();
//   const StatusIcon = StatusInfo.icon;

//   if (loading && !ojtRecord) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading OJT record...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* Back & Title */}
//         <div className="mb-6 flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back
//           </button>
//           <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
//             On Job Training – Daily Performance
//           </h1>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
//             <AlertCircle className="w-5 h-5" />
//             {error}
//           </div>
//         )}

//         {successMsg && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
//             {successMsg}
//           </div>
//         )}

//         {/* Header Info */}
//         <div className="bg-white rounded-xl shadow p-5 md:p-6 mb-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//             <div>
//               <span className="font-semibold text-gray-700">Change ID:</span>
//               <div className="mt-1 font-mono">{changeRecordId || '—'}</div>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Shopfloor:</span>
//               <div className="mt-1">{state.shopfloorName || ojtRecord?.shopfloor_name || '—'}</div>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Line:</span>
//               <div className="mt-1">{state.lineName || ojtRecord?.line_name || '—'}</div>
//             </div>
//             { (state.stationName || ojtRecord?.station_name) && (
//               <div>
//                 <span className="font-semibold text-gray-700">Station:</span>
//                 <div className="mt-1">{state.stationName || ojtRecord?.station_name}</div>
//               </div>
//             )}
//             <div>
//               <span className="font-semibold text-gray-700">Department:</span>
//               <div className="mt-1">{state.departmentName || ojtRecord?.department_name || 'Production'}</div>
//             </div>
//             <div>
//               <span className="font-semibold text-gray-700">Process:</span>
//               <div className="mt-1">{state.processName || ojtRecord?.process_name || '—'}</div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-center border-collapse">
//               <thead>
//                 <tr className="bg-blue-100">
//                   <th rowSpan={2} className="border p-3 font-semibold">Day</th>
//                   <th rowSpan={2} className="border p-3 font-semibold">Date</th>
//                   <th colSpan={3} className="border p-3 font-semibold bg-blue-50">Production</th>
//                   <th colSpan={2} className="border p-3 font-semibold bg-blue-50">Quality</th>
//                   <th rowSpan={2} className="border p-3 font-semibold">Save</th>
//                 </tr>
//                 <tr className="bg-blue-50">
//                   <th className="border p-2">Plan</th>
//                   <th className="border p-2">Actual</th>
//                   <th className="border p-2">Marks</th>
//                   <th className="border p-2">Rejections</th>
//                   <th className="border p-2">Marks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dailyScores.map((row, idx) => (
//                   <tr key={row.day} className="hover:bg-gray-50">
//                     <td className="border p-3 font-medium">{row.day}</td>
//                     <td className="border p-2">
//                       <input
//                         type="date"
//                         value={row.date}
//                         onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                         disabled={!canEdit}
//                         className="w-full p-1 border rounded text-center disabled:bg-gray-100"
//                       />
//                     </td>
//                     <td className="border p-2">
//                       <input
//                         type="number"
//                         value={row.plan}
//                         onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                         disabled={!canEdit}
//                         className="w-full p-1 border rounded text-center disabled:bg-gray-100"
//                         min="0"
//                       />
//                     </td>
//                     <td className="border p-2">
//                       <input
//                         type="number"
//                         value={row.actual}
//                         onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                         disabled={!canEdit}
//                         className="w-full p-1 border rounded text-center disabled:bg-gray-100"
//                         min="0"
//                       />
//                     </td>
//                     <td className="border p-3 font-bold text-blue-700">
//                       {row.production_marks}
//                     </td>
//                     <td className="border p-2">
//                       <input
//                         type="number"
//                         value={row.rejections}
//                         onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                         disabled={!canEdit}
//                         className="w-full p-1 border rounded text-center disabled:bg-gray-100"
//                         min="0"
//                       />
//                     </td>
//                     <td className="border p-3 font-bold text-blue-700">
//                       {row.quality_marks}
//                     </td>
//                     <td className="border p-2">
//                       <button
//                         onClick={() => saveDay(idx)}
//                         disabled={saving || !canEdit}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
//                       >
//                         <Save size={14} />
//                         Save
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr className="bg-gray-100 font-bold">
//                   <td colSpan={4} className="border p-3 text-right">Total Production Marks</td>
//                   <td className="border p-3 text-blue-800">{totalProductionMarks}</td>
//                   <td className="border p-3 text-right">Total Quality Marks</td>
//                   <td colSpan={2} className="border p-3 text-blue-800">{totalQualityMarks}</td>
//                 </tr>
//                 <tr className={`${StatusInfo.bg} font-bold text-base`}>
//                   <td colSpan={5} className="border p-4 flex items-center justify-end gap-3">
//                     <StatusIcon className="w-6 h-6" />
//                     OVERALL RESULT
//                   </td>
//                   <td colSpan={3} className={`border p-4 ${StatusInfo.text}`}>
//                     {overallResult.toUpperCase()}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>

//         {/* Actions */}
//         {ojtRecord && (
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//             <button
//               onClick={saveAll}
//               disabled={saving || !canEdit}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               <Save size={18} />
//               Save All
//             </button>

//             <button
//               onClick={handleSubmit}
//               disabled={saving || !canEdit}
//               className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               <CheckCircle size={18} />
//               Submit Final
//             </button>
//           </div>
//         )}

//         {/* Marking criteria info */}
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
//           <h3 className="font-bold text-blue-900 mb-3">Evaluation Rules</h3>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <p className="font-semibold mb-2">Production (max 4/day):</p>
//               <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                 <li>≥ 90% of plan → 4 marks</li>
//                 <li>75–89% → 3 marks</li>
//                 <li>60–74% → 2 marks</li>
//                 <li> 60% → 1 mark</li>
//               </ul>
//             </div>
//             <div>
//               <p className="font-semibold mb-2">Quality (max 4/day):</p>
//               <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                 <li>0 rejections → 4 marks</li>
//                 <li>1–2 → 3 marks</li>
//                 <li>3–5 → 2 marks</li>
//                 <li> 5 → 1 mark</li>
//               </ul>
//             </div>
//           </div>
//           <p className="mt-4 font-semibold text-blue-800">
//             Pass requirement: ≥ 12 production marks after 6 days
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default OnJobTraining;





// import React, { useEffect, useState, useCallback } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import {
//   Save,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ArrowLeft,
//   AlertCircle,
//   TrendingUp,
//   Award,
//   Target,
//   Calendar,
//   Factory,
//   Layers,
//   Settings,
//   RefreshCw,
//   ChevronDown,
//   ChevronUp,
//   Info,
//   Sparkles,
//   BarChart3,
//   Shield,
//   Loader2,
//   Check,
//   X,
//   Download,
//   Printer,
// } from 'lucide-react';

// interface LocationState {
//   changeId?: string;
//   fourMChangeId?: number;
//   shopfloorName?: string;
//   lineName?: string;
//   stationName?: string;
//   departmentName?: string;
//   processName?: string;
// }

// interface DailyScore {
//   id?: number;
//   day: number;
//   date: string;
//   plan: string;
//   actual: string;
//   production_marks: number;
//   rejections: string;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   change_record_id: string;
//   shopfloor_name: string;
//   line_name: string;
//   station_name: string | null;
//   department_name: string | null;
//   process_name: string | null;
//   status: 'in_progress' | 'pass' | 'fail';
//   total_production_marks: number;
//   total_quality_marks: number;
//   overall_marks: number;
//   daily_scores: DailyScore[];
//   created_at: string;
//   updated_at: string;
//   completed_at: string | null;
// }

// const API_BASE_URL = '/api';

// const initialDailyScores: DailyScore[] = Array.from({ length: 6 }, (_, i) => ({
//   day: i + 1,
//   date: '',
//   plan: '',
//   actual: '',
//   production_marks: 0,
//   rejections: '',
//   quality_marks: 0,
// }));

// // Toast notification component
// const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({
//   message,
//   type,
//   onClose,
// }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 4000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const styles = {
//     success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
//     error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
//     info: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
//   };

//   const icons = {
//     success: <CheckCircle className="w-5 h-5" />,
//     error: <XCircle className="w-5 h-5" />,
//     info: <Info className="w-5 h-5" />,
//   };

//   return (
//     <div className={`fixed top-4 right-4 z-50 ${styles[type]} px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in`}>
//       {icons[type]}
//       <span className="font-medium">{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity">
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// // Progress Ring component
// const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string }> = ({
//   progress,
//   size = 120,
//   strokeWidth = 10,
//   color = '#3B82F6',
// }) => {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = radius * 2 * Math.PI;
//   const offset = circumference - (progress / 100) * circumference;

//   return (
//     <svg width={size} height={size} className="transform -rotate-90">
//       <circle
//         className="text-gray-200"
//         strokeWidth={strokeWidth}
//         stroke="currentColor"
//         fill="transparent"
//         r={radius}
//         cx={size / 2}
//         cy={size / 2}
//       />
//       <circle
//         className="transition-all duration-700 ease-out"
//         strokeWidth={strokeWidth}
//         strokeDasharray={circumference}
//         strokeDashoffset={offset}
//         strokeLinecap="round"
//         stroke={color}
//         fill="transparent"
//         r={radius}
//         cx={size / 2}
//         cy={size / 2}
//       />
//     </svg>
//   );
// };

// // Stat Card component
// const StatCard: React.FC<{
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
//   trend?: number;
//   subtitle?: string;
// }> = ({ title, value, icon, color, trend, subtitle }) => (
//   <div className={`relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
//     <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 ${color}`} />
//     <div className="relative">
//       <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} text-white mb-4`}>
//         {icon}
//       </div>
//       <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
//       <div className="flex items-end gap-2 mt-1">
//         <p className="text-3xl font-bold text-gray-900">{value}</p>
//         {trend !== undefined && (
//           <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//             {trend >= 0 ? '+' : ''}{trend}%
//           </span>
//         )}
//       </div>
//       {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
//     </div>
//   </div>
// );

// // Skeleton loader
// const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
//   <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`} />
// );

// const OnJobTraining = () => {
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const state = (location.state as LocationState) || {};

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>(initialDailyScores);
//   const [totalProductionMarks, setTotalProductionMarks] = useState(0);
//   const [totalQualityMarks, setTotalQualityMarks] = useState(0);
//   const [overallResult, setOverallResult] = useState('in_progress');

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [expandedRow, setExpandedRow] = useState<number | null>(null);

//   const changeRecordId = state.changeId || ojtRecord?.change_record_id;

//   const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
//     setToast({ message, type });
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchOjtById(id);
//     } else if (changeRecordId) {
//       loadOrCreateOjtForChange(changeRecordId);
//     }
//   }, [id, changeRecordId]);

//   const fetchOjtById = async (recordId: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${recordId}/`);
//       if (!res.ok) throw new Error('Failed to load record');
//       const data = await res.json();
//       setOjtRecord(data);
//       setDailyScores(data.daily_scores || initialDailyScores);
//       updateTotals(data);
//     } catch (err) {
//       showToast('Could not load OJT record', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadOrCreateOjtForChange = async (recId: string) => {
//     setLoading(true);
//     try {
//       const checkRes = await fetch(`${API_BASE_URL}/ojt-records/?change_id=${encodeURIComponent(recId)}`);
//       if (!checkRes.ok) throw new Error();

//       const checkData = await checkRes.json();

//       if (checkData.results?.length > 0) {
//         const record = checkData.results[0];
//         setOjtRecord(record);
//         setDailyScores(record.daily_scores || initialDailyScores);
//         updateTotals(record);
//       } else {
//         await createOjtForChange(recId);
//       }
//     } catch (err) {
//       showToast('Failed to check/load OJT record', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createOjtForChange = async (recId: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/create_from_change/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           four_m_change_record_id: recId,
//           department_name: state.departmentName,
//           process_name: state.processName,
//         }),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.error || 'Creation failed');
//       }

//       const data = await res.json();
//       setOjtRecord(data);
//       setDailyScores(data.daily_scores || initialDailyScores);
//       updateTotals(data);
//       showToast('OJT record created successfully', 'success');
//     } catch (err: any) {
//       showToast(err.message || 'Could not create OJT record', 'error');
//     }
//   };

//   const updateTotals = (record: OJTRecord) => {
//     setTotalProductionMarks(record.total_production_marks);
//     setTotalQualityMarks(record.total_quality_marks);
//     setOverallResult(record.status);
//   };

//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;

//     const updated = [...dailyScores];
//     updated[index] = { ...updated[index], [field]: value };

//     if (field === 'actual' || field === 'plan') {
//       const plan = parseInt(updated[index].plan) || 0;
//       const actual = parseInt(updated[index].actual) || 0;

//       if (actual === 0) {
//         updated[index].production_marks = 0;
//       } else if (plan === 0) {
//         updated[index].production_marks = actual > 0 ? 4 : 0;
//       } else {
//         const perc = (actual / plan) * 100;
//         if (perc >= 90) updated[index].production_marks = 4;
//         else if (perc >= 75) updated[index].production_marks = 3;
//         else if (perc >= 60) updated[index].production_marks = 2;
//         else updated[index].production_marks = 1;
//       }
//     }

//     if (field === 'rejections') {
//       const rej = parseInt(value) || 0;
//       if (rej === 0) updated[index].quality_marks = 4;
//       else if (rej <= 2) updated[index].quality_marks = 3;
//       else if (rej <= 5) updated[index].quality_marks = 2;
//       else updated[index].quality_marks = 1;
//     }

//     setDailyScores(updated);

//     const prodSum = updated.reduce((sum, d) => sum + d.production_marks, 0);
//     const qualSum = updated.reduce((sum, d) => sum + d.quality_marks, 0);
//     setTotalProductionMarks(prodSum);
//     setTotalQualityMarks(qualSum);

//     const completed = updated.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//     if (completed === 6) {
//       setOverallResult(prodSum >= 12 ? 'pass' : 'fail');
//     } else {
//       setOverallResult('in_progress');
//     }
//   };

//   const saveDay = async (index: number) => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;
//     setSavingDay(index);

//     const day = dailyScores[index];

//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: day.day,
//           date: day.date || null,
//           plan: day.plan ? parseInt(day.plan) : null,
//           actual: day.actual ? parseInt(day.actual) : null,
//           rejections: day.rejections !== '' ? parseInt(day.rejections) : null,
//         }),
//       });

//       if (!res.ok) throw new Error('Save failed');

//       const updatedRecord = await res.json();
//       setOjtRecord(updatedRecord);
//       setDailyScores(updatedRecord.daily_scores || dailyScores);
//       updateTotals(updatedRecord);
//       showToast(`Day ${day.day} saved successfully`, 'success');
//     } catch (err) {
//       showToast('Failed to save day', 'error');
//     } finally {
//       setSavingDay(null);
//     }
//   };

//   const saveAll = async () => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;
//     setSaving(true);

//     try {
//       for (let i = 0; i < dailyScores.length; i++) {
//         const d = dailyScores[i];
//         if (d.date || d.plan || d.actual || d.rejections !== '') {
//           await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               day: d.day,
//               date: d.date || null,
//               plan: d.plan ? parseInt(d.plan) : null,
//               actual: d.actual ? parseInt(d.actual) : null,
//               rejections: d.rejections !== '' ? parseInt(d.rejections) : null,
//             }),
//           });
//         }
//       }

//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/`);
//       const fresh = await res.json();
//       setOjtRecord(fresh);
//       setDailyScores(fresh.daily_scores || dailyScores);
//       updateTotals(fresh);
//       showToast('All changes saved successfully', 'success');
//     } catch (err) {
//       showToast('Failed to save all data', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!ojtRecord) return;
//     if (ojtRecord.status !== 'in_progress') return;

//     const completed = dailyScores.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//     if (completed < 6 && !window.confirm(`Only ${completed}/6 days filled. Submit anyway?`)) {
//       return;
//     }

//     setSaving(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/submit/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       setOjtRecord(data.data);
//       setDailyScores(data.data.daily_scores || dailyScores);
//       updateTotals(data.data);
//       showToast(data.message || 'Submitted successfully!', 'success');
//     } catch (err) {
//       showToast('Failed to submit final record', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const isFinal = ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail';
//   const canEdit = !isFinal;

//   const completedDays = dailyScores.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//   const progressPercentage = (completedDays / 6) * 100;
//   const productionProgress = (totalProductionMarks / 24) * 100;
//   const qualityProgress = (totalQualityMarks / 24) * 100;

//   const getStatusConfig = () => {
//     if (overallResult === 'pass') return {
//       bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
//       text: 'text-white',
//       icon: CheckCircle,
//       label: 'PASSED',
//       color: '#10B981',
//     };
//     if (overallResult === 'fail') return {
//       bg: 'bg-gradient-to-r from-red-500 to-rose-600',
//       text: 'text-white',
//       icon: XCircle,
//       label: 'FAILED',
//       color: '#EF4444',
//     };
//     return {
//       bg: 'bg-gradient-to-r from-amber-400 to-orange-500',
//       text: 'text-white',
//       icon: Clock,
//       label: 'IN PROGRESS',
//       color: '#F59E0B',
//     };
//   };

//   const statusConfig = getStatusConfig();
//   const StatusIcon = statusConfig.icon;

//   const getProductionMarkColor = (marks: number) => {
//     if (marks === 4) return 'text-green-600 bg-green-50';
//     if (marks === 3) return 'text-blue-600 bg-blue-50';
//     if (marks === 2) return 'text-amber-600 bg-amber-50';
//     return 'text-red-600 bg-red-50';
//   };

//   const getQualityMarkColor = (marks: number) => {
//     if (marks === 4) return 'text-green-600 bg-green-50';
//     if (marks === 3) return 'text-blue-600 bg-blue-50';
//     if (marks === 2) return 'text-amber-600 bg-amber-50';
//     return 'text-red-600 bg-red-50';
//   };

//   if (loading && !ojtRecord) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header skeleton */}
//           <div className="flex items-center justify-between mb-8">
//             <Skeleton className="h-10 w-24" />
//             <Skeleton className="h-10 w-64" />
//             <Skeleton className="h-10 w-32" />
//           </div>

//           {/* Stats skeleton */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
//                 <Skeleton className="h-12 w-12 rounded-xl mb-4" />
//                 <Skeleton className="h-4 w-20 mb-2" />
//                 <Skeleton className="h-8 w-16" />
//               </div>
//             ))}
//           </div>

//           {/* Table skeleton */}
//           <div className="bg-white rounded-2xl p-6 shadow-lg">
//             <Skeleton className="h-8 w-48 mb-6" />
//             {[1, 2, 3, 4, 5, 6].map(i => (
//               <Skeleton key={i} className="h-16 w-full mb-4 rounded-xl" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Toast notification */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       {/* Fixed Header */}
//       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors group"
//             >
//               <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
//               <span className="hidden sm:inline">Back</span>
//             </button>

//             <div className="flex items-center gap-3">
//               <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl">
//                 <Award className="w-5 h-5" />
//                 <span className="font-semibold">On Job Training</span>
//               </div>
//               <div className={`${statusConfig.bg} ${statusConfig.text} px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg`}>
//                 <StatusIcon className="w-5 h-5" />
//                 <span className="font-bold text-sm">{statusConfig.label}</span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => window.print()}
//                 className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="Print"
//               >
//                 <Printer className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => {}}
//                 className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="Download"
//               >
//                 <Download className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
//         {/* Hero Section */}
//         <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
//           {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" /> */}
          
//           <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-4">
//                 <Sparkles className="w-6 h-6 text-yellow-300" />
//                 <span className="text-blue-100 font-medium">Daily Performance Tracking</span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                 On Job Training Assessment
//               </h1>
//               <div className="flex flex-wrap items-center gap-4 text-blue-100">
//                 <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
//                   <Settings className="w-4 h-4" />
//                   <span className="text-sm font-medium">{changeRecordId || 'N/A'}</span>
//                 </div>
//                 {ojtRecord?.created_at && (
//                   <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
//                     <Calendar className="w-4 h-4" />
//                     <span className="text-sm">{new Date(ojtRecord.created_at).toLocaleDateString()}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Progress Circle */}
//             <div className="flex items-center gap-6">
//               <div className="relative flex items-center justify-center">
//                 <ProgressRing progress={progressPercentage} size={100} strokeWidth={8} color="#ffffff" />
//                 <div className="absolute inset-0 flex flex-col items-center justify-center">
//                   <span className="text-2xl font-bold text-white">{completedDays}</span>
//                   <span className="text-xs text-blue-100">/6 days</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-blue-100 rounded-xl">
//                 <Factory className="w-5 h-5 text-blue-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Shopfloor</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.shopfloorName || ojtRecord?.shopfloor_name || '—'}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-indigo-100 rounded-xl">
//                 <Layers className="w-5 h-5 text-indigo-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Line</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.lineName || ojtRecord?.line_name || '—'}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-purple-100 rounded-xl">
//                 <Settings className="w-5 h-5 text-purple-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Department</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.departmentName || ojtRecord?.department_name || 'Production'}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-amber-100 rounded-xl">
//                 <Target className="w-5 h-5 text-amber-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Process</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.processName || ojtRecord?.process_name || '—'}</p>
//           </div>
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             title="Production Marks"
//             value={`${totalProductionMarks}/24`}
//             icon={<TrendingUp className="w-6 h-6" />}
//             color="bg-blue-600"
//             subtitle={`${productionProgress.toFixed(0)}% achieved`}
//           />
//           <StatCard
//             title="Quality Marks"
//             value={`${totalQualityMarks}/24`}
//             icon={<Shield className="w-6 h-6" />}
//             color="bg-green-600"
//             subtitle={`${qualityProgress.toFixed(0)}% achieved`}
//           />
//           <StatCard
//             title="Days Completed"
//             value={`${completedDays}/6`}
//             icon={<Calendar className="w-6 h-6" />}
//             color="bg-purple-600"
//             subtitle={`${progressPercentage.toFixed(0)}% progress`}
//           />
//           <StatCard
//             title="Overall Score"
//             value={totalProductionMarks + totalQualityMarks}
//             icon={<BarChart3 className="w-6 h-6" />}
//             color="bg-amber-500"
//             subtitle="out of 48 marks"
//           />
//         </div>

//         {/* Progress Bars */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
//           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <BarChart3 className="w-5 h-5 text-blue-600" />
//             Performance Overview
//           </h3>
//           <div className="space-y-6">
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-sm font-medium text-gray-700">Production Performance</span>
//                 <span className="text-sm font-bold text-blue-600">{totalProductionMarks}/24 marks</span>
//               </div>
//               <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
//                   style={{ width: `${productionProgress}%` }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">Minimum 12 marks required to pass</p>
//             </div>
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-sm font-medium text-gray-700">Quality Performance</span>
//                 <span className="text-sm font-bold text-green-600">{totalQualityMarks}/24 marks</span>
//               </div>
//               <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
//                   style={{ width: `${qualityProgress}%` }}
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-sm font-medium text-gray-700">Days Completion</span>
//                 <span className="text-sm font-bold text-purple-600">{completedDays}/6 days</span>
//               </div>
//               <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
//                   style={{ width: `${progressPercentage}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Daily Scores Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
//           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
//             <h3 className="font-bold text-gray-900 flex items-center gap-2">
//               <Calendar className="w-5 h-5 text-blue-600" />
//               Daily Training Records
//             </h3>
//             <button
//               onClick={() => setShowCriteria(!showCriteria)}
//               className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
//             >
//               <Info className="w-4 h-4" />
//               {showCriteria ? 'Hide' : 'Show'} Criteria
//               {showCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//             </button>
//           </div>

//           {/* Criteria Panel */}
//           {showCriteria && (
//             <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4" />
//                     Production Marks (max 4/day)
//                   </h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
//                       <span className="text-sm text-gray-700">≥ 90% of plan</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
//                       <span className="text-sm text-gray-700">75% – 89% of plan</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
//                       <span className="text-sm text-gray-700">60% – 74% of plan</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
//                       <span className="text-sm text-gray-700">{"< 60% of plan"}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//                     <Shield className="w-4 h-4" />
//                     Quality Marks (max 4/day)
//                   </h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
//                       <span className="text-sm text-gray-700">0 rejections</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
//                       <span className="text-sm text-gray-700">1–2 rejections</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
//                       <span className="text-sm text-gray-700">3–5 rejections</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
//                       <span className="text-sm text-gray-700">{"> 5 rejections"}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4 p-3 bg-blue-600 text-white rounded-xl text-center font-medium">
//                 ✨ Pass Requirement: ≥ 12 production marks after 6 days
//               </div>
//             </div>
//           )}

//           {/* Desktop Table */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
//                   <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Day</th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" colSpan={3}>
//                     <div className="flex items-center justify-center gap-2">
//                       <TrendingUp className="w-4 h-4" />
//                       Production
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" colSpan={2}>
//                     <div className="flex items-center justify-center gap-2">
//                       <Shield className="w-4 h-4" />
//                       Quality
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
//                 </tr>
//                 <tr className="bg-gray-50/50">
//                   <th className="px-4 py-2"></th>
//                   <th className="px-4 py-2"></th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Plan</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Actual</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Marks</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Rejections</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Marks</th>
//                   <th className="px-4 py-2"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {dailyScores.map((row, idx) => {
//                   const isCompleted = row.date && row.plan && row.actual && row.rejections !== '';
//                   return (
//                     <tr
//                       key={row.day}
//                       className={`transition-colors ${isCompleted ? 'bg-green-50/30' : 'hover:bg-gray-50'}`}
//                     >
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
//                             isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
//                           }`}>
//                             {isCompleted ? <Check className="w-5 h-5" /> : row.day}
//                           </div>
//                           <span className="font-semibold text-gray-900">Day {row.day}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="date"
//                           value={row.date}
//                           onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                           disabled={!canEdit}
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                         />
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="number"
//                           value={row.plan}
//                           onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="number"
//                           value={row.actual}
//                           onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getProductionMarkColor(row.production_marks)}`}>
//                           {row.production_marks}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="number"
//                           value={row.rejections}
//                           onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getQualityMarkColor(row.quality_marks)}`}>
//                           {row.quality_marks}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <button
//                           onClick={() => saveDay(idx)}
//                           disabled={savingDay === idx || !canEdit}
//                           className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
//                         >
//                           {savingDay === idx ? (
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                           ) : (
//                             <Save className="w-4 h-4" />
//                           )}
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden p-4 space-y-4">
//             {dailyScores.map((row, idx) => {
//               const isCompleted = row.date && row.plan && row.actual && row.rejections !== '';
//               const isExpanded = expandedRow === idx;
              
//               return (
//                 <div
//                   key={row.day}
//                   className={`rounded-2xl border-2 transition-all ${
//                     isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-white'
//                   }`}
//                 >
//                   <button
//                     onClick={() => setExpandedRow(isExpanded ? null : idx)}
//                     className="w-full px-4 py-4 flex items-center justify-between"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
//                         isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
//                       }`}>
//                         {isCompleted ? <Check className="w-6 h-6" /> : row.day}
//                       </div>
//                       <div className="text-left">
//                         <p className="font-bold text-gray-900">Day {row.day}</p>
//                         <p className="text-sm text-gray-500">{row.date || 'No date set'}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className="text-right">
//                         <p className="text-sm text-gray-500">Marks</p>
//                         <p className="font-bold text-blue-600">{row.production_marks + row.quality_marks}/8</p>
//                       </div>
//                       {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
//                     </div>
//                   </button>

//                   {isExpanded && (
//                     <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                         <input
//                           type="date"
//                           value={row.date}
//                           onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                           disabled={!canEdit}
//                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
//                           <input
//                             type="number"
//                             value={row.plan}
//                             onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                             disabled={!canEdit}
//                             placeholder="0"
//                             className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                             min="0"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Actual</label>
//                           <input
//                             type="number"
//                             value={row.actual}
//                             onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                             disabled={!canEdit}
//                             placeholder="0"
//                             className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                             min="0"
//                           />
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
//                         <span className="text-sm font-medium text-blue-900">Production Marks</span>
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getProductionMarkColor(row.production_marks)}`}>
//                           {row.production_marks}
//                         </span>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Rejections</label>
//                         <input
//                           type="number"
//                           value={row.rejections}
//                           onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                           min="0"
//                         />
//                       </div>

//                       <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
//                         <span className="text-sm font-medium text-green-900">Quality Marks</span>
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getQualityMarkColor(row.quality_marks)}`}>
//                           {row.quality_marks}
//                         </span>
//                       </div>

//                       <button
//                         onClick={() => saveDay(idx)}
//                         disabled={savingDay === idx || !canEdit}
//                         className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       >
//                         {savingDay === idx ? (
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                         ) : (
//                           <Save className="w-5 h-5" />
//                         )}
//                         Save Day {row.day}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Table Footer */}
//           <div className="border-t border-gray-200">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Total Production</p>
//                 <p className="text-3xl font-bold text-blue-600">{totalProductionMarks}</p>
//                 <p className="text-xs text-gray-400">out of 24</p>
//               </div>
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Total Quality</p>
//                 <p className="text-3xl font-bold text-green-600">{totalQualityMarks}</p>
//                 <p className="text-xs text-gray-400">out of 24</p>
//               </div>
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Combined Score</p>
//                 <p className="text-3xl font-bold text-purple-600">{totalProductionMarks + totalQualityMarks}</p>
//                 <p className="text-xs text-gray-400">out of 48</p>
//               </div>
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Pass Threshold</p>
//                 <p className={`text-3xl font-bold ${totalProductionMarks >= 12 ? 'text-green-600' : 'text-red-600'}`}>
//                   {totalProductionMarks >= 12 ? '✓' : '✗'}
//                 </p>
//                 <p className="text-xs text-gray-400">≥ 12 production marks</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Result Banner */}
//         <div className={`${statusConfig.bg} rounded-2xl shadow-2xl p-8 mb-8`}>
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                 <StatusIcon className="w-8 h-8 text-white" />
//               </div>
//               <div className="text-white">
//                 <p className="text-lg font-medium opacity-90">Overall Result</p>
//                 <p className="text-3xl font-bold">{statusConfig.label}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-white">
//               <div className="text-center px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
//                 <p className="text-sm opacity-80">Production</p>
//                 <p className="text-2xl font-bold">{totalProductionMarks}/24</p>
//               </div>
//               <div className="text-center px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
//                 <p className="text-sm opacity-80">Quality</p>
//                 <p className="text-2xl font-bold">{totalQualityMarks}/24</p>
//               </div>
//               <div className="text-center px-6 py-3 bg-white/20 rounded-xl backdrop-blur-sm">
//                 <p className="text-sm opacity-80">Total</p>
//                 <p className="text-2xl font-bold">{totalProductionMarks + totalQualityMarks}/48</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         {ojtRecord && canEdit && (
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//             <button
//               onClick={saveAll}
//               disabled={saving}
//               className="inline-flex items-center justify-center gap-3 bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
//             >
//               {saving ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <Save className="w-5 h-5" />
//               )}
//               Save All Changes
//             </button>

//             <button
//               onClick={handleSubmit}
//               disabled={saving}
//               className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
//             >
//               {saving ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <CheckCircle className="w-5 h-5" />
//               )}
//               Submit Final Assessment
//             </button>
//           </div>
//         )}

//         {/* Completed Message */}
//         {isFinal && (
//           <div className={`text-center p-8 rounded-2xl mb-8 ${
//             overallResult === 'pass' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
//           }`}>
//             <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
//               overallResult === 'pass' ? 'bg-green-100' : 'bg-red-100'
//             }`}>
//               {overallResult === 'pass' ? (
//                 <CheckCircle className="w-10 h-10 text-green-600" />
//               ) : (
//                 <XCircle className="w-10 h-10 text-red-600" />
//               )}
//             </div>
//             <h3 className={`text-2xl font-bold mb-2 ${
//               overallResult === 'pass' ? 'text-green-800' : 'text-red-800'
//             }`}>
//               Assessment {overallResult === 'pass' ? 'Passed!' : 'Failed'}
//             </h3>
//             <p className={`${overallResult === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
//               This OJT assessment has been finalized and cannot be modified.
//             </p>
//             {ojtRecord?.completed_at && (
//               <p className="text-gray-500 text-sm mt-2">
//                 Completed on: {new Date(ojtRecord.completed_at).toLocaleString()}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Custom Styles */}
//       <style>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
        
//         @media print {
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OnJobTraining;












// import React, { useEffect, useState, useCallback } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import {
//   Save,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ArrowLeft,
//   AlertCircle,
//   TrendingUp,
//   Award,
//   Target,
//   Calendar,
//   Factory,
//   Layers,
//   Settings,
//   ChevronDown,
//   ChevronUp,
//   Info,
//   Sparkles,
//   BarChart3,
//   Shield,
//   Loader2,
//   Check,
//   X,
//   Download,
//   Printer,
//   GraduationCap,
// } from 'lucide-react';

// // ============================================
// // Define the OJT Record Data interface (same as in ChangeManagementView)
// // ============================================
// export interface OJTRecordData {
//   changeId: string;
//   fourMChangeId: number;
//   shopfloorName: string;
//   lineName: string;
//   stationName: string;
//   departmentName: string;
//   processName: string;
// }

// // ============================================
// // Props interface for OnJobTraining component
// // ============================================
// interface OnJobTrainingProps {
//   recordData?: OJTRecordData | null;
//   onBack?: () => void;
// }

// interface LocationState {
//   changeId?: string;
//   fourMChangeId?: number;
//   shopfloorName?: string;
//   lineName?: string;
//   stationName?: string;
//   departmentName?: string;
//   processName?: string;
// }

// interface DailyScore {
//   id?: number;
//   day: number;
//   date: string;
//   plan: string;
//   actual: string;
//   production_marks: number;
//   rejections: string;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   change_record_id: string;
//   shopfloor_name: string;
//   line_name: string;
//   station_name: string | null;
//   department_name: string | null;
//   process_name: string | null;
//   status: 'in_progress' | 'pass' | 'fail';
//   total_production_marks: number;
//   total_quality_marks: number;
//   overall_marks: number;
//   daily_scores: DailyScore[];
//   created_at: string;
//   updated_at: string;
//   completed_at: string | null;
// }

// const API_BASE_URL = '/';

// const initialDailyScores: DailyScore[] = Array.from({ length: 6 }, (_, i) => ({
//   day: i + 1,
//   date: '',
//   plan: '',
//   actual: '',
//   production_marks: 0,
//   rejections: '',
//   quality_marks: 0,
// }));

// // Toast notification component
// const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({
//   message,
//   type,
//   onClose,
// }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 4000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const styles = {
//     success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
//     error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
//     info: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
//   };

//   const icons = {
//     success: <CheckCircle className="w-5 h-5" />,
//     error: <XCircle className="w-5 h-5" />,
//     info: <Info className="w-5 h-5" />,
//   };

//   return (
//     <div className={`fixed top-4 right-4 z-50 ${styles[type]} px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in`}>
//       {icons[type]}
//       <span className="font-medium">{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity">
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// // Progress Ring component
// const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string }> = ({
//   progress,
//   size = 120,
//   strokeWidth = 10,
//   color = '#3B82F6',
// }) => {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = radius * 2 * Math.PI;
//   const offset = circumference - (progress / 100) * circumference;

//   return (
//     <svg width={size} height={size} className="transform -rotate-90">
//       <circle
//         className="text-gray-200"
//         strokeWidth={strokeWidth}
//         stroke="currentColor"
//         fill="transparent"
//         r={radius}
//         cx={size / 2}
//         cy={size / 2}
//       />
//       <circle
//         className="transition-all duration-700 ease-out"
//         strokeWidth={strokeWidth}
//         strokeDasharray={circumference}
//         strokeDashoffset={offset}
//         strokeLinecap="round"
//         stroke={color}
//         fill="transparent"
//         r={radius}
//         cx={size / 2}
//         cy={size / 2}
//       />
//     </svg>
//   );
// };

// // Stat Card component
// const StatCard: React.FC<{
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
//   subtitle?: string;
// }> = ({ title, value, icon, color, subtitle }) => (
//   <div className={`relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
//     <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 ${color}`} />
//     <div className="relative">
//       <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} text-white mb-4`}>
//         {icon}
//       </div>
//       <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
//       <div className="flex items-end gap-2 mt-1">
//         <p className="text-3xl font-bold text-gray-900">{value}</p>
//       </div>
//       {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
//     </div>
//   </div>
// );

// // Skeleton loader
// const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
//   <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`} />
// );

// // ============================================
// // Main Component
// // ============================================
// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // Get state from either props or location
//   const locationState = (location.state as LocationState) || {};
//   const state: LocationState = recordData || locationState;

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>(initialDailyScores);
//   const [totalProductionMarks, setTotalProductionMarks] = useState(0);
//   const [totalQualityMarks, setTotalQualityMarks] = useState(0);
//   const [overallResult, setOverallResult] = useState('in_progress');

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [expandedRow, setExpandedRow] = useState<number | null>(null);

//   const changeRecordId = state.changeId || ojtRecord?.change_record_id;

//   const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
//     setToast({ message, type });
//   }, []);

//   // Handle back navigation
//   const handleBack = () => {
//     if (onBack) {
//       onBack();
//     } else {
//       navigate(-1);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchOjtById(id);
//     } else if (changeRecordId) {
//       loadOrCreateOjtForChange(changeRecordId);
//     }
//   }, [id, changeRecordId]);

//   const fetchOjtById = async (recordId: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${recordId}/`);
//       if (!res.ok) throw new Error('Failed to load record');
//       const data = await res.json();
//       setOjtRecord(data);
//       setDailyScores(data.daily_scores || initialDailyScores);
//       updateTotals(data);
//     } catch (err) {
//       showToast('Could not load OJT record', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadOrCreateOjtForChange = async (recId: string) => {
//     setLoading(true);
//     try {
//       const checkRes = await fetch(`${API_BASE_URL}/ojt-records/?change_id=${encodeURIComponent(recId)}`);
//       if (!checkRes.ok) throw new Error();

//       const checkData = await checkRes.json();

//       if (checkData.results?.length > 0) {
//         const record = checkData.results[0];
//         setOjtRecord(record);
//         setDailyScores(record.daily_scores || initialDailyScores);
//         updateTotals(record);
//       } else {
//         await createOjtForChange(recId);
//       }
//     } catch (err) {
//       showToast('Failed to check/load OJT record', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createOjtForChange = async (recId: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/create_from_change/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           four_m_change_record_id: recId,
//           department_name: state.departmentName,
//           process_name: state.processName,
//           shopfloor_name: state.shopfloorName,
//           line_name: state.lineName,
//           station_name: state.stationName,
//         }),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.error || 'Creation failed');
//       }

//       const data = await res.json();
//       setOjtRecord(data);
//       setDailyScores(data.daily_scores || initialDailyScores);
//       updateTotals(data);
//       showToast('OJT record created successfully', 'success');
//     } catch (err: any) {
//       showToast(err.message || 'Could not create OJT record', 'error');
//     }
//   };

//   const updateTotals = (record: OJTRecord) => {
//     setTotalProductionMarks(record.total_production_marks);
//     setTotalQualityMarks(record.total_quality_marks);
//     setOverallResult(record.status);
//   };

//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;

//     const updated = [...dailyScores];
//     updated[index] = { ...updated[index], [field]: value };

//     if (field === 'actual' || field === 'plan') {
//       const plan = parseInt(updated[index].plan) || 0;
//       const actual = parseInt(updated[index].actual) || 0;

//       if (actual === 0) {
//         updated[index].production_marks = 0;
//       } else if (plan === 0) {
//         updated[index].production_marks = actual > 0 ? 4 : 0;
//       } else {
//         const perc = (actual / plan) * 100;
//         if (perc >= 90) updated[index].production_marks = 4;
//         else if (perc >= 75) updated[index].production_marks = 3;
//         else if (perc >= 60) updated[index].production_marks = 2;
//         else updated[index].production_marks = 1;
//       }
//     }

//     if (field === 'rejections') {
//       const rej = parseInt(value) || 0;
//       if (rej === 0) updated[index].quality_marks = 4;
//       else if (rej <= 2) updated[index].quality_marks = 3;
//       else if (rej <= 5) updated[index].quality_marks = 2;
//       else updated[index].quality_marks = 1;
//     }

//     setDailyScores(updated);

//     const prodSum = updated.reduce((sum, d) => sum + d.production_marks, 0);
//     const qualSum = updated.reduce((sum, d) => sum + d.quality_marks, 0);
//     setTotalProductionMarks(prodSum);
//     setTotalQualityMarks(qualSum);

//     const completed = updated.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//     if (completed === 6) {
//       setOverallResult(prodSum >= 12 ? 'pass' : 'fail');
//     } else {
//       setOverallResult('in_progress');
//     }
//   };

//   const saveDay = async (index: number) => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;
//     setSavingDay(index);

//     const day = dailyScores[index];

//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: day.day,
//           date: day.date || null,
//           plan: day.plan ? parseInt(day.plan) : null,
//           actual: day.actual ? parseInt(day.actual) : null,
//           rejections: day.rejections !== '' ? parseInt(day.rejections) : null,
//         }),
//       });

//       if (!res.ok) throw new Error('Save failed');

//       const updatedRecord = await res.json();
//       setOjtRecord(updatedRecord);
//       setDailyScores(updatedRecord.daily_scores || dailyScores);
//       updateTotals(updatedRecord);
//       showToast(`Day ${day.day} saved successfully`, 'success');
//     } catch (err) {
//       showToast('Failed to save day', 'error');
//     } finally {
//       setSavingDay(null);
//     }
//   };

//   const saveAll = async () => {
//     if (!ojtRecord || ojtRecord.status !== 'in_progress') return;
//     setSaving(true);

//     try {
//       for (let i = 0; i < dailyScores.length; i++) {
//         const d = dailyScores[i];
//         if (d.date || d.plan || d.actual || d.rejections !== '') {
//           await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               day: d.day,
//               date: d.date || null,
//               plan: d.plan ? parseInt(d.plan) : null,
//               actual: d.actual ? parseInt(d.actual) : null,
//               rejections: d.rejections !== '' ? parseInt(d.rejections) : null,
//             }),
//           });
//         }
//       }

//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/`);
//       const fresh = await res.json();
//       setOjtRecord(fresh);
//       setDailyScores(fresh.daily_scores || dailyScores);
//       updateTotals(fresh);
//       showToast('All changes saved successfully', 'success');
//     } catch (err) {
//       showToast('Failed to save all data', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!ojtRecord) return;
//     if (ojtRecord.status !== 'in_progress') return;

//     const completed = dailyScores.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//     if (completed < 6 && !window.confirm(`Only ${completed}/6 days filled. Submit anyway?`)) {
//       return;
//     }

//     setSaving(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/submit/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       setOjtRecord(data.data);
//       setDailyScores(data.data.daily_scores || dailyScores);
//       updateTotals(data.data);
//       showToast(data.message || 'Submitted successfully!', 'success');
//     } catch (err) {
//       showToast('Failed to submit final record', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const isFinal = ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail';
//   const canEdit = !isFinal;

//   const completedDays = dailyScores.filter(d => d.date && d.plan && d.actual && d.rejections !== '').length;
//   const progressPercentage = (completedDays / 6) * 100;
//   const productionProgress = (totalProductionMarks / 24) * 100;
//   const qualityProgress = (totalQualityMarks / 24) * 100;

//   const getStatusConfig = () => {
//     if (overallResult === 'pass') return {
//       bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
//       text: 'text-white',
//       icon: CheckCircle,
//       label: 'PASSED',
//       color: '#10B981',
//     };
//     if (overallResult === 'fail') return {
//       bg: 'bg-gradient-to-r from-red-500 to-rose-600',
//       text: 'text-white',
//       icon: XCircle,
//       label: 'FAILED',
//       color: '#EF4444',
//     };
//     return {
//       bg: 'bg-gradient-to-r from-amber-400 to-orange-500',
//       text: 'text-white',
//       icon: Clock,
//       label: 'IN PROGRESS',
//       color: '#F59E0B',
//     };
//   };

//   const statusConfig = getStatusConfig();
//   const StatusIcon = statusConfig.icon;

//   const getProductionMarkColor = (marks: number) => {
//     if (marks === 4) return 'text-green-600 bg-green-50';
//     if (marks === 3) return 'text-blue-600 bg-blue-50';
//     if (marks === 2) return 'text-amber-600 bg-amber-50';
//     return 'text-red-600 bg-red-50';
//   };

//   const getQualityMarkColor = (marks: number) => {
//     if (marks === 4) return 'text-green-600 bg-green-50';
//     if (marks === 3) return 'text-blue-600 bg-blue-50';
//     if (marks === 2) return 'text-amber-600 bg-amber-50';
//     return 'text-red-600 bg-red-50';
//   };

//   if (loading && !ojtRecord) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between mb-8">
//             <Skeleton className="h-10 w-24" />
//             <Skeleton className="h-10 w-64" />
//             <Skeleton className="h-10 w-32" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
//                 <Skeleton className="h-12 w-12 rounded-xl mb-4" />
//                 <Skeleton className="h-4 w-20 mb-2" />
//                 <Skeleton className="h-8 w-16" />
//               </div>
//             ))}
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-lg">
//             <Skeleton className="h-8 w-48 mb-6" />
//             {[1, 2, 3, 4, 5, 6].map(i => (
//               <Skeleton key={i} className="h-16 w-full mb-4 rounded-xl" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Toast notification */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       {/* Fixed Header */}
//       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={handleBack}
//               className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors group"
//             >
//               <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
//               <span className="hidden sm:inline">Back</span>
//             </button>

//             <div className="flex items-center gap-3">
//               <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl">
//                 <GraduationCap className="w-5 h-5" />
//                 <span className="font-semibold">On Job Training</span>
//               </div>
//               <div className={`${statusConfig.bg} ${statusConfig.text} px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg`}>
//                 <StatusIcon className="w-5 h-5" />
//                 <span className="font-bold text-sm">{statusConfig.label}</span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => window.print()}
//                 className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="Print"
//               >
//                 <Printer className="w-5 h-5" />
//               </button>
//               <button
//                 className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="Download"
//               >
//                 <Download className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
//         {/* Hero Section */}
//         <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
//           {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" /> */}
          
//           <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-4">
//                 <Sparkles className="w-6 h-6 text-yellow-300" />
//                 <span className="text-blue-100 font-medium">Daily Performance Tracking</span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                 On Job Training Assessment
//               </h1>
//               <div className="flex flex-wrap items-center gap-4 text-blue-100">
//                 <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
//                   <Settings className="w-4 h-4" />
//                   <span className="text-sm font-medium">{changeRecordId || 'N/A'}</span>
//                 </div>
//                 {ojtRecord?.created_at && (
//                   <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
//                     <Calendar className="w-4 h-4" />
//                     <span className="text-sm">{new Date(ojtRecord.created_at).toLocaleDateString()}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Progress Circle */}
//             <div className="flex items-center gap-6">
//               <div className="relative flex items-center justify-center">
//                 <ProgressRing progress={progressPercentage} size={100} strokeWidth={8} color="#ffffff" />
//                 <div className="absolute inset-0 flex flex-col items-center justify-center">
//                   <span className="text-2xl font-bold text-white">{completedDays}</span>
//                   <span className="text-xs text-blue-100">/6 days</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-blue-100 rounded-xl">
//                 <Factory className="w-5 h-5 text-blue-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Shopfloor</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.shopfloorName || ojtRecord?.shopfloor_name || '—'}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-indigo-100 rounded-xl">
//                 <Layers className="w-5 h-5 text-indigo-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Line</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.lineName || ojtRecord?.line_name || '—'}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-purple-100 rounded-xl">
//                 <Settings className="w-5 h-5 text-purple-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Department</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.departmentName || ojtRecord?.department_name || 'Production'}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-amber-100 rounded-xl">
//                 <Target className="w-5 h-5 text-amber-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Process</span>
//             </div>
//             <p className="font-bold text-gray-900 truncate">{state.processName || ojtRecord?.process_name || '—'}</p>
//           </div>
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             title="Production Marks"
//             value={`${totalProductionMarks}/24`}
//             icon={<TrendingUp className="w-6 h-6" />}
//             color="bg-blue-600"
//             subtitle={`${productionProgress.toFixed(0)}% achieved`}
//           />
//           <StatCard
//             title="Quality Marks"
//             value={`${totalQualityMarks}/24`}
//             icon={<Shield className="w-6 h-6" />}
//             color="bg-green-600"
//             subtitle={`${qualityProgress.toFixed(0)}% achieved`}
//           />
//           <StatCard
//             title="Days Completed"
//             value={`${completedDays}/6`}
//             icon={<Calendar className="w-6 h-6" />}
//             color="bg-purple-600"
//             subtitle={`${progressPercentage.toFixed(0)}% progress`}
//           />
//           <StatCard
//             title="Overall Score"
//             value={totalProductionMarks + totalQualityMarks}
//             icon={<BarChart3 className="w-6 h-6" />}
//             color="bg-amber-500"
//             subtitle="out of 48 marks"
//           />
//         </div>

//         {/* Daily Scores Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
//           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
//             <h3 className="font-bold text-gray-900 flex items-center gap-2">
//               <Calendar className="w-5 h-5 text-blue-600" />
//               Daily Training Records
//             </h3>
//             <button
//               onClick={() => setShowCriteria(!showCriteria)}
//               className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
//             >
//               <Info className="w-4 h-4" />
//               {showCriteria ? 'Hide' : 'Show'} Criteria
//               {showCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//             </button>
//           </div>

//           {/* Criteria Panel */}
//           {showCriteria && (
//             <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4" />
//                     Production Marks (max 4/day)
//                   </h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
//                       <span className="text-sm text-gray-700">≥ 90% of plan</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
//                       <span className="text-sm text-gray-700">75% – 89% of plan</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
//                       <span className="text-sm text-gray-700">60% – 74% of plan</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
//                       <span className="text-sm text-gray-700">{"< 60% of plan"}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//                     <Shield className="w-4 h-4" />
//                     Quality Marks (max 4/day)
//                   </h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
//                       <span className="text-sm text-gray-700">0 rejections</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
//                       <span className="text-sm text-gray-700">1–2 rejections</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
//                       <span className="text-sm text-gray-700">3–5 rejections</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
//                       <span className="text-sm text-gray-700">{"> 5 rejections"}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4 p-3 bg-blue-600 text-white rounded-xl text-center font-medium">
//                 ✨ Pass Requirement: ≥ 12 production marks after 6 days
//               </div>
//             </div>
//           )}

//           {/* Desktop Table */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
//                   <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Day</th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" colSpan={3}>
//                     <div className="flex items-center justify-center gap-2">
//                       <TrendingUp className="w-4 h-4" />
//                       Production
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" colSpan={2}>
//                     <div className="flex items-center justify-center gap-2">
//                       <Shield className="w-4 h-4" />
//                       Quality
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
//                 </tr>
//                 <tr className="bg-gray-50/50">
//                   <th className="px-4 py-2"></th>
//                   <th className="px-4 py-2"></th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Plan</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Actual</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Marks</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Rejections</th>
//                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Marks</th>
//                   <th className="px-4 py-2"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {dailyScores.map((row, idx) => {
//                   const isCompleted = row.date && row.plan && row.actual && row.rejections !== '';
//                   return (
//                     <tr
//                       key={row.day}
//                       className={`transition-colors ${isCompleted ? 'bg-green-50/30' : 'hover:bg-gray-50'}`}
//                     >
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
//                             isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
//                           }`}>
//                             {isCompleted ? <Check className="w-5 h-5" /> : row.day}
//                           </div>
//                           <span className="font-semibold text-gray-900">Day {row.day}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="date"
//                           value={row.date}
//                           onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                           disabled={!canEdit}
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                         />
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="number"
//                           value={row.plan}
//                           onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="number"
//                           value={row.actual}
//                           onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getProductionMarkColor(row.production_marks)}`}>
//                           {row.production_marks}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4">
//                         <input
//                           type="number"
//                           value={row.rejections}
//                           onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getQualityMarkColor(row.quality_marks)}`}>
//                           {row.quality_marks}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <button
//                           onClick={() => saveDay(idx)}
//                           disabled={savingDay === idx || !canEdit}
//                           className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
//                         >
//                           {savingDay === idx ? (
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                           ) : (
//                             <Save className="w-4 h-4" />
//                           )}
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden p-4 space-y-4">
//             {dailyScores.map((row, idx) => {
//               const isCompleted = row.date && row.plan && row.actual && row.rejections !== '';
//               const isExpanded = expandedRow === idx;
              
//               return (
//                 <div
//                   key={row.day}
//                   className={`rounded-2xl border-2 transition-all ${
//                     isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-white'
//                   }`}
//                 >
//                   <button
//                     onClick={() => setExpandedRow(isExpanded ? null : idx)}
//                     className="w-full px-4 py-4 flex items-center justify-between"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
//                         isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
//                       }`}>
//                         {isCompleted ? <Check className="w-6 h-6" /> : row.day}
//                       </div>
//                       <div className="text-left">
//                         <p className="font-bold text-gray-900">Day {row.day}</p>
//                         <p className="text-sm text-gray-500">{row.date || 'No date set'}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className="text-right">
//                         <p className="text-sm text-gray-500">Marks</p>
//                         <p className="font-bold text-blue-600">{row.production_marks + row.quality_marks}/8</p>
//                       </div>
//                       {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
//                     </div>
//                   </button>

//                   {isExpanded && (
//                     <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                         <input
//                           type="date"
//                           value={row.date}
//                           onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                           disabled={!canEdit}
//                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
//                           <input
//                             type="number"
//                             value={row.plan}
//                             onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                             disabled={!canEdit}
//                             placeholder="0"
//                             className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                             min="0"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Actual</label>
//                           <input
//                             type="number"
//                             value={row.actual}
//                             onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                             disabled={!canEdit}
//                             placeholder="0"
//                             className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                             min="0"
//                           />
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
//                         <span className="text-sm font-medium text-blue-900">Production Marks</span>
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getProductionMarkColor(row.production_marks)}`}>
//                           {row.production_marks}
//                         </span>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Rejections</label>
//                         <input
//                           type="number"
//                           value={row.rejections}
//                           onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                           disabled={!canEdit}
//                           placeholder="0"
//                           className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                           min="0"
//                         />
//                       </div>

//                       <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
//                         <span className="text-sm font-medium text-green-900">Quality Marks</span>
//                         <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${getQualityMarkColor(row.quality_marks)}`}>
//                           {row.quality_marks}
//                         </span>
//                       </div>

//                       <button
//                         onClick={() => saveDay(idx)}
//                         disabled={savingDay === idx || !canEdit}
//                         className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       >
//                         {savingDay === idx ? (
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                         ) : (
//                           <Save className="w-5 h-5" />
//                         )}
//                         Save Day {row.day}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Table Footer */}
//           <div className="border-t border-gray-200">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Total Production</p>
//                 <p className="text-3xl font-bold text-blue-600">{totalProductionMarks}</p>
//                 <p className="text-xs text-gray-400">out of 24</p>
//               </div>
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Total Quality</p>
//                 <p className="text-3xl font-bold text-green-600">{totalQualityMarks}</p>
//                 <p className="text-xs text-gray-400">out of 24</p>
//               </div>
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Combined Score</p>
//                 <p className="text-3xl font-bold text-purple-600">{totalProductionMarks + totalQualityMarks}</p>
//                 <p className="text-xs text-gray-400">out of 48</p>
//               </div>
//               <div className="text-center p-4 bg-white rounded-xl shadow-sm">
//                 <p className="text-sm text-gray-500 mb-1">Pass Threshold</p>
//                 <p className={`text-3xl font-bold ${totalProductionMarks >= 12 ? 'text-green-600' : 'text-red-600'}`}>
//                   {totalProductionMarks >= 12 ? '✓' : '✗'}
//                 </p>
//                 <p className="text-xs text-gray-400">≥ 12 production marks</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Result Banner */}
//         <div className={`${statusConfig.bg} rounded-2xl shadow-2xl p-8 mb-8`}>
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                 <StatusIcon className="w-8 h-8 text-white" />
//               </div>
//               <div className="text-white">
//                 <p className="text-lg font-medium opacity-90">Overall Result</p>
//                 <p className="text-3xl font-bold">{statusConfig.label}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6 text-white">
//               <div className="text-center px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
//                 <p className="text-sm opacity-80">Production</p>
//                 <p className="text-2xl font-bold">{totalProductionMarks}/24</p>
//               </div>
//               <div className="text-center px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
//                 <p className="text-sm opacity-80">Quality</p>
//                 <p className="text-2xl font-bold">{totalQualityMarks}/24</p>
//               </div>
//               <div className="text-center px-6 py-3 bg-white/20 rounded-xl backdrop-blur-sm">
//                 <p className="text-sm opacity-80">Total</p>
//                 <p className="text-2xl font-bold">{totalProductionMarks + totalQualityMarks}/48</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         {ojtRecord && canEdit && (
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//             <button
//               onClick={saveAll}
//               disabled={saving}
//               className="inline-flex items-center justify-center gap-3 bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
//             >
//               {saving ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <Save className="w-5 h-5" />
//               )}
//               Save All Changes
//             </button>

//             <button
//               onClick={handleSubmit}
//               disabled={saving}
//               className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
//             >
//               {saving ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <CheckCircle className="w-5 h-5" />
//               )}
//               Submit Final Assessment
//             </button>
//           </div>
//         )}

//         {/* Completed Message */}
//         {isFinal && (
//           <div className={`text-center p-8 rounded-2xl mb-8 ${
//             overallResult === 'pass' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
//           }`}>
//             <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
//               overallResult === 'pass' ? 'bg-green-100' : 'bg-red-100'
//             }`}>
//               {overallResult === 'pass' ? (
//                 <CheckCircle className="w-10 h-10 text-green-600" />
//               ) : (
//                 <XCircle className="w-10 h-10 text-red-600" />
//               )}
//             </div>
//             <h3 className={`text-2xl font-bold mb-2 ${
//               overallResult === 'pass' ? 'text-green-800' : 'text-red-800'
//             }`}>
//               Assessment {overallResult === 'pass' ? 'Passed!' : 'Failed'}
//             </h3>
//             <p className={`${overallResult === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
//               This OJT assessment has been finalized and cannot be modified.
//             </p>
//             {ojtRecord?.completed_at && (
//               <p className="text-gray-500 text-sm mt-2">
//                 Completed on: {new Date(ojtRecord.completed_at).toLocaleString()}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Custom Styles */}
//       <style>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OnJobTraining;



// import React, { useEffect, useState } from 'react';
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
//   date: string;
//   plan: string;
//   actual: string;
//   production_marks: number;
//   rejections: string;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   status: 'in_progress' | 'pass' | 'fail';
//   daily_scores: DailyScore[];
// }

// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// const initialDailyScores: DailyScore[] = Array.from({ length: 6 }, (_, i) => ({
//   day: i + 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0,
// }));

// // --- UI Sub-Components ---

// const StatusBadge = ({ status }: { status: string }) => {
//   const config: Record<string, any> = {
//     pass: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle, label: 'PASSED' },
//     fail: { bg: 'bg-rose-100', text: 'text-rose-700', icon: XCircle, label: 'FAILED' },
//     in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'IN PROGRESS' }
//   };
//   const current = config[status] || config.in_progress;
//   const Icon = current.icon;

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${current.bg} ${current.text}`}>
//       <Icon className="w-3.5 h-3.5" />
//       {current.label}
//     </span>
//   );
// };

// const MarkBadge = ({ marks }: { marks: number }) => {
//   let colorClass = 'bg-gray-100 text-gray-400';
//   if (marks === 4) colorClass = 'bg-emerald-100 text-emerald-700';
//   else if (marks === 3) colorClass = 'bg-blue-100 text-blue-700';
//   else if (marks === 2) colorClass = 'bg-amber-100 text-amber-700';
//   else if (marks === 1) colorClass = 'bg-rose-100 text-rose-700';

//   return (
//     <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${colorClass} transition-colors duration-300`}>
//       {marks || 0}
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
//   <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
//     <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-500 ${colorClass.replace('text-', 'bg-')}`} />
//     <div className="flex justify-between items-start mb-4 relative z-10">
//       <div className={`p-2.5 rounded-lg ${colorClass.replace('text-', 'bg-').replace('700', '50').replace('600', '50')}`}>
//         <Icon className={`w-5 h-5 ${colorClass}`} />
//       </div>
//       {subtext && <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{subtext}</span>}
//     </div>
//     <div className="relative z-10">
//       <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
//       <p className="text-2xl font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// // --- Main Component ---

// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const state = recordData || (location.state as OJTRecordData) || {};
  
//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>(initialDailyScores);
//   const [loading, setLoading] = useState(false);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   const totalProd = dailyScores.reduce((sum, s) => sum + (s.production_marks || 0), 0);
//   const totalQual = dailyScores.reduce((sum, s) => sum + (s.quality_marks || 0), 0);

//   const showToast = (message: string, type: 'success' | 'error') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       try {
//         const url = id ? `${API_BASE_URL}/ojt-records/${id}/` : `${API_BASE_URL}/ojt-records/create_from_change/`;
//         const method = id ? 'GET' : 'POST';
//         const body = id ? null : JSON.stringify({
//           four_m_change_record_id: state.changeId,
//           shopfloor_name: state.shopfloorName,
//           line_name: state.lineName,
//           station_name: state.stationName,
//         });

//         const res = await fetch(url, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body
//         });
//         const data = await res.json();
//         if (data) {
//           setOjtRecord(data);
//           if (data.daily_scores?.length > 0) setDailyScores(data.daily_scores);
//         }
//       } catch (e) { showToast("Connection Error", "error"); }
//       finally { setLoading(false); }
//     };
//     init();
//   }, [id, state.changeId]);

//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     const updated = [...dailyScores];
//     updated[index] = { ...updated[index], [field]: value };

//     // Auto-calculate logic
//     if (field === 'actual' || field === 'plan') {
//       const p = parseInt(updated[index].plan) || 0;
//       const a = parseInt(updated[index].actual) || 0;
//       const pct = p > 0 ? (a / p) * 100 : 0;
//       updated[index].production_marks = pct >= 90 ? 4 : pct >= 75 ? 3 : pct >= 60 ? 2 : a > 0 ? 1 : 0;
//     }
//     if (field === 'rejections') {
//       const r = parseInt(value);
//       if (!isNaN(r)) updated[index].quality_marks = r === 0 ? 4 : r <= 2 ? 3 : r <= 5 ? 2 : 1;
//     }

//     setDailyScores(updated);
//   };

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
//           plan: parseInt(dayData.plan) || null,
//           actual: parseInt(dayData.actual) || null,
//           rejections: dayData.rejections !== '' ? parseInt(dayData.rejections) : null,
//         }),
//       });
//       if (res.ok) showToast(`Day ${dayData.day} Saved`, "success");
//     } catch (e) { showToast("Save Failed", "error"); }
//     finally { setSavingDay(null); }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//       <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
//       {/* Toast Notification */}
//       {toast && (
//         <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4">
//           <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl bg-white border ${toast.type === 'success' ? 'border-emerald-100 text-emerald-800' : 'border-rose-100 text-rose-800'}`}>
//             {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500"/> : <AlertTriangle className="w-5 h-5 text-rose-500"/>}
//             <span className="font-medium text-sm">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Navbar */}
//       <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button onClick={() => onBack ? onBack() : navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5"/></button>
//             <div className="h-6 w-px bg-slate-200" />
//             <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-600" /> OJT Assessment</h1>
//           </div>
//           <div className="flex items-center gap-3">
//             <StatusBadge status={ojtRecord?.status || 'in_progress'} />
//             <div className="hidden md:flex gap-1 border-l pl-3 ml-2">
//               <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Printer className="w-4 h-4"/></button>
//               <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-4 h-4"/></button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//         {/* Header Summary */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-40 pointer-events-none"/>
//             <div className="relative z-10">
//               <h2 className="text-2xl font-bold text-slate-900 mb-1">{state.stationName || 'Target Station'}</h2>
//               <p className="text-slate-400 text-sm flex items-center gap-2 mb-6"><Settings className="w-4 h-4" /> {state.changeId}</p>
//               <div className="grid grid-cols-3 gap-8 pt-4 border-t border-slate-50">
//                 <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shopfloor</p><p className="font-semibold text-slate-700">{state.shopfloorName}</p></div>
//                 <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Line</p><p className="font-semibold text-slate-700">{state.lineName}</p></div>
//                 <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</p><p className="font-semibold text-slate-700">{state.departmentName || 'Production'}</p></div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90 group-hover:scale-105 transition-transform duration-700"/>
//             <div className="relative z-10 text-center">
//               <div className="mb-1 text-blue-200 font-bold text-xs tracking-widest uppercase">Cumulative Score</div>
//               <div className="text-6xl font-black mb-1">{totalProd + totalQual}<span className="text-xl text-blue-300/50 font-medium">/48</span></div>
//               <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter backdrop-blur-sm border border-white/10">
//                 {totalProd >= 12 ? <><CheckCircle className="w-3 h-3 text-emerald-400"/> Qualified</> : <><Clock className="w-3 h-3 text-amber-400"/> Pending</>}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard title="Production" value={`${totalProd}/24`} icon={TrendingUp} colorClass="text-blue-600" />
//           <StatCard title="Quality" value={`${totalQual}/24`} icon={Shield} colorClass="text-emerald-600" />
//           <StatCard title="Completion" value={`${dailyScores.filter(d => d.actual).length}/6 Days`} icon={Calendar} colorClass="text-indigo-600" />
//           <StatCard title="Assessment" value={ojtRecord?.status?.toUpperCase() || 'IN PROGRESS'} icon={Award} colorClass={totalProd >= 12 ? 'text-emerald-600' : 'text-amber-600'} />
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//             <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-slate-400"/><h3 className="font-bold text-slate-800">Daily Performance Records</h3></div>
//             <button onClick={() => setShowCriteria(!showCriteria)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"><Info className="w-4 h-4"/> {showCriteria ? 'HIDE CRITERIA' : 'VIEW CRITERIA'}</button>
//           </div>

//           {showCriteria && (
//             <div className="bg-blue-50/50 border-b border-blue-100 p-6 grid md:grid-cols-2 gap-8 text-xs animate-in slide-in-from-top-2 duration-300">
//               <div className="space-y-2">
//                 <h4 className="font-black text-blue-900 flex items-center gap-2 uppercase tracking-tighter"><TrendingUp className="w-4 h-4"/> Production Scoring</h4>
//                 <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1 font-medium text-slate-600">
//                   <div className="flex justify-between"><span>≥ 90% Plan</span><span className="font-bold text-emerald-600">4 Marks</span></div>
//                   <div className="flex justify-between"><span>75% - 89%</span><span className="font-bold text-blue-600">3 Marks</span></div>
//                   <div className="flex justify-between"><span>60% - 74%</span><span className="font-bold text-amber-600">2 Marks</span></div>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <h4 className="font-black text-blue-900 flex items-center gap-2 uppercase tracking-tighter"><Shield className="w-4 h-4"/> Quality Scoring</h4>
//                 <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1 font-medium text-slate-600">
//                   <div className="flex justify-between"><span>0 Rejections</span><span className="font-bold text-emerald-600">4 Marks</span></div>
//                   <div className="flex justify-between"><span>1-2 Rejections</span><span className="font-bold text-blue-600">3 Marks</span></div>
//                   <div className="flex justify-between"><span>3-5 Rejections</span><span className="font-bold text-amber-600">2 Marks</span></div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Desktop Table */}
//           <div className="hidden lg:block">
//             <table className="w-full text-sm text-left">
//               <thead className="text-[10px] text-slate-500 uppercase font-bold bg-slate-50 border-b">
//                 <tr>
//                   <th className="px-6 py-4 w-20">Day</th>
//                   <th className="px-6 py-4 w-44">Date</th>
//                   <th className="px-6 py-4 text-center">Plan</th>
//                   <th className="px-6 py-4 text-center">Actual</th>
//                   <th className="px-6 py-4 text-center">Rej.</th>
//                   <th className="px-6 py-4 text-center">Prod</th>
//                   <th className="px-6 py-4 text-center">Qual</th>
//                   <th className="px-6 py-4 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {dailyScores.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
//                     <td className="px-6 py-4 font-bold text-slate-400">{row.day}</td>
//                     <td className="px-6 py-4">
//                       <input type="date" value={row.date} onChange={(e) => handleInputChange(idx, 'date', e.target.value)}
//                         className="w-full bg-transparent border-b border-transparent focus:border-blue-500 transition-all p-1 text-xs" />
//                     </td>
//                     <td className="px-6 py-4">
//                       <input type="number" value={row.plan} onChange={(e) => handleInputChange(idx, 'plan', e.target.value)}
//                         className="w-full text-center bg-transparent border-b border-transparent focus:border-blue-500 p-1" placeholder="-"/>
//                     </td>
//                     <td className="px-6 py-4">
//                       <input type="number" value={row.actual} onChange={(e) => handleInputChange(idx, 'actual', e.target.value)}
//                         className="w-full text-center bg-transparent border-b border-transparent focus:border-blue-500 font-bold p-1" placeholder="-"/>
//                     </td>
//                     <td className="px-6 py-4">
//                       <input type="number" value={row.rejections} onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)}
//                         className="w-full text-center bg-transparent border-b border-transparent focus:border-blue-500 p-1" placeholder="-"/>
//                     </td>
//                     <td className="px-6 py-4"><div className="flex justify-center"><MarkBadge marks={row.production_marks}/></div></td>
//                     <td className="px-6 py-4"><div className="flex justify-center"><MarkBadge marks={row.quality_marks}/></div></td>
//                     <td className="px-6 py-4 text-right">
//                       <button onClick={() => saveDay(idx)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
//                         {savingDay === idx ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden p-4 space-y-4 bg-slate-50/30">
//             {dailyScores.map((row, idx) => (
//               <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
//                 <div className="flex justify-between items-center border-b pb-2">
//                   <span className="font-bold text-slate-800">Day {row.day}</span>
//                   <div className="flex gap-2"><MarkBadge marks={row.production_marks}/><MarkBadge marks={row.quality_marks}/></div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase">Date</label><input type="date" value={row.date} onChange={(e) => handleInputChange(idx, 'date', e.target.value)} className="w-full border-slate-200 rounded-lg text-xs mt-1"/></div>
//                   <div><label className="text-[10px] font-bold text-slate-400 uppercase">Plan</label><input type="number" value={row.plan} onChange={(e) => handleInputChange(idx, 'plan', e.target.value)} className="w-full border-slate-200 rounded-lg text-xs mt-1"/></div>
//                   <div><label className="text-[10px] font-bold text-slate-400 uppercase">Actual</label><input type="number" value={row.actual} onChange={(e) => handleInputChange(idx, 'actual', e.target.value)} className="w-full border-slate-200 rounded-lg text-xs mt-1 font-bold"/></div>
//                 </div>
//                 <button onClick={() => saveDay(idx)} className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
//                   {savingDay === idx ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} SAVE DAY {row.day}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
//           <button onClick={() => onBack ? onBack() : navigate(-1)} className="px-6 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-tight text-xs">Exit Without Saving</button>
//           <button onClick={() => showToast("Draft saved locally", "success")} className="px-6 py-3 rounded-xl bg-white border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-all uppercase tracking-tight text-xs">Save as Draft</button>
//           <button onClick={async () => {
//             setLoading(true);
//             await new Promise(r => setTimeout(r, 1000));
//             showToast("Final Assessment Submitted", "success");
//             setLoading(false);
//           }} className="px-10 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all uppercase tracking-tight text-xs flex items-center justify-center gap-2">
//             <CheckCircle className="w-4 h-4"/> Finalize & Submit
//           </button>
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
//   TrendingUp, AlertTriangle, Award, ChevronDown, ChevronUp
// } from 'lucide-react';

// // ────────────────────────────────────────────────
// // Types
// // ────────────────────────────────────────────────
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
//   date: string;
//   plan: string;
//   actual: string;
//   production_marks: number;
//   rejections: string;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   status: 'in_progress' | 'pass' | 'fail';
//   daily_scores: DailyScore[];
// }

// // ────────────────────────────────────────────────
// // Constants & Config
// // ────────────────────────────────────────────────
// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// const initialDailyScores: DailyScore[] = Array.from({ length: 6 }, (_, i) => ({
//   day: i + 1,
//   date: '',
//   plan: '',
//   actual: '',
//   production_marks: 0,
//   rejections: '',
//   quality_marks: 0,
// }));

// const SCORE_COLORS = {
//   4: 'bg-emerald-100 text-emerald-800 border-emerald-200',
//   3: 'bg-blue-100    text-blue-800    border-blue-200',
//   2: 'bg-amber-100  text-amber-800   border-amber-200',
//   1: 'bg-rose-100   text-rose-800    border-rose-200',
//   0: 'bg-gray-100   text-gray-500    border-gray-200',
// } as const;

// // ────────────────────────────────────────────────
// // Sub-components
// // ────────────────────────────────────────────────
// const StatusBadge = ({ status }: { status: string }) => {
//   const config: Record<string, { bg: string; text: string; icon: any; label: string }> = {
//     pass:       { bg: 'bg-emerald-100/80', text: 'text-emerald-700', icon: CheckCircle, label: 'PASSED' },
//     fail:       { bg: 'bg-rose-100/80',    text: 'text-rose-700',   icon: XCircle,    label: 'FAILED' },
//     in_progress:{ bg: 'bg-sky-100/80',     text: 'text-sky-700',    icon: Clock,      label: 'IN PROGRESS' },
//   };
//   const current = config[status] || config.in_progress;
//   const Icon = current.icon;

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide backdrop-blur-sm border ${current.bg} ${current.text} border-white/40 shadow-sm`}>
//       <Icon className="w-4 h-4" />
//       {current.label}
//     </span>
//   );
// };

// const MarkBadge = ({ marks }: { marks: number }) => (
//   <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border ${SCORE_COLORS[marks as keyof typeof SCORE_COLORS] ?? SCORE_COLORS[0]} transition-all duration-200 hover:scale-105 active:scale-95`}>
//     {marks || '—'}
//   </div>
// );

// const StatCard = ({ title, value, icon: Icon, color, subtext }: {
//   title: string;
//   value: string | number;
//   icon: any;
//   color: string;
//   subtext?: string;
// }) => (
//   <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group relative overflow-hidden">
//     <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${color.replace('text-', 'bg-').replace(/-\d+/, '-50')} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
//     <div className="relative z-10 flex flex-col">
//       <div className="flex items-center justify-between mb-3">
//         <div className={`p-2.5 rounded-lg ${color.replace('text-', 'bg-').replace(/-\d+/, '-50')}`}>
//           <Icon className={`w-5 h-5 ${color}`} />
//         </div>
//         {subtext && <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded">{subtext}</span>}
//       </div>
//       <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</h3>
//       <p className="text-2xl font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// // ────────────────────────────────────────────────
// // Main Component
// // ────────────────────────────────────────────────
// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location  = useLocation();
//   const navigate  = useNavigate();
//   const { id }    = useParams<{ id: string }>();

//   const state = recordData || (location.state as OJTRecordData) || {};

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>(initialDailyScores);
//   const [loading, setLoading] = useState(true);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   const totalProd = useMemo(() => dailyScores.reduce((sum, s) => sum + (s.production_marks || 0), 0), [dailyScores]);
//   const totalQual = useMemo(() => dailyScores.reduce((sum, s) => sum + (s.quality_marks || 0), 0), [dailyScores]);
//   const totalScore = totalProd + totalQual;
//   const completionDays = dailyScores.filter(d => d.actual !== '' && d.actual !== '0').length;

//   const showToast = (message: string, type: 'success' | 'error') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3200);
//   };

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       try {
//         const url = id
//           ? `${API_BASE_URL}/ojt-records/${id}/`
//           : `${API_BASE_URL}/ojt-records/create_from_change/`;

//         const method = id ? 'GET' : 'POST';
//         const body = id ? null : JSON.stringify({
//           four_m_change_record_id: state.changeId,
//           shopfloor_name: state.shopfloorName,
//           line_name: state.lineName,
//           station_name: state.stationName,
//         });

//         const res = await fetch(url, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body,
//         });

//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const data = await res.json();
//         setOjtRecord(data);
//         if (data?.daily_scores?.length) {
//           setDailyScores(data.daily_scores);
//         }
//       } catch (err) {
//         console.error(err);
//         showToast("Failed to load assessment data", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, [id, state.changeId]);

//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     setDailyScores(prev => {
//       const next = [...prev];
//       next[index] = { ...next[index], [field]: value };

//       if (field === 'plan' || field === 'actual') {
//         const p = Number(next[index].plan) || 0;
//         const a = Number(next[index].actual) || 0;
//         const pct = p > 0 ? (a / p) * 100 : 0;
//         next[index].production_marks = pct >= 90 ? 4 : pct >= 75 ? 3 : pct >= 60 ? 2 : a > 0 ? 1 : 0;
//       }

//       if (field === 'rejections') {
//         const r = Number(value);
//         next[index].quality_marks = isNaN(r) ? 0 : r === 0 ? 4 : r <= 2 ? 3 : r <= 5 ? 2 : 1;
//       }

//       return next;
//     });
//   };

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
//           plan: dayData.plan ? Number(dayData.plan) : null,
//           actual: dayData.actual ? Number(dayData.actual) : null,
//           rejections: dayData.rejections !== '' ? Number(dayData.rejections) : null,
//         }),
//       });

//       if (!res.ok) throw new Error();
//       showToast(`Day ${dayData.day} saved`, "success");
//     } catch {
//       showToast("Could not save day", "error");
//     } finally {
//       setSavingDay(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50/70 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
//           <p className="text-slate-600 font-medium">Loading assessment...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-5 right-5 z-50 animate-in fade-in zoom-in-95 duration-200">
//           <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md ${toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' : 'bg-rose-50/90 border-rose-200 text-rose-800'}`}>
//             {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
//             <span className="font-medium text-sm">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Top Navigation */}
//       <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => onBack?.() ?? navigate(-1)}
//               className="p-2.5 hover:bg-slate-100 rounded-full transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 text-slate-700" />
//             </button>
//             <div className="h-6 w-px bg-slate-200 hidden sm:block" />
//             <div className="flex items-center gap-2.5">
//               <GraduationCap className="w-6 h-6 text-blue-600" />
//               <h1 className="font-bold text-lg text-slate-800">OJT Assessment</h1>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <StatusBadge status={ojtRecord?.status || 'in_progress'} />
//             <div className="hidden sm:flex gap-1.5">
//               <button className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"><Printer className="w-4.5 h-4.5" /></button>
//               <button className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"><Download className="w-4.5 h-4.5" /></button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-8">

//         {/* Header + Score Card */}
//         <div className="grid lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
//             <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-blue-50 via-indigo-50 to-transparent rounded-full opacity-60 pointer-events-none" />
//             <div className="relative">
//               <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{state.stationName || 'Target Station'}</h2>
//               <p className="text-slate-500 text-sm flex items-center gap-2 mb-6">
//                 <Settings className="w-4 h-4" /> Change #{state.changeId}
//               </p>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shopfloor</p>
//                   <p className="font-semibold text-slate-800 mt-0.5">{state.shopfloorName || '—'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Line</p>
//                   <p className="font-semibold text-slate-800 mt-0.5">{state.lineName || '—'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Department</p>
//                   <p className="font-semibold text-slate-800 mt-0.5">{state.departmentName || 'Production'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Big Score Card */}
//           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden group">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.12),transparent_50%)] group-hover:scale-110 transition-transform duration-700" />
//             <div className="relative z-10 text-center">
//               <div className="text-blue-100/90 text-xs font-semibold uppercase tracking-widest mb-2">TOTAL SCORE</div>
//               <div className="text-6xl lg:text-7xl font-black mb-1 tracking-tight">
//                 {totalScore}
//                 <span className="text-2xl lg:text-3xl font-bold text-blue-200/60"> / 48</span>
//               </div>
//               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium">
//                 {totalProd >= 12 && totalQual >= 10 ? (
//                   <> <CheckCircle className="w-4 h-4 text-emerald-300" /> Qualified </>
//                 ) : (
//                   <> <Clock className="w-4 h-4 text-amber-300" /> In Progress </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           <StatCard title="Production" value={`${totalProd}/24`} icon={TrendingUp}   color="text-blue-600"    subtext="6 days" />
//           <StatCard title="Quality"    value={`${totalQual}/24`}  icon={Shield}       color="text-emerald-600" subtext="Rejections" />
//           <StatCard title="Completion" value={`${completionDays}/6`} icon={Calendar}   color="text-indigo-600"  subtext="Days" />
//           <StatCard title="Status"     value={ojtRecord?.status?.replace('_', ' ').toUpperCase() || 'IN PROGRESS'} icon={Award} color={totalScore >= 30 ? 'text-emerald-600' : 'text-amber-600'} />
//         </div>

//         {/* Daily Table Section */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <BarChart3 className="w-5 h-5 text-slate-500" />
//               <h3 className="font-bold text-slate-800 text-lg">Daily Performance</h3>
//             </div>
//             <button
//               onClick={() => setShowCriteria(!showCriteria)}
//               className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
//             >
//               <Info className="w-4 h-4" />
//               {showCriteria ? 'Hide' : 'Show'} Scoring Criteria
//               {showCriteria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//             </button>
//           </div>

//           {showCriteria && (
//             <div className="bg-gradient-to-b from-blue-50/70 to-transparent border-b border-blue-100 p-6 lg:p-8 animate-in slide-in-from-top-3 duration-300">
//               <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//                 <div className="space-y-3">
//                   <h4 className="font-bold text-blue-900 uppercase tracking-wide text-sm flex items-center gap-2">
//                     <TrendingUp className="w-4.5 h-4.5" /> Production Scoring
//                   </h4>
//                   <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100/60 p-4 space-y-2 text-sm">
//                     <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
//                       <span>≥ 90%</span><span className="font-bold text-emerald-700">4 pts</span>
//                     </div>
//                     <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
//                       <span>75–89%</span><span className="font-bold text-blue-700">3 pts</span>
//                     </div>
//                     <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
//                       <span>60–74%</span><span className="font-bold text-amber-700">2 pts</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <h4 className="font-bold text-blue-900 uppercase tracking-wide text-sm flex items-center gap-2">
//                     <Shield className="w-4.5 h-4.5" /> Quality (Rejections)
//                   </h4>
//                   <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100/60 p-4 space-y-2 text-sm">
//                     <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
//                       <span>0</span><span className="font-bold text-emerald-700">4 pts</span>
//                     </div>
//                     <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
//                       <span>1–2</span><span className="font-bold text-blue-700">3 pts</span>
//                     </div>
//                     <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
//                       <span>3–5</span><span className="font-bold text-amber-700">2 pts</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Desktop Table */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold tracking-wider">
//                 <tr>
//                   <th className="px-6 py-4 text-left w-16">Day</th>
//                   <th className="px-6 py-4 text-left w-36">Date</th>
//                   <th className="px-4 py-4 text-center">Plan</th>
//                   <th className="px-4 py-4 text-center">Actual</th>
//                   <th className="px-4 py-4 text-center">Rej.</th>
//                   <th className="px-4 py-4 text-center">Prod</th>
//                   <th className="px-4 py-4 text-center">Qual</th>
//                   <th className="px-6 py-4 text-right">Save</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {dailyScores.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
//                     <td className="px-6 py-4 font-medium text-slate-700">Day {row.day}</td>
//                     <td className="px-6 py-4">
//                       <input
//                         type="date"
//                         value={row.date}
//                         onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                         className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 focus:bg-white/50 rounded px-1 py-1 text-sm transition-all"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <input
//                         type="number"
//                         value={row.plan}
//                         onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                         placeholder="—"
//                         className="w-full text-center bg-transparent border-b border-slate-200 focus:border-blue-500 focus:bg-white/50 rounded py-1 text-sm transition-all"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <input
//                         type="number"
//                         value={row.actual}
//                         onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                         placeholder="—"
//                         className="w-full text-center font-semibold bg-transparent border-b border-slate-200 focus:border-blue-500 focus:bg-white/50 rounded py-1 text-sm transition-all"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <input
//                         type="number"
//                         value={row.rejections}
//                         onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                         placeholder="—"
//                         className="w-full text-center bg-transparent border-b border-slate-200 focus:border-blue-500 focus:bg-white/50 rounded py-1 text-sm transition-all"
//                       />
//                     </td>
//                     <td className="px-4 py-4"><div className="flex justify-center"><MarkBadge marks={row.production_marks} /></div></td>
//                     <td className="px-4 py-4"><div className="flex justify-center"><MarkBadge marks={row.quality_marks} /></div></td>
//                     <td className="px-6 py-4 text-right">
//                       <button
//                         onClick={() => saveDay(idx)}
//                         disabled={savingDay === idx}
//                         className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-40"
//                       >
//                         {savingDay === idx ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden divide-y divide-slate-100 px-4 py-6 space-y-6 bg-slate-50/40">
//             {dailyScores.map((row, idx) => (
//               <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
//                 <div className="flex justify-between items-center pb-3 border-b border-slate-100">
//                   <span className="font-bold text-lg text-slate-800">Day {row.day}</span>
//                   <div className="flex gap-2.5">
//                     <MarkBadge marks={row.production_marks} />
//                     <MarkBadge marks={row.quality_marks} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="col-span-2">
//                     <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Date</label>
//                     <input
//                       type="date"
//                       value={row.date}
//                       onChange={e => handleInputChange(idx, 'date', e.target.value)}
//                       className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Plan</label>
//                     <input
//                       type="number"
//                       value={row.plan}
//                       onChange={e => handleInputChange(idx, 'plan', e.target.value)}
//                       className="w-full border border-slate-200 rounded-lg px-3 py-2 text-center text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Actual</label>
//                     <input
//                       type="number"
//                       value={row.actual}
//                       onChange={e => handleInputChange(idx, 'actual', e.target.value)}
//                       className="w-full border border-slate-200 rounded-lg px-3 py-2 text-center font-semibold text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Rejections</label>
//                     <input
//                       type="number"
//                       value={row.rejections}
//                       onChange={e => handleInputChange(idx, 'rejections', e.target.value)}
//                       className="w-full border border-slate-200 rounded-lg px-3 py-2 text-center text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
//                     />
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => saveDay(idx)}
//                   disabled={savingDay === idx}
//                   className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//                 >
//                   {savingDay === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                   SAVE DAY {row.day}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-200">
//           <button
//             onClick={() => onBack?.() ?? navigate(-1)}
//             className="order-2 sm:order-1 px-7 py-3 rounded-xl border-2 border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all text-sm uppercase tracking-wide"
//           >
//             Exit
//           </button>

//           <button
//             onClick={() => showToast("Draft saved (local)", "success")}
//             className="order-3 sm:order-2 px-7 py-3 rounded-xl border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition-all text-sm uppercase tracking-wide"
//           >
//             Save Draft
//           </button>

//           <button
//             onClick={async () => {
//               setLoading(true);
//               await new Promise(r => setTimeout(r, 1400)); // simulate
//               showToast("Assessment finalized and submitted", "success");
//               setLoading(false);
//               // navigate or reset logic here
//             }}
//             disabled={loading}
//             className="order-1 sm:order-3 px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200/40 hover:shadow-xl hover:shadow-blue-300/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wide disabled:opacity-60"
//           >
//             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
//             Finalize & Submit
//           </button>
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
//   TrendingUp, AlertTriangle, Award, ChevronDown, ChevronUp,
//   Target, Factory
// } from 'lucide-react';

// // ────────────────────────────────────────────────
// // Types
// // ────────────────────────────────────────────────
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
//   date: string;
//   plan: string;
//   actual: string;
//   production_marks: number;
//   rejections: string;
//   quality_marks: number;
// }

// interface OJTRecord {
//   id: number;
//   status: 'in_progress' | 'pass' | 'fail';
//   daily_scores: DailyScore[];
// }

// // ────────────────────────────────────────────────
// // Constants & Config
// // ────────────────────────────────────────────────
// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// const initialDailyScores: DailyScore[] = Array.from({ length: 6 }, (_, i) => ({
//   day: i + 1, date: '', plan: '', actual: '', production_marks: 0, rejections: '', quality_marks: 0,
// }));

// const SCORE_COLORS = {
//   4: 'bg-emerald-100 text-emerald-800 border-emerald-200',
//   3: 'bg-blue-100    text-blue-800    border-blue-200',
//   2: 'bg-amber-100  text-amber-800   border-amber-200',
//   1: 'bg-rose-100   text-rose-800    border-rose-200',
//   0: 'bg-gray-100   text-gray-500    border-gray-200',
// } as const;

// // ────────────────────────────────────────────────
// // Sub-components
// // ────────────────────────────────────────────────
// const StatusBadge = ({ status }: { status: string }) => {
//   const config: Record<string, { bg: string; text: string; icon: any; label: string }> = {
//     pass:        { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle, label: 'PASSED' },
//     fail:        { bg: 'bg-rose-500',    text: 'text-white', icon: XCircle,    label: 'FAILED' },
//     in_progress: { bg: 'bg-indigo-600',  text: 'text-white', icon: Clock,      label: 'IN PROGRESS' },
//   };
//   const current = config[status] || config.in_progress;
//   const Icon = current.icon;

//   return (
//     <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg ${current.bg} ${current.text} border border-white/20`}>
//       <Icon className="w-3.5 h-3.5" />
//       {current.label}
//     </span>
//   );
// };

// const MarkBadge = ({ marks }: { marks: number }) => (
//   <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border ${SCORE_COLORS[marks as keyof typeof SCORE_COLORS] ?? SCORE_COLORS[0]}`}>
//     {marks || 0}
//   </div>
// );

// const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
//   <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
//     <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${color.replace('text-', 'bg-').split(' ')[0]} opacity-5 group-hover:opacity-20 transition-opacity`} />
//     <div className="relative z-10 flex flex-col">
//       <div className="flex items-center justify-between mb-3">
//         <div className={`p-2.5 rounded-lg ${color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10`}>
//           <Icon className={`w-5 h-5 ${color}`} />
//         </div>
//         {subtext && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-tighter">{subtext}</span>}
//       </div>
//       <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{title}</h3>
//       <p className="text-2xl font-black text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// // ────────────────────────────────────────────────
// // Main Component
// // ────────────────────────────────────────────────
// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const state = (recordData || location.state || {}) as OJTRecordData;

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>(initialDailyScores);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [showCriteria, setShowCriteria] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   const totalProd = useMemo(() => dailyScores.reduce((sum, s) => sum + (s.production_marks || 0), 0), [dailyScores]);
//   const totalQual = useMemo(() => dailyScores.reduce((sum, s) => sum + (s.quality_marks || 0), 0), [dailyScores]);
//   const totalScore = totalProd + totalQual;
//   const completionCount = dailyScores.filter(d => d.date && d.actual && d.actual !== '0').length;
//   const isLocked = ojtRecord?.status === 'pass' || ojtRecord?.status === 'fail';

//   const showToast = (message: string, type: 'success' | 'error') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

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
//           body,
//         });

//         if (!res.ok) throw new Error();
//         const data = await res.json();
//         setOjtRecord(data);
//         if (data.daily_scores?.length) setDailyScores(data.daily_scores);
//         if (!id && data.id) navigate(`/ojt-detail/${data.id}`, { replace: true });
//       } catch (err) {
//         showToast("Error synchronizing data", "error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, [id, state.changeId, navigate]);

//   const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
//     if (isLocked) return;
//     const next = [...dailyScores];
//     next[index] = { ...next[index], [field]: value };

//     if (field === 'plan' || field === 'actual') {
//       const p = parseFloat(next[index].plan) || 0;
//       const a = parseFloat(next[index].actual) || 0;
//       const pct = p > 0 ? (a / p) * 100 : 0;
//       next[index].production_marks = pct >= 90 ? 4 : pct >= 75 ? 3 : pct >= 60 ? 2 : a > 0 ? 1 : 0;
//     }
//     if (field === 'rejections') {
//       const r = parseInt(value);
//       if (!isNaN(r)) next[index].quality_marks = r === 0 ? 4 : r <= 2 ? 3 : r <= 5 ? 2 : 1;
//     }
//     setDailyScores(next);
//   };

//   const saveDay = async (idx: number) => {
//     if (!ojtRecord?.id || isLocked) return;
//     setSavingDay(idx);
//     const d = dailyScores[idx];
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ day: d.day, date: d.date, plan: d.plan, actual: d.actual, rejections: d.rejections }),
//       });
//       const updated = await res.json();
//       setOjtRecord(updated); // Sync status from server
//       setToast({ message: `Day ${d.day} saved successfully`, type: "success" });
//     } catch {
//       showToast("Could not save row", "error");
//     } finally {
//       setSavingDay(null);
//     }
//   };

//   const handleFinalSubmit = async () => {
//     if (completionCount < 6 && !window.confirm(`Incomplete: Only ${completionCount}/6 days filled. Submit?`)) return;
//     setSaving(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord?.id}/submit/`, { 
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       });
//       const result = await res.json();
//       setOjtRecord(result.data);
//       setDailyScores(result.data.daily_scores);
//       showToast(`Assessment finalized: ${result.status.toUpperCase()}`, "success");
//     } catch {
//       showToast("Final submission failed", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">
//       {toast && (
//         <div className="fixed top-6 right-6 z-[60] animate-in fade-in slide-in-from-top-4">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl bg-white border-l-4 ${toast.type === 'success' ? 'border-emerald-500' : 'border-rose-500'}`}>
//             {toast.type === 'success' ? <CheckCircle className="text-emerald-500" /> : <AlertTriangle className="text-rose-500" />}
//             <span className="font-bold text-slate-700">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center px-8 justify-between">
//         <div className="flex items-center gap-6">
//           <button onClick={() => navigate(-1)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><ArrowLeft /></button>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2"><GraduationCap className="text-blue-600"/> OJT Certification</h1>
//         </div>
//         <StatusBadge status={ojtRecord?.status || 'in_progress'} />
//       </nav>

//       <main className="max-w-7xl mx-auto p-8 space-y-8">
//         {/* HERO SECTION */}
//         <div className="bg-[#0F172A] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-20 -mt-20" />
//           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
//             <div>
//               <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Live Assessment</p>
//               <h2 className="text-5xl font-black tracking-tighter mb-6">{state.stationName || 'Precision Unit'}</h2>
//               <div className="flex gap-6 opacity-60 font-bold text-xs uppercase tracking-widest">
//                 <div className="flex items-center gap-2"><Settings className="w-4 h-4"/> {state.changeId}</div>
//                 <div className="flex items-center gap-2"><Factory className="w-4 h-4"/> {state.lineName}</div>
//               </div>
//             </div>
//             <div className="text-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md min-w-[280px]">
//               <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-2">Cumulative Score</p>
//               <div className="text-7xl font-black italic tracking-tighter">{totalScore}<span className="text-2xl opacity-20 not-italic ml-2">/48</span></div>
//               <div className={`mt-6 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.1em] ${totalProd >= 12 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
//                 {totalProd >= 12 ? 'Passing Threshold Met' : 'In Progress'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ANALYTICS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard title="Production" value={`${totalProd}/24`} icon={TrendingUp} color="text-blue-600" subtext="Efficiency" />
//           <StatCard title="Quality" value={`${totalQual}/24`} icon={Shield} color="text-emerald-600" subtext="Rejections" />
//           <StatCard title="Logs" value={`${completionCount}/6`} icon={Calendar} color="text-indigo-600" subtext="Attendance" />
//           <StatCard title="Conclusion" value={ojtRecord?.status?.toUpperCase() || 'PENDING'} icon={Award} color={totalProd >= 12 ? 'text-emerald-600' : 'text-amber-600'} />
//         </div>

//         {/* TABLE SECTION */}
//         <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden">
//           <div className="px-10 py-8 border-b bg-slate-50/50 flex justify-between items-center">
//             <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-3"><BarChart3 className="text-blue-600"/> Training Ledger</h3>
//             <button onClick={() => setShowCriteria(!showCriteria)} className="text-[10px] font-black text-blue-600 bg-blue-50 px-5 py-2.5 rounded-2xl hover:bg-blue-100 transition-all flex items-center gap-2 border border-blue-100">
//               <Info className="w-4 h-4"/> {showCriteria ? 'HIDE RULES' : 'SCORING RULES'}
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100 bg-slate-50/30">
//                   <th className="px-10 py-6 text-left">Day</th>
//                   <th className="px-6 py-6 text-left">Audit Date</th>
//                   <th className="px-6 py-6 text-center">Plan</th>
//                   <th className="px-6 py-6 text-center">Actual</th>
//                   <th className="px-6 py-6 text-center">Rej.</th>
//                   <th className="px-6 py-6 text-center">Scores</th>
//                   <th className="px-10 py-6 text-right">Commit</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {dailyScores.map((row, idx) => (
//                   <tr key={idx} className="group hover:bg-slate-50/80 transition-all">
//                     <td className="px-10 py-6 font-black text-slate-300 text-xl group-hover:text-blue-600 transition-colors">{row.day.toString().padStart(2, '0')}</td>
//                     <td className="px-6 py-6">
//                       <input type="date" value={row.date || ''} disabled={isLocked} onChange={(e) => handleInputChange(idx, 'date', e.target.value)} 
//                         className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-sm" />
//                     </td>
//                     <td className="px-6 py-6 text-center">
//                       <input type="number" value={row.plan || ''} disabled={isLocked} onChange={(e) => handleInputChange(idx, 'plan', e.target.value)} 
//                         className="w-24 text-center bg-transparent border-b-2 border-slate-100 focus:border-blue-600 font-bold p-1 text-sm" placeholder="0"/>
//                     </td>
//                     <td className="px-6 py-6 text-center">
//                       <input type="number" value={row.actual || ''} disabled={isLocked} onChange={(e) => handleInputChange(idx, 'actual', e.target.value)} 
//                         className="w-24 text-center bg-transparent border-b-2 border-slate-100 focus:border-blue-600 font-black text-blue-600 p-1 text-sm" placeholder="0"/>
//                     </td>
//                     <td className="px-6 py-6 text-center">
//                       <input type="number" value={row.rejections || ''} disabled={isLocked} onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)} 
//                         className="w-24 text-center bg-transparent border-b-2 border-slate-100 focus:border-rose-500 font-bold text-rose-600 p-1 text-sm" placeholder="0"/>
//                     </td>
//                     <td className="px-6 py-6">
//                       <div className="flex justify-center gap-1.5">
//                         <MarkBadge marks={row.production_marks} />
//                         <MarkBadge marks={row.quality_marks} />
//                       </div>
//                     </td>
//                     <td className="px-10 py-6 text-right">
//                       {!isLocked && (
//                         <button onClick={() => saveDay(idx)} className="p-3.5 bg-white border border-slate-200 rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 active:scale-90">
//                           {savingDay === idx ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* BOTTOM ACTION */}
//         <div className={`p-1.5 rounded-[3rem] bg-gradient-to-r ${totalProd >= 12 ? 'from-emerald-400 to-teal-500' : 'from-amber-400 to-orange-500'} shadow-2xl`}>
//           <div className="bg-white rounded-[2.8rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
//              <div className="flex items-center gap-8 text-center md:text-left">
//                 <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${totalProd >= 12 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
//                   {totalProd >= 12 ? <CheckCircle className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
//                 </div>
//                 <div>
//                    <h4 className="text-3xl font-black tracking-tight text-slate-800">{totalProd >= 12 ? 'QUALIFICATION READY' : 'TRAINING INCOMPLETE'}</h4>
//                    <p className="text-sm text-slate-400 font-medium">Certification requires all 6 days to be logged and score ≥ 12 marks.</p>
//                 </div>
//              </div>
//              <div className="flex gap-4">
//                 {!isLocked ? (
//                   <button onClick={handleFinalSubmit} disabled={saving || completionCount < 1} className="px-12 py-5 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 transition-all shadow-xl disabled:opacity-30">
//                     {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : null} Finalize Assessment
//                   </button>
//                 ) : (
//                    <div className="flex items-center gap-4 bg-emerald-50 px-8 py-4 rounded-[2rem] border border-emerald-100">
//                       <Award className="w-8 h-8 text-emerald-600" />
//                       <div><p className="text-[10px] font-black text-emerald-400 uppercase">Assessment Concluded</p><p className="font-black text-emerald-800">Record Locked</p></div>
//                    </div>
//                 )}
//              </div>
//           </div>
//         </div>
//       </main>

//       <style>{`
//         input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
//         @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//         .animate-in { animation: slide-up 0.5s ease-out forwards; }
//       `}</style>
//     </div>
//   );
// };

// export default OnJobTraining;


// import React, { useEffect, useState } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import {
//   Save, CheckCircle, XCircle, Clock, ArrowLeft,
//   Calendar, Settings, Info, BarChart3, Shield,
//   Loader2, GraduationCap, TrendingUp, AlertTriangle, Award
// } from 'lucide-react';
// import { OJTRecordData } from '../cm/ChangeManagementView';

// // ────────────────────────────────────────────────
// // Types
// // ────────────────────────────────────────────────
// interface DailyScore {
//   id?: number;
//   day: number;
//   date: string | null;
//   plan: string | number | null;
//   actual: string | number | null;
//   production_marks: number;
//   rejections: string | number | null;
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

// interface OnJobTrainingProps {
//   recordData?: OJTRecordData | null;
//   onBack?: () => void;
// }

// const API_BASE_URL = 'http://127.0.0.1:8000';

// const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const activeData = recordData || (location.state as OJTRecordData) || {};

//   const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
//   const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [savingDay, setSavingDay] = useState<number | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

//   const showToast = (message: string, type: 'success' | 'error') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       try {
//         const url = id 
//           ? `${API_BASE_URL}/api/ojt-records/${id}/` 
//           : `${API_BASE_URL}/api/ojt-records/create_from_change/`;
        
//         const res = await fetch(url, {
//           method: id ? 'GET' : 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: id ? null : JSON.stringify({
//             four_m_change_record_id: activeData.changeId,
//             department_name: activeData.departmentName || "Production",
//           }),
//         });

//         const data = await res.json();
//         setOjtRecord(data);
//         setDailyScores(data.daily_scores);
//       } catch (err) {
//         showToast("Server Connection Failed", "error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//   }, [id, activeData.changeId]);

//   const saveDay = async (idx: number) => {
//     if (!ojtRecord?.id) return;
//     setSavingDay(idx);
//     const dayData = dailyScores[idx];

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/ojt-records/${ojtRecord.id}/update_daily_score/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: dayData.day,
//           date: dayData.date || null,
//           plan: dayData.plan !== '' ? Number(dayData.plan) : null,
//           actual: dayData.actual !== '' ? Number(dayData.actual) : null,
//           rejections: dayData.rejections !== '' ? Number(dayData.rejections) : null,
//         }),
//       });

//       const updatedRecord = await res.json();
//       setOjtRecord(updatedRecord);
//       setDailyScores(updatedRecord.daily_scores);
//       showToast(`Day ${dayData.day} Synced`, "success");
//     } catch {
//       showToast("Error Saving Day", "error");
//     } finally {
//       setSavingDay(null);
//     }
//   };

//   if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin w-12 h-12 text-blue-600" /></div>;

//   return (
//     <div className="bg-[#f8fafc] min-h-screen pb-12">
//       {toast && (
//         <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-10">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
//             {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
//             <p className="font-bold text-sm">{toast.message}</p>
//           </div>
//         </div>
//       )}

//       <nav className="sticky top-0 bg-white border-b px-8 h-20 flex items-center justify-between z-40">
//         <div className="flex items-center gap-6">
//           <button onClick={() => onBack?.() ?? navigate(-1)} className="p-3 hover:bg-slate-100 rounded-xl transition-all"><ArrowLeft /></button>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight">Level 2 OJT Assessment</h1>
//         </div>
//         <div className={`px-4 py-2 rounded-full text-xs font-black text-white shadow-lg ${ojtRecord?.status === 'pass' ? 'bg-emerald-500' : ojtRecord?.status === 'fail' ? 'bg-rose-500' : 'bg-amber-500'}`}>
//           {ojtRecord?.status?.replace('_', ' ').toUpperCase()}
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto p-8 space-y-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
//             <h2 className="text-4xl font-black text-slate-900 mb-2">{activeData.stationName}</h2>
//             <p className="text-slate-400 font-medium">Record: <span className="text-blue-600 font-bold">{activeData.changeId}</span></p>
//           </div>
//           <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col justify-center items-center">
//             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Overall Score</span>
//             <div className="text-6xl font-black">{ojtRecord?.overall_marks}<span className="text-xl text-slate-600 font-normal">/48</span></div>
//           </div>
//         </div>

//         <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
//           <div className="px-10 py-6 bg-slate-50 border-b flex justify-between items-center text-sm font-black text-slate-800 uppercase tracking-widest">
//              Training Log (6 Days)
//              {!dailyScores.every(d => d.date) && (
//                <div className="flex items-center gap-2 text-rose-600 text-[10px] animate-pulse">
//                  <AlertTriangle className="w-4 h-4" /> MISSING DATES WILL PREVENT "PASS" STATUS
//                </div>
//              )}
//           </div>

//           <table className="w-full">
//             <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase border-b">
//               <tr>
//                 <th className="px-10 py-6 text-left">Day</th>
//                 <th className="px-6 py-6 text-left">Date</th>
//                 <th className="px-4 py-6 text-center">Plan</th>
//                 <th className="px-4 py-6 text-center">Actual</th>
//                 <th className="px-4 py-6 text-center">Rej.</th>
//                 <th className="px-10 py-6 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {dailyScores.map((row, idx) => (
//                 <tr key={idx} className="hover:bg-slate-50/50 transition-all">
//                   <td className="px-10 py-6 font-black text-slate-800">D{row.day}</td>
//                   <td className="px-6 py-6">
//                     <input 
//                       type="date" 
//                       value={row.date || ''} 
//                       onChange={(e) => {
//                         const next = [...dailyScores];
//                         next[idx].date = e.target.value;
//                         setDailyScores(next);
//                       }}
//                       className={`px-4 py-2 rounded-xl border outline-none text-sm font-bold ${!row.date && row.actual ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-blue-500'}`}
//                     />
//                   </td>
//                   <td className="px-4 py-6 text-center font-bold text-slate-600">{row.plan}</td>
//                   <td className="px-4 py-6 text-center font-black text-blue-600">{row.actual}</td>
//                   <td className="px-4 py-6 text-center font-bold text-slate-600">{row.rejections}</td>
//                   <td className="px-10 py-6 text-right">
//                     <button onClick={() => saveDay(idx)} disabled={savingDay === idx} className="p-3 bg-white border rounded-xl hover:border-blue-300 hover:text-blue-600 shadow-sm transition-all disabled:opacity-30">
//                       {savingDay === idx ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 🔥 THIS EXPORT IS WHAT FIXES THE ERROR
// export default OnJobTraining;


import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Save, CheckCircle, XCircle, Clock, ArrowLeft,
  Calendar, Settings, Info, BarChart3, Shield,
  Loader2, Download, Printer, GraduationCap, 
  TrendingUp, AlertTriangle, Award
} from 'lucide-react';

// --- Types ---
export interface OJTRecordData {
  changeId: string;
  fourMChangeId: number;
  shopfloorName: string;
  lineName: string;
  stationName: string;
  departmentName: string;
  processName: string;
}

interface OnJobTrainingProps {
  recordData?: OJTRecordData | null;
  onBack?: () => void;
}

interface DailyScore {
  id?: number;
  day: number;
  date: string | null;
  plan: string | number;
  actual: string | number;
  production_marks: number;
  rejections: string | number;
  quality_marks: number;
}

interface OJTRecord {
  id: number;
  status: 'in_progress' | 'pass' | 'fail';
  total_production_marks: number;
  total_quality_marks: number;
  overall_marks: number;
  daily_scores: DailyScore[];
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- UI Sub-Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, any> = {
    pass: { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle, label: 'PASSED' },
    fail: { bg: 'bg-rose-500', text: 'text-white', icon: XCircle, label: 'FAILED' },
    in_progress: { bg: 'bg-amber-500', text: 'text-white', icon: Clock, label: 'IN PROGRESS' }
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
  const colors = {
    4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    3: 'bg-blue-100    text-blue-700    border-blue-200',
    2: 'bg-amber-100  text-amber-700   border-amber-200',
    1: 'bg-rose-100   text-rose-700    border-rose-200',
    0: 'bg-gray-100   text-gray-400    border-gray-200',
  };
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${(colors as any)[marks] || colors[0]}`}>
      {marks || 0}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '50')}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      {subtext && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-tight">{subtext}</span>}
    </div>
    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-800">{value}</p>
  </div>
);

// --- Main Component ---

const OnJobTraining: React.FC<OnJobTrainingProps> = ({ recordData, onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const state = (recordData || location.state || {}) as OJTRecordData;
  
  const [ojtRecord, setOjtRecord] = useState<OJTRecord | null>(null);
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Initial Fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const url = id ? `${API_BASE_URL}/ojt-records/${id}/` : `${API_BASE_URL}/ojt-records/create_from_change/`;
        const method = id ? 'GET' : 'POST';
        const body = id ? null : JSON.stringify({ four_m_change_record_id: state.changeId });

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body
        });
        const data = await res.json();
        setOjtRecord(data);
        setDailyScores(data.daily_scores || []);
      } catch (e) { showToast("Connection Error", "error"); }
      finally { setLoading(false); }
    };
    init();
  }, [id, state.changeId]);

  // 2. Handle Inputs
  const handleInputChange = (index: number, field: keyof DailyScore, value: string) => {
    const updated = [...dailyScores];
    // @ts-ignore
    updated[index][field] = value === '' ? null : value;

    // Frontend Preview Calculation (Matches Backend Logic)
    if (field === 'actual' || field === 'plan') {
      const p = parseFloat(updated[index].plan as string) || 0;
      const a = parseFloat(updated[index].actual as string) || 0;
      const pct = p > 0 ? (a / p) * 100 : 0;
      updated[index].production_marks = pct >= 90 ? 4 : pct >= 75 ? 3 : pct >= 60 ? 2 : a > 0 ? 1 : 0;
    }
    if (field === 'rejections') {
      const r = parseInt(value);
      if (!isNaN(r)) updated[index].quality_marks = r === 0 ? 4 : r <= 2 ? 3 : r <= 5 ? 2 : 1;
    }
    setDailyScores(updated);
  };

  // 3. Save Logic (The Fix for Status Sync)
  const saveDay = async (idx: number) => {
    if (!ojtRecord?.id) return;
    setSavingDay(idx);
    const dayData = dailyScores[idx];
    try {
      const res = await fetch(`${API_BASE_URL}/ojt-records/${ojtRecord.id}/update_daily_score/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: dayData.day,
          date: dayData.date || null,
          plan: dayData.plan,
          actual: dayData.actual,
          rejections: dayData.rejections,
        }),
      });

      if (res.ok) {
        const updatedRecord = await res.json();
        // 🔥 UPDATE EVERYTHING FROM SERVER RESPONSE
        setOjtRecord(updatedRecord);
        setDailyScores(updatedRecord.daily_scores);
        showToast(`Day ${dayData.day} Synced. Status: ${updatedRecord.status.toUpperCase()}`, "success");
      }
    } catch (e) { showToast("Save Failed", "error"); }
    finally { setSavingDay(null); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast */}
      {toast && (
        <div className="fixed top-8 right-8 z-[60] animate-in slide-in-from-right-10">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl bg-white border-l-4 ${toast.type === 'success' ? 'border-emerald-500' : 'border-rose-500'}`}>
            {toast.type === 'success' ? <CheckCircle className="text-emerald-500" /> : <AlertTriangle className="text-rose-500" />}
            <span className="font-bold text-slate-800">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center px-8 justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => onBack ? onBack() : navigate(-1)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><ArrowLeft /></button>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
            <GraduationCap className="text-blue-600 w-6 h-6"/> OJT Assessment
          </h1>
        </div>
        <StatusBadge status={ojtRecord?.status || 'in_progress'} />
      </nav>

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Target Station</p>
              <h2 className="text-4xl font-black tracking-tight mb-4">{state.stationName || 'Precision Unit'}</h2>
              <div className="flex gap-4 opacity-60 font-bold text-xs uppercase tracking-widest">
                <span>{state.changeId}</span>
                <span>•</span>
                <span>{state.lineName}</span>
              </div>
            </div>
            <div className="text-center bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md min-w-[240px]">
              <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Cumulative Score</p>
              <div className="text-6xl font-black">{ojtRecord?.overall_marks || 0}<span className="text-xl opacity-20 ml-1">/48</span></div>
              <div className={`mt-4 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${ojtRecord?.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                 {ojtRecord?.status?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Production" value={`${ojtRecord?.total_production_marks || 0}/24`} icon={TrendingUp} colorClass="text-blue-600" subtext="Output" />
          <StatCard title="Quality" value={`${ojtRecord?.total_quality_marks || 0}/24`} icon={Shield} colorClass="text-emerald-600" subtext="Defects" />
          <StatCard title="Completion" value={`${dailyScores.filter(d => d.date && d.actual).length}/6 Days`} icon={Calendar} colorClass="text-indigo-600" subtext="Log" />
          <StatCard title="Assessment" value={ojtRecord?.status?.toUpperCase() || 'IN PROGRESS'} icon={Award} colorClass={ojtRecord?.status === 'pass' ? 'text-emerald-600' : 'text-amber-600'} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-3">
              <BarChart3 className="text-blue-600 w-5 h-5"/> Training Performance Ledger
            </h3>
            <button onClick={() => setShowCriteria(!showCriteria)} className="text-[10px] font-black text-blue-600 flex items-center gap-2">
              <Info className="w-4 h-4"/> SCORING RULES
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase border-b">
                <tr>
                  <th className="px-8 py-6 text-left">Day</th>
                  <th className="px-6 py-6 text-left">Date</th>
                  <th className="px-4 py-6 text-center">Plan</th>
                  <th className="px-4 py-6 text-center">Actual</th>
                  <th className="px-4 py-6 text-center">Rej.</th>
                  <th className="px-4 py-6 text-center">Prod</th>
                  <th className="px-4 py-6 text-center">Qual</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyScores.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6 font-black text-slate-800">D{row.day}</td>
                    <td className="px-6 py-6">
                      <input type="date" value={row.date || ''} onChange={(e) => handleInputChange(idx, 'date', e.target.value)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all outline-none ${!row.date && row.actual ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-blue-500'}`} />
                    </td>
                    <td className="px-4 py-6">
                      <input type="number" value={row.plan || ''} onChange={(e) => handleInputChange(idx, 'plan', e.target.value)}
                        className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-sm" />
                    </td>
                    <td className="px-4 py-6">
                      <input type="number" value={row.actual || ''} onChange={(e) => handleInputChange(idx, 'actual', e.target.value)}
                        className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-blue-500 outline-none font-black text-blue-600 text-sm" />
                    </td>
                    <td className="px-4 py-6">
                      <input type="number" value={row.rejections || ''} onChange={(e) => handleInputChange(idx, 'rejections', e.target.value)}
                        className="w-16 mx-auto text-center border-b-2 border-slate-100 focus:border-rose-500 outline-none font-bold text-sm" />
                    </td>
                    <td className="px-4 py-6"><div className="flex justify-center"><MarkBadge marks={row.production_marks} /></div></td>
                    <td className="px-4 py-6"><div className="flex justify-center"><MarkBadge marks={row.quality_marks} /></div></td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => saveDay(idx)} disabled={savingDay === idx}
                        className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-30">
                        {savingDay === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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