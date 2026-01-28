// import React, { useState, useEffect, useRef } from "react";
// import SuccessModal from '../Common/SuccessModal';

// type TrackingStatus = "noplan" | "nochange" | "change";


// interface PageProps {
//   setSelectedModule: (id: string) => void;
// }

// interface FourMChangeRecord {
//   id: number;
//   record_id: string;
//   date: string;
//   time: string;
//   four_m: string;
//   shift: string;
//   category_details?: {
//     category_type: string;
//     description: string;
//   };
//   action_details?: {
//     action_taken: string;
//     set_up_approval: boolean;
//     retroactive_inspection: boolean;
//     suspected_lot_check: boolean;
//     containment_action: boolean;
//     remarks: string;
//   };
//   shopfloor_name?: string;
//   line_name?: string;
//   station_name?: string;
// }

// interface TrackingCell {
//   day: number;
//   statusA: TrackingStatus;
//   statusB: TrackingStatus;
//   hasChangeA: boolean;
//   hasChangeB: boolean;
// }

// interface ChangeDetailRow {
//   id?: number;
//   record_id: string;
//   date: string;
//   shift: string;
//   time: string;
//   model: string;
//   station: string;
//   line: string;
//   nature_of_change: string;
//   category_type: string;
//   change_description: string;
//   informed_maintenance: boolean;
//   informed_quality: boolean;
//   informed_production: boolean;
//   informed_others: boolean;
//   customer_approval_required: boolean;
//   action_taken: string;
//   applicability_retro: boolean;
//   applicability_setup: boolean;
//   applicability_containment: boolean;
//   setup_total_qty: string;
//   setup_ok_qty: string;
//   setup_ng_qty: string;
//   retrocheck_total_qty: string;
//   retrocheck_ok_qty: string;
//   retrocheck_ng_qty: string;
//   containmentcheck_total_qty: string;
//   containmentcheck_ok_qty: string;
//   containmentcheck_ng_qty: string;
//   traceability: string;
//   action_taken_on_ng_parts: string;
//   production_approval: string;
//   quality_approval: string;
// }

// const categories = [
//   { id: 1, name: "MAN" },
//   { id: 2, name: "MACHINE" },
//   { id: 3, name: "MATERIAL" },
//   { id: 4, name: "METHOD" }
// ];

// const dayColumns = Array.from({ length: 31 }, (_, i) => i + 1);

// const fourMToCategoryMap: { [key: string]: string } = {
//   'Man': 'MAN',
//   'Machine/Tool': 'MACHINE',
//   'Material': 'MATERIAL',
//   'Method': 'METHOD'
// };

// const TruncatedTextCell: React.FC<{ text: string; maxWidth?: string }> = ({ text, maxWidth }) => {
//   return (
//     <div 
//       className="w-full text-left overflow-hidden" 
//       style={{ maxWidth: maxWidth || '100%', height: '40px', lineHeight: '20px' }}
//       title={text}
//     >
//       <div className="line-clamp-2">
//         {text || '-'}
//       </div>
//     </div>
//   );
// };

// // export default function FourMChangeTrackingSheet() {
// const FourMChangeTrackingSheet: React.FC<PageProps> = ({ setSelectedModule }) => {
//   const detailsTableRef = useRef<HTMLDivElement>(null);
//   const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
//   const [tooltip, setTooltip] = useState<{
//     x: number;
//     y: number;
//     content: React.ReactNode;
//   } | null>(null);

//   const [month, setMonth] = useState<string>(() => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
//   });

//   const [filterId, setFilterId] = useState<string>(''); // NEW

//   const [fourMChanges, setFourMChanges] = useState<FourMChangeRecord[]>([]);
//   const [trackingMatrix, setTrackingMatrix] = useState<TrackingCell[][]>([]);
//   const [changeDetailRows, setChangeDetailRows] = useState<ChangeDetailRow[]>([]);
//   const [allChangeDetailRows, setAllChangeDetailRows] = useState<ChangeDetailRow[]>([]);
  
//   const [filterDate, setFilterDate] = useState('');
//   const [filterShift, setFilterShift] = useState('');
//   const [filterShopfloor, setFilterShopfloor] = useState('');
//   const [filterLine, setFilterLine] = useState('');
//   const [filterStation, setFilterStation] = useState('');
  
//   const [shopfloors, setShopfloors] = useState<any[]>([]);
//   const [lines, setLines] = useState<any[]>([]);
//   const [stations, setStations] = useState<any[]>([]);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   // NEW EFFECT: Catch ID from Detail Page
//   useEffect(() => {
//     const passedId = localStorage.getItem("filter_change_request_id");
//     if (passedId) {
//       console.log("Auto-filtering for Record ID:", passedId);
//       setFilterId(passedId);
//       localStorage.removeItem("filter_change_request_id");
      
//       // Auto-scroll to details table
//       setTimeout(() => {
//         detailsTableRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 500);
//     }
//   }, []);

//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/shopfloors/')
//       .then(res => res.json())
//       .then(data => setShopfloors(data))
//       .catch(err => console.error('Error fetching shopfloors:', err));
//   }, []);

//   useEffect(() => {
//     Promise.all([
//       fetch('http://127.0.0.1:8000/api/4m-changes/').then(res => res.json()),
//       fetch('http://127.0.0.1:8000/api/change-details/').then(res => res.json())
//     ])
//       .then(([changesData, detailsData]) => {
//         setFourMChanges(changesData);
//         processTrackingMatrix(changesData, month);
//         processChangeDetails(changesData, detailsData, month);
//       })
//       .catch(err => console.error('Error fetching data:', err));
//   }, [month]);

//   useEffect(() => {
//     if (filterShopfloor) {
//       fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${filterShopfloor}`)
//         .then(res => res.json())
//         .then(data => setLines(data))
//         .catch(err => console.error('Error fetching lines:', err));
//     } else {
//       setLines([]);
//       setFilterLine('');
//     }
//   }, [filterShopfloor]);

//   useEffect(() => {
//     if (filterLine) {
//       fetch(`http://127.0.0.1:8000/api/stations/?line=${filterLine}`)
//         .then(res => res.json())
//         .then(data => setStations(data))
//         .catch(err => console.error('Error fetching stations:', err));
//     } else {
//       setStations([]);
//       setFilterStation('');
//     }
//   }, [filterLine]);

//   useEffect(() => {
//     let filtered = [...allChangeDetailRows];

//     // --- NEW: Filter by specific ID first ---
//     if (filterId) {
//       filtered = filtered.filter(row => row.record_id.toLowerCase().includes(filterId.toLowerCase()));
//     }

//     if (filterDate) {
//       filtered = filtered.filter(row => row.date === filterDate);
//     }

//     if (filterShift) {
//       filtered = filtered.filter(row => row.shift === filterShift);
//     }

//     if (filterShopfloor || filterLine || filterStation) {
//       filtered = filtered.filter(row => {
//         const originalChange = fourMChanges.find(
//           change => change.record_id === row.record_id
//         );
//         if (!originalChange) return true;
        
//         const getSFName = (id: string) => shopfloors.find(s => s.id === parseInt(id))?.name;
//         const getLineName = (id: string) => lines.find(l => l.id === parseInt(id))?.name;
//         const getStationName = (id: string) => stations.find(s => s.id === parseInt(id))?.name;

//         if (filterShopfloor && originalChange.shopfloor_name !== getSFName(filterShopfloor)) {
//           return false;
//         }
//         if (filterLine && originalChange.line_name !== getLineName(filterLine)) {
//           return false;
//         }
//         if (filterStation && originalChange.station_name !== getStationName(filterStation)) {
//           return false;
//         }
//         return true;
//       });
//     }

//     setChangeDetailRows(filtered);
//   }, [
//     filterId,
//     filterDate, filterShift, filterShopfloor, filterLine, filterStation, allChangeDetailRows, fourMChanges, shopfloors, lines, stations
//   ]);

//   const clearFilters = () => {
//     setFilterDate('');
//     setFilterShift('');
//     setFilterShopfloor('');
//     setFilterLine('');
//     setFilterStation('');
//   };

//   const processTrackingMatrix = (changes: FourMChangeRecord[], selectedMonth: string) => {
//     const matrix: TrackingCell[][] = [];
//     const today = new Date();
//     const currentDay = today.getDate();
//     const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

//     categories.forEach((category) => {
//       const categoryRow: TrackingCell[] = [];

//       const categoryChanges = changes.filter(change => {
//         if (!change.date) return false;
//         const changeDate = new Date(change.date);
//         const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
//         const mappedCategory = fourMToCategoryMap[change.four_m] || change.four_m.toUpperCase();
//         return changeDateStr === selectedMonth && mappedCategory === category.name;
//       });

//       dayColumns.forEach(day => {
//         const dayChangesA = categoryChanges.filter(c => new Date(c.date).getDate() === day && c.shift === 'A');
//         const dayChangesB = categoryChanges.filter(c => new Date(c.date).getDate() === day && c.shift === 'B');

//         let statusA: TrackingStatus = "noplan";
//         let statusB: TrackingStatus = "noplan";
//         let hasChangeA = false;
//         let hasChangeB = false;

//         if (dayChangesA.length > 0) {
//           statusA = "change";
//           hasChangeA = true;
//         } else {
//           if (selectedMonth === currentMonth) {
//             statusA = day <= currentDay ? "nochange" : "noplan";
//           } else if (selectedMonth < currentMonth) {
//             statusA = "nochange";
//           } else {
//             statusA = "noplan";
//           }
//         }

//         if (dayChangesB.length > 0) {
//           statusB = "change";
//           hasChangeB = true;
//         } else {
//           if (selectedMonth === currentMonth) {
//             statusB = day <= currentDay ? "nochange" : "noplan";
//           } else if (selectedMonth < currentMonth) {
//             statusB = "nochange";
//           } else {
//             statusB = "noplan";
//           }
//         }

//         categoryRow.push({ day, statusA, statusB, hasChangeA, hasChangeB });
//       });

//       matrix.push(categoryRow);
//     });

//     setTrackingMatrix(matrix);
//   };

//   const processChangeDetails = (changes: FourMChangeRecord[], savedDetails: any[], selectedMonth: string) => {
//     const filteredChanges = changes.filter(change => {
//       if (!change.date) return false;
//       const changeDate = new Date(change.date);
//       const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
//       return changeDateStr === selectedMonth;
//     });

//     const savedDetailsMap = new Map();
//     savedDetails.forEach(detail => {
//       const key = `${detail.record_id}_${detail.date}_${detail.time}_${detail.shift || 'A'}`;
//       savedDetailsMap.set(key, detail);
//     });

//     const detailRows: ChangeDetailRow[] = filteredChanges.map(change => {
//       const key = `${change.record_id}_${change.date}_${change.time}_${change.shift || 'A'}`;
//       const savedDetail = savedDetailsMap.get(key);

//       if (savedDetail) {
//         return {
//           id: savedDetail.id,
//           record_id: savedDetail.record_id || change.record_id || '',
//           date: savedDetail.date || change.date || '',
//           shift: savedDetail.shift || change.shift || 'A',
//           time: savedDetail.time || change.time || '',
//           model: savedDetail.model || '',
//           station: savedDetail.station || change.station_name || '',
//           line: savedDetail.line || change.line_name || '',
//           nature_of_change: savedDetail.nature_of_change || change.four_m || '',
//           category_type: savedDetail.category_type || change.category_details?.category_type || '',
//           change_description: savedDetail.change_description || change.category_details?.description || '',
//           informed_maintenance: savedDetail.informed_maintenance || false,
//           informed_quality: savedDetail.informed_quality || false,
//           informed_production: savedDetail.informed_production || false,
//           informed_others: savedDetail.informed_others || false,
//           customer_approval_required: savedDetail.customer_approval_required || false,
//           action_taken: savedDetail.action_taken || change.action_details?.action_taken || '',
//           applicability_retro: savedDetail.applicability_retro || false,
//           applicability_setup: savedDetail.applicability_setup || false,
//           applicability_containment: savedDetail.applicability_containment || false,
//           setup_total_qty: savedDetail.setup_total_qty || '',
//           setup_ok_qty: savedDetail.setup_ok_qty || '',
//           setup_ng_qty: savedDetail.setup_ng_qty || '',
//           retrocheck_total_qty: savedDetail.retrocheck_total_qty || '',
//           retrocheck_ok_qty: savedDetail.retrocheck_ok_qty || '',
//           retrocheck_ng_qty: savedDetail.retrocheck_ng_qty || '',
//           containmentcheck_total_qty: savedDetail.containmentcheck_total_qty || '',
//           containmentcheck_ok_qty: savedDetail.containmentcheck_ok_qty || '',
//           containmentcheck_ng_qty: savedDetail.containmentcheck_ng_qty || '',
//           traceability: savedDetail.traceability || '',
//           action_taken_on_ng_parts: savedDetail.action_taken_on_ng_parts || '',
//           production_approval: savedDetail.production_approval || '',
//           quality_approval: savedDetail.quality_approval || '',
//         };
//       } else {
//         return {
//           record_id: change.record_id || '',
//           date: change.date || '',
//           shift: change.shift || 'A',
//           time: change.time || '',
//           model: '',
//           station: change.station_name || '',
//           line: change.line_name || '',
//           nature_of_change: change.four_m || '',
//           category_type: change.category_details?.category_type || '',
//           change_description: change.category_details?.description || '',
//           informed_maintenance: false,
//           informed_quality: false,
//           informed_production: false,
//           informed_others: false,
//           customer_approval_required: false,
//           action_taken: change.action_details?.action_taken || '',
//           applicability_retro: change.action_details?.retroactive_inspection || false,
//           applicability_setup: change.action_details?.set_up_approval || false,
//           applicability_containment: change.action_details?.containment_action || false,
//           setup_total_qty: '',
//           setup_ok_qty: '',
//           setup_ng_qty: '',
//           retrocheck_total_qty: '',
//           retrocheck_ok_qty: '',
//           retrocheck_ng_qty: '',
//           containmentcheck_total_qty: '',
//           containmentcheck_ok_qty: '',
//           containmentcheck_ng_qty: '',
//           traceability: '',
//           action_taken_on_ng_parts: '',
//           production_approval: '',
//           quality_approval: '',
//         };
//       }
//     });

//     setChangeDetailRows(detailRows);
//     setAllChangeDetailRows(detailRows);
//   };

//   const handleDetailInput = (
//     rowIdx: number,
//     field: keyof ChangeDetailRow,
//     value: string | boolean
//   ) => {
//     const newDetails = [...changeDetailRows];
//     newDetails[rowIdx] = { ...newDetails[rowIdx], [field]: value };
//     setChangeDetailRows(newDetails);
//   };

//   const submitChangeDetails = async () => {
//     setMessage(null);
//     let successCount = 0;
//     let errorCount = 0;

//     for (let i = 0; i < changeDetailRows.length; i++) {
//       const row = changeDetailRows[i];
//       if (row.date && row.time) {
//         try {
//           if (row.id) {
//             await fetch(`http://127.0.0.1:8000/api/change-details/${row.id}/`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(row),
//             });
//           } else {
//             const res = await fetch('http://127.0.0.1:8000/api/change-details/', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(row),
//             });
//             const data = await res.json();
//             changeDetailRows[i].id = data.id;
//           }
//           successCount++;
//         } catch (err: any) {
//           console.error(`Error submitting data for record ${row.record_id}:`, err);
//           errorCount++;
//         }
//       }
//     }
//     setChangeDetailRows([...changeDetailRows]);

//     if (errorCount > 0) {
//       setMessage({ text: `Submission completed with ${errorCount} errors...`, type: 'error' });
//     } else if (successCount > 0) {
//       setShowSuccessModal(true);
//     } else {
//        // No changes made or no rows to submit
//        setMessage({ text: "No changes to submit.", type: 'error' });
//        setTimeout(() => setMessage(null), 3000);
//     }
//     // if (errorCount === 0) {
//     //     // CHECK FOR RETURN FLAG
//     //     const returnId = localStorage.getItem("return_to_detail_id");
        
//     //     // If we are filtering by the specific ID that we need to return to
//     //     if (returnId && filterId === returnId) {
//     //          setTimeout(() => {
//     //              // Navigate back to Main View (which will auto-open the detail)
//     //              setSelectedModule("cm"); 
//     //          }, 1000); // Small delay so user sees "Success" message first
//     //     }
//     // }
    
//     // if (errorCount > 0) {
//     //   setMessage({ text: `Submission completed with ${errorCount} errors. Check console for details.`, type: 'error' });
//     // } else {
//     //   setMessage({ text: "Change details submitted successfully!", type: 'success' });
//     // }
//     // setTimeout(() => setMessage(null), 5000);
//   };

//   const handleReturn = () => {
//       setShowSuccessModal(false);
//       const returnId = localStorage.getItem("return_to_detail_id");
//       if (returnId && filterId === returnId) {
//           setSelectedModule("cm");
//       }
//       // If not returning, just stay on page (modal closed)
//   };

//   const getStatusBg = (status: TrackingStatus) =>
//     status === "nochange"
//       ? "bg-green-500"
//       : status === "change"
//         ? "bg-red-500"
//         : "bg-blue-100";

//   const getChangesForCell = (categoryName: string, day: number, shift: string): FourMChangeRecord[] => {
//     const [year, monthStr] = month.split('-');
//     const dateString = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;

//     return fourMChanges.filter(change => {
//       const changeDate = change.date.split('T')[0] || change.date;
//       if (changeDate !== dateString) return false;

//       const changeCategory = fourMToCategoryMap[change.four_m] || change.four_m.toUpperCase();
//       return categoryName === changeCategory && change.shift === shift;
//     });
//   };
  
//   const handleMouseEnter = (
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>,
//     categoryName: string,
//     day: number,
//     shift: string
//   ) => {
//     const changes = getChangesForCell(categoryName, day, shift);
//     if (changes.length === 0) return;

//     const content = (
//       <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-xl text-xs max-w-xs ring-2 ring-red-200">
//         <h4 className="font-bold text-sm mb-1 text-red-600">
//           {categoryName} Changes - Shift {shift} on {month.split('-')[1]}/{day}
//         </h4>
//         <ul className="list-disc list-inside space-y-1">
//           {changes.slice(0, 3).map((change, index) => (
//             <li key={index} className="text-gray-700">
//               <span className="font-medium">{change.four_m}</span> at {change.time}: "{change.category_details?.description.substring(0, 30) || 'N/A'}..."
//             </li>
//           ))}
//         </ul>
//         {changes.length > 3 && <p className="text-gray-500 mt-1 italic">...{changes.length - 3} more changes</p>}
//         <p className="text-red-500 mt-2 font-semibold text-center">Click the red dot to drill down to details ↓</p>
//       </div>
//     );

//     setTooltip({
//       x: e.clientX + 10,
//       y: e.clientY + 10,
//       content,
//     });
//   };

//   const handleMouseLeave = () => {
//     setTooltip(null);
//   };
  
//   const handleClickCell = (day: number, shift: string) => {
//     const [year, monthStr] = month.split('-');
//     const dateString = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;

//     setFilterDate(dateString);
//     setFilterShift(shift);
//     setFilterShopfloor(''); 
//     setFilterLine('');
//     setFilterStation('');

//     setTimeout(() => {
//       detailsTableRef.current?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }, 100); 
//     setTooltip(null);
//   };

//   const CheckboxCell = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
//     <div className="flex items-center justify-center h-full">
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//       />
//     </div>
//   );

//   return (
//     <div className="max-w-full min-h-screen p-6 relative">

//       {/* ✅ ADD THIS MODAL BLOCK */}
//       <SuccessModal 
//         isOpen={showSuccessModal}
//         onClose={handleReturn}
//         title="Tracking Sheet Saved"
//         message={
//           <span>
//             The 4M Change Tracking Sheet details have been successfully updated.
//             {filterId && <span> Returning to main view...</span>}
//           </span>
//         }
//       />
//       <div className="max-w-full">
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-xl mb-6">
//           <div className="p-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-xl md:text-3xl font-bold">4M CHANGE RECORDING SHEET</h1>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {message && (
//           <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl transition-opacity duration-300 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
//             <p className="font-semibold">{message.text}</p>
//           </div>
//         )}

//         {filterId && (
//           <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center justify-between">
//               <span className="text-blue-800 font-medium text-sm">
//                   Filtering Details for Record: <strong>{filterId}</strong>
//               </span>
//               <button 
//                   onClick={() => setFilterId('')}
//                   className="text-xs bg-white text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
//               >
//                   Clear Filter
//               </button>
//           </div>
//         )}

//         <div className="overflow-x-auto rounded-lg shadow-inner bg-white mb-8">
//           <table className="w-full border-collapse text-xs md:text-sm">
//             <thead className="sticky top-0 z-10 bg-indigo-50">
//               <tr className="text-center">
//                 <th className="border border-gray-300 p-2 w-10" rowSpan={3}>No.</th>
//                 <th className="border border-gray-300 p-2 w-28" rowSpan={3}>Category</th>
//                 <th className="border border-gray-300 p-2 w-16" rowSpan={3}>Shift</th>
//                 <th colSpan={31} className="border border-gray-300 p-2">
//                   <span className="font-semibold">Month:</span>
//                   <input
//                     type="month"
//                     value={month}
//                     onChange={e => setMonth(e.target.value)}
//                     className="ml-2 border border-indigo-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-300 transition"
//                   />
//                 </th>
//                 <th className="border border-gray-300 p-2 w-40" rowSpan={3}>Remarks</th>
//               </tr>
//               <tr className="text-center h-8">
//                 {dayColumns.map(day => (
//                   <th key={day} className="border border-gray-300 p-0 w-6 font-normal text-xs">{day}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((category, catIndex) => (
//                 <React.Fragment key={category.id}>
//                   <tr className="text-center h-10 hover:bg-indigo-50 transition">
//                     <td className="border border-gray-200 font-semibold" rowSpan={2}>{category.id}</td>
//                     <td className="border border-gray-200 font-medium" rowSpan={2}>{category.name}</td>
//                     <td className="border border-gray-200 bg-yellow-50 font-medium">A</td>
//                     {trackingMatrix[catIndex] &&
//                       trackingMatrix[catIndex].map((cell, dayIndex) => (
//                         <td key={`${dayIndex}-A`} className="border border-gray-200 p-0">
//                           <div
//                             className={`w-5 h-5 rounded-full border-2 mx-auto transition-all duration-150
//                               ${getStatusBg(cell.statusA)}
//                               ${cell.statusA === "change" ? "border-red-400 cursor-pointer" : cell.statusA === "nochange" ? "border-green-400" : "border-blue-200"}`}
//                             onClick={cell.hasChangeA ? () => handleClickCell(cell.day, 'A') : undefined}
//                             onMouseEnter={cell.hasChangeA ? (e) => handleMouseEnter(e, category.name, cell.day, 'A') : undefined}
//                             onMouseLeave={cell.hasChangeA ? handleMouseLeave : undefined}
//                           ></div>
//                         </td>
//                       ))}
//                     <td className="border border-gray-200 text-left pl-2" rowSpan={2}>
//                       {catIndex === 0 && (<div className="font-medium text-gray-700">Legends:</div>)}
//                       {catIndex === 1 && (<div className="flex items-center gap-2 text-xs md:text-sm">
//                           <span className="inline-block w-4 h-4 rounded-full border border-green-600 bg-green-500"></span>
//                           <span className="text-gray-600">No Change</span>
//                       </div>)}
//                       {catIndex === 2 && (<div className="flex items-center gap-2 text-xs md:text-sm">
//                           <span className="inline-block w-4 h-4 rounded-full border border-red-600 bg-red-500"></span>
//                           <span className="text-gray-600">Change (Click)</span>
//                       </div>)}
//                       {catIndex === 3 && (<div className="flex items-center gap-2 text-xs md:text-sm">
//                           <span className="inline-block w-4 h-4 rounded-full border border-blue-400 bg-blue-100"></span>
//                           <span className="text-gray-600">No Plan</span>
//                       </div>)}
//                     </td>
//                   </tr>
//                   <tr className="text-center h-10 hover:bg-indigo-50 transition">
//                     <td className="border border-gray-200 bg-indigo-50 font-medium">B</td>
//                     {trackingMatrix[catIndex] &&
//                       trackingMatrix[catIndex].map((cell, dayIndex) => (
//                         <td key={`${dayIndex}-B`} className="border border-gray-200 p-0">
//                           <div
//                             className={`w-5 h-5 rounded-full border-2 mx-auto transition-all duration-150
//                               ${getStatusBg(cell.statusB)}
//                               ${cell.statusB === "change" ? "border-red-400 cursor-pointer" : cell.statusB === "nochange" ? "border-green-400" : "border-blue-200"}`}
//                             onClick={cell.hasChangeB ? () => handleClickCell(cell.day, 'B') : undefined}
//                             onMouseEnter={cell.hasChangeB ? (e) => handleMouseEnter(e, category.name, cell.day, 'B') : undefined}
//                             onMouseLeave={cell.hasChangeB ? handleMouseLeave : undefined}
//                           ></div>
//                         </td>
//                       ))}
//                   </tr>
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-10 mb-2" ref={detailsTableRef}>
//           <div className="w-full text-center font-bold text-lg p-2 border-t-2 border-b-2 border-indigo-300 bg-indigo-50 rounded-t-lg">
//             4M CHANGE RECORDING SHEET - DETAILS
//           </div>
          
//           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
//             <div className="flex flex-wrap items-end gap-4">
//               <div className="flex-1 min-w-[150px]">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Filter by Date
//                 </label>
//                 <input
//                   type="date"
//                   value={filterDate}
//                   onChange={e => setFilterDate(e.target.value)}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
//                 />
//               </div>
              
//               <div className="flex-1 min-w-[150px]">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Filter by Shift
//                 </label>
//                 <select
//                   value={filterShift}
//                   onChange={e => setFilterShift(e.target.value)}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
//                 >
//                   <option value="">All Shifts</option>
//                   <option value="A">Shift A</option>
//                   <option value="B">Shift B</option>
//                 </select>
//               </div>
//               <div className="flex-1 min-w-[150px]">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Filter by Shopfloor
//                 </label>
//                 <select
//                   value={filterShopfloor}
//                   onChange={e => setFilterShopfloor(e.target.value)}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
//                 >
//                   <option value="">All Shopfloors</option>
//                   {shopfloors.map(sf => (
//                     <option key={sf.id} value={sf.id}>{sf.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex-1 min-w-[150px]">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Filter by Line
//                 </label>
//                 <select
//                   value={filterLine}
//                   onChange={e => setFilterLine(e.target.value)}
//                   disabled={!filterShopfloor}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
//                 >
//                   <option value="">All Lines</option>
//                   {lines.map(line => (
//                     <option key={line.id} value={line.id}>{line.name}</option>
//                   ))}
//                 </select>
//               </div>
              
//               <div className="flex-1 min-w-[150px]">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Filter by Station
//                 </label>
//                 <select
//                   value={filterStation}
//                   onChange={e => setFilterStation(e.target.value)}
//                   disabled={!filterLine}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
//                 >
//                   <option value="">All Stations</option>
//                   {stations.map(station => (
//                     <option key={station.id} value={station.id}>{station.name}</option>
//                   ))}
//                 </select>
//               </div>
              
//               <div className="flex gap-2">
//                 <button
//                   onClick={clearFilters}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             </div>
            
//             <div className="mt-3 text-sm text-gray-600">
//               Showing {changeDetailRows.length} of {allChangeDetailRows.length} records
//             </div>
//           </div>

//           <div className="flex justify-end mb-3">
//             <button
//               className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 font-semibold transition"
//               onClick={submitChangeDetails}
//             >
//               Submit Change Details
//             </button>
//           </div>
          
//           <div className="overflow-x-auto rounded-lg shadow-inner bg-white border border-gray-200">
//             <table className="border-collapse text-xs w-full" style={{ minWidth: '3500px' }}>
//               <thead className="bg-indigo-50 sticky top-0 z-10">
//                 <tr className="text-center border border-gray-300">
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Record ID</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[90px]" rowSpan={3}>Date</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={3}>Shift</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[70px]" rowSpan={3}>Time</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Model</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Station</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[100px]" rowSpan={3}>Line</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[120px]" colSpan={2}>Nature of Change</th>
//                   <th className="border border-gray-300 p-2 w-[200px]" rowSpan={3}>Change Details</th>
//                   <th className="border border-gray-300 p-2" colSpan={5}>Informed To</th>
//                   <th className="border border-gray-300 p-2 w-[180px]" rowSpan={3}>Action Taken</th>
//                   <th className="border border-gray-300 p-2" colSpan={3}>Applicability</th>
//                   <th className="border border-gray-300 p-2" colSpan={3}>Setup</th>
//                   <th className="border border-gray-300 p-2" colSpan={3}>Retro Check<br/>(Before Change)</th>
//                   <th className="border border-gray-300 p-2" colSpan={3}>Containment Check<br/>(After Change)</th>
//                   <th className="border border-gray-300 p-2 w-[150px]" rowSpan={3}>Traceability<br/>(PSN No./Date & Time)</th>
//                   <th className="border border-gray-300 p-2 w-[150px]" rowSpan={3}>Action Taken on<br/>NG Parts</th>
//                   <th className="border border-gray-300 p-2 w-[120px]" rowSpan={3}>Production<br/>Approval</th>
//                   <th className="border border-gray-300 p-2 w-[120px]" rowSpan={3}>Quality<br/>Approval</th>
//                 </tr>
//                 <tr className="text-center border border-gray-300">
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Man/Machine/<br/>Material/Method</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Planned/<br/>Unplanned/<br/>Abnormality</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Maint.</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Quality</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Production</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Others</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Customer<br/>Approval<br/>Required</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Retro</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Set Up</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[80px]" rowSpan={2}>Containment</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Total<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>OK<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>NG<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Total<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>OK<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>NG<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>Total<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>OK<br/>Qty</th>
//                   <th className="border border-gray-300 p-2 whitespace-nowrap w-[60px]" rowSpan={2}>NG<br/>Qty</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {changeDetailRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={35} className="text-center text-gray-500 py-4">
//                       No change details available for the selected filters
//                     </td>
//                   </tr>
//                 ) : (
//                   changeDetailRows.map((row, rowIdx) => (
//                     <tr key={rowIdx} className="hover:bg-indigo-50 transition">
                      
//                       {/* Record ID */}
//                       <td className="border border-gray-200 p-2 align-top">
//                         <div className="whitespace-pre-wrap break-words max-w-[100px] text-center mx-auto">
//                           {row.record_id}
//                         </div>
//                       </td>
                      
//                       {/* Date */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="date"
//                             value={row.date}
//                             onChange={e => handleDetailInput(rowIdx, 'date', e.target.value)}
//                             className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Shift */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <select
//                             value={row.shift}
//                             onChange={e => handleDetailInput(rowIdx, 'shift', e.target.value)}
//                             className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           >
//                             <option value="A">A</option>
//                             <option value="B">B</option>
//                           </select>
//                         </div>
//                       </td>
                      
//                       {/* Time */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="time"
//                             value={row.time}
//                             onChange={e => handleDetailInput(rowIdx, 'time', e.target.value)}
//                             className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Model */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="text"
//                             value={row.model}
//                             onChange={e => handleDetailInput(rowIdx, 'model', e.target.value)}
//                             className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Station */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="text"
//                             value={row.station}
//                             onChange={e => handleDetailInput(rowIdx, 'station', e.target.value)}
//                             className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Line */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="text"
//                             value={row.line}
//                             onChange={e => handleDetailInput(rowIdx, 'line', e.target.value)}
//                             className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Nature of Change - Man/Machine/Material/Method */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <select
//                             value={row.nature_of_change}
//                             onChange={e => handleDetailInput(rowIdx, 'nature_of_change', e.target.value)}
//                             className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           >
//                             <option value="">Select</option>
//                             <option value="Man">Man</option>
//                             <option value="Machine/Tool">Machine</option>
//                             <option value="Material">Material</option>
//                             <option value="Method">Method</option>
//                           </select>
//                         </div>
//                       </td>
                      
//                       {/* Category Type - Planned/Unplanned/Abnormal */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <select
//                             value={row.category_type}
//                             onChange={e => handleDetailInput(rowIdx, 'category_type', e.target.value)}
//                             className="w-full p-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           >
//                             <option value="">Select</option>
//                             <option value="Planned">Planned</option>
//                             <option value="Unplanned">Unplanned</option>
//                             <option value="Abnormal">Abnormal</option>
//                           </select>
//                         </div>
//                       </td>
                      
//                       {/* Change Description */}
//                       <td className="border border-gray-200 p-2 align-top">
//                         <textarea
//                           value={row.change_description}
//                           onChange={e => handleDetailInput(rowIdx, 'change_description', e.target.value)}
//                           className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition resize-none text-xs"
//                           rows={2}
//                         />
//                       </td>
                      
//                       {/* Informed To - Maintenance */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.informed_maintenance} 
//                           onChange={() => handleDetailInput(rowIdx, 'informed_maintenance', !row.informed_maintenance)} 
//                         />
//                       </td>
                      
//                       {/* Informed To - Quality */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.informed_quality} 
//                           onChange={() => handleDetailInput(rowIdx, 'informed_quality', !row.informed_quality)} 
//                         />
//                       </td>
                      
//                       {/* Informed To - Production */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.informed_production} 
//                           onChange={() => handleDetailInput(rowIdx, 'informed_production', !row.informed_production)} 
//                         />
//                       </td>
                      
//                       {/* Informed To - Others */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.informed_others} 
//                           onChange={() => handleDetailInput(rowIdx, 'informed_others', !row.informed_others)} 
//                         />
//                       </td>
                      
//                       {/* Customer Approval Required */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.customer_approval_required} 
//                           onChange={() => handleDetailInput(rowIdx, 'customer_approval_required', !row.customer_approval_required)} 
//                         />
//                       </td>
                      
//                       {/* Action Taken */}
//                       <td className="border border-gray-200 p-2 align-top">
//                         <textarea
//                           value={row.action_taken}
//                           onChange={e => handleDetailInput(rowIdx, 'action_taken', e.target.value)}
//                           className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition resize-none text-xs"
//                           rows={2}
//                         />
//                       </td>
                      
//                       {/* Applicability - Retro */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.applicability_retro} 
//                           onChange={() => handleDetailInput(rowIdx, 'applicability_retro', !row.applicability_retro)} 
//                         />
//                       </td>
                      
//                       {/* Applicability - Setup */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.applicability_setup} 
//                           onChange={() => handleDetailInput(rowIdx, 'applicability_setup', !row.applicability_setup)} 
//                         />
//                       </td>
                      
//                       {/* Applicability - Containment */}
//                       <td className="border border-gray-200 p-1">
//                         <CheckboxCell 
//                           checked={row.applicability_containment} 
//                           onChange={() => handleDetailInput(rowIdx, 'applicability_containment', !row.applicability_containment)} 
//                         />
//                       </td>
                      
//                       {/* Setup - Total Qty, OK Qty, NG Qty */}
//                       {(['setup_total_qty', 'setup_ok_qty', 'setup_ng_qty'] as const).map(field => (
//                         <td key={field} className="border border-gray-200 p-1">
//                           <div className="flex items-center justify-center h-full">
//                             <input
//                               type="text"
//                               value={row[field]}
//                               onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
//                               className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                             />
//                           </div>
//                         </td>
//                       ))}
                      
//                       {/* Retro Check - Total Qty, OK Qty, NG Qty */}
//                       {(['retrocheck_total_qty', 'retrocheck_ok_qty', 'retrocheck_ng_qty'] as const).map(field => (
//                         <td key={field} className="border border-gray-200 p-1">
//                           <div className="flex items-center justify-center h-full">
//                             <input
//                               type="text"
//                               value={row[field]}
//                               onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
//                               className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                             />
//                           </div>
//                         </td>
//                       ))}
                      
//                       {/* Containment Check - Total Qty, OK Qty, NG Qty */}
//                       {(['containmentcheck_total_qty', 'containmentcheck_ok_qty', 'containmentcheck_ng_qty'] as const).map(field => (
//                         <td key={field} className="border border-gray-200 p-1">
//                           <div className="flex items-center justify-center h-full">
//                             <input
//                               type="text"
//                               value={row[field]}
//                               onChange={e => handleDetailInput(rowIdx, field, e.target.value)}
//                               className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                             />
//                           </div>
//                         </td>
//                       ))}
                      
//                       {/* Traceability */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="text"
//                             value={row.traceability}
//                             onChange={e => handleDetailInput(rowIdx, 'traceability', e.target.value)}
//                             className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Action Taken on NG Parts */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="text"
//                             value={row.action_taken_on_ng_parts}
//                             onChange={e => handleDetailInput(rowIdx, 'action_taken_on_ng_parts', e.target.value)}
//                             className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Production Approval */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="text"
//                             value={row.production_approval}
//                             onChange={e => handleDetailInput(rowIdx, 'production_approval', e.target.value)}
//                             className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
                      
//                       {/* Quality Approval */}
//                       <td className="border border-gray-200 p-1">
//                         <div className="flex items-center justify-center h-full">
//                           <input
//                             type="text"
//                             value={row.quality_approval}
//                             onChange={e => handleDetailInput(rowIdx, 'quality_approval', e.target.value)}
//                             className="w-full px-1 py-0.5 rounded border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition text-xs"
//                           />
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
      
//       {tooltip && (
//         <div
//           className="fixed z-50 transition-opacity duration-150"
//           style={{
//             top: tooltip.y,
//             left: tooltip.x,
//           }}
//         >
//           {tooltip.content}
//         </div>
//       )}
//     </div>
//   );
// }
// export default FourMChangeTrackingSheet;









import React, { useState, useEffect, useRef } from "react";
import SuccessModal from '../Common/SuccessModal';

// Icons (you can use any icon library like heroicons, lucide-react, etc.)
const Icons = {
  Man: () => <span className="text-2xl">👤</span>,
  Machine: () => <span className="text-2xl">⚙️</span>,
  Material: () => <span className="text-2xl">📦</span>,
  Method: () => <span className="text-2xl">📋</span>,
  Filter: () => <span>🔍</span>,
  Grid: () => <span>▦</span>,
  List: () => <span>☰</span>,
  Card: () => <span>▢</span>,
  ChevronDown: () => <span>▼</span>,
  ChevronUp: () => <span>▲</span>,
  Close: () => <span>✕</span>,
  Edit: () => <span>✏️</span>,
  Save: () => <span>💾</span>,
  Back: () => <span>←</span>,
};

type TrackingStatus = "noplan" | "nochange" | "change";
type ViewMode = "table" | "card" | "grid";

interface PageProps {
  setSelectedModule: (id: string) => void;
  
}

interface FourMChangeRecord {
  id: number;
  record_id: string;
  date: string;
  time: string;
  four_m: string;
  shift: string;
  category_details?: {
    category_type: string;
    description: string;
  };
  action_details?: {
    action_taken: string;
    set_up_approval: boolean;
    retroactive_inspection: boolean;
    suspected_lot_check: boolean;
    containment_action: boolean;
    remarks: string;
  };
  shopfloor_name?: string;
  line_name?: string;
  station_name?: string;
}

interface TrackingCell {
  day: number;
  statusA: TrackingStatus;
  statusB: TrackingStatus;
  hasChangeA: boolean;
  hasChangeB: boolean;
}

interface ChangeDetailRow {
  id?: number;
  record_id: string;
  date: string;
  shift: string;
  time: string;
  model: string;
  station: string;
  line: string;
  nature_of_change: string;
  category_type: string;
  change_description: string;
  informed_maintenance: boolean;
  informed_quality: boolean;
  informed_production: boolean;
  informed_others: boolean;
  customer_approval_required: boolean;
  action_taken: string;
  applicability_retro: boolean;
  applicability_setup: boolean;
  applicability_containment: boolean;
  setup_total_qty: string;
  setup_ok_qty: string;
  setup_ng_qty: string;
  retrocheck_total_qty: string;
  retrocheck_ok_qty: string;
  retrocheck_ng_qty: string;
  containmentcheck_total_qty: string;
  containmentcheck_ok_qty: string;
  containmentcheck_ng_qty: string;
  traceability: string;
  action_taken_on_ng_parts: string;
  production_approval: string;
  quality_approval: string;
}

const categories = [
  { id: 1, name: "MAN", icon: "👤", color: "blue" },
  { id: 2, name: "MACHINE", icon: "⚙️", color: "orange" },
  { id: 3, name: "MATERIAL", icon: "📦", color: "green" },
  { id: 4, name: "METHOD", icon: "📋", color: "purple" }
];

const dayColumns = Array.from({ length: 31 }, (_, i) => i + 1);

const fourMToCategoryMap: { [key: string]: string } = {
  'Man': 'MAN',
  'Machine/Tool': 'MACHINE',
  'Material': 'MATERIAL',
  'Method': 'METHOD'
};

// ============ REUSABLE COMPONENTS ============

// Summary Card Component
const SummaryCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <div className={`bg-white rounded-xl shadow-lg border-l-4 ${color} p-4 hover:shadow-xl transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
}> = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, onItemsPerPageChange }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-2">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>Show</span>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-300"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
      <span>entries</span>
      <span className="ml-4 text-gray-500">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </span>
    </div>
    
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        // ✅ Solution: Add type annotation
        let pageNum: number;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === pageNum
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Last
      </button>
    </div>
  </div>
);

// Change Detail Card Component (for card view)
const ChangeDetailCard: React.FC<{
  row: ChangeDetailRow;
  onEdit: () => void;
}> = ({ row, onEdit }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 flex justify-between items-center">
      <span className="text-white font-semibold text-sm">{row.record_id}</span>
      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
        Shift {row.shift}
      </span>
    </div>
    
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">Date & Time</p>
          <p className="font-medium text-gray-800">{row.date} at {row.time}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          row.category_type === 'Planned' ? 'bg-green-100 text-green-700' :
          row.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.category_type || 'Unknown'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-gray-500">Nature of Change</p>
          <p className="font-medium text-gray-800 text-sm">{row.nature_of_change || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Station</p>
          <p className="font-medium text-gray-800 text-sm">{row.station || '-'}</p>
        </div>
      </div>
      
      <div>
        <p className="text-xs text-gray-500">Description</p>
        <p className="text-sm text-gray-700 line-clamp-2">{row.change_description || '-'}</p>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {row.informed_maintenance && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Maintenance</span>}
        {row.informed_quality && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Quality</span>}
        {row.informed_production && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Production</span>}
      </div>
      
      <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
        <div className="flex gap-4 text-xs text-gray-500">
          {row.applicability_retro && <span>✓ Retro</span>}
          {row.applicability_setup && <span>✓ Setup</span>}
          {row.applicability_containment && <span>✓ Containment</span>}
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          <Icons.Edit /> Edit
        </button>
      </div>
    </div>
  </div>
);

// Quick Entry Form Component (shown when coming from ChangeRequestDetails)
const QuickEntryForm: React.FC<{
  row: ChangeDetailRow;
  onChange: (field: keyof ChangeDetailRow, value: string | boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}> = ({ row, onChange, onSubmit, onBack, isSubmitting }) => {
  const [activeSection, setActiveSection] = useState<string>('basic');

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'change', label: 'Change Details', icon: '🔄' },
    { id: 'informed', label: 'Notifications', icon: '📢' },
    { id: 'action', label: 'Actions', icon: '⚡' },
    { id: 'quality', label: 'Quality Check', icon: '✅' },
    { id: 'approval', label: 'Approvals', icon: '👍' },
  ];

  return (
    <div className=" mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-3 text-white/80 hover:text-white mb-2 transition"
            >
              <Icons.Back /> Back to Change Request
            </button>
            <h1 className="text-2xl font-bold">Update Change Record</h1>
            <p className="text-white/80 mt-1">Record ID: {row.record_id}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Date</p>
            <p className="text-xl font-semibold">{row.date}</p>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 overflow-x-auto">
        <div className="flex gap-10">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeSection === section.id
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-b-2xl shadow-xl p-6">
        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              📋 Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => onChange('date', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => onChange('time', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                <select
                  value={row.shift}
                  onChange={(e) => onChange('shift', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                >
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  type="text"
                  value={row.model}
                  onChange={(e) => onChange('model', e.target.value)}
                  placeholder="Enter model"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Station</label>
                <input
                  type="text"
                  value={row.station}
                  onChange={(e) => onChange('station', e.target.value)}
                  placeholder="Enter station"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Line</label>
                <input
                  type="text"
                  value={row.line}
                  onChange={(e) => onChange('line', e.target.value)}
                  placeholder="Enter line"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Change Details Section */}
        {activeSection === 'change' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              🔄 Change Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nature of Change</label>
                <select
                  value={row.nature_of_change}
                  onChange={(e) => onChange('nature_of_change', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                >
                  <option value="">Select Type</option>
                  <option value="Man">👤 Man</option>
                  <option value="Machine/Tool">⚙️ Machine/Tool</option>
                  <option value="Material">📦 Material</option>
                  <option value="Method">📋 Method</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
                <select
                  value={row.category_type}
                  onChange={(e) => onChange('category_type', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                >
                  <option value="">Select Category</option>
                  <option value="Planned">✅ Planned</option>
                  <option value="Unplanned">⚠️ Unplanned</option>
                  <option value="Abnormal">🚨 Abnormal</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Description</label>
              <textarea
                value={row.change_description}
                onChange={(e) => onChange('change_description', e.target.value)}
                placeholder="Describe the change in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'informed' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              📢 Notifications
            </h3>
            <p className="text-gray-600 text-sm">Select all departments that have been informed about this change:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { field: 'informed_maintenance', label: 'Maintenance', icon: '🔧', color: 'blue' },
                { field: 'informed_quality', label: 'Quality', icon: '✅', color: 'green' },
                { field: 'informed_production', label: 'Production', icon: '🏭', color: 'orange' },
                { field: 'informed_others', label: 'Others', icon: '👥', color: 'purple' },
                { field: 'customer_approval_required', label: 'Customer Approval Required', icon: '👤', color: 'red' },
              ].map((item) => (
                <label
                  key={item.field}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    row[item.field as keyof ChangeDetailRow]
                      ? `border-${item.color}-500 bg-${item.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={row[item.field as keyof ChangeDetailRow] as boolean}
                    onChange={() => onChange(item.field as keyof ChangeDetailRow, !row[item.field as keyof ChangeDetailRow])}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Actions Section */}
        {activeSection === 'action' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              ⚡ Actions & Applicability
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Taken</label>
              <textarea
                value={row.action_taken}
                onChange={(e) => onChange('action_taken', e.target.value)}
                placeholder="Describe actions taken..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Applicability</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { field: 'applicability_retro', label: 'Retroactive Inspection' },
                  { field: 'applicability_setup', label: 'Setup Approval' },
                  { field: 'applicability_containment', label: 'Containment Action' },
                ].map((item) => (
                  <label
                    key={item.field}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
                      row[item.field as keyof ChangeDetailRow]
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={row[item.field as keyof ChangeDetailRow] as boolean}
                      onChange={() => onChange(item.field as keyof ChangeDetailRow, !row[item.field as keyof ChangeDetailRow])}
                      className="sr-only"
                    />
                    <span>{row[item.field as keyof ChangeDetailRow] ? '✓' : '○'}</span>
                    <span className="font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quality Check Section */}
        {activeSection === 'quality' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              ✅ Quality Check Details
            </h3>
            
            {/* Setup Check */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-3">Setup Check</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-blue-700 mb-1">Total Qty</label>
                  <input
                    type="text"
                    value={row.setup_total_qty}
                    onChange={(e) => onChange('setup_total_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-700 mb-1">OK Qty</label>
                  <input
                    type="text"
                    value={row.setup_ok_qty}
                    onChange={(e) => onChange('setup_ok_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-700 mb-1">NG Qty</label>
                  <input
                    type="text"
                    value={row.setup_ng_qty}
                    onChange={(e) => onChange('setup_ng_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>

            {/* Retro Check */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-medium text-green-800 mb-3">Retro Check (Before Change)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-green-700 mb-1">Total Qty</label>
                  <input
                    type="text"
                    value={row.retrocheck_total_qty}
                    onChange={(e) => onChange('retrocheck_total_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-green-700 mb-1">OK Qty</label>
                  <input
                    type="text"
                    value={row.retrocheck_ok_qty}
                    onChange={(e) => onChange('retrocheck_ok_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-green-700 mb-1">NG Qty</label>
                  <input
                    type="text"
                    value={row.retrocheck_ng_qty}
                    onChange={(e) => onChange('retrocheck_ng_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-300"
                  />
                </div>
              </div>
            </div>

            {/* Containment Check */}
            <div className="bg-orange-50 rounded-xl p-4">
              <h4 className="font-medium text-orange-800 mb-3">Containment Check (After Change)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-orange-700 mb-1">Total Qty</label>
                  <input
                    type="text"
                    value={row.containmentcheck_total_qty}
                    onChange={(e) => onChange('containmentcheck_total_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-orange-700 mb-1">OK Qty</label>
                  <input
                    type="text"
                    value={row.containmentcheck_ok_qty}
                    onChange={(e) => onChange('containmentcheck_ok_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-orange-700 mb-1">NG Qty</label>
                  <input
                    type="text"
                    value={row.containmentcheck_ng_qty}
                    onChange={(e) => onChange('containmentcheck_ng_qty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approvals Section */}
        {activeSection === 'approval' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              👍 Traceability & Approvals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traceability (PSN No./Date & Time)
                </label>
                <input
                  type="text"
                  value={row.traceability}
                  onChange={(e) => onChange('traceability', e.target.value)}
                  placeholder="Enter traceability info"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Taken on NG Parts
                </label>
                <input
                  type="text"
                  value={row.action_taken_on_ng_parts}
                  onChange={(e) => onChange('action_taken_on_ng_parts', e.target.value)}
                  placeholder="Enter action taken"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Approval
                </label>
                <input
                  type="text"
                  value={row.production_approval}
                  onChange={(e) => onChange('production_approval', e.target.value)}
                  placeholder="Enter approval status/name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Approval
                </label>
                <input
                  type="text"
                  value={row.quality_approval}
                  onChange={(e) => onChange('quality_approval', e.target.value)}
                  placeholder="Enter approval status/name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation & Submit */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              const currentIndex = sections.findIndex(s => s.id === activeSection);
              if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1].id);
              }
            }}
            disabled={activeSection === sections[0].id}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <div className="flex gap-3">
            {activeSection !== sections[sections.length - 1].id ? (
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                  }
                }}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium transition"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : '💾 Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  row: ChangeDetailRow | null;
  onChange: (field: keyof ChangeDetailRow, value: string | boolean) => void;
  onSave: () => void;
}> = ({ isOpen, onClose, row, onChange, onSave }) => {
  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Edit Change Record: {row.record_id}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <Icons.Close />
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
            {/* Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => onChange('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => onChange('time', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select
                  value={row.shift}
                  onChange={(e) => onChange('shift', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={row.model}
                  onChange={(e) => onChange('model', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            {/* Change Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Description</label>
              <textarea
                value={row.change_description}
                onChange={(e) => onChange('change_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Action Taken */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Taken</label>
              <textarea
                value={row.action_taken}
                onChange={(e) => onChange('action_taken', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={row.informed_maintenance}
                  onChange={() => onChange('informed_maintenance', !row.informed_maintenance)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm">Maintenance</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={row.informed_quality}
                  onChange={() => onChange('informed_quality', !row.informed_quality)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm">Quality</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={row.informed_production}
                  onChange={() => onChange('informed_production', !row.informed_production)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm">Production</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={row.customer_approval_required}
                  onChange={() => onChange('customer_approval_required', !row.customer_approval_required)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm">Customer Approval</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const FourMChangeTrackingSheet: React.FC<PageProps> = ({ setSelectedModule }) => {
  const detailsTableRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isFromDetailPage, setIsFromDetailPage] = useState(false);
  const [specificRecordId, setSpecificRecordId] = useState<string>('');
  
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);

  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [filterId, setFilterId] = useState<string>('');
  const [fourMChanges, setFourMChanges] = useState<FourMChangeRecord[]>([]);
  const [trackingMatrix, setTrackingMatrix] = useState<TrackingCell[][]>([]);
  const [changeDetailRows, setChangeDetailRows] = useState<ChangeDetailRow[]>([]);
  const [allChangeDetailRows, setAllChangeDetailRows] = useState<ChangeDetailRow[]>([]);
  
  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterShopfloor, setFilterShopfloor] = useState('');
  const [filterLine, setFilterLine] = useState('');
  const [filterStation, setFilterStation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ChangeDetailRow | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number>(-1);
  
  // Data
  const [shopfloors, setShopfloors] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if coming from Detail Page
  useEffect(() => {
    const passedId = localStorage.getItem("filter_change_request_id");
    if (passedId) {
      console.log("Coming from Detail Page for Record ID:", passedId);
      setIsFromDetailPage(true);
      setSpecificRecordId(passedId);
      setFilterId(passedId);
      localStorage.removeItem("filter_change_request_id");
    }
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/shopfloors/')
      .then(res => res.json())
      .then(data => setShopfloors(data))
      .catch(err => console.error('Error fetching shopfloors:', err));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/4m-changes/').then(res => res.json()),
      fetch('http://127.0.0.1:8000/api/change-details/').then(res => res.json())
    ])
      .then(([changesData, detailsData]) => {
        setFourMChanges(changesData);
        processTrackingMatrix(changesData, month);
        processChangeDetails(changesData, detailsData, month);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, [month]);

  useEffect(() => {
    if (filterShopfloor) {
      fetch(`http://127.0.0.1:8000/api/lines/?shopfloor=${filterShopfloor}`)
        .then(res => res.json())
        .then(data => setLines(data))
        .catch(err => console.error('Error fetching lines:', err));
    } else {
      setLines([]);
      setFilterLine('');
    }
  }, [filterShopfloor]);

  useEffect(() => {
    if (filterLine) {
      fetch(`http://127.0.0.1:8000/api/stations/?line=${filterLine}`)
        .then(res => res.json())
        .then(data => setStations(data))
        .catch(err => console.error('Error fetching stations:', err));
    } else {
      setStations([]);
      setFilterStation('');
    }
  }, [filterLine]);

  // Filter logic
  useEffect(() => {
    let filtered = [...allChangeDetailRows];

    if (filterId) {
      filtered = filtered.filter(row => row.record_id.toLowerCase().includes(filterId.toLowerCase()));
    }
    if (filterDate) {
      filtered = filtered.filter(row => row.date === filterDate);
    }
    if (filterShift) {
      filtered = filtered.filter(row => row.shift === filterShift);
    }

    setChangeDetailRows(filtered);
    setCurrentPage(1);
  }, [filterId, filterDate, filterShift, filterShopfloor, filterLine, filterStation, allChangeDetailRows, fourMChanges, shopfloors, lines, stations]);

  const clearFilters = () => {
    setFilterId('');
    setFilterDate('');
    setFilterShift('');
    setFilterShopfloor('');
    setFilterLine('');
    setFilterStation('');
  };

  const processTrackingMatrix = (changes: FourMChangeRecord[], selectedMonth: string) => {
    const matrix: TrackingCell[][] = [];
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    categories.forEach((category) => {
      const categoryRow: TrackingCell[] = [];

      const categoryChanges = changes.filter(change => {
        if (!change.date) return false;
        const changeDate = new Date(change.date);
        const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
        const mappedCategory = fourMToCategoryMap[change.four_m] || change.four_m.toUpperCase();
        return changeDateStr === selectedMonth && mappedCategory === category.name;
      });

      dayColumns.forEach(day => {
        const dayChangesA = categoryChanges.filter(c => new Date(c.date).getDate() === day && c.shift === 'A');
        const dayChangesB = categoryChanges.filter(c => new Date(c.date).getDate() === day && c.shift === 'B');

        let statusA: TrackingStatus = "noplan";
        let statusB: TrackingStatus = "noplan";
        let hasChangeA = dayChangesA.length > 0;
        let hasChangeB = dayChangesB.length > 0;

        if (hasChangeA) statusA = "change";
        else if (selectedMonth === currentMonth) statusA = day <= currentDay ? "nochange" : "noplan";
        else if (selectedMonth < currentMonth) statusA = "nochange";

        if (hasChangeB) statusB = "change";
        else if (selectedMonth === currentMonth) statusB = day <= currentDay ? "nochange" : "noplan";
        else if (selectedMonth < currentMonth) statusB = "nochange";

        categoryRow.push({ day, statusA, statusB, hasChangeA, hasChangeB });
      });

      matrix.push(categoryRow);
    });

    setTrackingMatrix(matrix);
  };

  const processChangeDetails = (changes: FourMChangeRecord[], savedDetails: any[], selectedMonth: string) => {
    const filteredChanges = changes.filter(change => {
      if (!change.date) return false;
      const changeDate = new Date(change.date);
      const changeDateStr = `${changeDate.getFullYear()}-${String(changeDate.getMonth() + 1).padStart(2, "0")}`;
      return changeDateStr === selectedMonth;
    });

    const savedDetailsMap = new Map();
    savedDetails.forEach(detail => {
      const key = `${detail.record_id}_${detail.date}_${detail.time}_${detail.shift || 'A'}`;
      savedDetailsMap.set(key, detail);
    });

    const detailRows: ChangeDetailRow[] = filteredChanges.map(change => {
      const key = `${change.record_id}_${change.date}_${change.time}_${change.shift || 'A'}`;
      const savedDetail = savedDetailsMap.get(key);

      return {
        id: savedDetail?.id,
        record_id: change.record_id || '',
        date: savedDetail?.date || change.date || '',
        shift: savedDetail?.shift || change.shift || 'A',
        time: savedDetail?.time || change.time || '',
        model: savedDetail?.model || '',
        station: savedDetail?.station || change.station_name || '',
        line: savedDetail?.line || change.line_name || '',
        nature_of_change: savedDetail?.nature_of_change || change.four_m || '',
        category_type: savedDetail?.category_type || change.category_details?.category_type || '',
        change_description: savedDetail?.change_description || change.category_details?.description || '',
        informed_maintenance: savedDetail?.informed_maintenance || false,
        informed_quality: savedDetail?.informed_quality || false,
        informed_production: savedDetail?.informed_production || false,
        informed_others: savedDetail?.informed_others || false,
        customer_approval_required: savedDetail?.customer_approval_required || false,
        action_taken: savedDetail?.action_taken || change.action_details?.action_taken || '',
        applicability_retro: savedDetail?.applicability_retro || change.action_details?.retroactive_inspection || false,
        applicability_setup: savedDetail?.applicability_setup || change.action_details?.set_up_approval || false,
        applicability_containment: savedDetail?.applicability_containment || change.action_details?.containment_action || false,
        setup_total_qty: savedDetail?.setup_total_qty || '',
        setup_ok_qty: savedDetail?.setup_ok_qty || '',
        setup_ng_qty: savedDetail?.setup_ng_qty || '',
        retrocheck_total_qty: savedDetail?.retrocheck_total_qty || '',
        retrocheck_ok_qty: savedDetail?.retrocheck_ok_qty || '',
        retrocheck_ng_qty: savedDetail?.retrocheck_ng_qty || '',
        containmentcheck_total_qty: savedDetail?.containmentcheck_total_qty || '',
        containmentcheck_ok_qty: savedDetail?.containmentcheck_ok_qty || '',
        containmentcheck_ng_qty: savedDetail?.containmentcheck_ng_qty || '',
        traceability: savedDetail?.traceability || '',
        action_taken_on_ng_parts: savedDetail?.action_taken_on_ng_parts || '',
        production_approval: savedDetail?.production_approval || '',
        quality_approval: savedDetail?.quality_approval || '',
      };
    });

    setChangeDetailRows(detailRows);
    setAllChangeDetailRows(detailRows);
  };

  const handleDetailInput = (
    rowIdx: number,
    field: keyof ChangeDetailRow,
    value: string | boolean
  ) => {
    const newDetails = [...changeDetailRows];
    newDetails[rowIdx] = { ...newDetails[rowIdx], [field]: value };
    setChangeDetailRows(newDetails);
  };

  const handleEditModalChange = (field: keyof ChangeDetailRow, value: string | boolean) => {
    if (editingRow) {
      setEditingRow({ ...editingRow, [field]: value });
    }
  };

  const handleEditModalSave = () => {
    if (editingRow && editingRowIndex >= 0) {
      const newDetails = [...changeDetailRows];
      newDetails[editingRowIndex] = editingRow;
      setChangeDetailRows(newDetails);
      setEditModalOpen(false);
      setEditingRow(null);
      setEditingRowIndex(-1);
    }
  };

  const openEditModal = (row: ChangeDetailRow, index: number) => {
    setEditingRow({ ...row });
    setEditingRowIndex(index);
    setEditModalOpen(true);
  };

  const submitChangeDetails = async () => {
    setIsSubmitting(true);
    setMessage(null);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < changeDetailRows.length; i++) {
      const row = changeDetailRows[i];
      if (row.date && row.time) {
        try {
          if (row.id) {
            await fetch(`http://127.0.0.1:8000/api/change-details/${row.id}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(row),
            });
          } else {
            const res = await fetch('http://127.0.0.1:8000/api/change-details/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(row),
            });
            const data = await res.json();
            changeDetailRows[i].id = data.id;
          }
          successCount++;
        } catch (err: any) {
          console.error(`Error submitting data for record ${row.record_id}:`, err);
          errorCount++;
        }
      }
    }
    
    setChangeDetailRows([...changeDetailRows]);
    setIsSubmitting(false);

    if (errorCount > 0) {
      setMessage({ text: `Submission completed with ${errorCount} errors...`, type: 'error' });
    } else if (successCount > 0) {
      setShowSuccessModal(true);
    } else {
      setMessage({ text: "No changes to submit.", type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReturn = () => {
    setShowSuccessModal(false);
    const returnId = localStorage.getItem("return_to_detail_id");
    if (returnId && filterId === returnId) {
      setSelectedModule("cm");
    }
  };

  const getStatusBg = (status: TrackingStatus) =>
    status === "nochange"
      ? "bg-green-500"
      : status === "change"
        ? "bg-red-500"
        : "bg-blue-100";

  const handleClickCell = (day: number, shift: string) => {
    const [year, monthStr] = month.split('-');
    const dateString = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;

    setFilterDate(dateString);
    setFilterShift(shift);
    setFilterShopfloor('');
    setFilterLine('');
    setFilterStation('');

    setTimeout(() => {
      detailsTableRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
    setTooltip(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(changeDetailRows.length / itemsPerPage);
  const paginatedRows = changeDetailRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary stats
  const summaryStats = {
    totalChanges: allChangeDetailRows.length,
    todayChanges: allChangeDetailRows.filter(r => r.date === new Date().toISOString().split('T')[0]).length,
    pendingApprovals: allChangeDetailRows.filter(r => !r.production_approval || !r.quality_approval).length,
    byCategory: {
      man: allChangeDetailRows.filter(r => r.nature_of_change === 'Man').length,
      machine: allChangeDetailRows.filter(r => r.nature_of_change === 'Machine/Tool').length,
      material: allChangeDetailRows.filter(r => r.nature_of_change === 'Material').length,
      method: allChangeDetailRows.filter(r => r.nature_of_change === 'Method').length,
    }
  };

  // ============ CONDITIONAL RENDER: Quick Entry Form ============
  if (isFromDetailPage && specificRecordId) {
    const specificRow = changeDetailRows.find(r => r.record_id === specificRecordId);
    const rowIndex = changeDetailRows.findIndex(r => r.record_id === specificRecordId);

    if (specificRow) {
      return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={handleReturn}
            title="Changes Saved Successfully"
            message="The 4M Change Tracking Sheet has been updated. Returning to main view..."
          />
          
          <QuickEntryForm
            row={specificRow}
            onChange={(field, value) => handleDetailInput(rowIndex, field, value)}
            onSubmit={submitChangeDetails}
            onBack={() => setSelectedModule("cm")}
            isSubmitting={isSubmitting}
          />
        </div>
      );
    }
  }

  // ============ FULL VIEW ============
  return (
    <div className="max-w-full min-h-screen bg-gray-50 p-6 relative">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleReturn}
        title="Tracking Sheet Saved"
        message={
          <span>
            The 4M Change Tracking Sheet details have been successfully updated.
            {filterId && <span> Returning to main view...</span>}
          </span>
        }
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">4M Change Recording Sheet</h1>
              <p className="text-white/80 mt-1">Track and manage Man, Machine, Material, and Method changes</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Selected Month</p>
              <input
                type="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="mt-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl transition-all duration-300 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          <p className="font-semibold">{message.text}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Changes This Month"
          value={summaryStats.totalChanges}
          icon={<span className="text-3xl">📊</span>}
          color="border-indigo-500"
          subtitle={`${summaryStats.todayChanges} today`}
        />
        <SummaryCard
          title="Pending Approvals"
          value={summaryStats.pendingApprovals}
          icon={<span className="text-3xl">⏳</span>}
          color="border-yellow-500"
        />
        <SummaryCard
          title="Man & Machine"
          value={`${summaryStats.byCategory.man} / ${summaryStats.byCategory.machine}`}
          icon={<span className="text-3xl">👤⚙️</span>}
          color="border-blue-500"
        />
        <SummaryCard
          title="Material & Method"
          value={`${summaryStats.byCategory.material} / ${summaryStats.byCategory.method}`}
          icon={<span className="text-3xl">📦📋</span>}
          color="border-green-500"
        />
      </div>

      {/* Tracking Matrix */}
      <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-">
            📅 Monthly Tracking Matrix
          </h2>
          <p className="text-sm text-gray-600 mt-1">Click on red dots to see change details</p>
        </div>
        
        <div className="overflow-x-auto ">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-indigo-50">
              <tr className="text-center h-12">
                <th className="border border-gray-300 p-2 w-10" rowSpan={2}>No.</th>
                <th className="border border-gray-300 p-2 w-28" rowSpan={2}>Category</th>
                <th className="border border-gray-300 p-2 w-16" rowSpan={2}>Shift</th>
                {dayColumns.map(day => (
                  <th key={day} className="border border-gray-300 p-1 w-6 font-normal text-xs">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, catIndex) => (
                <React.Fragment key={category.id}>
                  <tr className="text-center hover:bg-indigo-50/50 transition h-14 w-2">
                    <td className="border border-gray-200 font-semibold" rowSpan={2}>
                      <span className="text-lg">{category.icon}</span>
                    </td>
                    <td className="border border-gray-200 font-medium" rowSpan={2}>{category.name}</td>
                    <td className="border border-gray-200 bg-yellow-50 font-medium text-xs">A</td>
                    {trackingMatrix[catIndex]?.map((cell, dayIndex) => (
                      <td key={`${dayIndex}-A`} className="border border-gray-200 p-0">
                        <div
                          className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 mx-auto transition-all duration-150
                            ${getStatusBg(cell.statusA)}
                            ${cell.statusA === "change" ? "border-red-400 cursor-pointer hover:scale-125 hover:shadow-lg" : cell.statusA === "nochange" ? "border-green-400" : "border-blue-200"}`}
                          onClick={cell.hasChangeA ? () => handleClickCell(cell.day, 'A') : undefined}
                        />
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center hover:bg-indigo-50/50 transition h-14 w-2">
                    <td className="border border-gray-200 bg-blue-50 font-medium text-xs">B</td>
                    {trackingMatrix[catIndex]?.map((cell, dayIndex) => (
                      <td key={`${dayIndex}-B`} className="border border-gray-200 p-0">
                        <div
                          className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 mx-auto transition-all duration-150
                            ${getStatusBg(cell.statusB)}
                            ${cell.statusB === "change" ? "border-red-400 cursor-pointer hover:scale-125 hover:shadow-lg" : cell.statusB === "nochange" ? "border-green-400" : "border-blue-200"}`}
                          onClick={cell.hasChangeB ? () => handleClickCell(cell.day, 'B') : undefined}
                        />
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-400"></div>
              <span className="text-gray-600">No Change</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-400"></div>
              <span className="text-gray-600">Change (Click to view)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-200"></div>
              <span className="text-gray-600">No Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div ref={detailsTableRef} className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">📋 Change Details</h2>
              <p className="text-sm text-gray-600">Manage and update change records</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === 'table' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <Icons.List /> Table
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === 'card' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <Icons.Card /> Cards
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <Icons.Filter /> Filters {showFilters ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
              </button>
              
              {/* Submit Button */}
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 font-semibold transition flex items-center gap-2"
                onClick={submitChangeDetails}
                disabled={isSubmitting}
              >
                <Icons.Save /> {isSubmitting ? 'Saving...' : 'Save All'}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Record ID</label>
                <input
                  type="text"
                  value={filterId}
                  onChange={e => setFilterId(e.target.value)}
                  placeholder="Search by ID..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select
                  value={filterShift}
                  onChange={e => setFilterShift(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                >
                  <option value="">All Shifts</option>
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shopfloor</label>
                <select
                  value={filterShopfloor}
                  onChange={e => setFilterShopfloor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                >
                  <option value="">All</option>
                  {shopfloors.map(sf => (
                    <option key={sf.id} value={sf.id}>{sf.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-600">Quick filters:</span>
              <button
                onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const lastWeek = new Date();
                  lastWeek.setDate(lastWeek.getDate() - 7);
                  // This would need a date range filter for proper implementation
                }}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
              >
                This Week
              </button>
              <button
                onClick={() => setFilterShift('A')}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
              >
                Shift A Only
              </button>
              <button
                onClick={() => setFilterShift('B')}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
              >
                Shift B Only
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
          Showing {paginatedRows.length} of {changeDetailRows.length} records
          {(filterId || filterDate || filterShift) && (
            <span className="ml-2 text-indigo-600">(filtered from {allChangeDetailRows.length} total)</span>
          )}
        </div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="p-4">
            {paginatedRows.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <span className="text-5xl">📭</span>
                <p className="mt-4 text-lg">No records found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedRows.map((row, idx) => (
                  <ChangeDetailCard
                    key={idx}
                    row={row}
                    onEdit={() => openEditModal(row, (currentPage - 1) * itemsPerPage + idx)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Record ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Shift</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Station</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-indigo-50/50 transition">
                      <td className="px-4 py-3 font-medium text-indigo-600">{row.record_id}</td>
                      <td className="px-4 py-3">{row.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.shift === 'A' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                          Shift {row.shift}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.time}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1">
                          {row.nature_of_change === 'Man' && '👤'}
                          {row.nature_of_change === 'Machine/Tool' && '⚙️'}
                          {row.nature_of_change === 'Material' && '📦'}
                          {row.nature_of_change === 'Method' && '📋'}
                          {row.nature_of_change || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.category_type === 'Planned' ? 'bg-green-100 text-green-700' :
                          row.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-700' :
                          row.category_type === 'Abnormal' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {row.category_type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.station || '-'}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate" title={row.change_description}>
                        {row.change_description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {row.production_approval && <span className="w-2 h-2 rounded-full bg-green-500" title="Production Approved"></span>}
                          {row.quality_approval && <span className="w-2 h-2 rounded-full bg-blue-500" title="Quality Approved"></span>}
                          {!row.production_approval && !row.quality_approval && <span className="text-xs text-gray-400">Pending</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openEditModal(row, (currentPage - 1) * itemsPerPage + idx)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm font-medium"
                        >
                          <Icons.Edit /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {changeDetailRows.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={changeDetailRows.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(count) => {
              setItemsPerPage(count);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingRow(null);
          setEditingRowIndex(-1);
        }}
        row={editingRow}
        onChange={handleEditModalChange}
        onSave={handleEditModalSave}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 transition-opacity duration-150"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.content}
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FourMChangeTrackingSheet;