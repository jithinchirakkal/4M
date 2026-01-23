

// import React, { useState, useEffect } from 'react';
// import { Check, Save, Plus, RefreshCw, Trash2, Search, ArrowLeft } from 'lucide-react';
// import axios from 'axios';

// interface MatrixRowBase {
//   operator: string;
//   blanking: boolean;
//   bending: boolean;
//   punching: boolean;
//   draw: boolean;
//   trimming: boolean;
//   mig_welding: boolean;
//   tig_welding: boolean;
//   projection_welding: boolean;
//   remarks: string;
//   prepared_by: string;
//   approved_by: string;
// }

// interface MatrixRow extends MatrixRowBase {
//   id?: number;
//   sl_no: number;
//   created_at: string;
// }

// const ManMachineMatrix: React.FC = () => {
//   const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
//   const [matrixData, setMatrixData] = useState<MatrixRow[]>([]);
//   const [formData, setFormData] = useState<MatrixRowBase[]>([
//     {
//       operator: '',
//       blanking: false,
//       bending: false,
//       punching: false,
//       draw: false,
//       trimming: false,
//       mig_welding: false,
//       tig_welding: false,
//       projection_welding: false,
//       remarks: '',
//       prepared_by: '',
//       approved_by: '',
//     },
//   ]);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const api = axios.create({
//     baseURL: 'http://localhost:8000/api/',
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('matrix/');
//         setMatrixData(response.data.sort((a: MatrixRow, b: MatrixRow) => a.sl_no - b.sl_no));
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       }
//     };
//     fetchData();
//   }, [viewMode]);

//   const addRow = () => {
//     setFormData([
//       ...formData,
//       {
//         operator: '',
//         blanking: false,
//         bending: false,
//         punching: false,
//         draw: false,
//         trimming: false,
//         mig_welding: false,
//         tig_welding: false,
//         projection_welding: false,
//         remarks: '',
//         prepared_by: '',
//         approved_by: '',
//       },
//     ]);
//   };

//   const removeRow = (index: number) => {
//     if (formData.length <= 1) return;
//     const newData = [...formData];
//     newData.splice(index, 1);
//     setFormData(newData);
//   };

//   const handleCheckboxChange = (rowIndex: number, field: keyof MatrixRowBase) => {
//     const newData = [...formData];
//     newData[rowIndex] = {
//       ...newData[rowIndex],
//       [field]: !newData[rowIndex][field],
//     };
//     setFormData(newData);
//   };

//   const handleInputChange = (rowIndex: number, field: keyof MatrixRowBase, value: string) => {
//     const newData = [...formData];
//     newData[rowIndex] = {
//       ...newData[rowIndex],
//       [field]: value,
//     };
//     setFormData(newData);
//   };

//   const resetForm = () => {
//     setFormData([
//       {
//         operator: '',
//         blanking: false,
//         bending: false,
//         punching: false,
//         draw: false,
//         trimming: false,
//         mig_welding: false,
//         tig_welding: false,
//         projection_welding: false,
//         remarks: '',
//         prepared_by: '',
//         approved_by: '',
//       },
//     ]);
//     setEditingId(null);
//     setViewMode('view');
//   };

//   const saveMatrix = async () => {
//     setIsLoading(true);
//     try {
//       if (formData.some((row) => !row.operator.trim())) {
//         alert('Please fill in all operator names');
//         return;
//       }

//       if (formData.some((row) => !row.prepared_by.trim() || !row.approved_by.trim())) {
//         alert('Please fill in both Prepared By and Approved By fields for all rows');
//         return;
//       }

//       if (editingId !== null) {
//         await api.put(`matrix/${editingId}/`, formData[0]);
//         setMatrixData((prev) =>
//           prev.map((row) =>
//             row.id === editingId
//               ? { ...formData[0], id: editingId, sl_no: row.sl_no, created_at: row.created_at }
//               : row
//           )
//         );
//       } else {
//         const response = await api.post('matrix/', formData);
//         setMatrixData((prev) => [...prev, ...response.data].sort((a, b) => a.sl_no - b.sl_no));
//       }
//       setViewMode('view');
//       setEditingId(null);
//       resetForm();
//       alert('Matrix saved successfully!');
//     } catch (err) {
//       console.error('Failed to save matrix', err);
//       alert('Failed to save matrix. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (id: number) => {
//     const row = matrixData.find((row) => row.id === id);
//     if (row) {
//       setFormData([
//         {
//           operator: row.operator,
//           blanking: row.blanking,
//           bending: row.bending,
//           punching: row.punching,
//           draw: row.draw,
//           trimming: row.trimming,
//           mig_welding: row.mig_welding,
//           tig_welding: row.tig_welding,
//           projection_welding: row.projection_welding,
//           remarks: row.remarks,
//           prepared_by: row.prepared_by,
//           approved_by: row.approved_by,
//         },
//       ]);
//       setEditingId(id);
//       setViewMode('edit');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       try {
//         await api.delete(`matrix/${id}/`);
//         setMatrixData((prev) => prev.filter((row) => row.id !== id));
//         alert('Record deleted successfully!');
//       } catch (err) {
//         console.error('Failed to delete record', err);
//         alert('Failed to delete record. Please try again.');
//       }
//     }
//   };

//   const operations = [
//     { id: 'blanking', label: 'BLANKING', key: 'blanking' as const },
//     { id: 'bending', label: 'BENDING', key: 'bending' as const },
//     { id: 'punching', label: 'PUNCHING', key: 'punching' as const },
//     { id: 'draw', label: 'DRAW', key: 'draw' as const },
//     { id: 'trimming', label: 'TRIMMING', key: 'trimming' as const },
//     { id: 'mig_welding', label: 'MIG', key: 'mig_welding' as const },
//     { id: 'tig_welding', label: 'TIG', key: 'tig_welding' as const },
//     { id: 'projection_welding', label: 'PROJECTION', key: 'projection_welding' as const },
//   ];

//   const filteredData = matrixData.filter(
//     (item) =>
//       item.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.remarks.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="max-w-full  py-8 px-2 md:px-8">
//       <div className="max-w-full  mx-auto">
//         <div className="mb-8 text-center">
//           <div className="flex justify-center items-center mb-4">
//             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h1 className="text-3xl font-bold text-blue-800">Man Machine Matrix</h1>
//           </div>
//           {/* <div className="bg-white shadow rounded-md p-4 inline-block">
//             <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
//               <div>
//                 <span className="font-medium">DOC. NO.</span>
//                 <p>MSF-QA-11</p>
//               </div>
//               <div>
//                 <span className="font-medium">REVISION NO.</span>
//                 <p>00</p>
//               </div>
//               <div>
//                 <span className="font-medium">DATE</span>
//                 <p>05.04.18</p>
//               </div>
//             </div>
//           </div> */}
//         </div>

//         {viewMode === 'view' ? (
//           <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700  px-6 py-4 text-white flex justify-between items-center">
//               <h2 className="text-xl font-semibold">Operator Skills Matrix</h2>
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setViewMode('edit');
//                 }}
//                 className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center space-x-2"
//               >
//                 <Plus size={18} />
//                 <span>Add New Matrix</span>
//               </button>
//             </div>
//             <div className="p-6">
//               <div className="flex justify-end mb-4">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search operator or remarks"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   />
//                 </div>
//               </div>
//               {matrixData.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           S.NO
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           OPERATOR
//                         </th>
//                         {operations.map((op) => (
//                           <th
//                             key={op.id}
//                             className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                             {op.label}
//                           </th>
//                         ))}
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           REMARKS
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           DATE
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           ACTIONS
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {filteredData.length > 0 ? (
//                         filteredData.map((row) => (
//                           <tr key={row.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {row.sl_no}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                               {row.operator}
//                             </td>
//                             {operations.map((op) => (
//                               <td key={op.id} className="px-3 py-4 text-center">
//                                 {row[op.key] ? (
//                                   <Check size={16} className="text-green-600 mx-auto" />
//                                 ) : (
//                                   <span className="text-gray-400">-</span>
//                                 )}
//                               </td>
//                             ))}
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                               {row.remarks || '-'}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                               {new Date(row.created_at).toLocaleDateString('en-GB')}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                               <div className="flex space-x-2">
//                                 <button
//                                   onClick={() => handleEdit(row.id!)}
//                                   className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => handleDelete(row.id!)}
//                                   className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={operations.length + 5}
//                             className="px-6 py-8 text-center text-gray-500"
//                           >
//                             No matching records found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Search size={24} className="text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     No Matrix Data Available
//                   </h3>
//                   <p className="text-gray-600 mb-6">
//                     Get started by creating your first operator matrix
//                   </p>
//                   <button
//                     onClick={() => {
//                       resetForm();
//                       setViewMode('edit');
//                     }}
//                     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center space-x-2 mx-auto"
//                   >
//                     <Plus size={18} />
//                     <span>Create New Matrix</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
//               <h2 className="text-xl font-semibold">
//                 {editingId ? 'Edit Operator Matrix' : 'Add New Operator Matrix'}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium flex items-center space-x-2"
//               >
//                 <ArrowLeft size={18} />
//                 <span>Back to List</span>
//               </button>
//             </div>
//             <div className="p-6 bg-gray-50 border-b border-gray-200">
//               <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-md inline-block mb-6">
//                 <span className="font-medium">{formData.length}</span> operator
//                 {formData.length > 1 ? 's' : ''} in form
//               </div>
//               <div className="space-y-6">
//                 {formData.map((row, index) => (
//                   <div key={index} className="border p-4 rounded-md bg-white">
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         Operator #{index + 1}
//                       </h3>
//                       <button
//                         onClick={() => removeRow(index)}
//                         disabled={formData.length === 1}
//                         className={`p-2 rounded-md ${
//                           formData.length === 1
//                             ? 'text-gray-300 cursor-not-allowed'
//                             : 'text-gray-600 hover:bg-gray-100'
//                         }`}
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Operator Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           value={row.operator}
//                           onChange={(e) => handleInputChange(index, 'operator', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                           placeholder="Enter operator name"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Remarks
//                         </label>
//                         <input
//                           type="text"
//                           value={row.remarks}
//                           onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                           placeholder="Enter remarks (optional)"
//                         />
//                       </div>
//                     </div>
//                     <div className="mb-6">
//                       <h4 className="text-sm font-medium text-gray-700 mb-4">
//                         Operations Capabilities
//                       </h4>
//                       <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                           {operations.map((op) => (
//                             <div
//                               key={op.id}
//                               className="flex items-center space-x-2 p-2 bg-white rounded-md border border-gray-200"
//                             >
//                               <input
//                                 type="checkbox"
//                                 id={`${index}-${op.id}`}
//                                 checked={row[op.key]}
//                                 onChange={() => handleCheckboxChange(index, op.key)}
//                                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                               />
//                               <label
//                                 htmlFor={`${index}-${op.id}`}
//                                 className="text-sm text-gray-700"
//                               >
//                                 {op.label}
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-600 text-center">
//                       <span className="font-medium">Legend: </span>
//                       <span className="inline-flex items-center">
//                         <Check size={12} className="text-blue-600 mr-1" /> = Can perform operation
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="flex justify-center">
//                   <button
//                     onClick={addRow}
//                     className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-300 hover:bg-blue-100 text-sm font-medium flex items-center space-x-2"
//                   >
//                     <Plus size={18} />
//                     <span>Add Another Operator</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 bg-gray-50 border-t border-gray-200">
//               <h4 className="text-lg font-semibold text-gray-900 mb-4">Authorization</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Prepared By <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData[0].prepared_by}
//                     onChange={(e) => handleInputChange(0, 'prepared_by', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     placeholder="Enter name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Approved By <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData[0].approved_by}
//                     onChange={(e) => handleInputChange(0, 'approved_by', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     placeholder="Enter name"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={resetForm}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <RefreshCw size={16} className="inline mr-1" />
//                   Reset Form
//                 </button>
//                 <button
//                   onClick={saveMatrix}
//                   disabled={isLoading}
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
//                 >
//                   <Save size={16} className="inline mr-1" />
//                   {isLoading ? 'Saving...' : 'Save Matrix'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManMachineMatrix;



// import React, { useState, useEffect } from 'react';
// import { 
//   Check, 
//   Save, 
//   Plus, 
//   RefreshCw, 
//   Trash2, 
//   Search, 
//   ArrowLeft, 
//   X, 
//   CheckCircle, 
//   AlertCircle,
//   User,
//   Settings,
//   Edit2,
//   Eye
// } from 'lucide-react';
// import axios from 'axios';

// interface MatrixRowBase {
//   operator: string;
//   blanking: boolean;
//   bending: boolean;
//   punching: boolean;
//   draw: boolean;
//   trimming: boolean;
//   mig_welding: boolean;
//   tig_welding: boolean;
//   projection_welding: boolean;
//   remarks: string;
//   prepared_by: string;
//   approved_by: string;
// }

// interface MatrixRow extends MatrixRowBase {
//   id?: number;
//   sl_no: number;
//   created_at: string;
// }

// interface ToastProps {
//   message: string;
//   type: 'success' | 'error' | 'info';
//   onClose: () => void;
// }

// interface ConfirmModalProps {
//   isOpen: boolean;
//   title: string;
//   message: string;
//   onConfirm: () => void;
//   onCancel: () => void;
//   type?: 'danger' | 'warning' | 'info';
// }

// // Toast Notification Component
// const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 4000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
//   const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : AlertCircle;

//   return (
//     <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 animate-slide-in`}>
//       <Icon size={24} />
//       <span className="font-medium">{message}</span>
//       <button onClick={onClose} className="ml-4 hover:bg-white/20 rounded-full p-1">
//         <X size={18} />
//       </button>
//     </div>
//   );
// };

// // Confirmation Modal Component
// const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel, type = 'warning' }) => {
//   if (!isOpen) return null;

//   const colors = {
//     danger: { bg: 'bg-red-100', text: 'text-red-600', btn: 'bg-red-600 hover:bg-red-700' },
//     warning: { bg: 'bg-yellow-100', text: 'text-yellow-600', btn: 'bg-yellow-600 hover:bg-yellow-700' },
//     info: { bg: 'bg-blue-100', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' },
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
//         <div className={`${colors[type].bg} px-6 py-4`}>
//           <h3 className={`text-xl font-bold ${colors[type].text}`}>{title}</h3>
//         </div>
//         <div className="px-6 py-6">
//           <p className="text-gray-700 text-lg">{message}</p>
//         </div>
//         <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
//           <button
//             onClick={onCancel}
//             className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className={`px-5 py-2.5 ${colors[type].btn} text-white rounded-lg font-medium transition-colors`}
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Success Modal Component
// const SuccessModal: React.FC<{ isOpen: boolean; message: string; onClose: () => void }> = ({ isOpen, message, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in text-center">
//         <div className="px-8 py-10">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <CheckCircle size={48} className="text-green-500" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-3">Success!</h3>
//           <p className="text-gray-600 text-lg mb-8">{message}</p>
//           <button
//             onClick={onClose}
//             className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Machine/Operation Card Component
// const OperationCard: React.FC<{
//   operation: { id: string; label: string; key: keyof MatrixRowBase; icon: string };
//   checked: boolean;
//   onChange: () => void;
//   disabled?: boolean;
// }> = ({ operation, checked, onChange, disabled }) => {
//   return (
//     <div
//       onClick={!disabled ? onChange : undefined}
//       className={`
//         relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
//         ${checked 
//           ? 'border-blue-500 bg-blue-50 shadow-md' 
//           : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
//         }
//         ${disabled ? 'cursor-not-allowed opacity-60' : ''}
//       `}
//     >
//       <div className="flex flex-col items-center space-y-2">
//         <div className={`
//           w-12 h-12 rounded-full flex items-center justify-center text-2xl
//           ${checked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}
//         `}>
//           {operation.icon}
//         </div>
//         <span className={`text-sm font-semibold text-center ${checked ? 'text-blue-700' : 'text-gray-700'}`}>
//           {operation.label}
//         </span>
//         {checked && (
//           <div className="absolute top-2 right-2">
//             <Check size={18} className="text-blue-600" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Skill Badge Component for View Mode
// const SkillBadge: React.FC<{ active: boolean; label: string }> = ({ active, label }) => {
//   return (
//     <span className={`
//       inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
//       ${active 
//         ? 'bg-green-100 text-green-800 border border-green-300' 
//         : 'bg-gray-100 text-gray-500 border border-gray-200'
//       }
//     `}>
//       {active && <Check size={12} className="mr-1" />}
//       {label}
//     </span>
//   );
// };

// const ManMachineMatrix: React.FC = () => {
//   const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
//   const [matrixData, setMatrixData] = useState<MatrixRow[]>([]);
//   const [formData, setFormData] = useState<MatrixRowBase[]>([createEmptyRow()]);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Modal states
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
//   const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
//   const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

//   function createEmptyRow(): MatrixRowBase {
//     return {
//       operator: '',
//       blanking: false,
//       bending: false,
//       punching: false,
//       draw: false,
//       trimming: false,
//       mig_welding: false,
//       tig_welding: false,
//       projection_welding: false,
//       remarks: '',
//       prepared_by: '',
//       approved_by: '',
//     };
//   }

//   const api = axios.create({
//     baseURL: 'http://localhost:8000/api/',
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('matrix/');
//         setMatrixData(response.data.sort((a: MatrixRow, b: MatrixRow) => a.sl_no - b.sl_no));
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setToast({ message: 'Failed to load data. Please refresh the page.', type: 'error' });
//       }
//     };
//     fetchData();
//   }, [viewMode]);

//   const operations = [
//     { id: 'blanking', label: 'BLANKING', key: 'blanking' as const, icon: '⚙️' },
//     { id: 'bending', label: 'BENDING', key: 'bending' as const, icon: '🔧' },
//     { id: 'punching', label: 'PUNCHING', key: 'punching' as const, icon: '🔨' },
//     { id: 'draw', label: 'DRAW', key: 'draw' as const, icon: '📐' },
//     { id: 'trimming', label: 'TRIMMING', key: 'trimming' as const, icon: '✂️' },
//     { id: 'mig_welding', label: 'MIG WELDING', key: 'mig_welding' as const, icon: '🔥' },
//     { id: 'tig_welding', label: 'TIG WELDING', key: 'tig_welding' as const, icon: '⚡' },
//     { id: 'projection_welding', label: 'PROJECTION WELDING', key: 'projection_welding' as const, icon: '💥' },
//   ];

//   const addRow = () => {
//     setFormData([...formData, createEmptyRow()]);
//   };

//   const removeRow = (index: number) => {
//     if (formData.length <= 1) return;
//     const newData = [...formData];
//     newData.splice(index, 1);
//     setFormData(newData);
//   };

//   const handleCheckboxChange = (rowIndex: number, field: keyof MatrixRowBase) => {
//     const newData = [...formData];
//     newData[rowIndex] = {
//       ...newData[rowIndex],
//       [field]: !newData[rowIndex][field],
//     };
//     setFormData(newData);
//   };

//   const handleInputChange = (rowIndex: number, field: keyof MatrixRowBase, value: string) => {
//     const newData = [...formData];
//     newData[rowIndex] = {
//       ...newData[rowIndex],
//       [field]: value,
//     };
//     setFormData(newData);
//   };

//   const resetForm = () => {
//     setFormData([createEmptyRow()]);
//     setEditingId(null);
//     setViewMode('view');
//   };

//   const validateForm = (): string | null => {
//     for (let i = 0; i < formData.length; i++) {
//       if (!formData[i].operator.trim()) {
//         return `Please enter the operator name for Operator #${i + 1}`;
//       }
      
//       const hasAnyOperation = operations.some(op => formData[i][op.key]);
//       if (!hasAnyOperation) {
//         return `Please select at least one machine/operation for ${formData[i].operator || `Operator #${i + 1}`}`;
//       }
//     }
    
//     if (!formData[0].prepared_by.trim()) {
//       return 'Please enter the "Prepared By" name';
//     }
    
//     if (!formData[0].approved_by.trim()) {
//       return 'Please enter the "Approved By" name';
//     }
    
//     return null;
//   };

//   const saveMatrix = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setToast({ message: validationError, type: 'error' });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Ensure all rows have the same prepared_by and approved_by
//       const dataToSend = formData.map(row => ({
//         ...row,
//         prepared_by: formData[0].prepared_by,
//         approved_by: formData[0].approved_by,
//       }));

//       if (editingId !== null) {
//         await api.put(`matrix/${editingId}/`, dataToSend[0]);
//         setMatrixData((prev) =>
//           prev.map((row) =>
//             row.id === editingId
//               ? { ...dataToSend[0], id: editingId, sl_no: row.sl_no, created_at: row.created_at }
//               : row
//           )
//         );
//         setSuccessModal({ isOpen: true, message: 'Operator matrix has been updated successfully!' });
//       } else {
//         const response = await api.post('matrix/', dataToSend);
//         setMatrixData((prev) => [...prev, ...response.data].sort((a, b) => a.sl_no - b.sl_no));
//         setSuccessModal({ 
//           isOpen: true, 
//           message: `${formData.length} operator${formData.length > 1 ? 's' : ''} added to the matrix successfully!` 
//         });
//       }
      
//       setEditingId(null);
//       setFormData([createEmptyRow()]);
//     } catch (err) {
//       console.error('Failed to save matrix', err);
//       setToast({ message: 'Failed to save matrix. Please try again.', type: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (id: number) => {
//     const row = matrixData.find((row) => row.id === id);
//     if (row) {
//       setFormData([
//         {
//           operator: row.operator,
//           blanking: row.blanking,
//           bending: row.bending,
//           punching: row.punching,
//           draw: row.draw,
//           trimming: row.trimming,
//           mig_welding: row.mig_welding,
//           tig_welding: row.tig_welding,
//           projection_welding: row.projection_welding,
//           remarks: row.remarks,
//           prepared_by: row.prepared_by,
//           approved_by: row.approved_by,
//         },
//       ]);
//       setEditingId(id);
//       setViewMode('edit');
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     if (confirmModal.id === null) return;
    
//     try {
//       await api.delete(`matrix/${confirmModal.id}/`);
//       setMatrixData((prev) => prev.filter((row) => row.id !== confirmModal.id));
//       setToast({ message: 'Record deleted successfully!', type: 'success' });
//     } catch (err) {
//       console.error('Failed to delete record', err);
//       setToast({ message: 'Failed to delete record. Please try again.', type: 'error' });
//     } finally {
//       setConfirmModal({ isOpen: false, id: null });
//     }
//   };

//   const getOperatorSkillCount = (row: MatrixRow) => {
//     return operations.filter(op => row[op.key]).length;
//   };

//   const filteredData = matrixData.filter(
//     (item) =>
//       item.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.remarks.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 md:px-8">
//       {/* Toast Notification */}
//       {toast && (
//         <Toast 
//           message={toast.message} 
//           type={toast.type} 
//           onClose={() => setToast(null)} 
//         />
//       )}

//       {/* Confirm Modal */}
//       <ConfirmModal
//         isOpen={confirmModal.isOpen}
//         title="Delete Record"
//         message="Are you sure you want to delete this operator from the matrix? This action cannot be undone."
//         onConfirm={handleDeleteConfirm}
//         onCancel={() => setConfirmModal({ isOpen: false, id: null })}
//         type="danger"
//       />

//       {/* Success Modal */}
//       <SuccessModal
//         isOpen={successModal.isOpen}
//         message={successModal.message}
//         onClose={() => {
//           setSuccessModal({ isOpen: false, message: '' });
//           setViewMode('view');
//         }}
//       />

//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="flex items-center">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
//                 <Settings className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Man Machine Matrix</h1>
//                 <p className="text-gray-600 mt-1">Manage operator skills and machine capabilities</p>
//               </div>
//             </div>
            
//             {viewMode === 'view' && (
//               <div className="flex items-center gap-3">
//                 <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
//                   <span className="text-sm text-gray-500">Total Operators: </span>
//                   <span className="text-lg font-bold text-blue-600">{matrixData.length}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {viewMode === 'view' ? (
//           /* VIEW MODE */
//           <div className="space-y-6">
//             {/* Action Bar */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div className="relative flex-1 max-w-md">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Search size={20} className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search by operator name or remarks..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   />
//                 </div>
//                 <button
//                   onClick={() => {
//                     resetForm();
//                     setViewMode('edit');
//                   }}
//                   className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
//                 >
//                   <Plus size={20} />
//                   <span>Add New Operator</span>
//                 </button>
//               </div>
//             </div>

//             {/* Data Grid */}
//             {matrixData.length > 0 ? (
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {filteredData.length > 0 ? (
//                   filteredData.map((row) => (
//                     <div key={row.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//                       {/* Operator Header */}
//                       <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
//                         <div className="flex justify-between items-start">
//                           <div className="flex items-center">
//                             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
//                               <User className="w-6 h-6 text-blue-600" />
//                             </div>
//                             <div>
//                               <h3 className="text-lg font-bold text-gray-900">{row.operator}</h3>
//                               <p className="text-sm text-gray-500">
//                                 S.No: {row.sl_no} • Added: {new Date(row.created_at).toLocaleDateString('en-GB')}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => handleEdit(row.id!)}
//                               className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               title="Edit"
//                             >
//                               <Edit2 size={18} />
//                             </button>
//                             <button
//                               onClick={() => setConfirmModal({ isOpen: true, id: row.id! })}
//                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                               title="Delete"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Skills Section */}
//                       <div className="px-6 py-4">
//                         <div className="flex items-center justify-between mb-3">
//                           <h4 className="text-sm font-semibold text-gray-700">Machine Capabilities</h4>
//                           <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
//                             {getOperatorSkillCount(row)}/{operations.length} Skills
//                           </span>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {operations.map((op) => (
//                             <SkillBadge 
//                               key={op.id} 
//                               active={row[op.key]} 
//                               label={op.label} 
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       {/* Footer */}
//                       {row.remarks && (
//                         <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-100">
//                           <p className="text-sm text-yellow-800">
//                             <span className="font-medium">Remarks:</span> {row.remarks}
//                           </p>
//                         </div>
//                       )}

//                       <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
//                         <div className="flex justify-between text-xs text-gray-500">
//                           <span>Prepared by: <span className="font-medium text-gray-700">{row.prepared_by}</span></span>
//                           <span>Approved by: <span className="font-medium text-gray-700">{row.approved_by}</span></span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//                     <Search size={48} className="text-gray-300 mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold text-gray-700">No matching records found</h3>
//                     <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               /* Empty State */
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//                 <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Settings size={40} className="text-blue-500" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">No Operators Added Yet</h3>
//                 <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                   Start by adding operators and mapping their machine capabilities to create your man-machine matrix.
//                 </p>
//                 <button
//                   onClick={() => {
//                     resetForm();
//                     setViewMode('edit');
//                   }}
//                   className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium inline-flex items-center space-x-2 shadow-md"
//                 >
//                   <Plus size={20} />
//                   <span>Add First Operator</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           /* EDIT MODE */
//           <div className="space-y-6">
//             {/* Back Button */}
//             <button
//               onClick={resetForm}
//               className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft size={20} className="mr-2" />
//               <span className="font-medium">Back to Matrix View</span>
//             </button>

//             {/* Form Header */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     {editingId ? 'Edit Operator' : 'Add New Operator(s)'}
//                   </h2>
//                   <p className="text-gray-600 mt-1">
//                     {editingId 
//                       ? 'Update the operator information and machine capabilities' 
//                       : 'Define which machines each operator can operate'
//                     }
//                   </p>
//                 </div>
//                 <div className="bg-blue-100 px-4 py-2 rounded-lg">
//                   <span className="text-sm text-blue-600 font-medium">
//                     {formData.length} Operator{formData.length > 1 ? 's' : ''} in Form
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Operator Cards */}
//             <div className="space-y-6">
//               {formData.map((row, index) => (
//                 <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                   {/* Card Header */}
//                   <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center text-white">
//                         <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
//                           <User size={20} />
//                         </div>
//                         <h3 className="text-lg font-semibold">
//                           {row.operator || `Operator #${index + 1}`}
//                         </h3>
//                       </div>
//                       {formData.length > 1 && (
//                         <button
//                           onClick={() => removeRow(index)}
//                           className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Operator Info */}
//                   <div className="p-6 border-b border-gray-200">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Operator Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           value={row.operator}
//                           onChange={(e) => handleInputChange(index, 'operator', e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
//                           placeholder="Enter operator's full name"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Remarks <span className="text-gray-400">(Optional)</span>
//                         </label>
//                         <input
//                           type="text"
//                           value={row.remarks}
//                           onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
//                           placeholder="Any additional notes"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Machine Selection */}
//                   <div className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <div>
//                         <h4 className="text-lg font-semibold text-gray-900">Select Machine Capabilities</h4>
//                         <p className="text-sm text-gray-500 mt-1">Click on the machines this operator can operate</p>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Selected: <span className="font-bold text-blue-600">
//                           {operations.filter(op => row[op.key]).length}
//                         </span> / {operations.length}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                       {operations.map((op) => (
//                         <OperationCard
//                           key={op.id}
//                           operation={op}
//                           checked={row[op.key] as boolean}
//                           onChange={() => handleCheckboxChange(index, op.key)}
//                         />
//                       ))}
//                     </div>

//                     {/* Visual Legend */}
//                     <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <div className="flex items-center justify-center gap-6 text-sm">
//                         <div className="flex items-center">
//                           <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
//                             <Check size={14} className="text-white" />
//                           </div>
//                           <span className="text-gray-600">Can operate</span>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="w-6 h-6 bg-gray-100 rounded-lg border border-gray-300 mr-2"></div>
//                           <span className="text-gray-600">Cannot operate</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Add More Button */}
//             {!editingId && (
//               <div className="flex justify-center">
//                 <button
//                   onClick={addRow}
//                   className="px-6 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium flex items-center space-x-2 hover:border-blue-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Plus size={20} />
//                   <span>Add Another Operator</span>
//                 </button>
//               </div>
//             )}

//             {/* Authorization Section */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <h4 className="text-lg font-semibold text-gray-900">Authorization</h4>
//                 <p className="text-sm text-gray-500 mt-1">These details will be applied to all operators in this submission</p>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Prepared By <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData[0].prepared_by}
//                       onChange={(e) => handleInputChange(0, 'prepared_by', e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
//                       placeholder="Enter name of person preparing this document"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Approved By <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData[0].approved_by}
//                       onChange={(e) => handleInputChange(0, 'approved_by', e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
//                       placeholder="Enter name of approving authority"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//               <div className="flex flex-col sm:flex-row justify-end gap-4">
//                 <button
//                   onClick={resetForm}
//                   className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
//                 >
//                   <RefreshCw size={18} />
//                   <span>Reset Form</span>
//                 </button>
//                 <button
//                   onClick={saveMatrix}
//                   disabled={isLoading}
//                   className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <>
//                       <RefreshCw size={18} className="animate-spin" />
//                       <span>Saving...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Save size={18} />
//                       <span>{editingId ? 'Update Operator' : 'Save All Operators'}</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Custom CSS for animations */}
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
        
//         @keyframes scale-in {
//           from {
//             transform: scale(0.9);
//             opacity: 0;
//           }
//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
        
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
        
//         .animate-scale-in {
//           animation: scale-in 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ManMachineMatrix;



import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  Save,
  Plus,
  RefreshCw,
  Trash2,
  Search,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  Edit2,
  LayoutGrid,
  List,
  BarChart3,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  Eye,
  Users,
  Wrench,
  Award,
  TrendingUp,
  Calendar,
  MoreVertical,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

// ============== TYPES ==============
interface MatrixRowBase {
  operator: string;
  blanking: boolean;
  bending: boolean;
  punching: boolean;
  draw: boolean;
  trimming: boolean;
  mig_welding: boolean;
  tig_welding: boolean;
  projection_welding: boolean;
  remarks: string;
  prepared_by: string;
  approved_by: string;
}

interface MatrixRow extends MatrixRowBase {
  id?: number;
  sl_no: number;
  created_at: string;
}

type ViewType = 'cards' | 'table' | 'compact';
type SortField = 'name' | 'date' | 'skills' | 'sl_no';
type SortOrder = 'asc' | 'desc';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface Operation {
  id: string;
  label: string;
  key: keyof MatrixRowBase;
  icon: string;
  description: string;
}

// ============== CONSTANTS ==============
const OPERATIONS: Operation[] = [
  { id: 'blanking', label: 'BLANKING', key: 'blanking', icon: '⚙️', description: 'Sheet metal blanking' },
  { id: 'bending', label: 'BENDING', key: 'bending', icon: '🔧', description: 'Metal bending' },
  { id: 'punching', label: 'PUNCHING', key: 'punching', icon: '🔨', description: 'Punch press' },
  { id: 'draw', label: 'DRAW', key: 'draw', icon: '📐', description: 'Deep drawing' },
  { id: 'trimming', label: 'TRIMMING', key: 'trimming', icon: '✂️', description: 'Edge trimming' },
  { id: 'mig_welding', label: 'MIG WELDING', key: 'mig_welding', icon: '🔥', description: 'MIG welding' },
  { id: 'tig_welding', label: 'TIG WELDING', key: 'tig_welding', icon: '⚡', description: 'TIG welding' },
  { id: 'projection_welding', label: 'PROJECTION', key: 'projection_welding', icon: '💥', description: 'Projection welding' },
];

// ============== HELPER FUNCTIONS ==============
const createEmptyRow = (): MatrixRowBase => ({
  operator: '',
  blanking: false,
  bending: false,
  punching: false,
  draw: false,
  trimming: false,
  mig_welding: false,
  tig_welding: false,
  projection_welding: false,
  remarks: '',
  prepared_by: '',
  approved_by: '',
});

const getSkillCount = (row: MatrixRow | MatrixRowBase): number =>
  OPERATIONS.filter(op => row[op.key] === true).length;

const getSkillPercentage = (row: MatrixRow | MatrixRowBase): number =>
  Math.round((getSkillCount(row) / OPERATIONS.length) * 100);

const getSkillLevel = (percentage: number): { label: string; color: string; bg: string } => {
  if (percentage >= 80) return { label: 'Expert', color: 'text-emerald-700', bg: 'bg-emerald-100' };
  if (percentage >= 60) return { label: 'Advanced', color: 'text-blue-700', bg: 'bg-blue-100' };
  if (percentage >= 40) return { label: 'Intermediate', color: 'text-amber-700', bg: 'bg-amber-100' };
  if (percentage >= 20) return { label: 'Beginner', color: 'text-orange-700', bg: 'bg-orange-100' };
  return { label: 'Novice', color: 'text-gray-700', bg: 'bg-gray-100' };
};

// ============== COMPONENTS ==============

// Toast Notification
const Toast: React.FC<{ toast: ToastState; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-rose-600',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${styles[toast.type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn`}>
      {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
      <span className="font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1">
        <X size={18} />
      </button>
    </div>
  );
};

// Confirm Modal
const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scaleIn">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle size={24} />
            {title}
          </h3>
        </div>
        <div className="px-6 py-6">
          <p className="text-gray-600 text-lg">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Modal
const SuccessModal: React.FC<{
  isOpen: boolean;
  message: string;
  onClose: () => void;
}> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scaleIn text-center">
        <div className="px-8 py-10 bg-gradient-to-br from-emerald-50 to-green-100">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Success!</h3>
          <p className="text-gray-600 text-lg mb-8">{message}</p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-medium transition-all shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail Modal
const DetailModal: React.FC<{
  isOpen: boolean;
  operator: MatrixRow | null;
  onClose: () => void;
  onEdit: () => void;
}> = ({ isOpen, operator, onClose, onEdit }) => {
  if (!isOpen || !operator) return null;

  const skillPercentage = getSkillPercentage(operator);
  const skillLevel = getSkillLevel(skillPercentage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              👷
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">{operator.operator}</h2>
              <p className="text-white/80">
                S.No: {operator.sl_no} • Added: {new Date(operator.created_at).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
        </div>

        {/* Skill Overview */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Skill Overview</h3>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${skillLevel.bg} ${skillLevel.color}`}>
              {skillLevel.label}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Skill Proficiency</span>
              <span className="font-bold text-gray-900">{skillPercentage}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                style={{ width: `${skillPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{getSkillCount(operator)}</div>
              <div className="text-sm text-gray-600">Skills Acquired</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-600">{OPERATIONS.length - getSkillCount(operator)}</div>
              <div className="text-sm text-gray-600">Skills Remaining</div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Capabilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OPERATIONS.map((op) => (
              <div
                key={op.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  operator[op.key]
                    ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-300'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">{op.icon}</div>
                <div className={`text-xs font-semibold ${operator[op.key] ? 'text-emerald-700' : 'text-gray-500'}`}>
                  {op.label}
                </div>
                {operator[op.key] && <Check size={14} className="text-emerald-600 mx-auto mt-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50">
          {operator.remarks && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Remarks:</span> {operator.remarks}
              </p>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <span>Prepared by: <strong>{operator.prepared_by}</strong></span>
            <span>Approved by: <strong>{operator.approved_by}</strong></span>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-all"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Edit2 size={18} />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Dashboard
const StatsDashboard: React.FC<{ data: MatrixRow[] }> = ({ data }) => {
  const stats = useMemo(() => {
    const totalOperators = data.length;
    const totalSkills = data.reduce((acc, row) => acc + getSkillCount(row), 0);
    const avgSkills = totalOperators > 0 ? (totalSkills / totalOperators).toFixed(1) : '0';
    const expertCount = data.filter(row => getSkillPercentage(row) >= 80).length;

    const skillCounts = OPERATIONS.map(op => ({
      ...op,
      count: data.filter(row => row[op.key] === true).length,
      percentage: totalOperators > 0 ? Math.round((data.filter(row => row[op.key] === true).length / totalOperators) * 100) : 0
    }));

    return { totalOperators, totalSkills, avgSkills, expertCount, skillCounts };
  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Operators</p>
              <p className="text-3xl font-bold mt-1">{stats.totalOperators}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Skills</p>
              <p className="text-3xl font-bold mt-1">{stats.totalSkills}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wrench size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Avg Skills</p>
              <p className="text-3xl font-bold mt-1">{stats.avgSkills}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Experts</p>
              <p className="text-3xl font-bold mt-1">{stats.expertCount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award size={24} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <BarChart3 size={16} />
          Skills Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.skillCounts.map((skill) => (
            <div key={skill.id} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{skill.icon}</span>
                <span className="text-xs font-semibold text-gray-700 truncate">{skill.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-600">{skill.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// View Toggle
const ViewToggle: React.FC<{ view: ViewType; onChange: (view: ViewType) => void }> = ({ view, onChange }) => {
  const views: { type: ViewType; icon: React.ReactNode; label: string }[] = [
    { type: 'cards', icon: <LayoutGrid size={18} />, label: 'Cards' },
    { type: 'table', icon: <List size={18} />, label: 'Table' },
    { type: 'compact', icon: <BarChart3 size={18} />, label: 'Compact' },
  ];

  return (
    <div className="flex bg-gray-100 rounded-xl p-1">
      {views.map((v) => (
        <button
          key={v.type}
          onClick={() => onChange(v.type)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            view === v.type
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {v.icon}
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
};

// Sort Dropdown
const SortDropdown: React.FC<{
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField, order: SortOrder) => void;
}> = ({ sortField, sortOrder, onSort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: { field: SortField; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'date', label: 'Date Added' },
    { field: 'skills', label: 'Skill Count' },
    { field: 'sl_no', label: 'Serial No' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
      >
        {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
        <span className="hidden sm:inline">Sort: {options.find(o => o.field === sortField)?.label}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
            {options.map((option) => (
              <button
                key={option.field}
                onClick={() => {
                  onSort(option.field, sortField === option.field && sortOrder === 'asc' ? 'desc' : 'asc');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  sortField === option.field ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                {sortField === option.field && (sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Filter Dropdown
const FilterDropdown: React.FC<{
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}> = ({ activeFilters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (key: string) => {
    if (activeFilters.includes(key)) {
      onFilterChange(activeFilters.filter(f => f !== key));
    } else {
      onFilterChange([...activeFilters, key]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
          activeFilters.length > 0
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter size={18} />
        <span className="hidden sm:inline">Filter</span>
        {activeFilters.length > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilters.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-20">
            <div className="px-4 pb-2 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">Filter by Skill</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {OPERATIONS.map((op) => (
                <label
                  key={op.id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(op.key)}
                    onChange={() => toggleFilter(op.key)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-lg">{op.icon}</span>
                  <span className="text-sm text-gray-700">{op.label}</span>
                </label>
              ))}
            </div>
            {activeFilters.length > 0 && (
              <div className="px-4 pt-2 border-t border-gray-200">
                <button
                  onClick={() => onFilterChange([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Operator Card
const OperatorCard: React.FC<{
  row: MatrixRow;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ row, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const skillPercentage = getSkillPercentage(row);
  const skillLevel = getSkillLevel(skillPercentage);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-50 to-gray-100 px-6 py-5 border-b border-gray-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${skillPercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-start pt-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {row.operator.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${skillLevel.bg} ${skillLevel.color}`}>
                {getSkillCount(row)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {row.operator}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${skillLevel.bg} ${skillLevel.color}`}>
                  {skillLevel.label}
                </span>
                <span className="text-xs text-gray-500">#{row.sl_no}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                  <button
                    onClick={() => { onView(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye size={16} /> View Details
                  </button>
                  <button
                    onClick={() => { onEdit(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Capabilities</span>
          <span className="text-xs text-gray-500">{getSkillCount(row)}/{OPERATIONS.length} skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map((op) => (
            <div
              key={op.id}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                row[op.key]
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-50 text-gray-400 border border-gray-100'
              }`}
            >
              <span>{op.icon}</span>
              {row[op.key] && <Check size={12} />}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(row.created_at).toLocaleDateString('en-GB')}</span>
          </div>
          <button
            onClick={onView}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details
            <ChevronDown size={14} className="-rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Table View
const TableView: React.FC<{
  data: MatrixRow[];
  onView: (row: MatrixRow) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ data, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Operator</th>
              {OPERATIONS.map((op) => (
                <th key={op.id} className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{op.icon}</span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Level</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => {
              const skillLevel = getSkillLevel(getSkillPercentage(row));
              return (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {row.operator.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{row.operator}</div>
                        <div className="text-xs text-gray-500">#{row.sl_no}</div>
                      </div>
                    </div>
                  </td>
                  {OPERATIONS.map((op) => (
                    <td key={op.id} className="px-3 py-4 text-center">
                      {row[op.key] ? (
                        <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto">
                          <Check size={14} className="text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                          <X size={14} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${skillLevel.bg} ${skillLevel.color}`}>
                      {skillLevel.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onView(row)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onEdit(row.id!)} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDelete(row.id!)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
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
  );
};

// Compact View
const CompactView: React.FC<{
  data: MatrixRow[];
  onView: (row: MatrixRow) => void;
  onEdit: (id: number) => void;
}> = ({ data, onView, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-200">
        {data.map((row) => {
          const skillPercentage = getSkillPercentage(row);
          const skillLevel = getSkillLevel(skillPercentage);

          return (
            <div
              key={row.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onView(row)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {row.operator.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 truncate">{row.operator}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${skillLevel.bg} ${skillLevel.color}`}>
                    {skillLevel.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1 max-w-xs">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        style={{ width: `${skillPercentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{getSkillCount(row)}/{OPERATIONS.length}</span>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onEdit(row.id!); }}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Edit Operation Card
const EditOperationCard: React.FC<{
  operation: Operation;
  checked: boolean;
  onChange: () => void;
}> = ({ operation, checked, onChange }) => {
  return (
    <div
      onClick={onChange}
      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
        checked
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-100'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
          checked
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg'
            : 'bg-gray-100 group-hover:bg-gray-200'
        }`}>
          {operation.icon}
        </div>
        <span className={`text-sm font-bold text-center transition-colors ${checked ? 'text-blue-700' : 'text-gray-700'}`}>
          {operation.label}
        </span>
        <p className="text-xs text-gray-500 text-center hidden sm:block">{operation.description}</p>
      </div>

      {checked && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <Check size={14} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton
const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div className="bg-gray-100 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-300 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-300 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="h-8 w-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============== MAIN COMPONENT ==============
const ManMachineMatrix: React.FC = () => {
  // States
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [viewType, setViewType] = useState<ViewType>('cards');
  const [matrixData, setMatrixData] = useState<MatrixRow[]>([]);
  const [formData, setFormData] = useState<MatrixRowBase[]>([createEmptyRow()]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('sl_no');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(true);

  // Modal states
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; operator: MatrixRow | null }>({ isOpen: false, operator: null });

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const response = await api.get('matrix/');
        setMatrixData(response.data.sort((a: MatrixRow, b: MatrixRow) => a.sl_no - b.sl_no));
      } catch (err) {
        console.error('Error fetching data:', err);
        setToast({ message: 'Failed to load data. Please refresh.', type: 'error' });
      } finally {
        setIsDataLoading(false);
      }
    };
    if (viewMode === 'view') {
      fetchData();
    }
  }, [viewMode]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let data = [...matrixData];

    if (searchTerm) {
      data = data.filter(
        (item) =>
          item.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.remarks.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.length > 0) {
      data = data.filter((item) =>
        activeFilters.every((filter) => item[filter as keyof MatrixRow] === true)
      );
    }

    data.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.operator.localeCompare(b.operator);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'skills':
          comparison = getSkillCount(a) - getSkillCount(b);
          break;
        default:
          comparison = a.sl_no - b.sl_no;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return data;
  }, [matrixData, searchTerm, activeFilters, sortField, sortOrder]);

  // Handlers
  const addRow = () => setFormData([...formData, createEmptyRow()]);

  const removeRow = (index: number) => {
    if (formData.length <= 1) return;
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (rowIndex: number, field: keyof MatrixRowBase) => {
    const newData = [...formData];
    newData[rowIndex] = { ...newData[rowIndex], [field]: !newData[rowIndex][field] };
    setFormData(newData);
  };

  const handleInputChange = (rowIndex: number, field: keyof MatrixRowBase, value: string) => {
    const newData = [...formData];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setFormData(newData);
  };

  const resetForm = () => {
    setFormData([createEmptyRow()]);
    setEditingId(null);
    setViewMode('view');
  };

  const validateForm = (): string | null => {
    for (let i = 0; i < formData.length; i++) {
      if (!formData[i].operator.trim()) {
        return `Please enter operator name for Operator #${i + 1}`;
      }
      const hasAnyOperation = OPERATIONS.some(op => formData[i][op.key] === true);
      if (!hasAnyOperation) {
        return `Please select at least one machine for ${formData[i].operator || `Operator #${i + 1}`}`;
      }
    }
    if (!formData[0].prepared_by.trim()) return 'Please enter "Prepared By" name';
    if (!formData[0].approved_by.trim()) return 'Please enter "Approved By" name';
    return null;
  };

  const saveMatrix = async () => {
    const error = validateForm();
    if (error) {
      setToast({ message: error, type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = formData.map(row => ({
        ...row,
        prepared_by: formData[0].prepared_by,
        approved_by: formData[0].approved_by,
      }));

      if (editingId !== null) {
        await api.put(`matrix/${editingId}/`, dataToSend[0]);
        setMatrixData(prev =>
          prev.map(row =>
            row.id === editingId
              ? { ...dataToSend[0], id: editingId, sl_no: row.sl_no, created_at: row.created_at }
              : row
          )
        );
        setSuccessModal({ isOpen: true, message: 'Operator updated successfully!' });
      } else {
        const response = await api.post('matrix/', dataToSend);
        setMatrixData(prev => [...prev, ...response.data].sort((a, b) => a.sl_no - b.sl_no));
        setSuccessModal({
          isOpen: true,
          message: `${formData.length} operator${formData.length > 1 ? 's' : ''} added successfully!`
        });
      }

      setEditingId(null);
      setFormData([createEmptyRow()]);
    } catch (err) {
      console.error('Save failed:', err);
      setToast({ message: 'Failed to save. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    const row = matrixData.find(r => r.id === id);
    if (row) {
      setFormData([{
        operator: row.operator,
        blanking: row.blanking,
        bending: row.bending,
        punching: row.punching,
        draw: row.draw,
        trimming: row.trimming,
        mig_welding: row.mig_welding,
        tig_welding: row.tig_welding,
        projection_welding: row.projection_welding,
        remarks: row.remarks,
        prepared_by: row.prepared_by,
        approved_by: row.approved_by,
      }]);
      setEditingId(id);
      setDetailModal({ isOpen: false, operator: null });
      setViewMode('edit');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmModal.id) return;

    try {
      await api.delete(`matrix/${confirmModal.id}/`);
      setMatrixData(prev => prev.filter(row => row.id !== confirmModal.id));
      setToast({ message: 'Deleted successfully!', type: 'success' });
    } catch (err) {
      console.error('Delete failed:', err);
      setToast({ message: 'Delete failed. Please try again.', type: 'error' });
    } finally {
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  const selectAllSkills = (index: number) => {
    const newData = [...formData];
    OPERATIONS.forEach(op => {
      (newData[index] as any)[op.key] = true;
    });
    setFormData(newData);
  };

  const clearAllSkills = (index: number) => {
    const newData = [...formData];
    OPERATIONS.forEach(op => {
      (newData[index] as any)[op.key] = false;
    });
    setFormData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-8 px-4 md:px-8">
      {/* Modals */}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Operator"
        message="Are you sure you want to delete this operator? This cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={() => {
          setSuccessModal({ isOpen: false, message: '' });
          setViewMode('view');
        }}
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        operator={detailModal.operator}
        onClose={() => setDetailModal({ isOpen: false, operator: null })}
        onEdit={() => detailModal.operator && handleEdit(detailModal.operator.id!)}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Sparkles size={12} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Man Machine Matrix
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  Manage operator skills and machine capabilities
                </p>
              </div>
            </div>

            {viewMode === 'view' && (
              <button
                onClick={() => { setFormData([createEmptyRow()]); setEditingId(null); setViewMode('edit'); }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                Add New Operator
              </button>
            )}
          </div>
        </div>

        {viewMode === 'view' ? (
          <>
            {/* Stats */}
            {showStats && matrixData.length > 0 && <StatsDashboard data={matrixData} />}

            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search operators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      showStats ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <BarChart3 size={18} />
                    <span className="hidden sm:inline">Stats</span>
                  </button>

                  <FilterDropdown activeFilters={activeFilters} onFilterChange={setActiveFilters} />
                  <SortDropdown sortField={sortField} sortOrder={sortOrder} onSort={(f, o) => { setSortField(f); setSortOrder(o); }} />
                  <ViewToggle view={viewType} onChange={setViewType} />
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || activeFilters.length > 0) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 flex-wrap">
                  <span className="text-sm text-gray-500">Active:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {activeFilters.map((filter) => {
                    const op = OPERATIONS.find(o => o.key === filter);
                    return (
                      <span key={filter} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {op?.icon} {op?.label}
                        <button onClick={() => setActiveFilters(activeFilters.filter(f => f !== filter))} className="hover:bg-purple-200 rounded-full p-0.5">
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                  <button onClick={() => { setSearchTerm(''); setActiveFilters([]); }} className="text-sm text-red-600 font-medium">
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Data */}
            {isDataLoading ? (
              <LoadingSkeleton />
            ) : processedData.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Showing <strong>{processedData.length}</strong> of <strong>{matrixData.length}</strong> operators
                </p>

                {viewType === 'cards' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {processedData.map((row) => (
                      <OperatorCard
                        key={row.id}
                        row={row}
                        onView={() => setDetailModal({ isOpen: true, operator: row })}
                        onEdit={() => handleEdit(row.id!)}
                        onDelete={() => setConfirmModal({ isOpen: true, id: row.id! })}
                      />
                    ))}
                  </div>
                )}

                {viewType === 'table' && (
                  <TableView
                    data={processedData}
                    onView={(row) => setDetailModal({ isOpen: true, operator: row })}
                    onEdit={handleEdit}
                    onDelete={(id) => setConfirmModal({ isOpen: true, id })}
                  />
                )}

                {viewType === 'compact' && (
                  <CompactView
                    data={processedData}
                    onView={(row) => setDetailModal({ isOpen: true, operator: row })}
                    onEdit={handleEdit}
                  />
                )}
              </>
            ) : matrixData.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Settings size={56} className="text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">No Operators Yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Start by adding operators and mapping their machine capabilities.
                </p>
                <button
                  onClick={() => { setFormData([createEmptyRow()]); setViewMode('edit'); }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg"
                >
                  <Plus size={22} />
                  Add First Operator
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No matching records</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        ) : (
          /* EDIT MODE */
          <div className="space-y-6">
            <button onClick={resetForm} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Matrix</span>
            </button>

            {/* Form Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Operator' : 'Add New Operator(s)'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {editingId ? 'Update operator information' : 'Define which machines each operator can operate'}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-xl">
                  <span className="text-sm font-semibold text-blue-700">
                    {formData.length} Operator{formData.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Operator Forms */}
            {formData.map((row, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-white gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                        {row.operator ? row.operator.charAt(0).toUpperCase() : '👷'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{row.operator || `Operator #${index + 1}`}</h3>
                        <p className="text-white/70 text-sm">{OPERATIONS.filter(op => row[op.key]).length} skills selected</p>
                      </div>
                    </div>
                    {formData.length > 1 && (
                      <button onClick={() => removeRow(index)} className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl">
                        <Trash2 size={22} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inputs */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Operator Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={row.operator}
                        onChange={(e) => handleInputChange(index, 'operator', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Enter operator's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Remarks <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Any notes"
                      />
                    </div>
                  </div>
                </div>

                {/* Machine Selection */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Target size={20} className="text-blue-600" />
                        Select Machine Capabilities
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">Click on machines this operator can operate</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-xl">
                      <span className="text-sm text-gray-600">
                        Selected: <span className="font-bold text-blue-600">
                          {OPERATIONS.filter(op => row[op.key]).length}
                        </span> / {OPERATIONS.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {OPERATIONS.map((op) => (
                      <EditOperationCard
                        key={op.id}
                        operation={op}
                        checked={row[op.key] as boolean}
                        onChange={() => handleCheckboxChange(index, op.key)}
                      />
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => selectAllSkills(index)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => clearAllSkills(index)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More */}
            {!editingId && (
              <div className="flex justify-center">
                <button
                  onClick={addRow}
                  className="px-8 py-4 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-2xl font-medium flex items-center gap-3 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <Plus size={22} />
                  Add Another Operator
                </button>
              </div>
            )}

            {/* Authorization */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Award size={20} className="text-amber-600" />
                  Authorization
                </h4>
                <p className="text-sm text-gray-500 mt-1">Applied to all operators</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Prepared By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData[0].prepared_by}
                      onChange={(e) => handleInputChange(0, 'prepared_by', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Preparer's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Approved By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData[0].approved_by}
                      onChange={(e) => handleInputChange(0, 'approved_by', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Approver's name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={saveMatrix}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingId ? 'Update' : 'Save All'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};

export default ManMachineMatrix;