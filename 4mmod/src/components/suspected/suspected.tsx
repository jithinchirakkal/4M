
// import React, { useState, useEffect } from "react";
// import { PlusCircle, List, ArrowLeft, Save, X, Hash, Package, Calendar, MapPin, FileText, AlertTriangle, Tag, Truck, Loader } from "lucide-react";

// interface SuspectedRecord {
//   id?: number;
//   rcr?: number;
//   record_id?: string;
//   four_m_type?: string;
//   date: string;
//   part_name: string;
//   change_type: string;
//   suspected_qty: string;
//   dispatch_date: string;
//   qty: string;
//   city: string;
//   invoice: string;
//   remarks: string;
// }

// interface PendingRCR {
//   id: number;
//   record_id: string;
//   four_m: string;
//   category_type: string;
//   part_name_number: string;
//   type_of_change: string;
//   date: string;
//   reject_qty: number;
//   lot_qty: number;
// }

// const API_BASE = 'http://localhost:8000/api';

// const FormInput = ({ label, name, type, value, onChange, disabled = false }: any) => (
//   <div>
//     <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">
//       {label}
//     </label>
//     <input
//       id={name}
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-base shadow-inner shadow-gray-200/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 ${
//         disabled ? 'bg-gray-100 cursor-not-allowed' : ''
//       }`}
//       required={!disabled}
//     />
//   </div>
// );

// const DetailItem = ({ label, value, unit, color = 'text-gray-800', Icon }: any) => (
//   <div className="flex justify-between items-start">
//     <span className="text-xs font-medium text-gray-500 flex items-center">
//       {Icon && <Icon size={14} className="mr-1 text-gray-400" />} {label}
//     </span>
//     <span className={`text-sm font-semibold ${color} text-right`}>
//       {value} {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
//     </span>
//   </div>
// );

// const MobileRecordCard = ({ record, index }: { record: SuspectedRecord, index: number }) => (
//   <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 space-y-3 lg:hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
//     <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//       <span className="text-lg font-bold text-blue-600">Record #{index + 1}</span>
//       <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold shadow-sm">SUSPECTED</span>
//     </div>
//     <DetailItem label="Part Name/Model" value={record.part_name} Icon={Tag} />
//     <DetailItem label="Change Type" value={record.change_type} Icon={FileText} />
//     <DetailItem label="Date of Incident" value={record.date} Icon={Calendar} />
//     <DetailItem label="Suspected Qty" value={record.suspected_qty} unit="pcs" Icon={AlertTriangle} color="text-orange-600" />
//     <DetailItem label="Qty Dispatched" value={record.qty} unit="pcs" Icon={Truck} color="text-green-600" />
//     <DetailItem label="Invoice / City" value={`${record.invoice} / ${record.city}`} Icon={MapPin} />
//     <DetailItem label="Dispatch Date" value={record.dispatch_date} Icon={Calendar} />
//   </div>
// );

// const Suspected: React.FC = () => {
//   const [records, setRecords] = useState<SuspectedRecord[]>([]);
//   const [pendingRCRs, setPendingRCRs] = useState<PendingRCR[]>([]);
//   const [selectedRCR, setSelectedRCR] = useState<PendingRCR | null>(null);
//   const [viewMode, setViewMode] = useState<"list" | "add">("list");
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<SuspectedRecord>({
//     date: "",
//     part_name: "",
//     change_type: "",
//     suspected_qty: "",
//     dispatch_date: "",
//     qty: "",
//     city: "",
//     invoice: "",
//     remarks: "",
//   });

//   useEffect(() => {
//     fetchRecords();
//     fetchPendingRCRs();
//   }, []);

//   const fetchRecords = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/suspected-lot/`);
//       if (res.ok) {
//         const data = await res.json();
//         setRecords(data);
//       }
//     } catch (err) {
//       console.error('Error fetching records:', err);
//     }
//   };

//   const fetchPendingRCRs = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/suspected-lot/pending_rcrs/`);
//       if (res.ok) {
//         const data = await res.json();
//         setPendingRCRs(data);
//       }
//     } catch (err) {
//       console.error('Error fetching pending RCRs:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectRCR = (rcr: PendingRCR) => {
//     setSelectedRCR(rcr);
//     setFormData({
//       date: rcr.date,
//       part_name: rcr.part_name_number,
//       change_type: rcr.category_type,
//       suspected_qty: rcr.reject_qty.toString(),
//       dispatch_date: "",
//       qty: "",
//       city: "",
//       invoice: "",
//       remarks: "",
//     });
//     setViewMode("add");
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddRecord = async () => {
//     if (!selectedRCR) {
//       alert('No RCR selected');
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = {
//         rcr: selectedRCR.id,
//         date: formData.date,
//         part_name: formData.part_name,
//         change_type: formData.change_type,
//         suspected_qty: parseInt(formData.suspected_qty) || 0,
//         dispatch_date: formData.dispatch_date,
//         qty: parseInt(formData.qty) || 0,
//         city: formData.city,
//         invoice: formData.invoice,
//         remarks: formData.remarks,
//       };

//       const res = await fetch(`${API_BASE}/suspected-lot/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         alert('Failed to save record');
//         return;
//       }

//       alert('Suspected Lot record saved successfully!');
//       setFormData({
//         date: "",
//         part_name: "",
//         change_type: "",
//         suspected_qty: "",
//         dispatch_date: "",
//         qty: "",
//         city: "",
//         invoice: "",
//         remarks: "",
//       });
//       setSelectedRCR(null);
//       setViewMode("list");
//       await fetchRecords();
//       await fetchPendingRCRs();
//     } catch (error) {
//       console.error('Error saving record:', error);
//       alert('Unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const EmptyState = ({ message }: { message: string }) => (
//     <div className="flex flex-col items-center justify-center py-8">
//       <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-3 mb-2">
//         <FileText className="w-8 h-8 text-blue-400" />
//       </div>
//       <p className="text-sm text-gray-600">{message}</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-full mx-auto bg-white shadow-2xl rounded-3xl border border-gray-100">
        
//         <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 flex justify-between items-center rounded-t-3xl shadow-lg shadow-indigo-500/50">
//           <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
//             <AlertTriangle size={28} className="text-yellow-300"/>
//             Suspected Lot Traceability Record
//           </h1>
//           {viewMode === "list" && (
//             <button
//               onClick={() => setViewMode("add")}
//               disabled={pendingRCRs.length === 0}
//               className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-lg font-bold shadow-md shadow-green-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
//             >
//               <PlusCircle size={20} /> View Pending RCRs
//             </button>
//           )}
//         </div>

//         {viewMode === "list" ? (
//           <div className="p-8">
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
//               <List size={24} className="text-blue-600"/> All Traceability Records
//             </h2>
            
//             {records.length === 0 ? (
//               <EmptyState message="No suspected lot records found. Complete pending RCRs to begin tracking." />
//             ) : (
//               <>
//                 <div className="hidden lg:block shadow-lg rounded-xl overflow-x-auto border border-gray-200">
//                   <table className="w-full text-sm">
//                     <thead className="bg-blue-600/90 text-white sticky top-0">
//                       <tr className="uppercase text-xs font-extrabold tracking-wider">
//                         {[
//                           "S.No.", "Record ID", "4M Type", "Date", "Part Name/Model", "Change Type", 
//                           "Suspected Qty", "Dispatch Date", "Qty Affected", 
//                           "City", "Invoice",
//                         ].map((heading, idx) => (
//                           <th key={idx} className="p-3 border-r border-blue-500 last:border-r-0 text-left whitespace-nowrap min-w-[120px]">
//                             {heading}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {records.map((r, i) => (
//                         <tr
//                           key={r.id || i}
//                           className="border-b border-gray-100 hover:bg-blue-50/70 transition-colors even:bg-gray-50/50"
//                         >
//                           <td className="p-3 text-center font-bold text-gray-700">{i + 1}</td>
//                           <td className="p-3 font-mono text-xs text-blue-600">{r.record_id || 'N/A'}</td>
//                           <td className="p-3">
//                             <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
//                               {r.four_m_type || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="p-3 font-medium">{r.date}</td>
//                           <td className="p-3 font-semibold text-gray-800">{r.part_name}</td>
//                           <td className="p-3 text-red-600 font-medium">{r.change_type}</td>
//                           <td className="p-3 font-extrabold text-orange-600">{r.suspected_qty} pcs</td>
//                           <td className="p-3">{r.dispatch_date}</td>
//                           <td className="p-3 font-bold text-green-700">{r.qty} pcs</td>
//                           <td className="p-3">{r.city}</td>
//                           <td className="p-3 font-mono text-xs">{r.invoice}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="grid gap-4 lg:hidden">
//                   {records.map((r, i) => (
//                     <MobileRecordCard key={r.id || i} record={r} index={i} />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="p-8">
//             {pendingRCRs.length === 0 ? (
//               <div className="text-center py-10">
//                 <EmptyState message="No pending RCRs. All RCRs have suspected lot records." />
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className="mt-4 flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all mx-auto"
//                 >
//                   <ArrowLeft size={20} /> Back to List
//                 </button>
//               </div>
//             ) : selectedRCR ? (
//               <div>
//                 <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-l-4 border-blue-500">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-bold mb-2">Creating Suspected Lot Record for {selectedRCR.record_id}</h3>
//                       <div className="flex gap-4 text-sm">
//                         <span>4M: <strong>{selectedRCR.four_m}</strong></span>
//                         <span>Type: <strong>{selectedRCR.category_type}</strong></span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => { setSelectedRCR(null); }}
//                       className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//                     >
//                       <ArrowLeft className="w-4 h-4" />
//                       Back
//                     </button>
//                   </div>
//                 </div>

//                 <div className="p-8 bg-gray-50/50 rounded-b-3xl border-t border-gray-200">
//                   <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
//                     <PlusCircle size={24} className="text-green-600"/> Enter Suspected Lot Data
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
//                     <FormInput label="Date of Change" name="date" type="date" value={formData.date} onChange={handleInputChange} disabled />
//                     <FormInput label="Part Name/Model" name="part_name" type="text" value={formData.part_name} onChange={handleInputChange} disabled />
//                     <FormInput label="Change Type/Source" name="change_type" type="text" value={formData.change_type} onChange={handleInputChange} disabled />
//                     <FormInput label="Suspected Qty (Total)" name="suspected_qty" type="number" value={formData.suspected_qty} onChange={handleInputChange} />
//                     <FormInput label="Dispatch Date" name="dispatch_date" type="date" value={formData.dispatch_date} onChange={handleInputChange} />
//                     <FormInput label="Qty Dispatched (Affected)" name="qty" type="number" value={formData.qty} onChange={handleInputChange} />
//                     <FormInput label="Customer City" name="city" type="text" value={formData.city} onChange={handleInputChange} />
//                     <FormInput label="Invoice/Reference" name="invoice" type="text" value={formData.invoice} onChange={handleInputChange} />
//                     <FormInput label="Containment Remarks" name="remarks" type="text" value={formData.remarks} onChange={handleInputChange} />
//                   </div>

//                   <div className="flex justify-end mt-8 space-x-4">
//                     <button
//                       onClick={() => { setSelectedRCR(null); }}
//                       className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all shadow-md"
//                       disabled={loading}
//                     >
//                       <X size={20}/> Cancel
//                     </button>
//                     <button
//                       onClick={handleAddRecord}
//                       disabled={loading}
//                       className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 transition-all shadow-lg shadow-blue-500/50 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20}/>}
//                       {loading ? 'Saving...' : 'Save Record'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
//                     <AlertTriangle size={24} className="text-orange-600" />
//                     Pending RCRs
//                   </h2>
//                   <button
//                     onClick={() => setViewMode("list")}
//                     className="flex items-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200 px-6 py-3 rounded-xl text-lg font-medium shadow-md transition-all duration-300"
//                   >
//                     <ArrowLeft size={20} /> Back to List
//                   </button>
//                 </div>

//                 {loading ? (
//                   <div className="text-center py-8">
//                     <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
//                     <p className="text-gray-600">Loading pending RCRs...</p>
//                   </div>
//                 ) : (
//                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {pendingRCRs.map((rcr) => (
//                       <div
//                         key={rcr.id}
//                         className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
//                         onClick={() => handleSelectRCR(rcr)}
//                       >
//                         <div className="flex justify-between items-start mb-3">
//                           <div className="flex items-center gap-2">
//                             <Hash className="w-5 h-5 text-orange-600" />
//                             <span className="font-bold text-lg text-gray-800">{rcr.record_id}</span>
//                           </div>
//                         </div>
                        
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs font-semibold text-gray-600">4M Type:</span>
//                             <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
//                               {rcr.four_m}
//                             </span>
//                           </div>
                          
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs font-semibold text-gray-600">Change Type:</span>
//                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${
//                               rcr.category_type === 'Planned' ? 'bg-green-100 text-green-700' :
//                               rcr.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-700' :
//                               'bg-red-100 text-red-700'
//                             }`}>
//                               {rcr.category_type}
//                             </span>
//                           </div>

//                           <div className="pt-2 border-t border-gray-100">
//                             <p className="text-xs text-gray-600 mb-1">Part: <span className="font-semibold">{rcr.part_name_number}</span></p>
//                             <p className="text-xs text-gray-600">Reject Qty: <span className="font-bold text-red-600">{rcr.reject_qty}</span> / Lot: <span className="font-bold text-blue-600">{rcr.lot_qty}</span></p>
//                           </div>
//                         </div>

//                         <button className="mt-4 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
//                           Create Suspected Lot Record
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Suspected;








// import React, { useState, useEffect, useRef } from "react";
// import { PlusCircle, List, ArrowLeft, Save, X, Hash, Package, Calendar, MapPin, FileText, AlertTriangle, Tag, Truck, Loader, Search, Printer, Eye } from "lucide-react";

// interface SuspectedRecord {
//   id?: number;
//   rcr?: number;
//   record_id?: string;
//   four_m_type?: string;
//   date: string;
//   part_name: string;
//   change_type: string;
//   suspected_qty: string;
//   dispatch_date: string;
//   qty: string;
//   city: string;
//   invoice: string;
//   remarks: string;
// }

// interface PendingRCR {
//   id: number;
//   record_id: string;
//   four_m: string;
//   category_type: string;
//   part_name_number: string;
//   type_of_change: string;
//   date: string;
//   reject_qty: number;
//   lot_qty: number;
// }

// const API_BASE = 'http://localhost:8000/api';

// const FormInput = ({ label, name, type, value, onChange, disabled = false }: any) => (
//   <div>
//     <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">
//       {label}
//     </label>
//     <input
//       id={name}
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-base shadow-inner shadow-gray-200/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//       required={!disabled}
//     />
//   </div>
// );

// const DetailItem = ({ label, value, unit, color = 'text-gray-800', Icon }: any) => (
//   <div className="flex justify-between items-start">
//     <span className="text-xs font-medium text-gray-500 flex items-center">
//       {Icon && <Icon size={14} className="mr-1 text-gray-400" />}
//       {label}
//     </span>
//     <span className={`text-sm font-semibold ${color} text-right`}>
//       {value} {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
//     </span>
//   </div>
// );

// const MobileRecordCard = ({ record, index, onView }: { record: SuspectedRecord, index: number, onView: () => void }) => (
//   <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 space-y-3 lg:hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
//     <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//       <span className="text-lg font-bold text-blue-600">Record #{index + 1}</span>
//       <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold shadow-sm">SUSPECTED</span>
//     </div>
//     <DetailItem label="Part Name/Model" value={record.part_name} Icon={Tag} />
//     <DetailItem label="Change Type" value={record.change_type} Icon={FileText} />
//     <DetailItem label="Date of Incident" value={record.date} Icon={Calendar} />
//     <DetailItem label="Suspected Qty" value={record.suspected_qty} unit="pcs" Icon={AlertTriangle} color="text-orange-600" />
//     <DetailItem label="Qty Dispatched" value={record.qty} unit="pcs" Icon={Truck} color="text-green-600" />
//     <DetailItem label="Invoice / City" value={`${record.invoice} / ${record.city}`} Icon={MapPin} />
//     <DetailItem label="Dispatch Date" value={record.dispatch_date} Icon={Calendar} />
//     <button onClick={onView} className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all">
//       <Eye size={16} /> View Details
//     </button>
//   </div>
// );

// const EmptyState = ({ message }: { message: string }) => (
//   <div className="flex flex-col items-center justify-center py-8">
//     <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-3 mb-2">
//       <FileText className="w-8 h-8 text-blue-400" />
//     </div>
//     <p className="text-sm text-gray-600">{message}</p>
//   </div>
// );

// const Suspected: React.FC = () => {
//   const [records, setRecords] = useState<SuspectedRecord[]>([]);
//   const [filteredRecords, setFilteredRecords] = useState<SuspectedRecord[]>([]);
//   const [pendingRCRs, setPendingRCRs] = useState<PendingRCR[]>([]);
//   const [selectedRCR, setSelectedRCR] = useState<PendingRCR | null>(null);
//   const [selectedRecord, setSelectedRecord] = useState<SuspectedRecord | null>(null);
//   const [viewMode, setViewMode] = useState<"list" | "add" | "view">("list");
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<SuspectedRecord>({
//     date: "",
//     part_name: "",
//     change_type: "",
//     suspected_qty: "",
//     dispatch_date: "",
//     qty: "",
//     city: "",
//     invoice: "",
//     remarks: "",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;
//   const printRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     fetchRecords();
//     fetchPendingRCRs();
//   }, []);

//   useEffect(() => {
//     const filtered = records.filter(record =>
//       Object.values(record).some(val =>
//         val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     setFilteredRecords(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, records]);

//   const fetchRecords = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/suspected-lot/`);
//       if (res.ok) {
//         const data = await res.json();
//         setRecords(data);
//         setFilteredRecords(data);
//       }
//     } catch (err) {
//       console.error('Error fetching records:', err);
//     }
//   };

//   const fetchPendingRCRs = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/suspected-lot/pending_rcrs/`);
//       if (res.ok) {
//         const data = await res.json();
//         setPendingRCRs(data);
//       }
//     } catch (err) {
//       console.error('Error fetching pending RCRs:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectRCR = (rcr: PendingRCR) => {
//     setSelectedRCR(rcr);
//     setFormData({
//       date: rcr.date,
//       part_name: rcr.part_name_number,
//       change_type: rcr.category_type,
//       suspected_qty: rcr.reject_qty.toString(),
//       dispatch_date: "",
//       qty: "",
//       city: "",
//       invoice: "",
//       remarks: "",
//     });
//     setViewMode("add");
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddRecord = async () => {
//     if (!selectedRCR) return;

//     try {
//       setLoading(true);
//       const payload = {
//         rcr: selectedRCR.id,
//         date: formData.date,
//         part_name: formData.part_name,
//         change_type: formData.change_type,
//         suspected_qty: parseInt(formData.suspected_qty) || 0,
//         dispatch_date: formData.dispatch_date,
//         qty: parseInt(formData.qty) || 0,
//         city: formData.city,
//         invoice: formData.invoice,
//         remarks: formData.remarks,
//       };

//       const res = await fetch(`${API_BASE}/suspected-lot/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         setFormData({
//           date: "",
//           part_name: "",
//           change_type: "",
//           suspected_qty: "",
//           dispatch_date: "",
//           qty: "",
//           city: "",
//           invoice: "",
//           remarks: "",
//         });
//         setSelectedRCR(null);
//         setViewMode("list");
//         await fetchRecords();
//         await fetchPendingRCRs();
//       }
//     } catch (error) {
//       console.error('Error saving record:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewRecord = (record: SuspectedRecord) => {
//     setSelectedRecord(record);
//     setViewMode("view");
//   };

//   const handlePrint = () => {
//     if (printRef.current) {
//       const printContent = printRef.current.innerHTML;
//       const originalContent = document.body.innerHTML;
//       document.body.innerHTML = printContent;
//       window.print();
//       document.body.innerHTML = originalContent;
//       window.location.reload(); // To restore the page after print
//     }
//   };

//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-full mx-auto bg-white shadow-2xl rounded-3xl border border-gray-100">
//         <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 flex justify-between items-center rounded-t-3xl shadow-lg shadow-indigo-500/50">
//           <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
//             <AlertTriangle size={28} className="text-yellow-300" />
//             Suspected Lot Traceability Record
//           </h1>
//           {viewMode === "list" && (
//             <button
//               onClick={() => setViewMode("add")}
//               disabled={pendingRCRs.length === 0}
//               className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-lg font-bold shadow-md shadow-green-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
//             >
//               <PlusCircle size={20} /> View Pending RCRs
//             </button>
//           )}
//         </div>

//         {viewMode === "list" ? (
//           <div className="p-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
//                 <List size={24} className="text-blue-600" /> All Traceability Records
//               </h2>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search records..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             {filteredRecords.length === 0 ? (
//               <EmptyState message="No suspected lot records found. Complete pending RCRs to begin tracking." />
//             ) : (
//               <>
//                 <div className="hidden lg:block shadow-lg rounded-xl overflow-x-auto border border-gray-200">
//                   <table className="w-full text-sm">
//                     <thead className="bg-blue-600/90 text-white sticky top-0">
//                       <tr className="uppercase text-xs font-extrabold tracking-wider">
//                         {[
//                           "S.No.", "Record ID", "4M Type", "Date", "Part Name/Model", "Change Type",
//                           "Suspected Qty", "Dispatch Date", "Qty Affected",
//                           "City", "Invoice", "Actions"
//                         ].map((heading, idx) => (
//                           <th key={idx} className="p-3 border-r border-blue-500 last:border-r-0 text-left whitespace-nowrap min-w-[120px]">
//                             {heading}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentRecords.map((r, i) => (
//                         <tr
//                           key={r.id || i}
//                           className="border-b border-gray-100 hover:bg-blue-50/70 transition-colors even:bg-gray-50/50"
//                         >
//                           <td className="p-3 text-center font-bold text-gray-700">{indexOfFirstRecord + i + 1}</td>
//                           <td className="p-3 font-mono text-xs text-blue-600">{r.record_id || 'N/A'}</td>
//                           <td className="p-3">
//                             <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
//                               {r.four_m_type || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="p-3 font-medium">{r.date}</td>
//                           <td className="p-3 font-semibold text-gray-800">{r.part_name}</td>
//                           <td className="p-3 text-red-600 font-medium">{r.change_type}</td>
//                           <td className="p-3 font-extrabold text-orange-600">{r.suspected_qty} pcs</td>
//                           <td className="p-3">{r.dispatch_date}</td>
//                           <td className="p-3 font-bold text-green-700">{r.qty} pcs</td>
//                           <td className="p-3">{r.city}</td>
//                           <td className="p-3 font-mono text-xs">{r.invoice}</td>
//                           <td className="p-3">
//                             <button onClick={() => handleViewRecord(r)} className="text-blue-600 hover:text-blue-800">
//                               <Eye size={16} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="grid gap-4 lg:hidden">
//                   {currentRecords.map((r, i) => (
//                     <MobileRecordCard key={r.id || i} record={r} index={indexOfFirstRecord + i} onView={() => handleViewRecord(r)} />
//                   ))}
//                 </div>

//                 <div className="flex justify-between mt-6">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   <span>Page {currentPage} of {totalPages}</span>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ) : viewMode === "view" && selectedRecord ? (
//           <div className="p-8" ref={printRef}>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
//                 <Eye size={24} className="text-blue-600" /> Record Details
//               </h2>
//               <div className="space-x-4">
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className="flex items-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200 px-6 py-3 rounded-xl text-lg font-medium shadow-md transition-all duration-300"
//                 >
//                   <ArrowLeft size={20} /> Back to List
//                 </button>
//                 <button
//                   onClick={handlePrint}
//                   className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-md transition-all duration-300 hover:bg-blue-600"
//                 >
//                   <Printer size={20} /> Print
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
//               <DetailItem label="Record ID" value={selectedRecord.record_id || 'N/A'} Icon={Hash} />
//               <DetailItem label="4M Type" value={selectedRecord.four_m_type || 'N/A'} Icon={Package} />
//               <DetailItem label="Date of Incident" value={selectedRecord.date} Icon={Calendar} />
//               <DetailItem label="Part Name/Model" value={selectedRecord.part_name} Icon={Tag} />
//               <DetailItem label="Change Type" value={selectedRecord.change_type} Icon={FileText} />
//               <DetailItem label="Suspected Qty" value={selectedRecord.suspected_qty} unit="pcs" Icon={AlertTriangle} color="text-orange-600" />
//               <DetailItem label="Dispatch Date" value={selectedRecord.dispatch_date} Icon={Calendar} />
//               <DetailItem label="Qty Dispatched" value={selectedRecord.qty} unit="pcs" Icon={Truck} color="text-green-600" />
//               <DetailItem label="City" value={selectedRecord.city} Icon={MapPin} />
//               <DetailItem label="Invoice" value={selectedRecord.invoice} Icon={FileText} />
//               <DetailItem label="Remarks" value={selectedRecord.remarks || 'N/A'} Icon={FileText} />
//             </div>
//           </div>
//         ) : (
//           <div className="p-8">
//             {pendingRCRs.length === 0 ? (
//               <div className="text-center py-10">
//                 <EmptyState message="No pending RCRs. All RCRs have suspected lot records." />
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className="mt-4 flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all mx-auto"
//                 >
//                   <ArrowLeft size={20} /> Back to List
//                 </button>
//               </div>
//             ) : selectedRCR ? (
//               <div>
//                 <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-l-4 border-blue-500">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-bold mb-2">Creating Suspected Lot Record for {selectedRCR.record_id}</h3>
//                       <div className="flex gap-4 text-sm">
//                         <span>4M: <strong>{selectedRCR.four_m}</strong></span>
//                         <span>Type: <strong>{selectedRCR.category_type}</strong></span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => { setSelectedRCR(null); }}
//                       className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//                     >
//                       <ArrowLeft className="w-4 h-4" />
//                       Back
//                     </button>
//                   </div>
//                 </div>

//                 <div className="p-8 bg-gray-50/50 rounded-b-3xl border-t border-gray-200">
//                   <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
//                     <PlusCircle size={24} className="text-green-600" /> Enter Suspected Lot Data
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
//                     <FormInput label="Date of Change" name="date" type="date" value={formData.date} onChange={handleInputChange} disabled />
//                     <FormInput label="Part Name/Model" name="part_name" type="text" value={formData.part_name} onChange={handleInputChange} disabled />
//                     <FormInput label="Change Type/Source" name="change_type" type="text" value={formData.change_type} onChange={handleInputChange} disabled />
//                     <FormInput label="Suspected Qty (Total)" name="suspected_qty" type="number" value={formData.suspected_qty} onChange={handleInputChange} />
//                     <FormInput label="Dispatch Date" name="dispatch_date" type="date" value={formData.dispatch_date} onChange={handleInputChange} />
//                     <FormInput label="Qty Dispatched (Affected)" name="qty" type="number" value={formData.qty} onChange={handleInputChange} />
//                     <FormInput label="Customer City" name="city" type="text" value={formData.city} onChange={handleInputChange} />
//                     <FormInput label="Invoice/Reference" name="invoice" type="text" value={formData.invoice} onChange={handleInputChange} />
//                     <FormInput label="Containment Remarks" name="remarks" type="text" value={formData.remarks} onChange={handleInputChange} />
//                   </div>

//                   <div className="flex justify-end mt-8 space-x-4">
//                     <button
//                       onClick={() => { setSelectedRCR(null); }}
//                       className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all shadow-md"
//                       disabled={loading}
//                     >
//                       <X size={20} /> Cancel
//                     </button>
//                     <button
//                       onClick={handleAddRecord}
//                       disabled={loading}
//                       className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 transition-all shadow-lg shadow-blue-500/50 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
//                       {loading ? 'Saving...' : 'Save Record'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
//                     <AlertTriangle size={24} className="text-orange-600" />
//                     Pending RCRs
//                   </h2>
//                   <button
//                     onClick={() => setViewMode("list")}
//                     className="flex items-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200 px-6 py-3 rounded-xl text-lg font-medium shadow-md transition-all duration-300"
//                   >
//                     <ArrowLeft size={20} /> Back to List
//                   </button>
//                 </div>

//                 {loading ? (
//                   <div className="text-center py-8">
//                     <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
//                     <p className="text-gray-600">Loading pending RCRs...</p>
//                   </div>
//                 ) : (
//                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {pendingRCRs.map((rcr) => (
//                       <div
//                         key={rcr.id}
//                         className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
//                         onClick={() => handleSelectRCR(rcr)}
//                       >
//                         <div className="flex justify-between items-start mb-3">
//                           <div className="flex items-center gap-2">
//                             <Hash className="w-5 h-5 text-orange-600" />
//                             <span className="font-bold text-lg text-gray-800">{rcr.record_id}</span>
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs font-semibold text-gray-600">4M Type:</span>
//                             <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
//                               {rcr.four_m}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-2">
//                             <span className="text-xs font-semibold text-gray-600">Change Type:</span>
//                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${
//                               rcr.category_type === 'Planned' ? 'bg-green-100 text-green-700' :
//                               rcr.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-700' :
//                               'bg-red-100 text-red-700'
//                             }`}>
//                               {rcr.category_type}
//                             </span>
//                           </div>

//                           <div className="pt-2 border-t border-gray-100">
//                             <p className="text-xs text-gray-600 mb-1">Part: <span className="font-semibold">{rcr.part_name_number}</span></p>
//                             <p className="text-xs text-gray-600">Reject Qty: <span className="font-bold text-red-600">{rcr.reject_qty}</span> / Lot: <span className="font-bold text-blue-600">{rcr.lot_qty}</span></p>
//                           </div>
//                         </div>

//                         <button className="mt-4 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
//                           Create Suspected Lot Record
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Suspected;



import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  List,
  ArrowLeft,
  Save,
  X,
  Hash,
  Package,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  Tag,
  Truck,
  Loader,
  Search,
  Printer,
  Eye,
  Filter,
  Grid3X3,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  Receipt,
  MessageSquare,
  Boxes,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  Share2,
  Copy,
  RefreshCw,
} from "lucide-react";

interface SuspectedRecord {
  id?: number;
  rcr?: number;
  record_id?: string;
  four_m_type?: string;
  date: string;
  part_name: string;
  change_type: string;
  suspected_qty: string;
  dispatch_date: string;
  qty: string;
  city: string;
  invoice: string;
  remarks: string;
}

interface PendingRCR {
  id: number;
  record_id: string;
  four_m: string;
  category_type: string;
  part_name_number: string;
  type_of_change: string;
  date: string;
  reject_qty: number;
  lot_qty: number;
}

const API_BASE = "http://localhost:8000/api";

// Enhanced Form Input Component
const FormInput = ({
  label,
  name,
  type,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  icon: Icon,
}: any) => (
  <div className="group">
    <label
      htmlFor={name}
      className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
        />
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 ${
          disabled
            ? "bg-gray-50 cursor-not-allowed text-gray-500 border-gray-100"
            : "bg-white hover:border-gray-300"
        }`}
        required={!disabled}
      />
    </div>
  </div>
);

// Enhanced Detail Card Component
const DetailCard = ({
  label,
  value,
  unit,
  color = "text-gray-900",
  Icon,
  bgColor = "bg-gray-50",
  iconBg = "bg-gray-200",
  iconColor = "text-gray-600",
  large = false,
}: any) => (
  <div
    className={`${bgColor} border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group cursor-default`}
  >
    <div className="flex items-start gap-4">
      {Icon && (
        <div
          className={`${iconBg} ${iconColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={large ? 24 : 20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          {label}
        </div>
        <div
          className={`${large ? "text-2xl" : "text-lg"} font-bold ${color} truncate`}
        >
          {value || "—"}
          {unit && (
            <span className="text-sm font-medium text-gray-400 ml-1.5">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: any) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} p-3 rounded-xl`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend === "up" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          <TrendingUp
            size={16}
            className={trend === "down" ? "rotate-180" : ""}
          />
          {trendValue}
        </div>
      )}
    </div>
    <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
    <div className="text-sm font-medium text-gray-500">{title}</div>
  </div>
);

// Enhanced Table Row Component
const TableRow = ({
  record,
  index,
  onView,
}: {
  record: SuspectedRecord;
  index: number;
  onView: () => void;
}) => (
  <tr className="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100 last:border-0">
    <td className="px-5 py-4">
      <div className="flex items-center justify-center">
        <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
          {index + 1}
        </span>
      </div>
    </td>
    <td className="px-5 py-4">
      <div className="font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">
        {record.record_id || "—"}
      </div>
    </td>
    <td className="px-5 py-4">
      <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-sm">
        {record.four_m_type || "—"}
      </span>
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Calendar size={14} className="text-gray-400" />
        <span className="font-medium">{record.date}</span>
      </div>
    </td>
    <td className="px-5 py-4">
      <div className="font-semibold text-gray-900 max-w-[180px] truncate">
        {record.part_name}
      </div>
    </td>
    <td className="px-5 py-4">
      <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg">
        {record.change_type}
      </span>
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} className="text-orange-500" />
        <span className="font-bold text-orange-600">{record.suspected_qty}</span>
        <span className="text-xs text-gray-400">pcs</span>
      </div>
    </td>
    <td className="px-5 py-4">
      <span className="text-gray-600 font-medium">
        {record.dispatch_date || "—"}
      </span>
    </td>
    {/* <td className="px-5 py-4">
      <div className="flex items-center gap-2">
        <Truck size={16} className="text-emerald-500" />
        <span className="font-bold text-emerald-700">{record.qty}</span>
        <span className="text-xs text-gray-400">pcs</span>
      </div>
    </td> */}
    {/* <td className="px-5 py-4">
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-gray-400" />
        <span className="font-medium text-gray-700">{record.city || "—"}</span>
      </div>
    </td> */}
    {/* <td className="px-5 py-4">
      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
        {record.invoice || "—"}
      </span>
    </td> */}
    <td className="px-5 py-4">
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onView}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      </div>
    </td>
  </tr>
);

// Enhanced Card View Component
const RecordCard = ({
  record,
  index,
  onView,
}: {
  record: SuspectedRecord;
  index: number;
  onView: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
    {/* Card Header */}
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
            Record
          </div>
          <div className="text-2xl font-black">#{index + 1}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
            SUSPECTED
          </span>
          <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-semibold rounded-full">
            {record.four_m_type || "N/A"}
          </span>
        </div>
      </div>
      
      {record.record_id && (
        <div className="mt-4 flex items-center gap-2">
          <Hash size={14} className="text-indigo-300" />
          <span className="font-mono text-sm font-bold">{record.record_id}</span>
        </div>
      )}
    </div>

    {/* Card Body */}
    <div className="p-5 space-y-4">
      {/* Part Name */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Tag size={18} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-500 uppercase">Part / Model</div>
          <div className="font-bold text-gray-900 truncate">{record.part_name}</div>
        </div>
      </div>

      {/* Change Type */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <FileText size={18} className="text-red-600" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 uppercase">Change Type</div>
          <div className="font-bold text-red-600">{record.change_type}</div>
        </div>
      </div>

      {/* Quantities Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-orange-500" />
            <span className="text-xs font-semibold text-gray-500">Suspected</span>
          </div>
          <div className="text-xl font-black text-orange-600">
            {record.suspected_qty}
            <span className="text-sm font-medium text-orange-400 ml-1">pcs</span>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Truck size={14} className="text-emerald-500" />
            <span className="text-xs font-semibold text-gray-500">Dispatched</span>
          </div>
          <div className="text-xl font-black text-emerald-600">
            {record.qty}
            <span className="text-sm font-medium text-emerald-400 ml-1">pcs</span>
          </div>
        </div>
      </div>

      {/* Dates & Location */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Date</span>
          </div>
          <span className="font-semibold text-gray-800">{record.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Dispatch Date</span>
          </div>
          <span className="font-semibold text-gray-800">{record.dispatch_date || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">City</span>
          </div>
          <span className="font-semibold text-gray-800">{record.city || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Invoice</span>
          </div>
          <span className="font-mono text-sm font-semibold text-gray-800">
            {record.invoice || "—"}
          </span>
        </div>
      </div>

      {/* Remarks */}
      {record.remarks && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={14} className="text-blue-500" />
            <span className="text-xs font-semibold text-gray-500">Remarks</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{record.remarks}</p>
        </div>
      )}
    </div>

    {/* Card Footer */}
    <div className="px-5 pb-5">
      <button
        onClick={onView}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]"
      >
        <Eye size={18} />
        View Full Details
      </button>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({
  message,
  icon: Icon = FileText,
  action,
  actionLabel,
}: {
  message: string;
  icon?: any;
  action?: () => void;
  actionLabel?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
      <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-xl">
        <Icon className="w-12 h-12 text-white" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Found</h3>
    <p className="text-gray-500 max-w-md mb-6">{message}</p>
    {action && actionLabel && (
      <button
        onClick={action}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// View Toggle Component
const ViewToggle = ({
  view,
  setView,
}: {
  view: "table" | "card";
  setView: (view: "table" | "card") => void;
}) => (
  <div className="flex items-center bg-gray-100 rounded-xl p-1.5">
    <button
      onClick={() => setView("table")}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
        view === "table"
          ? "bg-white text-indigo-700 shadow-md"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <LayoutList size={18} />
      <span className="hidden sm:inline">Table</span>
    </button>
    <button
      onClick={() => setView("card")}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
        view === "card"
          ? "bg-white text-indigo-700 shadow-md"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <Grid3X3 size={18} />
      <span className="hidden sm:inline">Cards</span>
    </button>
  </div>
);

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  totalRecords,
  startIndex,
  endIndex,
}: any) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
    <div className="text-sm text-gray-600">
      Showing{" "}
      <span className="font-bold text-gray-900">
        {startIndex + 1} - {Math.min(endIndex, totalRecords)}
      </span>{" "}
      of <span className="font-bold text-gray-900">{totalRecords}</span> records
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronLeft size={18} />
        Previous
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
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
              className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                currentPage === pageNum
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      
      <button
        onClick={onNext}
        disabled={currentPage === totalPages || totalPages === 0}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

const Suspected: React.FC = () => {
  const [records, setRecords] = useState<SuspectedRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SuspectedRecord[]>([]);
  const [pendingRCRs, setPendingRCRs] = useState<PendingRCR[]>([]);
  const [selectedRCR, setSelectedRCR] = useState<PendingRCR | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<SuspectedRecord | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "add" | "view">("list");
  const [listView, setListView] = useState<"table" | "card">("table");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SuspectedRecord>({
    date: "",
    part_name: "",
    change_type: "",
    suspected_qty: "",
    dispatch_date: "",
    qty: "",
    city: "",
    invoice: "",
    remarks: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = listView === "card" ? 9 : 10;
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRecords();
    fetchPendingRCRs();
  }, []);

  useEffect(() => {
    let result = records;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((r) =>
        Object.values(r).some((val) =>
          val?.toString().toLowerCase().includes(term)
        )
      );
    }

    setFilteredRecords(result);
    setCurrentPage(1);
  }, [searchTerm, records]);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_BASE}/suspected-lot/`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const fetchPendingRCRs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/suspected-lot/pending_rcrs/`);
      if (res.ok) {
        const data = await res.json();
        setPendingRCRs(data);
      }
    } catch (err) {
      console.error("Error fetching pending RCRs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRCR = (rcr: PendingRCR) => {
    setSelectedRCR(rcr);
    setFormData({
      date: rcr.date,
      part_name: rcr.part_name_number,
      change_type: rcr.category_type,
      suspected_qty: rcr.reject_qty.toString(),
      dispatch_date: "",
      qty: "",
      city: "",
      invoice: "",
      remarks: "",
    });
    setViewMode("add");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = async () => {
    if (!selectedRCR) return;

    try {
      setLoading(true);
      const payload = {
        rcr: selectedRCR.id,
        date: formData.date,
        part_name: formData.part_name,
        change_type: formData.change_type,
        suspected_qty: parseInt(formData.suspected_qty) || 0,
        dispatch_date: formData.dispatch_date,
        qty: parseInt(formData.qty) || 0,
        city: formData.city,
        invoice: formData.invoice,
        remarks: formData.remarks,
      };

      const res = await fetch(`${API_BASE}/suspected-lot/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({
          date: "",
          part_name: "",
          change_type: "",
          suspected_qty: "",
          dispatch_date: "",
          qty: "",
          city: "",
          invoice: "",
          remarks: "",
        });
        setSelectedRCR(null);
        setViewMode("list");
        await fetchRecords();
        await fetchPendingRCRs();
      }
    } catch (error) {
      console.error("Error saving record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record: SuspectedRecord) => {
    setSelectedRecord(record);
    setViewMode("view");
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Calculate stats
  const totalSuspected = records.reduce(
    (sum, r) => sum + (parseInt(r.suspected_qty) || 0),
    0
  );
  const totalDispatched = records.reduce(
    (sum, r) => sum + (parseInt(r.qty) || 0),
    0
  );

  return (
    <div className="max-auto bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pb-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-8 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full translate-y-32 -translate-x-32 blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-400/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
                  <AlertTriangle size={36} className="text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Suspected Lot Traceability
                  </h1>
                  <p className="text-indigo-200 mt-2 text-lg">
                    Track and manage suspected quality issues
                  </p>
                </div>
              </div>

              {viewMode === "list" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchRecords}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/20"
                    title="Refresh"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("add")}
                    disabled={pendingRCRs.length === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
                  >
                    <PlusCircle size={22} />
                    <span>View Pending RCRs</span>
                    {pendingRCRs.length > 0 && (
                      <span className="ml-1 px-2.5 py-0.5 bg-white/20 rounded-full text-sm">
                        {pendingRCRs.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          {viewMode === "list" ? (
            <div className="p-6 lg:p-8">
              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                  title="Total Records"
                  value={records.length}
                  icon={Boxes}
                  color="bg-indigo-600"
                />
                <StatsCard
                  title="Total Suspected"
                  value={totalSuspected.toLocaleString()}
                  icon={AlertTriangle}
                  color="bg-orange-500"
                  trend="up"
                  trendValue="Active"
                />
                <StatsCard
                  title="Total Dispatched"
                  value={totalDispatched.toLocaleString()}
                  icon={Truck}
                  color="bg-emerald-600"
                />
                <StatsCard
                  title="Pending RCRs"
                  value={pendingRCRs.length}
                  icon={Activity}
                  color="bg-purple-600"
                />
              </div>

              {/* Controls Section */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-100 rounded-xl">
                    <List size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Traceability Records
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {filteredRecords.length} records found
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 lg:flex-none lg:min-w-[320px]">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* View Toggle */}
                  <ViewToggle view={listView} setView={setListView} />
                </div>
              </div>

              {/* Records Display */}
              {filteredRecords.length === 0 ? (
                <EmptyState
                  message="No suspected lot records found. Start by creating records from pending RCRs."
                  icon={FileText}
                  action={() => setViewMode("add")}
                  actionLabel="View Pending RCRs"
                />
              ) : (
                <>
                  {/* Table View */}
                  {listView === "table" && (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                              {[
                                "S.No.",
                                "Record ID",
                                "4M Type",
                                "Date",
                                "Part / Model",
                                "Change Type",
                                "Suspected Qty",
                                "Dispatch Date",
                                // "Dispatched",
                                // "City",
                                // "Invoice",
                                "Actions",
                              ].map((h, i) => (
                                <th
                                  key={i}
                                  className="px-5 py-4 text-left font-bold uppercase tracking-wider text-xs whitespace-nowrap"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {currentRecords.map((r, i) => (
                              <TableRow
                                key={r.id || i}
                                record={r}
                                index={indexOfFirstRecord + i}
                                onView={() => handleViewRecord(r)}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Card View */}
                  {listView === "card" && (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {currentRecords.map((r, i) => (
                        <RecordCard
                          key={r.id || i}
                          record={r}
                          index={indexOfFirstRecord + i}
                          onView={() => handleViewRecord(r)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    totalRecords={filteredRecords.length}
                    startIndex={indexOfFirstRecord}
                    endIndex={indexOfLastRecord}
                  />
                </>
              )}
            </div>
          ) : viewMode === "view" && selectedRecord ? (
            /* Enhanced Detail View */
            <div className="p-6 lg:p-8" ref={printRef}>
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setViewMode("list")}
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:scale-105"
                  >
                    <ArrowLeft size={22} />
                  </button>
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-100 rounded-xl">
                        <Eye size={24} className="text-indigo-600" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
                        Record Details
                      </h2>
                    </div>
                    {selectedRecord.record_id && (
                      <p className="text-gray-500 mt-2 ml-14 font-mono">
                        ID: {selectedRecord.record_id}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-all">
                    <Share2 size={18} />
                    <span className="hidden sm:inline">Share</span>
                  </button> */}
                  {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-all">
                    <Download size={18} />
                    <span className="hidden sm:inline">Export</span>
                  </button> */}
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Printer size={18} />
                    Print
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <AlertTriangle size={32} />
                    </div>
                    <div>
                      <div className="text-orange-100 text-sm font-semibold uppercase tracking-wider">
                        Status
                      </div>
                      <div className="text-2xl font-black">SUSPECTED LOT</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black">
                      {selectedRecord.suspected_qty}
                      <span className="text-lg font-medium ml-2">pcs</span>
                    </div>
                    <div className="text-orange-100 text-sm">Total Suspected</div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <DetailCard
                  label="Record ID"
                  value={selectedRecord.record_id}
                  Icon={Hash}
                  color="text-indigo-700"
                  bgColor="bg-indigo-50"
                  iconBg="bg-indigo-200"
                  iconColor="text-indigo-700"
                  large
                />
                <DetailCard
                  label="4M Type"
                  value={selectedRecord.four_m_type}
                  Icon={Package}
                  bgColor="bg-purple-50"
                  iconBg="bg-purple-200"
                  iconColor="text-purple-700"
                />
                <DetailCard
                  label="Date of Change"
                  value={selectedRecord.date}
                  Icon={Calendar}
                  bgColor="bg-blue-50"
                  iconBg="bg-blue-200"
                  iconColor="text-blue-700"
                />
                <DetailCard
                  label="Part / Model"
                  value={selectedRecord.part_name}
                  Icon={Tag}
                  bgColor="bg-teal-50"
                  iconBg="bg-teal-200"
                  iconColor="text-teal-700"
                />
                <DetailCard
                  label="Change Type"
                  value={selectedRecord.change_type}
                  Icon={FileText}
                  color="text-red-600"
                  bgColor="bg-red-50"
                  iconBg="bg-red-200"
                  iconColor="text-red-700"
                />
                <DetailCard
                  label="Suspected Qty"
                  value={selectedRecord.suspected_qty}
                  unit="pcs"
                  Icon={AlertTriangle}
                  color="text-orange-600"
                  bgColor="bg-orange-50"
                  iconBg="bg-orange-200"
                  iconColor="text-orange-700"
                />
              </div>

              {/* Dispatch Information */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Truck size={22} className="text-emerald-600" />
                  Dispatch Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <DetailCard
                    label="Dispatch Date"
                    value={selectedRecord.dispatch_date}
                    Icon={Calendar}
                  />
                  <DetailCard
                    label="Qty Dispatched"
                    value={selectedRecord.qty}
                    unit="pcs"
                    Icon={Truck}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    iconBg="bg-emerald-200"
                    iconColor="text-emerald-700"
                  />
                  <DetailCard
                    label="Customer City"
                    value={selectedRecord.city}
                    Icon={MapPin}
                  />
                  <DetailCard
                    label="Invoice / Reference"
                    value={selectedRecord.invoice}
                    Icon={Receipt}
                  />
                </div>
              </div>

              {/* Remarks Section */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={22} className="text-blue-600" />
                  Containment / Remarks
                </h3>
                <div className="bg-white rounded-xl p-5 border border-blue-200">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {selectedRecord.remarks || "No remarks or containment actions recorded."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Add / Pending RCR Mode */
            <div className="p-6 lg:p-8">
              {pendingRCRs.length === 0 ? (
                <div className="text-center py-16">
                  <EmptyState
                    message="No pending RCRs available at the moment. All records have been processed."
                    icon={CheckCircle2}
                  />
                  <button
                    onClick={() => setViewMode("list")}
                    className="mt-6 inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
                  >
                    <ArrowLeft size={20} />
                    Back to Records
                  </button>
                </div>
              ) : selectedRCR ? (
                <div>
                  {/* Form Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={() => setSelectedRCR(null)}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-all hover:scale-105"
                    >
                      <ArrowLeft size={22} />
                    </button>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
                        Create Suspected Lot Record
                      </h2>
                      <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Hash size={16} />
                        Record ID: <strong className="text-indigo-600">{selectedRCR.record_id}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Source RCR Info */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
                      Source RCR Information
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-indigo-100">
                        <div className="text-xs text-gray-500 mb-1">4M Type</div>
                        <div className="font-bold text-indigo-700">{selectedRCR.four_m}</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-indigo-100">
                        <div className="text-xs text-gray-500 mb-1">Category</div>
                        <div className="font-bold text-purple-700">{selectedRCR.category_type}</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-indigo-100">
                        <div className="text-xs text-gray-500 mb-1">Reject Qty</div>
                        <div className="font-bold text-red-600">{selectedRCR.reject_qty}</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-indigo-100">
                        <div className="text-xs text-gray-500 mb-1">Lot Qty</div>
                        <div className="font-bold text-blue-600">{selectedRCR.lot_qty}</div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <FormInput
                        label="Date of Change"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        disabled
                        icon={Calendar}
                      />
                      <FormInput
                        label="Part Name / Model"
                        name="part_name"
                        type="text"
                        value={formData.part_name}
                        onChange={handleInputChange}
                        disabled
                        icon={Tag}
                      />
                      <FormInput
                        label="Change Type / Source"
                        name="change_type"
                        type="text"
                        value={formData.change_type}
                        onChange={handleInputChange}
                        disabled
                        icon={FileText}
                      />
                      <FormInput
                        label="Suspected Qty (Total)"
                        name="suspected_qty"
                        type="number"
                        value={formData.suspected_qty}
                        onChange={handleInputChange}
                        placeholder="Enter quantity"
                        icon={AlertTriangle}
                      />
                      <FormInput
                        label="Dispatch Date"
                        name="dispatch_date"
                        type="date"
                        value={formData.dispatch_date}
                        onChange={handleInputChange}
                        icon={Calendar}
                      />
                      <FormInput
                        label="Qty Dispatched (Affected)"
                        name="qty"
                        type="number"
                        value={formData.qty}
                        onChange={handleInputChange}
                        placeholder="Enter dispatched qty"
                        icon={Truck}
                      />
                      <FormInput
                        label="Customer City"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city name"
                        icon={MapPin}
                      />
                      <FormInput
                        label="Invoice / Reference"
                        name="invoice"
                        type="text"
                        value={formData.invoice}
                        onChange={handleInputChange}
                        placeholder="Enter invoice number"
                        icon={Receipt}
                      />
                      
                      {/* Remarks - Full Width */}
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                          Containment / Remarks
                        </label>
                        <div className="relative">
                          <MessageSquare
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                          />
                          <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            placeholder="Enter any containment actions or remarks..."
                            rows={4}
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all bg-white hover:border-gray-300 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedRCR(null)}
                        disabled={loading}
                        className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <X size={20} />
                        Cancel
                      </button>
                      <button
                        onClick={handleAddRecord}
                        disabled={loading}
                        className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-105"
                      >
                        {loading ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <Save size={20} />
                        )}
                        {loading ? "Saving..." : "Save Record"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pending RCRs List */
                <div>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <AlertTriangle size={28} className="text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
                          Pending RCRs
                        </h2>
                        <p className="text-gray-500 mt-1">
                          {pendingRCRs.length} records awaiting traceability
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewMode("list")}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-800 transition-all hover:scale-105"
                    >
                      <ArrowLeft size={20} />
                      Back to List
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-20">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl animate-pulse"></div>
                        <Loader className="relative animate-spin w-16 h-16 text-indigo-600" />
                      </div>
                      <p className="text-gray-600 text-lg mt-6 font-medium">
                        Loading pending RCRs...
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {pendingRCRs.map((rcr) => (
                        <div
                          key={rcr.id}
                          onClick={() => handleSelectRCR(rcr)}
                          className="group bg-white rounded-2xl shadow-lg border-l-4 border-orange-500 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                        >
                          {/* Card Header */}
                          <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                                  <Hash className="text-orange-600" size={22} />
                                </div>
                                <span className="font-black text-xl text-gray-900">
                                  {rcr.record_id}
                                </span>
                              </div>
                              <span className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full animate-pulse">
                                PENDING
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full shadow-sm">
                                {rcr.four_m}
                              </span>
                              <span
                                className={`px-3 py-1.5 text-sm font-bold rounded-full shadow-sm ${
                                  rcr.category_type === "Planned"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                                    : rcr.category_type === "Unplanned"
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                }`}
                              >
                                {rcr.category_type}
                              </span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3">
                              <Tag size={18} className="text-gray-400 mt-0.5" />
                              <div>
                                <div className="text-xs text-gray-500 font-medium uppercase">
                                  Part Name
                                </div>
                                <div className="font-bold text-gray-900">
                                  {rcr.part_name_number}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                <div className="flex items-center gap-2 text-red-600 mb-1">
                                  <XCircle size={16} />
                                  <span className="text-xs font-bold uppercase">Reject</span>
                                </div>
                                <div className="text-2xl font-black text-red-700">
                                  {rcr.reject_qty}
                                </div>
                              </div>
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-600 mb-1">
                                  <Boxes size={16} />
                                  <span className="text-xs font-bold uppercase">Lot Qty</span>
                                </div>
                                <div className="text-2xl font-black text-blue-700">
                                  {rcr.lot_qty}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="p-6 pt-0">
                            <button className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white py-4 rounded-xl font-bold shadow-lg group-hover:shadow-xl group-hover:from-orange-600 group-hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2">
                              <PlusCircle size={20} />
                              Create Suspected Lot Record
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suspected;