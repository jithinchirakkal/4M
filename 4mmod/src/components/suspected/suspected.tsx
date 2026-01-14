// import React, { useState } from "react";
// import { PlusCircle, List, ArrowLeft, Save, X, Hash, Package, Calendar, MapPin, FileText, AlertTriangle, Tag, Truck, Ruler, LucideIcon } from "lucide-react";

// // RENAMED the interface to SuspectedRecord to avoid conflict with global utility type Record<K, T>
// interface SuspectedRecord {
//   id?: number;
//   date: string;
//   partName: string;
//   changeType: string;
//   suspectedQty: string;
//   dispatchDate: string;
//   qty: string;
//   city: string;
//   invoice: string;
//   remarks: string;
// }

// // Helper component for styled form inputs (Unchanged, already optimized)
// const FormInput = ({ label, name, type, value, onChange }: { label: string, name: keyof SuspectedRecord, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
//     <div>
//         <label htmlFor={name as string} className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">
//             {label}
//         </label>
//         <input
//             id={name as string}
//             type={type}
//             name={name as string}
//             value={value}
//             onChange={onChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base shadow-inner shadow-gray-200/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
//             required
//         />
//     </div>
// );

// const Suspected: React.FC = () => {
//   const [records, setRecords] = useState<SuspectedRecord[]>([
//     {
//       date: "2025-10-20",
//       partName: "Part A (Model 1)",
//       changeType: "Design Rev A",
//       suspectedQty: "100",
//       dispatchDate: "2025-10-21",
//       qty: "95",
//       city: "Delhi",
//       invoice: "INV001-25",
//       remarks: "Initial containment on Line 3.",
//     },
//     {
//       date: "2025-10-19",
//       partName: "Part B (Model 2)",
//       changeType: "Material Lot X",
//       suspectedQty: "250",
//       dispatchDate: "2025-10-20",
//       qty: "180",
//       city: "Mumbai",
//       invoice: "INV002-25",
//       remarks: "External material fault flagged.",
//     },
//   ]);

//   const [viewMode, setViewMode] = useState<"list" | "add">("list");
//   const [formData, setFormData] = useState<SuspectedRecord>({
//     date: "",
//     partName: "",
//     changeType: "",
//     suspectedQty: "",
//     dispatchDate: "",
//     qty: "",
//     city: "",
//     invoice: "",
//     remarks: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name as keyof SuspectedRecord]: value }));
//   };

//   const handleAddRecord = () => {
//     setRecords(prev => [...prev, { ...formData, id: Date.now() }]);
//     setFormData({
//       date: "",
//       partName: "",
//       changeType: "",
//       suspectedQty: "",
//       dispatchDate: "",
//       qty: "",
//       city: "",
//       invoice: "",
//       remarks: "",
//     });
//     setViewMode("list");
//   };

//   // 1. FIX: Explicitly define iconMap type using the global utility type
//   const FieldIcon = ({ field }: { field: keyof SuspectedRecord }) => {
//     const iconMap: Record<keyof SuspectedRecord, LucideIcon> = {
//         date: Calendar,
//         partName: Tag,
//         changeType: FileText,
//         suspectedQty: Package,
//         dispatchDate: Truck,
//         qty: Hash,
//         city: MapPin,
//         invoice: FileText,
//         remarks: FileText,
//         id: Hash
//     };
//     const Icon = iconMap[field] || FileText;
//     return <Icon size={16} className="text-blue-500 mr-2" />;
//   }

//   // 2. FIX: Explicitly define the map object using the global utility type
//   const DetailItem = ({ label, value, unit, color = 'text-gray-800', icon: IconName }: any) => {
//     const iconMap: Record<string, LucideIcon> = {
//         Package: Package,
//         FileText: FileText,
//         Calendar: Calendar,
//         AlertTriangle: AlertTriangle,
//         Truck: Truck,
//         MapPin: MapPin,
//         Tag: Tag,
//         Hash: Hash,
//         Ruler: Ruler // Included in imports list
//     };
//     const Icon = iconMap[IconName];
//     return (
//         <div className="flex justify-between items-start">
//             <span className="text-xs font-medium text-gray-500 flex items-center">
//                 {Icon && <Icon size={14} className="mr-1 text-gray-400" />} {label}
//             </span>
//             <span className={`text-sm font-semibold ${color} text-right`}>
//                 {value} {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
//             </span>
//         </div>
//     );
//   };
//   // --- End Adaptive Card View Helpers ---


//   const MobileRecordCard = ({ record, index }: { record: SuspectedRecord, index: number }) => (
//     <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 space-y-3 lg:hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
//         <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//             <span className="text-lg font-bold text-blue-600">Record #{index + 1}</span>
//             <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold shadow-sm">SUSPECTED</span>
//         </div>
//         <DetailItem label="Part Name/Model" value={record.partName} icon="Tag" />
//         <DetailItem label="Change Type" value={record.changeType} icon="FileText" />
//         <DetailItem label="Date of Incident" value={record.date} icon="Calendar" />
//         <DetailItem label="Suspected Qty" value={record.suspectedQty} unit="pcs" icon="AlertTriangle" color="text-orange-600" />
//         <DetailItem label="Qty Dispatched" value={record.qty} unit="pcs" icon="Truck" color="text-green-600" />
//         <DetailItem label="Invoice / City" value={`${record.invoice} / ${record.city}`} icon="MapPin" />
//         <DetailItem label="Dispatch Date" value={record.dispatchDate} icon="Calendar" />
//         {/* <DetailItem label="Remarks" value={record.remarks} icon="FileText" /> */}
//     </div>
//   );


//   return (
//     <div className="min-h-screen">
//       <div className="max-w-full mx-auto bg-white shadow-2xl rounded-3xl border border-gray-100">
        
//         {/* Header: Max Attractive Gradient Bar */}
//         <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 flex justify-between items-center rounded-t-3xl shadow-lg shadow-indigo-500/50">
//           <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
//             <AlertTriangle size={28} className="text-yellow-300"/>
//             Suspected Lot Traceability Record
//           </h1>
//           {viewMode === "list" ? (
//             <button
//               onClick={() => setViewMode("add")}
//               className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-lg font-bold shadow-md shadow-green-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
//             >
//               <PlusCircle size={20} /> Add New Record
//             </button>
//           ) : (
//             <button
//               onClick={() => setViewMode("list")}
//               className="flex items-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200 px-6 py-3 rounded-xl text-lg font-medium shadow-md transition-all duration-300"
//             >
//               <ArrowLeft size={20} /> Back to List
//             </button>
//           )}
//         </div>

//         {/* Content Area */}
//         {viewMode === "list" ? (
//           <div className="p-8">
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
//                 <List size={24} className="text-blue-600"/> All Traceability Records
//             </h2>
            
//             {records.length === 0 ? (
//               <div className="text-gray-500 text-center py-10 border border-dashed border-gray-300 rounded-xl bg-gray-50/70">
//                 <p className="text-lg font-medium">
//                   No records found. Click **Add New Record** to begin tracking.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {/* 1. Full Table View (lg screens and up) */}
//                 <div className="hidden lg:block shadow-lg rounded-xl overflow-x-auto border border-gray-200">
//                     <table className="w-full text-sm">
//                       <thead className="bg-blue-600/90 text-white sticky top-0">
//                         <tr className="uppercase text-xs font-extrabold tracking-wider">
//                           {[
//                             "S.No.", "Date", "Part Name/Model", "Change Type", 
//                             "Suspected Qty", "Dispatch Date", "Qty Affected", 
//                             "City", "Invoice",
//                             // "Remarks" 
//                           ].map((heading, idx) => (
//                             <th key={idx} className="p-3 border-r border-blue-500 last:border-r-0 text-left whitespace-nowrap min-w-[120px]">
//                               {heading}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {records.map((r, i) => (
//                           <tr
//                             key={r.id || i}
//                             className="border-b border-gray-100 hover:bg-blue-50/70 transition-colors even:bg-gray-50/50"
//                           >
//                             <td className="p-3 text-center font-bold text-gray-700">{i + 1}</td>
//                             <td className="p-3 font-medium">{r.date}</td>
//                             <td className="p-3 font-semibold text-gray-800">{r.partName}</td>
//                             <td className="p-3 text-red-600 font-medium">{r.changeType}</td>
//                             <td className="p-3 font-extrabold text-orange-600">{r.suspectedQty} pcs</td>
//                             <td className="p-3">{r.dispatchDate}</td>
//                             <td className="p-3 font-bold text-green-700">{r.qty} pcs</td>
//                             <td className="p-3">{r.city}</td>
//                             <td className="p-3 font-mono text-xs">{r.invoice}</td>
//                             {/* <td className="p-3 text-gray-600 max-w-xs truncate">{r.remarks}</td> */}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                 </div>

//                 {/* 2. Adaptive Card View (Mobile/md screens) */}
//                 <div className="grid gap-4 lg:hidden">
//                     {records.map((r, i) => (
//                         <MobileRecordCard key={r.id || i} record={r} index={i} />
//                     ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="p-8 bg-gray-50/50 rounded-b-3xl border-t border-gray-200">
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
//                 <PlusCircle size={24} className="text-green-600"/> Enter Suspected Lot Data
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
//               <FormInput label="Date of Change" name="date" type="date" value={formData.date} onChange={handleInputChange} />
//               <FormInput label="Part Name/Model" name="partName" type="text" value={formData.partName} onChange={handleInputChange} />
//               <FormInput label="Change Type/Source" name="changeType" type="text" value={formData.changeType} onChange={handleInputChange} />
//               <FormInput label="Suspected Qty (Total)" name="suspectedQty" type="number" value={formData.suspectedQty} onChange={handleInputChange} />
//               <FormInput label="Dispatch Date" name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleInputChange} />
//               <FormInput label="Qty Dispatched (Affected)" name="qty" type="number" value={formData.qty} onChange={handleInputChange} />
//               <FormInput label="Customer City" name="city" type="text" value={formData.city} onChange={handleInputChange} />
//               <FormInput label="Invoice/Reference" name="invoice" type="text" value={formData.invoice} onChange={handleInputChange} />
//               <FormInput label="Containment Remarks" name="remarks" type="text" value={formData.remarks} onChange={handleInputChange} />
//             </div>

//             <div className="flex justify-end mt-8 space-x-4">
//               <button
//                 onClick={() => setViewMode("list")}
//                 className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all shadow-md"
//               >
//                 <X size={20}/> Cancel
//               </button>
//               <button
//                 onClick={handleAddRecord}
//                 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 transition-all shadow-lg shadow-blue-500/50 transform hover:-translate-y-0.5"
//               >
//                 <Save size={20}/> Save Record
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Suspected;
// right one above 

import React, { useState, useEffect } from "react";
import { PlusCircle, List, ArrowLeft, Save, X, Hash, Package, Calendar, MapPin, FileText, AlertTriangle, Tag, Truck, Loader } from "lucide-react";

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

const API_BASE = 'http://localhost:8000/api';

const FormInput = ({ label, name, type, value, onChange, disabled = false }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-base shadow-inner shadow-gray-200/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
      }`}
      required={!disabled}
    />
  </div>
);

const DetailItem = ({ label, value, unit, color = 'text-gray-800', Icon }: any) => (
  <div className="flex justify-between items-start">
    <span className="text-xs font-medium text-gray-500 flex items-center">
      {Icon && <Icon size={14} className="mr-1 text-gray-400" />} {label}
    </span>
    <span className={`text-sm font-semibold ${color} text-right`}>
      {value} {unit && <span className="text-xs font-normal text-gray-500">{unit}</span>}
    </span>
  </div>
);

const MobileRecordCard = ({ record, index }: { record: SuspectedRecord, index: number }) => (
  <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 space-y-3 lg:hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
      <span className="text-lg font-bold text-blue-600">Record #{index + 1}</span>
      <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold shadow-sm">SUSPECTED</span>
    </div>
    <DetailItem label="Part Name/Model" value={record.part_name} Icon={Tag} />
    <DetailItem label="Change Type" value={record.change_type} Icon={FileText} />
    <DetailItem label="Date of Incident" value={record.date} Icon={Calendar} />
    <DetailItem label="Suspected Qty" value={record.suspected_qty} unit="pcs" Icon={AlertTriangle} color="text-orange-600" />
    <DetailItem label="Qty Dispatched" value={record.qty} unit="pcs" Icon={Truck} color="text-green-600" />
    <DetailItem label="Invoice / City" value={`${record.invoice} / ${record.city}`} Icon={MapPin} />
    <DetailItem label="Dispatch Date" value={record.dispatch_date} Icon={Calendar} />
  </div>
);

const Suspected: React.FC = () => {
  const [records, setRecords] = useState<SuspectedRecord[]>([]);
  const [pendingRCRs, setPendingRCRs] = useState<PendingRCR[]>([]);
  const [selectedRCR, setSelectedRCR] = useState<PendingRCR | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "add">("list");
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

  useEffect(() => {
    fetchRecords();
    fetchPendingRCRs();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_BASE}/suspected-lot/`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
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
      console.error('Error fetching pending RCRs:', err);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = async () => {
    if (!selectedRCR) {
      alert('No RCR selected');
      return;
    }

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert('Failed to save record');
        return;
      }

      alert('Suspected Lot record saved successfully!');
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
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Unexpected error occurred');
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
    <div className="min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-2xl rounded-3xl border border-gray-100">
        
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 flex justify-between items-center rounded-t-3xl shadow-lg shadow-indigo-500/50">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <AlertTriangle size={28} className="text-yellow-300"/>
            Suspected Lot Traceability Record
          </h1>
          {viewMode === "list" && (
            <button
              onClick={() => setViewMode("add")}
              disabled={pendingRCRs.length === 0}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-lg font-bold shadow-md shadow-green-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <PlusCircle size={20} /> View Pending RCRs
            </button>
          )}
        </div>

        {viewMode === "list" ? (
          <div className="p-8">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
              <List size={24} className="text-blue-600"/> All Traceability Records
            </h2>
            
            {records.length === 0 ? (
              <EmptyState message="No suspected lot records found. Complete pending RCRs to begin tracking." />
            ) : (
              <>
                <div className="hidden lg:block shadow-lg rounded-xl overflow-x-auto border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-600/90 text-white sticky top-0">
                      <tr className="uppercase text-xs font-extrabold tracking-wider">
                        {[
                          "S.No.", "Record ID", "4M Type", "Date", "Part Name/Model", "Change Type", 
                          "Suspected Qty", "Dispatch Date", "Qty Affected", 
                          "City", "Invoice",
                        ].map((heading, idx) => (
                          <th key={idx} className="p-3 border-r border-blue-500 last:border-r-0 text-left whitespace-nowrap min-w-[120px]">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r, i) => (
                        <tr
                          key={r.id || i}
                          className="border-b border-gray-100 hover:bg-blue-50/70 transition-colors even:bg-gray-50/50"
                        >
                          <td className="p-3 text-center font-bold text-gray-700">{i + 1}</td>
                          <td className="p-3 font-mono text-xs text-blue-600">{r.record_id || 'N/A'}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                              {r.four_m_type || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3 font-medium">{r.date}</td>
                          <td className="p-3 font-semibold text-gray-800">{r.part_name}</td>
                          <td className="p-3 text-red-600 font-medium">{r.change_type}</td>
                          <td className="p-3 font-extrabold text-orange-600">{r.suspected_qty} pcs</td>
                          <td className="p-3">{r.dispatch_date}</td>
                          <td className="p-3 font-bold text-green-700">{r.qty} pcs</td>
                          <td className="p-3">{r.city}</td>
                          <td className="p-3 font-mono text-xs">{r.invoice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 lg:hidden">
                  {records.map((r, i) => (
                    <MobileRecordCard key={r.id || i} record={r} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-8">
            {pendingRCRs.length === 0 ? (
              <div className="text-center py-10">
                <EmptyState message="No pending RCRs. All RCRs have suspected lot records." />
                <button
                  onClick={() => setViewMode("list")}
                  className="mt-4 flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all mx-auto"
                >
                  <ArrowLeft size={20} /> Back to List
                </button>
              </div>
            ) : selectedRCR ? (
              <div>
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold mb-2">Creating Suspected Lot Record for {selectedRCR.record_id}</h3>
                      <div className="flex gap-4 text-sm">
                        <span>4M: <strong>{selectedRCR.four_m}</strong></span>
                        <span>Type: <strong>{selectedRCR.category_type}</strong></span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedRCR(null); }}
                      className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-gray-50/50 rounded-b-3xl border-t border-gray-200">
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
                    <PlusCircle size={24} className="text-green-600"/> Enter Suspected Lot Data
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <FormInput label="Date of Change" name="date" type="date" value={formData.date} onChange={handleInputChange} disabled />
                    <FormInput label="Part Name/Model" name="part_name" type="text" value={formData.part_name} onChange={handleInputChange} disabled />
                    <FormInput label="Change Type/Source" name="change_type" type="text" value={formData.change_type} onChange={handleInputChange} disabled />
                    <FormInput label="Suspected Qty (Total)" name="suspected_qty" type="number" value={formData.suspected_qty} onChange={handleInputChange} />
                    <FormInput label="Dispatch Date" name="dispatch_date" type="date" value={formData.dispatch_date} onChange={handleInputChange} />
                    <FormInput label="Qty Dispatched (Affected)" name="qty" type="number" value={formData.qty} onChange={handleInputChange} />
                    <FormInput label="Customer City" name="city" type="text" value={formData.city} onChange={handleInputChange} />
                    <FormInput label="Invoice/Reference" name="invoice" type="text" value={formData.invoice} onChange={handleInputChange} />
                    <FormInput label="Containment Remarks" name="remarks" type="text" value={formData.remarks} onChange={handleInputChange} />
                  </div>

                  <div className="flex justify-end mt-8 space-x-4">
                    <button
                      onClick={() => { setSelectedRCR(null); }}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all shadow-md"
                      disabled={loading}
                    >
                      <X size={20}/> Cancel
                    </button>
                    <button
                      onClick={handleAddRecord}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 transition-all shadow-lg shadow-blue-500/50 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20}/>}
                      {loading ? 'Saving...' : 'Save Record'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                    <AlertTriangle size={24} className="text-orange-600" />
                    Pending RCRs
                  </h2>
                  <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200 px-6 py-3 rounded-xl text-lg font-medium shadow-md transition-all duration-300"
                  >
                    <ArrowLeft size={20} /> Back to List
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading pending RCRs...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingRCRs.map((rcr) => (
                      <div
                        key={rcr.id}
                        className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                        onClick={() => handleSelectRCR(rcr)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Hash className="w-5 h-5 text-orange-600" />
                            <span className="font-bold text-lg text-gray-800">{rcr.record_id}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600">4M Type:</span>
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                              {rcr.four_m}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600">Change Type:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              rcr.category_type === 'Planned' ? 'bg-green-100 text-green-700' :
                              rcr.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {rcr.category_type}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-600 mb-1">Part: <span className="font-semibold">{rcr.part_name_number}</span></p>
                            <p className="text-xs text-gray-600">Reject Qty: <span className="font-bold text-red-600">{rcr.reject_qty}</span> / Lot: <span className="font-bold text-blue-600">{rcr.lot_qty}</span></p>
                          </div>
                        </div>

                        <button className="mt-4 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                          Create Suspected Lot Record
                        </button>
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
  );
};

export default Suspected;













// import React, { useState } from "react";
// import { PlusCircle } from "lucide-react";

// interface Record {
//   id?: number;
//   date: string;
//   partName: string;
//   changeType: string;
//   suspectedQty: string;
//   dispatchDate: string;
//   qty: string;
//   city: string;
//   invoice: string;
//   remarks: string;
// }

// const Suspected: React.FC = () => {
//   const [records, setRecords] = useState<Record[]>([
//     {
//       date: "2025-10-20",
//       partName: "Part A",
//       changeType: "Type 1",
//       suspectedQty: "10",
//       dispatchDate: "2025-10-21",
//       qty: "8",
//       city: "Delhi",
//       invoice: "INV001",
//       remarks: "Initial",
//     },
//     {
//       date: "2025-10-19",
//       partName: "Part B",
//       changeType: "Type 2",
//       suspectedQty: "15",
//       dispatchDate: "2025-10-20",
//       qty: "12",
//       city: "Mumbai",
//       invoice: "INV002",
//       remarks: "Follow-up",
//     },
//   ]);

//   const [viewMode, setViewMode] = useState<"list" | "add">("list");
//   const [formData, setFormData] = useState<Record>({
//     date: "",
//     partName: "",
//     changeType: "",
//     suspectedQty: "",
//     dispatchDate: "",
//     qty: "",
//     city: "",
//     invoice: "",
//     remarks: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddRecord = () => {
//     setRecords(prev => [...prev, { ...formData, id: Date.now() }]);
//     setFormData({
//       date: "",
//       partName: "",
//       changeType: "",
//       suspectedQty: "",
//       dispatchDate: "",
//       qty: "",
//       city: "",
//       invoice: "",
//       remarks: "",
//     });
//     setViewMode("list");
//   };

//   return (
//     <div className="max-h-screen bg-gray-50 py-8 px-4 sm:px-6 ">
//       <div className="max-w-full mx-auto bg-white shadow-lg rounded-3xl">
//         <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-3xl">
//           <h1 className="text-xl font-semibold">Suspected Lot Traceability Record Sheet</h1>
//           {viewMode === "list" ? (
//             <button
//               onClick={() => setViewMode("add")}
//               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
//             >
//               <PlusCircle size={18} /> Add New Record
//             </button>
//           ) : (
//             <button
//               onClick={() => setViewMode("list")}
//               className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-sm"
//             >
//               Back to List
//             </button>
//           )}
//         </div>

//         {viewMode === "list" ? (
//           <div className="p-6 overflow-x-auto">
//             {records.length === 0 ? (
//               <p className="text-gray-500 text-center py-6">
//                 No records found. Click “Add New Record” to start.
//               </p>
//             ) : (
//               <table className="w-full text-sm border border-gray-200">
//                 <thead className="bg-blue-600 text-white">
//                   <tr>
//                     {[
//                       "S.No.",
//                       "Date",
//                       "Part Name/Model",
//                       "Change Type",
//                       "Suspected Qty",
//                       "Dispatch Date",
//                       "Qty",
//                       "City",
//                       "Invoice",
//                       "Remarks",
//                     ].map((heading, idx) => (
//                       <th key={idx} className="p-2 border-r border-blue-500">
//                         {heading}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {records.map((r, i) => (
//                     <tr
//                       key={r.id}
//                       className="border-b border-gray-200 hover:bg-blue-50 transition"
//                     >
//                       <td className="p-2 text-center">{i + 1}</td>
//                       <td className="p-2">{r.date}</td>
//                       <td className="p-2">{r.partName}</td>
//                       <td className="p-2">{r.changeType}</td>
//                       <td className="p-2">{r.suspectedQty}</td>
//                       <td className="p-2">{r.dispatchDate}</td>
//                       <td className="p-2">{r.qty}</td>
//                       <td className="p-2">{r.city}</td>
//                       <td className="p-2">{r.invoice}</td>
//                       <td className="p-2">{r.remarks}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         ) : (
//           <div className="p-6 bg-gray-50 rounded-b-3xl">
//             <h2 className="text-lg font-semibold text-gray-700 mb-4">
//               Add New Record
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[
//                 { label: "Date", name: "date", type: "date" },
//                 { label: "Part Name/Model", name: "partName", type: "text" },
//                 { label: "Change Type", name: "changeType", type: "text" },
//                 { label: "Suspected Qty", name: "suspectedQty", type: "number" },
//                 { label: "Dispatch Date", name: "dispatchDate", type: "date" },
//                 { label: "Qty", name: "qty", type: "number" },
//                 { label: "City", name: "city", type: "text" },
//                 { label: "Invoice", name: "invoice", type: "text" },
//                 { label: "Remarks", name: "remarks", type: "text" },
//               ].map(field => (
//                 <div key={field.name}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {field.label}
//                   </label>
//                   <input
//                     type={field.type}
//                     name={field.name}
//                     value={formData[field.name as keyof Record]}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end mt-6 space-x-3">
//               <button
//                 onClick={() => setViewMode("list")}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddRecord}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Save Record
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Suspected;