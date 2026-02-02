

// import { useState, useEffect } from 'react';
// import {
//   Plus, Hash, User, Search, Calendar,
//   ChevronRight, ChevronLeft, CheckCircle2,
//   FileText, Table, List, Eye, Trash2, Save,
//   AlertCircle, Info, Gauge, Cog,
//   ClipboardList, UserCheck, Award, X,
//   Download, TrendingUp, Activity, Filter
// } from 'lucide-react';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// type MachineBlock = { machineNo: string; operator: string; date: string; time: string };
// type ProcessRow = {
//   sno: string;
//   parameter: string;
//   specification: string;
//   method: string;
//   machineData: MachineBlock;
//   firstChange: MachineBlock;
//   secondChange: MachineBlock;
//   action: string;
// };
// type InprocessRow = {
//   sno: string;
//   parameter: string;
//   specification: string;
//   method: string;
//   readings: string[]
// };

// type FormState = {
//   partName: string;
//   partNumber: string;
//   customer: string;
//   operationName: string;
//   overallJudgement: 'OK' | 'NG';
//   preparedBy: string;
//   approvedBy: string;
//   processRows: ProcessRow[];
//   inprocessRows: InprocessRow[];
// };

// const API = 'http://localhost:8000/api';

// const newMachine = (): MachineBlock => ({ machineNo: '', operator: '', date: '', time: '' });
// const newProcess = (idx = 1): ProcessRow => ({
//   sno: String(idx),
//   parameter: '',
//   specification: '',
//   method: '',
//   machineData: newMachine(),
//   firstChange: newMachine(),
//   secondChange: newMachine(),
//   action: '',
// });
// const newInproc = (idx = 1): InprocessRow => ({
//   sno: String(idx),
//   parameter: '',
//   specification: '',
//   method: '',
//   readings: Array(10).fill(''),
// });

// export default function InspectionForm() {
//   const [view, setView] = useState<'list' | 'form'>('list');
//   const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
//   const [loading, setLoading] = useState(false);
//   const [currentId, setCurrentId] = useState<number | null>(null);
//   const [reports, setReports] = useState<any[]>([]);
//   const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   useEffect(() => { if (view === 'list') fetchReports(); }, [view]);

//   useEffect(() => {
//     const prefillData = localStorage.getItem("inspection_prefill_data");
//     if (prefillData) {
//       try {
//         const data = JSON.parse(prefillData);
//         setForm(prev => ({
//           ...prev,
//           partName: data.partName || prev.partName,
//           partNumber: data.partNumber || prev.partNumber,
//           customer: data.customer || prev.customer,
//           operationName: data.operationName || prev.operationName,
//         }));
//         localStorage.removeItem("inspection_prefill_data");
//         setView('form');
//         setFormStep(1);
//       } catch (error) {
//         console.error("Failed to load prefill data:", error);
//       }
//     }
//   }, []);

//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       const r = await fetch(`${API}/reports/`);
//       if (!r.ok) throw new Error();
//       setReports(await r.json());
//     } catch {
//       alert('Could not load reports');
//     }
//     finally { setLoading(false); }
//   };

//   const [form, setForm] = useState<FormState>({
//     partName: '',
//     partNumber: '',
//     customer: '',
//     operationName: '',
//     overallJudgement: 'OK',
//     preparedBy: '',
//     approvedBy: '',
//     processRows: [newProcess()],
//     inprocessRows: [newInproc()],
//   });

//   const resetForm = () => {
//     setCurrentId(null);
//     setFormStep(1);
//     setForm({
//       partName: '',
//       partNumber: '',
//       customer: '',
//       operationName: '',
//       overallJudgement: 'OK',
//       preparedBy: '',
//       approvedBy: '',
//       processRows: [newProcess()],
//       inprocessRows: [newInproc()],
//     });
//   };

//   const setField = (k: keyof FormState, v: any) => setForm(p => ({ ...p, [k]: v }));

//   const buildPayload = () => ({
//     part_name: form.partName,
//     part_number: form.partNumber,
//     customer: form.customer,
//     operation_name: form.operationName,
//     overall_judgement: form.overallJudgement,
//     prepared_by: form.preparedBy,
//     approved_by: form.approvedBy,
//     process_parameters: form.processRows.map(r => ({
//       sno: r.sno,
//       parameter_name: r.parameter,
//       specification: r.specification,
//       method: r.method,
//       process_machine_no: r.machineData.machineNo,
//       process_operator: r.machineData.operator,
//       process_date_time: `${r.machineData.date} ${r.machineData.time}`.trim(),
//       change_machine_no: r.firstChange.machineNo,
//       change_operator: r.firstChange.operator,
//       change_date_time: `${r.firstChange.date} ${r.firstChange.time}`.trim(),
//       lqa_machine_no: r.secondChange.machineNo,
//       lqa_operator: r.secondChange.operator,
//       lqa_date_time: `${r.secondChange.date} ${r.secondChange.time}`.trim(),
//       action: r.action,
//     })),
//     inprocess_parameters: form.inprocessRows.map(r => ({
//       sno: r.sno,
//       parameter_name: r.parameter,
//       specification: r.specification,
//       method: r.method,
//       readings: r.readings,
//     })),
//   });

//   const save = async () => {
//     setLoading(true);
//     try {
//       const url = currentId ? `${API}/reports/${currentId}/` : `${API}/reports/`;
//       const method = currentId ? 'PUT' : 'POST';
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(buildPayload()),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       alert(currentId ? 'Report updated successfully!' : 'Report submitted successfully!');
//       resetForm();
//       setView('list');
//     } catch (e) {
//       console.error(e);
//       alert('Save failed');
//     }
//     finally { setLoading(false); }
//   };

//   const openReport = async (id: number) => {
//     setLoading(true);
//     try {
//       const r = await fetch(`${API}/reports/${id}/`);
//       if (!r.ok) throw new Error();
//       const data = await r.json();

//       setForm({
//         partName: data.part_name || '',
//         partNumber: data.part_number || '',
//         customer: data.customer || '',
//         operationName: data.operation_name || '',
//         overallJudgement: data.overall_judgement || 'OK',
//         preparedBy: data.prepared_by || '',
//         approvedBy: data.approved_by || '',
//         processRows: (data.process_parameters || []).map((p: any, idx: number): ProcessRow => ({
//           sno: p.sno || String(idx + 1),
//           parameter: p.parameter_name || '',
//           specification: p.specification || '',
//           method: p.method || '',
//           machineData: {
//             machineNo: p.process_machine_no || '',
//             operator: p.process_operator || '',
//             date: p.process_date_time?.split(' ')[0] || '',
//             time: p.process_date_time?.split(' ')[1] || '',
//           },
//           firstChange: {
//             machineNo: p.change_machine_no || '',
//             operator: p.change_operator || '',
//             date: p.change_date_time?.split(' ')[0] || '',
//             time: p.change_date_time?.split(' ')[1] || '',
//           },
//           secondChange: {
//             machineNo: p.lqa_machine_no || '',
//             operator: p.lqa_operator || '',
//             date: p.lqa_date_time?.split(' ')[0] || '',
//             time: p.lqa_date_time?.split(' ')[1] || '',
//           },
//           action: p.action || '',
//         })),
//         inprocessRows: (data.inprocess_parameters || []).map((p: any, idx: number): InprocessRow => ({
//           sno: p.sno || String(idx + 1),
//           parameter: p.parameter_name || '',
//           specification: p.specification || '',
//           method: p.method || '',
//           readings: p.readings?.length === 10 ? p.readings : Array(10).fill('').map((_, i) => p.readings?.[i] || ''),
//         })),
//       });

//       if (!data.process_parameters?.length) {
//         setForm(prev => ({ ...prev, processRows: [newProcess()] }));
//       }
//       if (!data.inprocess_parameters?.length) {
//         setForm(prev => ({ ...prev, inprocessRows: [newInproc()] }));
//       }

//       setCurrentId(id);
//       setView('form');
//       setFormStep(1);
//     } catch {
//       alert('Could not load report');
//     }
//     finally { setLoading(false); }
//   };

//   const downloadPDF = async (reportId: number) => {
//     try {
//       const r = await fetch(`${API}/reports/${reportId}/`);
//       if (!r.ok) throw new Error();
//       const data = await r.json();

//       const doc = new jsPDF();
//       const pageWidth = doc.internal.pageSize.width;
//       let yPos = 20;

//       // Header
//       doc.setFillColor(37, 99, 235);
//       doc.rect(0, 0, pageWidth, 35, 'F');
      
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(20);
//       doc.setFont('helvetica', 'bold');
//       doc.text('IN-PROCESS INSPECTION REPORT', pageWidth / 2, 15, { align: 'center' });
      
//       doc.setFontSize(9);
//       doc.text(`Report #${reportId} | ${new Date().toLocaleDateString()}`, pageWidth / 2, 25, { align: 'center' });

//       yPos = 45;

//       // Basic Information
//       doc.setFillColor(239, 246, 255);
//       doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//       doc.setTextColor(37, 99, 235);
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text('BASIC INFORMATION', 15, yPos + 5);
//       yPos += 12;

//       doc.setTextColor(0, 0, 0);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'normal');
      
//       const basicInfo = [
//         ['Part Name:', data.part_name || '—'],
//         ['Part Number:', data.part_number || '—'],
//         ['Customer:', data.customer || '—'],
//         ['Operation:', data.operation_name || '—'],
//       ];

//       basicInfo.forEach(([label, value]) => {
//         doc.setFont('helvetica', 'bold');
//         doc.text(label, 15, yPos);
//         doc.setFont('helvetica', 'normal');
//         doc.text(value, 55, yPos);
//         yPos += 6;
//       });

//       yPos += 5;

//       // Process Parameters
//       if (data.process_parameters?.length > 0) {
//         doc.setFillColor(254, 243, 199);
//         doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//         doc.setTextColor(217, 119, 6);
//         doc.setFontSize(12);
//         doc.setFont('helvetica', 'bold');
//         doc.text('PROCESS SETTING DATA', 15, yPos + 5);
//         yPos += 10;

//         const processHeaders = ['S.No', 'Parameter', 'Spec', 'Method', 'M/C No', 'Operator', 'Action'];
//         const processData = data.process_parameters.map((p: any) => [
//           p.sno || '—',
//           p.parameter_name || '—',
//           p.specification || '—',
//           p.method || '—',
//           p.process_machine_no || '—',
//           p.process_operator || '—',
//           (p.action || '—').substring(0, 25) + '...'
//         ]);

//         autoTable(doc, {
//           startY: yPos,
//           head: [processHeaders],
//           body: processData,
//           theme: 'grid',
//           headStyles: { fillColor: [251, 146, 60], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
//           bodyStyles: { fontSize: 7, textColor: [0, 0, 0] },
//           alternateRowStyles: { fillColor: [254, 243, 199] },
//           margin: { left: 10, right: 10 }
//         });

//         yPos = (doc as any).lastAutoTable.finalY + 8;
//       }

//       // In-Process Measurements
//       if (data.inprocess_parameters?.length > 0) {
//         if (yPos > 240) {
//           doc.addPage();
//           yPos = 20;
//         }

//         doc.setFillColor(243, 232, 255);
//         doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//         doc.setTextColor(147, 51, 234);
//         doc.setFontSize(12);
//         doc.setFont('helvetica', 'bold');
//         doc.text('IN-PROCESS INSPECTION DATA', 15, yPos + 5);
//         yPos += 10;

//         data.inprocess_parameters.forEach((param: any) => {
//           if (yPos > 250) {
//             doc.addPage();
//             yPos = 20;
//           }

//           doc.setFillColor(243, 232, 255);
//           doc.rect(10, yPos, pageWidth - 20, 5, 'F');
//           doc.setTextColor(0, 0, 0);
//           doc.setFontSize(9);
//           doc.setFont('helvetica', 'bold');
//           doc.text(`Parameter: ${param.parameter_name || '—'} | Spec: ${param.specification || '—'}`, 15, yPos + 3.5);
//           yPos += 8;

//           const readingsHeaders = ['#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10'];
//           const readingsData = [param.readings || Array(10).fill('—')];

//           autoTable(doc, {
//             startY: yPos,
//             head: [readingsHeaders],
//             body: readingsData,
//             theme: 'grid',
//             headStyles: { fillColor: [168, 85, 247], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7, halign: 'center' },
//             bodyStyles: { fontSize: 8, halign: 'center', textColor: [0, 0, 0] },
//             margin: { left: 10, right: 10 }
//           });

//           yPos = (doc as any).lastAutoTable.finalY + 6;
//         });
//       }

//       // Approval Section
//       if (yPos > 240) {
//         doc.addPage();
//         yPos = 20;
//       }

//       doc.setFillColor(220, 252, 231);
//       doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//       doc.setTextColor(22, 163, 74);
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text('APPROVAL & SIGNATURES', 15, yPos + 5);
//       yPos += 12;

//       const isOK = data.overall_judgement === 'OK';
//       doc.setFillColor(isOK ? 220 : 254, isOK ? 252 : 226, isOK ? 231 : 226);
//       doc.setDrawColor(isOK ? 22 : 220, isOK ? 163 : 38, isOK ? 74 : 38);
//       doc.setLineWidth(1.5);
//       doc.rect(15, yPos, 70, 12, 'FD');
      
//       doc.setTextColor(isOK ? 22 : 185, isOK ? 163 : 28, isOK ? 74 : 28);
//       doc.setFontSize(14);
//       doc.setFont('helvetica', 'bold');
//       doc.text(`Overall: ${data.overall_judgement}`, 50, yPos + 8, { align: 'center' });
//       yPos += 18;

//       doc.setTextColor(0, 0, 0);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.text('Prepared By:', 15, yPos);
//       doc.setFont('helvetica', 'normal');
//       doc.text(data.prepared_by || '_________________', 42, yPos);
//       yPos += 8;

//       doc.setFont('helvetica', 'bold');
//       doc.text('Approved By:', 15, yPos);
//       doc.setFont('helvetica', 'normal');
//       doc.text(data.approved_by || '_________________', 42, yPos);

//       // Footer
//       const pageCount = doc.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         doc.setFillColor(37, 99, 235);
//         doc.rect(0, doc.internal.pageSize.height - 12, pageWidth, 12, 'F');
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(7);
//         doc.text(
//           `Quality Control Report | Page ${i} of ${pageCount} | Generated: ${new Date().toLocaleString()}`,
//           pageWidth / 2,
//           doc.internal.pageSize.height - 6,
//           { align: 'center' }
//         );
//       }

//       doc.save(`Inspection_Report_${reportId}_${new Date().toISOString().split('T')[0]}.pdf`);
//     } catch (error) {
//       console.error('PDF generation failed:', error);
//       alert('Failed to generate PDF');
//     }
//   };

//   const addProcessRow = () =>
//     setForm(p => ({ ...p, processRows: [...p.processRows, newProcess(p.processRows.length + 1)] }));
//   const addInprocessRow = () =>
//     setForm(p => ({ ...p, inprocessRows: [...p.inprocessRows, newInproc(p.inprocessRows.length + 1)] }));
//   const removeProcessRow = (i: number) => setForm(p =>
//     p.processRows.length === 1 ? p : { ...p, processRows: p.processRows.filter((_, idx) => idx !== i) });
//   const removeInprocessRow = (i: number) => setForm(p =>
//     p.inprocessRows.length === 1 ? p : { ...p, inprocessRows: p.inprocessRows.filter((_, idx) => idx !== i) });

//   const updateProcessRow = (rowIndex: number, field: keyof ProcessRow, value: any) => {
//     setForm(prev => ({
//       ...prev,
//       processRows: prev.processRows.map((row, i) =>
//         i === rowIndex ? { ...row, [field]: value } : row
//       )
//     }));
//   };

//   const updateInprocessRow = (rowIndex: number, field: keyof InprocessRow, value: any) => {
//     setForm(prev => ({
//       ...prev,
//       inprocessRows: prev.inprocessRows.map((row, i) =>
//         i === rowIndex ? { ...row, [field]: value } : row
//       )
//     }));
//   };

//   const updateReading = (rowIndex: number, readingIndex: number, value: string) => {
//     setForm(prev => ({
//       ...prev,
//       inprocessRows: prev.inprocessRows.map((row, i) =>
//         i === rowIndex ? {
//           ...row,
//           readings: row.readings.map((reading, j) => j === readingIndex ? value : reading)
//         } : row
//       )
//     }));
//   };

//   const filteredReports = reports.filter(r =>
//     r.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     r.part_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     r.customer?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const stepTitles = [
//     { num: 1, title: "Basic Info", icon: FileText, desc: "Part details" },
//     { num: 2, title: "Process Data", icon: Cog, desc: "Parameters" },
//     { num: 3, title: "Inspection", icon: Gauge, desc: "Measurements" },
//     { num: 4, title: "Approval", icon: Award, desc: "Review" }
//   ];

//   // Stats calculation
//   const stats = {
//     total: reports.length,
//     ok: reports.filter(r => r.overall_judgement === 'OK').length,
//     ng: reports.filter(r => r.overall_judgement === 'NG').length,
//     thisMonth: reports.filter(r => {
//       const reportDate = new Date(r.created_at);
//       const now = new Date();
//       return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
//     }).length
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-4">

//         {/* HEADER */}
//         <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                   <ClipboardList className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-white">Quality Inspection System</h1>
//                   <p className="text-blue-100 text-xs">In-Process Inspection & Approval</p>
//                 </div>
//               </div>
//               {view === 'list' ? (
//                 <button
//                   onClick={() => { resetForm(); setView('form'); }}
//                   className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition-all flex items-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   New Report
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => { resetForm(); setView('list'); }}
//                   className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                   Back
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* STATISTICS */}
//         {view === 'list' && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <Activity className="w-5 h-5" />
//                 <TrendingUp className="w-4 h-4 text-blue-200" />
//               </div>
//               <div className="text-2xl font-bold">{stats.total}</div>
//               <div className="text-blue-100 text-xs">Total Reports</div>
//             </div>

//             <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <CheckCircle2 className="w-5 h-5" />
//                 <span className="text-xs font-semibold">{stats.total ? Math.round((stats.ok / stats.total) * 100) : 0}%</span>
//               </div>
//               <div className="text-2xl font-bold">{stats.ok}</div>
//               <div className="text-green-100 text-xs">Approved (OK)</div>
//             </div>

//             <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <X className="w-5 h-5" />
//                 <span className="text-xs font-semibold">{stats.total ? Math.round((stats.ng / stats.total) * 100) : 0}%</span>
//               </div>
//               <div className="text-2xl font-bold">{stats.ng}</div>
//               <div className="text-red-100 text-xs">Rejected (NG)</div>
//             </div>

//             <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <Calendar className="w-5 h-5" />
//               </div>
//               <div className="text-2xl font-bold">{stats.thisMonth}</div>
//               <div className="text-purple-100 text-xs">This Month</div>
//             </div>
//           </div>
//         )}

//         {/* LIST VIEW */}
//         {view === 'list' && (
//           <>
//             {/* Search & Controls */}
//             <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
//               <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-3">
//                 <div className="relative flex-1 w-full">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search by part name, number, or customer..."
//                     value={searchTerm}
//                     onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   />
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <select
//                     value={itemsPerPage}
//                     onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
//                     className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value={10}>10 per page</option>
//                     <option value={25}>25 per page</option>
//                     <option value={50}>50 per page</option>
//                     <option value={100}>100 per page</option>
//                   </select>
//                   <button
//                     onClick={() => setViewMode('card')}
//                     className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
//                   >
//                     <List className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => setViewMode('table')}
//                     className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
//                   >
//                     <Table className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//               <div className="text-xs text-gray-600">
//                 Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} reports
//                 {filteredReports.length > itemsPerPage && <span className="ml-2">• Page {currentPage} of {totalPages}</span>}
//               </div>
//             </div>

//             {loading && (
//               <div className="flex flex-col items-center justify-center py-16">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-3"></div>
//                 <p className="text-gray-600 text-sm">Loading reports...</p>
//               </div>
//             )}

//             {!loading && filteredReports.length === 0 && (
//               <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
//                 <ClipboardList className="w-16 h-16 text-gray-300 mb-3" />
//                 <h3 className="text-lg font-semibold text-gray-700 mb-1">
//                   {searchTerm ? 'No matching reports' : 'No reports yet'}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-4">
//                   {searchTerm ? 'Try different search terms' : 'Create your first inspection report'}
//                 </p>
//                 {!searchTerm && (
//                   <button
//                     onClick={() => { resetForm(); setView('form'); }}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Create Report
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* CARD VIEW */}
//             {!loading && currentReports.length > 0 && viewMode === 'card' && (
//               <>
//                 <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                   {currentReports.map((r: any) => (
//                     <div
//                       key={r.id}
//                       className="bg-white rounded-lg shadow hover:shadow-lg transition-all border border-gray-200"
//                     >
//                       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-t-lg">
//                         <div className="flex justify-between items-start mb-2">
//                           <div className="flex items-center gap-2">
//                             <Hash className="w-4 h-4" />
//                             <span className="font-bold text-lg">#{r.id}</span>
//                           </div>
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
//                             r.overall_judgement === 'OK' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
//                           }`}>
//                             {r.overall_judgement === 'OK' ? '✓ OK' : '✗ NG'}
//                           </span>
//                         </div>
//                         <div className="font-semibold text-sm truncate">{r.part_name || 'Unnamed Part'}</div>
//                       </div>

//                       <div className="p-3 space-y-2">
//                         <div className="bg-blue-50 rounded p-2 border border-blue-100">
//                           <div className="text-xs text-blue-600 font-semibold">Part Number</div>
//                           <div className="text-sm font-medium text-gray-900 truncate">{r.part_number || '—'}</div>
//                         </div>
//                         <div className="bg-green-50 rounded p-2 border border-green-100">
//                           <div className="text-xs text-green-600 font-semibold">Customer</div>
//                           <div className="text-sm font-medium text-gray-900 truncate">{r.customer || '—'}</div>
//                         </div>
//                         <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
//                           <span className="flex items-center gap-1">
//                             <Calendar className="w-3 h-3" />
//                             {r.created_at?.slice(0, 10) || '—'}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <UserCheck className="w-3 h-3" />
//                             {r.prepared_by || 'Unsigned'}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 px-3 py-2 flex gap-2 rounded-b-lg">
//                         <button
//                           onClick={() => openReport(r.id)}
//                           className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 flex items-center justify-center gap-1"
//                         >
//                           <Eye className="w-3 h-3" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => downloadPDF(r.id)}
//                           className="flex-1 bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-purple-700 flex items-center justify-center gap-1"
//                         >
//                           <Download className="w-3 h-3" />
//                           PDF
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="mt-4 flex justify-center items-center gap-1">
//                     <button
//                       onClick={() => paginate(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>

//                     {[...Array(Math.min(totalPages, 7))].map((_, index) => {
//                       let pageNumber :number ;
//                       if (totalPages <= 7) {
//                         pageNumber = index + 1;
//                       } else if (currentPage <= 4) {
//                         pageNumber = index + 1;
//                       } else if (currentPage >= totalPages - 3) {
//                         pageNumber = totalPages - 6 + index;
//                       } else {
//                         pageNumber = currentPage - 3 + index;
//                       }

//                       return (
//                         <button
//                           key={index}
//                           onClick={() => paginate(pageNumber)}
//                           className={`w-8 h-8 rounded font-semibold text-sm ${
//                             currentPage === pageNumber
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
//                           }`}
//                         >
//                           {pageNumber}
//                         </button>
//                       );
//                     })}

//                     <button
//                       onClick={() => paginate(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* TABLE VIEW */}
//             {!loading && currentReports.length > 0 && viewMode === 'table' && (
//               <>
//                 <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Part Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Part No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Customer</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Operation</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Date</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {currentReports.map((r: any, idx: number) => (
//                           <tr key={r.id} className={`hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                             <td className="px-4 py-3">
//                               <span className="font-bold text-gray-900">#{r.id}</span>
//                             </td>
//                             <td className="px-4 py-3 font-medium text-gray-900">{r.part_name || '—'}</td>
//                             <td className="px-4 py-3 text-gray-700">{r.part_number || '—'}</td>
//                             <td className="px-4 py-3 text-gray-700">{r.customer || '—'}</td>
//                             <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{r.operation_name || '—'}</td>
//                             <td className="px-4 py-3">
//                               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                                 r.overall_judgement === 'OK'
//                                   ? 'bg-green-100 text-green-700'
//                                   : 'bg-red-100 text-red-700'
//                               }`}>
//                                 {r.overall_judgement === 'OK' ? '✓ OK' : '✗ NG'}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 text-gray-600">{r.created_at?.slice(0, 10) || '—'}</td>
//                             <td className="px-4 py-3">
//                               <div className="flex gap-1">
//                                 <button
//                                   onClick={() => openReport(r.id)}
//                                   className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700"
//                                 >
//                                   View
//                                 </button>
//                                 <button
//                                   onClick={() => downloadPDF(r.id)}
//                                   className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700"
//                                 >
//                                   PDF
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Pagination for Table */}
//                 {totalPages > 1 && (
//                   <div className="mt-4 flex justify-center items-center gap-1">
//                     <button
//                       onClick={() => paginate(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>

//                     {[...Array(Math.min(totalPages, 7))].map((_, index) => {
//                       let pageNumber : number ;
//                       if (totalPages <= 7) {
//                         pageNumber = index + 1;
//                       } else if (currentPage <= 4) {
//                         pageNumber = index + 1;
//                       } else if (currentPage >= totalPages - 3) {
//                         pageNumber = totalPages - 6 + index;
//                       } else {
//                         pageNumber = currentPage - 3 + index;
//                       }

//                       return (
//                         <button
//                           key={index}
//                           onClick={() => paginate(pageNumber)}
//                           className={`w-8 h-8 rounded font-semibold text-sm ${
//                             currentPage === pageNumber
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
//                           }`}
//                         >
//                           {pageNumber}
//                         </button>
//                       );
//                     })}

//                     <button
//                       onClick={() => paginate(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </>
//         )}

//         {/* FORM VIEW */}
//         {view === 'form' && (
//           <>
//             {/* Progress Steps */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
//               <div className="flex items-center justify-between">
//                 {stepTitles.map((step, idx) => (
//                   <div key={step.num} className="flex items-center flex-1">
//                     <div className="flex flex-col items-center flex-1">
//                       <button
//                         onClick={() => setFormStep(step.num as any)}
//                         className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all ${
//                           formStep === step.num
//                             ? 'bg-blue-600 text-white shadow-lg scale-110'
//                             : formStep > step.num
//                             ? 'bg-green-500 text-white'
//                             : 'bg-gray-200 text-gray-500'
//                         }`}
//                       >
//                         {formStep > step.num ? (
//                           <CheckCircle2 className="w-6 h-6" />
//                         ) : (
//                           <step.icon className="w-5 h-5" />
//                         )}
//                       </button>
//                       <div className="mt-2 text-center">
//                         <div className={`text-xs font-semibold ${formStep === step.num ? 'text-blue-600' : formStep > step.num ? 'text-green-600' : 'text-gray-500'}`}>
//                           {step.title}
//                         </div>
//                         <div className="text-xs text-gray-400">{step.desc}</div>
//                       </div>
//                     </div>
//                     {idx < stepTitles.length - 1 && (
//                       <div className={`h-1 flex-1 mx-4 rounded ${
//                         formStep > step.num ? 'bg-green-500' : 'bg-gray-200'
//                       }`} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* STEP 1: Basic Information */}
//             {formStep === 1 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 flex items-center gap-3">
//                   <FileText className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 1: Basic Information</h2>
//                     <p className="text-blue-100 text-xs">Enter part and operation details</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Part Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.partName}
//                         onChange={(e) => setField('partName', e.target.value)}
//                         placeholder="Enter part name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Part Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.partNumber}
//                         onChange={(e) => setField('partNumber', e.target.value)}
//                         placeholder="Enter part number"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Customer <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.customer}
//                         onChange={(e) => setField('customer', e.target.value)}
//                         placeholder="Enter customer name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Operation Name/Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.operationName}
//                         onChange={(e) => setField('operationName', e.target.value)}
//                         placeholder="Enter operation details"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       onClick={() => setFormStep(2)}
//                       disabled={!form.partName || !form.partNumber || !form.customer || !form.operationName}
//                       className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
//                     >
//                       Next Step
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: Process Setting Data */}
//             {formStep === 2 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-3 flex items-center gap-3">
//                   <Cog className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 2: Process Setting Data</h2>
//                     <p className="text-orange-100 text-xs">Record machine parameters</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
//                     <div className="flex items-start gap-2">
//                       <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
//                       <div>
//                         <h4 className="font-semibold text-orange-900 text-sm">About Process Data</h4>
//                         <p className="text-orange-800 text-xs mt-1">
//                           Record three stages: Initial Process Setting, After Machine Change, and LQA Verification.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {form.processRows.map((row, i) => (
//                       <div key={`process-${i}`} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
//                             <span className="w-6 h-6 bg-orange-600 text-white rounded flex items-center justify-center text-xs">
//                               {i + 1}
//                             </span>
//                             Parameter #{i + 1}
//                           </h3>
//                           {form.processRows.length > 1 && (
//                             <button
//                               onClick={() => removeProcessRow(i)}
//                               className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>

//                         <div className="grid md:grid-cols-4 gap-3 mb-3">
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">S.No</label>
//                             <input className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-sm" value={row.sno} readOnly />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Parameter Name</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
//                               value={row.parameter}
//                               onChange={(e) => updateProcessRow(i, 'parameter', e.target.value)}
//                               placeholder="e.g., Temperature"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Specification</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
//                               value={row.specification}
//                               onChange={(e) => updateProcessRow(i, 'specification', e.target.value)}
//                               placeholder="e.g., 80-90°C"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Method</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
//                               value={row.method}
//                               onChange={(e) => updateProcessRow(i, 'method', e.target.value)}
//                               placeholder="e.g., Gauge"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid lg:grid-cols-3 gap-3">
//                           {[
//                             { title: '1. Process Setting', key: 'machineData' as const },
//                             { title: '2. After M/C Change', key: 'firstChange' as const },
//                             { title: '3. LQA Verification', key: 'secondChange' as const }
//                           ].map(({ title, key }) => {
//                             const block = row[key];
//                             return (
//                               <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
//                                 <h4 className="text-xs font-bold text-gray-700 mb-2">{title}</h4>
//                                 <div className="space-y-2">
//                                   <input
//                                     className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                     value={block.machineNo}
//                                     onChange={(e) => updateProcessRow(i, key, { ...block, machineNo: e.target.value })}
//                                     placeholder="Machine No."
//                                   />
//                                   <input
//                                     className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                     value={block.operator}
//                                     onChange={(e) => updateProcessRow(i, key, { ...block, operator: e.target.value })}
//                                     placeholder="Operator"
//                                   />
//                                   <input
//                                     className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                     value={`${block.date} ${block.time}`.trim()}
//                                     onChange={(e) => {
//                                       const [date = '', time = ''] = e.target.value.split(' ');
//                                       updateProcessRow(i, key, { ...block, date, time });
//                                     }}
//                                     placeholder="YYYY-MM-DD HH:MM"
//                                   />
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>

//                         <div className="mt-3">
//                           <label className="block text-xs font-semibold text-gray-700 mb-1">Action Taken</label>
//                           <textarea
//                             className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 resize-none text-sm"
//                             rows={2}
//                             value={row.action}
//                             onChange={(e) => updateProcessRow(i, 'action', e.target.value)}
//                             placeholder="Describe actions..."
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 text-center">
//                     <button
//                       onClick={addProcessRow}
//                       className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 mx-auto"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Parameter
//                     </button>
//                   </div>

//                   <div className="mt-6 flex justify-between">
//                     <button
//                       onClick={() => setFormStep(1)}
//                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => setFormStep(3)}
//                       className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2"
//                     >
//                       Next Step
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 3: In-Process Inspection */}
//             {formStep === 3 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 flex items-center gap-3">
//                   <Gauge className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 3: In-Process Inspection</h2>
//                     <p className="text-purple-100 text-xs">Record 10 measurements per parameter</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
//                     <div className="flex items-start gap-2">
//                       <Info className="w-4 h-4 text-purple-600 mt-0.5" />
//                       <div>
//                         <h4 className="font-semibold text-purple-900 text-sm">Measurement Instructions</h4>
//                         <p className="text-purple-800 text-xs mt-1">
//                           Take 10 consecutive measurements for each parameter.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {form.inprocessRows.map((row, i) => (
//                       <div key={`inprocess-${i}`} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
//                             <span className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
//                               {i + 1}
//                             </span>
//                             Measurement #{i + 1}
//                           </h3>
//                           {form.inprocessRows.length > 1 && (
//                             <button
//                               onClick={() => removeInprocessRow(i)}
//                               className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>

//                         <div className="grid md:grid-cols-4 gap-3 mb-3">
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">S.No</label>
//                             <input className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-sm" value={row.sno} readOnly />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Parameter Name</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
//                               value={row.parameter}
//                               onChange={(e) => updateInprocessRow(i, 'parameter', e.target.value)}
//                               placeholder="e.g., Dimension"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Specification</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
//                               value={row.specification}
//                               onChange={(e) => updateInprocessRow(i, 'specification', e.target.value)}
//                               placeholder="e.g., 10±0.5mm"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Method</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
//                               value={row.method}
//                               onChange={(e) => updateInprocessRow(i, 'method', e.target.value)}
//                               placeholder="e.g., Caliper"
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">10 Readings</label>
//                           <div className="grid grid-cols-5 lg:grid-cols-10 gap-2">
//                             {row.readings.map((reading, j) => (
//                               <div key={j}>
//                                 <label className="block text-xs text-gray-500 mb-1 text-center">#{j + 1}</label>
//                                 <input
//                                   className="w-full px-2 py-2 text-xs border border-purple-200 rounded focus:ring-2 focus:ring-purple-500 text-center"
//                                   value={reading}
//                                   onChange={(e) => updateReading(i, j, e.target.value)}
//                                   placeholder="0.0"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 text-center">
//                     <button
//                       onClick={addInprocessRow}
//                       className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2 mx-auto"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Measurement
//                     </button>
//                   </div>

//                   <div className="mt-6 flex justify-between">
//                     <button
//                       onClick={() => setFormStep(2)}
//                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => setFormStep(4)}
//                       className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2"
//                     >
//                       Next Step
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 4: Review & Approval */}
//             {formStep === 4 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 flex items-center gap-3">
//                   <Award className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 4: Review & Approval</h2>
//                     <p className="text-green-100 text-xs">Final judgement and signatures</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   {/* Summary */}
//                   <div className="grid md:grid-cols-3 gap-3 mb-6">
//                     <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                       <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Part Details</div>
//                       <div className="text-sm font-bold text-gray-900">{form.partName || 'Not set'}</div>
//                       <div className="text-xs text-gray-600">{form.partNumber || 'No part number'}</div>
//                     </div>
//                     <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
//                       <div className="text-xs font-semibold text-orange-600 uppercase mb-1">Process Parameters</div>
//                       <div className="text-2xl font-bold text-gray-900">{form.processRows.length}</div>
//                       <div className="text-xs text-gray-600">Parameters recorded</div>
//                     </div>
//                     <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
//                       <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Measurements</div>
//                       <div className="text-2xl font-bold text-gray-900">{form.inprocessRows.length}</div>
//                       <div className="text-xs text-gray-600">Quality checks</div>
//                     </div>
//                   </div>

//                   {/* Judgement */}
//                   <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
//                     <h3 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
//                       <CheckCircle2 className="w-5 h-5" />
//                       Overall Judgement
//                     </h3>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2 cursor-pointer flex-1">
//                         <input
//                           type="radio"
//                           name="judgement"
//                           value="OK"
//                           checked={form.overallJudgement === 'OK'}
//                           onChange={(e) => setField('overallJudgement', e.target.value)}
//                           className="w-4 h-4"
//                         />
//                         <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-green-300 flex-1">
//                           <CheckCircle2 className="w-5 h-5 text-green-600" />
//                           <span className="font-semibold text-green-700">OK - Approved</span>
//                         </div>
//                       </label>
//                       <label className="flex items-center gap-2 cursor-pointer flex-1">
//                         <input
//                           type="radio"
//                           name="judgement"
//                           value="NG"
//                           checked={form.overallJudgement === 'NG'}
//                           onChange={(e) => setField('overallJudgement', e.target.value)}
//                           className="w-4 h-4"
//                         />
//                         <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-red-300 flex-1">
//                           <X className="w-5 h-5 text-red-600" />
//                           <span className="font-semibold text-red-700">NG - Rejected</span>
//                         </div>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Signatures */}
//                   <div className="grid md:grid-cols-2 gap-4 mb-6">
//                     <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                       <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-sm">
//                         <User className="w-4 h-4" />
//                         Prepared By
//                       </h4>
//                       <input
//                         type="text"
//                         value={form.preparedBy}
//                         onChange={(e) => setField('preparedBy', e.target.value)}
//                         placeholder="Enter name"
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                       <div className="mt-2 text-xs text-blue-700">Technician/Operator</div>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//                       <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2 text-sm">
//                         <UserCheck className="w-4 h-4" />
//                         Approved By
//                       </h4>
//                       <input
//                         type="text"
//                         value={form.approvedBy}
//                         onChange={(e) => setField('approvedBy', e.target.value)}
//                         placeholder="Enter name"
//                         className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                       <div className="mt-2 text-xs text-green-700">Supervisor/Manager</div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex justify-between">
//                     <button
//                       onClick={() => setFormStep(3)}
//                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Previous
//                     </button>
//                     <button
//                       onClick={save}
//                       disabled={loading}
//                       className="bg-green-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
//                     >
//                       <Save className="w-5 h-5" />
//                       {loading ? 'Saving...' : currentId ? 'Update Report' : 'Submit Report'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




// import { useState, useEffect } from 'react';
// import {
//   Plus, Hash, User, Search, Calendar,
//   ChevronRight, ChevronLeft, CheckCircle2,
//   FileText, Table, List, Eye, Trash2, Save,
//   AlertCircle, Info, Gauge, Cog,
//   ClipboardList, UserCheck, Award, X,
//   Download, TrendingUp, Activity
// } from 'lucide-react';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// type MachineBlock = { machineNo: string; operator: string; date: string; time: string };

// type ProcessRow = {
//   sno: string;
//   parameter: string;
//   specification: string;
//   method: string;
//   machineData: MachineBlock;
//   firstChange: MachineBlock;
//   secondChange: MachineBlock;
//   action: string;
// };

// type InprocessRow = {
//   sno: string;
//   parameter: string;
//   specification: string;
//   method: string;
//   readings: string[]
// };

// type FormState = {
//   partName: string;
//   partNumber: string;
//   customer: string;
//   operationName: string;
//   overallJudgement: 'OK' | 'NG';
//   preparedBy: string;
//   approvedBy: string;
//   processRows: ProcessRow[];
//   inprocessRows: InprocessRow[];
// };

// const API = 'http://localhost:8000/api';

// const newMachine = (): MachineBlock => ({ machineNo: '', operator: '', date: '', time: '' });

// const newProcess = (idx = 1): ProcessRow => ({
//   sno: String(idx),
//   parameter: '',
//   specification: '',
//   method: '',
//   machineData: newMachine(),
//   firstChange: newMachine(),
//   secondChange: newMachine(),
//   action: '',
// });

// const newInproc = (idx = 1): InprocessRow => ({
//   sno: String(idx),
//   parameter: '',
//   specification: '',
//   method: '',
//   readings: Array(10).fill(''),
// });

// export default function InspectionForm() {
//   const [view, setView] = useState<'list' | 'form'>('list');
//   const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
//   const [loading, setLoading] = useState(false);
//   const [currentId, setCurrentId] = useState<number | null>(null);
//   const [reports, setReports] = useState<any[]>([]);
//   const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Modal states
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<'submit' | 'update' | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewedReport, setViewedReport] = useState<any>(null);

//   useEffect(() => {
//     if (view === 'list') fetchReports();
//   }, [view]);

//   useEffect(() => {
//     const prefillData = localStorage.getItem("inspection_prefill_data");
//     if (prefillData) {
//       try {
//         const data = JSON.parse(prefillData);
//         setForm(prev => ({
//           ...prev,
//           partName: data.partName || prev.partName,
//           partNumber: data.partNumber || prev.partNumber,
//           customer: data.customer || prev.customer,
//           operationName: data.operationName || prev.operationName,
//         }));
//         localStorage.removeItem("inspection_prefill_data");
//         setView('form');
//         setFormStep(1);
//       } catch (error) {
//         console.error("Failed to load prefill data:", error);
//       }
//     }
//   }, []);

//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       const r = await fetch(`${API}/reports/`);
//       if (!r.ok) throw new Error();
//       setReports(await r.json());
//     } catch {
//       alert('Could not load reports');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [form, setForm] = useState<FormState>({
//     partName: '',
//     partNumber: '',
//     customer: '',
//     operationName: '',
//     overallJudgement: 'OK',
//     preparedBy: '',
//     approvedBy: '',
//     processRows: [newProcess()],
//     inprocessRows: [newInproc()],
//   });

//   const resetForm = () => {
//     setCurrentId(null);
//     setFormStep(1);
//     setForm({
//       partName: '',
//       partNumber: '',
//       customer: '',
//       operationName: '',
//       overallJudgement: 'OK',
//       preparedBy: '',
//       approvedBy: '',
//       processRows: [newProcess()],
//       inprocessRows: [newInproc()],
//     });
//   };

//   const setField = (k: keyof FormState, v: any) => setForm(p => ({ ...p, [k]: v }));

//   const buildPayload = () => ({
//     part_name: form.partName,
//     part_number: form.partNumber,
//     customer: form.customer,
//     operation_name: form.operationName,
//     overall_judgement: form.overallJudgement,
//     prepared_by: form.preparedBy,
//     approved_by: form.approvedBy,
//     process_parameters: form.processRows.map(r => ({
//       sno: r.sno,
//       parameter_name: r.parameter,
//       specification: r.specification,
//       method: r.method,
//       process_machine_no: r.machineData.machineNo,
//       process_operator: r.machineData.operator,
//       process_date_time: `${r.machineData.date} ${r.machineData.time}`.trim(),
//       change_machine_no: r.firstChange.machineNo,
//       change_operator: r.firstChange.operator,
//       change_date_time: `${r.firstChange.date} ${r.firstChange.time}`.trim(),
//       lqa_machine_no: r.secondChange.machineNo,
//       lqa_operator: r.secondChange.operator,
//       lqa_date_time: `${r.secondChange.date} ${r.secondChange.time}`.trim(),
//       action: r.action,
//     })),
//     inprocess_parameters: form.inprocessRows.map(r => ({
//       sno: r.sno,
//       parameter_name: r.parameter,
//       specification: r.specification,
//       method: r.method,
//       readings: r.readings,
//     })),
//   });

//   const handleFinalSubmit = () => {
//     setConfirmAction(currentId ? 'update' : 'submit');
//     setShowConfirmDialog(true);
//   };

//   const confirmAndSave = async () => {
//     setShowConfirmDialog(false);
//     setLoading(true);

//     try {
//       const url = currentId ? `${API}/reports/${currentId}/` : `${API}/reports/`;
//       const method = currentId ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(buildPayload()),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Server error');
//       }

//       alert(currentId ? 'Report updated successfully!' : 'Report submitted successfully!');
//       resetForm();
//       setView('list');
//     } catch (e: any) {
//       console.error(e);
//       alert(`Save failed: ${e.message || 'Unknown error'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openReport = async (id: number) => {
//     setLoading(true);
//     try {
//       const r = await fetch(`${API}/reports/${id}/`);
//       if (!r.ok) throw new Error();
//       const data = await r.json();
//       setForm({
//         partName: data.part_name || '',
//         partNumber: data.part_number || '',
//         customer: data.customer || '',
//         operationName: data.operation_name || '',
//         overallJudgement: data.overall_judgement || 'OK',
//         preparedBy: data.prepared_by || '',
//         approvedBy: data.approved_by || '',
//         processRows: (data.process_parameters || []).map((p: any, idx: number): ProcessRow => ({
//           sno: p.sno || String(idx + 1),
//           parameter: p.parameter_name || '',
//           specification: p.specification || '',
//           method: p.method || '',
//           machineData: {
//             machineNo: p.process_machine_no || '',
//             operator: p.process_operator || '',
//             date: p.process_date_time?.split(' ')[0] || '',
//             time: p.process_date_time?.split(' ')[1] || '',
//           },
//           firstChange: {
//             machineNo: p.change_machine_no || '',
//             operator: p.change_operator || '',
//             date: p.change_date_time?.split(' ')[0] || '',
//             time: p.change_date_time?.split(' ')[1] || '',
//           },
//           secondChange: {
//             machineNo: p.lqa_machine_no || '',
//             operator: p.lqa_operator || '',
//             date: p.lqa_date_time?.split(' ')[0] || '',
//             time: p.lqa_date_time?.split(' ')[1] || '',
//           },
//           action: p.action || '',
//         })),
//         inprocessRows: (data.inprocess_parameters || []).map((p: any, idx: number): InprocessRow => ({
//           sno: p.sno || String(idx + 1),
//           parameter: p.parameter_name || '',
//           specification: p.specification || '',
//           method: p.method || '',
//           readings: p.readings?.length === 10 ? p.readings : Array(10).fill('').map((_, i) => p.readings?.[i] || ''),
//         })),
//       });
//       if (!data.process_parameters?.length) {
//         setForm(prev => ({ ...prev, processRows: [newProcess()] }));
//       }
//       if (!data.inprocess_parameters?.length) {
//         setForm(prev => ({ ...prev, inprocessRows: [newInproc()] }));
//       }
//       setCurrentId(id);
//       setView('form');
//       setFormStep(1);
//     } catch {
//       alert('Could not load report for editing');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openViewModal = async (id: number) => {
//     setLoading(true);
//     try {
//       const r = await fetch(`${API}/reports/${id}/`);
//       if (!r.ok) throw new Error();
//       const data = await r.json();
//       setViewedReport(data);
//       setShowViewModal(true);
//     } catch {
//       alert('Could not load report details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = async (reportId: number) => {
//     try {
//       const r = await fetch(`${API}/reports/${reportId}/`);
//       if (!r.ok) throw new Error();
//       const data = await r.json();
//       const doc = new jsPDF();
//       const pageWidth = doc.internal.pageSize.width;
//       let yPos = 20;

//       // Header
//       doc.setFillColor(37, 99, 235);
//       doc.rect(0, 0, pageWidth, 35, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(20);
//       doc.setFont('helvetica', 'bold');
//       doc.text('IN-PROCESS INSPECTION REPORT', pageWidth / 2, 15, { align: 'center' });
//       doc.setFontSize(9);
//       doc.text(`Report #${reportId} | ${new Date().toLocaleDateString()}`, pageWidth / 2, 25, { align: 'center' });
//       yPos = 45;

//       // Basic Information
//       doc.setFillColor(239, 246, 255);
//       doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//       doc.setTextColor(37, 99, 235);
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text('BASIC INFORMATION', 15, yPos + 5);
//       yPos += 12;
//       doc.setTextColor(0, 0, 0);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'normal');

//       const basicInfo = [
//         ['Part Name:', data.part_name || '—'],
//         ['Part Number:', data.part_number || '—'],
//         ['Customer:', data.customer || '—'],
//         ['Operation:', data.operation_name || '—'],
//       ];
//       basicInfo.forEach(([label, value]) => {
//         doc.setFont('helvetica', 'bold');
//         doc.text(label, 15, yPos);
//         doc.setFont('helvetica', 'normal');
//         doc.text(value, 55, yPos);
//         yPos += 6;
//       });
//       yPos += 5;

//       // Process Parameters
//       if (data.process_parameters?.length > 0) {
//         doc.setFillColor(254, 243, 199);
//         doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//         doc.setTextColor(217, 119, 6);
//         doc.setFontSize(12);
//         doc.setFont('helvetica', 'bold');
//         doc.text('PROCESS SETTING DATA', 15, yPos + 5);
//         yPos += 10;

//         const processHeaders = ['S.No', 'Parameter', 'Spec', 'Method', 'M/C No', 'Operator', 'Action'];
//         const processData = data.process_parameters.map((p: any) => [
//           p.sno || '—',
//           p.parameter_name || '—',
//           p.specification || '—',
//           p.method || '—',
//           p.process_machine_no || '—',
//           p.process_operator || '—',
//           (p.action || '—').substring(0, 25) + (p.action?.length > 25 ? '...' : ''),
//         ]);

//         autoTable(doc, {
//           startY: yPos,
//           head: [processHeaders],
//           body: processData,
//           theme: 'grid',
//           headStyles: { fillColor: [251, 146, 60], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
//           bodyStyles: { fontSize: 7, textColor: [0, 0, 0] },
//           alternateRowStyles: { fillColor: [254, 243, 199] },
//           margin: { left: 10, right: 10 }
//         });
//         yPos = (doc as any).lastAutoTable.finalY + 8;
//       }

//       // In-Process Measurements
//       if (data.inprocess_parameters?.length > 0) {
//         if (yPos > 240) {
//           doc.addPage();
//           yPos = 20;
//         }
//         doc.setFillColor(243, 232, 255);
//         doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//         doc.setTextColor(147, 51, 234);
//         doc.setFontSize(12);
//         doc.setFont('helvetica', 'bold');
//         doc.text('IN-PROCESS INSPECTION DATA', 15, yPos + 5);
//         yPos += 10;

//         data.inprocess_parameters.forEach((param: any) => {
//           if (yPos > 250) {
//             doc.addPage();
//             yPos = 20;
//           }
//           doc.setFillColor(243, 232, 255);
//           doc.rect(10, yPos, pageWidth - 20, 5, 'F');
//           doc.setTextColor(0, 0, 0);
//           doc.setFontSize(9);
//           doc.setFont('helvetica', 'bold');
//           doc.text(`Parameter: ${param.parameter_name || '—'} | Spec: ${param.specification || '—'}`, 15, yPos + 3.5);
//           yPos += 8;

//           const readingsHeaders = ['#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10'];
//           const readingsData = [param.readings || Array(10).fill('—')];

//           autoTable(doc, {
//             startY: yPos,
//             head: [readingsHeaders],
//             body: readingsData,
//             theme: 'grid',
//             headStyles: { fillColor: [168, 85, 247], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7, halign: 'center' },
//             bodyStyles: { fontSize: 8, halign: 'center', textColor: [0, 0, 0] },
//             margin: { left: 10, right: 10 }
//           });
//           yPos = (doc as any).lastAutoTable.finalY + 6;
//         });
//       }

//       // Approval Section
//       if (yPos > 240) {
//         doc.addPage();
//         yPos = 20;
//       }
//       doc.setFillColor(220, 252, 231);
//       doc.rect(10, yPos, pageWidth - 20, 7, 'F');
//       doc.setTextColor(22, 163, 74);
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text('APPROVAL & SIGNATURES', 15, yPos + 5);
//       yPos += 12;

//       const isOK = data.overall_judgement === 'OK';
//       doc.setFillColor(isOK ? 220 : 254, isOK ? 252 : 226, isOK ? 231 : 226);
//       doc.setDrawColor(isOK ? 22 : 220, isOK ? 163 : 38, isOK ? 74 : 38);
//       doc.setLineWidth(1.5);
//       doc.rect(15, yPos, 70, 12, 'FD');

//       doc.setTextColor(isOK ? 22 : 185, isOK ? 163 : 28, isOK ? 74 : 28);
//       doc.setFontSize(14);
//       doc.setFont('helvetica', 'bold');
//       doc.text(`Overall: ${data.overall_judgement}`, 50, yPos + 8, { align: 'center' });
//       yPos += 18;

//       doc.setTextColor(0, 0, 0);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.text('Prepared By:', 15, yPos);
//       doc.setFont('helvetica', 'normal');
//       doc.text(data.prepared_by || '_________________', 42, yPos);
//       yPos += 8;
//       doc.setFont('helvetica', 'bold');
//       doc.text('Approved By:', 15, yPos);
//       doc.setFont('helvetica', 'normal');
//       doc.text(data.approved_by || '_________________', 42, yPos);

//       // Footer on all pages
//       const pageCount = doc.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         doc.setFillColor(37, 99, 235);
//         doc.rect(0, doc.internal.pageSize.height - 12, pageWidth, 12, 'F');
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(7);
//         doc.text(
//           `Quality Control Report | Page ${i} of ${pageCount} | Generated: ${new Date().toLocaleString()}`,
//           pageWidth / 2,
//           doc.internal.pageSize.height - 6,
//           { align: 'center' }
//         );
//       }

//       doc.save(`Inspection_Report_${reportId}_${new Date().toISOString().split('T')[0]}.pdf`);
//     } catch (error) {
//       console.error('PDF generation failed:', error);
//       alert('Failed to generate PDF');
//     }
//   };

//   const addProcessRow = () =>
//     setForm(p => ({ ...p, processRows: [...p.processRows, newProcess(p.processRows.length + 1)] }));

//   const addInprocessRow = () =>
//     setForm(p => ({ ...p, inprocessRows: [...p.inprocessRows, newInproc(p.inprocessRows.length + 1)] }));

//   const removeProcessRow = (i: number) => setForm(p =>
//     p.processRows.length === 1 ? p : { ...p, processRows: p.processRows.filter((_, idx) => idx !== i) });

//   const removeInprocessRow = (i: number) => setForm(p =>
//     p.inprocessRows.length === 1 ? p : { ...p, inprocessRows: p.inprocessRows.filter((_, idx) => idx !== i) });

//   const updateProcessRow = (rowIndex: number, field: keyof ProcessRow, value: any) => {
//     setForm(prev => ({
//       ...prev,
//       processRows: prev.processRows.map((row, i) =>
//         i === rowIndex ? { ...row, [field]: value } : row
//       )
//     }));
//   };

//   const updateInprocessRow = (rowIndex: number, field: keyof InprocessRow, value: any) => {
//     setForm(prev => ({
//       ...prev,
//       inprocessRows: prev.inprocessRows.map((row, i) =>
//         i === rowIndex ? { ...row, [field]: value } : row
//       )
//     }));
//   };

//   const updateReading = (rowIndex: number, readingIndex: number, value: string) => {
//     setForm(prev => ({
//       ...prev,
//       inprocessRows: prev.inprocessRows.map((row, i) =>
//         i === rowIndex ? {
//           ...row,
//           readings: row.readings.map((reading, j) => j === readingIndex ? value : reading)
//         } : row
//       )
//     }));
//   };

//   const filteredReports = reports.filter(r =>
//     r.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     r.part_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     r.customer?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const stepTitles = [
//     { num: 1, title: "Basic Info", icon: FileText, desc: "Part details" },
//     { num: 2, title: "Process Data", icon: Cog, desc: "Parameters" },
//     { num: 3, title: "Inspection", icon: Gauge, desc: "Measurements" },
//     { num: 4, title: "Approval", icon: Award, desc: "Review" }
//   ];

//   const stats = {
//     total: reports.length,
//     ok: reports.filter(r => r.overall_judgement === 'OK').length,
//     ng: reports.filter(r => r.overall_judgement === 'NG').length,
//     thisMonth: reports.filter(r => {
//       const reportDate = new Date(r.created_at);
//       const now = new Date();
//       return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
//     }).length
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-4">

//         {/* HEADER */}
//         <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                   <ClipboardList className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-white">Quality Inspection System</h1>
//                   <p className="text-blue-100 text-xs">In-Process Inspection & Approval</p>
//                 </div>
//               </div>
//               {view === 'list' ? (
//                 <button
//                   onClick={() => { resetForm(); setView('form'); }}
//                   className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition-all flex items-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   New Report
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => { resetForm(); setView('list'); }}
//                   className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                   Back to list
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* STATISTICS */}
//         {view === 'list' && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <Activity className="w-5 h-5" />
//                 <TrendingUp className="w-4 h-4 text-blue-200" />
//               </div>
//               <div className="text-2xl font-bold">{stats.total}</div>
//               <div className="text-blue-100 text-xs">Total Reports</div>
//             </div>
//             <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <CheckCircle2 className="w-5 h-5" />
//                 <span className="text-xs font-semibold">{stats.total ? Math.round((stats.ok / stats.total) * 100) : 0}%</span>
//               </div>
//               <div className="text-2xl font-bold">{stats.ok}</div>
//               <div className="text-green-100 text-xs">Approved (OK)</div>
//             </div>
//             <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <X className="w-5 h-5" />
//                 <span className="text-xs font-semibold">{stats.total ? Math.round((stats.ng / stats.total) * 100) : 0}%</span>
//               </div>
//               <div className="text-2xl font-bold">{stats.ng}</div>
//               <div className="text-red-100 text-xs">Rejected (NG)</div>
//             </div>
//             <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg p-4 text-white shadow">
//               <div className="flex items-center justify-between mb-1">
//                 <Calendar className="w-5 h-5" />
//               </div>
//               <div className="text-2xl font-bold">{stats.thisMonth}</div>
//               <div className="text-purple-100 text-xs">This Month</div>
//             </div>
//           </div>
//         )}

//         {/* LIST VIEW */}
//         {view === 'list' && (
//           <>
//             {/* Search & Controls */}
//             <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
//               <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-3">
//                 <div className="relative flex-1 w-full">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search by part name, number, or customer..."
//                     value={searchTerm}
//                     onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   />
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <select
//                     value={itemsPerPage}
//                     onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
//                     className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value={10}>10 per page</option>
//                     <option value={25}>25 per page</option>
//                     <option value={50}>50 per page</option>
//                     <option value={100}>100 per page</option>
//                   </select>
//                   <button
//                     onClick={() => setViewMode('card')}
//                     className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
//                   >
//                     <List className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => setViewMode('table')}
//                     className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
//                   >
//                     <Table className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//               <div className="text-xs text-gray-600">
//                 Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} reports
//                 {filteredReports.length > itemsPerPage && <span className="ml-2">• Page {currentPage} of {totalPages}</span>}
//               </div>
//             </div>

//             {loading && (
//               <div className="flex flex-col items-center justify-center py-16">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-3"></div>
//                 <p className="text-gray-600 text-sm">Loading reports...</p>
//               </div>
//             )}

//             {!loading && filteredReports.length === 0 && (
//               <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
//                 <ClipboardList className="w-16 h-16 text-gray-300 mb-3" />
//                 <h3 className="text-lg font-semibold text-gray-700 mb-1">
//                   {searchTerm ? 'No matching reports' : 'No reports yet'}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-4">
//                   {searchTerm ? 'Try different search terms' : 'Create your first inspection report'}
//                 </p>
//                 {!searchTerm && (
//                   <button
//                     onClick={() => { resetForm(); setView('form'); }}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Create Report
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* CARD VIEW */}
//             {!loading && currentReports.length > 0 && viewMode === 'card' && (
//               <>
//                 <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                   {currentReports.map((r: any) => (
//                     <div
//                       key={r.id}
//                       className="bg-white rounded-lg shadow hover:shadow-lg transition-all border border-gray-200"
//                     >
//                       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-t-lg">
//                         <div className="flex justify-between items-start mb-2">
//                           <div className="flex items-center gap-2">
//                             <Hash className="w-4 h-4" />
//                             <span className="font-bold text-lg">#{r.id}</span>
//                           </div>
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
//                             r.overall_judgement === 'OK' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
//                           }`}>
//                             {r.overall_judgement === 'OK' ? '✓ OK' : '✗ NG'}
//                           </span>
//                         </div>
//                         <div className="font-semibold text-sm truncate">{r.part_name || 'Unnamed Part'}</div>
//                       </div>
//                       <div className="p-3 space-y-2">
//                         <div className="bg-blue-50 rounded p-2 border border-blue-100">
//                           <div className="text-xs text-blue-600 font-semibold">Part Number</div>
//                           <div className="text-sm font-medium text-gray-900 truncate">{r.part_number || '—'}</div>
//                         </div>
//                         <div className="bg-green-50 rounded p-2 border border-green-100">
//                           <div className="text-xs text-green-600 font-semibold">Customer</div>
//                           <div className="text-sm font-medium text-gray-900 truncate">{r.customer || '—'}</div>
//                         </div>
//                         <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
//                           <span className="flex items-center gap-1">
//                             <Calendar className="w-3 h-3" />
//                             {r.created_at?.slice(0, 10) || '—'}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <UserCheck className="w-3 h-3" />
//                             {r.prepared_by || 'Unsigned'}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="bg-gray-50 px-3 py-2 flex gap-2 rounded-b-lg">
//                         <button
//                           onClick={() => openViewModal(r.id)}
//                           className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 flex items-center justify-center gap-1"
//                         >
//                           <Eye className="w-3 h-3" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => downloadPDF(r.id)}
//                           className="flex-1 bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-purple-700 flex items-center justify-center gap-1"
//                         >
//                           <Download className="w-3 h-3" />
//                           PDF
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination for cards */}
//                 {totalPages > 1 && (
//                   <div className="mt-4 flex justify-center items-center gap-1">
//                     <button
//                       onClick={() => paginate(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>
//                     {[...Array(Math.min(totalPages, 7))].map((_, index) => {
//                       let pageNumber: number;
//                       if (totalPages <= 7) {
//                         pageNumber = index + 1;
//                       } else if (currentPage <= 4) {
//                         pageNumber = index + 1;
//                       } else if (currentPage >= totalPages - 3) {
//                         pageNumber = totalPages - 6 + index;
//                       } else {
//                         pageNumber = currentPage - 3 + index;
//                       }
//                       return (
//                         <button
//                           key={index}
//                           onClick={() => paginate(pageNumber)}
//                           className={`w-8 h-8 rounded font-semibold text-sm ${
//                             currentPage === pageNumber
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
//                           }`}
//                         >
//                           {pageNumber}
//                         </button>
//                       );
//                     })}
//                     <button
//                       onClick={() => paginate(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* TABLE VIEW */}
//             {!loading && currentReports.length > 0 && viewMode === 'table' && (
//               <>
//                 <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Part Name</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Part No.</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Customer</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Operation</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Date</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {currentReports.map((r: any, idx: number) => (
//                           <tr key={r.id} className={`hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                             <td className="px-4 py-3">
//                               <span className="font-bold text-gray-900">#{r.id}</span>
//                             </td>
//                             <td className="px-4 py-3 font-medium text-gray-900">{r.part_name || '—'}</td>
//                             <td className="px-4 py-3 text-gray-700">{r.part_number || '—'}</td>
//                             <td className="px-4 py-3 text-gray-700">{r.customer || '—'}</td>
//                             <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{r.operation_name || '—'}</td>
//                             <td className="px-4 py-3">
//                               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                                 r.overall_judgement === 'OK'
//                                   ? 'bg-green-100 text-green-700'
//                                   : 'bg-red-100 text-red-700'
//                               }`}>
//                                 {r.overall_judgement === 'OK' ? '✓ OK' : '✗ NG'}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 text-gray-600">{r.created_at?.slice(0, 10) || '—'}</td>
//                             <td className="px-4 py-3">
//                               <div className="flex gap-1">
//                                 <button
//                                   onClick={() => openViewModal(r.id)}
//                                   className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700"
//                                 >
//                                   View
//                                 </button>
//                                 <button
//                                   onClick={() => downloadPDF(r.id)}
//                                   className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700"
//                                 >
//                                   PDF
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Pagination for table */}
//                 {totalPages > 1 && (
//                   <div className="mt-4 flex justify-center items-center gap-1">
//                     <button
//                       onClick={() => paginate(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>
//                     {[...Array(Math.min(totalPages, 7))].map((_, index) => {
//                       let pageNumber: number;
//                       if (totalPages <= 7) {
//                         pageNumber = index + 1;
//                       } else if (currentPage <= 4) {
//                         pageNumber = index + 1;
//                       } else if (currentPage >= totalPages - 3) {
//                         pageNumber = totalPages - 6 + index;
//                       } else {
//                         pageNumber = currentPage - 3 + index;
//                       }
//                       return (
//                         <button
//                           key={index}
//                           onClick={() => paginate(pageNumber)}
//                           className={`w-8 h-8 rounded font-semibold text-sm ${
//                             currentPage === pageNumber
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
//                           }`}
//                         >
//                           {pageNumber}
//                         </button>
//                       );
//                     })}
//                     <button
//                       onClick={() => paginate(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </>
//         )}

//         {/* FORM VIEW */}
//         {view === 'form' && (
//           <>
//             {/* Progress Steps */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
//               <div className="flex items-center justify-between">
//                 {stepTitles.map((step, idx) => (
//                   <div key={step.num} className="flex items-center flex-1">
//                     <div className="flex flex-col items-center flex-1">
//                       <button
//                         onClick={() => setFormStep(step.num as 1 | 2 | 3 | 4)}
//                         className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all ${
//                           formStep === step.num
//                             ? 'bg-blue-600 text-white shadow-lg scale-110'
//                             : formStep > step.num
//                             ? 'bg-green-500 text-white'
//                             : 'bg-gray-200 text-gray-500'
//                         }`}
//                       >
//                         {formStep > step.num ? (
//                           <CheckCircle2 className="w-6 h-6" />
//                         ) : (
//                           <step.icon className="w-5 h-5" />
//                         )}
//                       </button>
//                       <div className="mt-2 text-center">
//                         <div className={`text-xs font-semibold ${
//                           formStep === step.num ? 'text-blue-600' : formStep > step.num ? 'text-green-600' : 'text-gray-500'
//                         }`}>
//                           {step.title}
//                         </div>
//                         <div className="text-xs text-gray-400">{step.desc}</div>
//                       </div>
//                     </div>
//                     {idx < stepTitles.length - 1 && (
//                       <div className={`h-1 flex-1 mx-4 rounded ${
//                         formStep > step.num ? 'bg-green-500' : 'bg-gray-200'
//                       }`} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* STEP 1: Basic Information */}
//             {formStep === 1 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 flex items-center gap-3">
//                   <FileText className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 1: Basic Information</h2>
//                     <p className="text-blue-100 text-xs">Enter part and operation details</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Part Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.partName}
//                         onChange={(e) => setField('partName', e.target.value)}
//                         placeholder="Enter part name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Part Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.partNumber}
//                         onChange={(e) => setField('partNumber', e.target.value)}
//                         placeholder="Enter part number"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Customer <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.customer}
//                         onChange={(e) => setField('customer', e.target.value)}
//                         placeholder="Enter customer name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Operation Name/Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={form.operationName}
//                         onChange={(e) => setField('operationName', e.target.value)}
//                         placeholder="Enter operation details"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       onClick={() => setFormStep(2)}
//                       disabled={!form.partName || !form.partNumber || !form.customer || !form.operationName}
//                       className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
//                     >
//                       Next Step
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: Process Setting Data */}
//             {formStep === 2 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-3 flex items-center gap-3">
//                   <Cog className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 2: Process Setting Data</h2>
//                     <p className="text-orange-100 text-xs">Record machine parameters</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
//                     <div className="flex items-start gap-2">
//                       <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
//                       <div>
//                         <h4 className="font-semibold text-orange-900 text-sm">About Process Data</h4>
//                         <p className="text-orange-800 text-xs mt-1">
//                           Record three stages: Initial Process Setting, After Machine Change, and LQA Verification.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {form.processRows.map((row, i) => (
//                       <div key={`process-${i}`} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
//                             <span className="w-6 h-6 bg-orange-600 text-white rounded flex items-center justify-center text-xs">
//                               {i + 1}
//                             </span>
//                             Parameter #{i + 1}
//                           </h3>
//                           {form.processRows.length > 1 && (
//                             <button
//                               onClick={() => removeProcessRow(i)}
//                               className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>

//                         <div className="grid md:grid-cols-4 gap-3 mb-3">
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">S.No</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                               value={row.sno}
//                               readOnly
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Parameter Name</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
//                               value={row.parameter}
//                               onChange={(e) => updateProcessRow(i, 'parameter', e.target.value)}
//                               placeholder="e.g., Temperature"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Specification</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
//                               value={row.specification}
//                               onChange={(e) => updateProcessRow(i, 'specification', e.target.value)}
//                               placeholder="e.g., 80-90°C"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Method</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
//                               value={row.method}
//                               onChange={(e) => updateProcessRow(i, 'method', e.target.value)}
//                               placeholder="e.g., Gauge"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid lg:grid-cols-3 gap-3">
//                           {[
//                             { title: '1. Process Setting', key: 'machineData' as const },
//                             { title: '2. After M/C Change', key: 'firstChange' as const },
//                             { title: '3. LQA Verification', key: 'secondChange' as const }
//                           ].map(({ title, key }) => {
//                             const block = row[key];
//                             return (
//                               <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
//                                 <h4 className="text-xs font-bold text-gray-700 mb-2">{title}</h4>
//                                 <div className="space-y-2">
//                                   <input
//                                     className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                     value={block.machineNo}
//                                     onChange={(e) => updateProcessRow(i, key, { ...block, machineNo: e.target.value })}
//                                     placeholder="Machine No."
//                                   />
//                                   <input
//                                     className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                     value={block.operator}
//                                     onChange={(e) => updateProcessRow(i, key, { ...block, operator: e.target.value })}
//                                     placeholder="Operator"
//                                   />
//                                   <input
//                                     className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                                     value={`${block.date} ${block.time}`.trim()}
//                                     onChange={(e) => {
//                                       const parts = e.target.value.split(' ');
//                                       const date = parts[0] || '';
//                                       const time = parts.slice(1).join(' ') || '';
//                                       updateProcessRow(i, key, { ...block, date, time });
//                                     }}
//                                     placeholder="YYYY-MM-DD HH:MM"
//                                   />
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>

//                         <div className="mt-3">
//                           <label className="block text-xs font-semibold text-gray-700 mb-1">Action Taken</label>
//                           <textarea
//                             className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 resize-none text-sm"
//                             rows={2}
//                             value={row.action}
//                             onChange={(e) => updateProcessRow(i, 'action', e.target.value)}
//                             placeholder="Describe actions if any..."
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 text-center">
//                     <button
//                       onClick={addProcessRow}
//                       className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 mx-auto"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Parameter
//                     </button>
//                   </div>

//                   <div className="mt-6 flex justify-between">
//                     <button
//                       onClick={() => setFormStep(1)}
//                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => setFormStep(3)}
//                       className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2"
//                     >
//                       Next Step
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 3: In-Process Inspection */}
//             {formStep === 3 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 flex items-center gap-3">
//                   <Gauge className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 3: In-Process Inspection</h2>
//                     <p className="text-purple-100 text-xs">Record 10 measurements per parameter</p>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
//                     <div className="flex items-start gap-2">
//                       <Info className="w-4 h-4 text-purple-600 mt-0.5" />
//                       <div>
//                         <h4 className="font-semibold text-purple-900 text-sm">Measurement Instructions</h4>
//                         <p className="text-purple-800 text-xs mt-1">
//                           Take 10 consecutive measurements for each parameter.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {form.inprocessRows.map((row, i) => (
//                       <div key={`inprocess-${i}`} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
//                             <span className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
//                               {i + 1}
//                             </span>
//                             Measurement #{i + 1}
//                           </h3>
//                           {form.inprocessRows.length > 1 && (
//                             <button
//                               onClick={() => removeInprocessRow(i)}
//                               className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>

//                         <div className="grid md:grid-cols-4 gap-3 mb-3">
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">S.No</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                               value={row.sno}
//                               readOnly
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Parameter Name</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
//                               value={row.parameter}
//                               onChange={(e) => updateInprocessRow(i, 'parameter', e.target.value)}
//                               placeholder="e.g., Dimension"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Specification</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
//                               value={row.specification}
//                               onChange={(e) => updateInprocessRow(i, 'specification', e.target.value)}
//                               placeholder="e.g., 10±0.5mm"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold text-gray-600 mb-1">Method</label>
//                             <input
//                               className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
//                               value={row.method}
//                               onChange={(e) => updateInprocessRow(i, 'method', e.target.value)}
//                               placeholder="e.g., Caliper"
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">10 Readings</label>
//                           <div className="grid grid-cols-5 lg:grid-cols-10 gap-2">
//                             {row.readings.map((reading, j) => (
//                               <div key={j}>
//                                 <label className="block text-xs text-gray-500 mb-1 text-center">#{j + 1}</label>
//                                 <input
//                                   className="w-full px-2 py-2 text-xs border border-purple-200 rounded focus:ring-2 focus:ring-purple-500 text-center"
//                                   value={reading}
//                                   onChange={(e) => updateReading(i, j, e.target.value)}
//                                   placeholder="0.0"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 text-center">
//                     <button
//                       onClick={addInprocessRow}
//                       className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2 mx-auto"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Measurement
//                     </button>
//                   </div>

//                   <div className="mt-6 flex justify-between">
//                     <button
//                       onClick={() => setFormStep(2)}
//                       className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => setFormStep(4)}
//                       className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2"
//                     >
//                       Next Step
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 4: Review & Approval */}
//             {formStep === 4 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative">
//                 <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 flex items-center gap-3">
//                   <Award className="w-5 h-5" />
//                   <div>
//                     <h2 className="text-lg font-bold">Step 4: Review & Approval</h2>
//                     <p className="text-green-100 text-xs">Final judgement and signatures</p>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="grid md:grid-cols-3 gap-3 mb-6">
//                     <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                       <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Part Details</div>
//                       <div className="text-sm font-bold text-gray-900">{form.partName || 'Not set'}</div>
//                       <div className="text-xs text-gray-600">{form.partNumber || 'No part number'}</div>
//                     </div>
//                     <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
//                       <div className="text-xs font-semibold text-orange-600 uppercase mb-1">Process Parameters</div>
//                       <div className="text-2xl font-bold text-gray-900">{form.processRows.length}</div>
//                       <div className="text-xs text-gray-600">Parameters recorded</div>
//                     </div>
//                     <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
//                       <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Measurements</div>
//                       <div className="text-2xl font-bold text-gray-900">{form.inprocessRows.length}</div>
//                       <div className="text-xs text-gray-600">Quality checks</div>
//                     </div>
//                   </div>

//                   <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
//                     <h3 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
//                       <CheckCircle2 className="w-5 h-5" />
//                       Overall Judgement
//                     </h3>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2 cursor-pointer flex-1">
//                         <input
//                           type="radio"
//                           name="judgement"
//                           value="OK"
//                           checked={form.overallJudgement === 'OK'}
//                           onChange={(e) => setField('overallJudgement', e.target.value)}
//                           className="w-4 h-4"
//                         />
//                         <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-green-300 flex-1">
//                           <CheckCircle2 className="w-5 h-5 text-green-600" />
//                           <span className="font-semibold text-green-700">OK - Approved</span>
//                         </div>
//                       </label>
//                       <label className="flex items-center gap-2 cursor-pointer flex-1">
//                         <input
//                           type="radio"
//                           name="judgement"
//                           value="NG"
//                           checked={form.overallJudgement === 'NG'}
//                           onChange={(e) => setField('overallJudgement', e.target.value)}
//                           className="w-4 h-4"
//                         />
//                         <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-red-300 flex-1">
//                           <X className="w-5 h-5 text-red-600" />
//                           <span className="font-semibold text-red-700">NG - Rejected</span>
//                         </div>
//                       </label>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4 mb-6">
//                     <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                       <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-sm">
//                         <User className="w-4 h-4" />
//                         Prepared By
//                       </h4>
//                       <input
//                         type="text"
//                         value={form.preparedBy}
//                         onChange={(e) => setField('preparedBy', e.target.value)}
//                         placeholder="Enter name"
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                       <div className="mt-2 text-xs text-blue-700">Technician / Operator</div>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//                       <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2 text-sm">
//                         <UserCheck className="w-4 h-4" />
//                         Approved By
//                       </h4>
//                       <input
//                         type="text"
//                         value={form.approvedBy}
//                         onChange={(e) => setField('approvedBy', e.target.value)}
//                         placeholder="Enter name"
//                         className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                       <div className="mt-2 text-xs text-green-700">Supervisor / Manager</div>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//                     <button
//                       onClick={() => setFormStep(3)}
//                       disabled={loading}
//                       className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition flex items-center gap-2 disabled:opacity-50"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Back
//                     </button>

//                     <button
//                       onClick={handleFinalSubmit}
//                       disabled={loading}
//                       className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
//                         loading
//                           ? 'bg-gray-400 cursor-not-allowed text-white'
//                           : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
//                       }`}
//                     >
//                       <Save className="w-5 h-5" />
//                       {loading ? 'Saving...' : currentId ? 'Update Report' : 'Submit Report'}
//                     </button>
//                   </div>
//                 </div>

//                 {loading && (
//                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded-lg">
//                     <div className="bg-white px-8 py-6 rounded-xl shadow-2xl flex flex-col items-center">
//                       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mb-4"></div>
//                       <p className="text-gray-700 font-medium">Saving report...</p>
//                       <p className="text-gray-500 text-sm mt-1">Please wait</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         )}

//         {/* CONFIRMATION DIALOG */}
//         {showConfirmDialog && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
//               <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
//                 <h3 className="text-xl font-bold flex items-center gap-3">
//                   {confirmAction === 'update' ? (
//                     <>
//                       <Cog className="w-6 h-6" />
//                       Update Report?
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 className="w-6 h-6" />
//                       Submit New Report?
//                     </>
//                   )}
//                 </h3>
//               </div>

//               <div className="p-6 space-y-4">
//                 <p className="text-gray-700 leading-relaxed">
//                   {confirmAction === 'update'
//                     ? 'You are about to **update** this existing inspection report.'
//                     : 'You are about to **create** a new inspection report.'}
//                 </p>

//                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
//                     <div>
//                       This action will {confirmAction === 'update' ? 'modify' : 'save'} the report permanently.
//                       <br />
//                       Make sure all data is correct before continuing.
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => setShowConfirmDialog(false)}
//                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={confirmAndSave}
//                     disabled={loading}
//                     className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                       loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white shadow'
//                     }`}
//                   >
//                     {loading && (
//                       <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                     )}
//                     {loading ? 'Saving...' : 'Confirm & Save'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* VIEW DETAILS MODAL */}
//         {showViewModal && viewedReport && (
//           <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto p-4">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8 relative">

//               {/* Modal Header */}
//               <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-5 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
//                 <div className="flex items-center gap-3">
//                   <Eye className="w-6 h-6" />
//                   <div>
//                     <h2 className="text-xl font-bold">Inspection Report #{viewedReport.id}</h2>
//                     <p className="text-blue-100 text-sm">
//                       {viewedReport.part_name || 'Unnamed'} • {viewedReport.part_number || '—'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => downloadPDF(viewedReport.id)}
//                     className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
//                   >
//                     <Download className="w-4 h-4" />
//                     Download PDF
//                   </button>
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="text-white hover:bg-white/20 p-2 rounded-full transition"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>

//               {/* Modal Body */}
//               <div className="p-6 max-h-[75vh] overflow-y-auto">

//                 {/* Basic Info */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
//                     <FileText className="w-5 h-5 text-blue-600" />
//                     Basic Information
//                   </h3>
//                   <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div>
//                       <div className="text-xs text-gray-500">Part Name</div>
//                       <div className="font-medium">{viewedReport.part_name || '—'}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Part Number</div>
//                       <div className="font-medium">{viewedReport.part_number || '—'}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Customer</div>
//                       <div className="font-medium">{viewedReport.customer || '—'}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Operation</div>
//                       <div className="font-medium">{viewedReport.operation_name || '—'}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Judgement */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
//                     <Award className="w-5 h-5 text-green-600" />
//                     Overall Judgement
//                   </h3>
//                   <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-bold ${
//                     viewedReport.overall_judgement === 'OK'
//                       ? 'bg-green-100 text-green-800 border border-green-200'
//                       : 'bg-red-100 text-red-800 border border-red-200'
//                   }`}>
//                     {viewedReport.overall_judgement === 'OK' ? (
//                       <CheckCircle2 className="w-6 h-6 text-green-600" />
//                     ) : (
//                       <X className="w-6 h-6 text-red-600" />
//                     )}
//                     {viewedReport.overall_judgement}
//                   </div>
//                 </div>

//                 {/* Process Parameters */}
//                 {viewedReport.process_parameters?.length > 0 && (
//                   <div className="mb-8">
//                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
//                       <Cog className="w-5 h-5 text-orange-600" />
//                       Process Setting Data
//                     </h3>
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-sm border-collapse">
//                         <thead>
//                           <tr className="bg-orange-50">
//                             <th className="p-3 text-left border-b">S.No</th>
//                             <th className="p-3 text-left border-b">Parameter</th>
//                             <th className="p-3 text-left border-b">Specification</th>
//                             <th className="p-3 text-left border-b">Method</th>
//                             <th className="p-3 text-left border-b">Process M/C</th>
//                             <th className="p-3 text-left border-b">After Change M/C</th>
//                             <th className="p-3 text-left border-b">LQA M/C</th>
//                             <th className="p-3 text-left border-b">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {viewedReport.process_parameters.map((p: any, idx: number) => (
//                             <tr key={idx} className="hover:bg-gray-50 border-b">
//                               <td className="p-3">{p.sno || idx + 1}</td>
//                               <td className="p-3">{p.parameter_name || '—'}</td>
//                               <td className="p-3">{p.specification || '—'}</td>
//                               <td className="p-3">{p.method || '—'}</td>
//                               <td className="p-3">
//                                 {p.process_machine_no || '—'}<br/>
//                                 <span className="text-xs text-gray-500">{p.process_operator || '—'}</span>
//                               </td>
//                               <td className="p-3">
//                                 {p.change_machine_no || '—'}<br/>
//                                 <span className="text-xs text-gray-500">{p.change_operator || '—'}</span>
//                               </td>
//                               <td className="p-3">
//                                 {p.lqa_machine_no || '—'}<br/>
//                                 <span className="text-xs text-gray-500">{p.lqa_operator || '—'}</span>
//                               </td>
//                               <td className="p-3">{p.action || '—'}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//                 {/* In-Process Measurements */}
//                 {viewedReport.inprocess_parameters?.length > 0 && (
//                   <div className="mb-8">
//                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
//                       <Gauge className="w-5 h-5 text-purple-600" />
//                       In-Process Inspection Data
//                     </h3>
//                     {viewedReport.inprocess_parameters.map((param: any, idx: number) => (
//                       <div key={idx} className="mb-6">
//                         <div className="font-medium mb-2">
//                           {param.parameter_name || '—'}
//                           <span className="text-gray-500 text-sm ml-2">
//                             ({param.specification || '—'})
//                           </span>
//                         </div>
//                         <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
//                           {(param.readings || Array(10).fill('—')).map((val: string, i: number) => (
//                             <div key={i} className="text-center">
//                               <div className="text-xs text-gray-500">#{i + 1}</div>
//                               <div className="font-mono bg-purple-50 border border-purple-100 rounded px-2 py-1 text-sm">
//                                 {val || '—'}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Signatures */}
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
//                     <UserCheck className="w-5 h-5 text-green-600" />
//                     Approval & Signatures
//                   </h3>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <div className="text-sm text-gray-500">Prepared By</div>
//                       <div className="font-medium text-lg">{viewedReport.prepared_by || '—'}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500">Approved By</div>
//                       <div className="font-medium text-lg">{viewedReport.approved_by || '—'}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     openReport(viewedReport.id);
//                   }}
//                   className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
//                 >
//                   Edit this Report
//                 </button>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import {
  Plus, Hash, User, Search, Calendar,
  ChevronRight, ChevronLeft, CheckCircle2,
  FileText, Table, List, Eye, Trash2, Save,
  AlertCircle, Info, Gauge, Cog,
  ClipboardList, UserCheck, Award, X,
  Download, TrendingUp, Activity, ArrowRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type MachineBlock = { machineNo: string; operator: string; date: string; time: string };
type ProcessRow = {
  sno: string;
  parameter: string;
  specification: string;
  method: string;
  machineData: MachineBlock;
  firstChange: MachineBlock;
  secondChange: MachineBlock;
  action: string;
};
type InprocessRow = {
  sno: string;
  parameter: string;
  specification: string;
  method: string;
  readings: string[]
};
type FormState = {
  partName: string;
  partNumber: string;
  customer: string;
  operationName: string;
  overallJudgement: 'OK' | 'NG';
  preparedBy: string;
  approvedBy: string;
  processRows: ProcessRow[];
  inprocessRows: InprocessRow[];
};

const API = 'http://localhost:8000/api';
const newMachine = (): MachineBlock => ({ machineNo: '', operator: '', date: '', time: '' });
const newProcess = (idx = 1): ProcessRow => ({
  sno: String(idx),
  parameter: '',
  specification: '',
  method: '',
  machineData: newMachine(),
  firstChange: newMachine(),
  secondChange: newMachine(),
  action: '',
});
const newInproc = (idx = 1): InprocessRow => ({
  sno: String(idx),
  parameter: '',
  specification: '',
  method: '',
  readings: Array(10).fill(''),
});

interface InspectionFormProps {
  setSelectedModule?: (module: string) => void;
}

export default function InspectionForm({ setSelectedModule }: InspectionFormProps) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'submit' | 'update' | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedReport, setViewedReport] = useState<any>(null);

  useEffect(() => {
    if (view === 'list') fetchReports();
  }, [view]);

  useEffect(() => {
    const prefillData = localStorage.getItem("inspection_prefill_data");
    if (prefillData) {
      try {
        const data = JSON.parse(prefillData);
        setForm(prev => ({
          ...prev,
          partName: data.partName || prev.partName,
          partNumber: data.partNumber || prev.partNumber,
          customer: data.customer || prev.customer,
          operationName: data.operationName || prev.operationName,
        }));
        localStorage.removeItem("inspection_prefill_data");
        setView('form');
        setFormStep(1);
      } catch (error) {
        console.error("Failed to load prefill data:", error);
      }
    }
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/reports/`);
      if (!r.ok) throw new Error();
      setReports(await r.json());
    } catch {
      alert('Could not load reports');
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState<FormState>({
    partName: '',
    partNumber: '',
    customer: '',
    operationName: '',
    overallJudgement: 'OK',
    preparedBy: '',
    approvedBy: '',
    processRows: [newProcess()],
    inprocessRows: [newInproc()],
  });

  const resetForm = () => {
    setCurrentId(null);
    setFormStep(1);
    setForm({
      partName: '',
      partNumber: '',
      customer: '',
      operationName: '',
      overallJudgement: 'OK',
      preparedBy: '',
      approvedBy: '',
      processRows: [newProcess()],
      inprocessRows: [newInproc()],
    });
  };

  const setField = (k: keyof FormState, v: any) => setForm(p => ({ ...p, [k]: v }));

  const buildPayload = () => ({
    part_name: form.partName,
    part_number: form.partNumber,
    customer: form.customer,
    operation_name: form.operationName,
    overall_judgement: form.overallJudgement,
    prepared_by: form.preparedBy,
    approved_by: form.approvedBy,
    process_parameters: form.processRows.map(r => ({
      sno: r.sno,
      parameter_name: r.parameter,
      specification: r.specification,
      method: r.method,
      process_machine_no: r.machineData.machineNo,
      process_operator: r.machineData.operator,
      process_date_time: `${r.machineData.date} ${r.machineData.time}`.trim(),
      change_machine_no: r.firstChange.machineNo,
      change_operator: r.firstChange.operator,
      change_date_time: `${r.firstChange.date} ${r.firstChange.time}`.trim(),
      lqa_machine_no: r.secondChange.machineNo,
      lqa_operator: r.secondChange.operator,
      lqa_date_time: `${r.secondChange.date} ${r.secondChange.time}`.trim(),
      action: r.action,
    })),
    inprocess_parameters: form.inprocessRows.map(r => ({
      sno: r.sno,
      parameter_name: r.parameter,
      specification: r.specification,
      method: r.method,
      readings: r.readings,
    })),
  });

  const handleFinalSubmit = () => {
    setConfirmAction(currentId ? 'update' : 'submit');
    setShowConfirmDialog(true);
  };

  const confirmAndSave = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    try {
      const url = currentId ? `${API}/reports/${currentId}/` : `${API}/reports/`;
      const method = currentId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Server error');
      }
      alert(currentId ? 'Report updated successfully!' : 'Report submitted successfully!');
      resetForm();
      setView('list');
    } catch (e: any) {
      console.error(e);
      alert(`Save failed: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const openReport = async (id: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/reports/${id}/`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setForm({
        partName: data.part_name || '',
        partNumber: data.part_number || '',
        customer: data.customer || '',
        operationName: data.operation_name || '',
        overallJudgement: data.overall_judgement || 'OK',
        preparedBy: data.prepared_by || '',
        approvedBy: data.approved_by || '',
        processRows: (data.process_parameters || []).map((p: any, idx: number): ProcessRow => ({
          sno: p.sno || String(idx + 1),
          parameter: p.parameter_name || '',
          specification: p.specification || '',
          method: p.method || '',
          machineData: {
            machineNo: p.process_machine_no || '',
            operator: p.process_operator || '',
            date: p.process_date_time?.split(' ')[0] || '',
            time: p.process_date_time?.split(' ')[1] || '',
          },
          firstChange: {
            machineNo: p.change_machine_no || '',
            operator: p.change_operator || '',
            date: p.change_date_time?.split(' ')[0] || '',
            time: p.change_date_time?.split(' ')[1] || '',
          },
          secondChange: {
            machineNo: p.lqa_machine_no || '',
            operator: p.lqa_operator || '',
            date: p.lqa_date_time?.split(' ')[0] || '',
            time: p.lqa_date_time?.split(' ')[1] || '',
          },
          action: p.action || '',
        })),
        inprocessRows: (data.inprocess_parameters || []).map((p: any, idx: number): InprocessRow => ({
          sno: p.sno || String(idx + 1),
          parameter: p.parameter_name || '',
          specification: p.specification || '',
          method: p.method || '',
          readings: p.readings?.length === 10 ? p.readings : Array(10).fill('').map((_, i) => p.readings?.[i] || ''),
        })),
      });
      if (!data.process_parameters?.length) {
        setForm(prev => ({ ...prev, processRows: [newProcess()] }));
      }
      if (!data.inprocess_parameters?.length) {
        setForm(prev => ({ ...prev, inprocessRows: [newInproc()] }));
      }
      setCurrentId(id);
      setView('form');
      setFormStep(1);
    } catch {
      alert('Could not load report for editing');
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (id: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/reports/${id}/`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setViewedReport(data);
      setShowViewModal(true);
    } catch {
      alert('Could not load report details');
    } finally {
      setLoading(false);
    }
  };

  // const navigate4MChange = (reportId: number, reportData: any) => {
  //   const prefillData = {
  //     reportId: reportId,
  //     partName: reportData.part_name || '',
  //     partNumber: reportData.part_number || '',
  //     customer: reportData.customer || '',
  //     operationName: reportData.operation_name || '',
  //   };
  //   localStorage.setItem('change_note_prefill', JSON.stringify(prefillData));
  //   window.location.href = '/'; // Adjust this path based on your routing
  // };
const navigate4MChange = (reportId: number, reportData: any) => {
  const prefillData = {
    reportId: reportId,
    partName: reportData.part_name || '',
    partNumber: reportData.part_number || '',
    customer: reportData.customer || '',
    operationName: reportData.operation_name || '',
  };
  localStorage.setItem('change_note_prefill', JSON.stringify(prefillData));
  
  // Navigate to CIN module
  if (setSelectedModule) {
    setSelectedModule("CIN");
  }
};
  const downloadPDF = async (reportId: number) => {
    try {
      const r = await fetch(`${API}/reports/${reportId}/`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPos = 20;

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('IN-PROCESS INSPECTION REPORT', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(9);
      doc.text(`Report #${reportId} | ${new Date().toLocaleDateString()}`, pageWidth / 2, 25, { align: 'center' });
      yPos = 45;

      // Basic Information
      doc.setFillColor(239, 246, 255);
      doc.rect(10, yPos, pageWidth - 20, 7, 'F');
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('BASIC INFORMATION', 15, yPos + 5);
      yPos += 12;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const basicInfo = [
        ['Part Name:', data.part_name || '—'],
        ['Part Number:', data.part_number || '—'],
        ['Customer:', data.customer || '—'],
        ['Operation:', data.operation_name || '—'],
      ];
      basicInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 55, yPos);
        yPos += 6;
      });
      yPos += 5;

      // Process Parameters
      if (data.process_parameters?.length > 0) {
        doc.setFillColor(254, 243, 199);
        doc.rect(10, yPos, pageWidth - 20, 7, 'F');
        doc.setTextColor(217, 119, 6);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PROCESS SETTING DATA', 15, yPos + 5);
        yPos += 10;
        const processHeaders = ['S.No', 'Parameter', 'Spec', 'Method', 'M/C No', 'Operator', 'Action'];
        const processData = data.process_parameters.map((p: any) => [
          p.sno || '—',
          p.parameter_name || '—',
          p.specification || '—',
          p.method || '—',
          p.process_machine_no || '—',
          p.process_operator || '—',
          (p.action || '—').substring(0, 25) + (p.action?.length > 25 ? '...' : ''),
        ]);
        autoTable(doc, {
          startY: yPos,
          head: [processHeaders],
          body: processData,
          theme: 'grid',
          headStyles: { fillColor: [251, 146, 60], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
          bodyStyles: { fontSize: 7, textColor: [0, 0, 0] },
          alternateRowStyles: { fillColor: [254, 243, 199] },
          margin: { left: 10, right: 10 }
        });
        yPos = (doc as any).lastAutoTable.finalY + 8;
      }

      // In-Process Measurements
      if (data.inprocess_parameters?.length > 0) {
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFillColor(243, 232, 255);
        doc.rect(10, yPos, pageWidth - 20, 7, 'F');
        doc.setTextColor(147, 51, 234);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('IN-PROCESS INSPECTION DATA', 15, yPos + 5);
        yPos += 10;
        data.inprocess_parameters.forEach((param: any) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFillColor(243, 232, 255);
          doc.rect(10, yPos, pageWidth - 20, 5, 'F');
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`Parameter: ${param.parameter_name || '—'} | Spec: ${param.specification || '—'}`, 15, yPos + 3.5);
          yPos += 8;
          const readingsHeaders = ['#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10'];
          const readingsData = [param.readings || Array(10).fill('—')];
          autoTable(doc, {
            startY: yPos,
            head: [readingsHeaders],
            body: readingsData,
            theme: 'grid',
            headStyles: { fillColor: [168, 85, 247], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7, halign: 'center' },
            bodyStyles: { fontSize: 8, halign: 'center', textColor: [0, 0, 0] },
            margin: { left: 10, right: 10 }
          });
          yPos = (doc as any).lastAutoTable.finalY + 6;
        });
      }

      // Approval Section
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFillColor(220, 252, 231);
      doc.rect(10, yPos, pageWidth - 20, 7, 'F');
      doc.setTextColor(22, 163, 74);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('APPROVAL & SIGNATURES', 15, yPos + 5);
      yPos += 12;
      const isOK = data.overall_judgement === 'OK';
      doc.setFillColor(isOK ? 220 : 254, isOK ? 252 : 226, isOK ? 231 : 226);
      doc.setDrawColor(isOK ? 22 : 220, isOK ? 163 : 38, isOK ? 74 : 38);
      doc.setLineWidth(1.5);
      doc.rect(15, yPos, 70, 12, 'FD');
      doc.setTextColor(isOK ? 22 : 185, isOK ? 163 : 28, isOK ? 74 : 28);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Overall: ${data.overall_judgement}`, 50, yPos + 8, { align: 'center' });
      yPos += 18;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Prepared By:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(data.prepared_by || '_________________', 42, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'bold');
      doc.text('Approved By:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(data.approved_by || '_________________', 42, yPos);

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(37, 99, 235);
        doc.rect(0, doc.internal.pageSize.height - 12, pageWidth, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.text(
          `Quality Control Report | Page ${i} of ${pageCount} | Generated: ${new Date().toLocaleString()}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 6,
          { align: 'center' }
        );
      }

      doc.save(`Inspection_Report_${reportId}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF');
    }
  };

  const addProcessRow = () =>
    setForm(p => ({ ...p, processRows: [...p.processRows, newProcess(p.processRows.length + 1)] }));
  const addInprocessRow = () =>
    setForm(p => ({ ...p, inprocessRows: [...p.inprocessRows, newInproc(p.inprocessRows.length + 1)] }));
  const removeProcessRow = (i: number) => setForm(p =>
    p.processRows.length === 1 ? p : { ...p, processRows: p.processRows.filter((_, idx) => idx !== i) });
  const removeInprocessRow = (i: number) => setForm(p =>
    p.inprocessRows.length === 1 ? p : { ...p, inprocessRows: p.inprocessRows.filter((_, idx) => idx !== i) });

  const updateProcessRow = (rowIndex: number, field: keyof ProcessRow, value: any) => {
    setForm(prev => ({
      ...prev,
      processRows: prev.processRows.map((row, i) =>
        i === rowIndex ? { ...row, [field]: value } : row
      )
    }));
  };

  const updateInprocessRow = (rowIndex: number, field: keyof InprocessRow, value: any) => {
    setForm(prev => ({
      ...prev,
      inprocessRows: prev.inprocessRows.map((row, i) =>
        i === rowIndex ? { ...row, [field]: value } : row
      )
    }));
  };

  const updateReading = (rowIndex: number, readingIndex: number, value: string) => {
    setForm(prev => ({
      ...prev,
      inprocessRows: prev.inprocessRows.map((row, i) =>
        i === rowIndex ? {
          ...row,
          readings: row.readings.map((reading, j) => j === readingIndex ? value : reading)
        } : row
      )
    }));
  };

  const filteredReports = reports.filter(r =>
    r.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.part_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const stepTitles = [
    { num: 1, title: "Basic Info", icon: FileText, desc: "Part details" },
    { num: 2, title: "Process Data", icon: Cog, desc: "Parameters" },
    { num: 3, title: "Inspection", icon: Gauge, desc: "Measurements" },
    { num: 4, title: "Approval", icon: Award, desc: "Review" }
  ];

  const stats = {
    total: reports.length,
    ok: reports.filter(r => r.overall_judgement === 'OK').length,
    ng: reports.filter(r => r.overall_judgement === 'NG').length,
    thisMonth: reports.filter(r => {
      const reportDate = new Date(r.created_at);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="max-full bg-gray-50">
      <div className=" mx-auto p-4">
        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Quality Inspection System</h1>
                  <p className="text-blue-100 text-xs">In-Process Inspection & Approval</p>
                </div>
              </div>
              {view === 'list' ? (
                <button
                  onClick={() => { resetForm(); setView('form'); }}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Report
                </button>
              ) : (
                <button
                  onClick={() => { resetForm(); setView('list'); }}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to list
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        {view === 'list' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow">
              <div className="flex items-center justify-between mb-1">
                <Activity className="w-5 h-5" />
                <TrendingUp className="w-4 h-4 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-xs">Total Reports</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow">
              <div className="flex items-center justify-between mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-semibold">{stats.total ? Math.round((stats.ok / stats.total) * 100) : 0}%</span>
              </div>
              <div className="text-2xl font-bold">{stats.ok}</div>
              <div className="text-green-100 text-xs">Approved (OK)</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-lg p-4 text-white shadow">
              <div className="flex items-center justify-between mb-1">
                <X className="w-5 h-5" />
                <span className="text-xs font-semibold">{stats.total ? Math.round((stats.ng / stats.total) * 100) : 0}%</span>
              </div>
              <div className="text-2xl font-bold">{stats.ng}</div>
              <div className="text-red-100 text-xs">Rejected (NG)</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg p-4 text-white shadow">
              <div className="flex items-center justify-between mb-1">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <div className="text-purple-100 text-xs">This Month</div>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            {/* Search & Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by part name, number, or customer..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Table className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} reports
                {filteredReports.length > itemsPerPage && <span className="ml-2">• Page {currentPage} of {totalPages}</span>}
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-3"></div>
                <p className="text-gray-600 text-sm">Loading reports...</p>
              </div>
            )}

            {!loading && filteredReports.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
                <ClipboardList className="w-16 h-16 text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  {searchTerm ? 'No matching reports' : 'No reports yet'}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {searchTerm ? 'Try different search terms' : 'Create your first inspection report'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => { resetForm(); setView('form'); }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Report
                  </button>
                )}
              </div>
            )}

            {/* CARD VIEW */}
            {!loading && currentReports.length > 0 && viewMode === 'card' && (
              <>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentReports.map((r: any) => (
                    <div
                      key={r.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-all border border-gray-200"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-t-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            <span className="font-bold text-lg">#{r.id}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            r.overall_judgement === 'OK' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
                          }`}>
                            {r.overall_judgement === 'OK' ? '✓ OK' : '✗ NG'}
                          </span>
                        </div>
                        <div className="font-semibold text-sm truncate">{r.part_name || 'Unnamed Part'}</div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="bg-blue-50 rounded p-2 border border-blue-100">
                          <div className="text-xs text-blue-600 font-semibold">Part Number</div>
                          <div className="text-sm font-medium text-gray-900 truncate">{r.part_number || '—'}</div>
                        </div>
                        <div className="bg-green-50 rounded p-2 border border-green-100">
                          <div className="text-xs text-green-600 font-semibold">Customer</div>
                          <div className="text-sm font-medium text-gray-900 truncate">{r.customer || '—'}</div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {r.created_at?.slice(0, 10) || '—'}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            {r.prepared_by || 'Unsigned'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-3 py-2 flex gap-2 rounded-b-lg">
                        <button
                          onClick={() => openViewModal(r.id)}
                          className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => downloadPDF(r.id)}
                          className="flex-1 bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-purple-700 flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </button>
                        {r.overall_judgement === 'OK' && (
                          <button
                            onClick={() => navigate4MChange(r.id, r)}
                            className="flex-1 bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-amber-700 flex items-center justify-center gap-1"
                            title="Create 4M Change Note"
                          >
                            <ArrowRight className="w-3 h-3" />
                            4M
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for cards */}
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center items-center gap-1">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                      let pageNumber: number;
                      if (totalPages <= 7) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 4) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 6 + index;
                      } else {
                        pageNumber = currentPage - 3 + index;
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => paginate(pageNumber)}
                          className={`w-8 h-8 rounded font-semibold text-sm ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* TABLE VIEW */}
            {!loading && currentReports.length > 0 && viewMode === 'table' && (
              <>
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold">Part Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold">Part No.</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold">Operation</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentReports.map((r: any, idx: number) => (
                          <tr key={r.id} className={`hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3">
                              <span className="font-bold text-gray-900">#{r.id}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">{r.part_name || '—'}</td>
                            <td className="px-4 py-3 text-gray-700">{r.part_number || '—'}</td>
                            <td className="px-4 py-3 text-gray-700">{r.customer || '—'}</td>
                            <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{r.operation_name || '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                r.overall_judgement === 'OK'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {r.overall_judgement === 'OK' ? '✓ OK' : '✗ NG'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{r.created_at?.slice(0, 10) || '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => openViewModal(r.id)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => downloadPDF(r.id)}
                                  className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700"
                                >
                                  PDF
                                </button>
                                {r.overall_judgement === 'OK' && (
                                  <button
                                    onClick={() => navigate4MChange(r.id, r)}
                                    className="bg-amber-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-amber-700"
                                    title="Create 4M Change Note"
                                  >
                                    4M
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

                {/* Pagination for table */}
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center items-center gap-1">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                      let pageNumber: number;
                      if (totalPages <= 7) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 4) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 6 + index;
                      } else {
                        pageNumber = currentPage - 3 + index;
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => paginate(pageNumber)}
                          className={`w-8 h-8 rounded font-semibold text-sm ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* FORM VIEW - Steps 1-4 remain the same as original */}
        {view === 'form' && (
          <>
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
              <div className="flex items-center justify-between">
                {stepTitles.map((step, idx) => (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <button
                        onClick={() => setFormStep(step.num as 1 | 2 | 3 | 4)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all ${
                          formStep === step.num
                            ? 'bg-blue-600 text-white shadow-lg scale-110'
                            : formStep > step.num
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {formStep > step.num ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </button>
                      <div className="mt-2 text-center">
                        <div className={`text-xs font-semibold ${
                          formStep === step.num ? 'text-blue-600' : formStep > step.num ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400">{step.desc}</div>
                      </div>
                    </div>
                    {idx < stepTitles.length - 1 && (
                      <div className={`h-1 flex-1 mx-4 rounded ${
                        formStep > step.num ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1: Basic Information */}
            {formStep === 1 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-bold">Step 1: Basic Information</h2>
                    <p className="text-blue-100 text-xs">Enter part and operation details</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Part Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.partName}
                        onChange={(e) => setField('partName', e.target.value)}
                        placeholder="Enter part name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Part Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.partNumber}
                        onChange={(e) => setField('partNumber', e.target.value)}
                        placeholder="Enter part number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Customer <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.customer}
                        onChange={(e) => setField('customer', e.target.value)}
                        placeholder="Enter customer name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Operation Name/Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.operationName}
                        onChange={(e) => setField('operationName', e.target.value)}
                        placeholder="Enter operation details"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setFormStep(2)}
                      disabled={!form.partName || !form.partNumber || !form.customer || !form.operationName}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Process Setting Data */}
            {formStep === 2 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-3 flex items-center gap-3">
                  <Cog className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-bold">Step 2: Process Setting Data</h2>
                    <p className="text-orange-100 text-xs">Record machine parameters</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-900 text-sm">About Process Data</h4>
                        <p className="text-orange-800 text-xs mt-1">
                          Record three stages: Initial Process Setting, After Machine Change, and LQA Verification.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {form.processRows.map((row, i) => (
                      <div key={`process-${i}`} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-orange-600 text-white rounded flex items-center justify-center text-xs">
                              {i + 1}
                            </span>
                            Parameter #{i + 1}
                          </h3>
                          {form.processRows.length > 1 && (
                            <button
                              onClick={() => removeProcessRow(i)}
                              className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">S.No</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                              value={row.sno}
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Parameter Name</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                              value={row.parameter}
                              onChange={(e) => updateProcessRow(i, 'parameter', e.target.value)}
                              placeholder="e.g., Temperature"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Specification</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                              value={row.specification}
                              onChange={(e) => updateProcessRow(i, 'specification', e.target.value)}
                              placeholder="e.g., 80-90°C"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Method</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                              value={row.method}
                              onChange={(e) => updateProcessRow(i, 'method', e.target.value)}
                              placeholder="e.g., Gauge"
                            />
                          </div>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-3">
                          {[
                            { title: '1. Process Setting', key: 'machineData' as const },
                            { title: '2. After M/C Change', key: 'firstChange' as const },
                            { title: '3. LQA Verification', key: 'secondChange' as const }
                          ].map(({ title, key }) => {
                            const block = row[key];
                            return (
                              <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-700 mb-2">{title}</h4>
                                <div className="space-y-2">
                                  <input
                                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    value={block.machineNo}
                                    onChange={(e) => updateProcessRow(i, key, { ...block, machineNo: e.target.value })}
                                    placeholder="Machine No."
                                  />
                                  <input
                                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    value={block.operator}
                                    onChange={(e) => updateProcessRow(i, key, { ...block, operator: e.target.value })}
                                    placeholder="Operator"
                                  />
                                  <input
                                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    value={`${block.date} ${block.time}`.trim()}
                                    onChange={(e) => {
                                      const parts = e.target.value.split(' ');
                                      const date = parts[0] || '';
                                      const time = parts.slice(1).join(' ') || '';
                                      updateProcessRow(i, key, { ...block, date, time });
                                    }}
                                    placeholder="YYYY-MM-DD HH:MM"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Action Taken</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                            rows={2}
                            value={row.action}
                            onChange={(e) => updateProcessRow(i, 'action', e.target.value)}
                            placeholder="Describe actions if any..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={addProcessRow}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Parameter
                    </button>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setFormStep(1)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setFormStep(3)}
                      className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: In-Process Inspection */}
            {formStep === 3 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 flex items-center gap-3">
                  <Gauge className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-bold">Step 3: In-Process Inspection</h2>
                    <p className="text-purple-100 text-xs">Record 10 measurements per parameter</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900 text-sm">Measurement Instructions</h4>
                        <p className="text-purple-800 text-xs mt-1">
                          Take 10 consecutive measurements for each parameter.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {form.inprocessRows.map((row, i) => (
                      <div key={`inprocess-${i}`} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
                              {i + 1}
                            </span>
                            Measurement #{i + 1}
                          </h3>
                          {form.inprocessRows.length > 1 && (
                            <button
                              onClick={() => removeInprocessRow(i)}
                              className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">S.No</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                              value={row.sno}
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Parameter Name</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
                              value={row.parameter}
                              onChange={(e) => updateInprocessRow(i, 'parameter', e.target.value)}
                              placeholder="e.g., Dimension"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Specification</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
                              value={row.specification}
                              onChange={(e) => updateInprocessRow(i, 'specification', e.target.value)}
                              placeholder="e.g., 10±0.5mm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Method</label>
                            <input
                              className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
                              value={row.method}
                              onChange={(e) => updateInprocessRow(i, 'method', e.target.value)}
                              placeholder="e.g., Caliper"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">10 Readings</label>
                          <div className="grid grid-cols-5 lg:grid-cols-10 gap-2">
                            {row.readings.map((reading, j) => (
                              <div key={j}>
                                <label className="block text-xs text-gray-500 mb-1 text-center">#{j + 1}</label>
                                <input
                                  className="w-full px-2 py-2 text-xs border border-purple-200 rounded focus:ring-2 focus:ring-purple-500 text-center"
                                  value={reading}
                                  onChange={(e) => updateReading(i, j, e.target.value)}
                                  placeholder="0.0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={addInprocessRow}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Measurement
                    </button>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setFormStep(2)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setFormStep(4)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Approval */}
            {formStep === 4 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 flex items-center gap-3">
                  <Award className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-bold">Step 4: Review & Approval</h2>
                    <p className="text-green-100 text-xs">Final judgement and signatures</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Part Details</div>
                      <div className="text-sm font-bold text-gray-900">{form.partName || 'Not set'}</div>
                      <div className="text-xs text-gray-600">{form.partNumber || 'No part number'}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="text-xs font-semibold text-orange-600 uppercase mb-1">Process Parameters</div>
                      <div className="text-2xl font-bold text-gray-900">{form.processRows.length}</div>
                      <div className="text-xs text-gray-600">Parameters recorded</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Measurements</div>
                      <div className="text-2xl font-bold text-gray-900">{form.inprocessRows.length}</div>
                      <div className="text-xs text-gray-600">Quality checks</div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
                    <h3 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Overall Judgement
                    </h3>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="radio"
                          name="judgement"
                          value="OK"
                          checked={form.overallJudgement === 'OK'}
                          onChange={(e) => setField('overallJudgement', e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-green-300 flex-1">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">OK - Approved</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="radio"
                          name="judgement"
                          value="NG"
                          checked={form.overallJudgement === 'NG'}
                          onChange={(e) => setField('overallJudgement', e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-red-300 flex-1">
                          <X className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-700">NG - Rejected</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                        <User className="w-4 h-4" />
                        Prepared By
                      </h4>
                      <input
                        type="text"
                        value={form.preparedBy}
                        onChange={(e) => setField('preparedBy', e.target.value)}
                        placeholder="Enter name"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="mt-2 text-xs text-blue-700">Technician / Operator</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2 text-sm">
                        <UserCheck className="w-4 h-4" />
                        Approved By
                      </h4>
                      <input
                        type="text"
                        value={form.approvedBy}
                        onChange={(e) => setField('approvedBy', e.target.value)}
                        placeholder="Enter name"
                        className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <div className="mt-2 text-xs text-green-700">Supervisor / Manager</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setFormStep(3)}
                      disabled={loading}
                      className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      {loading ? 'Saving...' : currentId ? 'Update Report' : 'Submit Report'}
                    </button>
                  </div>
                </div>
                {loading && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded-lg">
                    <div className="bg-white px-8 py-6 rounded-xl shadow-2xl flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mb-4"></div>
                      <p className="text-gray-700 font-medium">Saving report...</p>
                      <p className="text-gray-500 text-sm mt-1">Please wait</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* CONFIRMATION DIALOG */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  {confirmAction === 'update' ? (
                    <>
                      <Cog className="w-6 h-6" />
                      Update Report?
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Submit New Report?
                    </>
                  )}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {confirmAction === 'update'
                    ? 'You are about to **update** this existing inspection report.'
                    : 'You are about to **create** a new inspection report.'}
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      This action will {confirmAction === 'update' ? 'modify' : 'save'} the report permanently.
                      <br />
                      Make sure all data is correct before continuing.
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAndSave}
                    disabled={loading}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white shadow'
                    }`}
                  >
                    {loading && (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    )}
                    {loading ? 'Saving...' : 'Confirm & Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW DETAILS MODAL */}
        {showViewModal && viewedReport && (
          <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8 relative">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-5 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Inspection Report #{viewedReport.id}</h2>
                    <p className="text-blue-100 text-sm">
                      {viewedReport.part_name || 'Unnamed'} • {viewedReport.part_number || '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => downloadPDF(viewedReport.id)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                {/* Basic Info */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Part Name</div>
                      <div className="font-medium">{viewedReport.part_name || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Part Number</div>
                      <div className="font-medium">{viewedReport.part_number || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Customer</div>
                      <div className="font-medium">{viewedReport.customer || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Operation</div>
                      <div className="font-medium">{viewedReport.operation_name || '—'}</div>
                    </div>
                  </div>
                </div>
                {/* Judgement */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Overall Judgement
                  </h3>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-bold ${
                    viewedReport.overall_judgement === 'OK'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {viewedReport.overall_judgement === 'OK' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                    {viewedReport.overall_judgement}
                  </div>
                </div>
                {/* Process Parameters */}
                {viewedReport.process_parameters?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                      <Cog className="w-5 h-5 text-orange-600" />
                      Process Setting Data
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-orange-50">
                            <th className="p-3 text-left border-b">S.No</th>
                            <th className="p-3 text-left border-b">Parameter</th>
                            <th className="p-3 text-left border-b">Specification</th>
                            <th className="p-3 text-left border-b">Method</th>
                            <th className="p-3 text-left border-b">Process M/C</th>
                            <th className="p-3 text-left border-b">After Change M/C</th>
                            <th className="p-3 text-left border-b">LQA M/C</th>
                            <th className="p-3 text-left border-b">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewedReport.process_parameters.map((p: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50 border-b">
                              <td className="p-3">{p.sno || idx + 1}</td>
                              <td className="p-3">{p.parameter_name || '—'}</td>
                              <td className="p-3">{p.specification || '—'}</td>
                              <td className="p-3">{p.method || '—'}</td>
                              <td className="p-3">
                                {p.process_machine_no || '—'}<br/>
                                <span className="text-xs text-gray-500">{p.process_operator || '—'}</span>
                              </td>
                              <td className="p-3">
                                {p.change_machine_no || '—'}<br/>
                                <span className="text-xs text-gray-500">{p.change_operator || '—'}</span>
                              </td>
                              <td className="p-3">
                                {p.lqa_machine_no || '—'}<br/>
                                <span className="text-xs text-gray-500">{p.lqa_operator || '—'}</span>
                              </td>
                              <td className="p-3">{p.action || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {/* In-Process Measurements */}
                {viewedReport.inprocess_parameters?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                      <Gauge className="w-5 h-5 text-purple-600" />
                      In-Process Inspection Data
                    </h3>
                    {viewedReport.inprocess_parameters.map((param: any, idx: number) => (
                      <div key={idx} className="mb-6">
                        <div className="font-medium mb-2">
                          {param.parameter_name || '—'}
                          <span className="text-gray-500 text-sm ml-2">
                            ({param.specification || '—'})
                          </span>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                          {(param.readings || Array(10).fill('—')).map((val: string, i: number) => (
                            <div key={i} className="text-center">
                              <div className="text-xs text-gray-500">#{i + 1}</div>
                              <div className="font-mono bg-purple-50 border border-purple-100 rounded px-2 py-1 text-sm">
                                {val || '—'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Signatures */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    Approval & Signatures
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500">Prepared By</div>
                      <div className="font-medium text-lg">{viewedReport.prepared_by || '—'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Approved By</div>
                      <div className="font-medium text-lg">{viewedReport.approved_by || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openReport(viewedReport.id);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
                >
                  Edit this Report
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}