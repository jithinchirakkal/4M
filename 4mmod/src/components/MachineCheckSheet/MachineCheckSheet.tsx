



// // src/components/MachineCheckSheet/MachineCheckSheet.tsx

// import React, { useState, useEffect } from 'react';
// import { Check, X, AlertCircle, Save, Send } from 'lucide-react';
// import axios from 'axios';

// interface Checkpoint {
//   id: number;
//   checkPoint: string;
//   specification: string;
//   method: string;
// }

// interface CheckpointInput {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface BackendCheckpoint {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface CheckSheetData {
//   id?: number;
//   four_m_change: number;
//   machine_no: string;
//   shift: 'A' | 'B' | 'C';
//   operator_signature: string;
//   supervisor_signature: string;
//   checkpoints: CheckpointInput[];
//   overall_result?: 'PASS' | 'FAIL' | null;
//   is_submitted: boolean;
//   submitted_at?: string | null;
//   record_id?: string;
// }

// const CHECKPOINTS: Checkpoint[] = [
//   { id: 1, checkPoint: "Air Pressure\nहवा का दबाव", specification: "4 - 6 Kgf / cm²", method: "Pressure gauge में से Reading चेक करें" },
//   { id: 2, checkPoint: "Machine lubrication\nमशीन लुब्रिकेशन", specification: "Lubrication pump should work\nलुब्रिकेशन पंप को काम करना चाहिए", method: "Panel पर लुब्रिकेशन पंप की शुरू करनी चाहिए" },
//   { id: 3, checkPoint: "Red Bin", specification: "रोजाना के दौरान देखो (Daily)", method: "Scrap all rejected parts in red bin during set up" },
//   { id: 4, checkPoint: "Machine overload Meter", specification: "Machine overload meter should work", method: "ओवरलोड मीटर को कैसे समझना चाहिए? 0 - 3 एम्पेयर" },
//   { id: 5, checkPoint: "Die Locking Bolts", specification: "Die Locking Bolt Should Tight", method: "Die Lock Bolt को Allen Key से टाइट करें" },
//   { id: 6, checkPoint: "Machine Short Feed\nमशीन शॉर्ट फीड Sensors", specification: "Short Feed Sensor should work", method: "SHORT FEED में सेटिंग रखनी चाहिए" },
//   { id: 7, checkPoint: "Punch locking by grub screw", specification: "Punch lock by grub screw only\nसिर्फ ग्रब स्क्रू द्वारा पंच को टाइट करें", method: "Grub screw को allen key से टाइट करें" },
//   { id: 8, checkPoint: "Finger condition", specification: "फिंगर कंडीशन को फिंगर टी से चेक करे", method: "नुकसान फिंगर Damage T Worn out नहीं होना चाहिए" },
//   { id: 9, checkPoint: "No Play in Transfer cam shaft", specification: "No Play in Transfer cam shaft", method: "Transfer cam shaft को घुमाकर देखें" },
//   { id: 10, checkPoint: "Link rod play to be check", specification: "Pin or Bearing के पिन खो नहीं होना चाहिए", method: "Link Rod अपने पीछे घूमने देखे" },
//   { id: 11, checkPoint: "Trimming Plate To Be Check", specification: "Trimming की Item जरुरी समान होनी चाहिए", method: "Side gap को visually से जांच करें" },
//   { id: 12, checkPoint: "Instrument Condition\nVernier / Micrometer / Dial", specification: "1. Zero Error\n2. Damage\n3. Calibration sticker", method: "Check Visually" },
//   { id: 13, checkPoint: "Magnetic Separator", specification: "Magnetic Separator काम करना चाहिए", method: "Check Visually" },
//   { id: 14, checkPoint: "3 Station Part In 4 Station Machine", specification: "यदि 3 Station का पार्ट, 4 Station Machine में सेट है", method: "Check Visually (यदि applicable नहीं है तो NA लिखें)" },
//   { id: 15, checkPoint: "Coolant pipe", specification: "कूलिंग काम पाइप पर 3rd & 4th स्टेशन पर", method: "Check Visually" },
//   { id: 16, checkPoint: "Operator Panel fan", specification: "पैनल फैन कंडीशन चेक करनी है", method: "Check Visually/ Sound" },
// ];

// interface Props {
//   recordId: string;
//   fourMChangeId: number;
//   apiBaseUrl?: string;
//   onSubmitSuccess?: () => void;
// }

// export default function MachineCheckSheet({
 
//   fourMChangeId,
//   apiBaseUrl = "/api",
//   onSubmitSuccess,
// }: Props) {
//   const [data, setData] = useState<CheckSheetData>({
//     four_m_change: fourMChangeId,
//     machine_no: "",
//     shift: "A",
//     operator_signature: "",
//     supervisor_signature: "",
//     checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
//     is_submitted: false,
//   });
//   const recordId = localStorage.getItem("active_record_id") || "";
//   const fourMId = Number(localStorage.getItem("active_four_m_id")) || 0;
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const isReadOnly = data.is_submitted;

//   // Fetch existing record
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!recordId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const res = await axios.get(`${apiBaseUrl}/machine-check-sheets/?record_id=${recordId}`);

//         if (res.data && Array.isArray(res.data) && res.data.length > 0) {
//           const sheet = res.data[0];

//           const checkpointsMap = new Map<number, BackendCheckpoint>(
//             sheet.checkpoints.map((cp: BackendCheckpoint) => [cp.check_point_no, cp])
//           );

//           const mergedCheckpoints: CheckpointInput[] = CHECKPOINTS.map(cp => {
//             const existing = checkpointsMap.get(cp.id);
//             return existing
//               ? {
//                   check_point_no: cp.id,
//                   status: existing.status,
//                   remarks: existing.remarks,
//                 }
//               : { check_point_no: cp.id, status: "NA" };
//           });

//           setData({
//             id: sheet.id,
//             four_m_change: sheet.four_m_change,
//             machine_no: sheet.machine_no || "",
//             shift: sheet.shift || "A",
//             operator_signature: sheet.operator_signature || "",
//             supervisor_signature: sheet.supervisor_signature || "",
//             checkpoints: mergedCheckpoints,
//             overall_result: sheet.overall_result || null,
//             is_submitted: sheet.is_submitted || false,
//             submitted_at: sheet.submitted_at || null,
//             record_id: sheet.record_id,
//           });
//         }
//       } catch (err) {
//         console.error("Failed to fetch check sheet:", err);
//         setError("Failed to load existing check sheet");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [recordId, apiBaseUrl]);

//   const updateCheckpoint = (check_point_no: number, updates: Partial<CheckpointInput>) => {
//     if (isReadOnly) return;

//     setData(prev => ({
//       ...prev,
//       checkpoints: prev.checkpoints.map(cp =>
//         cp.check_point_no === check_point_no ? { ...cp, ...updates } : cp
//       ),
//     }));
//   };

//   const allCheckpointsFilled = data.checkpoints.every(cp => cp.status !== "NA");

//   const handleSave = async (shouldSubmit = false) => {
//     if (shouldSubmit && !allCheckpointsFilled) {
//       setError("All 16 checkpoints must be marked (OK/NG/NA) before submission");
//       return;
//     }

//     setError(null);
//     setSubmitting(true);

//     const payload = {
//       four_m_change: data.four_m_change,
//       machine_no: data.machine_no.trim(),
//       shift: data.shift,
//       operator_signature: data.operator_signature.trim(),
//       supervisor_signature: data.supervisor_signature.trim(),
//       checkpoints: data.checkpoints,
//     };

//     try {
//       let res;

//       if (data.id) {
//         // Update existing
//         res = await axios.patch(`${apiBaseUrl}/machine-check-sheets/${data.id}/`, payload);
//       } else {
//         // Create new
//         res = await axios.post(`${apiBaseUrl}/machine-check-sheets/`, payload);
//       }

//       const saved = res.data;

//       if (shouldSubmit) {
//         // Call submit action
//         await axios.post(`${apiBaseUrl}/machine-check-sheets/${saved.id}/submit/`);
//         // Refresh after submit
//         const refreshed = await axios.get(`${apiBaseUrl}/machine-check-sheets/?record_id=${recordId}`);
//         if (refreshed.data?.length > 0) {
//           setData(prev => ({ ...prev, ...refreshed.data[0], is_submitted: true }));
//         }
//         onSubmitSuccess?.();
//         alert("Check sheet submitted successfully!");
//       } else {
//         setData(prev => ({
//           ...prev,
//           id: saved.id,
//           overall_result: saved.overall_result,
//           is_submitted: saved.is_submitted || false,
//         }));
//         alert("Progress saved as draft.");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.error || "Failed to save/submit check sheet");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-[60vh]">Loading check sheet...</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl p-6 mb-6 shadow-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">4M Machine Daily Check Sheet</h1>
//             <p className="text-blue-100 mt-1">Record ID: {recordId || "New Draft"}</p>
//           </div>
//           <div className="flex flex-wrap items-center gap-3">
//             {data.is_submitted ? (
//               <span className="bg-green-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
//                 <Check size={18} /> SUBMITTED
//               </span>
//             ) : (
//               <span className="bg-amber-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
//                 <AlertCircle size={18} /> DRAFT
//               </span>
//             )}
//             {data.overall_result && (
//               <span className={`px-4 py-2 rounded-lg font-bold ${data.overall_result === 'PASS' ? 'bg-green-600' : 'bg-red-600'}`}>
//                 RESULT: {data.overall_result}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
//           {error}
//         </div>
//       )}

//       {/* Form Fields */}
//       <div className="bg-white rounded-xl shadow p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Machine No.</label>
//             <input
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//               value={data.machine_no}
//               onChange={e => setData(prev => ({ ...prev, machine_no: e.target.value }))}
//               disabled={isReadOnly}
//               placeholder="e.g. FORGING-01"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
//             <select
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//               value={data.shift}
//               onChange={e => setData(prev => ({ ...prev, shift: e.target.value as 'A' | 'B' | 'C' }))}
//               disabled={isReadOnly}
//             >
//               <option value="A">A</option>
//               <option value="B">B</option>
//               <option value="C">C</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Operator Signature</label>
//             <input
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//               value={data.operator_signature}
//               onChange={e => setData(prev => ({ ...prev, operator_signature: e.target.value }))}
//               disabled={isReadOnly}
//               placeholder="Operator name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Signature</label>
//             <input
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
//               value={data.supervisor_signature}
//               onChange={e => setData(prev => ({ ...prev, supervisor_signature: e.target.value }))}
//               disabled={isReadOnly}
//               placeholder="Supervisor name"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Checkpoints Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
//           <h2 className="text-lg font-semibold">Machine Inspection Checkpoints (16 Points)</h2>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left font-medium w-12">#</th>
//                 <th className="px-4 py-3 text-left font-medium min-w-[180px]">Check Point</th>
//                 <th className="px-4 py-3 text-left font-medium hidden md:table-cell min-w-[160px]">Specification</th>
//                 <th className="px-4 py-3 text-center font-medium w-36">Status</th>
//                 <th className="px-4 py-3 text-left font-medium min-w-[200px]">Remarks (required if NG)</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {CHECKPOINTS.map((cp) => {
//                 const entry = data.checkpoints.find(c => c.check_point_no === cp.id)!;
//                 const isNG = entry.status === "NG";

//                 return (
//                   <tr key={cp.id} className="hover:bg-blue-50/40 transition-colors">
//                     <td className="px-4 py-4 font-medium text-center">{cp.id}</td>
//                     <td className="px-4 py-4 whitespace-pre-line leading-relaxed">
//                       {cp.checkPoint}
//                     </td>
//                     <td className="px-4 py-4 text-gray-600 whitespace-pre-line hidden md:table-cell">
//                       {cp.specification}
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex justify-center gap-2 flex-wrap">
//                         {(['OK', 'NG', 'NA'] as const).map(status => (
//                           <button
//                             key={status}
//                             type="button"
//                             disabled={isReadOnly}
//                             onClick={() => updateCheckpoint(cp.id, { status })}
//                             className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors min-w-[52px] ${
//                               entry.status === status
//                                 ? status === 'OK'  ? 'bg-green-600 text-white shadow-green-200'
//                                 : status === 'NG'  ? 'bg-red-600 text-white shadow-red-200'
//                                 : 'bg-gray-600 text-white shadow-gray-200'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             } disabled:opacity-60 disabled:cursor-not-allowed`}
//                           >
//                             {status}
//                           </button>
//                         ))}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <input
//                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                         placeholder={isNG ? "Required for NG" : "Optional"}
//                         value={entry.remarks || ""}
//                         onChange={e => updateCheckpoint(cp.id, { remarks: e.target.value })}
//                         disabled={isReadOnly || !isNG}
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       {!isReadOnly && (
//         <div className="flex flex-col sm:flex-row justify-end gap-4">
//           <button
//             onClick={() => handleSave(false)}
//             disabled={submitting}
//             className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition min-w-[140px]"
//           >
//             <Save size={18} />
//             Save Draft
//           </button>

//           <button
//             onClick={() => handleSave(true)}
//             disabled={submitting || !allCheckpointsFilled}
//             title={!allCheckpointsFilled ? "Complete all 16 checkpoints first" : ""}
//             className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md min-w-[160px]"
//           >
//             <Send size={18} />
//             Submit Final
//           </button>
//         </div>
//       )}

//       {isReadOnly && (
//         <div className="text-center py-8 text-gray-600 font-medium">
//           This check sheet has been submitted and is now read-only.
//         </div>
//       )}
//     </div>
//   );
// }


// src/components/MachineCheckSheet/MachineCheckSheet.tsx




// import React, { useState, useEffect } from 'react';
// import { Check, AlertCircle, Save, Send, Settings, XCircle } from 'lucide-react';
// import axios from 'axios';

// // ==================== TYPES ====================
// interface Checkpoint {
//   id: number;
//   checkPoint: string;
//   specification: string;
//   method: string;
// }

// interface CheckpointInput {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface BackendCheckpoint {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface CheckSheetData {
//   id?: number;
//   four_m_change: number;
//   machine_no: string;
//   shift: 'A' | 'B' | 'C';
//   operator_signature: string;
//   supervisor_signature: string;
//   checkpoints: CheckpointInput[];
//   overall_result?: 'PASS' | 'FAIL' | null;
//   is_submitted: boolean;
//   submitted_at?: string | null;
//   record_id?: string;
// }

// // ==================== CONSTANTS ====================
// const CHECKPOINTS: Checkpoint[] = [
//   { id: 1, checkPoint: "Air Pressure\nहवा का दबाव", specification: "4 - 6 Kgf / cm²", method: "Pressure gauge में से Reading चेक करें" },
//   { id: 2, checkPoint: "Machine lubrication\nमशीन लुब्रिकेशन", specification: "Lubrication pump should work\nलुब्रिकेशन पंप को काम करना चाहिए", method: "Panel पर लुब्रिकेशन पंप की शुरू करनी चाहिए" },
//   { id: 3, checkPoint: "Red Bin", specification: "रोजाना के दौरान देखो (Daily)", method: "Scrap all rejected parts in red bin during set up" },
//   { id: 4, checkPoint: "Machine overload Meter", specification: "Machine overload meter should work", method: "ओवरलोड मीटर को कैसे समझना चाहिए? 0 - 3 एम्पेयर" },
//   { id: 5, checkPoint: "Die Locking Bolts", specification: "Die Locking Bolt Should Tight", method: "Die Lock Bolt को Allen Key से टाइट करें" },
//   { id: 6, checkPoint: "Machine Short Feed\nमशीन शॉर्ट फीड Sensors", specification: "Short Feed Sensor should work", method: "SHORT FEED में सेटिंग रखनी चाहिए" },
//   { id: 7, checkPoint: "Punch locking by grub screw", specification: "Punch lock by grub screw only\nसिर्फ ग्रब स्क्रू द्वारा पंच को टाइट करें", method: "Grub screw को allen key से टाइट करें" },
//   { id: 8, checkPoint: "Finger condition", specification: "फिंगर कंडीशन को फिंगर टी से चेक करे", method: "नुकसान फिंगर Damage T Worn out नहीं होना चाहिए" },
//   { id: 9, checkPoint: "No Play in Transfer cam shaft", specification: "No Play in Transfer cam shaft", method: "Transfer cam shaft को घुमाकर देखें" },
//   { id: 10, checkPoint: "Link rod play to be check", specification: "Pin or Bearing के पिन खो नहीं होना चाहिए", method: "Link Rod अपने पीछे घूमने देखे" },
//   { id: 11, checkPoint: "Trimming Plate To Be Check", specification: "Trimming की Item जरुरी समान होनी चाहिए", method: "Side gap को visually से जांच करें" },
//   { id: 12, checkPoint: "Instrument Condition\nVernier / Micrometer / Dial", specification: "1. Zero Error\n2. Damage\n3. Calibration sticker", method: "Check Visually" },
//   { id: 13, checkPoint: "Magnetic Separator", specification: "Magnetic Separator काम करना चाहिए", method: "Check Visually" },
//   { id: 14, checkPoint: "3 Station Part In 4 Station Machine", specification: "यदि 3 Station का पार्ट, 4 Station Machine में सेट है", method: "Check Visually (यदि applicable नहीं है तो NA लिखें)" },
//   { id: 15, checkPoint: "Coolant pipe", specification: "कूलिंग काम पाइप पर 3rd & 4th स्टेशन पर", method: "Check Visually" },
//   { id: 16, checkPoint: "Operator Panel fan", specification: "पैनल फैन कंडीशन चेक करनी है", method: "Check Visually/ Sound" },
// ];

// interface Props {
//   recordId?: string; // Optional to prevent TS error in Home.tsx
//   fourMChangeId?: number; // Optional
//   apiBaseUrl?: string;
//   onSubmitSuccess?: () => void;
// }

// export default function MachineCheckSheet({
//   apiBaseUrl = "http://127.0.0.1:8000/api",
//   onSubmitSuccess,
// }: Props) {
//   // 1. Fetch context from LocalStorage (set by ChangeRequestDetail)
//   const storedRecordId = localStorage.getItem("active_record_id") || "";
//   const storedFourMId = Number(localStorage.getItem("active_four_m_id")) || 0;

//   const [data, setData] = useState<CheckSheetData>({
//     four_m_change: storedFourMId,
//     machine_no: "",
//     shift: "A",
//     operator_signature: "",
//     supervisor_signature: "",
//     checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
//     is_submitted: false,
//   });

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const isReadOnly = data.is_submitted;

//   // 2. Fetch existing data on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!storedRecordId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const res = await axios.get(`${apiBaseUrl}/machine-check-sheets/?record_id=${storedRecordId}`);

//         if (res.data && Array.isArray(res.data) && res.data.length > 0) {
//           const sheet = res.data[0];
//           const checkpointsMap = new Map<number, BackendCheckpoint>(
//             sheet.checkpoints.map((cp: BackendCheckpoint) => [cp.check_point_no, cp])
//           );

//           const mergedCheckpoints: CheckpointInput[] = CHECKPOINTS.map(cp => {
//             const existing = checkpointsMap.get(cp.id);
//             return existing
//               ? { check_point_no: cp.id, status: existing.status, remarks: existing.remarks }
//               : { check_point_no: cp.id, status: "NA" };
//           });

//           setData({
//             ...sheet,
//             checkpoints: mergedCheckpoints,
//           });
//         }
//       } catch (err) {
//         console.error("Failed to fetch check sheet:", err);
//         setError("Failed to load data from server.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [storedRecordId, apiBaseUrl]);

//   const updateCheckpoint = (check_point_no: number, updates: Partial<CheckpointInput>) => {
//     if (isReadOnly) return;
//     setData(prev => ({
//       ...prev,
//       checkpoints: prev.checkpoints.map(cp =>
//         cp.check_point_no === check_point_no ? { ...cp, ...updates } : cp
//       ),
//     }));
//   };

//   const allCheckpointsFilled = data.checkpoints.every(cp => cp.status !== "NA");

//   const handleSave = async (shouldSubmit = false) => {
//     if (shouldSubmit && !allCheckpointsFilled) {
//       setError("All 16 checkpoints must be marked (OK/NG/NA) before submission");
//       return;
//     }

//     setError(null);
//     setSubmitting(true);

//     const payload = {
//       four_m_change: data.four_m_change,
//       machine_no: data.machine_no.trim(),
//       shift: data.shift,
//       operator_signature: data.operator_signature.trim(),
//       supervisor_signature: data.supervisor_signature.trim(),
//       checkpoints: data.checkpoints,
//     };

//     try {
//       let res;
//       if (data.id) {
//         res = await axios.patch(`${apiBaseUrl}/machine-check-sheets/${data.id}/`, payload);
//       } else {
//         res = await axios.post(`${apiBaseUrl}/machine-check-sheets/`, payload);
//       }

//       const saved = res.data;

//       if (shouldSubmit) {
//         await axios.post(`${apiBaseUrl}/machine-check-sheets/${saved.id}/submit/`);
//         setData(prev => ({ ...prev, is_submitted: true }));
//         alert("Check sheet submitted successfully!");
//         onSubmitSuccess?.();
//       } else {
//         setData(prev => ({ ...prev, id: saved.id }));
//         alert("Progress saved as draft.");
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || "Failed to save data.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="flex justify-center p-20 animate-pulse text-gray-500">Loading Machine Data...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-20">
//       {/* HEADER SECTION */}
//       <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-2xl p-6 mb-8 shadow-xl">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
//               <Settings className="w-8 h-8" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Machine Daily Check Sheet</h1>
//               <p className="text-blue-100/80 text-sm font-medium mt-1 uppercase tracking-widest">Record ID: {storedRecordId || "New Entry"}</p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             {data.is_submitted ? (
//               <span className="bg-green-500/20 border border-green-400 text-green-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
//                 <Check size={16} /> SUBMITTED
//               </span>
//             ) : (
//               <span className="bg-amber-500/20 border border-amber-400 text-amber-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
//                 <AlertCircle size={16} /> DRAFT MODE
//               </span>
//             )}
//             {data.overall_result && (
//               <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${data.overall_result === 'PASS' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'}`}>
//                 RESULT: {data.overall_result}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r flex items-center gap-3">
//           <XCircle className="w-5 h-5" /> {error}
//         </div>
//       )}

//       {/* BASIC INFO FORM */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Machine No.</label>
//           <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 font-semibold" value={data.machine_no} onChange={e => setData(prev => ({ ...prev, machine_no: e.target.value }))} disabled={isReadOnly} placeholder="Enter Machine ID" />
//         </div>
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Shift</label>
//           <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 font-semibold" value={data.shift} onChange={e => setData(prev => ({ ...prev, shift: e.target.value as any }))} disabled={isReadOnly}>
//             <option value="A">Shift A</option>
//             <option value="B">Shift B</option>
//             <option value="C">Shift C</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Operator Name</label>
//           <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 font-semibold" value={data.operator_signature} onChange={e => setData(prev => ({ ...prev, operator_signature: e.target.value }))} disabled={isReadOnly} />
//         </div>
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Supervisor Name</label>
//           <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 font-semibold" value={data.supervisor_signature} onChange={e => setData(prev => ({ ...prev, supervisor_signature: e.target.value }))} disabled={isReadOnly} />
//         </div>
//       </div>

//       {/* CHECKPOINTS TABLE */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-6 py-4 text-left font-bold text-gray-500 w-16">#</th>
//               <th className="px-6 py-4 text-left font-bold text-gray-500">Inspection Point</th>
//               <th className="px-6 py-4 text-left font-bold text-gray-500 hidden md:table-cell">Specification</th>
//               <th className="px-6 py-4 text-center font-bold text-gray-500 w-48">Status</th>
//               <th className="px-6 py-4 text-left font-bold text-gray-500">Remarks</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {CHECKPOINTS.map((cp) => {
//               const entry = data.checkpoints.find(c => c.check_point_no === cp.id)!;
//               const isNG = entry.status === "NG";
//               return (
//                 <tr key={cp.id} className="hover:bg-blue-50/30 transition-colors">
//                   <td className="px-6 py-5 font-bold text-gray-400">{cp.id}</td>
//                   <td className="px-6 py-5 font-semibold text-gray-800 whitespace-pre-line leading-relaxed">{cp.checkPoint}</td>
//                   <td className="px-6 py-5 text-gray-500 hidden md:table-cell whitespace-pre-line">{cp.specification}</td>
//                   <td className="px-6 py-5">
//                     <div className="flex justify-center gap-1.5">
//                       {(['OK', 'NG', 'NA'] as const).map(status => (
//                         <button
//                           key={status}
//                           disabled={isReadOnly}
//                           onClick={() => updateCheckpoint(cp.id, { status })}
//                           className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tighter transition-all ${
//                             entry.status === status
//                               ? status === 'OK' ? 'bg-green-600 text-white' : status === 'NG' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'
//                               : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
//                           }`}
//                         >
//                           {status}
//                         </button>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <input
//                       className={`w-full border rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 ${isNG ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
//                       placeholder={isNG ? "Explain NG..." : "Remarks"}
//                       value={entry.remarks || ""}
//                       onChange={e => updateCheckpoint(cp.id, { remarks: e.target.value })}
//                       disabled={isReadOnly || !isNG}
//                     />
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* ACTION FOOTER */}
//       {!isReadOnly && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 shadow-2xl flex justify-center gap-4 z-50">
//           <button onClick={() => handleSave(false)} disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-95 disabled:opacity-50">
//             <Save size={20} /> SAVE DRAFT
//           </button>
//           <button onClick={() => handleSave(true)} disabled={submitting || !allCheckpointsFilled} className="flex items-center gap-2 px-10 py-3 bg-green-600 text-white rounded-xl font-extrabold hover:bg-green-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
//             <Send size={20} /> SUBMIT FINAL
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Check,
//   AlertCircle,
//   Save,
//   Send,
//   Settings,
//   XCircle,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   LayoutGrid,
//   List,
//   Eye,
//   Edit,
//   Trash2,
//   Search,
//   RefreshCw,
//   ArrowLeft,
//   Calendar,
//   User,
//   Cpu,
//   Clock,
//   CheckCircle2,
//   FileText,
//   MoreVertical,
// } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// // ==================== TYPES ====================
// interface Checkpoint {
//   id: number;
//   checkPoint: string;
//   specification: string;
//   method: string;
// }

// interface CheckpointInput {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface BackendCheckpoint {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface CheckSheetData {
//   id?: number;
//   four_m_change: number;
//   machine_no: string;
//   shift: 'A' | 'B' | 'C';
//   operator_signature: string;
//   supervisor_signature: string;
//   checkpoints: CheckpointInput[];
//   overall_result?: 'PASS' | 'FAIL' | null;
//   is_submitted: boolean;
//   submitted_at?: string | null;
//   record_id?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// interface ListItem {
//   id: number;
//   record_id: string;
//   machine_no: string;
//   shift: 'A' | 'B' | 'C';
//   operator_signature: string;
//   supervisor_signature: string;
//   overall_result: 'PASS' | 'FAIL' | null;
//   is_submitted: boolean;
//   submitted_at: string | null;
//   created_at: string;
//   four_m_change: number;
// }

// interface PaginationData {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: ListItem[];
// }

// // ==================== CONSTANTS ====================
// const CHECKPOINTS: Checkpoint[] = [
//   { id: 1, checkPoint: "Air Pressure\nहवा का दबाव", specification: "4 - 6 Kgf / cm²", method: "Pressure gauge में से Reading चेक करें" },
//   { id: 2, checkPoint: "Machine lubrication\nमशीन लुब्रिकेशन", specification: "Lubrication pump should work\nलुब्रिकेशन पंप को काम करना चाहिए", method: "Panel पर लुब्रिकेशन पंप की शुरू करनी चाहिए" },
//   { id: 3, checkPoint: "Red Bin", specification: "रोजाना के दौरान देखो (Daily)", method: "Scrap all rejected parts in red bin during set up" },
//   { id: 4, checkPoint: "Machine overload Meter", specification: "Machine overload meter should work", method: "ओवरलोड मीटर को कैसे समझना चाहिए? 0 - 3 एम्पेयर" },
//   { id: 5, checkPoint: "Die Locking Bolts", specification: "Die Locking Bolt Should Tight", method: "Die Lock Bolt को Allen Key से टाइट करें" },
//   { id: 6, checkPoint: "Machine Short Feed\nमशीन शॉर्ट फीड Sensors", specification: "Short Feed Sensor should work", method: "SHORT FEED में सेटिंग रखनी चाहिए" },
//   { id: 7, checkPoint: "Punch locking by grub screw", specification: "Punch lock by grub screw only\nसिर्फ ग्रब स्क्रू द्वारा पंच को टाइट करें", method: "Grub screw को allen key से टाइट करें" },
//   { id: 8, checkPoint: "Finger condition", specification: "फिंगर कंडीशन को फिंगर टी से चेक करे", method: "नुकसान फिंगर Damage T Worn out नहीं होना चाहिए" },
//   { id: 9, checkPoint: "No Play in Transfer cam shaft", specification: "No Play in Transfer cam shaft", method: "Transfer cam shaft को घुमाकर देखें" },
//   { id: 10, checkPoint: "Link rod play to be check", specification: "Pin or Bearing के पिन खो नहीं होना चाहिए", method: "Link Rod अपने पीछे घूमने देखे" },
//   { id: 11, checkPoint: "Trimming Plate To Be Check", specification: "Trimming की Item जरुरी समान होनी चाहिए", method: "Side gap को visually से जांच करें" },
//   { id: 12, checkPoint: "Instrument Condition\nVernier / Micrometer / Dial", specification: "1. Zero Error\n2. Damage\n3. Calibration sticker", method: "Check Visually" },
//   { id: 13, checkPoint: "Magnetic Separator", specification: "Magnetic Separator काम करना चाहिए", method: "Check Visually" },
//   { id: 14, checkPoint: "3 Station Part In 4 Station Machine", specification: "यदि 3 Station का पार्ट, 4 Station Machine में सेट है", method: "Check Visually (यदि applicable नहीं है तो NA लिखें)" },
//   { id: 15, checkPoint: "Coolant pipe", specification: "कूलिंग काम पाइप पर 3rd & 4th स्टेशन पर", method: "Check Visually" },
//   { id: 16, checkPoint: "Operator Panel fan", specification: "पैनल फैन कंडीशन चेक करनी है", method: "Check Visually/ Sound" },
// ];

// const ITEMS_PER_PAGE = 10;

// interface Props {
//   apiBaseUrl?: string;
// }

// // ==================== MAIN COMPONENT ====================
// export default function MachineCheckSheet({ apiBaseUrl = "http://127.0.0.1:8000/api" }: Props) {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   // Get record_id from URL params OR localStorage
//   const urlRecordId = searchParams.get('record_id');
//   const storedRecordId = localStorage.getItem("active_record_id") || "";
//   const storedFourMId = Number(localStorage.getItem("active_four_m_id")) || 0;
  
//   // Determine the mode
//   const activeRecordId = urlRecordId || storedRecordId;
//   const isFormMode = !!activeRecordId;

//   // ==================== STATE ====================
//   const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
//   const [listData, setListData] = useState<ListItem[]>([]);
//   const [pagination, setPagination] = useState({ count: 0, currentPage: 1, totalPages: 1 });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [listLoading, setListLoading] = useState(false);

//   const [formData, setFormData] = useState<CheckSheetData>({
//     four_m_change: storedFourMId,
//     machine_no: "",
//     shift: "A",
//     operator_signature: "",
//     supervisor_signature: "",
//     checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
//     is_submitted: false,
//   });

//   const [formLoading, setFormLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const isReadOnly = formData.is_submitted;

//   // ==================== FETCH LIST DATA ====================
//   const fetchListData = useCallback(async (page = 1) => {
//     setListLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get<PaginationData>(
//         `${apiBaseUrl}/machine-check-sheets/?page=${page}&page_size=${ITEMS_PER_PAGE}&search=${searchQuery}`
//       );
      
//       // Handle both paginated and non-paginated responses
//       if (res.data.results) {
//         setListData(res.data.results);
//         setPagination({
//           count: res.data.count,
//           currentPage: page,
//           totalPages: Math.ceil(res.data.count / ITEMS_PER_PAGE),
//         });
//       } else if (Array.isArray(res.data)) {
//         setListData(res.data as unknown as ListItem[]);
//         setPagination({
//           count: (res.data as unknown as ListItem[]).length,
//           currentPage: 1,
//           totalPages: 1,
//         });
//       }
//     } catch (err) {
//       console.error("Failed to fetch list:", err);
//       setError("Failed to load check sheets list.");
//     } finally {
//       setListLoading(false);
//     }
//   }, [apiBaseUrl, searchQuery]);

//   // ==================== FETCH FORM DATA ====================
//   const fetchFormData = useCallback(async () => {
//     if (!activeRecordId) return;

//     setFormLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${apiBaseUrl}/machine-check-sheets/?record_id=${activeRecordId}`);

//       if (res.data && Array.isArray(res.data) && res.data.length > 0) {
//         const sheet = res.data[0];
//         const checkpointsMap = new Map<number, BackendCheckpoint>(
//           sheet.checkpoints?.map((cp: BackendCheckpoint) => [cp.check_point_no, cp]) || []
//         );

//         const mergedCheckpoints: CheckpointInput[] = CHECKPOINTS.map(cp => {
//           const existing = checkpointsMap.get(cp.id);
//           return existing
//             ? { check_point_no: cp.id, status: existing.status, remarks: existing.remarks }
//             : { check_point_no: cp.id, status: "NA" };
//         });

//         setFormData({ ...sheet, checkpoints: mergedCheckpoints });
//       }
//     } catch (err) {
//       console.error("Failed to fetch check sheet:", err);
//       setError("Failed to load form data.");
//     } finally {
//       setFormLoading(false);
//     }
//   }, [activeRecordId, apiBaseUrl]);

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (isFormMode) {
//       fetchFormData();
//     } else {
//       fetchListData(1);
//     }
//   }, [isFormMode, fetchFormData, fetchListData]);

//   // ==================== HANDLERS ====================
//   const updateCheckpoint = (check_point_no: number, updates: Partial<CheckpointInput>) => {
//     if (isReadOnly) return;
//     setFormData(prev => ({
//       ...prev,
//       checkpoints: prev.checkpoints.map(cp =>
//         cp.check_point_no === check_point_no ? { ...cp, ...updates } : cp
//       ),
//     }));
//   };

//   const allCheckpointsFilled = formData.checkpoints.every(cp => cp.status !== "NA");

//   const handleSave = async (shouldSubmit = false) => {
//     if (shouldSubmit && !allCheckpointsFilled) {
//       setError("All 16 checkpoints must be marked (OK/NG/NA) before submission");
//       return;
//     }

//     setError(null);
//     setSuccessMessage(null);
//     setSubmitting(true);

//     const payload = {
//       four_m_change: formData.four_m_change,
//       machine_no: formData.machine_no.trim(),
//       shift: formData.shift,
//       operator_signature: formData.operator_signature.trim(),
//       supervisor_signature: formData.supervisor_signature.trim(),
//       checkpoints: formData.checkpoints,
//     };

//     try {
//       let res;
//       if (formData.id) {
//         res = await axios.patch(`${apiBaseUrl}/machine-check-sheets/${formData.id}/`, payload);
//       } else {
//         res = await axios.post(`${apiBaseUrl}/machine-check-sheets/`, payload);
//       }

//       const saved = res.data;

//       if (shouldSubmit) {
//         await axios.post(`${apiBaseUrl}/machine-check-sheets/${saved.id}/submit/`);
//         setFormData(prev => ({ ...prev, is_submitted: true, overall_result: saved.overall_result }));
//         setSuccessMessage("Check sheet submitted successfully!");
        
//         // Navigate to ChangeRequestDetail after 2 seconds
//         setTimeout(() => {
//           navigate('/change-request-detail');
//         }, 2000);
//       } else {
//         setFormData(prev => ({ ...prev, id: saved.id }));
//         setSuccessMessage("Progress saved as draft.");
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || "Failed to save data.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleAddNew = () => {
//     // Clear the active record and navigate to form mode
//     localStorage.removeItem("active_record_id");
//     localStorage.removeItem("active_four_m_id");
//     setSearchParams({ new: 'true' });
//     setFormData({
//       four_m_change: 0,
//       machine_no: "",
//       shift: "A",
//       operator_signature: "",
//       supervisor_signature: "",
//       checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
//       is_submitted: false,
//     });
//   };

//   const handleViewItem = (item: ListItem) => {
//     localStorage.setItem("active_record_id", item.record_id);
//     localStorage.setItem("active_four_m_id", String(item.four_m_change));
//     setSearchParams({ record_id: item.record_id });
//   };

//   const handleBackToList = () => {
//     localStorage.removeItem("active_record_id");
//     localStorage.removeItem("active_four_m_id");
//     setSearchParams({});
//     fetchListData(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchListData(newPage);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchListData(1);
//   };

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getShiftBadgeColor = (shift: string) => {
//     switch (shift) {
//       case 'A': return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'B': return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'C': return 'bg-orange-100 text-orange-700 border-orange-200';
//       default: return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   // ==================== RENDER LOADING ====================
//   if (formLoading || (listLoading && listData.length === 0)) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // ==================== RENDER LIST VIEW ====================
//   if (!isFormMode && !searchParams.get('new')) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//                   <Settings className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Machine Check Sheets</h1>
//                   <p className="text-gray-500 text-sm mt-1">Manage and view all machine daily check sheets</p>
//                 </div>
//               </div>
              
//               <div className="flex flex-wrap items-center gap-3">
//                 {/* Search */}
//                 <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search by machine, operator..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     />
//                   </div>
//                 </form>

//                 {/* View Toggle */}
//                 <div className="flex items-center bg-gray-100 rounded-xl p-1">
//                   <button
//                     onClick={() => setViewMode('table')}
//                     className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                   >
//                     <List className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => setViewMode('card')}
//                     className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                   >
//                     <LayoutGrid className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Refresh */}
//                 <button
//                   onClick={() => fetchListData(pagination.currentPage)}
//                   className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
//                 >
//                   <RefreshCw className={`w-5 h-5 text-gray-600 ${listLoading ? 'animate-spin' : ''}`} />
//                 </button>

//                 {/* Add New Button */}
//                 <button
//                   onClick={handleAddNew}
//                   className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
//                 >
//                   <Plus className="w-5 h-5" />
//                   <span className="hidden sm:inline">Add New</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
//               <XCircle className="w-5 h-5 flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <FileText className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-800">{pagination.count}</p>
//                   <p className="text-xs text-gray-500">Total Records</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle2 className="w-5 h-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {listData.filter(i => i.is_submitted).length}
//                   </p>
//                   <p className="text-xs text-gray-500">Submitted</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-amber-100 rounded-lg">
//                   <Clock className="w-5 h-5 text-amber-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {listData.filter(i => !i.is_submitted).length}
//                   </p>
//                   <p className="text-xs text-gray-500">Drafts</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-emerald-100 rounded-lg">
//                   <Check className="w-5 h-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {listData.filter(i => i.overall_result === 'PASS').length}
//                   </p>
//                   <p className="text-xs text-gray-500">Passed</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           {listData.length === 0 ? (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <FileText className="w-10 h-10 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">No Check Sheets Found</h3>
//               <p className="text-gray-500 mb-6">Get started by creating your first machine check sheet.</p>
//               <button
//                 onClick={handleAddNew}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
//               >
//                 <Plus className="w-5 h-5" />
//                 Create First Check Sheet
//               </button>
//             </div>
//           ) : viewMode === 'table' ? (
//             /* Table View */
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-100">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Record ID</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Machine</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shift</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Operator</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Result</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
//                       <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {listData.map((item) => (
//                       <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
//                         <td className="px-6 py-4">
//                           <span className="font-mono text-sm font-semibold text-gray-800">{item.record_id}</span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <Cpu className="w-4 h-4 text-gray-400" />
//                             <span className="font-medium text-gray-700">{item.machine_no || 'N/A'}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getShiftBadgeColor(item.shift)}`}>
//                             Shift {item.shift}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <User className="w-4 h-4 text-gray-400" />
//                             <span className="text-gray-700">{item.operator_signature || 'N/A'}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           {item.is_submitted ? (
//                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
//                               <Check className="w-3.5 h-3.5" />
//                               Submitted
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
//                               <Clock className="w-3.5 h-3.5" />
//                               Draft
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4">
//                           {item.overall_result ? (
//                             <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
//                               item.overall_result === 'PASS' 
//                                 ? 'bg-emerald-100 text-emerald-700' 
//                                 : 'bg-red-100 text-red-700'
//                             }`}>
//                               {item.overall_result}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400 text-sm">—</span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2 text-gray-500 text-sm">
//                             <Calendar className="w-4 h-4" />
//                             {formatDate(item.created_at)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center justify-center gap-2">
//                             <button
//                               onClick={() => handleViewItem(item)}
//                               className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
//                               title="View Details"
//                             >
//                               <Eye className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
//                             </button>
//                             {!item.is_submitted && (
//                               <button
//                                 onClick={() => handleViewItem(item)}
//                                 className="p-2 hover:bg-amber-100 rounded-lg transition-colors group"
//                                 title="Edit"
//                               >
//                                 <Edit className="w-4 h-4 text-gray-500 group-hover:text-amber-600" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             /* Card View */
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {listData.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all group cursor-pointer"
//                   onClick={() => handleViewItem(item)}
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <span className="font-mono text-sm font-bold text-blue-600">{item.record_id}</span>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Cpu className="w-4 h-4 text-gray-400" />
//                         <span className="font-semibold text-gray-800">{item.machine_no || 'N/A'}</span>
//                       </div>
//                     </div>
//                     <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getShiftBadgeColor(item.shift)}`}>
//                       Shift {item.shift}
//                     </span>
//                   </div>

//                   <div className="space-y-3 mb-4">
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <User className="w-4 h-4 text-gray-400" />
//                       <span>{item.operator_signature || 'No operator'}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Calendar className="w-4 h-4 text-gray-400" />
//                       <span>{formatDate(item.created_at)}</span>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                     <div className="flex items-center gap-2">
//                       {item.is_submitted ? (
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
//                           <Check className="w-3.5 h-3.5" />
//                           Submitted
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
//                           <Clock className="w-3.5 h-3.5" />
//                           Draft
//                         </span>
//                       )}
//                       {item.overall_result && (
//                         <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
//                           item.overall_result === 'PASS' 
//                             ? 'bg-emerald-100 text-emerald-700' 
//                             : 'bg-red-100 text-red-700'
//                         }`}>
//                           {item.overall_result}
//                         </span>
//                       )}
//                     </div>
//                     <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-blue-100 rounded-lg transition-all">
//                       <Eye className="w-4 h-4 text-blue-600" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-6">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="text-sm text-gray-600">
//                   Showing page <span className="font-semibold">{pagination.currentPage}</span> of{' '}
//                   <span className="font-semibold">{pagination.totalPages}</span>
//                   {' '}({pagination.count} total records)
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => handlePageChange(1)}
//                     disabled={pagination.currentPage === 1}
//                     className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                     <ChevronLeft className="w-4 h-4 -ml-2" />
//                   </button>
//                   <button
//                     onClick={() => handlePageChange(pagination.currentPage - 1)}
//                     disabled={pagination.currentPage === 1}
//                     className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
                  
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                       let pageNum :number;
//                       if (pagination.totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (pagination.currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                         pageNum = pagination.totalPages - 4 + i;
//                       } else {
//                         pageNum = pagination.currentPage - 2 + i;
//                       }
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => handlePageChange(pageNum)}
//                           className={`w-10 h-10 rounded-lg font-semibold transition-all ${
//                             pagination.currentPage === pageNum
//                               ? 'bg-blue-600 text-white'
//                               : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                   </div>

//                   <button
//                     onClick={() => handlePageChange(pagination.currentPage + 1)}
//                     disabled={pagination.currentPage === pagination.totalPages}
//                     className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => handlePageChange(pagination.totalPages)}
//                     disabled={pagination.currentPage === pagination.totalPages}
//                     className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                     <ChevronRight className="w-4 h-4 -ml-2" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // ==================== RENDER FORM VIEW ====================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 mb-6 shadow-xl">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleBackToList}
//                 className="p-2 hover:bg-white/10 rounded-xl transition-all"
//               >
//                 <ArrowLeft className="w-6 h-6" />
//               </button>
//               <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
//                 <Settings className="w-8 h-8" />
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
//                   Machine Daily Check Sheet
//                 </h1>
//                 <p className="text-blue-100/80 text-sm font-medium mt-1 uppercase tracking-widest">
//                   {activeRecordId ? `Record ID: ${activeRecordId}` : 'New Entry'}
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               {formData.is_submitted ? (
//                 <span className="bg-green-500/20 border border-green-400 text-green-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
//                   <Check size={16} /> SUBMITTED
//                 </span>
//               ) : (
//                 <span className="bg-amber-500/20 border border-amber-400 text-amber-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
//                   <AlertCircle size={16} /> DRAFT MODE
//                 </span>
//               )}
//               {formData.overall_result && (
//                 <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${
//                   formData.overall_result === 'PASS' 
//                     ? 'bg-green-600 border-green-400' 
//                     : 'bg-red-600 border-red-400'
//                 }`}>
//                   RESULT: {formData.overall_result}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Messages */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl flex items-center gap-3">
//             <XCircle className="w-5 h-5 flex-shrink-0" />
//             <span>{error}</span>
//             <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
//               <XCircle className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {successMessage && (
//           <div className="bg-green-50 border border-green-200 text-green-700 p-4 mb-6 rounded-xl flex items-center gap-3">
//             <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
//             <span>{successMessage}</span>
//             <button onClick={() => setSuccessMessage(null)} className="ml-auto p-1 hover:bg-green-100 rounded-lg">
//               <XCircle className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {/* Basic Info Form */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//           <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <FileText className="w-5 h-5 text-blue-600" />
//             Basic Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//                 Machine No.
//               </label>
//               <input
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 font-medium transition-all"
//                 value={formData.machine_no}
//                 onChange={(e) => setFormData(prev => ({ ...prev, machine_no: e.target.value }))}
//                 disabled={isReadOnly}
//                 placeholder="Enter Machine ID"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//                 Shift
//               </label>
//               <select
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
//                 value={formData.shift}
//                 onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as any }))}
//                 disabled={isReadOnly}
//               >
//                 <option value="A">Shift A</option>
//                 <option value="B">Shift B</option>
//                 <option value="C">Shift C</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//                 Operator Name
//               </label>
//               <input
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
//                 value={formData.operator_signature}
//                 onChange={(e) => setFormData(prev => ({ ...prev, operator_signature: e.target.value }))}
//                 disabled={isReadOnly}
//                 placeholder="Enter operator name"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//                 Supervisor Name
//               </label>
//               <input
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
//                 value={formData.supervisor_signature}
//                 onChange={(e) => setFormData(prev => ({ ...prev, supervisor_signature: e.target.value }))}
//                 disabled={isReadOnly}
//                 placeholder="Enter supervisor name"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Checkpoints Table */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
//           <div className="p-6 border-b border-gray-100">
//             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//               <CheckCircle2 className="w-5 h-5 text-blue-600" />
//               Inspection Checkpoints
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Mark each checkpoint as OK, NG, or NA. Add remarks for NG items.
//             </p>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b border-gray-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left font-bold text-gray-500 w-16">#</th>
//                   <th className="px-6 py-4 text-left font-bold text-gray-500">Inspection Point</th>
//                   <th className="px-6 py-4 text-left font-bold text-gray-500 hidden lg:table-cell">Specification</th>
//                   <th className="px-6 py-4 text-center font-bold text-gray-500 w-48">Status</th>
//                   <th className="px-6 py-4 text-left font-bold text-gray-500 w-56">Remarks</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {CHECKPOINTS.map((cp) => {
//                   const entry = formData.checkpoints.find(c => c.check_point_no === cp.id)!;
//                   const isNG = entry.status === "NG";
//                   return (
//                     <tr key={cp.id} className="hover:bg-blue-50/30 transition-colors">
//                       <td className="px-6 py-5">
//                         <span className="w-8 h-8 inline-flex items-center justify-center bg-gray-100 rounded-lg font-bold text-gray-600">
//                           {cp.id}
//                         </span>
//                       </td>
//                       <td className="px-6 py-5 font-medium text-gray-800 whitespace-pre-line leading-relaxed">
//                         {cp.checkPoint}
//                       </td>
//                       <td className="px-6 py-5 text-gray-500 hidden lg:table-cell whitespace-pre-line text-sm">
//                         {cp.specification}
//                       </td>
//                       <td className="px-6 py-5">
//                         <div className="flex justify-center gap-2">
//                           {(['OK', 'NG', 'NA'] as const).map(status => (
//                             <button
//                               key={status}
//                               disabled={isReadOnly}
//                               onClick={() => updateCheckpoint(cp.id, { status })}
//                               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-105 disabled:hover:scale-100 ${
//                                 entry.status === status
//                                   ? status === 'OK' 
//                                     ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
//                                     : status === 'NG' 
//                                     ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
//                                     : 'bg-gray-600 text-white shadow-lg shadow-gray-500/30'
//                                   : 'bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:hover:bg-gray-100'
//                               }`}
//                             >
//                               {status}
//                             </button>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-5">
//                         <input
//                           className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                             isNG 
//                               ? 'border-red-300 bg-red-50 placeholder-red-400' 
//                               : 'border-gray-200 placeholder-gray-400'
//                           }`}
//                           placeholder={isNG ? "Explain NG issue..." : "Optional remarks"}
//                           value={entry.remarks || ""}
//                           onChange={(e) => updateCheckpoint(cp.id, { remarks: e.target.value })}
//                           disabled={isReadOnly || !isNG}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Action Buttons (Inside Form, Not Fixed Footer) */}
//         {!isReadOnly && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-600">
//                 <span className="font-semibold">{formData.checkpoints.filter(cp => cp.status !== 'NA').length}</span>
//                 {' '}of <span className="font-semibold">16</span> checkpoints completed
//                 <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
//                   <div 
//                     className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
//                     style={{ width: `${(formData.checkpoints.filter(cp => cp.status !== 'NA').length / 16) * 100}%` }}
//                   />
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={handleBackToList}
//                   className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleSave(false)}
//                   disabled={submitting}
//                   className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-lg disabled:opacity-50"
//                 >
//                   <Save size={18} />
//                   {submitting ? 'Saving...' : 'Save Draft'}
//                 </button>
//                 <button
//                   onClick={() => handleSave(true)}
//                   disabled={submitting || !allCheckpointsFilled}
//                   className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
//                 >
//                   <Send size={18} />
//                   {submitting ? 'Submitting...' : 'Submit Final'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Read-only Summary */}
//         {isReadOnly && (
//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-green-100 rounded-xl">
//                   <CheckCircle2 className="w-8 h-8 text-green-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-green-800">Check Sheet Submitted</h3>
//                   <p className="text-green-600 text-sm">
//                     Submitted on: {formatDate(formData.submitted_at || null)}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleBackToList}
//                 className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
//               >
//                 <ArrowLeft size={18} />
//                 Back to List
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Check,
//   AlertCircle,
//   Save,
//   Send,
//   Settings,
//   XCircle,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   LayoutGrid,
//   List,
//   Eye,
//   Edit,
//   Search,
//   RefreshCw,
//   ArrowLeft,
//   Calendar,
//   User,
//   Cpu,
//   Clock,
//   CheckCircle2,
//   FileText,
//   X,
//   PartyPopper,
//   ArrowRight,
// } from 'lucide-react';
// import axios from 'axios';

// // ==================== TYPES ====================
// interface Checkpoint {
//   id: number;
//   checkPoint: string;
//   specification: string;
//   method: string;
// }

// interface CheckpointInput {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface BackendCheckpoint {
//   check_point_no: number;
//   status: 'OK' | 'NG' | 'NA';
//   remarks?: string;
// }

// interface CheckSheetData {
//   id?: number;
//   four_m_change: number;
//   machine_no: string;
//   shift: 'A' | 'B' | 'C';
//   operator_signature: string;
//   supervisor_signature: string;
//   checkpoints: CheckpointInput[];
//   overall_result?: 'PASS' | 'FAIL' | null;
//   is_submitted: boolean;
//   submitted_at?: string | null;
//   record_id?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// interface ListItem {
//   id: number;
//   record_id: string;
//   machine_no: string;
//   shift: 'A' | 'B' | 'C';
//   operator_signature: string;
//   supervisor_signature: string;
//   overall_result: 'PASS' | 'FAIL' | null;
//   is_submitted: boolean;
//   submitted_at: string | null;
//   created_at: string;
//   four_m_change: number;
// }

// interface PaginationData {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: ListItem[];
// }

// // ==================== CONSTANTS ====================
// const CHECKPOINTS: Checkpoint[] = [
//   { id: 1, checkPoint: "Air Pressure\nहवा का दबाव", specification: "4 - 6 Kgf / cm²", method: "Pressure gauge में से Reading चेक करें" },
//   { id: 2, checkPoint: "Machine lubrication\nमशीन लुब्रिकेशन", specification: "Lubrication pump should work\nलुब्रिकेशन पंप को काम करना चाहिए", method: "Panel पर लुब्रिकेशन पंप की शुरू करनी चाहिए" },
//   { id: 3, checkPoint: "Red Bin", specification: "रोजाना के दौरान देखो (Daily)", method: "Scrap all rejected parts in red bin during set up" },
//   { id: 4, checkPoint: "Machine overload Meter", specification: "Machine overload meter should work", method: "ओवरलोड मीटर को कैसे समझना चाहिए? 0 - 3 एम्पेयर" },
//   { id: 5, checkPoint: "Die Locking Bolts", specification: "Die Locking Bolt Should Tight", method: "Die Lock Bolt को Allen Key से टाइट करें" },
//   { id: 6, checkPoint: "Machine Short Feed\nमशीन शॉर्ट फीड Sensors", specification: "Short Feed Sensor should work", method: "SHORT FEED में सेटिंग रखनी चाहिए" },
//   { id: 7, checkPoint: "Punch locking by grub screw", specification: "Punch lock by grub screw only\nसिर्फ ग्रब स्क्रू द्वारा पंच को टाइट करें", method: "Grub screw को allen key से टाइट करें" },
//   { id: 8, checkPoint: "Finger condition", specification: "फिंगर कंडीशन को फिंगर टी से चेक करे", method: "नुकसान फिंगर Damage T Worn out नहीं होना चाहिए" },
//   { id: 9, checkPoint: "No Play in Transfer cam shaft", specification: "No Play in Transfer cam shaft", method: "Transfer cam shaft को घुमाकर देखें" },
//   { id: 10, checkPoint: "Link rod play to be check", specification: "Pin or Bearing के पिन खो नहीं होना चाहिए", method: "Link Rod अपने पीछे घूमने देखे" },
//   { id: 11, checkPoint: "Trimming Plate To Be Check", specification: "Trimming की Item जरुरी समान होनी चाहिए", method: "Side gap को visually से जांच करें" },
//   { id: 12, checkPoint: "Instrument Condition\nVernier / Micrometer / Dial", specification: "1. Zero Error\n2. Damage\n3. Calibration sticker", method: "Check Visually" },
//   { id: 13, checkPoint: "Magnetic Separator", specification: "Magnetic Separator काम करना चाहिए", method: "Check Visually" },
//   { id: 14, checkPoint: "3 Station Part In 4 Station Machine", specification: "यदि 3 Station का पार्ट, 4 Station Machine में सेट है", method: "Check Visually (यदि applicable नहीं है तो NA लिखें)" },
//   { id: 15, checkPoint: "Coolant pipe", specification: "कूलिंग काम पाइप पर 3rd & 4th स्टेशन पर", method: "Check Visually" },
//   { id: 16, checkPoint: "Operator Panel fan", specification: "पैनल फैन कंडीशन चेक करनी है", method: "Check Visually/ Sound" },
// ];

// const ITEMS_PER_PAGE = 10;

// // ==================== PROPS INTERFACE ====================
// interface Props {
//   apiBaseUrl?: string;
//   onBack?: () => void; // ← Callback to return to ChangeRequestDetail (cm module)
// }

// // ==================== SUCCESS MODAL COMPONENT ====================
// interface SuccessModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onBackToChangeRequest: () => void;
//   result: 'PASS' | 'FAIL' | null;
//   recordId: string;
// }

// const SuccessModal: React.FC<SuccessModalProps> = ({
//   isOpen,
//   onClose,
//   onBackToChangeRequest,
//   result,
//   recordId,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
//         {/* Success Header */}
//         <div className={`p-8 text-center ${
//           result === 'PASS' 
//             ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
//             : result === 'FAIL'
//             ? 'bg-gradient-to-br from-red-500 to-rose-600'
//             : 'bg-gradient-to-br from-blue-500 to-indigo-600'
//         }`}>
//           <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
//             {result === 'PASS' ? (
//               <CheckCircle2 className="w-10 h-10 text-white" />
//             ) : result === 'FAIL' ? (
//               <XCircle className="w-10 h-10 text-white" />
//             ) : (
//               <PartyPopper className="w-10 h-10 text-white" />
//             )}
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">
//             Successfully Submitted!
//           </h2>
//           <p className="text-white/80 text-sm">
//             Machine Check Sheet has been saved
//           </p>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* Details */}
//           <div className="bg-gray-50 rounded-2xl p-4 mb-6">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm text-gray-500">Record ID</span>
//               <span className="font-mono font-bold text-gray-800">{recordId}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-500">Result</span>
//               <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
//                 result === 'PASS'
//                   ? 'bg-green-100 text-green-700'
//                   : result === 'FAIL'
//                   ? 'bg-red-100 text-red-700'
//                   : 'bg-gray-100 text-gray-700'
//               }`}>
//                 {result || 'Submitted'}
//               </span>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="space-y-3">
//             <button
//               onClick={onBackToChangeRequest}
//               className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Back to Change Request
//             </button>
//             <button
//               onClick={onClose}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
//             >
//               Stay on this page
//             </button>
//           </div>
//         </div>

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
//         >
//           <X className="w-5 h-5 text-white" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // ==================== DRAFT SAVED TOAST ====================
// interface ToastProps {
//   message: string;
//   type: 'success' | 'error';
//   isVisible: boolean;
//   onClose: () => void;
// }

// const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
//   useEffect(() => {
//     if (isVisible) {
//       const timer = setTimeout(onClose, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [isVisible, onClose]);

//   if (!isVisible) return null;

//   return (
//     <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
//       <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
//         type === 'success' 
//           ? 'bg-green-600 text-white' 
//           : 'bg-red-600 text-white'
//       }`}>
//         {type === 'success' ? (
//           <CheckCircle2 className="w-5 h-5" />
//         ) : (
//           <XCircle className="w-5 h-5" />
//         )}
//         <span className="font-medium">{message}</span>
//         <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg ml-2">
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // ==================== MAIN COMPONENT ====================
// export default function MachineCheckSheet({ 
//   apiBaseUrl = "http://127.0.0.1:8000/api",
//   onBack 
// }: Props) {
  
//   // Get record_id from localStorage (set by ChangeRequestDetail)
//   const storedRecordId = localStorage.getItem("active_record_id") || "";
//   const storedFourMId = Number(localStorage.getItem("active_four_m_id")) || 0;
  
//   // Mode detection
//   const [isFormMode, setIsFormMode] = useState(!!storedRecordId);
//   const [isNewMode, setIsNewMode] = useState(false);

//   // ==================== STATE ====================
//   // List State
//   const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
//   const [listData, setListData] = useState<ListItem[]>([]);
//   const [pagination, setPagination] = useState({ count: 0, currentPage: 1, totalPages: 1 });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [listLoading, setListLoading] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState<CheckSheetData>({
//     four_m_change: storedFourMId,
//     machine_no: "",
//     shift: "A",
//     operator_signature: "",
//     supervisor_signature: "",
//     checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
//     is_submitted: false,
//   });

//   const [formLoading, setFormLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Modal & Toast State
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [submittedResult, setSubmittedResult] = useState<'PASS' | 'FAIL' | null>(null);
//   const [submittedRecordId, setSubmittedRecordId] = useState('');
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
//     message: '',
//     type: 'success',
//     visible: false,
//   });

//   const isReadOnly = formData.is_submitted;

//   // ==================== FETCH LIST DATA ====================
//   const fetchListData = useCallback(async (page = 1) => {
//     setListLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get<PaginationData>(
//         `${apiBaseUrl}/machine-check-sheets/?page=${page}&page_size=${ITEMS_PER_PAGE}&search=${searchQuery}`
//       );
      
//       if (res.data.results) {
//         setListData(res.data.results);
//         setPagination({
//           count: res.data.count,
//           currentPage: page,
//           totalPages: Math.ceil(res.data.count / ITEMS_PER_PAGE),
//         });
//       } else if (Array.isArray(res.data)) {
//         setListData(res.data as unknown as ListItem[]);
//         setPagination({
//           count: (res.data as unknown as ListItem[]).length,
//           currentPage: 1,
//           totalPages: 1,
//         });
//       }
//     } catch (err) {
//       console.error("Failed to fetch list:", err);
//       setError("Failed to load check sheets list.");
//     } finally {
//       setListLoading(false);
//     }
//   }, [apiBaseUrl, searchQuery]);

//   // ==================== FETCH FORM DATA ====================
//   const fetchFormData = useCallback(async () => {
//     if (!storedRecordId) return;

//     setFormLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${apiBaseUrl}/machine-check-sheets/?record_id=${storedRecordId}`);

//       if (res.data && Array.isArray(res.data) && res.data.length > 0) {
//         const sheet = res.data[0];
//         const checkpointsMap = new Map<number, BackendCheckpoint>(
//           sheet.checkpoints?.map((cp: BackendCheckpoint) => [cp.check_point_no, cp]) || []
//         );

//         const mergedCheckpoints: CheckpointInput[] = CHECKPOINTS.map(cp => {
//           const existing = checkpointsMap.get(cp.id);
//           return existing
//             ? { check_point_no: cp.id, status: existing.status, remarks: existing.remarks }
//             : { check_point_no: cp.id, status: "NA" };
//         });

//         setFormData({ ...sheet, checkpoints: mergedCheckpoints });
//       }
//     } catch (err) {
//       console.error("Failed to fetch check sheet:", err);
//       setError("Failed to load form data.");
//     } finally {
//       setFormLoading(false);
//     }
//   }, [storedRecordId, apiBaseUrl]);

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (isFormMode && !isNewMode) {
//       fetchFormData();
//     } else if (!isFormMode && !isNewMode) {
//       fetchListData(1);
//     }
//   }, [isFormMode, isNewMode, fetchFormData, fetchListData]);

//   // ==================== HANDLERS ====================
//   const updateCheckpoint = (check_point_no: number, updates: Partial<CheckpointInput>) => {
//     if (isReadOnly) return;
//     setFormData(prev => ({
//       ...prev,
//       checkpoints: prev.checkpoints.map(cp =>
//         cp.check_point_no === check_point_no ? { ...cp, ...updates } : cp
//       ),
//     }));
//   };

//   const allCheckpointsFilled = formData.checkpoints.every(cp => cp.status !== "NA");

//   const showToast = (message: string, type: 'success' | 'error') => {
//     setToast({ message, type, visible: true });
//   };

//   const handleSave = async (shouldSubmit = false) => {
//     if (shouldSubmit && !allCheckpointsFilled) {
//       setError("All 16 checkpoints must be marked (OK/NG/NA) before submission");
//       return;
//     }

//     setError(null);
//     setSubmitting(true);

//     const payload = {
//       four_m_change: formData.four_m_change,
//       machine_no: formData.machine_no.trim(),
//       shift: formData.shift,
//       operator_signature: formData.operator_signature.trim(),
//       supervisor_signature: formData.supervisor_signature.trim(),
//       checkpoints: formData.checkpoints,
//     };

//     try {
//       let res;
//       if (formData.id) {
//         res = await axios.patch(`${apiBaseUrl}/machine-check-sheets/${formData.id}/`, payload);
//       } else {
//         res = await axios.post(`${apiBaseUrl}/machine-check-sheets/`, payload);
//       }

//       const saved = res.data;

//       if (shouldSubmit) {
//         const submitRes = await axios.post(`${apiBaseUrl}/machine-check-sheets/${saved.id}/submit/`);
//         const submittedData = submitRes.data;
        
//         setFormData(prev => ({ 
//           ...prev, 
//           is_submitted: true, 
//           overall_result: submittedData.overall_result 
//         }));
        
//         // Show success modal
//         setSubmittedResult(submittedData.overall_result);
//         setSubmittedRecordId(storedRecordId || saved.record_id || `MCS-${saved.id}`);
//         setShowSuccessModal(true);
//       } else {
//         setFormData(prev => ({ ...prev, id: saved.id }));
//         showToast("Progress saved as draft successfully!", 'success');
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.error || "Failed to save data.";
//       setError(errorMessage);
//       showToast(errorMessage, 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleAddNew = () => {
//     localStorage.removeItem("active_record_id");
//     localStorage.removeItem("active_four_m_id");
//     setIsNewMode(true);
//     setIsFormMode(true);
//     setFormData({
//       four_m_change: 0,
//       machine_no: "",
//       shift: "A",
//       operator_signature: "",
//       supervisor_signature: "",
//       checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
//       is_submitted: false,
//     });
//   };

//   const handleViewItem = (item: ListItem) => {
//     localStorage.setItem("active_record_id", item.record_id);
//     localStorage.setItem("active_four_m_id", String(item.four_m_change));
//     setIsFormMode(true);
//     setIsNewMode(false);
//     // Refetch form data
//     setTimeout(() => {
//       fetchFormData();
//     }, 100);
//   };

//   const handleBackToList = () => {
//     localStorage.removeItem("active_record_id");
//     localStorage.removeItem("active_four_m_id");
//     setIsFormMode(false);
//     setIsNewMode(false);
//     setFormData({
//       four_m_change: 0,
//       machine_no: "",
//       shift: "A",
//       operator_signature: "",
//       supervisor_signature: "",
//       checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
//       is_submitted: false,
//     });
//     fetchListData(1);
//   };

//   const handleBackToChangeRequest = () => {
//     setShowSuccessModal(false);
//     // Clear localStorage
//     localStorage.removeItem("active_record_id");
//     localStorage.removeItem("active_four_m_id");
//     // Call the onBack callback to return to cm module
//     if (onBack) {
//       onBack();
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchListData(newPage);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchListData(1);
//   };

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getShiftBadgeColor = (shift: string) => {
//     switch (shift) {
//       case 'A': return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'B': return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'C': return 'bg-orange-100 text-orange-700 border-orange-200';
//       default: return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   // ==================== RENDER LOADING ====================
//   if (formLoading || (listLoading && listData.length === 0)) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // ==================== RENDER LIST VIEW ====================
//   if (!isFormMode && !isNewMode) {
//     return (
//       <div className="p-4 sm:p-6">
//         {/* Toast */}
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           isVisible={toast.visible}
//           onClose={() => setToast(prev => ({ ...prev, visible: false }))}
//         />

//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               {onBack && (
//                 <button
//                   onClick={onBack}
//                   className="p-2 hover:bg-gray-100 rounded-xl transition-all"
//                   title="Back to Change Request"
//                 >
//                   <ArrowLeft className="w-6 h-6 text-gray-600" />
//                 </button>
//               )}
//               <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//                 <Settings className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Machine Check Sheets</h1>
//                 <p className="text-gray-500 text-sm mt-1">Manage and view all machine daily check sheets</p>
//               </div>
//             </div>
            
//             <div className="flex flex-wrap items-center gap-3">
//               {/* Search */}
//               <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search by machine, operator..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   />
//                 </div>
//               </form>

//               {/* View Toggle */}
//               <div className="flex items-center bg-gray-100 rounded-xl p-1">
//                 <button
//                   onClick={() => setViewMode('table')}
//                   className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   <List className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('card')}
//                   className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   <LayoutGrid className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Refresh */}
//               <button
//                 onClick={() => fetchListData(pagination.currentPage)}
//                 className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
//               >
//                 <RefreshCw className={`w-5 h-5 text-gray-600 ${listLoading ? 'animate-spin' : ''}`} />
//               </button>

//               {/* Add New Button */}
//               <button
//                 onClick={handleAddNew}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
//               >
//                 <Plus className="w-5 h-5" />
//                 <span className="hidden sm:inline">Add New</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
//             <XCircle className="w-5 h-5 flex-shrink-0" />
//             <span>{error}</span>
//             <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <FileText className="w-5 h-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">{pagination.count}</p>
//                 <p className="text-xs text-gray-500">Total Records</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <CheckCircle2 className="w-5 h-5 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {listData.filter(i => i.is_submitted).length}
//                 </p>
//                 <p className="text-xs text-gray-500">Submitted</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-amber-100 rounded-lg">
//                 <Clock className="w-5 h-5 text-amber-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {listData.filter(i => !i.is_submitted).length}
//                 </p>
//                 <p className="text-xs text-gray-500">Drafts</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <Check className="w-5 h-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {listData.filter(i => i.overall_result === 'PASS').length}
//                 </p>
//                 <p className="text-xs text-gray-500">Passed</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         {listData.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
//             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FileText className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">No Check Sheets Found</h3>
//             <p className="text-gray-500 mb-6">Get started by creating your first machine check sheet.</p>
//             <button
//               onClick={handleAddNew}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
//             >
//               <Plus className="w-5 h-5" />
//               Create First Check Sheet
//             </button>
//           </div>
//         ) : viewMode === 'table' ? (
//           /* Table View */
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-100">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Record ID</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Machine</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shift</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Operator</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Result</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {listData.map((item) => (
//                     <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
//                       <td className="px-6 py-4">
//                         <span className="font-mono text-sm font-semibold text-gray-800">{item.record_id}</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <Cpu className="w-4 h-4 text-gray-400" />
//                           <span className="font-medium text-gray-700">{item.machine_no || 'N/A'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getShiftBadgeColor(item.shift)}`}>
//                           Shift {item.shift}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">{item.operator_signature || 'N/A'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         {item.is_submitted ? (
//                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
//                             <Check className="w-3.5 h-3.5" />
//                             Submitted
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
//                             <Clock className="w-3.5 h-3.5" />
//                             Draft
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         {item.overall_result ? (
//                           <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
//                             item.overall_result === 'PASS' 
//                               ? 'bg-emerald-100 text-emerald-700' 
//                               : 'bg-red-100 text-red-700'
//                           }`}>
//                             {item.overall_result}
//                           </span>
//                         ) : (
//                           <span className="text-gray-400 text-sm">—</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2 text-gray-500 text-sm">
//                           <Calendar className="w-4 h-4" />
//                           {formatDate(item.created_at)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => handleViewItem(item)}
//                             className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
//                             title="View Details"
//                           >
//                             <Eye className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
//                           </button>
//                           {!item.is_submitted && (
//                             <button
//                               onClick={() => handleViewItem(item)}
//                               className="p-2 hover:bg-amber-100 rounded-lg transition-colors group"
//                               title="Edit"
//                             >
//                               <Edit className="w-4 h-4 text-gray-500 group-hover:text-amber-600" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           /* Card View */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {listData.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all group cursor-pointer"
//                 onClick={() => handleViewItem(item)}
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <span className="font-mono text-sm font-bold text-blue-600">{item.record_id}</span>
//                     <div className="flex items-center gap-2 mt-1">
//                       <Cpu className="w-4 h-4 text-gray-400" />
//                       <span className="font-semibold text-gray-800">{item.machine_no || 'N/A'}</span>
//                     </div>
//                   </div>
//                   <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getShiftBadgeColor(item.shift)}`}>
//                     Shift {item.shift}
//                   </span>
//                 </div>

//                 <div className="space-y-3 mb-4">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <User className="w-4 h-4 text-gray-400" />
//                     <span>{item.operator_signature || 'No operator'}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Calendar className="w-4 h-4 text-gray-400" />
//                     <span>{formatDate(item.created_at)}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <div className="flex items-center gap-2">
//                     {item.is_submitted ? (
//                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
//                         <Check className="w-3.5 h-3.5" />
//                         Submitted
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
//                         <Clock className="w-3.5 h-3.5" />
//                         Draft
//                       </span>
//                     )}
//                     {item.overall_result && (
//                       <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
//                         item.overall_result === 'PASS' 
//                           ? 'bg-emerald-100 text-emerald-700' 
//                           : 'bg-red-100 text-red-700'
//                       }`}>
//                         {item.overall_result}
//                       </span>
//                     )}
//                   </div>
//                   <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-blue-100 rounded-lg transition-all">
//                     <Eye className="w-4 h-4 text-blue-600" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-6">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-600">
//                 Showing page <span className="font-semibold">{pagination.currentPage}</span> of{' '}
//                 <span className="font-semibold">{pagination.totalPages}</span>
//                 {' '}({pagination.count} total records)
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(1)}
//                   disabled={pagination.currentPage === 1}
//                   className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                   <ChevronLeft className="w-4 h-4 -ml-2" />
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(pagination.currentPage - 1)}
//                   disabled={pagination.currentPage === 1}
//                   className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
                
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                     let pageNum : number;
//                     if (pagination.totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (pagination.currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (pagination.currentPage >= pagination.totalPages - 2) {
//                       pageNum = pagination.totalPages - 4 + i;
//                     } else {
//                       pageNum = pagination.currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         className={`w-10 h-10 rounded-lg font-semibold transition-all ${
//                           pagination.currentPage === pageNum
//                             ? 'bg-blue-600 text-white'
//                             : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={() => handlePageChange(pagination.currentPage + 1)}
//                   disabled={pagination.currentPage === pagination.totalPages}
//                   className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(pagination.totalPages)}
//                   disabled={pagination.currentPage === pagination.totalPages}
//                   className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                   <ChevronRight className="w-4 h-4 -ml-2" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ==================== RENDER FORM VIEW ====================
//   return (
//     <div className="p-4 sm:p-6">
//       {/* Success Modal */}
//       <SuccessModal
//         isOpen={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         onBackToChangeRequest={handleBackToChangeRequest}
//         result={submittedResult}
//         recordId={submittedRecordId}
//       />

//       {/* Toast */}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         isVisible={toast.visible}
//         onClose={() => setToast(prev => ({ ...prev, visible: false }))}
//       />

//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 mb-6 shadow-xl">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={handleBackToList}
//               className="p-2 hover:bg-white/10 rounded-xl transition-all"
//               title="Back to List"
//             >
//               <ArrowLeft className="w-6 h-6" />
//             </button>
//             <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
//               <Settings className="w-8 h-8" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
//                 Machine Daily Check Sheet
//               </h1>
//               <p className="text-blue-100/80 text-sm font-medium mt-1 uppercase tracking-widest">
//                 {storedRecordId ? `Record ID: ${storedRecordId}` : 'New Entry'}
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             {formData.is_submitted ? (
//               <span className="bg-green-500/20 border border-green-400 text-green-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
//                 <Check size={16} /> SUBMITTED
//               </span>
//             ) : (
//               <span className="bg-amber-500/20 border border-amber-400 text-amber-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
//                 <AlertCircle size={16} /> DRAFT MODE
//               </span>
//             )}
//             {formData.overall_result && (
//               <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${
//                 formData.overall_result === 'PASS' 
//                   ? 'bg-green-600 border-green-400' 
//                   : 'bg-red-600 border-red-400'
//               }`}>
//                 RESULT: {formData.overall_result}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl flex items-center gap-3">
//           <XCircle className="w-5 h-5 flex-shrink-0" />
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Basic Info Form */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//         <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//           <FileText className="w-5 h-5 text-blue-600" />
//           Basic Information
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//               Machine No.
//             </label>
//             <input
//               className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 font-medium transition-all"
//               value={formData.machine_no}
//               onChange={(e) => setFormData(prev => ({ ...prev, machine_no: e.target.value }))}
//               disabled={isReadOnly}
//               placeholder="Enter Machine ID"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//               Shift
//             </label>
//             <select
//               className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
//               value={formData.shift}
//               onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as 'A' | 'B' | 'C' }))}
//               disabled={isReadOnly}
//             >
//               <option value="A">Shift A</option>
//               <option value="B">Shift B</option>
//               <option value="C">Shift C</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//               Operator Name
//             </label>
//             <input
//               className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
//               value={formData.operator_signature}
//               onChange={(e) => setFormData(prev => ({ ...prev, operator_signature: e.target.value }))}
//               disabled={isReadOnly}
//               placeholder="Enter operator name"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
//               Supervisor Name
//             </label>
//             <input
//               className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
//               value={formData.supervisor_signature}
//               onChange={(e) => setFormData(prev => ({ ...prev, supervisor_signature: e.target.value }))}
//               disabled={isReadOnly}
//               placeholder="Enter supervisor name"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Checkpoints Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
//         <div className="p-6 border-b border-gray-100">
//           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <CheckCircle2 className="w-5 h-5 text-blue-600" />
//             Inspection Checkpoints
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Mark each checkpoint as OK, NG, or NA. Add remarks for NG items.
//           </p>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 <th className="px-6 py-4 text-left font-bold text-gray-500 w-16">#</th>
//                 <th className="px-6 py-4 text-left font-bold text-gray-500">Inspection Point</th>
//                 <th className="px-6 py-4 text-left font-bold text-gray-500 hidden lg:table-cell">Specification</th>
//                 <th className="px-6 py-4 text-center font-bold text-gray-500 w-48">Status</th>
//                 <th className="px-6 py-4 text-left font-bold text-gray-500 w-56">Remarks</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {CHECKPOINTS.map((cp) => {
//                 const entry = formData.checkpoints.find(c => c.check_point_no === cp.id)!;
//                 const isNG = entry.status === "NG";
//                 return (
//                   <tr key={cp.id} className="hover:bg-blue-50/30 transition-colors">
//                     <td className="px-6 py-5">
//                       <span className="w-8 h-8 inline-flex items-center justify-center bg-gray-100 rounded-lg font-bold text-gray-600">
//                         {cp.id}
//                       </span>
//                     </td>
//                     <td className="px-6 py-5 font-medium text-gray-800 whitespace-pre-line leading-relaxed">
//                       {cp.checkPoint}
//                     </td>
//                     <td className="px-6 py-5 text-gray-500 hidden lg:table-cell whitespace-pre-line text-sm">
//                       {cp.specification}
//                     </td>
//                     <td className="px-6 py-5">
//                       <div className="flex justify-center gap-2">
//                         {(['OK', 'NG', 'NA'] as const).map(status => (
//                           <button
//                             key={status}
//                             disabled={isReadOnly}
//                             onClick={() => updateCheckpoint(cp.id, { status })}
//                             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-105 disabled:hover:scale-100 ${
//                               entry.status === status
//                                 ? status === 'OK' 
//                                   ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
//                                   : status === 'NG' 
//                                   ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
//                                   : 'bg-gray-600 text-white shadow-lg shadow-gray-500/30'
//                                 : 'bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:hover:bg-gray-100'
//                             }`}
//                           >
//                             {status}
//                           </button>
//                         ))}
//                       </div>
//                     </td>
//                     <td className="px-6 py-5">
//                       <input
//                         className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                           isNG 
//                             ? 'border-red-300 bg-red-50 placeholder-red-400' 
//                             : 'border-gray-200 placeholder-gray-400'
//                         }`}
//                         placeholder={isNG ? "Explain NG issue..." : "Optional remarks"}
//                         value={entry.remarks || ""}
//                         onChange={(e) => updateCheckpoint(cp.id, { remarks: e.target.value })}
//                         disabled={isReadOnly || !isNG}
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Action Buttons (Inside Form) */}
//       {!isReadOnly && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-sm text-gray-600 w-full sm:w-auto">
//               <div className="flex items-center justify-between sm:block">
//                 <span>
//                   <span className="font-semibold">{formData.checkpoints.filter(cp => cp.status !== 'NA').length}</span>
//                   {' '}of <span className="font-semibold">16</span> checkpoints completed
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
//                 <div 
//                   className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
//                   style={{ width: `${(formData.checkpoints.filter(cp => cp.status !== 'NA').length / 16) * 100}%` }}
//                 />
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3 w-full sm:w-auto">
//               <button
//                 onClick={handleBackToList}
//                 className="flex-1 sm:flex-none px-5 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleSave(false)}
//                 disabled={submitting}
//                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-lg disabled:opacity-50"
//               >
//                 <Save size={18} />
//                 {submitting ? 'Saving...' : 'Save Draft'}
//               </button>
//               <button
//                 onClick={() => handleSave(true)}
//                 disabled={submitting || !allCheckpointsFilled}
//                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
//               >
//                 <Send size={18} />
//                 {submitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Read-only Summary */}
//       {isReadOnly && (
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-green-100 rounded-xl">
//                 <CheckCircle2 className="w-8 h-8 text-green-600" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-green-800">Check Sheet Submitted</h3>
//                 <p className="text-green-600 text-sm">
//                   Submitted on: {formatDate(formData.submitted_at || null)}
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 onClick={handleBackToList}
//                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
//               >
//                 <ArrowLeft size={18} />
//                 Back to List
//               </button>
//               {onBack && (
//                 <button
//                   onClick={onBack}
//                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
//                 >
//                   <ArrowRight size={18} />
//                   Change Request
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from 'react';
import {
  Check,
  AlertCircle,
  Save,
  Send,
  Settings,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Search,
  RefreshCw,
  ArrowLeft,
  Calendar,
  User,
  Cpu,
  Clock,
  CheckCircle2,
  FileText,
  X,
  PartyPopper,
  ArrowRight,
} from 'lucide-react';
import axios from 'axios';

// ==================== TYPES ====================
interface Checkpoint {
  id: number;
  checkPoint: string;
  specification: string;
  method: string;
}

interface CheckpointInput {
  check_point_no: number;
  status: 'OK' | 'NG' | 'NA';
  remarks?: string;
}

interface BackendCheckpoint {
  check_point_no: number;
  status: 'OK' | 'NG' | 'NA';
  remarks?: string;
}

interface CheckSheetData {
  id?: number;
  four_m_change: number;
  machine_no: string;
  shift: 'A' | 'B' | 'C';
  operator_signature: string;
  supervisor_signature: string;
  checkpoints: CheckpointInput[];
  overall_result?: 'PASS' | 'FAIL' | null;
  is_submitted: boolean;
  submitted_at?: string | null;
  record_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ListItem {
  id: number;
  record_id: string;
  machine_no: string;
  shift: 'A' | 'B' | 'C';
  operator_signature: string;
  supervisor_signature: string;
  overall_result: 'PASS' | 'FAIL' | null;
  is_submitted: boolean;
  submitted_at: string | null;
  created_at: string;
  four_m_change: number;
}

interface PaginationData {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListItem[];
}

// ==================== CONSTANTS ====================
const CHECKPOINTS: Checkpoint[] = [
  { id: 1, checkPoint: "Air Pressure\nहवा का दबाव", specification: "4 - 6 Kgf / cm²", method: "Pressure gauge में से Reading चेक करें" },
  { id: 2, checkPoint: "Machine lubrication\nमशीन लुब्रिकेशन", specification: "Lubrication pump should work\nलुब्रिकेशन पंप को काम करना चाहिए", method: "Panel पर लुब्रिकेशन पंप की शुरू करनी चाहिए" },
  { id: 3, checkPoint: "Red Bin", specification: "रोजाना के दौरान देखो (Daily)", method: "Scrap all rejected parts in red bin during set up" },
  { id: 4, checkPoint: "Machine overload Meter", specification: "Machine overload meter should work", method: "ओवरलोड मीटर को कैसे समझना चाहिए? 0 - 3 एम्पेयर" },
  { id: 5, checkPoint: "Die Locking Bolts", specification: "Die Locking Bolt Should Tight", method: "Die Lock Bolt को Allen Key से टाइट करें" },
  { id: 6, checkPoint: "Machine Short Feed\nमशीन शॉर्ट फीड Sensors", specification: "Short Feed Sensor should work", method: "SHORT FEED में सेटिंग रखनी चाहिए" },
  { id: 7, checkPoint: "Punch locking by grub screw", specification: "Punch lock by grub screw only\nसिर्फ ग्रब स्क्रू द्वारा पंच को टाइट करें", method: "Grub screw को allen key से टाइट करें" },
  { id: 8, checkPoint: "Finger condition", specification: "फिंगर कंडीशन को फिंगर टी से चेक करे", method: "नुकसान फिंगर Damage T Worn out नहीं होना चाहिए" },
  { id: 9, checkPoint: "No Play in Transfer cam shaft", specification: "No Play in Transfer cam shaft", method: "Transfer cam shaft को घुमाकर देखें" },
  { id: 10, checkPoint: "Link rod play to be check", specification: "Pin or Bearing के पिन खो नहीं होना चाहिए", method: "Link Rod अपने पीछे घूमने देखे" },
  { id: 11, checkPoint: "Trimming Plate To Be Check", specification: "Trimming की Item जरुरी समान होनी चाहिए", method: "Side gap को visually से जांच करें" },
  { id: 12, checkPoint: "Instrument Condition\nVernier / Micrometer / Dial", specification: "1. Zero Error\n2. Damage\n3. Calibration sticker", method: "Check Visually" },
  { id: 13, checkPoint: "Magnetic Separator", specification: "Magnetic Separator काम करना चाहिए", method: "Check Visually" },
  { id: 14, checkPoint: "3 Station Part In 4 Station Machine", specification: "यदि 3 Station का पार्ट, 4 Station Machine में सेट है", method: "Check Visually (यदि applicable नहीं है तो NA लिखें)" },
  { id: 15, checkPoint: "Coolant pipe", specification: "कूलिंग काम पाइप पर 3rd & 4th स्टेशन पर", method: "Check Visually" },
  { id: 16, checkPoint: "Operator Panel fan", specification: "पैनल फैन कंडीशन चेक करनी है", method: "Check Visually/ Sound" },
];

const ITEMS_PER_PAGE = 10;

// ==================== PROPS INTERFACE ====================
interface Props {
  apiBaseUrl?: string;
  onBack?: () => void;
}

// ==================== SUCCESS MODAL COMPONENT ====================
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToChangeRequest: () => void;
  result: 'PASS' | 'FAIL' | null;
  recordId: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onBackToChangeRequest,
  result,
  recordId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Success Header */}
        <div className={`p-8 text-center ${
          result === 'PASS' 
            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
            : result === 'FAIL'
            ? 'bg-gradient-to-br from-red-500 to-rose-600'
            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
        }`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-bounce">
            {result === 'PASS' ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : result === 'FAIL' ? (
              <XCircle className="w-10 h-10 text-white" />
            ) : (
              <PartyPopper className="w-10 h-10 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Successfully Submitted!
          </h2>
          <p className="text-white/80 text-sm">
            Machine Check Sheet has been saved
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Details */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Record ID</span>
              <span className="font-mono font-bold text-gray-800">{recordId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Result</span>
              <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                result === 'PASS'
                  ? 'bg-green-100 text-green-700'
                  : result === 'FAIL'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {result || 'Submitted'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onBackToChangeRequest}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 transform hover:scale-[1.02]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Change Request
            </button>
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Stay on this page
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

// ==================== TOAST COMPONENT ====================
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
        type === 'success' 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
export default function MachineCheckSheet({ 
  apiBaseUrl = "http://127.0.0.1:8000/api",
  onBack 
}: Props) {
  
  // Get record_id from localStorage (set by ChangeRequestDetail)
  const storedRecordId = localStorage.getItem("active_record_id") || "";
  const storedFourMId = Number(localStorage.getItem("active_four_m_id")) || 0;
  
  // Mode detection
  const [isFormMode, setIsFormMode] = useState(!!storedRecordId);
  const [isNewMode, setIsNewMode] = useState(false);

  // ==================== STATE ====================
  // List State
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [listData, setListData] = useState<ListItem[]>([]);
  const [pagination, setPagination] = useState({ count: 0, currentPage: 1, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [listLoading, setListLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CheckSheetData>({
    four_m_change: storedFourMId,
    machine_no: "",
    shift: "A",
    operator_signature: "",
    supervisor_signature: "",
    checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
    is_submitted: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal & Toast State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<'PASS' | 'FAIL' | null>(null);
  const [submittedRecordId, setSubmittedRecordId] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const isReadOnly = formData.is_submitted;

  // ==================== FETCH LIST DATA ====================
  const fetchListData = useCallback(async (page = 1) => {
    setListLoading(true);
    setError(null);
    try {
      const res = await axios.get<PaginationData>(
        `${apiBaseUrl}/machine-check-sheets/?page=${page}&page_size=${ITEMS_PER_PAGE}&search=${searchQuery}`
      );
      
      if (res.data.results) {
        setListData(res.data.results);
        setPagination({
          count: res.data.count,
          currentPage: page,
          totalPages: Math.ceil(res.data.count / ITEMS_PER_PAGE),
        });
      } else if (Array.isArray(res.data)) {
        setListData(res.data as unknown as ListItem[]);
        setPagination({
          count: (res.data as unknown as ListItem[]).length,
          currentPage: 1,
          totalPages: 1,
        });
      }
    } catch (err) {
      console.error("Failed to fetch list:", err);
      setError("Failed to load check sheets list.");
    } finally {
      setListLoading(false);
    }
  }, [apiBaseUrl, searchQuery]);

  // ==================== FETCH FORM DATA ====================
  const fetchFormData = useCallback(async () => {
    if (!storedRecordId) return;

    setFormLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiBaseUrl}/machine-check-sheets/?record_id=${storedRecordId}`);

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const sheet = res.data[0];
        const checkpointsMap = new Map<number, BackendCheckpoint>(
          sheet.checkpoints?.map((cp: BackendCheckpoint) => [cp.check_point_no, cp]) || []
        );

        const mergedCheckpoints: CheckpointInput[] = CHECKPOINTS.map(cp => {
          const existing = checkpointsMap.get(cp.id);
          return existing
            ? { check_point_no: cp.id, status: existing.status, remarks: existing.remarks }
            : { check_point_no: cp.id, status: "NA" };
        });

        setFormData({ ...sheet, checkpoints: mergedCheckpoints });
      }
    } catch (err) {
      console.error("Failed to fetch check sheet:", err);
      setError("Failed to load form data.");
    } finally {
      setFormLoading(false);
    }
  }, [storedRecordId, apiBaseUrl]);

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (isFormMode && !isNewMode) {
      fetchFormData();
    } else if (!isFormMode && !isNewMode) {
      fetchListData(1);
    }
  }, [isFormMode, isNewMode, fetchFormData, fetchListData]);

  // ==================== HANDLERS ====================
  const updateCheckpoint = (check_point_no: number, updates: Partial<CheckpointInput>) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      checkpoints: prev.checkpoints.map(cp =>
        cp.check_point_no === check_point_no ? { ...cp, ...updates } : cp
      ),
    }));
  };

  const allCheckpointsFilled = formData.checkpoints.every(cp => cp.status !== "NA");

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
  };

  const handleSave = async (shouldSubmit = false) => {
    if (shouldSubmit && !allCheckpointsFilled) {
      setError("All 16 checkpoints must be marked (OK/NG/NA) before submission");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = {
      four_m_change: formData.four_m_change,
      machine_no: formData.machine_no.trim(),
      shift: formData.shift,
      operator_signature: formData.operator_signature.trim(),
      supervisor_signature: formData.supervisor_signature.trim(),
      checkpoints: formData.checkpoints,
    };

    try {
      let res;
      if (formData.id) {
        res = await axios.patch(`${apiBaseUrl}/machine-check-sheets/${formData.id}/`, payload);
      } else {
        res = await axios.post(`${apiBaseUrl}/machine-check-sheets/`, payload);
      }

      const saved = res.data;

      if (shouldSubmit) {
        const submitRes = await axios.post(`${apiBaseUrl}/machine-check-sheets/${saved.id}/submit/`);
        const submittedData = submitRes.data;
        
        setFormData(prev => ({ 
          ...prev, 
          is_submitted: true, 
          overall_result: submittedData.overall_result 
        }));
        
        // Show success modal
        setSubmittedResult(submittedData.overall_result);
        setSubmittedRecordId(storedRecordId || saved.record_id || `MCS-${saved.id}`);
        setShowSuccessModal(true);
      } else {
        setFormData(prev => ({ ...prev, id: saved.id }));
        showToast("Progress saved as draft successfully!", 'success');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to save data.";
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNew = () => {
    localStorage.removeItem("active_record_id");
    localStorage.removeItem("active_four_m_id");
    setIsNewMode(true);
    setIsFormMode(true);
    setFormData({
      four_m_change: 0,
      machine_no: "",
      shift: "A",
      operator_signature: "",
      supervisor_signature: "",
      checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
      is_submitted: false,
    });
  };

  const handleViewItem = (item: ListItem) => {
    localStorage.setItem("active_record_id", item.record_id);
    localStorage.setItem("active_four_m_id", String(item.four_m_change));
    setIsFormMode(true);
    setIsNewMode(false);
    setTimeout(() => {
      fetchFormData();
    }, 100);
  };

  const handleBackToList = () => {
    localStorage.removeItem("active_record_id");
    localStorage.removeItem("active_four_m_id");
    setIsFormMode(false);
    setIsNewMode(false);
    setFormData({
      four_m_change: 0,
      machine_no: "",
      shift: "A",
      operator_signature: "",
      supervisor_signature: "",
      checkpoints: CHECKPOINTS.map(cp => ({ check_point_no: cp.id, status: "NA" })),
      is_submitted: false,
    });
    fetchListData(1);
  };

  // ==================== KEY FUNCTION: Back to ChangeRequestDetail ====================
  const handleBackToChangeRequest = () => {
    setShowSuccessModal(false);
    
    // CRITICAL: Set the return flag so ChangeManagementView opens the detail view
    // Use the stored record_id (the 4M change record, not the check sheet record)
    const fourMRecordId = localStorage.getItem("active_record_id");
    
    if (fourMRecordId) {
      // This flag tells ChangeManagementView to auto-open the detail for this record
      localStorage.setItem("return_to_detail_id", fourMRecordId);
      console.log("Setting return_to_detail_id:", fourMRecordId);
    }
    
    // Clear the active record context (machine check sheet specific)
    localStorage.removeItem("active_record_id");
    localStorage.removeItem("active_four_m_id");
    
    // Call the onBack callback to return to cm module
    if (onBack) {
      onBack();
    }
  };

  // Also update the simple back handler to use the same logic
  const handleSimpleBack = () => {
    // Set the return flag so ChangeManagementView opens the detail view
    const fourMRecordId = localStorage.getItem("active_record_id");
    
    if (fourMRecordId) {
      localStorage.setItem("return_to_detail_id", fourMRecordId);
    }
    
    // Clear context
    localStorage.removeItem("active_record_id");
    localStorage.removeItem("active_four_m_id");
    
    if (onBack) {
      onBack();
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchListData(newPage);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListData(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getShiftBadgeColor = (shift: string) => {
    switch (shift) {
      case 'A': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'B': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'C': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // ==================== RENDER LOADING ====================
  if (formLoading || (listLoading && listData.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // ==================== RENDER LIST VIEW ====================
  if (!isFormMode && !isNewMode) {
    return (
      <div className="p-4 sm:p-6">
        {/* Toast */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={handleSimpleBack}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                  title="Back to Change Request"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Machine Check Sheets</h1>
                <p className="text-gray-500 text-sm mt-1">Manage and view all machine daily check sheets</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by machine, operator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </form>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={() => fetchListData(pagination.currentPage)}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${listLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* Add New Button */}
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{pagination.count}</p>
                <p className="text-xs text-gray-500">Total Records</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {listData.filter(i => i.is_submitted).length}
                </p>
                <p className="text-xs text-gray-500">Submitted</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {listData.filter(i => !i.is_submitted).length}
                </p>
                <p className="text-xs text-gray-500">Drafts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {listData.filter(i => i.overall_result === 'PASS').length}
                </p>
                <p className="text-xs text-gray-500">Passed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {listData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Check Sheets Found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first machine check sheet.</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create First Check Sheet
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Record ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Machine</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shift</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Operator</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-800">{item.record_id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{item.machine_no || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getShiftBadgeColor(item.shift)}`}>
                          Shift {item.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{item.operator_signature || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.is_submitted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                            Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.overall_result ? (
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                            item.overall_result === 'PASS' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.overall_result}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewItem(item)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                          </button>
                          {!item.is_submitted && (
                            <button
                              onClick={() => handleViewItem(item)}
                              className="p-2 hover:bg-amber-100 rounded-lg transition-colors group"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-gray-500 group-hover:text-amber-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all group cursor-pointer"
                onClick={() => handleViewItem(item)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="font-mono text-sm font-bold text-blue-600">{item.record_id}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Cpu className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-800">{item.machine_no || 'N/A'}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getShiftBadgeColor(item.shift)}`}>
                    Shift {item.shift}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{item.operator_signature || 'No operator'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {item.is_submitted ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        Draft
                      </span>
                    )}
                    {item.overall_result && (
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                        item.overall_result === 'PASS' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.overall_result}
                      </span>
                    )}
                  </div>
                  <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-blue-100 rounded-lg transition-all">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing page <span className="font-semibold">{pagination.currentPage}</span> of{' '}
                <span className="font-semibold">{pagination.totalPages}</span>
                {' '}({pagination.count} total records)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <ChevronLeft className="w-4 h-4 -ml-2" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum :number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          pagination.currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4 -ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== RENDER FORM VIEW ====================
  return (
    <div className="p-4 sm:p-6">
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onBackToChangeRequest={handleBackToChangeRequest}
        result={submittedResult}
        recordId={submittedRecordId}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSimpleBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
              title="Back to Change Request"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Machine Daily Check Sheet
              </h1>
              <p className="text-blue-100/80 text-sm font-medium mt-1 uppercase tracking-widest">
                {storedRecordId ? `Record ID: ${storedRecordId}` : 'New Entry'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {formData.is_submitted ? (
              <span className="bg-green-500/20 border border-green-400 text-green-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check size={16} /> SUBMITTED
              </span>
            ) : (
              <span className="bg-amber-500/20 border border-amber-400 text-amber-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} /> DRAFT MODE
              </span>
            )}
            {formData.overall_result && (
              <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                formData.overall_result === 'PASS' 
                  ? 'bg-green-600 border-green-400' 
                  : 'bg-red-600 border-red-400'
              }`}>
                RESULT: {formData.overall_result}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl flex items-center gap-3">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Basic Info Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Machine No.
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 font-medium transition-all"
              value={formData.machine_no}
              onChange={(e) => setFormData(prev => ({ ...prev, machine_no: e.target.value }))}
              disabled={isReadOnly}
              placeholder="Enter Machine ID"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Shift
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
              value={formData.shift}
              onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as 'A' | 'B' | 'C' }))}
              disabled={isReadOnly}
            >
              <option value="A">Shift A</option>
              <option value="B">Shift B</option>
              <option value="C">Shift C</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Operator Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
              value={formData.operator_signature}
              onChange={(e) => setFormData(prev => ({ ...prev, operator_signature: e.target.value }))}
              disabled={isReadOnly}
              placeholder="Enter operator name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Supervisor Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 font-medium transition-all"
              value={formData.supervisor_signature}
              onChange={(e) => setFormData(prev => ({ ...prev, supervisor_signature: e.target.value }))}
              disabled={isReadOnly}
              placeholder="Enter supervisor name"
            />
          </div>
        </div>
      </div>

      {/* Checkpoints Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Inspection Checkpoints
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Mark each checkpoint as OK, NG, or NA. Add remarks for NG items.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-500 w-16">#</th>
                <th className="px-6 py-4 text-left font-bold text-gray-500">Inspection Point</th>
                <th className="px-6 py-4 text-left font-bold text-gray-500 hidden lg:table-cell">Specification</th>
                <th className="px-6 py-4 text-center font-bold text-gray-500 w-48">Status</th>
                <th className="px-6 py-4 text-left font-bold text-gray-500 w-56">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CHECKPOINTS.map((cp) => {
                const entry = formData.checkpoints.find(c => c.check_point_no === cp.id)!;
                const isNG = entry.status === "NG";
                return (
                  <tr key={cp.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <span className="w-8 h-8 inline-flex items-center justify-center bg-gray-100 rounded-lg font-bold text-gray-600">
                        {cp.id}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                      {cp.checkPoint}
                    </td>
                    <td className="px-6 py-5 text-gray-500 hidden lg:table-cell whitespace-pre-line text-sm">
                      {cp.specification}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        {(['OK', 'NG', 'NA'] as const).map(status => (
                          <button
                            key={status}
                            disabled={isReadOnly}
                            onClick={() => updateCheckpoint(cp.id, { status })}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-105 disabled:hover:scale-100 ${
                              entry.status === status
                                ? status === 'OK' 
                                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                                  : status === 'NG' 
                                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                                  : 'bg-gray-600 text-white shadow-lg shadow-gray-500/30'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:hover:bg-gray-100'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <input
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          isNG 
                            ? 'border-red-300 bg-red-50 placeholder-red-400' 
                            : 'border-gray-200 placeholder-gray-400'
                        }`}
                        placeholder={isNG ? "Explain NG issue..." : "Optional remarks"}
                        value={entry.remarks || ""}
                        onChange={(e) => updateCheckpoint(cp.id, { remarks: e.target.value })}
                        disabled={isReadOnly || !isNG}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons (Inside Form) */}
      {!isReadOnly && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:block">
                <span>
                  <span className="font-semibold">{formData.checkpoints.filter(cp => cp.status !== 'NA').length}</span>
                  {' '}of <span className="font-semibold">16</span> checkpoints completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(formData.checkpoints.filter(cp => cp.status !== 'NA').length / 16) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleSimpleBack}
                className="flex-1 sm:flex-none px-5 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={submitting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-lg disabled:opacity-50"
              >
                <Save size={18} />
                {submitting ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={submitting || !allCheckpointsFilled}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Send size={18} />
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Read-only Summary */}
      {isReadOnly && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">Check Sheet Submitted</h3>
                <p className="text-green-600 text-sm">
                  Submitted on: {formatDate(formData.submitted_at || null)}
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleBackToList}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
              >
                <ArrowLeft size={18} />
                Back to List
              </button>
              {onBack && (
                <button
                  onClick={handleSimpleBack}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <ArrowRight size={18} />
                  Change Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}