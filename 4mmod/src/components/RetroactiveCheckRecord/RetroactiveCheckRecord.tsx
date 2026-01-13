// import { useState, useEffect } from 'react';
// import { Plus, User, Hash, Calendar, Package, Settings, FileText, Eye } from 'lucide-react';

// interface RowData {
//   srNo: string;
//   date: string;
//   partNameNo: string;
//   typeOfChange: string;
//   lotQty: string;
//   okQty: string;
//   rejQty: string;
//   reworkQty: string;
//   parameter: string;
//   specification: string;
//   inspectionMethod: string;
//   observations: string[];
//   inspectedBy: string;
//   remarks: string;
// }

// interface FormData {
//   formNo: string;
//   revNo: string;
//   revDate: string;
//   checkedBy: string;
//   rows: RowData[];
// }

// const API_BASE = 'http://localhost:8000/api/rcr';

// export default function RetroactiveCheckRecord() {
//   const [step, setStep] = useState<0 | 1>(0);
//   const [formData, setFormData] = useState<FormData>({
//     formNo: '',
//     revNo: '00',
//     revDate: '',
//     checkedBy: '',
//     rows: [
//       {
//         srNo: '1',
//         date: '',
//         partNameNo: '',
//         typeOfChange: '',
//         lotQty: '',
//         okQty: '',
//         rejQty: '',
//         reworkQty: '',
//         parameter: '',
//         specification: '',
//         inspectionMethod: '',
//         observations: Array(5).fill(''),
//         inspectedBy: '',
//         remarks: '',
//       },
//     ],
//   });

//   const [submittedList, setSubmittedList] = useState<FormData[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (step === 0) {
//       fetchRecords();
//     }
//   }, [step]);

//   const fetchRecords = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(API_BASE + '/');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();

//       const formatted = data.map((record: any, index: number) => ({
//         formNo: `RCR-${String(record.id).padStart(4, '0')}`,
//         revNo: '00',
//         revDate: record.created_at?.split('T')[0] || '',
//         checkedBy: record.checked_by || '',
//         rows: [
//           {
//             srNo: '1',
//             date: record.date || '',
//             partNameNo: record.part_name_number || '',
//             typeOfChange: record.type_of_change || '',
//             lotQty: record.lot_qty?.toString() || '0',
//             okQty: record.ok_qty?.toString() || '0',
//             rejQty: record.reject_qty?.toString() || '0',
//             reworkQty: record.rework_qty?.toString() || '0',
//             parameter: record.parameter || '',
//             specification: record.specification || '',
//             inspectionMethod: record.inspection_method || '',
//             observations: [
//               record.observation1 || '',
//               record.observation2 || '',
//               record.observation3 || '',
//               record.observation4 || '',
//               record.observation5 || '',
//             ],
//             inspectedBy: record.inspected_by || '',
//             remarks: record.remarks || '',
//           },
//         ],
//       }));

//       setSubmittedList(formatted);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addRow = () => {
//     const newRow: RowData = {
//       srNo: (formData.rows.length + 1).toString(),
//       date: '',
//       partNameNo: '',
//       typeOfChange: '',
//       lotQty: '',
//       okQty: '',
//       rejQty: '',
//       reworkQty: '',
//       parameter: '',
//       specification: '',
//       inspectionMethod: '',
//       observations: Array(5).fill(''),
//       inspectedBy: '',
//       remarks: '',
//     };
//     setFormData((prev) => ({
//       ...prev,
//       rows: [...prev.rows, newRow],
//     }));
//   };

//   const removeRow = (index: number) => {
//     if (formData.rows.length > 1) {
//       setFormData((prev) => ({
//         ...prev,
//         rows: prev.rows.filter((_, i) => i !== index).map((row, i) => ({
//           ...row,
//           srNo: (i + 1).toString(),
//         })),
//       }));
//     }
//   };

//   const handleInputChange = (rowIndex: number, field: keyof RowData, value: string) => {
//     const updatedRows = [...formData.rows];
//     updatedRows[rowIndex] = {
//       ...updatedRows[rowIndex],
//       [field]: value,
//     };
//     setFormData({ ...formData, rows: updatedRows });
//   };

//   const handleObservationChange = (rowIndex: number, obsIndex: number, value: string) => {
//     const updatedRows = [...formData.rows];
//     const updatedObservations = [...updatedRows[rowIndex].observations];
//     updatedObservations[obsIndex] = value;
//     updatedRows[rowIndex] = {
//       ...updatedRows[rowIndex],
//       observations: updatedObservations,
//     };
//     setFormData({ ...formData, rows: updatedRows });
//   };

//   const handleHeaderChange = (field: keyof FormData, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       let success = true;
//       for (const row of formData.rows) {
//         const payload = {
//           date: row.date,
//           part_name_number: row.partNameNo,
//           type_of_change: row.typeOfChange,
//           lot_qty: Number(row.lotQty) || 0,
//           ok_qty: Number(row.okQty) || 0,
//           reject_qty: Number(row.rejQty) || 0,
//           rework_qty: Number(row.reworkQty) || 0,
//           parameter: row.parameter || '',
//           specification: row.specification || '',
//           inspection_method: row.inspectionMethod || '',
//           observation1: row.observations[0] || '',
//           observation2: row.observations[1] || '',
//           observation3: row.observations[2] || '',
//           observation4: row.observations[3] || '',
//           observation5: row.observations[4] || '',
//           inspected_by: row.inspectedBy || '',
//           remarks: row.remarks || '',
//           checked_by: formData.checkedBy || '',
//         };

//         const res = await fetch(API_BASE + '/', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         if (!res.ok) {
//           success = false;
//           const err = await res.json();
//           console.error('Error saving row:', err);
//           alert(`Failed to save row ${row.srNo}`);
//           break;
//         }
//       }
//       if (success) {
//         alert('All records saved successfully!');
//         setFormData({
//           formNo: '',
//           revNo: '00',
//           revDate: '',
//           checkedBy: '',
//           rows: [
//             {
//               srNo: '1',
//               date: '',
//               partNameNo: '',
//               typeOfChange: '',
//               lotQty: '',
//               okQty: '',
//               rejQty: '',
//               reworkQty: '',
//               parameter: '',
//               specification: '',
//               inspectionMethod: '',
//               observations: Array(5).fill(''),
//               inspectedBy: '',
//               remarks: '',
//             },
//           ],
//         });
//         setStep(0);
//         fetchRecords();
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error(error);
//       alert('Unexpected error. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const EmptyState = () => (
//     <div className="flex flex-col items-center justify-center py-16">
//       <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-4 mb-3">
//         <FileText className="w-10 h-10 text-blue-400" />
//       </div>
//       <h2 className="text-xl font-bold text-blue-700 mb-2">No RCR Entries Yet</h2>
//       <p className="text-gray-500 text-center max-w-md text-sm">
//         Click the <span className="font-semibold text-blue-600">+ Add New Record</span> button to create your first record.
//       </p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen">
//       <div className="p-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
//           <div className="p-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-3xl font-bold">Retroactive Check Record</h1>
//                 <p className="text-blue-100 text-sm mt-1">Quality control and inspection management</p>
//               </div>
//               {step === 0 && (
//                 <button
//                   onClick={() => setStep(1)}
//                   className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Add New Record</span>
//                 </button>
//               )}
//               {step === 1 && (
//                 <button
//                   onClick={() => setStep(0)}
//                   className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
//                   disabled={loading}
//                 >
//                   ← Back to List
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* List View */}
//         {step === 0 && (
//           <>
//             {loading && (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                 <p className="text-gray-600">Loading records...</p>
//               </div>
//             )}
            
//             {!loading && submittedList.length === 0 && <EmptyState />}
            
//             {!loading && submittedList.length > 0 && (
//               <div className="grid gap-4">
//                 {submittedList.map((entry, idx) => (
//                   <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
//                     <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
//                       <div className="flex justify-between items-center">
//                         <h3 className="text-lg font-semibold flex items-center">
//                           <Hash className="w-4 h-4 mr-2" />
//                           {entry.formNo || `Entry #${idx + 1}`}
//                         </h3>
//                         <div className="flex items-center space-x-3 text-sm opacity-90">
//                           <span className="flex items-center">
//                             <Calendar className="w-3 h-3 mr-1" />
//                             {entry.rows[0].date || '––'}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="p-4">
//                       {/* Main Info Grid - Reduced padding and gap */}
//                       <div className="grid md:grid-cols-3 gap-3 mb-4">
//                         <div className="bg-blue-50 rounded-lg p-3">
//                           <div className="flex items-center mb-1">
//                             <Package className="w-4 h-4 text-blue-600 mr-2" />
//                             <span className="font-semibold text-gray-700 text-sm">Part Information</span>
//                           </div>
//                           <p className="text-base font-bold text-blue-800">{entry.rows[0].partNameNo || 'Not specified'}</p>
//                           <p className="text-xs text-gray-600">{entry.rows[0].typeOfChange || 'No change type'}</p>
//                         </div>
                        
//                         <div className="bg-green-50 rounded-lg p-3">
//                           <div className="flex items-center mb-1">
//                             <Eye className="w-4 h-4 text-green-600 mr-2" />
//                             <span className="font-semibold text-gray-700 text-sm">Quality Metrics</span>
//                           </div>
//                           <div className="grid grid-cols-2 gap-1 text-xs">
//                             <div>OK: <span className="font-bold text-green-600">{entry.rows[0].okQty}</span></div>
//                             <div>Reject: <span className="font-bold text-red-600">{entry.rows[0].rejQty}</span></div>
//                             <div>Lot: <span className="font-bold text-blue-600">{entry.rows[0].lotQty}</span></div>
//                             <div>Rework: <span className="font-bold text-amber-600">{entry.rows[0].reworkQty}</span></div>
//                           </div>
//                         </div>
                        
//                         <div className="bg-purple-50 rounded-lg p-3">
//                           <div className="flex items-center mb-1">
//                             <Settings className="w-4 h-4 text-purple-600 mr-2" />
//                             <span className="font-semibold text-gray-700 text-sm">Technical Details</span>
//                           </div>
//                           <p className="text-xs"><strong>Parameter:</strong> {entry.rows[0].parameter || 'Not specified'}</p>
//                           <p className="text-xs"><strong>Method:</strong> {entry.rows[0].inspectionMethod || 'Not specified'}</p>
//                         </div>
//                       </div>

//                       {/* Observations - More compact */}
//                       {entry.rows[0].observations.some(obs => obs.trim()) && (
//                         <div className="bg-amber-50 rounded-lg p-3 mb-3">
//                           <h4 className="font-semibold text-amber-800 mb-2 text-sm">Observations</h4>
//                           <div className="grid grid-cols-5 gap-2">
//                             {entry.rows[0].observations.map((obs, obsIdx) => (
//                               <div key={obsIdx} className="text-center">
//                                 <div className="text-xs text-gray-500">Obs {obsIdx + 1}</div>
//                                 <div className="font-medium text-amber-800 text-xs">{obs || '–'}</div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Specification and Remarks - Combined for space efficiency */}
//                       <div className="grid md:grid-cols-2 gap-3 mb-3">
//                         {entry.rows[0].specification && (
//                           <div className="bg-indigo-50 rounded-lg p-3">
//                             <h4 className="font-semibold text-indigo-800 mb-1 text-sm">Specification</h4>
//                             <p className="text-xs text-gray-700">{entry.rows[0].specification}</p>
//                           </div>
//                         )}

//                         {entry.rows[0].remarks && (
//                           <div className="bg-gray-50 rounded-lg p-3">
//                             <h4 className="font-semibold text-gray-800 mb-1 text-sm">Remarks</h4>
//                             <p className="text-xs text-gray-700">{entry.rows[0].remarks}</p>
//                           </div>
//                         )}
//                       </div>

//                       {/* Footer - Reduced padding */}
//                       <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-xs text-gray-600">
//                         <div className="flex items-center">
//                           <User className="w-3 h-3 mr-1" />
//                           <span><strong>Inspected by:</strong> {entry.rows[0].inspectedBy || 'Not specified'}</span>
//                         </div>
//                         {entry.checkedBy && (
//                           <div className="flex items-center">
//                             <User className="w-3 h-3 mr-1" />
//                             <span><strong>Checked by:</strong> {entry.checkedBy}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {/* Form View */}
//         {step === 1 && (
//           <>
//             {formData.rows.map((row, index) => (
//               <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
//                 <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
//                   <div className="flex justify-between items-center">
//                     <h2 className="text-lg font-semibold flex items-center">
//                       <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//                       Record #{row.srNo}
//                     </h2>
//                     {formData.rows.length > 1 && (
//                       <button
//                         onClick={() => removeRow(index)}
//                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all text-sm"
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="p-4">
//                   {/* Basic Information - Reduced padding */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
//                       <input
//                         type="date"
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
//                         value={row.date}
//                         onChange={(e) => handleInputChange(index, 'date', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Part Name/No</label>
//                       <input
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
//                         value={row.partNameNo}
//                         onChange={(e) => handleInputChange(index, 'partNameNo', e.target.value)}
//                         placeholder="Enter part name/number"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Type of Change</label>
//                       <input
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
//                         value={row.typeOfChange}
//                         onChange={(e) => handleInputChange(index, 'typeOfChange', e.target.value)}
//                         placeholder="Enter type of change"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Inspected By</label>
//                       <input
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
//                         value={row.inspectedBy}
//                         onChange={(e) => handleInputChange(index, 'inspectedBy', e.target.value)}
//                         placeholder="Inspector name"
//                       />
//                     </div>
//                   </div>

//                   {/* Quantity Information - Reduced section padding */}
//                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-4">
//                     <h3 className="text-base font-semibold text-gray-800 mb-3">Quantity Information</h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">Lot Qty</label>
//                         <input
//                           type="number"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
//                           value={row.lotQty}
//                           onChange={(e) => handleInputChange(index, 'lotQty', e.target.value)}
//                           placeholder="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">OK Qty (after insp)</label>
//                         <input
//                           type="number"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                           value={row.okQty}
//                           onChange={(e) => handleInputChange(index, 'okQty', e.target.value)}
//                           placeholder="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">Reject Qty</label>
//                         <input
//                           type="number"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
//                           value={row.rejQty}
//                           onChange={(e) => handleInputChange(index, 'rejQty', e.target.value)}
//                           placeholder="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">Rework Qty</label>
//                         <input
//                           type="number"
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
//                           value={row.reworkQty}
//                           onChange={(e) => handleInputChange(index, 'reworkQty', e.target.value)}
//                           placeholder="0"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Technical Information - Reduced section padding */}
//                   <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 mb-4">
//                     <h3 className="text-base font-semibold text-gray-800 mb-3">Technical Specifications</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">Parameter</label>
//                         <input
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
//                           value={row.parameter}
//                           onChange={(e) => handleInputChange(index, 'parameter', e.target.value)}
//                           placeholder="Parameter to check"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">Specification</label>
//                         <input
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
//                           value={row.specification}
//                           onChange={(e) => handleInputChange(index, 'specification', e.target.value)}
//                           placeholder="Specification details"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">Inspection Method</label>
//                         <input
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
//                           value={row.inspectionMethod}
//                           onChange={(e) => handleInputChange(index, 'inspectionMethod', e.target.value)}
//                           placeholder="Enter inspection method"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Observations - Reduced section padding */}
//                   <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 mb-4">
//                     <h3 className="text-base font-semibold text-gray-800 mb-3">Observations</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
//                       {row.observations.map((obs, obsIndex) => (
//                         <div key={obsIndex}>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">Observation #{obsIndex + 1}</label>
//                           <input
//                             className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
//                             value={obs}
//                             onChange={(e) => handleObservationChange(index, obsIndex, e.target.value)}
//                             placeholder={`Value ${obsIndex + 1}`}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Remarks - Reduced textarea height */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
//                     <textarea
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-sm"
//                       rows={2}
//                       value={row.remarks}
//                       onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
//                       placeholder="Additional remarks or notes..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Add Row Button - Reduced size */}
//             <div className="text-center mb-6">
//               <button 
//                 onClick={addRow}
//                 className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2 mx-auto"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add New Record</span>
//               </button>
//             </div>

//             {/* Final Approval - Reduced padding */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
//               <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white p-3">
//                 <h2 className="text-lg font-semibold flex items-center">
//                   <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//                   Final Approval
//                 </h2>
//               </div>
//               <div className="p-4">
//                 <div className="max-w-md mx-auto">
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Checked By</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all text-sm"
//                     value={formData.checkedBy}
//                     onChange={(e) => handleHeaderChange('checkedBy', e.target.value)}
//                     placeholder="Checker name and signature"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons - Reduced size */}
//             <div className="flex justify-center space-x-4 mb-6">
//               <button 
//                 onClick={() => setStep(0)}
//                 className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSubmit}
//                 className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
//                 disabled={loading}
//               >
//                 <User className="w-4 h-4" />
//                 <span>{loading ? 'Saving...' : 'Submit Record'}</span>
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { Plus, User, Hash, Calendar, Package, Settings, FileText, Eye, ArrowLeft, CheckCircle } from 'lucide-react';

interface RowData {
  date: string;
  partNameNo: string;
  typeOfChange: string;
  lotQty: string;
  okQty: string;
  rejQty: string;
  reworkQty: string;
  parameter: string;
  specification: string;
  inspectionMethod: string;
  observations: string[];
  inspectedBy: string;
  remarks: string;
}

interface FormData {
  checkedBy: string;
  row: RowData;
}

interface ChangeRecord {
  id: number;
  record_id: string;
  four_m: string;
  category_details?: {
    category_type: string;
  };
}

interface SubmittedRCR {
  id: number;
  change: number;
  record_id?: string;
  four_m_type?: string;
  date: string;
  part_name_number: string;
  type_of_change: string;
  lot_qty: number;
  ok_qty: number;
  reject_qty: number;
  rework_qty: number;
  parameter: string;
  specification: string;
  inspection_method: string;
  observation1: string;
  observation2: string;
  observation3: string;
  observation4: string;
  observation5: string;
  inspected_by: string;
  remarks: string;
  checked_by?: string;
}

const API_BASE = 'http://localhost:8000/api';

export default function RetroactiveCheckRecord() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    checkedBy: '',
    row: {
      date: '', partNameNo: '', typeOfChange: '', lotQty: '', okQty: '', rejQty: '', reworkQty: '',
      parameter: '', specification: '', inspectionMethod: '', observations: Array(5).fill(''),
      inspectedBy: '', remarks: '',
    },
  });
  const [submittedRCRs, setSubmittedRCRs] = useState<SubmittedRCR[]>([]);
  const [pendingChanges, setPendingChanges] = useState<ChangeRecord[]>([]);
  const [selectedChange, setSelectedChange] = useState<ChangeRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingChanges();
    fetchSubmittedRCRs();
  }, []);

  const fetchSubmittedRCRs = async () => {
    try {
      const res = await fetch(API_BASE + '/rcr/');
      if (res.ok) setSubmittedRCRs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingChanges = async () => {
    setLoading(true);
    try {
      const [changesRes, rcrRes] = await Promise.all([
        fetch(API_BASE + '/4m-changes/'),
        fetch(API_BASE + '/rcr/')
      ]);
      
      const changes = await changesRes.json();
      const rcrs = await rcrRes.json();
      const submittedIds = new Set(rcrs.map((r: any) => r.change));
      
      const pending = changes.filter((c: any) => 
        c.action_details?.retroactive_inspection && !submittedIds.has(c.id)
      );
      setPendingChanges(pending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (change: ChangeRecord) => {
    setSelectedChange(change);
    setFormData({
      ...formData,
      row: { ...formData.row, typeOfChange: change.category_details?.category_type || '' }
    });
    setShowForm(true);
  };

  const handleInputChange = (field: keyof RowData, value: string) => {
    setFormData({ ...formData, row: { ...formData.row, [field]: value } });
  };

  const handleObservationChange = (idx: number, value: string) => {
    const obs = [...formData.row.observations];
    obs[idx] = value;
    setFormData({ ...formData, row: { ...formData.row, observations: obs } });
  };

  const handleSubmit = async () => {
    if (!selectedChange) return alert('No change record selected');

    try {
      setLoading(true);
      const row = formData.row;
      const payload = {
        change: selectedChange.id, date: row.date, part_name_number: row.partNameNo,
        type_of_change: row.typeOfChange, lot_qty: Number(row.lotQty) || 0,
        ok_qty: Number(row.okQty) || 0, reject_qty: Number(row.rejQty) || 0,
        rework_qty: Number(row.reworkQty) || 0, parameter: row.parameter,
        specification: row.specification, inspection_method: row.inspectionMethod,
        observation1: row.observations[0], observation2: row.observations[1],
        observation3: row.observations[2], observation4: row.observations[3],
        observation5: row.observations[4], inspected_by: row.inspectedBy,
        remarks: row.remarks, checked_by: formData.checkedBy,
      };

      const res = await fetch(API_BASE + '/rcr/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return alert('Failed to save RCR');

      alert('RCR saved successfully!');
      setFormData({
        checkedBy: '',
        row: {
          date: '', partNameNo: '', typeOfChange: '', lotQty: '', okQty: '', rejQty: '', reworkQty: '',
          parameter: '', specification: '', inspectionMethod: '', observations: Array(5).fill(''),
          inspectedBy: '', remarks: '',
        },
      });
      setSelectedChange(null);
      setShowForm(false);
      await fetchPendingChanges();
      await fetchSubmittedRCRs();
    } catch (error) {
      alert('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-3 mb-2">
        <FileText className="w-8 h-8 text-blue-400" />
      </div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Retroactive Check Record</h1>
            <p className="text-blue-100 text-sm mt-1">Quality control and inspection management</p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              Pending Change Records
            </h2>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            )}

            {!loading && pendingChanges.length === 0 && (
              <EmptyState message="No pending change records requiring RCR" />
            )}

            {!loading && pendingChanges.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingChanges.map((change) => (
                  <div
                    key={change.id}
                    className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                    onClick={() => handleSelectChange(change)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-orange-600" />
                        <span className="font-bold text-lg text-gray-800">{change.record_id}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">4M Type:</span>
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          {change.four_m}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">Change Type:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          change.category_details?.category_type === 'Planned' ? 'bg-green-100 text-green-700' :
                          change.category_details?.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {change.category_details?.category_type || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <button className="mt-4 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                      Create RCR
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Submitted RCRs
            </h2>
          </div>

          {submittedRCRs.length === 0 && <EmptyState message="No RCR entries yet" />}

          {submittedRCRs.length > 0 && (
            <div className="grid gap-4">
              {submittedRCRs.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-green-500 hover:shadow-xl transition-all duration-200">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        {entry.record_id || `RCR-${entry.id}`}
                      </h3>
                      <div className="flex items-center gap-3 text-sm opacity-90">
                        <span className="px-2 py-1 bg-white/20 rounded-lg">
                          {entry.four_m_type || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date || '––'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center mb-1 gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-700 text-sm">Part Information</span>
                        </div>
                        <p className="text-base font-bold text-blue-800">{entry.part_name_number || 'Not specified'}</p>
                        <p className="text-xs text-gray-600">{entry.type_of_change || 'No change type'}</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center mb-1 gap-2">
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-gray-700 text-sm">Quality Metrics</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div>OK: <span className="font-bold text-green-600">{entry.ok_qty}</span></div>
                          <div>Reject: <span className="font-bold text-red-600">{entry.reject_qty}</span></div>
                          <div>Lot: <span className="font-bold text-blue-600">{entry.lot_qty}</span></div>
                          <div>Rework: <span className="font-bold text-amber-600">{entry.rework_qty}</span></div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center mb-1 gap-2">
                          <Settings className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-gray-700 text-sm">Technical Details</span>
                        </div>
                        <p className="text-xs"><strong>Parameter:</strong> {entry.parameter || 'Not specified'}</p>
                        <p className="text-xs"><strong>Method:</strong> {entry.inspection_method || 'Not specified'}</p>
                      </div>
                    </div>

                    {[entry.observation1, entry.observation2, entry.observation3, entry.observation4, entry.observation5].some(obs => obs?.trim()) && (
                      <div className="bg-amber-50 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-amber-800 mb-2 text-sm">Observations</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {[entry.observation1, entry.observation2, entry.observation3, entry.observation4, entry.observation5].map((obs, obsIdx) => (
                            <div key={obsIdx} className="text-center">
                              <div className="text-xs text-gray-500">Obs {obsIdx + 1}</div>
                              <div className="font-medium text-amber-800 text-xs">{obs || '–'}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.specification && (
                      <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-indigo-800 mb-1 text-sm">Specification</h4>
                        <p className="text-xs text-gray-700">{entry.specification}</p>
                      </div>
                    )}

                    {entry.remarks && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm">Remarks</h4>
                        <p className="text-xs text-gray-700">{entry.remarks}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span><strong>Inspected by:</strong> {entry.inspected_by || 'Not specified'}</span>
                      </div>
                      {entry.checked_by && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span><strong>Checked by:</strong> {entry.checked_by}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold mb-2">Creating RCR for {selectedChange?.record_id}</h3>
                <div className="flex gap-4 text-sm">
                  <span>4M: <strong>{selectedChange?.four_m}</strong></span>
                  <span>Type: <strong>{selectedChange?.category_details?.category_type}</strong></span>
                </div>
              </div>
              <button
                onClick={() => { setShowForm(false); setSelectedChange(null); }}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
              <h2 className="font-semibold">RCR Details</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.row.date} onChange={(e) => handleInputChange('date', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Part Name/No</label>
                  <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.partNameNo} onChange={(e) => handleInputChange('partNameNo', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Type of Change</label>
                  <input className="w-full px-3 py-2 border rounded-lg bg-gray-50" value={formData.row.typeOfChange} disabled />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Inspected By</label>
                  <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.inspectedBy} onChange={(e) => handleInputChange('inspectedBy', e.target.value)} />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3">
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Lot</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.lotQty} onChange={(e) => handleInputChange('lotQty', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">OK</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.okQty} onChange={(e) => handleInputChange('okQty', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Reject</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.rejQty} onChange={(e) => handleInputChange('rejQty', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Rework</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.reworkQty} onChange={(e) => handleInputChange('reworkQty', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-3">
                <h3 className="font-semibold mb-3">Technical Specs</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Parameter</label>
                    <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.parameter} onChange={(e) => handleInputChange('parameter', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Specification</label>
                    <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.specification} onChange={(e) => handleInputChange('specification', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Inspection Method</label>
                    <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.inspectionMethod} onChange={(e) => handleInputChange('inspectionMethod', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3">
                <h3 className="font-semibold mb-3">Observations</h3>
                <div className="grid grid-cols-5 gap-3">
                  {formData.row.observations.map((obs, idx) => (
                    <div key={idx}>
                      <label className="block text-xs font-medium mb-1">Obs {idx + 1}</label>
                      <input className="w-full px-3 py-2 border rounded-lg" value={obs} onChange={(e) => handleObservationChange(idx, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Remarks</label>
                <textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={formData.row.remarks} onChange={(e) => handleInputChange('remarks', e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Checked By</label>
                <input className="w-full px-3 py-2 border rounded-lg" value={formData.checkedBy} onChange={(e) => setFormData({ ...formData, checkedBy: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => { setShowForm(false); setSelectedChange(null); }} className="bg-gray-500 text-white px-6 py-2.5 rounded-xl font-semibold" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2" disabled={loading}>
              <User className="w-4 h-4" />
              {loading ? 'Saving...' : 'Submit RCR'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}