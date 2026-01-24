// import React, { useState } from 'react';
// import { Users, FileText, CheckCircle, XCircle } from 'lucide-react'; // Added icons for modern design
// // Assuming these paths are correct in your project structure
// import emp1 from '../../assets/Images/emp/emp5.jpeg';
// import emp2 from '../../assets/Images/emp/emp2.jpeg';
// import emp3 from '../../assets/Images/emp/emp3.jpeg';
// import emp4 from '../../assets/Images/emp/emp4.jpeg';

// const FourMChangeResponsibility: React.FC = () => {
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   // CORRECTED: Direct assignment of imported image paths.
//   const employeeImages: Record<string, string> = {
//     parvesh: emp1, // emp1 holds the string path
//     sunil: emp2,  // emp2 holds the string path
//     shiv: emp3,
//     sanjay: emp4,
//   };

//   const handleImageClick = (src: string) => {
//     setPreviewImage(src);
//   };

//   const closePreview = () => {
//     setPreviewImage(null);
//   };

//   // Helper component for the employee photo cell
//   const EmployeePhotoCell: React.FC<{ name: string; phone: string; imageKey: keyof typeof employeeImages }> = ({ name, phone, imageKey }) => {
//     const imgSrc = employeeImages[imageKey];
    
//     // Check if the image source is valid before passing it to the button handler
//     const safeSrc = typeof imgSrc === 'string' ? imgSrc : '';

//     return (
//       <td className="border border-gray-200 p-3 relative text-center bg-white/70 hover:bg-blue-50/50 transition-colors duration-200">
//         <button
//           className="flex flex-col items-center justify-center h-40 w-full focus:outline-none group"
//           onClick={() => safeSrc && handleImageClick(safeSrc)}
//           aria-label={`Preview ${name}'s image`}
//         >
//           <img
//             src={safeSrc}
//             alt={name}
//             className="w-28 h-28 object-cover rounded-full border-4 border-blue-200 group-hover:border-blue-500 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
//             // Fallback placeholder is good practice
//             onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/112?text=Photo')} 
//           />
//           <div className="text-center mt-3">
//             <span className="font-extrabold text-lg text-gray-800">{name.toUpperCase()}</span>
//             <div className='flex items-center justify-center gap-1 text-gray-600 text-sm'>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
//                 <span className='font-medium'>{phone}</span>
//             </div>
//           </div>
//         </button>
//       </td>
//     );
//   };
  
//   // Helper component for styled responsibility cells
//   const ResponsibilityCell: React.FC<{ text: string; gradient: string; tooltip: string }> = ({ text, gradient, tooltip }) => (
//     <td 
//         className={`border border-gray-200 p-4 text-center font-extrabold text-white text-md shadow-inner transition-all duration-300 hover:shadow-xl relative`}
//         style={{ backgroundImage: gradient }}
//         data-tooltip={tooltip}
//         tabIndex={0}
//     >
//       {text}
//     </td>
//   );

//   return (
//     <div className=" min-h-screen p-6">
//       <div className="max-w-full mx-auto">
        
//         {/* Header: Max Attractive Gradient Card */}
//         <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-2xl shadow-blue-500/60 mb-8 relative overflow-hidden p-8">
//             <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                     <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mr-4 border border-white/50">
//                         <Users className="text-white w-7 h-7" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-extrabold tracking-tight">4M Change Responsibility Matrix</h1>
//                         <p className="text-blue-100 text-lg mt-1 font-medium">Defining personnel and duties for controlled manufacturing changes.</p>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         {/* Main Responsibility Table */}
//         <section className="pb-6">
//           <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-x-auto">
//             <div className="rounded-t-3xl overflow-hidden">
//               <table
//                 className="w-full border-collapse text-sm"
//                 aria-label=" 4M Change Responsibility Table"
//                 style={{ minWidth: '1200px' }}
//               >
//                 <thead className="bg-blue-600 text-white">
//                   <tr>
//                     <th
//                       className="p-4 text-left font-extrabold text-lg border-r border-blue-500/50"
//                       rowSpan={2}
//                       scope="col"
//                     >
//                       DESIGNATION
//                     </th>
//                     <th
//                       className="p-4 text-center font-extrabold text-lg"
//                       colSpan={4}
//                       scope="colgroup"
//                     >
//                       DEPARTMENT / PERSONNEL
//                     </th>
//                     <th
//                       className="p-4 text-center font-extrabold text-lg"
//                       rowSpan={2}
//                       scope="col"
//                     >
//                       ALTERNATE CONTACT
//                     </th>
//                   </tr>
//                   <tr className='bg-blue-700/80'>
//                     <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
//                       ENGINEERING
//                     </th>
//                     <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
//                       PRESS SHOP (Supervisor A)
//                     </th>
//                     <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
//                       PRESS SHOP (Supervisor B)
//                     </th>
//                     <th className="p-3 text-center font-semibold border-r border-blue-500/50" scope="col">
//                       WELD SHOP (Supervisor)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-100'>
//                   {/* Row 1: Personnel Photos and Contacts */}
//                   <tr role="row" className="bg-white hover:bg-gray-50 transition-colors duration-300">
//                     <td 
//                       className="border-r border-gray-200 p-3 bg-blue-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider"
//                       data-tooltip="Key personnel responsible for executing 4M changes."
//                       tabIndex={0}
//                     >
//                       Personnel
//                     </td>
//                     <EmployeePhotoCell name="Parvesh" phone="858823584" imageKey="parvesh" />
//                     <EmployeePhotoCell name="Sunil" phone="858823584" imageKey="sunil" />
//                     <EmployeePhotoCell name="Shiv" phone="958742477" imageKey="shiv" />
//                     <EmployeePhotoCell name="Sanjay" phone="946701718" imageKey="sanjay" />
//                     <td
//                       className="border border-gray-200 p-3 text-center bg-green-50/70 font-semibold text-green-700"
//                       data-tooltip="All personnel listed serve as alternate contacts for each other's absence."
//                       tabIndex={0}
//                     >
//                       Alternate to<br />Each Other
//                     </td>
//                   </tr>

//                   {/* Row 2: Responsibilities */}
//                   <tr role="row" className="bg-white hover:bg-gray-50 transition-colors duration-300">
//                     <td
//                       className="border-r border-gray-200 p-3 bg-yellow-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider"
//                       data-tooltip="Core responsibilities associated with the change process."
//                       tabIndex={0}
//                     >
//                       Responsibilities
//                     </td>
//                     <ResponsibilityCell 
//                       text="4M RECORDING" 
//                       gradient="linear-gradient(to right, #3B82F6, #1D4ED8)" 
//                       tooltip="Responsible for initiating and recording the 4M change entry."
//                     />
//                     <ResponsibilityCell 
//                       text="4M CHANGE" 
//                       gradient="linear-gradient(to right, #10B981, #059669)" 
//                       tooltip="Responsible for execution and follow-up validation of the 4M change."
//                     />
//                     <ResponsibilityCell 
//                       text="4M CHANGE" 
//                       gradient="linear-gradient(to right, #10B981, #059669)" 
//                       tooltip="Responsible for execution and follow-up validation of the 4M change."
//                     />
//                     <ResponsibilityCell 
//                       text="4M CHANGE" 
//                       gradient="linear-gradient(to right, #10B981, #059669)" 
//                       tooltip="Responsible for execution and follow-up validation of the 4M change."
//                     />
//                     <td className="border border-gray-200 p-3"></td>
//                   </tr>

//                   {/* Row 3: Document Signatures (Approval/Preparation) */}
//                   <tr role="row" className="bg-white hover:bg-gray-50 transition-colors duration-300">
//                     <td className="border-r border-gray-200 p-3 bg-blue-50/70" data-tooltip="Document Signatories" tabIndex={0}>
//                       <strong className="text-gray-700 text-sm">PREPARED BY:</strong>
//                       <span className="block font-semibold text-gray-800">PARVESH</span>
//                     </td>
//                     <td
//                       className="border border-gray-200 p-3 text-center font-medium"
//                       colSpan={2}
//                       data-tooltip="Signature of the Document Preparer (Parvesh)"
//                       tabIndex={0}
//                     >
//                       <strong className="text-blue-500 block text-lg">Signature Area</strong>
//                       <span className='text-gray-600 text-xs'>PARVESH, Engineer</span>
//                     </td>
//                     <td
//                       className="border border-gray-200 p-3 text-center bg-gray-50/50 font-medium"
//                       colSpan={3}
//                       data-tooltip="Final approval signature of S K Sharma"
//                       tabIndex={0}
//                     >
//                       <strong className="text-gray-700 text-sm">APPROVED BY:</strong>
//                       <span className="block font-semibold text-gray-800 text-lg">S K SHARMA</span>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Custom Tooltip Styling is moved to global CSS or kept inline for portability */}
//             <style>{`
//               td[data-tooltip]:hover::after,
//               td[data-tooltip]:focus::after {
//                 content: attr(data-tooltip);
//                 position: absolute;
//                 bottom: 100%;
//                 left: 50%;
//                 transform: translateX(-50%);
//                 background-color: #1f2937; /* Dark background */
//                 color: white;
//                 padding: 4px 8px;
//                 border-radius: 4px;
//                 font-size: 12px;
//                 white-space: nowrap;
//                 z-index: 20;
//                 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//               }
//             `}</style>
//           </div>
//         </section>

//         {/* Image Preview Modal */}
//         {previewImage && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
//             onClick={closePreview} // Close on backdrop click
//             role="dialog"
//             aria-label="Image Preview Modal"
//           >
//             <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-lg w-[90%] md:w-full" onClick={(e) => e.stopPropagation()}>
//               <button
//                 className="absolute top-2 right-2 text-gray-700 bg-gray-200 p-2 rounded-full hover:text-red-600 hover:bg-gray-300 transition-all"
//                 onClick={closePreview}
//                 aria-label="Close image preview"
//               >
//                 <XCircle className="w-6 h-6" />
//               </button>
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
//                 onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Not+Found')}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FourMChangeResponsibility;














// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import {
//   Users,
//   Plus,
//   Edit2,
//   Trash2,
//   XCircle,
//   Search,
//   Filter,
//   RefreshCw,
//   Phone,
//   UserCheck,
//   UserX,
//   Camera,
//   Save,
//   X,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Building2,
// } from 'lucide-react';

// // ============== TYPES ==============
// interface Shopfloor {
//   id: number;
//   name: string;
//   code?: string;
// }

// interface Personnel {
//   id: number;
//   name: string;
//   photo: string | null;
//   phone_number: string;
//   designation: 'Engineer' | 'Supervisor' | 'Manager' | 'Technician';
//   shopfloor: number | null;
//   shopfloor_details?: Shopfloor;
//   responsibilities: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// interface PersonnelFormData {
//   name: string;
//   photo?: File | null;
//   phone_number: string;
//   designation: string;
//   shopfloor: number | null;
//   responsibilities: string;
//   is_active: boolean;
// }

// const DESIGNATION_CHOICES = [
//   { value: 'Engineer', label: 'Engineer' },
//   { value: 'Supervisor', label: 'Supervisor' },
//   { value: 'Manager', label: 'Manager' },
//   { value: 'Technician', label: 'Technician' },
// ] as const;

// const DESIGNATION_COLORS: Record<string, string> = {
//   Engineer: 'linear-gradient(to right, #3B82F6, #1D4ED8)',
//   Supervisor: 'linear-gradient(to right, #10B981, #059669)',
//   Manager: 'linear-gradient(to right, #8B5CF6, #6D28D9)',
//   Technician: 'linear-gradient(to right, #F59E0B, #D97706)',
// };

// // ============== API CONFIG ==============
// const API_BASE_URL = 'http://localhost:8000/api'; // Adjust to your API URL

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ============== API FUNCTIONS ==============
// const personnelApi = {
//   getAll: async (params?: {
//     shopfloor?: number;
//     designation?: string;
//     is_active?: boolean;
//     search?: string;
//   }): Promise<Personnel[]> => {
//     const response = await api.get('/personnel/', { params });
//     return response.data;
//   },

//   getActive: async (): Promise<Personnel[]> => {
//     const response = await api.get('/personnel/active/');
//     return response.data;
//   },

//   getById: async (id: number): Promise<Personnel> => {
//     const response = await api.get(`/personnel/${id}/`);
//     return response.data;
//   },

//   create: async (data: PersonnelFormData): Promise<Personnel> => {
//     const formData = new FormData();
//     formData.append('name', data.name);
//     formData.append('phone_number', data.phone_number);
//     formData.append('designation', data.designation);
//     formData.append('responsibilities', data.responsibilities);
//     formData.append('is_active', String(data.is_active));

//     if (data.shopfloor) {
//       formData.append('shopfloor', String(data.shopfloor));
//     }

//     if (data.photo) {
//       formData.append('photo', data.photo);
//     }

//     const response = await api.post('/personnel/', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response.data;
//   },

//   update: async (id: number, data: PersonnelFormData): Promise<Personnel> => {
//     const formData = new FormData();
//     formData.append('name', data.name);
//     formData.append('phone_number', data.phone_number);
//     formData.append('designation', data.designation);
//     formData.append('responsibilities', data.responsibilities);
//     formData.append('is_active', String(data.is_active));

//     if (data.shopfloor) {
//       formData.append('shopfloor', String(data.shopfloor));
//     }

//     if (data.photo && data.photo instanceof File) {
//       formData.append('photo', data.photo);
//     }

//     const response = await api.patch(`/personnel/${id}/`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response.data;
//   },

//   delete: async (id: number): Promise<void> => {
//     await api.delete(`/personnel/${id}/`);
//   },

//   toggleActive: async (id: number): Promise<Personnel> => {
//     const response = await api.post(`/personnel/${id}/toggle_active/`);
//     return response.data;
//   },
// };

// const shopfloorApi = {
//   getAll: async (): Promise<Shopfloor[]> => {
//     const response = await api.get('/shopfloors/');
//     return response.data;
//   },
// };

// // ============== TOAST COMPONENT ==============
// interface ToastProps {
//   message: string;
//   type: 'success' | 'error' | 'info';
//   onClose: () => void;
// }

// const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const bgColor = {
//     success: 'bg-green-500',
//     error: 'bg-red-500',
//     info: 'bg-blue-500',
//   }[type];

//   const Icon = {
//     success: CheckCircle,
//     error: AlertCircle,
//     info: AlertCircle,
//   }[type];

//   return (
//     <div
//       className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50`}
//       style={{
//         animation: 'slideIn 0.3s ease-out',
//       }}
//     >
//       <Icon className="w-5 h-5" />
//       <span className="font-medium">{message}</span>
//       <button onClick={onClose} className="ml-2 hover:opacity-80">
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// // ============== PERSONNEL FORM MODAL ==============
// interface PersonnelFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: PersonnelFormData) => Promise<void>;
//   initialData?: Personnel | null;
//   shopfloors: Shopfloor[];
//   isLoading: boolean;
// }

// const PersonnelFormModal: React.FC<PersonnelFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData,
//   shopfloors,
//   isLoading,
// }) => {
//   const [formData, setFormData] = useState<PersonnelFormData>({
//     name: '',
//     photo: null,
//     phone_number: '',
//     designation: 'Supervisor',
//     shopfloor: null,
//     responsibilities: '',
//     is_active: true,
//   });
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name,
//         photo: null,
//         phone_number: initialData.phone_number,
//         designation: initialData.designation,
//         shopfloor: initialData.shopfloor,
//         responsibilities: initialData.responsibilities,
//         is_active: initialData.is_active,
//       });
//       setPhotoPreview(initialData.photo);
//     } else {
//       setFormData({
//         name: '',
//         photo: null,
//         phone_number: '',
//         designation: 'Supervisor',
//         shopfloor: null,
//         responsibilities: '',
//         is_active: true,
//       });
//       setPhotoPreview(null);
//     }
//     setErrors({});
//   }, [initialData, isOpen]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;

//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else if (name === 'shopfloor') {
//       setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : null }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, photo: file }));
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.phone_number.trim()) {
//       newErrors.phone_number = 'Phone number is required';
//     } else if (!/^[\d\s\-+()]+$/.test(formData.phone_number)) {
//       newErrors.phone_number = 'Invalid phone number format';
//     }

//     if (!formData.designation) {
//       newErrors.designation = 'Designation is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     await onSubmit(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div
//         className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Modal Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//               <Users className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">
//                 {initialData ? 'Edit Personnel' : 'Add New Personnel'}
//               </h2>
//               <p className="text-blue-100 text-sm">
//                 {initialData ? 'Update personnel information' : 'Add to 4M responsibility matrix'}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//           <div className="space-y-6">
//             {/* Photo Upload */}
//             <div className="flex flex-col items-center">
//               <div className="relative group">
//                 <div className="w-32 h-32 rounded-full border-4 border-blue-200 overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg">
//                   {photoPreview ? (
//                     <img
//                       src={photoPreview}
//                       alt="Preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <Camera className="w-12 h-12 text-gray-400" />
//                   )}
//                 </div>
//                 <label
//                   htmlFor="photo-upload"
//                   className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
//                 >
//                   <Camera className="w-5 h-5" />
//                 </label>
//                 <input
//                   id="photo-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="hidden"
//                 />
//               </div>
//               <p className="text-sm text-gray-500 mt-2">Click camera icon to upload photo</p>
//             </div>

//             {/* Name Field */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Full Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//                   errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
//                 }`}
//                 placeholder="Enter full name"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Phone Number Field */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="phone_number"
//                   value={formData.phone_number}
//                   onChange={handleInputChange}
//                   className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//                     errors.phone_number
//                       ? 'border-red-500 bg-red-50'
//                       : 'border-gray-200 focus:border-blue-500'
//                   }`}
//                   placeholder="Enter phone number"
//                 />
//               </div>
//               {errors.phone_number && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.phone_number}
//                 </p>
//               )}
//             </div>

//             {/* Designation and Shopfloor Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Designation */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Designation <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="designation"
//                   value={formData.designation}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//                     errors.designation
//                       ? 'border-red-500 bg-red-50'
//                       : 'border-gray-200 focus:border-blue-500'
//                   }`}
//                 >
//                   {DESIGNATION_CHOICES.map((choice) => (
//                     <option key={choice.value} value={choice.value}>
//                       {choice.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.designation && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.designation}
//                   </p>
//                 )}
//               </div>

//               {/* Shopfloor */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Shopfloor / Department
//                 </label>
//                 <select
//                   name="shopfloor"
//                   value={formData.shopfloor || ''}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                 >
//                   <option value="">Select Shopfloor</option>
//                   {shopfloors.map((shop) => (
//                     <option key={shop.id} value={shop.id}>
//                       {shop.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Responsibilities */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Responsibilities
//               </label>
//               <textarea
//                 name="responsibilities"
//                 value={formData.responsibilities}
//                 onChange={handleInputChange}
//                 rows={4}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
//                 placeholder="Enter main responsibilities (one per line)"
//               />
//             </div>

//             {/* Active Status */}
//             <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
//               <input
//                 type="checkbox"
//                 id="is_active"
//                 name="is_active"
//                 checked={formData.is_active}
//                 onChange={handleInputChange}
//                 className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="is_active" className="flex items-center gap-2 cursor-pointer">
//                 {formData.is_active ? (
//                   <UserCheck className="w-5 h-5 text-green-600" />
//                 ) : (
//                   <UserX className="w-5 h-5 text-gray-400" />
//                 )}
//                 <span className="font-medium text-gray-700">
//                   {formData.is_active ? 'Active Personnel' : 'Inactive Personnel'}
//                 </span>
//               </label>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-5 h-5" />
//                   {initialData ? 'Update' : 'Add Personnel'}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ============== DELETE CONFIRM MODAL ==============
// interface DeleteConfirmModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   personnelName: string;
//   isLoading: boolean;
// }

// const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   personnelName,
//   isLoading,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//             <Trash2 className="w-6 h-6 text-red-600" />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">Delete Personnel</h3>
//             <p className="text-gray-500">This action cannot be undone</p>
//           </div>
//         </div>

//         <p className="text-gray-700 mb-6">
//           Are you sure you want to delete <strong className="text-gray-900">{personnelName}</strong>?
//           All associated data will be permanently removed.
//         </p>

//         <div className="flex gap-4">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isLoading}
//             className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Deleting...
//               </>
//             ) : (
//               <>
//                 <Trash2 className="w-5 h-5" />
//                 Delete
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============== EMPLOYEE PHOTO CELL ==============
// interface EmployeePhotoCellProps {
//   personnel: Personnel;
//   onImageClick: (src: string) => void;
//   onEdit: (personnel: Personnel) => void;
//   onDelete: (personnel: Personnel) => void;
//   onToggleActive: (personnel: Personnel) => void;
// }

// const EmployeePhotoCell: React.FC<EmployeePhotoCellProps> = ({
//   personnel,
//   onImageClick,
//   onEdit,
//   onDelete,
//   onToggleActive,
// }) => {
//   const photoUrl = personnel.photo || 'https://via.placeholder.com/112?text=No+Photo';

//   return (
//     <td className="border border-gray-200 p-3 relative text-center bg-white/70 hover:bg-blue-50/50 transition-colors duration-200">
//       <div className="flex flex-col items-center justify-center h-52 w-full min-w-[180px]">
//         {/* Photo */}
//         <button
//           className="focus:outline-none group"
//           onClick={() => personnel.photo && onImageClick(personnel.photo)}
//         >
//           <img
//             src={photoUrl}
//             alt={personnel.name}
//             className="w-24 h-24 object-cover rounded-full border-4 border-blue-200 group-hover:border-blue-500 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
//             onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/112?text=Photo')}
//           />
//         </button>

//         {/* Name and Phone */}
//         <div className="text-center mt-2">
//           <span className="font-extrabold text-base text-gray-800 flex items-center justify-center gap-2">
//             {personnel.name.toUpperCase()}
//             {!personnel.is_active && (
//               <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
//                 Inactive
//               </span>
//             )}
//           </span>
//           <div className="flex items-center justify-center gap-1 text-gray-600 text-sm">
//             <Phone className="w-3 h-3" />
//             <span className="font-medium">{personnel.phone_number}</span>
//           </div>
//           <div className="text-xs text-gray-500 mt-1">
//             {personnel.shopfloor_details?.name || 'No Shopfloor'}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-2 mt-2">
//           <button
//             onClick={() => onEdit(personnel)}
//             className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
//             title="Edit"
//           >
//             <Edit2 className="w-3.5 h-3.5" />
//           </button>
//           <button
//             onClick={() => onToggleActive(personnel)}
//             className={`p-1.5 rounded-lg transition-colors ${
//               personnel.is_active
//                 ? 'bg-green-100 text-green-600 hover:bg-green-200'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//             title={personnel.is_active ? 'Deactivate' : 'Activate'}
//           >
//             {personnel.is_active ? (
//               <UserCheck className="w-3.5 h-3.5" />
//             ) : (
//               <UserX className="w-3.5 h-3.5" />
//             )}
//           </button>
//           <button
//             onClick={() => onDelete(personnel)}
//             className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//             title="Delete"
//           >
//             <Trash2 className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       </div>
//     </td>
//   );
// };

// // ============== RESPONSIBILITY CELL ==============
// interface ResponsibilityCellProps {
//   text: string;
//   gradient: string;
//   responsibilities?: string;
// }

// const ResponsibilityCell: React.FC<ResponsibilityCellProps> = ({
//   text,
//   gradient,
//   responsibilities,
// }) => (
//   <td
//     className="border border-gray-200 p-4 text-center font-extrabold text-white text-sm shadow-inner transition-all duration-300 hover:shadow-xl relative group min-w-[180px]"
//     style={{ backgroundImage: gradient }}
//   >
//     {text}
//     {responsibilities && (
//       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl z-20 w-48">
//         <div className="font-normal text-left whitespace-pre-wrap">{responsibilities}</div>
//         <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
//       </div>
//     )}
//   </td>
// );

// // ============== MAIN COMPONENT ==============
// const FourMChangeResponsibility: React.FC = () => {
//   const [personnel, setPersonnel] = useState<Personnel[]>([]);
//   const [shopfloors, setShopfloors] = useState<Shopfloor[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Modal states
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterDesignation, setFilterDesignation] = useState('');
//   const [filterShopfloor, setFilterShopfloor] = useState('');
//   const [showActiveOnly, setShowActiveOnly] = useState(false);

//   // View toggle
//   const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

//   // Toast state
//   const [toast, setToast] = useState<{
//     message: string;
//     type: 'success' | 'error' | 'info';
//   } | null>(null);

//   // Fetch personnel data
//   const fetchPersonnel = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const params: Record<string, any> = {};
//       if (searchQuery) params.search = searchQuery;
//       if (filterDesignation) params.designation = filterDesignation;
//       if (filterShopfloor) params.shopfloor = parseInt(filterShopfloor);
//       if (showActiveOnly) params.is_active = true;

//       const data = await personnelApi.getAll(params);
//       setPersonnel(data);
//     } catch (err) {
//       setError('Failed to fetch personnel data');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [searchQuery, filterDesignation, filterShopfloor, showActiveOnly]);

//   // Fetch shopfloors
//   const fetchShopfloors = async () => {
//     try {
//       const data = await shopfloorApi.getAll();
//       setShopfloors(data);
//     } catch (err) {
//       console.error('Failed to fetch shopfloors:', err);
//     }
//   };

//   useEffect(() => {
//     fetchPersonnel();
//     fetchShopfloors();
//   }, [fetchPersonnel]);

//   // Handle form submit (add/edit)
//   const handleFormSubmit = async (formData: PersonnelFormData) => {
//     try {
//       setIsSubmitting(true);

//       if (selectedPersonnel) {
//         await personnelApi.update(selectedPersonnel.id, formData);
//         setToast({ message: 'Personnel updated successfully!', type: 'success' });
//       } else {
//         await personnelApi.create(formData);
//         setToast({ message: 'Personnel added successfully!', type: 'success' });
//       }

//       setIsFormModalOpen(false);
//       setSelectedPersonnel(null);
//       fetchPersonnel();
//     } catch (err: any) {
//       setToast({
//         message: err.response?.data?.message || 'Failed to save personnel',
//         type: 'error',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     if (!selectedPersonnel) return;

//     try {
//       setIsSubmitting(true);
//       await personnelApi.delete(selectedPersonnel.id);
//       setToast({ message: 'Personnel deleted successfully!', type: 'success' });
//       setIsDeleteModalOpen(false);
//       setSelectedPersonnel(null);
//       fetchPersonnel();
//     } catch (err) {
//       setToast({ message: 'Failed to delete personnel', type: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle toggle active
//   const handleToggleActive = async (person: Personnel) => {
//     try {
//       await personnelApi.toggleActive(person.id);
//       setToast({
//         message: `${person.name} is now ${person.is_active ? 'inactive' : 'active'}`,
//         type: 'success',
//       });
//       fetchPersonnel();
//     } catch (err) {
//       setToast({ message: 'Failed to update status', type: 'error' });
//     }
//   };

//   // Open edit modal
//   const openEditModal = (person: Personnel) => {
//     setSelectedPersonnel(person);
//     setIsFormModalOpen(true);
//   };

//   // Open delete modal
//   const openDeleteModal = (person: Personnel) => {
//     setSelectedPersonnel(person);
//     setIsDeleteModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-full mx-auto">
//         {/* Toast Notification */}
//         {toast && (
//           <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
//         )}

//         {/* Header */}
//         <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-2xl shadow-blue-500/40 mb-6 relative overflow-hidden p-6 md:p-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
//             <div className="flex items-center">
//               <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center mr-4 border border-white/50">
//                 <Users className="text-white w-6 h-6 md:w-7 md:h-7" />
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
//                   4M Change Responsibility Matrix
//                 </h1>
//                 <p className="text-blue-100 text-sm md:text-lg mt-1 font-medium">
//                   Defining personnel and duties for controlled manufacturing changes.
//                 </p>
//               </div>
//             </div>

//             {/* Add Button */}
//             <button
//               onClick={() => {
//                 setSelectedPersonnel(null);
//                 setIsFormModalOpen(true);
//               }}
//               className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//             >
//               <Plus className="w-5 h-5" />
//               Add Personnel
//             </button>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
//             {/* Search */}
//             <div className="relative flex-1">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, phone, or responsibilities..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//               />
//             </div>

//             {/* Filters Row */}
//             <div className="flex flex-wrap gap-3 items-center">
//               {/* Designation Filter */}
//               <div className="relative">
//                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <select
//                   value={filterDesignation}
//                   onChange={(e) => setFilterDesignation(e.target.value)}
//                   className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white min-w-[160px]"
//                 >
//                   <option value="">All Designations</option>
//                   {DESIGNATION_CHOICES.map((choice) => (
//                     <option key={choice.value} value={choice.value}>
//                       {choice.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Shopfloor Filter */}
//               <div className="relative">
//                 <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <select
//                   value={filterShopfloor}
//                   onChange={(e) => setFilterShopfloor(e.target.value)}
//                   className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white min-w-[150px]"
//                 >
//                   <option value="">All Shopfloors</option>
//                   {shopfloors.map((shop) => (
//                     <option key={shop.id} value={shop.id}>
//                       {shop.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Active Only Toggle */}
//               <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap bg-gray-50 px-4 py-3 rounded-xl">
//                 <input
//                   type="checkbox"
//                   checked={showActiveOnly}
//                   onChange={(e) => setShowActiveOnly(e.target.checked)}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 <span className="font-medium text-gray-700 text-sm">Active Only</span>
//               </label>

//               {/* View Toggle */}
//               <div className="flex items-center bg-gray-100 rounded-xl p-1">
//                 <button
//                   onClick={() => setViewMode('table')}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                     viewMode === 'table'
//                       ? 'bg-white text-blue-600 shadow'
//                       : 'text-gray-600 hover:text-gray-800'
//                   }`}
//                 >
//                   Table
//                 </button>
//                 <button
//                   onClick={() => setViewMode('cards')}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                     viewMode === 'cards'
//                       ? 'bg-white text-blue-600 shadow'
//                       : 'text-gray-600 hover:text-gray-800'
//                   }`}
//                 >
//                   Cards
//                 </button>
//               </div>

//               {/* Refresh Button */}
//               <button
//                 onClick={fetchPersonnel}
//                 disabled={isLoading}
//                 className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
//                 title="Refresh"
//               >
//                 <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
//               </button>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="mt-4 text-sm text-gray-500">
//             Showing <strong className="text-gray-700">{personnel.length}</strong> personnel
//           </div>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
//           </div>
//         )}

//         {/* Error State */}
//         {error && !isLoading && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <p className="text-red-700 font-medium">{error}</p>
//             <button
//               onClick={fetchPersonnel}
//               className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!isLoading && !error && personnel.length === 0 && (
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
//             <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-gray-700 mb-2">No Personnel Found</h3>
//             <p className="text-gray-500 mb-6">
//               {searchQuery || filterDesignation || filterShopfloor
//                 ? 'Try adjusting your search filters.'
//                 : 'Get started by adding your first personnel.'}
//             </p>
//             <button
//               onClick={() => setIsFormModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
//             >
//               <Plus className="w-5 h-5" />
//               Add Personnel
//             </button>
//           </div>
//         )}

//         {/* Table View */}
//         {!isLoading && !error && personnel.length > 0 && viewMode === 'table' && (
//           <section className="pb-6">
//             <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-x-auto">
//               <div className="rounded-t-3xl overflow-hidden">
//                 <table
//                   className="w-full border-collapse text-sm"
//                   aria-label="4M Change Responsibility Table"
//                 >
//                   <thead className="bg-blue-600 text-white">
//                     <tr>
//                       <th
//                         className="p-4 text-left font-extrabold text-lg border-r border-blue-500/50 min-w-[140px]"
//                         scope="col"
//                       >
//                         CATEGORY
//                       </th>
//                       {personnel.map((person) => (
//                         <th
//                           key={person.id}
//                           className="p-3 text-center font-semibold border-r border-blue-500/50 min-w-[180px]"
//                           scope="col"
//                         >
//                           {person.shopfloor_details?.name?.toUpperCase() || 'UNASSIGNED'}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {/* Personnel Row */}
//                     <tr className="bg-white hover:bg-gray-50 transition-colors duration-300">
//                       <td className="border-r border-gray-200 p-3 bg-blue-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider">
//                         Personnel
//                       </td>
//                       {personnel.map((person) => (
//                         <EmployeePhotoCell
//                           key={person.id}
//                           personnel={person}
//                           onImageClick={setPreviewImage}
//                           onEdit={openEditModal}
//                           onDelete={openDeleteModal}
//                           onToggleActive={handleToggleActive}
//                         />
//                       ))}
//                     </tr>

//                     {/* Responsibilities Row */}
//                     <tr className="bg-white hover:bg-gray-50 transition-colors duration-300">
//                       <td className="border-r border-gray-200 p-3 bg-yellow-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider">
//                         Responsibility
//                       </td>
//                       {personnel.map((person) => (
//                         <ResponsibilityCell
//                           key={person.id}
//                           text={person.responsibilities?.split('\n')[0] || '4M CHANGE'}
//                           gradient={
//                             DESIGNATION_COLORS[person.designation] || DESIGNATION_COLORS.Supervisor
//                           }
//                           responsibilities={person.responsibilities}
//                         />
//                       ))}
//                     </tr>

//                     {/* Designation Row */}
//                     <tr className="bg-white hover:bg-gray-50 transition-colors duration-300">
//                       <td className="border-r border-gray-200 p-3 bg-green-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider">
//                         Designation
//                       </td>
//                       {personnel.map((person) => (
//                         <td
//                           key={person.id}
//                           className="border border-gray-200 p-3 text-center font-semibold text-gray-700 min-w-[180px]"
//                         >
//                           <span
//                             className="inline-block px-3 py-1.5 rounded-full text-white text-sm font-bold"
//                             style={{ backgroundImage: DESIGNATION_COLORS[person.designation] }}
//                           >
//                             {person.designation}
//                           </span>
//                         </td>
//                       ))}
//                     </tr>

//                     {/* Alternate Contact Row */}
//                     <tr className="bg-white hover:bg-gray-50 transition-colors duration-300">
//                       <td className="border-r border-gray-200 p-3 bg-purple-50/70 font-extrabold text-center text-gray-800 uppercase tracking-wider">
//                         Alternate
//                       </td>
//                       {personnel.map((person) => (
//                         <td
//                           key={person.id}
//                           className="border border-gray-200 p-3 text-center bg-green-50/50 font-medium text-green-700 min-w-[180px]"
//                         >
//                           Alternate to
//                           <br />
//                           Each Other
//                         </td>
//                       ))}
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Cards View */}
//         {!isLoading && !error && personnel.length > 0 && viewMode === 'cards' && (
//           <section className="pb-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {personnel.map((person) => (
//                 <div
//                   key={person.id}
//                   className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
//                     !person.is_active ? 'opacity-60 border-gray-300' : 'border-gray-100'
//                   }`}
//                 >
//                   {/* Card Header with Gradient */}
//                   <div
//                     className="h-3"
//                     style={{ backgroundImage: DESIGNATION_COLORS[person.designation] }}
//                   />

//                   {/* Card Content */}
//                   <div className="p-6">
//                     <div className="flex items-start gap-4">
//                       <img
//                         src={person.photo || 'https://via.placeholder.com/80?text=Photo'}
//                         alt={person.name}
//                         className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 cursor-pointer hover:border-blue-300 transition-all"
//                         onError={(e) =>
//                           (e.currentTarget.src = 'https://via.placeholder.com/80?text=Photo')
//                         }
//                         onClick={() => person.photo && setPreviewImage(person.photo)}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-bold text-lg text-gray-800 truncate">{person.name}</h3>
//                         <span
//                           className="inline-block px-2 py-0.5 rounded-full text-white text-xs mt-1"
//                           style={{ backgroundImage: DESIGNATION_COLORS[person.designation] }}
//                         >
//                           {person.designation}
//                         </span>
//                         <div className="flex items-center gap-1 text-gray-600 text-sm mt-2">
//                           <Phone className="w-4 h-4 flex-shrink-0" />
//                           <span className="truncate">{person.phone_number}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Shopfloor */}
//                     {person.shopfloor_details && (
//                       <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
//                         <Building2 className="w-4 h-4 text-gray-400" />
//                         <span>{person.shopfloor_details.name}</span>
//                       </div>
//                     )}

//                     {/* Responsibilities */}
//                     {person.responsibilities && (
//                       <div className="mt-3 text-sm text-gray-600">
//                         <strong className="text-gray-700">Responsibilities:</strong>
//                         <p
//                           className="mt-1 text-gray-500 overflow-hidden"
//                           style={{
//                             display: '-webkit-box',
//                             WebkitLineClamp: 2,
//                             WebkitBoxOrient: 'vertical',
//                           }}
//                         >
//                           {person.responsibilities}
//                         </p>
//                       </div>
//                     )}

//                     {/* Status Badge and Actions */}
//                     <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
//                       <span
//                         className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
//                           person.is_active
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-red-100 text-red-700'
//                         }`}
//                       >
//                         {person.is_active ? (
//                           <>
//                             <UserCheck className="w-3 h-3" />
//                             Active
//                           </>
//                         ) : (
//                           <>
//                             <UserX className="w-3 h-3" />
//                             Inactive
//                           </>
//                         )}
//                       </span>

//                       {/* Action Buttons */}
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => openEditModal(person)}
//                           className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
//                           title="Edit"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleToggleActive(person)}
//                           className={`p-2 rounded-lg transition-colors ${
//                             person.is_active
//                               ? 'bg-green-100 text-green-600 hover:bg-green-200'
//                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                           }`}
//                           title={person.is_active ? 'Deactivate' : 'Activate'}
//                         >
//                           {person.is_active ? (
//                             <UserCheck className="w-4 h-4" />
//                           ) : (
//                             <UserX className="w-4 h-4" />
//                           )}
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(person)}
//                           className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Personnel Form Modal */}
//         <PersonnelFormModal
//           isOpen={isFormModalOpen}
//           onClose={() => {
//             setIsFormModalOpen(false);
//             setSelectedPersonnel(null);
//           }}
//           onSubmit={handleFormSubmit}
//           initialData={selectedPersonnel}
//           shopfloors={shopfloors}
//           isLoading={isSubmitting}
//         />

//         {/* Delete Confirmation Modal */}
//         <DeleteConfirmModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => {
//             setIsDeleteModalOpen(false);
//             setSelectedPersonnel(null);
//           }}
//           onConfirm={handleDelete}
//           personnelName={selectedPersonnel?.name || ''}
//           isLoading={isSubmitting}
//         />

//         {/* Image Preview Modal */}
//         {previewImage && (
//           <div
//             className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
//             onClick={() => setPreviewImage(null)}
//           >
//             <div
//               className="relative bg-white rounded-xl shadow-2xl p-4 max-w-2xl w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 className="absolute top-2 right-2 text-gray-700 bg-gray-200 p-2 rounded-full hover:text-red-600 hover:bg-gray-300 transition-all z-10"
//                 onClick={() => setPreviewImage(null)}
//               >
//                 <XCircle className="w-6 h-6" />
//               </button>
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
//                 onError={(e) =>
//                   (e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Not+Found')
//                 }
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Global Styles */}
//       <style>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
        
//         select {
//           background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
//           background-position: right 0.5rem center;
//           background-repeat: no-repeat;
//           background-size: 1.5em 1.5em;
//           padding-right: 2.5rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FourMChangeResponsibility;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Phone,
  UserCheck,
  UserX,
  Camera,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  Sparkles,
  Shield,
  Award,
  Briefcase,
  ChevronDown,
  Eye,
  Grid3X3,
  List,
  Zap,
} from 'lucide-react';

// ============== TYPES ==============
interface Shopfloor {
  id: number;
  name: string;
  code?: string;
}

interface Personnel {
  id: number;
  name: string;
  photo: string | null;
  phone_number: string;
  designation: 'Engineer' | 'Supervisor' | 'Manager' | 'Technician';
  shopfloor: number | null;
  shopfloor_details?: Shopfloor;
  responsibilities: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PersonnelFormData {
  name: string;
  photo?: File | null;
  phone_number: string;
  designation: string;
  shopfloor: number | null;
  responsibilities: string;
  is_active: boolean;
}

const DESIGNATION_CHOICES = [
  { value: 'Engineer', label: 'Engineer', icon: Zap },
  { value: 'Supervisor', label: 'Supervisor', icon: Shield },
  { value: 'Manager', label: 'Manager', icon: Award },
  { value: 'Technician', label: 'Technician', icon: Briefcase },
] as const;

const DESIGNATION_COLORS: Record<
  string,
  { gradient: string; bg: string; text: string; border: string; light: string }
> = {
  Engineer: {
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 50%, #1E40AF 100%)',
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-400',
    light: 'bg-blue-50',
  },
  Supervisor: {
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
    bg: 'bg-emerald-500',
    text: 'text-emerald-600',
    border: 'border-emerald-400',
    light: 'bg-emerald-50',
  },
  Manager: {
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
    bg: 'bg-violet-500',
    text: 'text-violet-600',
    border: 'border-violet-400',
    light: 'bg-violet-50',
  },
  Technician: {
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    border: 'border-amber-400',
    light: 'bg-amber-50',
  },
};

// ============== API CONFIG ==============
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============== API FUNCTIONS ==============
const personnelApi = {
  getAll: async (params?: {
    shopfloor?: number;
    designation?: string;
    is_active?: boolean;
    search?: string;
  }): Promise<Personnel[]> => {
    const response = await api.get('/personnel/', { params });
    return response.data;
  },

  getActive: async (): Promise<Personnel[]> => {
    const response = await api.get('/personnel/active/');
    return response.data;
  },

  getById: async (id: number): Promise<Personnel> => {
    const response = await api.get(`/personnel/${id}/`);
    return response.data;
  },

  create: async (data: PersonnelFormData): Promise<Personnel> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone_number', data.phone_number);
    formData.append('designation', data.designation);
    formData.append('responsibilities', data.responsibilities);
    formData.append('is_active', String(data.is_active));

    if (data.shopfloor) {
      formData.append('shopfloor', String(data.shopfloor));
    }

    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await api.post('/personnel/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: PersonnelFormData): Promise<Personnel> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone_number', data.phone_number);
    formData.append('designation', data.designation);
    formData.append('responsibilities', data.responsibilities);
    formData.append('is_active', String(data.is_active));

    if (data.shopfloor) {
      formData.append('shopfloor', String(data.shopfloor));
    }

    if (data.photo && data.photo instanceof File) {
      formData.append('photo', data.photo);
    }

    const response = await api.patch(`/personnel/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/personnel/${id}/`);
  },

  toggleActive: async (id: number): Promise<Personnel> => {
    const response = await api.post(`/personnel/${id}/toggle_active/`);
    return response.data;
  },
};

const shopfloorApi = {
  getAll: async (): Promise<Shopfloor[]> => {
    const response = await api.get('/shopfloors/');
    return response.data;
  },
};

// ============== TOAST COMPONENT ==============
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-green-600',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: AlertCircle,
    },
  }[type];

  const Icon = styles.icon;

  return (
    <div
      className={`fixed top-6 right-6 ${styles.bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 border border-white/20`}
      style={{
        animation: 'toastSlideIn 0.5s ease-out',
      }}
    >
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-semibold text-base">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 p-2 rounded-full transition-all duration-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ============== PERSONNEL FORM MODAL ==============
interface PersonnelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonnelFormData) => Promise<void>;
  initialData?: Personnel | null;
  shopfloors: Shopfloor[];
  isLoading: boolean;
}

const PersonnelFormModal: React.FC<PersonnelFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  shopfloors,
  isLoading,
}) => {
  const [formData, setFormData] = useState<PersonnelFormData>({
    name: '',
    photo: null,
    phone_number: '',
    designation: 'Supervisor',
    shopfloor: null,
    responsibilities: '',
    is_active: true,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        photo: null,
        phone_number: initialData.phone_number,
        designation: initialData.designation,
        shopfloor: initialData.shopfloor,
        responsibilities: initialData.responsibilities,
        is_active: initialData.is_active,
      });
      setPhotoPreview(initialData.photo);
    } else {
      setFormData({
        name: '',
        photo: null,
        phone_number: '',
        designation: 'Supervisor',
        shopfloor: null,
        responsibilities: '',
        is_active: true,
      });
      setPhotoPreview(null);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'shopfloor') {
      setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid phone number format';
    }

    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  const designationColor =
    DESIGNATION_COLORS[formData.designation] || DESIGNATION_COLORS.Supervisor;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalSlideUp 0.4s ease-out' }}
      >
        {/* Modal Header */}
        <div
          className="px-8 py-6 flex justify-between items-center relative overflow-hidden"
          style={{ background: designationColor.gradient }}
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {initialData ? 'Edit Personnel' : 'Add New Personnel'}
              </h2>
              <p className="text-white/80 text-sm mt-1 font-medium">
                {initialData ? 'Update personnel information' : 'Add to 4M responsibility matrix'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-xl transition-all duration-200 relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div
                  className="w-32 h-32 rounded-full border-4 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-xl"
                  style={{ borderColor: '#ddd' }}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Camera className="w-10 h-10" />
                      <span className="text-xs mt-1">Add Photo</span>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 text-white p-3 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg"
                  style={{ background: designationColor.gradient }}
                >
                  <Camera className="w-5 h-5" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 font-medium">
                Click camera icon to upload photo
              </p>
            </div>

            {/* Name Field */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                </div>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-800 font-medium ${
                  errors.name
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                    : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-green-600" />
                </div>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-800 font-medium ${
                    errors.phone_number
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                      : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white'
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone_number}
                </p>
              )}
            </div>

            {/* Designation and Shopfloor Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Designation */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 appearance-none text-gray-800 font-medium cursor-pointer ${
                      errors.designation
                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white'
                    }`}
                  >
                    {DESIGNATION_CHOICES.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.designation && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {errors.designation}
                  </p>
                )}
              </div>

              {/* Shopfloor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  Shopfloor / Department
                </label>
                <div className="relative">
                  <select
                    name="shopfloor"
                    value={formData.shopfloor || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="">Select Shopfloor</option>
                    {shopfloors.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none text-gray-800 font-medium"
                placeholder="Enter main responsibilities (one per line)"
              />
            </div>

            {/* Active Status */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                formData.is_active
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  formData.is_active ? 'bg-emerald-500 shadow-lg' : 'bg-gray-300'
                }`}
              >
                {formData.is_active ? (
                  <UserCheck className="w-6 h-6 text-white" />
                ) : (
                  <UserX className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-bold text-gray-800 block">
                  {formData.is_active ? 'Active Personnel' : 'Inactive Personnel'}
                </span>
                <span className="text-sm text-gray-500">
                  {formData.is_active
                    ? 'This person is currently active'
                    : 'This person is currently inactive'}
                </span>
              </div>
              <div
                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${
                  formData.is_active ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
              style={{ background: designationColor.gradient }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {initialData ? 'Update Personnel' : 'Add Personnel'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============== DELETE CONFIRM MODAL ==============
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  personnelName: string;
  isLoading: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  personnelName,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: 'modalSlideUp 0.4s ease-out' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
              <Trash2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Delete Personnel</h3>
              <p className="text-white/80 text-sm mt-1">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
            <p className="text-gray-700 text-center">
              Are you sure you want to delete{' '}
              <strong className="text-red-600 font-bold">{personnelName}</strong>?
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                All associated data will be permanently removed.
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== EMPLOYEE PHOTO CELL ==============
interface EmployeePhotoCellProps {
  personnel: Personnel;
  onImageClick: (src: string) => void;
  onEdit: (personnel: Personnel) => void;
  onDelete: (personnel: Personnel) => void;
  onToggleActive: (personnel: Personnel) => void;
}

const EmployeePhotoCell: React.FC<EmployeePhotoCellProps> = ({
  personnel,
  onImageClick,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const photoUrl = personnel.photo || 'https://via.placeholder.com/112?text=No+Photo';
  const designationColor =
    DESIGNATION_COLORS[personnel.designation] || DESIGNATION_COLORS.Supervisor;

  return (
    <td className="border border-gray-200 p-4 relative text-center bg-gradient-to-b from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
      <div className="flex flex-col items-center justify-center h-56 w-full min-w-[200px]">
        {/* Photo */}
        <button
          className="focus:outline-none group relative"
          onClick={() => personnel.photo && onImageClick(personnel.photo)}
        >
          <div
            className="w-24 h-24 rounded-full p-1"
            style={{ background: designationColor.gradient }}
          >
            <img
              src={photoUrl}
              alt={personnel.name}
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-all duration-300"
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/112?text=Photo')}
            />
          </div>
          {personnel.photo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </button>

        {/* Name and Phone */}
        <div className="text-center mt-3 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-base text-gray-800 tracking-tight">
              {personnel.name.toUpperCase()}
            </span>
            {!personnel.is_active && (
              <span className="text-[10px] bg-gradient-to-r from-red-500 to-rose-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                Inactive
              </span>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-gray-100 rounded-full px-3 py-1 mx-auto w-fit">
            <Phone className="w-3.5 h-3.5" />
            <span className="font-semibold">{personnel.phone_number}</span>
          </div>
          <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1">
            <Building2 className="w-3 h-3" />
            {personnel.shopfloor_details?.name || 'No Shopfloor'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onEdit(personnel)}
            className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleActive(personnel)}
            className={`p-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg ${
              personnel.is_active
                ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-500 hover:text-white'
            }`}
            title={personnel.is_active ? 'Deactivate' : 'Activate'}
          >
            {personnel.is_active ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <UserX className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(personnel)}
            className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </td>
  );
};

// ============== RESPONSIBILITY CELL ==============
interface ResponsibilityCellProps {
  text: string;
  gradient: string;
  responsibilities?: string;
}

const ResponsibilityCell: React.FC<ResponsibilityCellProps> = ({
  text,
  gradient,
  responsibilities,
}) => (
  <td
    className="border border-gray-200 p-4 text-center font-bold text-white text-sm shadow-inner transition-all duration-300 hover:shadow-xl relative group min-w-[200px] cursor-pointer"
    style={{ backgroundImage: gradient }}
  >
    <span className="drop-shadow-md">{text}</span>
    {responsibilities && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block z-30">
        <div className="bg-gray-900 text-white text-xs p-4 rounded-xl shadow-2xl w-56 border border-gray-700">
          <div className="font-normal text-left whitespace-pre-wrap leading-relaxed">
            {responsibilities}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    )}
  </td>
);

// ============== MAIN COMPONENT ==============
const FourMChangeResponsibility: React.FC = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [shopfloors, setShopfloors] = useState<Shopfloor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterShopfloor, setFilterShopfloor] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // View toggle
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Fetch personnel data
  const fetchPersonnel = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, any> = {};
      if (searchQuery) params.search = searchQuery;
      if (filterDesignation) params.designation = filterDesignation;
      if (filterShopfloor) params.shopfloor = parseInt(filterShopfloor);
      if (showActiveOnly) params.is_active = true;

      const data = await personnelApi.getAll(params);
      setPersonnel(data);
    } catch (err) {
      setError('Failed to fetch personnel data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterDesignation, filterShopfloor, showActiveOnly]);

  // Fetch shopfloors
  const fetchShopfloors = async () => {
    try {
      const data = await shopfloorApi.getAll();
      setShopfloors(data);
    } catch (err) {
      console.error('Failed to fetch shopfloors:', err);
    }
  };

  useEffect(() => {
    fetchPersonnel();
    fetchShopfloors();
  }, [fetchPersonnel]);

  // Handle form submit (add/edit)
  const handleFormSubmit = async (formData: PersonnelFormData) => {
    try {
      setIsSubmitting(true);

      if (selectedPersonnel) {
        await personnelApi.update(selectedPersonnel.id, formData);
        setToast({ message: 'Personnel updated successfully!', type: 'success' });
      } else {
        await personnelApi.create(formData);
        setToast({ message: 'Personnel added successfully!', type: 'success' });
      }

      setIsFormModalOpen(false);
      setSelectedPersonnel(null);
      fetchPersonnel();
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || 'Failed to save personnel',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPersonnel) return;

    try {
      setIsSubmitting(true);
      await personnelApi.delete(selectedPersonnel.id);
      setToast({ message: 'Personnel deleted successfully!', type: 'success' });
      setIsDeleteModalOpen(false);
      setSelectedPersonnel(null);
      fetchPersonnel();
    } catch (err) {
      setToast({ message: 'Failed to delete personnel', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (person: Personnel) => {
    try {
      await personnelApi.toggleActive(person.id);
      setToast({
        message: `${person.name} is now ${person.is_active ? 'inactive' : 'active'}`,
        type: 'success',
      });
      fetchPersonnel();
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  // Open edit modal
  const openEditModal = (person: Personnel) => {
    setSelectedPersonnel(person);
    setIsFormModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (person: Personnel) => {
    setSelectedPersonnel(person);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Toast Notification */}
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xl mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
              <div className="flex items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/15 rounded-2xl flex items-center justify-center mr-5 border border-white/30 shadow-xl">
                  <Users className="text-white w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
                      4M Change Responsibility
                    </h1>
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-blue-100 text-base md:text-lg font-medium max-w-xl">
                    Defining personnel and duties for controlled manufacturing changes
                  </p>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  setSelectedPersonnel(null);
                  setIsFormModalOpen(true);
                }}
                className="group flex items-center gap-3 bg-white text-blue-700 px-7 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <div className="w-8 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Plus className="w-2 h-6" />
                </div>
                <span className="text-lg">Add Personnel</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {[
                { label: 'Total Personnel', value: personnel.length },
                { label: 'Active', value: personnel.filter((p) => p.is_active).length },
                { label: 'Inactive', value: personnel.filter((p) => !p.is_active).length },
                { label: 'Shopfloors', value: shopfloors.length },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-black mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center">
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, phone, or responsibilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-800 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Designation Filter */}
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-violet-600" />
                <select
                  value={filterDesignation}
                  onChange={(e) => setFilterDesignation(e.target.value)}
                  className="pl-12 pr-10 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-700 min-w-[180px]"
                >
                  <option value="">All Designations</option>
                  {DESIGNATION_CHOICES.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Shopfloor Filter */}
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
                <select
                  value={filterShopfloor}
                  onChange={(e) => setFilterShopfloor(e.target.value)}
                  className="pl-12 pr-10 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer font-medium text-gray-700 min-w-[170px]"
                >
                  <option value="">All Shopfloors</option>
                  {shopfloors.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Active Only Toggle */}
              <button
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                  showActiveOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    showActiveOnly ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                  }`}
                >
                  {showActiveOnly && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                Active Only
              </button>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1.5">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Cards
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchPersonnel}
                disabled={isLoading}
                className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center gap-3 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="font-medium">
              Showing <strong className="text-gray-800">{personnel.length}</strong> personnel
              members
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            </div>
            <p className="mt-6 text-gray-500 font-medium text-lg">Loading personnel data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-10 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 font-medium mb-6">{error}</p>
            <button
              onClick={fetchPersonnel}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && personnel.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Personnel Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery || filterDesignation || filterShopfloor
                ? "Try adjusting your search filters to find what you're looking for."
                : 'Get started by adding your first personnel member to the responsibility matrix.'}
            </p>
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Plus className="w-6 h-6" />
              Add Personnel
            </button>
          </div>
        )}

        {/* Table View */}
        {!isLoading && !error && personnel.length > 0 && viewMode === 'table' && (
          <section className="pb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse text-sm"
                  aria-label="4M Change Responsibility Table"
                >
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                      <th
                        className="p-5 text-left font-black text-lg border-r border-white/20 min-w-[160px] text-white"
                        scope="col"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                          CATEGORY
                        </div>
                      </th>
                      {personnel.map((person) => (
                        <th
                          key={person.id}
                          className="p-4 text-center font-bold border-r border-white/20 min-w-[200px] text-white"
                          scope="col"
                        >
                          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                            {person.shopfloor_details?.name?.toUpperCase() || 'UNASSIGNED'}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Personnel Row */}
                    <tr className="bg-white hover:bg-blue-50 transition-colors duration-300">
                      <td className="border-r border-gray-200 p-4 font-black text-center uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2 bg-blue-50 py-3 px-4 rounded-xl">
                          <Camera className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-800">Personnel</span>
                        </div>
                      </td>
                      {personnel.map((person) => (
                        <EmployeePhotoCell
                          key={person.id}
                          personnel={person}
                          onImageClick={setPreviewImage}
                          onEdit={openEditModal}
                          onDelete={openDeleteModal}
                          onToggleActive={handleToggleActive}
                        />
                      ))}
                    </tr>

                    {/* Responsibilities Row */}
                    <tr className="bg-white hover:bg-yellow-50 transition-colors duration-300">
                      <td className="border-r border-gray-200 p-4 font-black text-center uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2 bg-yellow-50 py-3 px-4 rounded-xl">
                          <Briefcase className="w-5 h-5 text-amber-600" />
                          <span className="text-gray-800">Responsibility</span>
                        </div>
                      </td>
                      {personnel.map((person) => (
                        <ResponsibilityCell
                          key={person.id}
                          text={person.responsibilities?.split('\n')[0] || '4M CHANGE'}
                          gradient={
                            DESIGNATION_COLORS[person.designation]?.gradient ||
                            DESIGNATION_COLORS.Supervisor.gradient
                          }
                          responsibilities={person.responsibilities}
                        />
                      ))}
                    </tr>

                    {/* Designation Row */}
                    <tr className="bg-white hover:bg-green-50 transition-colors duration-300">
                      <td className="border-r border-gray-200 p-4 font-black text-center uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2 bg-green-50 py-3 px-4 rounded-xl">
                          <Award className="w-5 h-5 text-emerald-600" />
                          <span className="text-gray-800">Designation</span>
                        </div>
                      </td>
                      {personnel.map((person) => {
                        const color = DESIGNATION_COLORS[person.designation];
                        return (
                          <td
                            key={person.id}
                            className="border border-gray-200 p-4 text-center min-w-[200px] bg-white"
                          >
                            <span
                              className="inline-block px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-lg"
                              style={{ backgroundImage: color?.gradient }}
                            >
                              {person.designation}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Alternate Contact Row */}
                    <tr className="bg-white hover:bg-purple-50 transition-colors duration-300">
                      <td className="border-r border-gray-200 p-4 font-black text-center uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2 bg-purple-50 py-3 px-4 rounded-xl">
                          <Users className="w-5 h-5 text-violet-600" />
                          <span className="text-gray-800">Alternate</span>
                        </div>
                      </td>
                      {personnel.map((person) => (
                        <td
                          key={person.id}
                          className="border border-gray-200 p-4 text-center min-w-[200px]"
                        >
                          <div className="bg-emerald-50 rounded-xl py-3 px-4">
                            <span className="font-semibold text-emerald-700">
                              Alternate to
                              <br />
                              Each Other
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Cards View */}
        {!isLoading && !error && personnel.length > 0 && viewMode === 'cards' && (
          <section className="pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {personnel.map((person) => {
                const color = DESIGNATION_COLORS[person.designation] || DESIGNATION_COLORS.Supervisor;
                return (
                  <div
                    key={person.id}
                    className={`group bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                      !person.is_active ? 'opacity-70 border-gray-300' : 'border-gray-100'
                    }`}
                  >
                    {/* Card Header with Gradient */}
                    <div
                      className="h-3 transition-all duration-300 group-hover:h-5"
                      style={{ backgroundImage: color.gradient }}
                    />

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div
                            className="w-20 h-20 rounded-full p-1"
                            style={{ background: color.gradient }}
                          >
                            <img
                              src={person.photo || 'https://via.placeholder.com/80?text=Photo'}
                              alt={person.name}
                              className="w-full h-full rounded-full object-cover border-4 border-white cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
                              onError={(e) =>
                                (e.currentTarget.src = 'https://via.placeholder.com/80?text=Photo')
                              }
                              onClick={() => person.photo && setPreviewImage(person.photo)}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-800 truncate">{person.name}</h3>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold mt-1 shadow-md"
                            style={{ backgroundImage: color.gradient }}
                          >
                            {person.designation}
                          </span>
                          <div className="flex items-center gap-2 text-gray-600 text-sm mt-3 bg-gray-100 rounded-full px-3 py-1 w-fit">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate font-medium">{person.phone_number}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shopfloor */}
                      {person.shopfloor_details && (
                        <div className="mt-5 flex items-center gap-3 text-sm text-gray-600 bg-amber-50 rounded-xl p-3">
                          <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-amber-700" />
                          </div>
                          <span className="font-semibold">{person.shopfloor_details.name}</span>
                        </div>
                      )}

                      {/* Responsibilities */}
                      {person.responsibilities && (
                        <div className="mt-4">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Briefcase className="w-3 h-3" />
                            Responsibilities
                          </div>
                          <p
                            className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {person.responsibilities}
                          </p>
                        </div>
                      )}

                      {/* Status Badge and Actions */}
                      <div className="mt-5 flex items-center justify-between pt-5 border-t-2 border-gray-100">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                            person.is_active
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {person.is_active ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4" />
                              Inactive
                            </>
                          )}
                        </span>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(person)}
                            className="p-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(person)}
                            className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg ${
                              person.is_active
                                ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-500 hover:text-white'
                            }`}
                            title={person.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {person.is_active ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openDeleteModal(person)}
                            className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Personnel Form Modal */}
        <PersonnelFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedPersonnel(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={selectedPersonnel}
          shopfloors={shopfloors}
          isLoading={isSubmitting}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPersonnel(null);
          }}
          onConfirm={handleDelete}
          personnelName={selectedPersonnel?.name || ''}
          isLoading={isSubmitting}
        />

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            <div
              className="relative bg-white/10 rounded-2xl shadow-2xl p-2 max-w-3xl w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'modalSlideUp 0.4s ease-out' }}
            >
              <button
                className="absolute -top-4 -right-4 text-white bg-gradient-to-r from-red-500 to-rose-600 p-3 rounded-full hover:from-red-600 hover:to-rose-700 transition-all z-10 shadow-xl"
                onClick={() => setPreviewImage(null)}
              >
                <XCircle className="w-6 h-6" />
              </button>
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                onError={(e) =>
                  (e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Not+Found')
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3B82F6, #6366F1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563EB, #4F46E5);
        }
      `}</style>
    </div>
  );
};

export default FourMChangeResponsibility;