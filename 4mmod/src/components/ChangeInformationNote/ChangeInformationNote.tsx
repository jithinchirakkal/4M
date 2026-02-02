// import React, { useState } from 'react';
// import { Bell, FileText, Save, Sparkles } from 'lucide-react';
// import FormInput from './FormInput';
// import FormRadioGroup from './FormRadioGroup';
// import FormSection from './FormSection';

// interface PartA {
//   partName: string; model: string; partNo: string; customer: 'Inhouse' | 'External';
//   issueDate: string; originator: string; man: boolean; machine: boolean;
//   material: boolean; method: boolean; tool: boolean; others: string;
//   detailsOfChangingPoints: string; originatorSign: string;
// }
// interface PartB {
//   isSupplierRelated: boolean; childPartName: string; supplierName: string;
//   changeAcceptance: 'YES' | 'NO' | ''; customerIntimationRequired: 'YES' | 'NO' | '';
//   remarksIfAnyByQA: string; qaSignPartB: string;
// }
// interface Termination {
//   terminationDate: string; commentsIfAny: string; qaSignTermination: string;
// }
// interface ChangeNoteFormState {
//   id: number;
//   partA: PartA; partB: PartB; termination: Termination;
// }
// type ActiveFormState = Omit<ChangeNoteFormState, 'id'>;

// const initialFormState: ActiveFormState = {
//   partA: {
//     partName: 'BUMPER ASSY, FR', model: 'MS-A2024', partNo: '71711M64R00',
//     customer: 'Inhouse', issueDate: new Date().toISOString().split('T')[0],
//     originator: 'Rajesh Sharma', man: true, machine: false, material: true,
//     method: false, tool: false, others: 'N/A',
//     detailsOfChangingPoints: 'Switching from Grade X to Grade Y Polymer due to supply chain disruption.',
//     originatorSign: 'R.Sharma',
//   },
//   partB: {
//     isSupplierRelated: true, childPartName: 'Injection Moulded Clip', supplierName: 'Reliable Plastics Pvt. Ltd.',
//     changeAcceptance: '', customerIntimationRequired: '',
//     remarksIfAnyByQA: 'Initial review suggests acceptable change. Full PPAP sample required.',
//     qaSignPartB: '',
//   },
//   termination: {
//     terminationDate: '', commentsIfAny: '', qaSignTermination: '',
//   },
// };

// const mockSubmittedData: ChangeNoteFormState[] = [
//   {
//     id: 1,
//     partA: { ...initialFormState.partA, partName: 'HEADLAMP ASSY, LH', originator: 'S. Kumar' },
//     partB: { ...initialFormState.partB, changeAcceptance: 'YES', qaSignPartB: 'QA-SK' },
//     termination: { terminationDate: '2025-10-15', commentsIfAny: 'Completed successfully.', qaSignTermination: 'QA-SK' },
//   },
//   {
//     id: 2,
//     partA: { ...initialFormState.partA, partName: 'REAR AXLE BEAM', material: false, machine: true, originator: 'A. Patel' },
//     partB: { ...initialFormState.partB, changeAcceptance: 'NO', remarksIfAnyByQA: 'Failure in fatigue test. Reject.', qaSignPartB: 'QA-AP' },
//     termination: { terminationDate: '', commentsIfAny: '', qaSignTermination: '' },
//   },
// ];

// const ChangeInformationNote: React.FC = () => {
//   const [formData, setFormData] = useState<ActiveFormState>({...initialFormState});
//   const [submittedNotes, setSubmittedNotes] = useState<ChangeNoteFormState[]>(mockSubmittedData);

//   const handleInputChange = (section: keyof ActiveFormState, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [name]: value,
//       },
//     }));
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       partA: {
//         ...prev.partA,
//         [name]: checked,
//       } as PartA,
//     }));
//   };

//   const handleRadioChange = (name: keyof PartB, value: 'YES' | 'NO') => {
//     setFormData((prev) => ({
//       ...prev,
//       partB: {
//         ...prev.partB,
//         [name]: value,
//       },
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.partB.changeAcceptance === '') {
//       alert('Please confirm Change Acceptance (YES/NO) before submitting the note.');
//       return;
//     }

//     const nextId = submittedNotes.length > 0 ? Math.max(...submittedNotes.map(n => n.id)) + 1 : 1;

//     const newNote: ChangeNoteFormState = {
//         id: nextId,
//         ...formData
//     };

//     setSubmittedNotes((prev) => [newNote, ...prev]);
//     setFormData({...initialFormState});

//     console.log('New Note Submitted:', newNote);
//     alert(`Note ${newNote.id} submitted successfully! The form has been reset.`);
//   };

//   return (
//     // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 p-6">
//     <div className="min-h-screen p-6">
//       <header className="text-center mb-8 relative">
//         {/* <div className="inline-flex items-center justify-center gap-3 mb-4">
//           <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
//             <Bell className="text-white" size={28} />
//           </div>
//         </div> */}
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent tracking-tight mb-2">
//           4M Change Information Note
//         </h1>
//         {/* <p className="text-lg text-slate-600 font-medium mt-2 max-w-3xl mx-auto">
//           Record 4M change details in record sheet as per 4M change work instructions.
//         </p> */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl -z-10" />
//       </header>

//       <form onSubmit={handleSubmit} className="max-w-full mx-auto space-y-8">

//         <FormSection title="PART - A: CHANGE INITIATION">
//           <FormInput label="PART NAME" name="partName" value={formData.partA.partName} onChange={(e) => handleInputChange('partA', e)} />
//           <FormInput label="MODEL" name="model" value={formData.partA.model} onChange={(e) => handleInputChange('partA', e)} />
//           <FormInput label="PART NO" name="partNo" value={formData.partA.partNo} onChange={(e) => handleInputChange('partA', e)} />
//           <div className="flex flex-col p-3 border border-slate-300/60 bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm rounded-lg shadow-sm">
//             <label className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">CUSTOMER</label>
//             <p className="text-sm font-bold pt-1 text-emerald-700">{formData.partA.customer}</p>
//           </div>

//           <FormInput label="ISSUE DATE" name="issueDate" type="date" value={formData.partA.issueDate} onChange={(e) => handleInputChange('partA', e)} />
//           <FormInput label="ORIGINATOR" name="originator" value={formData.partA.originator} onChange={(e) => handleInputChange('partA', e)} />

//           <div className="col-span-4 p-4 border border-slate-300/60 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm rounded-lg shadow-sm">
//             <label className="text-xs font-bold text-slate-700 mb-3 uppercase block tracking-wide">CHANGING POINT (Select all that apply)</label>
//             <div className="flex flex-wrap gap-x-8 gap-y-3 mt-2">
//               {['MAN', 'MACHINE', 'MATERIAL', 'METHOD', 'TOOL'].map((key) => (
//                 <label key={key} className="flex items-center space-x-2 group cursor-pointer">
//                   <input
//                     type="checkbox" name={key.toLowerCase()}
//                     checked={formData.partA[key.toLowerCase() as keyof PartA] as boolean}
//                     onChange={handleCheckboxChange}
//                     className="form-checkbox h-6 w-6 text-cyan-600 rounded border-2 border-slate-400 transition-all duration-200 cursor-pointer"
//                   />
//                   <span className="font-semibold text-slate-700 group-hover:text-cyan-600 transition-colors duration-200">{key}</span>
//                 </label>
//               ))}
//               <div className="flex-1 min-w-[200px]">
//                 <FormInput label="OTHERS" name="others" value={formData.partA.others} onChange={(e) => handleInputChange('partA', e)} colSpan="col-span-1" />
//               </div>
//             </div>
//           </div>

//           <FormInput label="DETAILS OF CHANGING POINTS (Detailed Description)" name="detailsOfChangingPoints" value={formData.partA.detailsOfChangingPoints} onChange={(e) => handleInputChange('partA', e)} isTextArea colSpan="col-span-4" />

//           <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
//             <FormInput label="ORIGINATOR SIGN" name="originatorSign" value={formData.partA.originatorSign} onChange={(e) => handleInputChange('partA', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
//           </div>
//         </FormSection>

//         <FormSection title="PART - B: QUALITY FEEDBACK & APPROVAL">

//           <div className="col-span-4 p-4 border border-slate-300/60 bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm rounded-lg shadow-sm flex items-center space-x-4">
//             <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">IS SUPPLIER RELATED CHANGE?</label>
//             <input
//               type="checkbox" checked={formData.partB.isSupplierRelated}
//               onChange={() => setFormData(prev => ({ ...prev, partB: { ...prev.partB, isSupplierRelated: !prev.partB.isSupplierRelated } }))}
//               className="form-checkbox h-6 w-6 text-red-600 rounded border-2 border-slate-400 cursor-pointer"
//             />
//           </div>

//           {formData.partB.isSupplierRelated && (
//             <>
//               <FormInput label="CHILD PART NAME" name="childPartName" value={formData.partB.childPartName} onChange={(e) => handleInputChange('partB', e)} />
//               <FormInput label="SUPPLIER NAME" name="supplierName" value={formData.partB.supplierName} onChange={(e) => handleInputChange('partB', e)} />
//               <div className="col-span-2" />
//             </>
//           )}

//           <FormRadioGroup
//             label="CHANGE ACCEPTANCE" name="changeAcceptance"
//             value={formData.partB.changeAcceptance}
//             onChange={(val) => handleRadioChange('changeAcceptance', val)}
//           />
//           <FormRadioGroup
//             label="CUSTOMER INTIMATION REQUIRED (IF CHANGE ACCEPT)" name="customerIntimationRequired"
//             value={formData.partB.customerIntimationRequired}
//             onChange={(val) => handleRadioChange('customerIntimationRequired', val)}
//           />

//           <FormInput label="REMARKS IF ANY BY QA:" name="remarksIfAnyByQA" value={formData.partB.remarksIfAnyByQA} onChange={(e) => handleInputChange('partB', e)} isTextArea colSpan="col-span-4" />

//           <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
//             <FormInput label="QA SIGN (APPROVAL)" name="qaSignPartB" value={formData.partB.qaSignPartB} onChange={(e) => handleInputChange('partB', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
//           </div>

//         </FormSection>

//         <FormSection title="CHANGE TERMINATION (Implemented & Confirmed)">
//           <FormInput label="TERMINATION DATE" name="terminationDate" type="date" value={formData.termination.terminationDate} onChange={(e) => handleInputChange('termination', e)} />
//           <FormInput label="COMMENTS IF ANY" name="commentsIfAny" value={formData.termination.commentsIfAny} onChange={(e) => handleInputChange('termination', e)} isTextArea colSpan="col-span-3" />

//           <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
//             <FormInput label="QA SIGN (TERMINATION)" name="qaSignTermination" value={formData.termination.qaSignTermination} onChange={(e) => handleInputChange('termination', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
//           </div>
//         </FormSection>

//         <div className="flex justify-center pb-10">
//           <button
//             type="submit"
//             className="group relative bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 hover:from-emerald-600 hover:via-green-700 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
//             disabled={formData.partB.changeAcceptance === ''}
//           >
//             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             <span className="relative flex items-center gap-3">
//               <Save size={20} />
//               Submit Note & Request Quality Approval
//               <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
//             </span>
//           </button>
//         </div>
//       </form>

//       <div className="max-w-full mx-auto mt-12 pt-8 border-t-2 border-slate-300">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
//             <FileText className="text-white" size={20} />
//           </div>
//           <h2 className="text-3xl font-extrabold text-slate-800">
//             Submitted 4M Change Notes ({submittedNotes.length})
//           </h2>
//         </div>

//         {submittedNotes.length === 0 ? (
//           <p className="text-slate-500 italic p-6 bg-white rounded-2xl shadow-md border border-slate-200">No notes submitted yet. Fill out the form above and submit!</p>
//         ) : (
//           <div className="space-y-4">
//             {submittedNotes.map((note) => (
//               <div
//                 key={note.id}
//                 className={`p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
//                   ${note.partB.changeAcceptance === 'YES' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500' :
//                    note.partB.changeAcceptance === 'NO' ? 'bg-gradient-to-r from-rose-50 to-red-50 border-l-4 border-rose-500' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500'}`
//                 }
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <span className="text-lg font-bold text-slate-800">Note ID: {note.id}</span>
//                   <span className={`px-4 py-1.5 text-sm font-bold rounded-full shadow-md
//                     ${note.partB.changeAcceptance === 'YES' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' :
//                       note.partB.changeAcceptance === 'NO' ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'}`
//                   }>
//                     QA STATUS: {note.partB.changeAcceptance || 'PENDING'}
//                   </span>
//                 </div>
//                 <p className="text-sm mb-2">
//                   <span className="font-bold text-slate-700">Part:</span> {note.partA.partName} ({note.partA.partNo})
//                   <span className="ml-4 font-bold text-slate-700">Originator:</span> {note.partA.originator}
//                 </p>
//                 <p className="text-sm text-slate-600 truncate bg-white/50 p-2 rounded-lg">
//                   <span className="font-bold">Details:</span> {note.partA.detailsOfChangingPoints}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChangeInformationNote;



// import React, { useState, useEffect } from 'react';
// import { Bell, FileText, Save, Sparkles, Link as LinkIcon, CheckCircle } from 'lucide-react';
// import FormInput from './FormInput';
// import FormRadioGroup from './FormRadioGroup';
// import FormSection from './FormSection';

// interface PartA {
//   partName: string; model: string; partNo: string; customer: 'Inhouse' | 'External';
//   issueDate: string; originator: string; man: boolean; machine: boolean;
//   material: boolean; method: boolean; tool: boolean; others: string;
//   detailsOfChangingPoints: string; originatorSign: string;
// }
// interface PartB {
//   isSupplierRelated: boolean; childPartName: string; supplierName: string;
//   changeAcceptance: 'YES' | 'NO' | ''; customerIntimationRequired: 'YES' | 'NO' | '';
//   remarksIfAnyByQA: string; qaSignPartB: string;
// }
// interface Termination {
//   terminationDate: string; commentsIfAny: string; qaSignTermination: string;
// }
// interface ChangeNoteFormState {
//   id: number;
//   inspectionReportId?: number; // Link to inspection report
//   partA: PartA; partB: PartB; termination: Termination;
// }
// type ActiveFormState = Omit<ChangeNoteFormState, 'id'>;

// const initialFormState: ActiveFormState = {
//   inspectionReportId: undefined,
//   partA: {
//     partName: '', model: '', partNo: '',
//     customer: 'Inhouse', issueDate: new Date().toISOString().split('T')[0],
//     originator: '', man: false, machine: false, material: false,
//     method: false, tool: false, others: '',
//     detailsOfChangingPoints: '',
//     originatorSign: '',
//   },
//   partB: {
//     isSupplierRelated: false, childPartName: '', supplierName: '',
//     changeAcceptance: '', customerIntimationRequired: '',
//     remarksIfAnyByQA: '',
//     qaSignPartB: '',
//   },
//   termination: {
//     terminationDate: '', commentsIfAny: '', qaSignTermination: '',
//   },
// };

// const mockSubmittedData: ChangeNoteFormState[] = [
//   {
//     id: 1,
//     inspectionReportId: 101,
//     partA: { 
//       partName: 'HEADLAMP ASSY, LH', 
//       model: 'MS-A2024',
//       partNo: '71711M64R01',
//       customer: 'Inhouse',
//       issueDate: '2025-01-15',
//       originator: 'S. Kumar',
//       man: true,
//       machine: false,
//       material: true,
//       method: false,
//       tool: false,
//       others: 'N/A',
//       detailsOfChangingPoints: 'Switching to new LED supplier due to better quality.',
//       originatorSign: 'S.Kumar'
//     },
//     partB: { 
//       isSupplierRelated: true,
//       childPartName: 'LED Module',
//       supplierName: 'Bright Electronics Ltd.',
//       changeAcceptance: 'YES',
//       customerIntimationRequired: 'YES',
//       remarksIfAnyByQA: 'Change approved after successful PPAP.',
//       qaSignPartB: 'QA-SK'
//     },
//     termination: { terminationDate: '2025-10-15', commentsIfAny: 'Completed successfully.', qaSignTermination: 'QA-SK' },
//   },
// ];

// const ChangeInformationNote: React.FC = () => {
//   const [formData, setFormData] = useState<ActiveFormState>({...initialFormState});
//   const [submittedNotes, setSubmittedNotes] = useState<ChangeNoteFormState[]>(mockSubmittedData);
//   const [showPrefillNotice, setShowPrefillNotice] = useState(false);
//   const [prefillSource, setPrefillSource] = useState<any>(null);

//   useEffect(() => {
//     // Check for prefilled data from inspection report
//     const prefillData = localStorage.getItem('change_note_prefill');
//     if (prefillData) {
//       try {
//         const data = JSON.parse(prefillData);
//         setPrefillSource(data);
//         setFormData(prev => ({
//           ...prev,
//           inspectionReportId: data.reportId,
//           partA: {
//             ...prev.partA,
//             partName: data.partName || prev.partA.partName,
//             partNo: data.partNumber || prev.partA.partNo,
//             customer: (data.customer === 'Inhouse' || data.customer === 'External') ? data.customer : 'Inhouse',
//             model: data.operationName || prev.partA.model,
//           }
//         }));
//         setShowPrefillNotice(true);
//         localStorage.removeItem('change_note_prefill');
        
//         // Auto-hide the notice after 10 seconds
//         setTimeout(() => {
//           setShowPrefillNotice(false);
//         }, 10000);
//       } catch (error) {
//         console.error('Failed to load prefill data:', error);
//       }
//     }
//   }, []);

//   // const handleInputChange = (section: keyof ActiveFormState, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//   //   const { name, value } = e.target;
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [section]: {
//   //       ...prev[section],
//   //       [name]: value,
//   //     },
//   //   }));
//   // };
// const handleInputChange = <
//   T extends keyof ActiveFormState
// >(
//   section: T,
//   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
// ) => {
//   const { name, value } = e.target;

//   setFormData(prev => ({
//     ...prev,
//     [section]: {
//       ...(prev[section] as Record<string, any>),
//       [name]: value,
//     },
//   }));
// };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       partA: {
//         ...prev.partA,
//         [name]: checked,
//       } as PartA,
//     }));
//   };

//   const handleRadioChange = (name: keyof PartB, value: 'YES' | 'NO') => {
//     setFormData((prev) => ({
//       ...prev,
//       partB: {
//         ...prev.partB,
//         [name]: value,
//       },
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.partB.changeAcceptance === '') {
//       alert('Please confirm Change Acceptance (YES/NO) before submitting the note.');
//       return;
//     }

//     const nextId = submittedNotes.length > 0 ? Math.max(...submittedNotes.map(n => n.id)) + 1 : 1;

//     const newNote: ChangeNoteFormState = {
//         id: nextId,
//         ...formData
//     };

//     setSubmittedNotes((prev) => [newNote, ...prev]);
//     setFormData({...initialFormState});
//     setShowPrefillNotice(false);
//     setPrefillSource(null);

//     console.log('New Note Submitted:', newNote);
//     alert(`Note ${newNote.id} submitted successfully! The form has been reset.`);
//   };

//   return (
//     <div className="min-h-screen p-6">
//       <header className="text-center mb-8 relative">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent tracking-tight mb-2">
//           4M Change Information Note
//         </h1>
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl -z-10" />
//       </header>

//       {/* Prefill Notice Banner */}
//       {showPrefillNotice && prefillSource && (
//         <div className="max-w-full mx-auto mb-6">
//           <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 shadow-lg">
//             <div className="flex items-start gap-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
//                 <LinkIcon className="text-white" size={24} />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CheckCircle className="text-green-600" size={20} />
//                   <h3 className="text-lg font-bold text-gray-800">
//                     Data Pre-filled from Inspection Report
//                   </h3>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-3 text-sm">
//                   <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
//                     <span className="font-semibold text-gray-600">Inspection Report ID:</span>
//                     <span className="ml-2 font-bold text-blue-700">#{prefillSource.reportId}</span>
//                   </div>
//                   <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
//                     <span className="font-semibold text-gray-600">Part Name:</span>
//                     <span className="ml-2 font-bold text-gray-800">{prefillSource.partName}</span>
//                   </div>
//                   <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
//                     <span className="font-semibold text-gray-600">Part Number:</span>
//                     <span className="ml-2 font-bold text-gray-800">{prefillSource.partNumber}</span>
//                   </div>
//                   <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
//                     <span className="font-semibold text-gray-600">Customer:</span>
//                     <span className="ml-2 font-bold text-gray-800">{prefillSource.customer}</span>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-600 mt-3 italic">
//                   ✓ Basic information has been automatically filled. Please review and complete the remaining fields.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowPrefillNotice(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="max-w-full mx-auto space-y-8">

//         <FormSection title="PART - A: CHANGE INITIATION">
//           {/* Show linked inspection report if available */}
//           {formData.inspectionReportId && (
//             <div className="col-span-4 p-4 mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <LinkIcon className="text-blue-600" size={20} />
//                 <div>
//                   <span className="font-semibold text-gray-700">Linked to Inspection Report:</span>
//                   <span className="ml-2 font-bold text-blue-600">#{formData.inspectionReportId}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <FormInput label="PART NAME" name="partName" value={formData.partA.partName} onChange={(e) => handleInputChange('partA', e)} />
//           <FormInput label="MODEL" name="model" value={formData.partA.model} onChange={(e) => handleInputChange('partA', e)} />
//           <FormInput label="PART NO" name="partNo" value={formData.partA.partNo} onChange={(e) => handleInputChange('partA', e)} />
//           <div className="flex flex-col p-3 border border-slate-300/60 bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm rounded-lg shadow-sm">
//             <label className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">CUSTOMER</label>
//             <p className="text-sm font-bold pt-1 text-emerald-700">{formData.partA.customer}</p>
//           </div>

//           <FormInput label="ISSUE DATE" name="issueDate" type="date" value={formData.partA.issueDate} onChange={(e) => handleInputChange('partA', e)} />
//           <FormInput label="ORIGINATOR" name="originator" value={formData.partA.originator} onChange={(e) => handleInputChange('partA', e)} />

//           <div className="col-span-4 p-4 border border-slate-300/60 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm rounded-lg shadow-sm">
//             <label className="text-xs font-bold text-slate-700 mb-3 uppercase block tracking-wide">CHANGING POINT (Select all that apply)</label>
//             <div className="flex flex-wrap gap-x-8 gap-y-3 mt-2">
//               {['MAN', 'MACHINE', 'MATERIAL', 'METHOD', 'TOOL'].map((key) => (
//                 <label key={key} className="flex items-center space-x-2 group cursor-pointer">
//                   <input
//                     type="checkbox" name={key.toLowerCase()}
//                     checked={formData.partA[key.toLowerCase() as keyof PartA] as boolean}
//                     onChange={handleCheckboxChange}
//                     className="form-checkbox h-6 w-6 text-cyan-600 rounded border-2 border-slate-400 transition-all duration-200 cursor-pointer"
//                   />
//                   <span className="font-semibold text-slate-700 group-hover:text-cyan-600 transition-colors duration-200">{key}</span>
//                 </label>
//               ))}
//               <div className="flex-1 min-w-[200px]">
//                 <FormInput label="OTHERS" name="others" value={formData.partA.others} onChange={(e) => handleInputChange('partA', e)} colSpan="col-span-1" />
//               </div>
//             </div>
//           </div>

//           <FormInput label="DETAILS OF CHANGING POINTS (Detailed Description)" name="detailsOfChangingPoints" value={formData.partA.detailsOfChangingPoints} onChange={(e) => handleInputChange('partA', e)} isTextArea colSpan="col-span-4" />

//           <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
//             <FormInput label="ORIGINATOR SIGN" name="originatorSign" value={formData.partA.originatorSign} onChange={(e) => handleInputChange('partA', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
//           </div>
//         </FormSection>

//         <FormSection title="PART - B: QUALITY FEEDBACK & APPROVAL">

//           <div className="col-span-4 p-4 border border-slate-300/60 bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm rounded-lg shadow-sm flex items-center space-x-4">
//             <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">IS SUPPLIER RELATED CHANGE?</label>
//             <input
//               type="checkbox" checked={formData.partB.isSupplierRelated}
//               onChange={() => setFormData(prev => ({ ...prev, partB: { ...prev.partB, isSupplierRelated: !prev.partB.isSupplierRelated } }))}
//               className="form-checkbox h-6 w-6 text-red-600 rounded border-2 border-slate-400 cursor-pointer"
//             />
//           </div>

//           {formData.partB.isSupplierRelated && (
//             <>
//               <FormInput label="CHILD PART NAME" name="childPartName" value={formData.partB.childPartName} onChange={(e) => handleInputChange('partB', e)} />
//               <FormInput label="SUPPLIER NAME" name="supplierName" value={formData.partB.supplierName} onChange={(e) => handleInputChange('partB', e)} />
//               <div className="col-span-2" />
//             </>
//           )}

//           <FormRadioGroup
//             label="CHANGE ACCEPTANCE" name="changeAcceptance"
//             value={formData.partB.changeAcceptance}
//             onChange={(val) => handleRadioChange('changeAcceptance', val)}
//           />
//           <FormRadioGroup
//             label="CUSTOMER INTIMATION REQUIRED (IF CHANGE ACCEPT)" name="customerIntimationRequired"
//             value={formData.partB.customerIntimationRequired}
//             onChange={(val) => handleRadioChange('customerIntimationRequired', val)}
//           />

//           <FormInput label="REMARKS IF ANY BY QA:" name="remarksIfAnyByQA" value={formData.partB.remarksIfAnyByQA} onChange={(e) => handleInputChange('partB', e)} isTextArea colSpan="col-span-4" />

//           <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
//             <FormInput label="QA SIGN (APPROVAL)" name="qaSignPartB" value={formData.partB.qaSignPartB} onChange={(e) => handleInputChange('partB', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
//           </div>

//         </FormSection>

//         <FormSection title="CHANGE TERMINATION (Implemented & Confirmed)">
//           <FormInput label="TERMINATION DATE" name="terminationDate" type="date" value={formData.termination.terminationDate} onChange={(e) => handleInputChange('termination', e)} />
//           <FormInput label="COMMENTS IF ANY" name="commentsIfAny" value={formData.termination.commentsIfAny} onChange={(e) => handleInputChange('termination', e)} isTextArea colSpan="col-span-3" />

//           <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
//             <FormInput label="QA SIGN (TERMINATION)" name="qaSignTermination" value={formData.termination.qaSignTermination} onChange={(e) => handleInputChange('termination', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
//           </div>
//         </FormSection>

//         <div className="flex justify-center pb-10">
//           <button
//             type="submit"
//             className="group relative bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 hover:from-emerald-600 hover:via-green-700 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
//             disabled={formData.partB.changeAcceptance === ''}
//           >
//             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             <span className="relative flex items-center gap-3">
//               <Save size={20} />
//               Submit Note & Request Quality Approval
//               <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
//             </span>
//           </button>
//         </div>
//       </form>

//       <div className="max-w-full mx-auto mt-12 pt-8 border-t-2 border-slate-300">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
//             <FileText className="text-white" size={20} />
//           </div>
//           <h2 className="text-3xl font-extrabold text-slate-800">
//             Submitted 4M Change Notes ({submittedNotes.length})
//           </h2>
//         </div>

//         {submittedNotes.length === 0 ? (
//           <p className="text-slate-500 italic p-6 bg-white rounded-2xl shadow-md border border-slate-200">No notes submitted yet. Fill out the form above and submit!</p>
//         ) : (
//           <div className="space-y-4">
//             {submittedNotes.map((note) => (
//               <div
//                 key={note.id}
//                 className={`p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
//                   ${note.partB.changeAcceptance === 'YES' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500' :
//                    note.partB.changeAcceptance === 'NO' ? 'bg-gradient-to-r from-rose-50 to-red-50 border-l-4 border-rose-500' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500'}`
//                 }
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-3">
//                     <span className="text-lg font-bold text-slate-800">Note ID: {note.id}</span>
//                     {note.inspectionReportId && (
//                       <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
//                         <LinkIcon size={12} />
//                         Report #{note.inspectionReportId}
//                       </span>
//                     )}
//                   </div>
//                   <span className={`px-4 py-1.5 text-sm font-bold rounded-full shadow-md
//                     ${note.partB.changeAcceptance === 'YES' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' :
//                       note.partB.changeAcceptance === 'NO' ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'}`
//                   }>
//                     QA STATUS: {note.partB.changeAcceptance || 'PENDING'}
//                   </span>
//                 </div>
//                 <p className="text-sm mb-2">
//                   <span className="font-bold text-slate-700">Part:</span> {note.partA.partName} ({note.partA.partNo})
//                   <span className="ml-4 font-bold text-slate-700">Originator:</span> {note.partA.originator}
//                 </p>
//                 <p className="text-sm text-slate-600 truncate bg-white/50 p-2 rounded-lg">
//                   <span className="font-bold">Details:</span> {note.partA.detailsOfChangingPoints}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChangeInformationNote;



import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, FileText, Save, Sparkles, Link as LinkIcon, CheckCircle, 
  Plus, Eye, Edit2, Trash2, Search, Filter, Table, LayoutGrid,
  ChevronLeft, ChevronRight, Calendar, User, Package, AlertCircle,
  X, Check, Clock, ArrowUpDown, Download, Upload, RefreshCw,
  Settings, HelpCircle, ChevronDown, ChevronUp, Layers
} from 'lucide-react';

// ==================== TYPES ====================
interface PartA {
  partName: string;
  model: string;
  partNo: string;
  customer: 'Inhouse' | 'External';
  issueDate: string;
  originator: string;
  man: boolean;
  machine: boolean;
  material: boolean;
  method: boolean;
  tool: boolean;
  others: string;
  detailsOfChangingPoints: string;
  originatorSign: string;
}

interface PartB {
  isSupplierRelated: boolean;
  childPartName: string;
  supplierName: string;
  changeAcceptance: 'YES' | 'NO' | '';
  customerIntimationRequired: 'YES' | 'NO' | '';
  remarksIfAnyByQA: string;
  qaSignPartB: string;
}

interface Termination {
  terminationDate: string;
  commentsIfAny: string;
  qaSignTermination: string;
}

interface ChangeNoteFormState {
  id: number;
  inspectionReportId?: number;
  createdAt: string;
  updatedAt: string;
  partA: PartA;
  partB: PartB;
  termination: Termination;
}

type ActiveFormState = Omit<ChangeNoteFormState, 'id' | 'createdAt' | 'updatedAt'>;
type ViewMode = 'list' | 'form';
type ListViewType = 'card' | 'table';
type SortField = 'id' | 'partName' | 'issueDate' | 'status';
type SortDirection = 'asc' | 'desc';

// ==================== FORM INPUT COMPONENT ====================
interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  isTextArea?: boolean;
  colSpan?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  isTextArea = false,
  colSpan = 'col-span-1',
  required = false,
  placeholder = '',
  rows = 3,
  disabled = false,
}) => {
  const baseInputStyles = `
    w-full px-4 py-3 
    bg-white border-2 border-slate-200 
    rounded-xl 
    text-slate-800 font-medium
    placeholder:text-slate-400 placeholder:font-normal
    focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
    hover:border-slate-300
    transition-all duration-200
    disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
  `;

  return (
    <div className={`${colSpan}`}>
      <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${baseInputStyles} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={baseInputStyles}
        />
      )}
    </div>
  );
};

// ==================== FORM RADIO GROUP COMPONENT ====================
interface FormRadioGroupProps {
  label: string;
  name: string;
  value: 'YES' | 'NO' | '';
  onChange: (value: 'YES' | 'NO') => void;
  required?: boolean;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="col-span-2 p-5 border border-slate-200 bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-sm">
      <label className="text-xs font-bold text-slate-600 mb-4 uppercase block tracking-wide">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          onClick={() => onChange('YES')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 border-2
            ${value === 'YES'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400 shadow-lg shadow-emerald-200 scale-[1.02]'
              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
        >
          <Check size={18} className={value === 'YES' ? 'text-white' : 'text-emerald-500'} />
          YES
        </button>
        <button
          type="button"
          onClick={() => onChange('NO')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 border-2
            ${value === 'NO'
              ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400 shadow-lg shadow-rose-200 scale-[1.02]'
              : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:bg-rose-50'
            }`}
        >
          <X size={18} className={value === 'NO' ? 'text-white' : 'text-rose-500'} />
          NO
        </button>
      </div>
    </div>
  );
};

// ==================== FORM SECTION COMPONENT ====================
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  subtitle?: string;
}

const getGradientClasses = (from: string, to: string) => {
  const gradients: Record<string, string> = {
    'blue-cyan': 'from-blue-600 to-cyan-600',
    'violet-purple': 'from-violet-600 to-purple-600',
    'emerald-green': 'from-emerald-600 to-green-600',
    'amber-orange': 'from-amber-500 to-orange-500',
    'rose-red': 'from-rose-500 to-red-500',
  };
  return gradients[`${from}-${to}`] || 'from-blue-600 to-cyan-600';
};

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  icon,
  gradientFrom = 'blue',
  gradientTo = 'cyan',
  subtitle,
}) => {
  const gradientClass = getGradientClasses(gradientFrom, gradientTo);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradientClass} px-6 py-4`}>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
            {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
};

// ==================== CONSTANTS ====================
const STORAGE_KEY = 'change_notes_data';
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const initialFormState: ActiveFormState = {
  inspectionReportId: undefined,
  partA: {
    partName: '',
    model: '',
    partNo: '',
    customer: 'Inhouse',
    issueDate: new Date().toISOString().split('T')[0],
    originator: '',
    man: false,
    machine: false,
    material: false,
    method: false,
    tool: false,
    others: '',
    detailsOfChangingPoints: '',
    originatorSign: '',
  },
  partB: {
    isSupplierRelated: false,
    childPartName: '',
    supplierName: '',
    changeAcceptance: '',
    customerIntimationRequired: '',
    remarksIfAnyByQA: '',
    qaSignPartB: '',
  },
  termination: {
    terminationDate: '',
    commentsIfAny: '',
    qaSignTermination: '',
  },
};

const mockInitialData: ChangeNoteFormState[] = [
  {
    id: 1,
    inspectionReportId: 101,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T14:20:00Z',
    partA: {
      partName: 'HEADLAMP ASSY, LH',
      model: 'MS-A2024',
      partNo: '71711M64R01',
      customer: 'Inhouse',
      issueDate: '2025-01-15',
      originator: 'S. Kumar',
      man: true,
      machine: false,
      material: true,
      method: false,
      tool: false,
      others: 'N/A',
      detailsOfChangingPoints: 'Switching to new LED supplier due to better quality and improved thermal management.',
      originatorSign: 'S.Kumar'
    },
    partB: {
      isSupplierRelated: true,
      childPartName: 'LED Module',
      supplierName: 'Bright Electronics Ltd.',
      changeAcceptance: 'YES',
      customerIntimationRequired: 'YES',
      remarksIfAnyByQA: 'Change approved after successful PPAP.',
      qaSignPartB: 'QA-SK'
    },
    termination: {
      terminationDate: '2025-10-15',
      commentsIfAny: 'Completed successfully.',
      qaSignTermination: 'QA-SK'
    },
  },
  {
    id: 2,
    inspectionReportId: 102,
    createdAt: '2025-01-18T09:15:00Z',
    updatedAt: '2025-01-18T11:45:00Z',
    partA: {
      partName: 'TAIL LAMP ASSY, RH',
      model: 'MS-B2024',
      partNo: '71712M65R02',
      customer: 'External',
      issueDate: '2025-01-18',
      originator: 'R. Sharma',
      man: false,
      machine: true,
      material: false,
      method: true,
      tool: false,
      others: '',
      detailsOfChangingPoints: 'Updated assembly process to reduce cycle time by 15%.',
      originatorSign: 'R.Sharma'
    },
    partB: {
      isSupplierRelated: false,
      childPartName: '',
      supplierName: '',
      changeAcceptance: 'YES',
      customerIntimationRequired: 'NO',
      remarksIfAnyByQA: 'Process improvement validated.',
      qaSignPartB: 'QA-RS'
    },
    termination: {
      terminationDate: '',
      commentsIfAny: '',
      qaSignTermination: ''
    },
  },
  {
    id: 3,
    createdAt: '2025-01-20T14:00:00Z',
    updatedAt: '2025-01-20T14:00:00Z',
    partA: {
      partName: 'BUMPER FRONT',
      model: 'MS-C2024',
      partNo: '71713M66R03',
      customer: 'Inhouse',
      issueDate: '2025-01-20',
      originator: 'A. Patel',
      man: true,
      machine: false,
      material: true,
      method: false,
      tool: true,
      others: 'Tooling update',
      detailsOfChangingPoints: 'Material grade change from PP-T20 to PP-T25 for improved impact resistance.',
      originatorSign: 'A.Patel'
    },
    partB: {
      isSupplierRelated: true,
      childPartName: 'PP Granules',
      supplierName: 'PolyPlast Industries',
      changeAcceptance: '',
      customerIntimationRequired: '',
      remarksIfAnyByQA: '',
      qaSignPartB: ''
    },
    termination: {
      terminationDate: '',
      commentsIfAny: '',
      qaSignTermination: ''
    },
  },
  {
    id: 4,
    createdAt: '2025-01-22T11:30:00Z',
    updatedAt: '2025-01-22T16:00:00Z',
    partA: {
      partName: 'DOOR TRIM PANEL',
      model: 'MS-D2024',
      partNo: '71714M67R04',
      customer: 'External',
      issueDate: '2025-01-22',
      originator: 'M. Singh',
      man: false,
      machine: false,
      material: false,
      method: true,
      tool: false,
      others: '',
      detailsOfChangingPoints: 'Assembly sequence optimization for better ergonomics.',
      originatorSign: 'M.Singh'
    },
    partB: {
      isSupplierRelated: false,
      childPartName: '',
      supplierName: '',
      changeAcceptance: 'NO',
      customerIntimationRequired: 'NO',
      remarksIfAnyByQA: 'Rejected due to insufficient validation data.',
      qaSignPartB: 'QA-MS'
    },
    termination: {
      terminationDate: '',
      commentsIfAny: '',
      qaSignTermination: ''
    },
  },
  {
    id: 5,
    inspectionReportId: 105,
    createdAt: '2025-01-25T08:00:00Z',
    updatedAt: '2025-01-25T10:30:00Z',
    partA: {
      partName: 'RADIATOR GRILLE',
      model: 'MS-E2024',
      partNo: '71715M68R05',
      customer: 'Inhouse',
      issueDate: '2025-01-25',
      originator: 'P. Verma',
      man: false,
      machine: true,
      material: false,
      method: false,
      tool: true,
      others: '',
      detailsOfChangingPoints: 'New injection molding tool with improved cooling channels.',
      originatorSign: 'P.Verma'
    },
    partB: {
      isSupplierRelated: false,
      childPartName: '',
      supplierName: '',
      changeAcceptance: 'YES',
      customerIntimationRequired: 'YES',
      remarksIfAnyByQA: 'Tool change approved. Dimensional validation passed.',
      qaSignPartB: 'QA-PV'
    },
    termination: {
      terminationDate: '2025-02-15',
      commentsIfAny: 'New tool commissioned successfully.',
      qaSignTermination: 'QA-PV'
    },
  },
  {
    id: 6,
    createdAt: '2025-01-28T13:45:00Z',
    updatedAt: '2025-01-28T15:20:00Z',
    partA: {
      partName: 'FENDER LH',
      model: 'MS-F2024',
      partNo: '71716M69R06',
      customer: 'External',
      issueDate: '2025-01-28',
      originator: 'K. Reddy',
      man: true,
      machine: false,
      material: true,
      method: true,
      tool: false,
      others: 'Paint process',
      detailsOfChangingPoints: 'New paint supplier with improved UV resistance coating.',
      originatorSign: 'K.Reddy'
    },
    partB: {
      isSupplierRelated: true,
      childPartName: 'UV Coating Paint',
      supplierName: 'ColorTech Paints',
      changeAcceptance: '',
      customerIntimationRequired: '',
      remarksIfAnyByQA: '',
      qaSignPartB: ''
    },
    termination: {
      terminationDate: '',
      commentsIfAny: '',
      qaSignTermination: ''
    },
  },
];

// ==================== MAIN COMPONENT ====================
const ChangeInformationNote: React.FC = () => {
  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [listViewType, setListViewType] = useState<ListViewType>('card');
  const [formData, setFormData] = useState<ActiveFormState>({ ...initialFormState });
  const [submittedNotes, setSubmittedNotes] = useState<ChangeNoteFormState[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPrefillNotice, setShowPrefillNotice] = useState(false);
  const [prefillSource, setPrefillSource] = useState<any>(null);
  
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'Inhouse' | 'External'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sort State
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // UI State
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [viewingNote, setViewingNote] = useState<ChangeNoteFormState | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSubmittedNotes(parsedData);
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
        setSubmittedNotes(mockInitialData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInitialData));
      }
    } else {
      setSubmittedNotes(mockInitialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInitialData));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (submittedNotes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submittedNotes));
    }
  }, [submittedNotes]);

  // Check for prefilled data
  useEffect(() => {
    const prefillData = localStorage.getItem('change_note_prefill');
    if (prefillData) {
      try {
        const data = JSON.parse(prefillData);
        setPrefillSource(data);
        setFormData(prev => ({
          ...prev,
          inspectionReportId: data.reportId,
          partA: {
            ...prev.partA,
            partName: data.partName || prev.partA.partName,
            partNo: data.partNumber || prev.partA.partNo,
            customer: (data.customer === 'Inhouse' || data.customer === 'External') ? data.customer : 'Inhouse',
            model: data.operationName || prev.partA.model,
          }
        }));
        setShowPrefillNotice(true);
        setViewMode('form');
        localStorage.removeItem('change_note_prefill');
        setTimeout(() => setShowPrefillNotice(false), 10000);
      } catch (error) {
        console.error('Failed to load prefill data:', error);
      }
    }
  }, []);

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter and sort data
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = [...submittedNotes];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.partA.partName.toLowerCase().includes(query) ||
        note.partA.partNo.toLowerCase().includes(query) ||
        note.partA.originator.toLowerCase().includes(query) ||
        note.partA.model.toLowerCase().includes(query) ||
        note.id.toString().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(note => {
        if (statusFilter === 'approved') return note.partB.changeAcceptance === 'YES';
        if (statusFilter === 'rejected') return note.partB.changeAcceptance === 'NO';
        if (statusFilter === 'pending') return note.partB.changeAcceptance === '';
        return true;
      });
    }

    // Apply customer filter
    if (customerFilter !== 'all') {
      filtered = filtered.filter(note => note.partA.customer === customerFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'partName':
          comparison = a.partA.partName.localeCompare(b.partA.partName);
          break;
        case 'issueDate':
          comparison = new Date(a.partA.issueDate).getTime() - new Date(b.partA.issueDate).getTime();
          break;
        case 'status':
          const statusOrder = { 'YES': 0, 'NO': 1, '': 2 };
          comparison = statusOrder[a.partB.changeAcceptance] - statusOrder[b.partB.changeAcceptance];
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [submittedNotes, searchQuery, statusFilter, customerFilter, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedNotes.length / itemsPerPage);
  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedNotes.slice(start, start + itemsPerPage);
  }, [filteredAndSortedNotes, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, customerFilter, itemsPerPage]);

  // Handle form input changes
  const handleInputChange = <T extends keyof ActiveFormState>(
    section: T,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [name]: value,
      },
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      partA: {
        ...prev.partA,
        [name]: checked,
      } as PartA,
    }));
  };

  const handleRadioChange = (name: keyof PartB, value: 'YES' | 'NO') => {
    setFormData((prev) => ({
      ...prev,
      partB: {
        ...prev.partB,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.partB.changeAcceptance === '') {
      showNotification('error', 'Please confirm Change Acceptance (YES/NO) before submitting.');
      return;
    }

    const now = new Date().toISOString();

    if (editingId !== null) {
      // Update existing note
      setSubmittedNotes(prev =>
        prev.map(note =>
          note.id === editingId
            ? { ...note, ...formData, updatedAt: now }
            : note
        )
      );
      showNotification('success', `Note #${editingId} updated successfully!`);
      setEditingId(null);
    } else {
      // Create new note
      const nextId = submittedNotes.length > 0 ? Math.max(...submittedNotes.map(n => n.id)) + 1 : 1;
      const newNote: ChangeNoteFormState = {
        id: nextId,
        createdAt: now,
        updatedAt: now,
        ...formData
      };
      setSubmittedNotes(prev => [newNote, ...prev]);
      showNotification('success', `Note #${nextId} created successfully!`);
    }

    setFormData({ ...initialFormState });
    setShowPrefillNotice(false);
    setPrefillSource(null);
    setViewMode('list');
  };

  const handleEdit = (note: ChangeNoteFormState) => {
    setFormData({
      inspectionReportId: note.inspectionReportId,
      partA: { ...note.partA },
      partB: { ...note.partB },
      termination: { ...note.termination },
    });
    setEditingId(note.id);
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    setSubmittedNotes(prev => prev.filter(note => note.id !== id));
    setShowDeleteConfirm(null);
    showNotification('success', `Note #${id} deleted successfully!`);
  };

  const handleCancelEdit = () => {
    setFormData({ ...initialFormState });
    setEditingId(null);
    setViewMode('list');
  };

  const toggleCardExpand = (id: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'YES':
        return { label: 'Approved', color: 'emerald', icon: Check };
      case 'NO':
        return { label: 'Rejected', color: 'rose', icon: X };
      default:
        return { label: 'Pending', color: 'amber', icon: Clock };
    }
  };

  const getChangingPoints = (partA: PartA) => {
    const points = [];
    if (partA.man) points.push('Man');
    if (partA.machine) points.push('Machine');
    if (partA.material) points.push('Material');
    if (partA.method) points.push('Method');
    if (partA.tool) points.push('Tool');
    if (partA.others) points.push(partA.others);
    return points;
  };

  const exportData = () => {
    const dataStr = JSON.stringify(submittedNotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `change_notes_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('success', 'Data exported successfully!');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setSubmittedNotes([]);
      localStorage.removeItem(STORAGE_KEY);
      showNotification('info', 'All data has been cleared.');
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: submittedNotes.length,
    approved: submittedNotes.filter(n => n.partB.changeAcceptance === 'YES').length,
    rejected: submittedNotes.filter(n => n.partB.changeAcceptance === 'NO').length,
    pending: submittedNotes.filter(n => n.partB.changeAcceptance === '').length,
  }), [submittedNotes]);

  // View Note Modal
  const ViewNoteModal = ({ note, onClose }: { note: ChangeNoteFormState; onClose: () => void }) => {
    const statusInfo = getStatusInfo(note.partB.changeAcceptance);
    const changingPoints = getChangingPoints(note.partA);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className={`p-6 bg-gradient-to-r ${
            statusInfo.color === 'emerald' ? 'from-emerald-500 to-green-600' :
            statusInfo.color === 'rose' ? 'from-rose-500 to-red-600' :
            'from-amber-500 to-orange-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Change Note #{note.id}</h2>
                  <p className="text-white/80">{note.partA.partName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Status Badge */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-4 py-2 rounded-xl font-bold ${
                statusInfo.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                statusInfo.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                Status: {statusInfo.label}
              </span>
              {note.inspectionReportId && (
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium">
                  <LinkIcon size={16} />
                  Linked to Report #{note.inspectionReportId}
                </span>
              )}
            </div>

            {/* Part A */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="text-blue-600" size={20} />
                Part A: Change Initiation
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4">
                <div><span className="text-slate-500 text-sm">Part Name</span><p className="font-semibold text-slate-800">{note.partA.partName}</p></div>
                <div><span className="text-slate-500 text-sm">Part No</span><p className="font-semibold text-slate-800">{note.partA.partNo}</p></div>
                <div><span className="text-slate-500 text-sm">Model</span><p className="font-semibold text-slate-800">{note.partA.model || '-'}</p></div>
                <div><span className="text-slate-500 text-sm">Customer</span><p className="font-semibold text-slate-800">{note.partA.customer}</p></div>
                <div><span className="text-slate-500 text-sm">Issue Date</span><p className="font-semibold text-slate-800">{note.partA.issueDate}</p></div>
                <div><span className="text-slate-500 text-sm">Originator</span><p className="font-semibold text-slate-800">{note.partA.originator}</p></div>
              </div>
              <div className="mt-4">
                <span className="text-slate-500 text-sm block mb-2">Changing Points</span>
                <div className="flex flex-wrap gap-2">
                  {changingPoints.map((point, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">{point}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <span className="text-slate-500 text-sm block mb-2">Details of Changing Points</span>
                <p className="text-slate-800">{note.partA.detailsOfChangingPoints || '-'}</p>
              </div>
            </div>

            {/* Part B */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-violet-600" size={20} />
                Part B: Quality Feedback & Approval
              </h3>
              {note.partB.isSupplierRelated && (
                <div className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-200">
                  <span className="text-orange-600 font-bold text-sm uppercase">Supplier Related Change</span>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div><span className="text-slate-500 text-sm">Child Part Name</span><p className="font-semibold text-slate-800">{note.partB.childPartName}</p></div>
                    <div><span className="text-slate-500 text-sm">Supplier Name</span><p className="font-semibold text-slate-800">{note.partB.supplierName}</p></div>
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                <div><span className="text-slate-500 text-sm">Change Acceptance</span><p className={`font-bold ${note.partB.changeAcceptance === 'YES' ? 'text-emerald-600' : note.partB.changeAcceptance === 'NO' ? 'text-rose-600' : 'text-amber-600'}`}>{note.partB.changeAcceptance || 'Pending'}</p></div>
                <div><span className="text-slate-500 text-sm">Customer Intimation Required</span><p className="font-semibold text-slate-800">{note.partB.customerIntimationRequired || '-'}</p></div>
              </div>
              {note.partB.remarksIfAnyByQA && (
                <div className="mt-4 bg-slate-50 rounded-xl p-4">
                  <span className="text-slate-500 text-sm block mb-2">QA Remarks</span>
                  <p className="text-slate-800">{note.partB.remarksIfAnyByQA}</p>
                </div>
              )}
            </div>

            {/* Termination */}
            {note.termination.terminationDate && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar className="text-emerald-600" size={20} />
                  Change Termination
                </h3>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><span className="text-slate-500 text-sm">Termination Date</span><p className="font-semibold text-slate-800">{note.termination.terminationDate}</p></div>
                    <div><span className="text-slate-500 text-sm">QA Sign</span><p className="font-semibold text-slate-800">{note.termination.qaSignTermination || '-'}</p></div>
                  </div>
                  {note.termination.commentsIfAny && (
                    <div className="mt-4">
                      <span className="text-slate-500 text-sm block mb-2">Comments</span>
                      <p className="text-slate-800">{note.termination.commentsIfAny}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
              <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={() => { onClose(); handleEdit(note); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={18} />
              Edit Note
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 md:p-6 lg:p-8">
      {/* Custom Styles */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px 10px rgba(59, 130, 246, 0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in
          ${notification.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' :
            notification.type === 'error' ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white' :
            'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'}`}
        >
          {notification.type === 'success' && <CheckCircle size={20} />}
          {notification.type === 'error' && <AlertCircle size={20} />}
          {notification.type === 'info' && <Bell size={20} />}
          <span className="font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <X size={18} />
          </button>
        </div>
      )}

      {/* View Note Modal */}
      {viewingNote && <ViewNoteModal note={viewingNote} onClose={() => setViewingNote(null)} />}

      {/* Header */}
      <header className="relative mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl -z-10" />
        
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow">
              <Layers className="text-white" size={28} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                4M Change Information Note
              </h1>
              <p className="text-slate-500 text-sm md:text-base">Man • Machine • Material • Method</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-4xl mx-auto">
          <div 
            onClick={() => setStatusFilter('all')}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 hover:shadow-xl transition-all cursor-pointer ${statusFilter === 'all' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-white/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Total Notes</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setStatusFilter('approved')}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 hover:shadow-xl transition-all cursor-pointer ${statusFilter === 'approved' ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-white/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <Check className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Approved</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setStatusFilter('rejected')}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 hover:shadow-xl transition-all cursor-pointer ${statusFilter === 'rejected' ? 'border-rose-400 ring-2 ring-rose-200' : 'border-white/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-500 rounded-lg flex items-center justify-center">
                <X className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600">{stats.rejected}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Rejected</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setStatusFilter('pending')}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 hover:shadow-xl transition-all cursor-pointer ${statusFilter === 'pending' ? 'border-amber-400 ring-2 ring-amber-200' : 'border-white/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* View Toggle & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setViewMode('list'); setEditingId(null); setFormData({ ...initialFormState }); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300
              ${viewMode === 'list' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <LayoutGrid size={18} />
            View Notes
          </button>
          <button
            onClick={() => { setViewMode('form'); setEditingId(null); setFormData({ ...initialFormState }); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300
              ${viewMode === 'form' 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Plus size={18} />
            {editingId ? 'Edit Note' : 'New Note'}
          </button>
        </div>

        {viewMode === 'list' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl font-medium transition-all"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={clearAllData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-medium transition-all"
            >
              <Trash2 size={18} />
              Clear All
            </button>
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
              <button
                onClick={() => setListViewType('card')}
                className={`p-2 rounded-lg transition-all ${listViewType === 'card' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Card View"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setListViewType('table')}
                className={`p-2 rounded-lg transition-all ${listViewType === 'table' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Table View"
              >
                <Table size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {viewMode === 'list' ? (
        <>
          {/* Search & Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by part name, number, originator, or note ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                  ${showFilters || statusFilter !== 'all' || customerFilter !== 'all'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'}`}
              >
                <Filter size={18} />
                Filters
                {(statusFilter !== 'all' || customerFilter !== 'all') && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {(statusFilter !== 'all' ? 1 : 0) + (customerFilter !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-') as [SortField, SortDirection];
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="id-desc">Newest First</option>
                  <option value="id-asc">Oldest First</option>
                  <option value="partName-asc">Part Name (A-Z)</option>
                  <option value="partName-desc">Part Name (Z-A)</option>
                  <option value="issueDate-desc">Issue Date (Recent)</option>
                  <option value="issueDate-asc">Issue Date (Oldest)</option>
                  <option value="status-asc">Status (Approved First)</option>
                  <option value="status-desc">Status (Pending First)</option>
                </select>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-200 grid md:grid-cols-3 gap-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Customer Type</label>
                  <select
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Customers</option>
                    <option value="Inhouse">Inhouse</option>
                    <option value="External">External</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { setStatusFilter('all'); setCustomerFilter('all'); setSearchQuery(''); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <RefreshCw size={16} />
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 text-sm text-slate-600">
            <span>
              Showing <span className="font-semibold text-slate-800">{paginatedNotes.length}</span> of{' '}
              <span className="font-semibold text-slate-800">{filteredAndSortedNotes.length}</span> notes
              {searchQuery && <span className="text-blue-600"> matching "{searchQuery}"</span>}
            </span>
            <div className="flex items-center gap-2">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
              >
                {ITEMS_PER_PAGE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List Content */}
          {paginatedNotes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="text-slate-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">No Notes Found</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'all' || customerFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                  : 'Create your first 4M Change Note to get started with change management.'}
              </p>
              {(searchQuery || statusFilter !== 'all' || customerFilter !== 'all') ? (
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCustomerFilter('all'); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all mr-3"
                >
                  <RefreshCw size={20} />
                  Clear Filters
                </button>
              ) : null}
              <button
                onClick={() => { setViewMode('form'); setFormData({ ...initialFormState }); }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                Create New Note
              </button>
            </div>
          ) : listViewType === 'card' ? (
            /* Card View */
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedNotes.map((note) => {
                const statusInfo = getStatusInfo(note.partB.changeAcceptance);
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedCards.has(note.id);
                const changingPoints = getChangingPoints(note.partA);

                return (
                  <div
                    key={note.id}
                    className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                      ${statusInfo.color === 'emerald' ? 'border-emerald-200 hover:border-emerald-300' :
                        statusInfo.color === 'rose' ? 'border-rose-200 hover:border-rose-300' :
                        'border-amber-200 hover:border-amber-300'}`}
                  >
                    {/* Card Header */}
                    <div className={`px-5 py-4 
                      ${statusInfo.color === 'emerald' ? 'bg-gradient-to-r from-emerald-50 to-green-50' :
                        statusInfo.color === 'rose' ? 'bg-gradient-to-r from-rose-50 to-red-50' :
                        'bg-gradient-to-r from-amber-50 to-yellow-50'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md
                            ${statusInfo.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                              statusInfo.color === 'rose' ? 'bg-gradient-to-br from-rose-500 to-red-600' : 
                              'bg-gradient-to-br from-amber-500 to-orange-500'}`}
                          >
                            <StatusIcon className="text-white" size={22} />
                          </div>
                          <div>
                            <span className="text-xl font-bold text-slate-800">#{note.id}</span>
                            {note.inspectionReportId && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                <LinkIcon size={10} />
                                Report #{note.inspectionReportId}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm
                          ${statusInfo.color === 'emerald' ? 'bg-emerald-500 text-white' :
                            statusInfo.color === 'rose' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-800 text-lg truncate" title={note.partA.partName}>
                        {note.partA.partName}
                      </h3>
                      <p className="text-sm text-slate-600 font-medium">{note.partA.partNo}</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Model</span>
                          <p className="font-semibold text-slate-700 truncate">{note.partA.model || '-'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Customer</span>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold
                            ${note.partA.customer === 'Inhouse' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {note.partA.customer}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Originator</span>
                          <p className="font-semibold text-slate-700 truncate">{note.partA.originator || '-'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Issue Date</span>
                          <p className="font-semibold text-slate-700">{note.partA.issueDate}</p>
                        </div>
                      </div>

                      {/* Changing Points */}
                      <div className="mb-4">
                        <span className="text-slate-400 text-xs uppercase tracking-wide block mb-2">Changing Points</span>
                        <div className="flex flex-wrap gap-1.5">
                          {changingPoints.length > 0 ? changingPoints.map((point, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                              {point}
                            </span>
                          )) : (
                            <span className="text-slate-400 text-xs italic">None specified</span>
                          )}
                        </div>
                      </div>

                      {/* Expandable Details */}
                      <button
                        onClick={() => toggleCardExpand(note.id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        {isExpanded ? 'Show Less' : 'Show More Details'}
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                          <div className="bg-slate-50 rounded-lg p-3">
                            <span className="text-slate-500 text-xs uppercase tracking-wide block mb-1">Details of Change</span>
                            <p className="text-slate-700 text-sm">{note.partA.detailsOfChangingPoints || 'No details provided'}</p>
                          </div>
                          
                          {note.partB.isSupplierRelated && (
                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                              <span className="text-orange-600 text-xs font-bold uppercase flex items-center gap-1 mb-2">
                                <Package size={12} />
                                Supplier Related
                              </span>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-slate-500 text-xs">Child Part:</span>
                                  <p className="font-medium text-slate-700">{note.partB.childPartName}</p>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-xs">Supplier:</span>
                                  <p className="font-medium text-slate-700">{note.partB.supplierName}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {note.partB.remarksIfAnyByQA && (
                            <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                              <span className="text-violet-600 text-xs font-bold uppercase mb-1 block">QA Remarks</span>
                              <p className="text-slate-700 text-sm">{note.partB.remarksIfAnyByQA}</p>
                            </div>
                          )}
                          
                          {note.termination.terminationDate && (
                            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                              <span className="text-emerald-600 text-xs font-bold uppercase flex items-center gap-1 mb-2">
                                <Check size={12} />
                                Terminated
                              </span>
                              <p className="text-sm"><span className="font-medium">Date:</span> {note.termination.terminationDate}</p>
                              {note.termination.commentsIfAny && (
                                <p className="text-slate-600 text-sm mt-1">{note.termination.commentsIfAny}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer - Actions */}
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Updated: {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewingNote(note)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(note)}
                          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(note.id)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Delete Confirmation Overlay */}
                    {showDeleteConfirm === note.id && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl p-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-rose-600" size={28} />
                          </div>
                          <h4 className="font-bold text-lg text-slate-800 mb-2">Delete Note #{note.id}?</h4>
                          <p className="text-slate-600 text-sm mb-6">This action cannot be undone.</p>
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(note.id)}
                              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-red-700 transition-all shadow-lg"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                        <button onClick={() => handleSort('id')} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          ID <ArrowUpDown size={14} className={sortField === 'id' ? 'text-blue-600' : ''} />
                        </button>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                        <button onClick={() => handleSort('partName')} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          Part Details <ArrowUpDown size={14} className={sortField === 'partName' ? 'text-blue-600' : ''} />
                        </button>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Model</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Customer</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Originator</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                        <button onClick={() => handleSort('issueDate')} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          Issue Date <ArrowUpDown size={14} className={sortField === 'issueDate' ? 'text-blue-600' : ''} />
                        </button>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Changes</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                        <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          Status <ArrowUpDown size={14} className={sortField === 'status' ? 'text-blue-600' : ''} />
                        </button>
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedNotes.map((note, index) => {
                      const statusInfo = getStatusInfo(note.partB.changeAcceptance);
                      const changingPoints = getChangingPoints(note.partA);

                      return (
                        <tr 
                          key={note.id} 
                          className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-lg">#{note.id}</span>
                              {note.inspectionReportId && (
                                <span className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                                  <LinkIcon size={10} />
                                  Report #{note.inspectionReportId}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="max-w-[200px]">
                              <p className="font-semibold text-slate-800 truncate" title={note.partA.partName}>{note.partA.partName}</p>
                              <p className="text-sm text-slate-500 font-medium">{note.partA.partNo}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 font-medium">{note.partA.model || '-'}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg
                              ${note.partA.customer === 'Inhouse' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {note.partA.customer}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 font-medium">{note.partA.originator || '-'}</td>
                          <td className="px-4 py-4 text-sm text-slate-600 font-medium">{note.partA.issueDate}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {changingPoints.slice(0, 2).map((point, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-md">
                                  {point}
                                </span>
                              ))}
                              {changingPoints.length > 2 && (
                                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-md">
                                  +{changingPoints.length - 2}
                                </span>
                              )}
                              {changingPoints.length === 0 && (
                                <span className="text-slate-400 text-xs italic">None</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg
                              ${statusInfo.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                statusInfo.color === 'rose' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                              <statusInfo.icon size={14} />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setViewingNote(note)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleEdit(note)}
                                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(note.id)}
                                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal for Table View */}
          {showDeleteConfirm !== null && listViewType === 'table' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl m-4 max-w-sm text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-rose-600" size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-800 mb-2">Delete Note #{showDeleteConfirm}?</h4>
                <p className="text-slate-600 mb-6">This action cannot be undone. The note will be permanently removed.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-red-700 transition-all shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="text-sm text-slate-600">
                Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                <span className="text-slate-400 ml-2">({filteredAndSortedNotes.length} total records)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum : number ;
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
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all
                          ${currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                            : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Form View */
        <>
          {/* Prefill Notice Banner */}
          {showPrefillNotice && prefillSource && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <LinkIcon className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="text-green-600" size={22} />
                      <h3 className="text-xl font-bold text-gray-800">Data Pre-filled from Inspection Report</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white/80 rounded-xl p-3 border border-blue-100 shadow-sm">
                        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">Report ID</span>
                        <p className="font-bold text-blue-700 text-lg">#{prefillSource.reportId}</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3 border border-blue-100 shadow-sm">
                        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">Part Name</span>
                        <p className="font-bold text-gray-800 truncate">{prefillSource.partName}</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3 border border-blue-100 shadow-sm">
                        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">Part Number</span>
                        <p className="font-bold text-gray-800">{prefillSource.partNumber}</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3 border border-blue-100 shadow-sm">
                        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">Customer</span>
                        <p className="font-bold text-gray-800">{prefillSource.customer}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 flex items-center gap-2">
                      <Check className="text-green-600" size={16} />
                      Basic information has been automatically filled. Please review and complete the remaining fields.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPrefillNotice(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg
                  ${editingId ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-emerald-500 to-green-500'}`}
                >
                  {editingId ? <Edit2 className="text-white" size={28} /> : <Plus className="text-white" size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    {editingId ? `Edit Note #${editingId}` : 'Create New Change Note'}
                  </h2>
                  <p className="text-slate-500 mt-1">
                    {editingId ? 'Modify the existing change note details below' : 'Fill out the form to create a new 4M change information note'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-all border border-slate-200"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PART A */}
            <FormSection 
              title="PART - A: CHANGE INITIATION" 
              icon={<Package className="text-white" size={20} />}
              gradientFrom="blue"
              gradientTo="cyan"
              subtitle="Document the change request details"
            >
              {formData.inspectionReportId && (
                <div className="col-span-4 p-4 mb-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <LinkIcon className="text-white" size={20} />
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 text-sm">Linked to Inspection Report</span>
                      <p className="font-bold text-blue-600 text-lg">#{formData.inspectionReportId}</p>
                    </div>
                  </div>
                </div>
              )}

              <FormInput 
                label="PART NAME" 
                name="partName" 
                value={formData.partA.partName} 
                onChange={(e) => handleInputChange('partA', e)} 
                required
                placeholder="Enter part name"
              />
              <FormInput 
                label="MODEL" 
                name="model" 
                value={formData.partA.model} 
                onChange={(e) => handleInputChange('partA', e)} 
                placeholder="Enter model number"
              />
              <FormInput 
                label="PART NO" 
                name="partNo" 
                value={formData.partA.partNo} 
                onChange={(e) => handleInputChange('partA', e)} 
                required
                placeholder="Enter part number"
              />
              
              <div className="flex flex-col p-4 border-2 border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-sm">
                <label className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wide">CUSTOMER TYPE <span className="text-rose-500">*</span></label>
                <div className="flex gap-3">
                  {(['Inhouse', 'External'] as const).map((type) => (
                    <label 
                      key={type} 
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl cursor-pointer transition-all border-2
                        ${formData.partA.customer === type 
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
                    >
                      <input
                        type="radio"
                        name="customer"
                        value={type}
                        checked={formData.partA.customer === type}
                        onChange={(e) => handleInputChange('partA', e)}
                        className="sr-only"
                      />
                      <span className="font-semibold">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FormInput 
                label="ISSUE DATE" 
                name="issueDate" 
                type="date" 
                value={formData.partA.issueDate} 
                onChange={(e) => handleInputChange('partA', e)} 
                required
              />
              <FormInput 
                label="ORIGINATOR" 
                name="originator" 
                value={formData.partA.originator} 
                onChange={(e) => handleInputChange('partA', e)} 
                required
                placeholder="Enter originator name"
              />

              {/* Changing Points */}
              <div className="col-span-4 p-5 border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm">
                <label className="text-sm font-bold text-slate-700 mb-4 uppercase block tracking-wide">
                  CHANGING POINT <span className="font-normal text-slate-500">(Select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-3 mt-3">
                  {(['MAN', 'MACHINE', 'MATERIAL', 'METHOD', 'TOOL'] as const).map((key) => {
                    const isChecked = formData.partA[key.toLowerCase() as keyof PartA] as boolean;
                    return (
                      <label 
                        key={key} 
                        className={`flex items-center gap-3 cursor-pointer px-5 py-3 rounded-xl border-2 transition-all
                          ${isChecked 
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-md'}`}
                      >
                        <input
                          type="checkbox"
                          name={key.toLowerCase()}
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                          ${isChecked ? 'bg-white border-white' : 'border-slate-300'}`}>
                          {isChecked && <Check size={14} className="text-blue-500" />}
                        </div>
                        <span className="font-semibold">{key}</span>
                      </label>
                    );
                  })}
                  <div className="flex-1 min-w-[200px]">
                    <FormInput 
                      label="OTHERS (Specify)" 
                      name="others" 
                      value={formData.partA.others} 
                      onChange={(e) => handleInputChange('partA', e)} 
                      colSpan="col-span-1"
                      placeholder="Other changes..."
                    />
                  </div>
                </div>
              </div>

              <FormInput 
                label="DETAILS OF CHANGING POINTS" 
                name="detailsOfChangingPoints" 
                value={formData.partA.detailsOfChangingPoints} 
                onChange={(e) => handleInputChange('partA', e)} 
                isTextArea 
                colSpan="col-span-4"
                placeholder="Provide a detailed description of the changes being made, including reason for change, expected impact, and any relevant technical specifications..."
                rows={5}
              />

              <div className="col-span-4 pt-4 flex justify-end items-center border-t border-slate-200 mt-2">
                <FormInput 
                  label="ORIGINATOR SIGNATURE" 
                  name="originatorSign" 
                  value={formData.partA.originatorSign} 
                  onChange={(e) => handleInputChange('partA', e)} 
                  colSpan="lg:col-span-1 md:col-span-2 col-span-4"
                  placeholder="Digital signature"
                />
              </div>
            </FormSection>

            {/* PART B */}
            <FormSection 
              title="PART - B: QUALITY FEEDBACK & APPROVAL" 
              icon={<CheckCircle className="text-white" size={20} />}
              gradientFrom="violet"
              gradientTo="purple"
              subtitle="Quality assessment and approval decision"
            >
              <div className="col-span-4 p-5 border-2 border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      IS SUPPLIER RELATED CHANGE?
                    </span>
                    <span className="text-xs text-slate-500">Toggle if this change involves an external supplier</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      partB: { 
                        ...prev.partB, 
                        isSupplierRelated: !prev.partB.isSupplierRelated,
                        childPartName: !prev.partB.isSupplierRelated ? prev.partB.childPartName : '',
                        supplierName: !prev.partB.isSupplierRelated ? prev.partB.supplierName : '',
                      } 
                    }))}
                    className={`relative w-16 h-9 rounded-full transition-colors duration-300 ${formData.partB.isSupplierRelated ? 'bg-orange-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${formData.partB.isSupplierRelated ? 'translate-x-8' : 'translate-x-1'}`}>
                      {formData.partB.isSupplierRelated && <Check size={14} className="text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                    </div>
                  </button>
                </div>
              </div>

              {formData.partB.isSupplierRelated && (
                <div className="col-span-4 grid md:grid-cols-2 gap-4 p-4 bg-orange-50 rounded-xl border-2 border-orange-200 animate-fade-in">
                  <FormInput 
                    label="CHILD PART NAME" 
                    name="childPartName" 
                    value={formData.partB.childPartName} 
                    onChange={(e) => handleInputChange('partB', e)}
                    placeholder="Enter child part name"
                  />
                  <FormInput 
                    label="SUPPLIER NAME" 
                    name="supplierName" 
                    value={formData.partB.supplierName} 
                    onChange={(e) => handleInputChange('partB', e)}
                    placeholder="Enter supplier name"
                  />
                </div>
              )}

              <FormRadioGroup
                label="CHANGE ACCEPTANCE"
                name="changeAcceptance"
                value={formData.partB.changeAcceptance}
                onChange={(val) => handleRadioChange('changeAcceptance', val)}
                required
              />
              <FormRadioGroup
                label="CUSTOMER INTIMATION REQUIRED"
                name="customerIntimationRequired"
                value={formData.partB.customerIntimationRequired}
                onChange={(val) => handleRadioChange('customerIntimationRequired', val)}
              />

              <FormInput 
                label="REMARKS BY QA" 
                name="remarksIfAnyByQA" 
                value={formData.partB.remarksIfAnyByQA} 
                onChange={(e) => handleInputChange('partB', e)} 
                isTextArea 
                colSpan="col-span-4"
                placeholder="Enter quality assessment remarks, observations, or conditions for approval..."
                rows={4}
              />

              <div className="col-span-4 pt-4 flex justify-end items-center border-t border-slate-200 mt-2">
                <FormInput 
                  label="QA SIGNATURE (APPROVAL)" 
                  name="qaSignPartB" 
                  value={formData.partB.qaSignPartB} 
                  onChange={(e) => handleInputChange('partB', e)} 
                  colSpan="lg:col-span-1 md:col-span-2 col-span-4"
                  placeholder="QA digital signature"
                />
              </div>
            </FormSection>

            {/* TERMINATION */}
            <FormSection 
              title="CHANGE TERMINATION" 
              icon={<Calendar className="text-white" size={20} />}
              gradientFrom="emerald"
              gradientTo="green"
              subtitle="Implementation confirmation & closure"
            >
              <FormInput 
                label="TERMINATION DATE" 
                name="terminationDate" 
                type="date" 
                value={formData.termination.terminationDate} 
                onChange={(e) => handleInputChange('termination', e)} 
              />
              <FormInput 
                label="FINAL COMMENTS" 
                name="commentsIfAny" 
                value={formData.termination.commentsIfAny} 
                onChange={(e) => handleInputChange('termination', e)} 
                isTextArea 
                colSpan="col-span-3"
                placeholder="Enter final comments, implementation notes, or lessons learned..."
                rows={4}
              />

              <div className="col-span-4 pt-4 flex justify-end items-center border-t border-slate-200 mt-2">
                <FormInput 
                  label="QA SIGNATURE (TERMINATION)" 
                  name="qaSignTermination" 
                  value={formData.termination.qaSignTermination} 
                  onChange={(e) => handleInputChange('termination', e)} 
                  colSpan="lg:col-span-1 md:col-span-2 col-span-4"
                  placeholder="QA digital signature"
                />
              </div>
            </FormSection>

            {/* Validation Warning */}
            {formData.partB.changeAcceptance === '' && (
              <div className="flex items-center justify-center gap-3 text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-xl border-2 border-amber-200 shadow-sm">
                <AlertCircle size={24} />
                <span className="font-medium">Please select Change Acceptance (YES/NO) in Part B before submitting the note</span>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pb-10">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-8 py-4 bg-white text-slate-600 font-semibold rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-lg order-2 sm:order-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <X size={20} />
                  Cancel
                </span>
              </button>
              <button
                type="submit"
                disabled={formData.partB.changeAcceptance === ''}
                className="group relative bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 hover:from-emerald-600 hover:via-green-700 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden order-1 sm:order-2"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <Save size={22} />
                  {editingId ? 'Update Change Note' : 'Submit & Request Approval'}
                  <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChangeInformationNote;