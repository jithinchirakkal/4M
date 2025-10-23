
// import React, { useState, useEffect } from 'react';

// // Define the record interface
// interface Record {
//   srNo: number;
//   recordNo: string;
//   revNo: string;
//   revDate: string;
//   recordName: string;
//   retentionPeriod: string;
//   disposalAuthority: string;
//   file: File | null;
// }

// // Demo Data with placeholder files
// const demoData: Record[] = [
//   {
//     srNo: 1,
//     recordNo: 'MS-4M-WI-01',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: '4M change identification sheet (Planned/unplanned)',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample1.pdf', { type: 'application/pdf' }),
//   },
//   {
//     srNo: 2,
//     recordNo: 'MS-4M-WI-01a',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: 'Handling of abnormal situation',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample2.doc', { type: 'application/msword' }),
//   },
//   {
//     srNo: 3,
//     recordNo: 'MS-4M-02',
//     revNo: '0.0',
//     revDate: '2017-03-25',
//     recordName: 'List of break down',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: null,
//   },
//   {
//     srNo: 4,
//     recordNo: 'MS-4M-03',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: '4M change information flow sheet',
//     retentionPeriod: 'Up to tool life',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample3.png', { type: 'image/png' }),
//   },
//   {
//     srNo: 5,
//     recordNo: 'MS-4M-04',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: '4M change identification tag',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: null,
//   },
//   {
//     srNo: 6,
//     recordNo: 'MS-4M-07',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: '4M change traceability record sheet',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality/Prod.',
//     file: new File(['sample content'], 'sample4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
//   },
//   {
//     srNo: 7,
//     recordNo: 'MS-4M-06',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: '4M Change inspection report',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality',
//     file: null,
//   },
//   {
//     srNo: 8,
//     recordNo: 'MS-4M-05A',
//     revNo: '0.0',
//     revDate: '2017-04-10',
//     recordName: '4M Change summary sheet',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Head quality',
//     file: new File(['sample content'], 'sample5.jpg', { type: 'image/jpeg' }),
//   },
//   {
//     srNo: 9,
//     recordNo: 'MS-4M-05',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: '4M Change record sheet',
//     retentionPeriod: 'One Year',
//     disposalAuthority: 'Quality Sup.',
//     file: null,
//   },
//   {
//     srNo: 10,
//     recordNo: 'MS-4M-08',
//     revNo: '0.0',
//     revDate: '2017-04-01',
//     recordName: '4M Change display board',
//     retentionPeriod: 'Daily',
//     disposalAuthority: 'Quality Sup.',
//     file: new File(['sample content'], 'sample6.pdf', { type: 'application/pdf' }),
//   },
// ];

// // Header Info
// const headerInfo = {
//   docNo: 'MS/4M/PR/05',
//   revNo: '28.02.20',
//   date: '2020-02-28',
//   processName: '4M Change Procedure',
//   purpose: 'To implement the system for control the 4M (Man, Machine, Material, Method) changes in process',
//   scope: 'Applicable to all manufacturing process',
//   processOwner: 'Head quality & Production',
// };

// // Component
// const FourMChangeProcedure: React.FC = () => {
//   const [records, setRecords] = useState<Record[]>(demoData);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [formData, setFormData] = useState<Record>({
//     srNo: 0,
//     recordNo: '',
//     revNo: '',
//     revDate: '',
//     recordName: '',
//     retentionPeriod: '',
//     disposalAuthority: '',
//     file: null,
//   });
//   const [editingIndex, setEditingIndex] = useState<number>(-1);

//   useEffect(() => {
//     const updatedRecords = records.map((record, index) => ({
//       ...record,
//       srNo: index + 1,
//     }));
//     setRecords(updatedRecords);
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       file: e.target.files ? e.target.files[0] : null,
//     }));
//   };

//   const handleAdd = () => {
//     if (editingIndex === -1) {
//       const newRecord: Record = {
//         ...formData,
//         srNo: records.length + 1,
//       };
//       setRecords([...records, newRecord]);
//     } else {
//       const updatedRecords = [...records];
//       updatedRecords[editingIndex] = { ...formData, srNo: records[editingIndex].srNo };
//       setRecords(updatedRecords);
//       setEditingIndex(-1);
//     }

//     setFormData({
//       srNo: 0,
//       recordNo: '',
//       revNo: '',
//       revDate: '',
//       recordName: '',
//       retentionPeriod: '',
//       disposalAuthority: '',
//       file: null,
//     });
//     setShowForm(false);
//   };

//   const handleEdit = (index: number) => {
//     const record = records[index];
//     setFormData(record);
//     setEditingIndex(index);
//     setShowForm(true);
//   };

//   const handleDelete = (index: number) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       const updatedRecords = records.filter((_, i) => i !== index);
//       setRecords(updatedRecords);
//     }
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingIndex(-1);
//     setFormData({
//       srNo: 0,
//       recordNo: '',
//       revNo: '',
//       revDate: '',
//       recordName: '',
//       retentionPeriod: '',
//       disposalAuthority: '',
//       file: null,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header Section */}
//       <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div className="text-2xl font-bold"></div>
//             <h1 className="text-3xl font-extrabold text-center flex-1">4M Change Procedure</h1>
//             <div className="text-sm space-y-1">
//               <div className="flex gap-2">
//                 <span className="font-semibold">Doc. No.:</span>
//                 <span>{headerInfo.docNo}</span>
//               </div>
//               <div className="flex gap-2">
//                 <span className="font-semibold">Rev. No.:</span>
//                 <span>{headerInfo.revNo}</span>
//               </div>
//               <div className="flex gap-2">
//                 <span className="font-semibold">Date:</span>
//                 <span>{headerInfo.date}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Process Information */}
//       <section className="max-w-7xl mx-auto px-4 py-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="p-4 bg-gray-50 rounded-md">
//               <strong className="text-gray-700">Process Name:</strong>
//               <p className="text-gray-900">{headerInfo.processName}</p>
//             </div>
//             <div className="p-4 bg-gray-50 rounded-md">
//               <strong className="text-gray-700">Purpose:</strong>
//               <p className="text-gray-900">{headerInfo.purpose}</p>
//             </div>
//             <div className="p-4 bg-gray-50 rounded-md">
//               <strong className="text-gray-700">Scope:</strong>
//               <p className="text-gray-900">{headerInfo.scope}</p>
//             </div>
//             <div className="p-4 bg-gray-50 rounded-md">
//               <strong className="text-gray-700">Process Owner:</strong>
//               <p className="text-gray-900">{headerInfo.processOwner}</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Action Buttons */}
//       <section className="max-w-7xl mx-auto px-4 py-4">
//         <div className="flex justify-end gap-4">
//           <button
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
//             onClick={() => setShowForm(!showForm)}
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//             </svg>
//             {showForm ? 'Cancel' : 'Add New Record'}
//           </button>
//           <button
//             className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
//             onClick={() => setRecords(demoData)}
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             Reset to Demo Data
//           </button>
//         </div>
//       </section>

//       {/* Add/Edit Form */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//               {editingIndex === -1 ? 'Add New Record' : 'Edit Record'}
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Record No.:</label>
//                 <input
//                   type="text"
//                   name="recordNo"
//                   value={formData.recordNo}
//                   onChange={handleInputChange}
//                   placeholder="e.g., MS-4M-WI-01"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Rev. No.:</label>
//                 <input
//                   type="text"
//                   name="revNo"
//                   value={formData.revNo}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 0.0"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Rev. Date:</label>
//                 <input
//                   type="date"
//                   name="revDate"
//                   value={formData.revDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Record Name:</label>
//                 <textarea
//                   name="recordName"
//                   value={formData.recordName}
//                   onChange={handleInputChange}
//                   placeholder="Enter record name"
//                   rows={3}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Retention Period:</label>
//                 <select
//                   name="retentionPeriod"
//                   value={formData.retentionPeriod}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 >
//                   <option value="">Select...</option>
//                   <option value="One Year">One Year</option>
//                   <option value="Up to tool life">Up to tool life</option>
//                   <option value="Daily">Daily</option>
//                   <option value="Custom">Custom</option>
//                 </select>
//                 {formData.retentionPeriod === 'Custom' && (
//                   <input
//                     type="text"
//                     name="customRetention"
//                     placeholder="Enter custom period"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setFormData((prev) => ({ ...prev, retentionPeriod: e.target.value }))
//                     }
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
//                   />
//                 )}
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Disposal Authority:</label>
//                 <input
//                   type="text"
//                   name="disposalAuthority"
//                   value={formData.disposalAuthority}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Head quality/Prod."
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Upload File (Optional):</label>
//                 <input
//                   type="file"
//                   name="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//                 {formData.file && (
//                   <div className="mt-2 p-2 bg-green-50 rounded-md text-sm">
//                     <span className="font-medium">{formData.file.name}</span>
//                     <span className="ml-2">({(formData.file.size / 1024).toFixed(2)} KB)</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
//                 onClick={handleAdd}
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//                 {editingIndex === -1 ? 'Add Record' : 'Update Record'}
//               </button>
//               <button
//                 className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
//                 onClick={handleCancel}
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Records Table */}
//       <section className="max-w-7xl mx-auto px-4 py-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-bold text-gray-800 mb-4">Master List of Formats and Records</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[800px] border-collapse">
//               <thead>
//                 <tr className="bg-blue-700 text-white">
//                   <th className="p-3 text-left">Sr. No.</th>
//                   <th className="p-3 text-left">Record No.</th>
//                   <th className="p-3 text-left">Rev. No.</th>
//                   <th className="p-3 text-left">Rev. Date</th>
//                   <th className="p-3 text-left">Record Name</th>
//                   <th className="p-3 text-left">Retention Period</th>
//                   <th className="p-3 text-left">Disposal Authority</th>
//                   <th className="p-3 text-left">File</th>
//                   <th className="p-3 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {records.map((record, index) => (
//                   <tr
//                     key={index}
//                     className={`border-b ${
//                       index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
//                     } hover:bg-blue-100 transition-colors duration-150`}
//                   >
//                     <td className="p-3">{record.srNo}</td>
//                     <td className="p-3">{record.recordNo}</td>
//                     <td className="p-3">{record.revNo}</td>
//                     <td className="p-3">{record.revDate}</td>
//                     <td className="p-3 max-w-xs break-words">{record.recordName}</td>
//                     <td className="p-3">{record.retentionPeriod}</td>
//                     <td className="p-3">{record.disposalAuthority}</td>
//                     <td className="p-3">
//                       {record.file && (
//                         <a
//                           href={URL.createObjectURL(record.file)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
//                           title="Open File"
//                         >
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 008.485 8.485l6.586-6.586"
//                             />
//                           </svg>
//                           {record.file.name}
//                         </a>
//                       )}
//                     </td>
//                     <td className="p-3 flex gap-2">
//                       <button
//                         className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
//                         onClick={() => handleEdit(index)}
//                         title="Edit"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                           />
//                         </svg>
//                       </button>
//                       <button
//                         className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
//                         onClick={() => handleDelete(index)}
//                         title="Delete"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0h4m-9 4h12"
//                           />
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="text-sm">
//               <strong>Prepared By:</strong> S.K Sharma
//             </div>
//             <div className="text-sm">
//               <strong>Approved By:</strong> _______________
//             </div>
//             <div className="text-sm">
//               <strong>Issued By:</strong> _______________
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default FourMChangeProcedure;




import React, { useState, useEffect } from 'react';

// Define the record interface
interface Record {
  srNo: number;
  recordNo: string;
  revNo: string;
  revDate: string;
  recordName: string;
  retentionPeriod: string;
  disposalAuthority: string;
  file: File | null;
}

// Demo Data with placeholder files
const demoData: Record[] = [
  {
    srNo: 1,
    recordNo: 'MS-4M-WI-01',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change identification sheet (Planned/unplanned)',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample1.pdf', { type: 'application/pdf' }),
  },
  {
    srNo: 2,
    recordNo: 'MS-4M-WI-01a',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: 'Handling of abnormal situation',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample2.doc', { type: 'application/msword' }),
  },
  {
    srNo: 3,
    recordNo: 'MS-4M-02',
    revNo: '0.0',
    revDate: '2017-03-25',
    recordName: 'List of break down',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: null,
  },
  {
    srNo: 4,
    recordNo: 'MS-4M-03',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change information flow sheet',
    retentionPeriod: 'Up to tool life',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample3.png', { type: 'image/png' }),
  },
  {
    srNo: 5,
    recordNo: 'MS-4M-04',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change identification tag',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: null,
  },
  {
    srNo: 6,
    recordNo: 'MS-4M-07',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M change traceability record sheet',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality/Prod.',
    file: new File(['sample content'], 'sample4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  },
  {
    srNo: 7,
    recordNo: 'MS-4M-06',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M Change inspection report',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality',
    file: null,
  },
  {
    srNo: 8,
    recordNo: 'MS-4M-05A',
    revNo: '0.0',
    revDate: '2017-04-10',
    recordName: '4M Change summary sheet',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Head quality',
    file: new File(['sample content'], 'sample5.jpg', { type: 'image/jpeg' }),
  },
  {
    srNo: 9,
    recordNo: 'MS-4M-05',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M Change record sheet',
    retentionPeriod: 'One Year',
    disposalAuthority: 'Quality Sup.',
    file: null,
  },
  {
    srNo: 10,
    recordNo: 'MS-4M-08',
    revNo: '0.0',
    revDate: '2017-04-01',
    recordName: '4M Change display board',
    retentionPeriod: 'Daily',
    disposalAuthority: 'Quality Sup.',
    file: new File(['sample content'], 'sample6.pdf', { type: 'application/pdf' }),
  },
];

// Header Info
const headerInfo = {
  docNo: 'MS/4M/PR/05',
  revNo: '28.02.20',
  date: '2020-02-28',
  processName: '4M Change Procedure',
  purpose: 'To implement the system for control the 4M (Man, Machine, Material, Method) changes in process',
  scope: 'Applicable to all manufacturing process',
  processOwner: 'Head quality & Production',
};

// Component
const FourMChangeProcedure: React.FC = () => {
  const [records, setRecords] = useState<Record[]>(demoData);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record>({
    srNo: 0,
    recordNo: '',
    revNo: '',
    revDate: '',
    recordName: '',
    retentionPeriod: '',
    disposalAuthority: '',
    file: null,
  });
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  useEffect(() => {
    const updatedRecords = records.map((record, index) => ({
      ...record,
      srNo: index + 1,
    }));
    setRecords(updatedRecords);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleAdd = () => {
    if (editingIndex === -1) {
      const newRecord: Record = {
        ...formData,
        srNo: records.length + 1,
      };
      setRecords([...records, newRecord]);
    } else {
      const updatedRecords = [...records];
      updatedRecords[editingIndex] = { ...formData, srNo: records[editingIndex].srNo };
      setRecords(updatedRecords);
      setEditingIndex(-1);
    }

    setFormData({
      srNo: 0,
      recordNo: '',
      revNo: '',
      revDate: '',
      recordName: '',
      retentionPeriod: '',
      disposalAuthority: '',
      file: null,
    });
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    const record = records[index];
    setFormData(record);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedRecords = records.filter((_, i) => i !== index);
      setRecords(updatedRecords);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(-1);
    setFormData({
      srNo: 0,
      recordNo: '',
      revNo: '',
      revDate: '',
      recordName: '',
      retentionPeriod: '',
      disposalAuthority: '',
      file: null,
    });
  };

  return (
    <div className="max-w-full p-6 ">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-800">4M Change Procedure</h1>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-700">
            <div>
              <span className="font-medium">Doc. No.:</span> {headerInfo.docNo}
            </div>
            <div>
              <span className="font-medium">Rev. No.:</span> {headerInfo.revNo}
            </div>
            <div>
              <span className="font-medium">Date:</span> {headerInfo.date}
            </div>
          </div>
        </div>

        {/* Process Information */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <h2 className="text-xl font-semibold">Process Information</h2>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Process Name:</span>
                <p className="text-gray-900">{headerInfo.processName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Purpose:</span>
                <p className="text-gray-900">{headerInfo.purpose}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Scope:</span>
                <p className="text-gray-900">{headerInfo.scope}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Process Owner:</span>
                <p className="text-gray-900">{headerInfo.processOwner}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons and Records Table */}
        {showForm ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingIndex === -1 ? 'Add New Record' : 'Edit Record'}
              </h2>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
              >
                Back to List
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Record No.</label>
                  <input
                    type="text"
                    name="recordNo"
                    value={formData.recordNo}
                    onChange={handleInputChange}
                    placeholder="e.g., MS-4M-WI-01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rev. No.</label>
                  <input
                    type="text"
                    name="revNo"
                    value={formData.revNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rev. Date</label>
                  <input
                    type="date"
                    name="revDate"
                    value={formData.revDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Record Name</label>
                  <textarea
                    name="recordName"
                    value={formData.recordName}
                    onChange={handleInputChange}
                    placeholder="Enter record name"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period</label>
                  <select
                    name="retentionPeriod"
                    value={formData.retentionPeriod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="One Year">One Year</option>
                    <option value="Up to tool life">Up to tool life</option>
                    <option value="Daily">Daily</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {formData.retentionPeriod === 'Custom' && (
                    <input
                      type="text"
                      name="customRetention"
                      placeholder="Enter custom period"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => ({ ...prev, retentionPeriod: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disposal Authority</label>
                  <input
                    type="text"
                    name="disposalAuthority"
                    value={formData.disposalAuthority}
                    onChange={handleInputChange}
                    placeholder="e.g., Head quality/Prod."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (Optional)</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  {formData.file && (
                    <div className="mt-2 p-2 bg-green-50 rounded-md text-sm">
                      <span className="font-medium">{formData.file.name}</span>
                      <span className="ml-2">({(formData.file.size / 1024).toFixed(2)} KB)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingIndex === -1 ? 'Add Record' : 'Update Record'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">Master List of Formats and Records</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                >
                  Add New Record
                </button>
                <button
                  onClick={() => setRecords(demoData)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
                >
                  Reset to Demo Data
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rev. No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rev. Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disposal Authority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.srNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.recordNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.revNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.revDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs break-words">{record.recordName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.retentionPeriod}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.disposalAuthority}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.file && (
                            <a
                              href={URL.createObjectURL(record.file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                              {record.file.name}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(index)}
                              className="px-2 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-6">
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="font-medium text-gray-700">Prepared By:</span> S.K Sharma
              </div>
              <div>
                <span className="font-medium text-gray-700">Approved By:</span> _______________
              </div>
              <div>
                <span className="font-medium text-gray-700">Issued By:</span> _______________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourMChangeProcedure;