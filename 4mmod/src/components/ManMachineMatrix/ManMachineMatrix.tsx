
// import React, { useState, useEffect } from 'react';
// import { Check, Save, Plus, RefreshCw, Trash2, Eye, EyeOff, Search, ArrowLeft } from 'lucide-react';
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
//       approved_by: ''
//     }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const api = axios.create({
//     baseURL: 'http://localhost:8000/api/',
//   });

//   // Fetch existing data when component mounts
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
//     setFormData([...formData, {
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
//       approved_by: ''
//     }]);
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
//       [field]: !newData[rowIndex][field]
//     };
//     setFormData(newData);
//   };

//   const handleInputChange = (rowIndex: number, field: keyof MatrixRowBase, value: string) => {
//     const newData = [...formData];
//     newData[rowIndex] = {
//       ...newData[rowIndex],
//       [field]: value
//     };
//     setFormData(newData);
//   };

//   const resetForm = () => {
//     setFormData([{
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
//       approved_by: ''
//     }]);
//   };

//   const saveMatrix = async () => {
//     setIsLoading(true);
//     try {
//       // Validate required fields
//       if (formData.some(row => !row.operator.trim())) {
//         alert('Please fill in all operator names');
//         return;
//       }

//       if (formData.some(row => !row.prepared_by.trim() || !row.approved_by.trim())) {
//         alert('Please fill in both Prepared By and Approved By fields for all rows');
//         return;
//       }

//       await api.post('matrix/', formData);
//       setViewMode('view');
//       alert('Matrix saved successfully!');
//     } catch (err) {
//       console.error('Failed to save matrix', err);
//       alert('Failed to save matrix. Please try again.');
//     } finally {
//       setIsLoading(false);
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
//     { id: 'projection_welding', label: 'PROJECTION', key: 'projection_welding' as const }
//   ];

//   const filteredData = matrixData.filter(item =>
//     item.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.remarks.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-[#f6faff] min-h-screen p-6">
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
//         {/* Header Section */}
//         <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-5">
//           <div className="text-left">
//             <h1 className="text-2xl font-bold text-white">Man Machine Matrix</h1>
//             <p className="text-cyan-100 text-sm mt-1">Operator skills and capabilities matrix</p>
//           </div>
//         </div>

//         <div className="p-6">
//           {viewMode === 'view' ? (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <button 
//                   onClick={() => setViewMode('edit')}
//                   className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium"
//                 >
//                   <Plus size={18} />
//                   <span>Add New Matrix</span>
//                 </button>
                
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search operator or remarks"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
//                   />
//                 </div>
//               </div>

//               {matrixData.length > 0 ? (
//                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="bg-gradient-to-r from-cyan-600 to-cyan-700">
//                           <th className="px-4 py-3 font-bold text-white text-center border-r border-cyan-500 w-20">S.NO</th>
//                           <th className="px-4 py-3 font-bold text-white text-center border-r border-cyan-500">OPERATOR</th>
//                           {operations.map((op) => (
//                             <th key={op.id} className="px-3 py-3 font-bold text-white text-center border-r border-cyan-500">
//                               {op.label}
//                             </th>
//                           ))}
//                           <th className="px-4 py-3 font-bold text-white text-center border-r border-cyan-500">REMARKS</th>
//                           <th className="px-4 py-3 font-bold text-white text-center">DATE</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredData.length > 0 ? (
//                           filteredData.map((row) => (
//                             <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
//                               <td className="px-4 py-3 text-center text-gray-700 font-medium border-r border-gray-100">
//                                 {row.sl_no}
//                               </td>
//                               <td className="px-4 py-3 text-center text-gray-700 font-medium border-r border-gray-100">{row.operator}</td>
//                               {operations.map((op) => (
//                                 <td key={op.id} className="px-3 py-3 text-center border-r border-gray-100">
//                                   <div className="flex justify-center">
//                                     {row[op.key] ? (
//                                       <Check size={16} className="text-green-500" />
//                                     ) : (
//                                       <span className="text-gray-400">-</span>
//                                     )}
//                                   </div>
//                                 </td>
//                               ))}
//                               <td className="px-4 py-3 text-center text-gray-700 font-medium border-r border-gray-100">{row.remarks || '-'}</td>
//                               <td className="px-4 py-3 text-center text-gray-700 font-medium">
//                                 {new Date(row.created_at).toLocaleDateString('en-GB')}
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={operations.length + 4} className="px-4 py-8 text-center text-gray-500">
//                               No matching records found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Search size={24} className="text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matrix Data Available</h3>
//                   <p className="text-gray-600 mb-6">Get started by creating your first operator matrix</p>
//                   <button 
//                     onClick={() => setViewMode('edit')}
//                     className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium mx-auto"
//                   >
//                     <Plus size={18} />
//                     <span>Create New Matrix</span>
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <button 
//                   onClick={() => setViewMode('view')}
//                   className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium"
//                 >
//                   <ArrowLeft size={18} />
//                   <span>Back to View</span>
//                 </button>
//                 <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
//                   <span className="font-medium">{formData.length}</span> operator{formData.length > 1 ? 's' : ''} in form
//                 </div>
//               </div>

//               {/* Form Cards Layout */}
//               <div className="space-y-6">
//                 {formData.map((row, index) => (
//                   <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
//                     {/* Card Header */}
//                     <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4">
//                       <div className="flex justify-between items-center">
//                         <h3 className="text-lg font-bold text-white">Operator #{index + 1}</h3>
//                         <button
//                           onClick={() => removeRow(index)}
//                           disabled={formData.length === 1}
//                           className={`p-2 rounded-xl transition-all duration-200 ${
//                             formData.length === 1 
//                               ? 'text-cyan-300 cursor-not-allowed opacity-50' 
//                               : 'text-white hover:bg-white/20'
//                           }`}
//                           title="Remove operator"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Card Content */}
//                     <div className="p-6">
//                       {/* Basic Information */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Operator Name <span className="text-red-500">*</span>
//                           </label>
//                           <input 
//                             type="text" 
//                             value={row.operator}
//                             onChange={(e) => handleInputChange(index, 'operator', e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-gray-900 font-medium"
//                             placeholder="Enter operator name"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Remarks
//                           </label>
//                           <input 
//                             type="text" 
//                             value={row.remarks}
//                             onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-gray-900 font-medium"
//                             placeholder="Enter remarks (optional)"
//                           />
//                         </div>
//                       </div>

//                       {/* Operations Section */}
//                       <div className="mb-6">
//                         <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
//                           <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-lg mr-2">
//                             Operations Capabilities
//                           </span>
//                           <span className="text-xs text-gray-500">(Check all operations this operator can perform)</span>
//                         </h4>
                        
//                         <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {operations.map((op) => (
//                               <div key={op.id} className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-cyan-300 transition-colors duration-200">
//                                 <input
//                                   type="checkbox"
//                                   id={`${index}-${op.id}`}
//                                   checked={row[op.key]}
//                                   onChange={() => handleCheckboxChange(index, op.key)}
//                                   className="w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded-lg focus:ring-cyan-500 focus:ring-2"
//                                 />
//                                 <label 
//                                   htmlFor={`${index}-${op.id}`}
//                                   className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
//                                 >
//                                   {op.label}
//                                 </label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Legend */}
//                       <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 py-3 rounded-xl border border-gray-200">
//                         <div className="flex items-center space-x-2">
//                           <span className="font-medium">Legend:</span>
//                           <div className="flex items-center space-x-1">
//                             <div className="w-5 h-5 border-2 border-cyan-500 rounded-lg flex items-center justify-center bg-white">
//                               <Check size={12} className="text-cyan-500" />
//                             </div>
//                             <span>= Can perform operation</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Add Row Button */}
//                 <div className="flex justify-center">
//                   <button 
//                     onClick={addRow}
//                     className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 rounded-2xl hover:from-cyan-100 hover:to-cyan-200 transition-all duration-200 border-2 border-dashed border-cyan-300 hover:border-cyan-400 font-medium shadow-sm hover:shadow-md"
//                   >
//                     <Plus size={20} />
//                     <span>Add Another Operator</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Form Footer */}
//               <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//                 <h4 className="text-lg font-semibold text-gray-900 mb-4">Authorization</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Prepared By <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData[0].prepared_by}
//                       onChange={(e) => handleInputChange(0, 'prepared_by', e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-gray-900 font-medium"
//                       placeholder="Enter name"
//                       required
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
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-gray-900 font-medium"
//                       placeholder="Enter name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//                   <button 
//                     onClick={resetForm}
//                     className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
//                   >
//                     <RefreshCw size={16} />
//                     <span>Reset Form</span>
//                   </button>
                  
//                   <button 
//                     onClick={saveMatrix}
//                     disabled={isLoading}
//                     className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
//                   >
//                     <Save size={18} />
//                     <span>{isLoading ? 'Saving...' : 'Save Matrix'}</span>
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManMachineMatrix;


import React, { useState, useEffect } from 'react';
import { Check, Save, Plus, RefreshCw, Trash2, Search, ArrowLeft } from 'lucide-react';
import axios from 'axios';

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

const ManMachineMatrix: React.FC = () => {
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [matrixData, setMatrixData] = useState<MatrixRow[]>([]);
  const [formData, setFormData] = useState<MatrixRowBase[]>([
    {
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
    },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('matrix/');
        setMatrixData(response.data.sort((a: MatrixRow, b: MatrixRow) => a.sl_no - b.sl_no));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [viewMode]);

  const addRow = () => {
    setFormData([
      ...formData,
      {
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
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (formData.length <= 1) return;
    const newData = [...formData];
    newData.splice(index, 1);
    setFormData(newData);
  };

  const handleCheckboxChange = (rowIndex: number, field: keyof MatrixRowBase) => {
    const newData = [...formData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: !newData[rowIndex][field],
    };
    setFormData(newData);
  };

  const handleInputChange = (rowIndex: number, field: keyof MatrixRowBase, value: string) => {
    const newData = [...formData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: value,
    };
    setFormData(newData);
  };

  const resetForm = () => {
    setFormData([
      {
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
      },
    ]);
    setEditingId(null);
    setViewMode('view');
  };

  const saveMatrix = async () => {
    setIsLoading(true);
    try {
      if (formData.some((row) => !row.operator.trim())) {
        alert('Please fill in all operator names');
        return;
      }

      if (formData.some((row) => !row.prepared_by.trim() || !row.approved_by.trim())) {
        alert('Please fill in both Prepared By and Approved By fields for all rows');
        return;
      }

      if (editingId !== null) {
        await api.put(`matrix/${editingId}/`, formData[0]);
        setMatrixData((prev) =>
          prev.map((row) =>
            row.id === editingId
              ? { ...formData[0], id: editingId, sl_no: row.sl_no, created_at: row.created_at }
              : row
          )
        );
      } else {
        const response = await api.post('matrix/', formData);
        setMatrixData((prev) => [...prev, ...response.data].sort((a, b) => a.sl_no - b.sl_no));
      }
      setViewMode('view');
      setEditingId(null);
      resetForm();
      alert('Matrix saved successfully!');
    } catch (err) {
      console.error('Failed to save matrix', err);
      alert('Failed to save matrix. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    const row = matrixData.find((row) => row.id === id);
    if (row) {
      setFormData([
        {
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
        },
      ]);
      setEditingId(id);
      setViewMode('edit');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`matrix/${id}/`);
        setMatrixData((prev) => prev.filter((row) => row.id !== id));
        alert('Record deleted successfully!');
      } catch (err) {
        console.error('Failed to delete record', err);
        alert('Failed to delete record. Please try again.');
      }
    }
  };

  const operations = [
    { id: 'blanking', label: 'BLANKING', key: 'blanking' as const },
    { id: 'bending', label: 'BENDING', key: 'bending' as const },
    { id: 'punching', label: 'PUNCHING', key: 'punching' as const },
    { id: 'draw', label: 'DRAW', key: 'draw' as const },
    { id: 'trimming', label: 'TRIMMING', key: 'trimming' as const },
    { id: 'mig_welding', label: 'MIG', key: 'mig_welding' as const },
    { id: 'tig_welding', label: 'TIG', key: 'tig_welding' as const },
    { id: 'projection_welding', label: 'PROJECTION', key: 'projection_welding' as const },
  ];

  const filteredData = matrixData.filter(
    (item) =>
      item.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-full  py-8 px-2 md:px-8">
      <div className="max-w-full  mx-auto">
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
            <h1 className="text-3xl font-bold text-blue-800">Man Machine Matrix</h1>
          </div>
          {/* <div className="bg-white shadow rounded-md p-4 inline-block">
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">DOC. NO.</span>
                <p>MSF-QA-11</p>
              </div>
              <div>
                <span className="font-medium">REVISION NO.</span>
                <p>00</p>
              </div>
              <div>
                <span className="font-medium">DATE</span>
                <p>05.04.18</p>
              </div>
            </div>
          </div> */}
        </div>

        {viewMode === 'view' ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700  px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">Operator Skills Matrix</h2>
              <button
                onClick={() => {
                  resetForm();
                  setViewMode('edit');
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add New Matrix</span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-end mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search operator or remarks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              {matrixData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.NO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          OPERATOR
                        </th>
                        {operations.map((op) => (
                          <th
                            key={op.id}
                            className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {op.label}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          REMARKS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          DATE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.length > 0 ? (
                        filteredData.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.sl_no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {row.operator}
                            </td>
                            {operations.map((op) => (
                              <td key={op.id} className="px-3 py-4 text-center">
                                {row[op.key] ? (
                                  <Check size={16} className="text-green-600 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {row.remarks || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(row.created_at).toLocaleDateString('en-GB')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(row.id!)}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(row.id!)}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={operations.length + 5}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No matching records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Matrix Data Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first operator matrix
                  </p>
                  <button
                    onClick={() => {
                      resetForm();
                      setViewMode('edit');
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center space-x-2 mx-auto"
                  >
                    <Plus size={18} />
                    <span>Create New Matrix</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Operator Matrix' : 'Add New Operator Matrix'}
              </h2>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <ArrowLeft size={18} />
                <span>Back to List</span>
              </button>
            </div>
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-md inline-block mb-6">
                <span className="font-medium">{formData.length}</span> operator
                {formData.length > 1 ? 's' : ''} in form
              </div>
              <div className="space-y-6">
                {formData.map((row, index) => (
                  <div key={index} className="border p-4 rounded-md bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Operator #{index + 1}
                      </h3>
                      <button
                        onClick={() => removeRow(index)}
                        disabled={formData.length === 1}
                        className={`p-2 rounded-md ${
                          formData.length === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Operator Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={row.operator}
                          onChange={(e) => handleInputChange(index, 'operator', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Enter operator name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remarks
                        </label>
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Enter remarks (optional)"
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">
                        Operations Capabilities
                      </h4>
                      <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {operations.map((op) => (
                            <div
                              key={op.id}
                              className="flex items-center space-x-2 p-2 bg-white rounded-md border border-gray-200"
                            >
                              <input
                                type="checkbox"
                                id={`${index}-${op.id}`}
                                checked={row[op.key]}
                                onChange={() => handleCheckboxChange(index, op.key)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`${index}-${op.id}`}
                                className="text-sm text-gray-700"
                              >
                                {op.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-600 text-center">
                      <span className="font-medium">Legend: </span>
                      <span className="inline-flex items-center">
                        <Check size={12} className="text-blue-600 mr-1" /> = Can perform operation
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <button
                    onClick={addRow}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-300 hover:bg-blue-100 text-sm font-medium flex items-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>Add Another Operator</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Authorization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prepared By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[0].prepared_by}
                    onChange={(e) => handleInputChange(0, 'prepared_by', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approved By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[0].approved_by}
                    onChange={(e) => handleInputChange(0, 'approved_by', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter name"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw size={16} className="inline mr-1" />
                  Reset Form
                </button>
                <button
                  onClick={saveMatrix}
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                >
                  <Save size={16} className="inline mr-1" />
                  {isLoading ? 'Saving...' : 'Save Matrix'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManMachineMatrix;