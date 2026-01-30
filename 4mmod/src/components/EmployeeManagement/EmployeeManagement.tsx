
// // src/pages/EmployeeManagement.tsx
// import { useState, useEffect, useRef, useMemo } from 'react';
// import axios from 'axios';
// import { 
//   Download, Upload, Plus, Loader2, AlertCircle, CheckCircle2, X, 
//   Search, Filter, Grid, List, ChevronLeft, ChevronRight, Edit2, 
//   Trash2, Users, Building2, Mail, Phone, Calendar, UserCheck,
//   Eye, RefreshCw, FileSpreadsheet, AlertTriangle, ChevronDown
// } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000/api';

// interface Employee {
//   id: number;
//   emp_id: string;
//   first_name: string;
//   last_name: string;
//   designation: string;
//   department_name: string;
//   current_line: string;
//   current_station: string | null;
//   date_of_joining: string;
//   birth_date: string;
//   sex: string;
//   email?: string;
//   phone?: string;
// }

// // Helper function to extract ID from employee object (handles different API responses)
// const getEmployeeId = (emp: any): number | null => {
//   // Try different possible ID field names
//   const possibleIdFields = ['id', 'pk', '_id', 'employee_id', 'Id', 'ID'];
  
//   for (const field of possibleIdFields) {
//     if (emp[field] !== undefined && emp[field] !== null) {
//       const id = Number(emp[field]);
//       if (!isNaN(id)) {
//         return id;
//       }
//     }
//   }
  
//   return null;
// };

// // Helper function to normalize employee data from API
// const normalizeEmployee = (emp: any): Employee | null => {
//   const id = getEmployeeId(emp);
  
//   if (id === null) {
//     console.warn('Employee without valid ID:', emp);
//     return null;
//   }
  
//   return {
//     id,
//     emp_id: emp.emp_id || emp.empId || emp.employee_code || '',
//     first_name: emp.first_name || emp.firstName || '',
//     last_name: emp.last_name || emp.lastName || '',
//     designation: emp.designation || '',
//     department_name: emp.department_name || emp.departmentName || emp.department || '',
//     current_line: emp.current_line || emp.currentLine || '',
//     current_station: emp.current_station || emp.currentStation || null,
//     date_of_joining: emp.date_of_joining || emp.dateOfJoining || emp.joining_date || '',
//     birth_date: emp.birth_date || emp.birthDate || emp.dob || '',
//     sex: emp.sex || emp.gender || '',
//     email: emp.email || '',
//     phone: emp.phone || emp.mobile || emp.contact || '',
//   };
// };

// type ViewMode = 'table' | 'card';
// type ModalType = 'add' | 'edit' | 'view' | null;

// export default function EmployeeManagement() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadResult, setUploadResult] = useState<{
//     success: boolean;
//     message: string;
//     errors?: any[];
//   } | null>(null);

//   // View and Filter states
//   const [viewMode, setViewMode] = useState<ViewMode>('table');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [designationFilter, setDesignationFilter] = useState('');
//   const [showFilters, setShowFilters] = useState(false);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Selection states
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   // Modal states
//   const [modalType, setModalType] = useState<ModalType>(null);
//   const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
//   const [saving, setSaving] = useState(false);

//   // Delete states
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletingIds, setDeletingIds] = useState<number[]>([]);
//   const [deleting, setDeleting] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE_URL}/employees/`);
      
//       // DEBUG: Log the raw API response
//       console.log('API Response:', res.data);
      
//       // Handle different API response structures
//       let rawData = res.data;
      
//       // If response is paginated (has results array)
//       if (res.data.results && Array.isArray(res.data.results)) {
//         rawData = res.data.results;
//       }
      
//       // Normalize and filter valid employees
//       const normalizedEmployees = rawData
//         .map((emp: any) => normalizeEmployee(emp))
//         .filter((emp: Employee | null): emp is Employee => emp !== null);
      
//       console.log('Normalized Employees:', normalizedEmployees);
      
//       setEmployees(normalizedEmployees);
//       setSelectedIds([]);
//     } catch (err) {
//       console.error('Failed to load employees', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get unique departments and designations for filters
//   const departments = useMemo(() => {
//     const depts = employees.map(e => e.department_name).filter(Boolean);
//     return Array.from(new Set(depts)).sort();
//   }, [employees]);

//   const designations = useMemo(() => {
//     const desigs = employees.map(e => e.designation).filter(Boolean);
//     return Array.from(new Set(desigs)).sort();
//   }, [employees]);

//   // Filter and search employees
//   const filteredEmployees = useMemo(() => {
//     return employees.filter(emp => {
//       const matchesSearch = searchTerm === '' || 
//         emp.emp_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesDepartment = departmentFilter === '' || emp.department_name === departmentFilter;
//       const matchesDesignation = designationFilter === '' || emp.designation === designationFilter;

//       return matchesSearch && matchesDepartment && matchesDesignation;
//     });
//   }, [employees, searchTerm, departmentFilter, designationFilter]);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  
//   const paginatedEmployees = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredEmployees, currentPage, itemsPerPage]);

//   // Get current page IDs
//   const currentPageIds = useMemo(() => {
//     return paginatedEmployees
//       .map(emp => emp.id)
//       .filter((id): id is number => typeof id === 'number' && !isNaN(id));
//   }, [paginatedEmployees]);

//   // Check if all on current page are selected
//   const isAllSelected = useMemo(() => {
//     if (currentPageIds.length === 0) return false;
//     return currentPageIds.every(id => selectedIds.includes(id));
//   }, [currentPageIds, selectedIds]);

//   // Check if some (but not all) are selected
//   const isSomeSelected = useMemo(() => {
//     if (currentPageIds.length === 0) return false;
//     const selectedCount = currentPageIds.filter(id => selectedIds.includes(id)).length;
//     return selectedCount > 0 && selectedCount < currentPageIds.length;
//   }, [currentPageIds, selectedIds]);

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//     setSelectedIds([]);
//   }, [searchTerm, departmentFilter, designationFilter, itemsPerPage]);

//   // Selection handlers
//   const handleSelectAllClick = (e: React.MouseEvent<HTMLInputElement>) => {
//     e.stopPropagation();
//   };

//   const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.stopPropagation();
    
//     if (isAllSelected) {
//       setSelectedIds(prevIds => 
//         prevIds.filter(id => !currentPageIds.includes(id))
//       );
//     } else {
//       setSelectedIds(prevIds => {
//         const newIds = [...prevIds];
//         currentPageIds.forEach(id => {
//           if (typeof id === 'number' && !isNaN(id) && !newIds.includes(id)) {
//             newIds.push(id);
//           }
//         });
//         return newIds;
//       });
//     }
//   };

//   const handleEmployeeCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
//     e.stopPropagation();
//   };

//   const handleEmployeeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, employeeId: number) => {
//     e.stopPropagation();
    
//     if (typeof employeeId !== 'number' || isNaN(employeeId)) {
//       console.warn('Invalid employee ID for checkbox:', employeeId);
//       return;
//     }
    
//     setSelectedIds(prevIds => {
//       if (prevIds.includes(employeeId)) {
//         return prevIds.filter(id => id !== employeeId);
//       } else {
//         return [...prevIds, employeeId];
//       }
//     });
//   };

//   const isEmployeeSelected = (employeeId: number): boolean => {
//     return selectedIds.includes(employeeId);
//   };

//   const clearSelection = () => {
//     setSelectedIds([]);
//   };

//   const handleDownloadTemplate = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/employees/template/`, {
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'Employee_Upload_Template.xlsx');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       alert('Failed to download template');
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setUploadResult(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file first');
//       return;
//     }

//     setUploading(true);
//     setUploadResult(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/employees/upload/`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
      
//       setUploadResult({ success: true, message: res.data.message || 'Upload successful' });
//       setFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//       fetchEmployees();
//     } catch (error: any) {
//       if (error.response?.status === 207) {
//         setUploadResult({
//           success: false,
//           message: error.response.data.message,
//           errors: error.response.data.errors,
//         });
//         fetchEmployees();
//       } else {
//         setUploadResult({
//           success: false,
//           message: error.response?.data?.error || 'Upload failed',
//         });
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   // FIXED: handleSaveEmployee with proper validation and debugging
//   const handleSaveEmployee = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!currentEmployee.emp_id || !currentEmployee.first_name || !currentEmployee.last_name) {
//       alert('Employee ID, First Name and Last Name are required');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       if (modalType === 'add') {
//         console.log('Adding new employee:', currentEmployee);
//         await axios.post(`${API_BASE_URL}/employees/`, currentEmployee);
//         alert('Employee added successfully');
//       } else if (modalType === 'edit') {
//         // DEBUG: Check the current employee data
//         console.log('Editing employee - Full data:', currentEmployee);
//         console.log('Employee ID:', currentEmployee.id);
//         console.log('Employee ID type:', typeof currentEmployee.id);
        
//         // Validate ID
//         if (!currentEmployee.id || typeof currentEmployee.id !== 'number' || isNaN(currentEmployee.id)) {
//           alert('Cannot update: Employee ID is invalid');
//           console.error('Invalid employee ID:', currentEmployee.id);
//           setSaving(false);
//           return;
//         }
        
//         const updateUrl = `${API_BASE_URL}/employees/${currentEmployee.id}/`;
//         console.log('Update URL:', updateUrl);
        
//         await axios.put(updateUrl, currentEmployee);
//         alert('Employee updated successfully');
//       }
      
//       setModalType(null);
//       setCurrentEmployee({});
//       fetchEmployees();
//     } catch (err: any) {
//       console.error('Save error:', err);
//       console.error('Error response:', err.response?.data);
//       alert(err.response?.data?.emp_id?.[0] || err.response?.data?.detail || 'Failed to save employee');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // FIXED: handleEdit with proper validation
//   const handleEdit = (employee: Employee) => {
//     console.log('Edit clicked - Employee:', employee);
//     console.log('Employee ID:', employee.id, 'Type:', typeof employee.id);
    
//     if (!employee.id || typeof employee.id !== 'number' || isNaN(employee.id)) {
//       alert('Cannot edit: Employee has invalid ID');
//       console.error('Employee with invalid ID:', employee);
//       return;
//     }
    
//     // Create a copy with explicit ID
//     const employeeToEdit: Partial<Employee> = {
//       ...employee,
//       id: employee.id, // Ensure ID is explicitly set
//     };
    
//     console.log('Setting currentEmployee to:', employeeToEdit);
//     setCurrentEmployee(employeeToEdit);
//     setModalType('edit');
//   };

//   const handleView = (employee: Employee) => {
//     console.log('View clicked - Employee:', employee);
//     setCurrentEmployee({ ...employee });
//     setModalType('view');
//   };

//   // FIXED: handleDeleteClick with validation
//   const handleDeleteClick = (ids: number[]) => {
//     console.log('Delete clicked - IDs:', ids);
    
//     const validIds = ids.filter((id): id is number => 
//       typeof id === 'number' && !isNaN(id) && id > 0
//     );
    
//     console.log('Valid IDs for deletion:', validIds);
    
//     if (validIds.length === 0) {
//       alert('No valid employees selected for deletion');
//       return;
//     }
    
//     setDeletingIds(validIds);
//     setShowDeleteModal(true);
//   };

//   // FIXED: handleConfirmDelete with proper error handling
//   const handleConfirmDelete = async () => {
//     console.log('Confirming delete for IDs:', deletingIds);
    
//     const validIds = deletingIds.filter((id): id is number => 
//       typeof id === 'number' && !isNaN(id) && id > 0
//     );
    
//     if (validIds.length === 0) {
//       alert('No valid employees to delete');
//       setShowDeleteModal(false);
//       setDeletingIds([]);
//       return;
//     }
    
//     setDeleting(true);
    
//     try {
//       const results = await Promise.allSettled(
//         validIds.map(id => {
//           const deleteUrl = `${API_BASE_URL}/employees/${id}/`;
//           console.log('Deleting:', deleteUrl);
//           return axios.delete(deleteUrl);
//         })
//       );
      
//       const successCount = results.filter(r => r.status === 'fulfilled').length;
//       const failedResults = results.filter(r => r.status === 'rejected');
      
//       if (failedResults.length > 0) {
//         console.error('Failed deletions:', failedResults);
//       }
      
//       setSelectedIds([]);
//       setShowDeleteModal(false);
//       setDeletingIds([]);
//       fetchEmployees();
      
//       if (failedResults.length > 0) {
//         alert(`${successCount} deleted successfully, ${failedResults.length} failed`);
//       } else {
//         alert(`${successCount} employee(s) deleted successfully`);
//       }
//     } catch (err) {
//       console.error('Delete error:', err);
//       alert('Failed to delete employee(s)');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setDepartmentFilter('');
//     setDesignationFilter('');
//   };

//   // Get stats
//   const stats = useMemo(() => ({
//     total: employees.length,
//     departments: departments.length,
//     designations: designations.length,
//   }), [employees, departments, designations]);

//   return (
//     <div className="max-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className=" mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1">
//             <div>
//               <h1 className="text-4xl py-6 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Employee Management
//               </h1>
//               {/* <p className="mt-2 text-gray-600">
//                 Manage your workforce efficiently with bulk operations
//               </p> */}
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => fetchEmployees()}
//                 className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
//               >
//                 <RefreshCw size={18} className="mr-2" />
//                 Refresh
//               </button>
              
//               <button
//                 onClick={handleDownloadTemplate}
//                 className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
//               >
//                 <FileSpreadsheet size={18} className="mr-2" />
//                 Download Template
//               </button>

//               <button
//                 onClick={() => {
//                   setCurrentEmployee({});
//                   setModalType('add');
//                 }}
//                 className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
//               >
//                 <Plus size={18} className="mr-2" />
//                 Add Employee
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-indigo-100 rounded-xl">
//                 <Users className="h-6 w-6 text-indigo-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Employees</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-purple-100 rounded-xl">
//                 <Building2 className="h-6 w-6 text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Departments</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-amber-100 rounded-xl">
//                 <UserCheck className="h-6 w-6 text-amber-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Designations</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.designations}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-3">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 bg-amber-100 rounded-lg">
//               <Upload className="h-1 w-5 text-amber-600" />
//             </div>
//             <h2 className="text-lg font-semibold text-gray-900">Bulk Upload</h2>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-2">
//             <div className="flex-1">
//               <label className="block">
//                 <div className="relative">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".xlsx,.xls"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                     id="file-upload"
//                   />
//                   <label
//                     htmlFor="file-upload"
//                     className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
//                   >
//                     <div className="text-center">
//                       <FileSpreadsheet className="mx-auto h-2 w-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
//                       <p className="mt-2 text-sm text-gray-600">
//                         {file ? (
//                           <span className="font-medium text-indigo-600">{file.name}</span>
//                         ) : (
//                           <>
//                             <span className="font-medium text-indigo-600 hover:text-indigo-500">
//                               Click to upload
//                             </span>
//                             {' '}or drag and drop
//                           </>
//                         )}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">Excel files only (.xlsx, .xls)</p>
//                     </div>
//                   </label>
//                 </div>
//               </label>
//             </div>
            
//             <button
//               onClick={handleUpload}
//               disabled={!file || uploading}
//               className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/25 disabled:shadow-none"
//             >
//               {uploading ? (
//                 <>
//                   <Loader2 className="animate-spin h-1 w-5 mr-2" />
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <Upload size={18} className="mr-2" />
//                   Upload Excel
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Upload Result */}
//         {uploadResult && (
//           <div className={`mb-6 p-5 rounded-2xl border-2 ${
//             uploadResult.success 
//               ? 'bg-emerald-50 border-emerald-200' 
//               : 'bg-red-50 border-red-200'
//           }`}>
//             <div className="flex items-start">
//               {uploadResult.success ? (
//                 <div className="p-2 bg-emerald-100 rounded-lg">
//                   <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//                 </div>
//               ) : (
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <AlertCircle className="h-5 w-5 text-red-600" />
//                 </div>
//               )}
//               <div className="ml-4 flex-1">
//                 <p className={`font-semibold ${uploadResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
//                   {uploadResult.message}
//                 </p>
//                 {uploadResult.errors && uploadResult.errors.length > 0 && (
//                   <div className="mt-3">
//                     <p className="text-sm font-medium text-red-800 mb-2">Errors found:</p>
//                     <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
//                       {uploadResult.errors.map((err: any, i: number) => (
//                         <li key={i} className="bg-red-100 p-2 rounded-lg">
//                           <span className="font-medium">Row {err.row}:</span>{' '}
//                           {JSON.stringify(err.errors || err.error)}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={() => setUploadResult(null)}
//                 className="p-1 rounded-lg hover:bg-black/5 transition-colors"
//               >
//                 <X size={20} className="text-gray-500" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search by ID, name, or email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`inline-flex items-center justify-center px-5 py-3 rounded-xl transition-all ${
//                 showFilters 
//                   ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
//                   : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               <Filter size={18} className="mr-2" />
//               Filters
//               {(departmentFilter || designationFilter) && (
//                 <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
//                   {[departmentFilter, designationFilter].filter(Boolean).length}
//                 </span>
//               )}
//               <ChevronDown size={16} className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//             </button>

//             <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
//               <button
//                 onClick={() => setViewMode('table')}
//                 className={`p-2.5 rounded-lg transition-all ${
//                   viewMode === 'table' 
//                     ? 'bg-white text-indigo-600 shadow-sm' 
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//                 title="Table View"
//               >
//                 <List size={20} />
//               </button>
//               <button
//                 onClick={() => setViewMode('card')}
//                 className={`p-2.5 rounded-lg transition-all ${
//                   viewMode === 'card' 
//                     ? 'bg-white text-indigo-600 shadow-sm' 
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//                 title="Card View"
//               >
//                 <Grid size={20} />
//               </button>
//             </div>
//           </div>

//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                 <select
//                   value={departmentFilter}
//                   onChange={(e) => setDepartmentFilter(e.target.value)}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
//                 >
//                   <option value="">All Departments</option>
//                   {departments.map(dept => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
//                 <select
//                   value={designationFilter}
//                   onChange={(e) => setDesignationFilter(e.target.value)}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
//                 >
//                   <option value="">All Designations</option>
//                   {designations.map(desig => (
//                     <option key={desig} value={desig}>{desig}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-end">
//                 <button
//                   onClick={clearFilters}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-700"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Bulk Actions Bar */}
//         {selectedIds.length > 0 && (
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-3 text-white">
//               <div className="p-2 bg-white/20 rounded-lg">
//                 <UserCheck size={20} />
//               </div>
//               <span className="font-medium">
//                 {selectedIds.length} employee{selectedIds.length > 1 ? 's' : ''} selected
//               </span>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={clearSelection}
//                 className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
//               >
//                 Clear Selection
//               </button>
//               <button
//                 onClick={() => handleDeleteClick([...selectedIds])}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg"
//               >
//                 <Trash2 size={18} />
//                 Delete Selected
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Employee Display */}
//         <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
//           {loading ? (
//             <div className="p-16 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
//                 <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
//               </div>
//               <p className="text-lg font-medium text-gray-900">Loading employees...</p>
//               <p className="text-gray-500 mt-1">Please wait while we fetch the data</p>
//             </div>
//           ) : filteredEmployees.length === 0 ? (
//             <div className="p-16 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//                 <Users className="h-8 w-8 text-gray-400" />
//               </div>
//               {searchTerm || departmentFilter || designationFilter ? (
//                 <>
//                   <p className="text-lg font-medium text-gray-900">No employees found</p>
//                   <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
//                   <button
//                     onClick={clearFilters}
//                     className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
//                   >
//                     Clear Filters
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <p className="text-lg font-medium text-gray-900">No employees found</p>
//                   <p className="text-gray-500 mt-1">Add one manually or upload an Excel file</p>
//                 </>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Table View */}
//               {viewMode === 'table' && (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-4 text-left w-12">
//                           <div className="flex items-center">
//                             <input
//                               type="checkbox"
//                               checked={isAllSelected}
//                               ref={(el) => {
//                                 if (el) el.indeterminate = isSomeSelected;
//                               }}
//                               onClick={handleSelectAllClick}
//                               onChange={handleSelectAllChange}
//                               className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
//                             />
//                           </div>
//                         </th>
//                         <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Emp ID</th>
//                         <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
//                         <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</th>
//                         <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
//                         <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
//                         <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joining Date</th>
//                         <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-100">
//                       {paginatedEmployees.map((emp) => {
//                         // Skip if no valid ID
//                         if (!emp.id || typeof emp.id !== 'number') {
//                           console.warn('Skipping employee without valid ID:', emp);
//                           return null;
//                         }
                        
//                         const isChecked = isEmployeeSelected(emp.id);
                        
//                         return (
//                           <tr 
//                             key={emp.id} 
//                             className={`hover:bg-gray-50 transition-colors ${isChecked ? 'bg-indigo-50/70' : ''}`}
//                           >
//                             <td className="px-4 py-4 w-12">
//                               <div className="flex items-center">
//                                 <input
//                                   type="checkbox"
//                                   checked={isChecked}
//                                   onClick={handleEmployeeCheckboxClick}
//                                   onChange={(e) => handleEmployeeCheckboxChange(e, emp.id)}
//                                   className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
//                                 />
//                               </div>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium">
//                                 {emp.emp_id}
//                               </span>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
//                                   {emp.first_name?.charAt(0) || ''}{emp.last_name?.charAt(0) || ''}
//                                 </div>
//                                 <div>
//                                   <p className="text-sm font-medium text-gray-900">
//                                     {emp.first_name} {emp.last_name}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {emp.sex === 'M' ? 'Male' : emp.sex === 'F' ? 'Female' : 'Other'}
//                                   </p>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{emp.designation || '-'}</td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               {emp.department_name ? (
//                                 <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm">
//                                   {emp.department_name}
//                                 </span>
//                               ) : (
//                                 <span className="text-gray-400">-</span>
//                               )}
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               <div className="text-sm">
//                                 <div className="flex items-center gap-1 text-gray-600">
//                                   <Mail size={14} className="text-gray-400" />
//                                   <span className="truncate max-w-[150px]">{emp.email || '-'}</span>
//                                 </div>
//                                 <div className="flex items-center gap-1 text-gray-500 mt-1">
//                                   <Phone size={14} className="text-gray-400" />
//                                   <span>{emp.phone || '-'}</span>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               <div className="flex items-center gap-1 text-sm text-gray-600">
//                                 <Calendar size={14} className="text-gray-400" />
//                                 <span>{emp.date_of_joining || '-'}</span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap">
//                               <div className="flex items-center justify-center gap-1">
//                                 <button
//                                   type="button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleView(emp);
//                                   }}
//                                   className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
//                                   title="View Details"
//                                 >
//                                   <Eye size={18} />
//                                 </button>
//                                 <button
//                                   type="button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleEdit(emp);
//                                   }}
//                                   className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                                   title="Edit Employee"
//                                 >
//                                   <Edit2 size={18} />
//                                 </button>
//                                 <button
//                                   type="button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDeleteClick([emp.id]);
//                                   }}
//                                   className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                                   title="Delete Employee"
//                                 >
//                                   <Trash2 size={18} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Card View */}
//               {viewMode === 'card' && (
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
//                     <label className="flex items-center gap-3 cursor-pointer select-none">
//                       <input
//                         type="checkbox"
//                         checked={isAllSelected}
//                         ref={(el) => {
//                           if (el) el.indeterminate = isSomeSelected;
//                         }}
//                         onClick={handleSelectAllClick}
//                         onChange={handleSelectAllChange}
//                         className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
//                       />
//                       <span className="text-sm font-medium text-gray-700">
//                         Select all on this page ({currentPageIds.length} items)
//                       </span>
//                     </label>
//                     {selectedIds.length > 0 && (
//                       <span className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-full">
//                         {selectedIds.length} selected
//                       </span>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {paginatedEmployees.map((emp) => {
//                       if (!emp.id || typeof emp.id !== 'number') {
//                         return null;
//                       }
                      
//                       const isChecked = isEmployeeSelected(emp.id);
                      
//                       return (
//                         <div 
//                           key={emp.id} 
//                           className={`bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all ${
//                             isChecked ? 'border-indigo-400 shadow-lg shadow-indigo-100 ring-2 ring-indigo-200' : 'border-gray-100'
//                           }`}
//                         >
//                           <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
//                             <div className="flex items-start justify-between">
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="checkbox"
//                                   checked={isChecked}
//                                   onClick={handleEmployeeCheckboxClick}
//                                   onChange={(e) => handleEmployeeCheckboxChange(e, emp.id)}
//                                   className="w-5 h-5 text-indigo-600 border-2 border-white/50 rounded focus:ring-indigo-500 cursor-pointer bg-white/20"
//                                 />
//                                 <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-semibold text-lg">
//                                   {emp.first_name?.charAt(0) || ''}{emp.last_name?.charAt(0) || ''}
//                                 </div>
//                               </div>
//                               <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs rounded-lg">
//                                 {emp.emp_id}
//                               </span>
//                             </div>
//                             <div className="mt-3">
//                               <h3 className="text-lg font-semibold text-white">
//                                 {emp.first_name} {emp.last_name}
//                               </h3>
//                               <p className="text-white/80 text-sm">
//                                 {emp.designation || 'No designation'}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="p-4">
//                             <div className="space-y-3 text-sm">
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-purple-50 rounded-lg">
//                                   <Building2 size={14} className="text-purple-600" />
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-xs text-gray-500">Department</p>
//                                   <p className="font-medium text-gray-900 truncate">{emp.department_name || '-'}</p>
//                                 </div>
//                               </div>
                              
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-blue-50 rounded-lg">
//                                   <Mail size={14} className="text-blue-600" />
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-xs text-gray-500">Email</p>
//                                   <p className="font-medium text-gray-900 truncate">{emp.email || '-'}</p>
//                                 </div>
//                               </div>
                              
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-green-50 rounded-lg">
//                                   <Phone size={14} className="text-green-600" />
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-xs text-gray-500">Phone</p>
//                                   <p className="font-medium text-gray-900">{emp.phone || '-'}</p>
//                                 </div>
//                               </div>
                              
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-amber-50 rounded-lg">
//                                   <Calendar size={14} className="text-amber-600" />
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-xs text-gray-500">Joined</p>
//                                   <p className="font-medium text-gray-900">{emp.date_of_joining || '-'}</p>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleView(emp);
//                                 }}
//                                 className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-gray-600 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-sm font-medium"
//                               >
//                                 <Eye size={16} />
//                                 View
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleEdit(emp);
//                                 }}
//                                 className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-sm font-medium"
//                               >
//                                 <Edit2 size={16} />
//                                 Edit
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDeleteClick([emp.id]);
//                                 }}
//                                 className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all text-sm font-medium"
//                               >
//                                 <Trash2 size={16} />
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Pagination */}
//               <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     <span className="text-sm text-gray-600">Show:</span>
//                     <select
//                       value={itemsPerPage}
//                       onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                       className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value={5}>5</option>
//                       <option value={10}>10</option>
//                       <option value={25}>25</option>
//                       <option value={50}>50</option>
//                       <option value={100}>100</option>
//                     </select>
//                     <span className="text-sm text-gray-600">per page</span>
//                   </div>

//                   <div className="text-sm text-gray-600">
//                     Showing <span className="font-semibold text-gray-900">{Math.min(((currentPage - 1) * itemsPerPage) + 1, filteredEmployees.length)}</span> to{' '}
//                     <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> of{' '}
//                     <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> results
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => setCurrentPage(1)}
//                       disabled={currentPage === 1}
//                       className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       title="First Page"
//                     >
//                       <div className="flex">
//                         <ChevronLeft size={16} className="-mr-1" />
//                         <ChevronLeft size={16} />
//                       </div>
//                     </button>
                    
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                       disabled={currentPage === 1}
//                       className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       title="Previous Page"
//                     >
//                       <ChevronLeft size={18} />
//                     </button>
                    
//                     <div className="flex gap-1">
//                       {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         let pageNum: number;
//                         if (totalPages <= 5) {
//                           pageNum = i + 1;
//                         } else if (currentPage <= 3) {
//                           pageNum = i + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNum = totalPages - 4 + i;
//                         } else {
//                           pageNum = currentPage - 2 + i;
//                         }
                        
//                         return (
//                           <button
//                             key={pageNum}
//                             onClick={() => setCurrentPage(pageNum)}
//                             className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
//                               currentPage === pageNum
//                                 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
//                                 : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       })}
//                     </div>

//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                       disabled={currentPage === totalPages || totalPages === 0}
//                       className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       title="Next Page"
//                     >
//                       <ChevronRight size={18} />
//                     </button>
                    
//                     <button
//                       onClick={() => setCurrentPage(totalPages)}
//                       disabled={currentPage === totalPages || totalPages === 0}
//                       className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                       title="Last Page"
//                     >
//                       <div className="flex">
//                         <ChevronRight size={16} />
//                         <ChevronRight size={16} className="-ml-1" />
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Add/Edit/View Modal */}
//         {modalType && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//               <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-white/20 rounded-lg">
//                     {modalType === 'add' && <Plus size={20} className="text-white" />}
//                     {modalType === 'edit' && <Edit2 size={20} className="text-white" />}
//                     {modalType === 'view' && <Eye size={20} className="text-white" />}
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-white">
//                       {modalType === 'add' && 'Add New Employee'}
//                       {modalType === 'edit' && 'Edit Employee'}
//                       {modalType === 'view' && 'Employee Details'}
//                     </h2>
//                     {/* DEBUG: Show current employee ID in edit mode */}
//                     {modalType === 'edit' && (
//                       <p className="text-white/70 text-xs">
//                         ID: {currentEmployee.id || 'undefined'} | Emp ID: {currentEmployee.emp_id || 'undefined'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setModalType(null);
//                     setCurrentEmployee({});
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <X size={20} className="text-white" />
//                 </button>
//               </div>

//               <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
//                 {modalType === 'view' ? (
//                   <div className="p-6">
//                     <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
//                       <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
//                         {currentEmployee.first_name?.charAt(0)}{currentEmployee.last_name?.charAt(0)}
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900">
//                           {currentEmployee.first_name} {currentEmployee.last_name}
//                         </h3>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg">
//                             {currentEmployee.emp_id}
//                           </span>
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
//                             {currentEmployee.sex === 'M' ? 'Male' : currentEmployee.sex === 'F' ? 'Female' : 'Other'}
//                           </span>
//                           {/* DEBUG: Show database ID */}
//                           <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-lg">
//                             DB ID: {currentEmployee.id}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <div className="flex items-center gap-2 mb-1">
//                           <UserCheck size={16} className="text-amber-500" />
//                           <p className="text-sm text-gray-500">Designation</p>
//                         </div>
//                         <p className="font-semibold text-gray-900">{currentEmployee.designation || '-'}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Building2 size={16} className="text-purple-500" />
//                           <p className="text-sm text-gray-500">Department</p>
//                         </div>
//                         <p className="font-semibold text-gray-900">{currentEmployee.department_name || '-'}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Mail size={16} className="text-blue-500" />
//                           <p className="text-sm text-gray-500">Email</p>
//                         </div>
//                         <p className="font-semibold text-gray-900">{currentEmployee.email || '-'}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Phone size={16} className="text-green-500" />
//                           <p className="text-sm text-gray-500">Phone</p>
//                         </div>
//                         <p className="font-semibold text-gray-900">{currentEmployee.phone || '-'}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Calendar size={16} className="text-indigo-500" />
//                           <p className="text-sm text-gray-500">Date of Joining</p>
//                         </div>
//                         <p className="font-semibold text-gray-900">{currentEmployee.date_of_joining || '-'}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Calendar size={16} className="text-pink-500" />
//                           <p className="text-sm text-gray-500">Date of Birth</p>
//                         </div>
//                         <p className="font-semibold text-gray-900">{currentEmployee.birth_date || '-'}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <p className="text-sm text-gray-500 mb-1">Current Line</p>
//                         <p className="font-semibold text-gray-900">{currentEmployee.current_line || '-'}</p>
//                       </div>
                      
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <p className="text-sm text-gray-500 mb-1">Current Station</p>
//                         <p className="font-semibold text-gray-900">{currentEmployee.current_station || '-'}</p>
//                       </div>
//                     </div>

//                     <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setModalType(null);
//                           setCurrentEmployee({});
//                         }}
//                         className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
//                       >
//                         Close
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           console.log('Switching to edit mode with employee:', currentEmployee);
//                           setModalType('edit');
//                         }}
//                         className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-blue-200"
//                       >
//                         <Edit2 size={18} />
//                         Edit Employee
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleSaveEmployee} className="p-6 space-y-5">
//                     {/* Hidden field to track the ID */}
//                     {modalType === 'edit' && (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
//                         <strong>Editing Employee:</strong> ID = {currentEmployee.id}, Emp ID = {currentEmployee.emp_id}
//                       </div>
//                     )}
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Employee ID <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={currentEmployee.emp_id || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, emp_id: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
//                           disabled={modalType === 'edit'}
//                           placeholder="Enter employee ID"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           First Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={currentEmployee.first_name || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, first_name: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter first name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Last Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={currentEmployee.last_name || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, last_name: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter last name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
//                         <input
//                           type="text"
//                           value={currentEmployee.designation || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, designation: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter designation"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                         <input
//                           type="text"
//                           value={currentEmployee.department_name || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, department_name: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter department"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Current Line</label>
//                         <input
//                           type="text"
//                           value={currentEmployee.current_line || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, current_line: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter current line"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Current Station</label>
//                         <input
//                           type="text"
//                           value={currentEmployee.current_station || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, current_station: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter current station"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
//                         <input
//                           type="date"
//                           value={currentEmployee.date_of_joining || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, date_of_joining: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
//                         <input
//                           type="date"
//                           value={currentEmployee.birth_date || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, birth_date: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                         <select
//                           value={currentEmployee.sex || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, sex: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                         >
//                           <option value="">Select Gender</option>
//                           <option value="M">Male</option>
//                           <option value="F">Female</option>
//                           <option value="O">Other</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                         <input
//                           type="email"
//                           value={currentEmployee.email || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter email address"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                         <input
//                           type="tel"
//                           value={currentEmployee.phone || ''}
//                           onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
//                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                           placeholder="Enter phone number"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex justify-end gap-3 pt-6 border-t">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setModalType(null);
//                           setCurrentEmployee({});
//                         }}
//                         className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={saving}
//                         className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 flex items-center gap-2 transition-all font-medium shadow-lg shadow-indigo-200 disabled:shadow-none"
//                       >
//                         {saving && <Loader2 className="h-4 w-4 animate-spin" />}
//                         {modalType === 'add' ? 'Add Employee' : 'Save Changes'}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showDeleteModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//               <div className="flex justify-center mb-4">
//                 <div className="p-4 bg-red-100 rounded-full">
//                   <AlertTriangle className="h-8 w-8 text-red-600" />
//                 </div>
//               </div>
              
//               <div className="text-center mb-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
//                 <p className="text-gray-600">
//                   Are you sure you want to delete{' '}
//                   <span className="font-semibold text-gray-900">
//                     {deletingIds.length} employee{deletingIds.length > 1 ? 's' : ''}
//                   </span>
//                   ? This action cannot be undone.
//                 </p>
//                 {/* DEBUG: Show IDs being deleted */}
//                 <p className="text-xs text-gray-400 mt-2">
//                   IDs: {deletingIds.join(', ')}
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowDeleteModal(false);
//                     setDeletingIds([]);
//                   }}
//                   disabled={deleting}
//                   className="flex-1 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleConfirmDelete}
//                   disabled={deleting}
//                   className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-all font-medium shadow-lg shadow-red-200 disabled:shadow-none"
//                 >
//                   {deleting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 size={18} />
//                       Delete
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// src/pages/EmployeeManagement.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { 
  Download, Upload, Plus, Loader2, AlertCircle, CheckCircle2, X, 
  Search, Filter, Grid, List, ChevronLeft, ChevronRight,
  Users, Building2, Mail, Phone, Calendar, UserCheck,
  Eye, RefreshCw, FileSpreadsheet, ChevronDown
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

interface Employee {
  id: number;
  emp_id: string;
  first_name: string;
  last_name: string;
  designation: string;
  department_name: string;
  current_line: string;
  current_station: string | null;
  date_of_joining: string;
  birth_date: string;
  sex: string;
  email?: string;
  phone?: string;
}

// Helper function to extract ID from employee object (handles different API responses)
const getEmployeeId = (emp: any): number | null => {
  const possibleIdFields = ['id', 'pk', '_id', 'employee_id', 'Id', 'ID'];
  
  for (const field of possibleIdFields) {
    if (emp[field] !== undefined && emp[field] !== null) {
      const id = Number(emp[field]);
      if (!isNaN(id)) {
        return id;
      }
    }
  }
  
  return null;
};

// Helper function to normalize employee data from API
const normalizeEmployee = (emp: any): Employee | null => {
  const id = getEmployeeId(emp);
  
  if (id === null) {
    console.warn('Employee without valid ID:', emp);
    return null;
  }
  
  return {
    id,
    emp_id: emp.emp_id || emp.empId || emp.employee_code || '',
    first_name: emp.first_name || emp.firstName || '',
    last_name: emp.last_name || emp.lastName || '',
    designation: emp.designation || '',
    department_name: emp.department_name || emp.departmentName || emp.department || '',
    current_line: emp.current_line || emp.currentLine || '',
    current_station: emp.current_station || emp.currentStation || null,
    date_of_joining: emp.date_of_joining || emp.dateOfJoining || emp.joining_date || '',
    birth_date: emp.birth_date || emp.birthDate || emp.dob || '',
    sex: emp.sex || emp.gender || '',
    email: emp.email || '',
    phone: emp.phone || emp.mobile || emp.contact || '',
  };
};

type ViewMode = 'table' | 'card';
type ModalType = 'add' | 'view' | null;

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    errors?: any[];
  } | null>(null);

  // View and Filter states
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/employees/`);
      
      let rawData = res.data;
      
      if (res.data.results && Array.isArray(res.data.results)) {
        rawData = res.data.results;
      }
      
      const normalizedEmployees = rawData
        .map((emp: any) => normalizeEmployee(emp))
        .filter((emp: Employee | null): emp is Employee => emp !== null);
      
      setEmployees(normalizedEmployees);
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments and designations for filters
  const departments = useMemo(() => {
    const depts = employees.map(e => e.department_name).filter(Boolean);
    return Array.from(new Set(depts)).sort();
  }, [employees]);

  const designations = useMemo(() => {
    const desigs = employees.map(e => e.designation).filter(Boolean);
    return Array.from(new Set(desigs)).sort();
  }, [employees]);

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = searchTerm === '' || 
        emp.emp_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = departmentFilter === '' || emp.department_name === departmentFilter;
      const matchesDesignation = designationFilter === '' || emp.designation === designationFilter;

      return matchesSearch && matchesDepartment && matchesDesignation;
    });
  }, [employees, searchTerm, departmentFilter, designationFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, designationFilter, itemsPerPage]);

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/template/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Employee_Upload_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download template');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/employees/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUploadResult({ success: true, message: res.data.message || 'Upload successful' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchEmployees();
    } catch (error: any) {
      if (error.response?.status === 207) {
        setUploadResult({
          success: false,
          message: error.response.data.message,
          errors: error.response.data.errors,
        });
        fetchEmployees();
      } else {
        setUploadResult({
          success: false,
          message: error.response?.data?.error || 'Upload failed',
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEmployee.emp_id || !currentEmployee.first_name || !currentEmployee.last_name) {
      alert('Employee ID, First Name and Last Name are required');
      return;
    }

    setSaving(true);
    
    try {
      await axios.post(`${API_BASE_URL}/employees/`, currentEmployee);
      alert('Employee added successfully');
      
      setModalType(null);
      setCurrentEmployee({});
      fetchEmployees();
    } catch (err: any) {
      console.error('Save error:', err);
      alert(err.response?.data?.emp_id?.[0] || err.response?.data?.detail || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleView = (employee: Employee) => {
    setCurrentEmployee({ ...employee });
    setModalType('view');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setDesignationFilter('');
  };

  // Get stats
  const stats = useMemo(() => ({
    total: employees.length,
    departments: departments.length,
    designations: designations.length,
  }), [employees, departments, designations]);

  return (
    <div className="max-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1">
            <div>
              <h1 className="text-4xl py-6 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Employee Management
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fetchEmployees()}
                className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <RefreshCw size={18} className="mr-2" />
                Refresh
              </button>
              
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
              >
                <FileSpreadsheet size={18} className="mr-2" />
                Download Template
              </button>

              <button
                onClick={() => {
                  setCurrentEmployee({});
                  setModalType('add');
                }}
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
              >
                <Plus size={18} className="mr-2" />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <UserCheck className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Designations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.designations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Upload className="h-1 w-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Bulk Upload</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <label className="block">
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                  >
                    <div className="text-center">
                      <FileSpreadsheet className="mx-auto h-2 w-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      <p className="mt-2 text-sm text-gray-600">
                        {file ? (
                          <span className="font-medium text-indigo-600">{file.name}</span>
                        ) : (
                          <>
                            <span className="font-medium text-indigo-600 hover:text-indigo-500">
                              Click to upload
                            </span>
                            {' '}or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Excel files only (.xlsx, .xls)</p>
                    </div>
                  </label>
                </div>
              </label>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/25 disabled:shadow-none"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-1 w-5 mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Upload Excel
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div className={`mb-6 p-5 rounded-2xl border-2 ${
            uploadResult.success 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              {uploadResult.success ? (
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              ) : (
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              )}
              <div className="ml-4 flex-1">
                <p className={`font-semibold ${uploadResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                  {uploadResult.message}
                </p>
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-800 mb-2">Errors found:</p>
                    <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                      {uploadResult.errors.map((err: any, i: number) => (
                        <li key={i} className="bg-red-100 p-2 rounded-lg">
                          <span className="font-medium">Row {err.row}:</span>{' '}
                          {JSON.stringify(err.errors || err.error)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={() => setUploadResult(null)}
                className="p-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center px-5 py-3 rounded-xl transition-all ${
                showFilters 
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter size={18} className="mr-2" />
              Filters
              {(departmentFilter || designationFilter) && (
                <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                  {[departmentFilter, designationFilter].filter(Boolean).length}
                </span>
              )}
              <ChevronDown size={16} className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'table' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Table View"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'card' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Card View"
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                <select
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">All Designations</option>
                  {designations.map(desig => (
                    <option key={desig} value={desig}>{desig}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Employee Display */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-lg font-medium text-gray-900">Loading employees...</p>
              <p className="text-gray-500 mt-1">Please wait while we fetch the data</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              {searchTerm || departmentFilter || designationFilter ? (
                <>
                  <p className="text-lg font-medium text-gray-900">No employees found</p>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-900">No employees found</p>
                  <p className="text-gray-500 mt-1">Add one manually or upload an Excel file</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Emp ID</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joining Date</th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedEmployees.map((emp) => {
                        if (!emp.id || typeof emp.id !== 'number') {
                          return null;
                        }
                        
                        return (
                          <tr 
                            key={emp.id} 
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium">
                                {emp.emp_id}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                  {emp.first_name?.charAt(0) || ''}{emp.last_name?.charAt(0) || ''}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {emp.first_name} {emp.last_name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {emp.sex === 'M' ? 'Male' : emp.sex === 'F' ? 'Female' : 'Other'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{emp.designation || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {emp.department_name ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm">
                                  {emp.department_name}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Mail size={14} className="text-gray-400" />
                                  <span className="truncate max-w-[150px]">{emp.email || '-'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500 mt-1">
                                  <Phone size={14} className="text-gray-400" />
                                  <span>{emp.phone || '-'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{emp.date_of_joining || '-'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView(emp);
                                  }}
                                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Card View */}
              {viewMode === 'card' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedEmployees.map((emp) => {
                      if (!emp.id || typeof emp.id !== 'number') {
                        return null;
                      }
                      
                      return (
                        <div 
                          key={emp.id} 
                          className="bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all border-gray-100"
                        >
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-semibold text-lg">
                                  {emp.first_name?.charAt(0) || ''}{emp.last_name?.charAt(0) || ''}
                                </div>
                              </div>
                              <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs rounded-lg">
                                {emp.emp_id}
                              </span>
                            </div>
                            <div className="mt-3">
                              <h3 className="text-lg font-semibold text-white">
                                {emp.first_name} {emp.last_name}
                              </h3>
                              <p className="text-white/80 text-sm">
                                {emp.designation || 'No designation'}
                              </p>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                  <Building2 size={14} className="text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Department</p>
                                  <p className="font-medium text-gray-900 truncate">{emp.department_name || '-'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                  <Mail size={14} className="text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Email</p>
                                  <p className="font-medium text-gray-900 truncate">{emp.email || '-'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                  <Phone size={14} className="text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Phone</p>
                                  <p className="font-medium text-gray-900">{emp.phone || '-'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                  <Calendar size={14} className="text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Joined</p>
                                  <p className="font-medium text-gray-900">{emp.date_of_joining || '-'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(emp);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-gray-600 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-sm font-medium"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{Math.min(((currentPage - 1) * itemsPerPage) + 1, filteredEmployees.length)}</span> to{' '}
                    <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> of{' '}
                    <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="First Page"
                    >
                      <div className="flex">
                        <ChevronLeft size={16} className="-mr-1" />
                        <ChevronLeft size={16} />
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Previous Page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            onClick={() => setCurrentPage(pageNum)}
                            className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Next Page"
                    >
                      <ChevronRight size={18} />
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Last Page"
                    >
                      <div className="flex">
                        <ChevronRight size={16} />
                        <ChevronRight size={16} className="-ml-1" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add/View Modal */}
        {modalType && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {modalType === 'add' && <Plus size={20} className="text-white" />}
                    {modalType === 'view' && <Eye size={20} className="text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {modalType === 'add' && 'Add New Employee'}
                      {modalType === 'view' && 'Employee Details'}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null);
                    setCurrentEmployee({});
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {modalType === 'view' ? (
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {currentEmployee.first_name?.charAt(0)}{currentEmployee.last_name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {currentEmployee.first_name} {currentEmployee.last_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg">
                            {currentEmployee.emp_id}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                            {currentEmployee.sex === 'M' ? 'Male' : currentEmployee.sex === 'F' ? 'Female' : 'Other'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <UserCheck size={16} className="text-amber-500" />
                          <p className="text-sm text-gray-500">Designation</p>
                        </div>
                        <p className="font-semibold text-gray-900">{currentEmployee.designation || '-'}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 size={16} className="text-purple-500" />
                          <p className="text-sm text-gray-500">Department</p>
                        </div>
                        <p className="font-semibold text-gray-900">{currentEmployee.department_name || '-'}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail size={16} className="text-blue-500" />
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                        <p className="font-semibold text-gray-900">{currentEmployee.email || '-'}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone size={16} className="text-green-500" />
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                        <p className="font-semibold text-gray-900">{currentEmployee.phone || '-'}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={16} className="text-indigo-500" />
                          <p className="text-sm text-gray-500">Date of Joining</p>
                        </div>
                        <p className="font-semibold text-gray-900">{currentEmployee.date_of_joining || '-'}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={16} className="text-pink-500" />
                          <p className="text-sm text-gray-500">Date of Birth</p>
                        </div>
                        <p className="font-semibold text-gray-900">{currentEmployee.birth_date || '-'}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Current Line</p>
                        <p className="font-semibold text-gray-900">{currentEmployee.current_line || '-'}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Current Station</p>
                        <p className="font-semibold text-gray-900">{currentEmployee.current_station || '-'}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setModalType(null);
                          setCurrentEmployee({});
                        }}
                        className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveEmployee} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={currentEmployee.emp_id || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, emp_id: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter employee ID"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={currentEmployee.first_name || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, first_name: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={currentEmployee.last_name || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, last_name: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter last name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                        <input
                          type="text"
                          value={currentEmployee.designation || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, designation: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter designation"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <input
                          type="text"
                          value={currentEmployee.department_name || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, department_name: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter department"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Line</label>
                        <input
                          type="text"
                          value={currentEmployee.current_line || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, current_line: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter current line"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Station</label>
                        <input
                          type="text"
                          value={currentEmployee.current_station || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, current_station: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter current station"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
                        <input
                          type="date"
                          value={currentEmployee.date_of_joining || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, date_of_joining: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={currentEmployee.birth_date || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, birth_date: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={currentEmployee.sex || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, sex: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={currentEmployee.email || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={currentEmployee.phone || ''}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setModalType(null);
                          setCurrentEmployee({});
                        }}
                        className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 flex items-center gap-2 transition-all font-medium shadow-lg shadow-indigo-200 disabled:shadow-none"
                      >
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        Add Employee
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}