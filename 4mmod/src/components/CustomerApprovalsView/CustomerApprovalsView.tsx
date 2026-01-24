// // CustomerApprovalsPage.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   Calendar,
//   FileText,
//   User,
//   AlertCircle,
//   CheckSquare,
//   Users,
//   Package,
//   Settings,
//   Wrench,
//   Building2,
//   Router,
//   MapPin,
//   Sun,
//   ChevronDown,
//   ChevronUp,
//   Filter, // <--- ADD THIS
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api';

// // Add this at the top with your interfaces
// interface PageProps {
//   setSelectedModule: (id: string) => void;
// }
// interface CustomerApprovalRequest {
//   id: number;
//   change: number;
//   role: number;
//   role_name: string;
//   role_code: string;
//   status: string;
//   approved_by: number | null;
//   approved_by_name: string | null;
//   remarks: string | null;
//   approved_at: string | null;
//   created_at: string;
//   change_details?: {
//     record_id: string;
//     four_m: string;
//     date: string;
//     time: string;
//     shift: string;
//     shopfloor_name: string;
//     line_name: string;
//     station_name: string;
//     category_details: {
//       category_type: string;
//       description: string;
//     };
//     action_details: {
//       action_taken: string;
//       approving_authority: string;
//       remarks?: string;
//     };
//   };
// }

// const categoryIcons: { [key: string]: any } = {
//   Man: Users,
//   'Machine/Tool': Settings,
//   Material: Package,
//   Method: Wrench,
// };

// const categoryColors: { [key: string]: string } = {
//   Man: 'from-blue-600 to-indigo-600',
//   'Machine/Tool': 'from-green-600 to-emerald-600',
//   Material: 'from-purple-600 to-fuchsia-600',
//   Method: 'from-orange-600 to-red-500',
// };

// // const CustomerApprovalsPage: React.FC = () => {
// const CustomerApprovalsPage: React.FC<PageProps> = ({ setSelectedModule }) => {
//   const { user } = useAuth();
//   const [approvals, setApprovals] = useState<CustomerApprovalRequest[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- ADD THIS: State for the Filter ---
//   const [filterId, setFilterId] = useState<string>('');

//   const [error, setError] = useState('');
//   const [actionLoading, setActionLoading] = useState<number | null>(null);
//   const [expandedCard, setExpandedCard] = useState<number | null>(null);
//   const [remarkModal, setRemarkModal] = useState<{
//     show: boolean;
//     approvalId: number | null;
//     action: 'approve' | 'reject' | null;
//     recordId: string;
//   }>({
//     show: false,
//     approvalId: null,
//     action: null,
//     recordId: '',
//   });
//   const [remarks, setRemarks] = useState('');

//   // --- ADD THIS: Effect to catch the ID from the Detail Page ---
//   useEffect(() => {
//     const passedId = localStorage.getItem("filter_change_request_id");
//     if (passedId) {
//       setFilterId(passedId);
//       localStorage.removeItem("filter_change_request_id");
//     }
//   }, []);

//   useEffect(() => {
//     fetchCustomerApprovals();
//   }, []);

//   const fetchCustomerApprovals = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const approvalsResponse = await api.get('/customer-approvals/');
//       let approvalsData = approvalsResponse.data;

//       const customerApprovals = approvalsData.filter(
//         (approval: CustomerApprovalRequest) => approval.role_code === 'CUSTOMER'
//       );

//       const approvalsWithDetails = await Promise.all(
//         customerApprovals.map(async (approval: CustomerApprovalRequest) => {
//           try {
//             const changeResponse = await api.get(`/4m-changes/${approval.change}/`);
//             return {
//               ...approval,
//               change_details: changeResponse.data,
//             };
//           } catch (err) {
//             console.error(`Failed to fetch details for change ${approval.change}`, err);
//             return approval;
//           }
//         })
//       );

//       setApprovals(approvalsWithDetails);
//     } catch (err: any) {
//       console.error('Error fetching customer approvals:', err);
//       setError('Failed to load approval requests. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleApprovalAction = async (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
//   //   try {
//   //     setActionLoading(approvalId);

//   //     const endpoint = `/customer-approvals/${approvalId}/${action}/`;
//   //     await api.post(endpoint, {
//   //       remarks: remarks.trim() || undefined,
//   //     });

//   //     setApprovals((prev) =>
//   //       prev.map((a) =>
//   //         a.id === approvalId
//   //           ? {
//   //               ...a,
//   //               status: action === 'approve' ? 'approved' : 'rejected',
//   //               approved_by_name: user?.name || null,
//   //               approved_at: new Date().toISOString(),
//   //               remarks: remarks.trim() || null,
//   //             }
//   //           : a
//   //       )
//   //     );

//   //     setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
//   //     setRemarks('');

//   //     alert(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} change ${recordId}!`);
//   //   } catch (err: any) {
//   //     console.error('Error processing approval:', err);
//   //     alert(err.response?.data?.error || `Failed to ${action} the request. Please try again.`);
//   //   } finally {
//   //     setActionLoading(null);
//   //   }
//   // };


//   const handleApprovalAction = async (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
//     try {
//       setActionLoading(approvalId);

//       const endpoint = `/customer-approvals/${approvalId}/${action}/`;
//       await api.post(endpoint, {
//         remarks: remarks.trim() || undefined,
//       });

//       // Update local state to remove/update the item
//       setApprovals((prev) =>
//         prev.map((a) =>
//           a.id === approvalId
//             ? {
//                 ...a,
//                 status: action === 'approve' ? 'approved' : 'rejected',
//                 approved_by_name: user?.name || null,
//                 approved_at: new Date().toISOString(),
//                 remarks: remarks.trim() || null,
//               }
//             : a
//         )
//       );

//       // Close modal
//       setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
//       setRemarks('');

//       // --- START: NEW RETURN LOGIC ---
//       // Check if we need to return to the detail page
//       const returnId = localStorage.getItem("return_to_detail_id");
      
//       // If we have a return ID and it matches the record we just acted on
//       if (returnId && recordId === returnId) {
//           alert(`Successfully ${action}ed! Returning to Detail Page...`);
          
//           // 1. Clear the return flag so it doesn't loop
//           // (We keep 'return_to_detail_id' in storage for one more split second 
//           // so the ChangeManagementView knows to open the detail view when it loads)
          
//           // 2. Navigate back to the main module
//           setSelectedModule("cm"); 
//           return; // Stop here
//       }
//       // --- END: NEW RETURN LOGIC ---

//       // Standard alert if just browsing the list normally
//       alert(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} change ${recordId}!`);
      
//     } catch (err: any) {
//       console.error('Error processing approval:', err);
//       alert(err.response?.data?.error || `Failed to ${action} the request. Please try again.`);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const openRemarkModal = (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
//     setRemarkModal({ show: true, approvalId, action, recordId });
//     setRemarks('');
//   };

//   const closeRemarkModal = () => {
//     setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
//     setRemarks('');
//   };

//   const getCategoryColor = (fourM: string) => {
//     return categoryColors[fourM] || 'from-gray-600 to-gray-700';
//   };

//   const getCategoryIcon = (fourM: string) => {
//     return categoryIcons[fourM] || FileText;
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 animate-pulse">PENDING</span>;
//       case 'approved':
//         return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">✓ APPROVED</span>;
//       case 'rejected':
//         return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">✗ REJECTED</span>;
//       default:
//         return null;
//     }
//   };

//   const pendingCount = approvals.filter((a) => a.status === 'pending').length;
//   const approvedCount = approvals.filter((a) => a.status === 'approved').length;
//   const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;

//   // --- ADD THIS: Logic to filter the list ---
//   const displayApprovals = filterId 
//     ? approvals.filter(a => a.change_details?.record_id.toLowerCase().includes(filterId.toLowerCase()))
//     : approvals;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg font-semibold">Loading approval requests...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
//       <div className="mb-8">
//         <div className="flex items-center gap-4 mb-4">
//           <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
//             <CheckSquare className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <h1 className="text-4xl font-extrabold text-gray-900">Customer Approvals</h1>
//             <p className="text-gray-600 text-lg">Review and approve 4M change requests requiring customer authorization</p>
//           </div>
//         </div>

//         {user && (
//           <div className="bg-white border border-blue-200 rounded-xl p-4 flex items-center gap-3 shadow-md">
//             <User className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-700">
//                 Logged in as: <span className="font-bold text-gray-900">{user.name}</span>
//                 <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold">CUSTOMER</span>
//               </p>
//               <p className="text-xs text-gray-600">Email: {user.email} | Department: {user.department}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3 shadow-md">
//           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//           <div>
//             <p className="font-bold text-red-900">Error</p>
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* --- ADD THIS: Filter Banner --- */}
//       {filterId && (
//         <div className="mb-6 bg-blue-100 border border-blue-300 p-4 rounded-xl flex items-center justify-between shadow-sm">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-lg text-blue-600">
//                     <Filter className="w-5 h-5" />
//                 </div>
//                 <div>
//                     <p className="text-blue-900 font-bold text-sm">Filtering by Record ID</p>
//                     <p className="text-blue-700 text-xs">Showing results for: <span className="font-mono font-bold">{filterId}</span></p>
//                 </div>
//             </div>
//             <button 
//                 onClick={() => setFilterId('')}
//                 className="text-sm bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 border border-blue-200 shadow-sm transition-all"
//             >
//                 Clear Filter
//             </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-xl border border-yellow-100 hover:shadow-2xl transition-shadow">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
//               <Clock className="w-7 h-7 text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
//               <p className="text-4xl font-extrabold text-gray-900">{pendingCount}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 hover:shadow-2xl transition-shadow">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//               <CheckCircle className="w-7 h-7 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 font-medium">Approved</p>
//               <p className="text-4xl font-extrabold text-gray-900">{approvedCount}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-xl border border-red-100 hover:shadow-2xl transition-shadow">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//               <XCircle className="w-7 h-7 text-red-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 font-medium">Rejected</p>
//               <p className="text-4xl font-extrabold text-gray-900">{rejectedCount}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-6 flex justify-end">
//         <button onClick={fetchCustomerApprovals} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg flex items-center gap-2">
//           <CheckCircle className="w-5 h-5" />
//           Refresh List
//         </button>
//       </div>

//       {/* {approvals.length === 0 ? ( */}
//       {displayApprovals.length === 0 ? (
//         <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
//           <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 opacity-50" />
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
//           <p className="text-gray-600">You have no pending customer approval requests at this time.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {/* {approvals.map((approval) => { */}
//           {displayApprovals.map((approval) => {
//             const change = approval.change_details;
//             if (!change) return null;

//             const Icon = getCategoryIcon(change.four_m);
//             const gradient = getCategoryColor(change.four_m);
//             const isPending = approval.status === 'pending';
//             const isExpanded = expandedCard === approval.id;

//             return (
//               <div key={approval.id} className={`bg-white rounded-3xl shadow-xl border overflow-hidden transition-all duration-300 ${isPending ? 'border-blue-200 hover:shadow-2xl' : 'border-gray-200 opacity-80'}`}>
//                 <div className={`bg-gradient-to-r ${gradient} p-6 text-white relative`}>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
//                         <Icon className="w-8 h-8" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">{change.record_id}</h3>
//                         <p className="text-white/90 font-medium text-lg">{change.four_m} Change Request</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       {getStatusBadge(approval.status)}
//                       <button onClick={() => setExpandedCard(isExpanded ? null : approval.id)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
//                         {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
//                       <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-xs text-gray-600">Date</p>
//                         <p className="font-bold text-gray-900 text-sm">{new Date(change.date).toLocaleDateString()}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
//                       <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-xs text-gray-600">Time</p>
//                         <p className="font-bold text-gray-900 text-sm">{change.time}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
//                       <Sun className="w-5 h-5 text-yellow-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-xs text-gray-600">Shift</p>
//                         <p className="font-bold text-gray-900 text-sm">Shift {change.shift}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
//                       <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-xs text-gray-600">Type</p>
//                         <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${change.category_details.category_type === 'Planned' ? 'bg-green-200 text-green-800' : change.category_details.category_type === 'Unplanned' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
//                           {change.category_details.category_type}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Building2 className="w-4 h-4 text-blue-600" />
//                         <p className="text-xs text-gray-600 font-semibold">Shopfloor</p>
//                       </div>
//                       <p className="font-bold text-gray-900">{change.shopfloor_name}</p>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Router className="w-4 h-4 text-purple-600" />
//                         <p className="text-xs text-gray-600 font-semibold">Line</p>
//                       </div>
//                       <p className="font-bold text-gray-900">{change.line_name}</p>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                       <div className="flex items-center gap-2 mb-2">
//                         <MapPin className="w-4 h-4 text-green-600" />
//                         <p className="text-xs text-gray-600 font-semibold">Station</p>
//                       </div>
//                       <p className="font-bold text-gray-900">{change.station_name}</p>
//                     </div>
//                   </div>

//                   {isExpanded && (
//                     <div className="space-y-4 border-t border-gray-200 pt-6 mt-6">
//                       <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
//                         <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
//                           <FileText className="w-5 h-5 text-blue-600" />
//                           Change Description
//                         </h4>
//                         <p className="text-gray-800 leading-relaxed">{change.category_details.description}</p>
//                       </div>

//                       <div className="bg-green-50 p-4 rounded-xl border border-green-200">
//                         <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
//                           <CheckCircle className="w-5 h-5 text-green-600" />
//                           Action Taken
//                         </h4>
//                         <p className="text-gray-800 leading-relaxed">{change.action_details.action_taken}</p>
//                       </div>

//                       {change.action_details.remarks && (
//                         <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
//                           <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
//                             <AlertCircle className="w-5 h-5 text-yellow-600" />
//                             Additional Remarks
//                           </h4>
//                           <p className="text-gray-800 italic leading-relaxed">{change.action_details.remarks}</p>
//                         </div>
//                       )}

//                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                         <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
//                           <User className="w-5 h-5 text-indigo-600" />
//                           Approving Authority
//                         </h4>
//                         <p className="text-gray-800 font-semibold">{change.action_details.approving_authority}</p>
//                       </div>
//                     </div>
//                   )}

//                   {!isPending && (
//                     <div className={`mt-6 rounded-xl p-4 border ${approval.status === 'approved' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
//                       <div className="flex items-center gap-3 mb-2">
//                         {approval.status === 'approved' ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
//                         <h4 className={`font-bold text-lg ${approval.status === 'approved' ? 'text-green-900' : 'text-red-900'}`}>
//                           {approval.status === 'approved' ? 'Approved' : 'Rejected'}
//                         </h4>
//                       </div>
//                       {approval.approved_by_name && (
//                         <>
//                           <p className="text-sm text-gray-700"><span className="font-semibold">By:</span> {approval.approved_by_name}</p>
//                           {approval.approved_at && <p className="text-sm text-gray-700"><span className="font-semibold">Date:</span> {new Date(approval.approved_at).toLocaleString()}</p>}
//                         </>
//                       )}
//                       {approval.remarks && (
//                         <div className="mt-3 pt-3 border-t border-gray-300">
//                           <p className="text-xs text-gray-600 font-semibold mb-1">Remarks:</p>
//                           <p className="text-sm text-gray-800 italic">{approval.remarks}</p>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {isPending && (
//                     <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
//                       <button onClick={() => openRemarkModal(approval.id, 'reject', change.record_id)} disabled={actionLoading === approval.id} className="flex-1 py-4 bg-white border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
//                         <XCircle className="w-5 h-5" />
//                         Reject Change
//                       </button>

//                       <button onClick={() => openRemarkModal(approval.id, 'approve', change.record_id)} disabled={actionLoading === approval.id} className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allow">
//                         {actionLoading === approval.id ? (
//                           <>
//                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                             Processing...
//                           </>
//                         ) : (
//                           <>
//                             <CheckCircle className="w-5 h-5" />
//                             Approve Change
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {remarkModal.show && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
//             <div className="flex items-center gap-3 mb-4">
//               {remarkModal.action === 'approve' ? (
//                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                   <CheckCircle className="w-7 h-7 text-green-600" />
//                 </div>
//               ) : (
//                 <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                   <XCircle className="w-7 h-7 text-red-600" />
//                 </div>
//               )}
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">{remarkModal.action === 'approve' ? 'Approve Change' : 'Reject Change'}</h3>
//                 <p className="text-sm text-gray-600">Record ID: {remarkModal.recordId}</p>
//               </div>
//             </div>

//             <p className="text-gray-700 mb-6">
//               {remarkModal.action === 'approve' ? 'You are about to approve this change request. This action will allow the change to proceed.' : 'You are about to reject this change request. Please provide a reason for rejection.'}
//             </p>

//             <div className="mb-6">
//               <label className="block text-sm font-bold text-gray-700 mb-2">
//                 Remarks <span className="text-gray-500 font-normal">{remarkModal.action === 'approve' ? '(Optional)' : '(Required)'}</span>
//               </label>
//               <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full rounded-xl border-2 border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all" rows={4} placeholder={remarkModal.action === 'approve' ? 'Add any comments (optional)...' : 'Please explain why you are rejecting this change...'} />
//             </div>

//             <div className="flex gap-3">
//               <button onClick={closeRemarkModal} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
//                 Cancel
//               </button>
//               <button onClick={() => {
//                 if (remarkModal.action === 'reject' && !remarks.trim()) {
//                   alert('Please provide a reason for rejection.');
//                   return;
//                 }
//                 if (remarkModal.approvalId && remarkModal.action) {
//                   handleApprovalAction(remarkModal.approvalId, remarkModal.action, remarkModal.recordId);
//                 }
//               }} className={`flex-1 px-6 py-3 text-white rounded-xl font-bold transition-colors ${remarkModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
//                 Confirm {remarkModal.action === 'approve' ? 'Approval' : 'Rejection'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerApprovalsPage;



// // CustomerApprovalsPage.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   Calendar,
//   FileText,
//   User,
//   AlertCircle,
//   CheckSquare,
//   Users,
//   Package,
//   Settings,
//   Wrench,
//   Filter,
//   List,
//   X,
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api';

// interface PageProps {
//   setSelectedModule: (id: string) => void;
// }

// interface CustomerApprovalRequest {
//   id: number;
//   change: number;
//   role: number;
//   role_name: string;
//   role_code: string;
//   status: string;
//   approved_by: number | null;
//   approved_by_name: string | null;
//   remarks: string | null;
//   approved_at: string | null;
//   created_at: string;
//   change_details?: {
//     record_id: string;
//     four_m: string;
//     date: string;
//     time: string;
//     shift: string;
//     shopfloor_name: string;
//     line_name: string;
//     station_name: string;
//     category_details: {
//       category_type: string;
//       description: string;
//     };
//     action_details: {
//       action_taken: string;
//       approving_authority: string;
//       remarks?: string;
//     };
//   };
// }

// const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
//   Man: Users,
//   'Machine/Tool': Settings,
//   Material: Package,
//   Method: Wrench,
// };

// const categoryColors: { [key: string]: string } = {
//   Man: 'from-blue-600 to-indigo-600',
//   'Machine/Tool': 'from-green-600 to-emerald-600',
//   Material: 'from-purple-600 to-fuchsia-600',
//   Method: 'from-orange-600 to-red-500',
// };

// const categoryTextColors: { [key: string]: string } = {
//   Man: 'text-blue-600 bg-blue-50 border-blue-200',
//   'Machine/Tool': 'text-green-600 bg-green-50 border-green-200',
//   Material: 'text-purple-600 bg-purple-50 border-purple-200',
//   Method: 'text-orange-600 bg-orange-50 border-orange-200',
// };

// const CustomerApprovalsPage: React.FC<PageProps> = ({ setSelectedModule }) => {
//   const { user } = useAuth();
//   const [approvals, setApprovals] = useState<CustomerApprovalRequest[]>([]);
//   const [allApprovals, setAllApprovals] = useState<CustomerApprovalRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterId, setFilterId] = useState<string>('');
//   const [filterCategory, setFilterCategory] = useState<string>('All');
//   const [selectedApproval, setSelectedApproval] = useState<CustomerApprovalRequest | null>(null);
//   const [error, setError] = useState('');
//   const [actionLoading, setActionLoading] = useState<number | null>(null);
//   const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');
//   const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

//   const [remarkModal, setRemarkModal] = useState<{
//     show: boolean;
//     approvalId: number | null;
//     action: 'approve' | 'reject' | null;
//     recordId: string;
//   }>({
//     show: false,
//     approvalId: null,
//     action: null,
//     recordId: '',
//   });

//   const [remarks, setRemarks] = useState('');

//   useEffect(() => {
//     const passedId = localStorage.getItem('filter_change_request_id');
//     if (passedId) {
//       setFilterId(passedId);
//       localStorage.removeItem('filter_change_request_id');
//     }
//   }, []);

//   useEffect(() => {
//     fetchCustomerApprovals();
//   }, []);

//   const fetchCustomerApprovals = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const approvalsResponse = await api.get('/customer-approvals/');
//       let approvalsData = approvalsResponse.data;

//       // Filter for customer approvals only
//       const customerApprovals = approvalsData.filter(
//         (approval: CustomerApprovalRequest) => approval.role_code === 'CUSTOMER'
//       );

//       const approvalsWithDetails = await Promise.all(
//         customerApprovals.map(async (approval: CustomerApprovalRequest) => {
//           try {
//             const changeResponse = await api.get(`/4m-changes/${approval.change}/`);
//             return {
//               ...approval,
//               change_details: changeResponse.data,
//             };
//           } catch (err) {
//             console.error(`Failed to fetch details for change ${approval.change}`, err);
//             return approval;
//           }
//         })
//       );

//       setAllApprovals(approvalsWithDetails);
//       setApprovals(approvalsWithDetails.filter((a) => a.status === 'pending'));
//     } catch (err: any) {
//       console.error('Error fetching customer approvals:', err);
//       setError('Failed to load approval requests. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprovalAction = async (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
//     try {
//       setActionLoading(approvalId);

//       const endpoint = `/customer-approvals/${approvalId}/${action}/`;
//       await api.post(endpoint, {
//         remarks: remarks.trim() || undefined,
//       });

//       // Update allApprovals
//       setAllApprovals((prev) =>
//         prev.map((a) =>
//           a.id === approvalId
//             ? {
//                 ...a,
//                 status: action === 'approve' ? 'approved' : 'rejected',
//                 approved_by_name: user?.name || null,
//                 approved_at: new Date().toISOString(),
//                 remarks: remarks.trim() || null,
//               }
//             : a
//         )
//       );

//       // Remove from pending list
//       setApprovals((prev) => prev.filter((a) => a.id !== approvalId));

//       setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
//       setRemarks('');

//       setFeedback({
//         type: 'success',
//         message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
//       });
//       setTimeout(() => setFeedback(null), 4000);

//       // Check if we need to return to detail page
//       const returnId = localStorage.getItem('return_to_detail_id');
//       if (returnId && recordId === returnId) {
//         setTimeout(() => setSelectedModule('cm'), 1200);
//       }

//       setSelectedApproval(null);
//     } catch (err: any) {
//       console.error('Error processing approval:', err);
//       setFeedback({
//         type: 'error',
//         message: err.response?.data?.error || `Failed to ${action} the request. Please try again.`,
//       });
//       setTimeout(() => setFeedback(null), 5000);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const openRemarkModal = (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
//     setRemarkModal({ show: true, approvalId, action, recordId });
//     setRemarks('');
//   };

//   const closeRemarkModal = () => {
//     setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
//     setRemarks('');
//   };

//   const getCategoryColor = (fourM: string) => categoryColors[fourM] || 'from-gray-600 to-gray-700';
//   const getCategoryIcon = (fourM: string) => categoryIcons[fourM] || FileText;

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//       approved: 'bg-green-100 text-green-800 border-green-300',
//       rejected: 'bg-red-100 text-red-800 border-red-300',
//     }[status] || 'bg-gray-100 text-gray-800 border-gray-300';

//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
//         {status.toUpperCase()}
//       </span>
//     );
//   };

//   const filteredApprovals = (() => {
//     let data = viewMode === 'pending' ? approvals : allApprovals;
//     if (filterId) {
//       data = allApprovals.filter(
//         (a) => a.change_details?.record_id?.toLowerCase() === filterId.toLowerCase()
//       );
//     }
//     if (filterCategory !== 'All') {
//       data = data.filter((a) => a.change_details?.four_m === filterCategory);
//     }
//     return data;
//   })();

//   const pendingCount = approvals.length;
//   const approvedCount = allApprovals.filter((a) => a.status === 'approved').length;
//   const rejectedCount = allApprovals.filter((a) => a.status === 'rejected').length;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading customer approvals...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       {/* Feedback Toast */}
//       {feedback && (
//         <div className="fixed top-4 right-4 z-50 max-w-sm">
//           <div
//             className={`px-5 py-3 rounded-xl shadow-xl text-white flex items-center gap-3 border-l-4 ${
//               feedback.type === 'success' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'
//             }`}
//           >
//             {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             <span className="font-medium">{feedback.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//         {/* Page Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
//             <CheckSquare className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Customer Approvals</h1>
//             <p className="text-gray-600">Review and approve 4M change requests requiring customer authorization</p>
//           </div>
//         </div>

//         {/* User Info */}
//         {user && (
//           <div className="mb-6 bg-white border border-blue-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
//             <User className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-700">
//                 Logged in as: <span className="font-bold text-gray-900">{user.name}</span>
//                 <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold">CUSTOMER</span>
//               </p>
//               <p className="text-xs text-gray-600">Email: {user.email} | Department: {user.department}</p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
//             <AlertCircle className="text-red-600 mt-0.5" />
//             <p className="text-red-800">{error}</p>
//           </div>
//         )}

//         {/* Filter Banner */}
//         {filterId && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <Filter className="text-blue-600" />
//               <div>
//                 <p className="font-medium text-blue-900">Filtered by ID</p>
//                 <p className="text-blue-700 font-mono">{filterId}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 localStorage.getItem('return_to_detail_id') ? setSelectedModule('cm') : setFilterId('');
//               }}
//               className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50"
//             >
//               Clear
//             </button>
//           </div>
//         )}

//         {/* Controls */}
//         <div className="mb-6 space-y-5">
//           <div className="bg-white rounded-xl shadow border p-5 flex flex-wrap items-center justify-between gap-5">
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-3">
//                 <Clock className="text-yellow-600" />
//                 <span className="text-2xl font-bold">{pendingCount}</span>
//                 <span className="text-gray-600 text-sm">Pending</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="text-green-600" />
//                 <span className="text-2xl font-bold">{approvedCount}</span>
//                 <span className="text-gray-600 text-sm">Approved</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <XCircle className="text-red-600" />
//                 <span className="text-2xl font-bold">{rejectedCount}</span>
//                 <span className="text-gray-600 text-sm">Rejected</span>
//               </div>
//               <div className="flex items-center gap-3 border-l pl-6">
//                 <List className="text-blue-600" />
//                 <span className="text-2xl font-bold">{filteredApprovals.length}</span>
//                 <span className="text-gray-600 text-sm">Showing</span>
//               </div>
//             </div>

//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode('pending')}
//                 className={`px-4 py-2 text-sm rounded-md ${
//                   viewMode === 'pending' ? 'bg-white shadow font-medium' : 'text-gray-600'
//                 }`}
//               >
//                 Pending
//               </button>
//               <button
//                 onClick={() => setViewMode('all')}
//                 className={`px-4 py-2 text-sm rounded-md ${
//                   viewMode === 'all' ? 'bg-white shadow font-medium' : 'text-gray-600'
//                 }`}
//               >
//                 All
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {['All', 'Man', 'Machine/Tool', 'Material', 'Method'].map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setFilterCategory(cat)}
//                 className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
//                   filterCategory === cat
//                     ? 'bg-blue-600 text-white border-blue-600'
//                     : 'bg-white border-gray-300 hover:border-gray-400'
//                 }`}
//               >
//                 {cat === 'Machine/Tool' ? 'Machine' : cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* List Table */}
//         <div className="bg-white rounded-xl shadow border overflow-hidden">
//           {filteredApprovals.length === 0 ? (
//             <div className="py-16 text-center text-gray-500">
//               <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
//               <h3 className="text-xl font-bold text-gray-700 mb-2">All Caught Up!</h3>
//               <p>No matching customer approval requests found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredApprovals.map((approval) => {
//                     const ch = approval.change_details;
//                     if (!ch) return null;
//                     const pending = approval.status === 'pending';

//                     return (
//                       <tr key={approval.id} className={pending ? 'bg-yellow-50/40' : 'hover:bg-gray-50'}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${categoryTextColors[ch.four_m] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>
//                             {React.createElement(getCategoryIcon(ch.four_m), { className: 'w-4 h-4' })}
//                             <span className="text-sm font-medium">{ch.four_m}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap font-medium">{ch.record_id}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>{ch.line_name}</div>
//                           <div className="text-xs text-gray-500">{ch.station_name}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>{new Date(ch.date).toLocaleDateString()}</div>
//                           <div className="text-xs text-gray-500">{ch.time}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(approval.status)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <button
//                             onClick={() => setSelectedApproval(approval)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Fixed-size Detail Popup */}
//         {selectedApproval && selectedApproval.change_details && (
//           <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
//               {/* Slim fixed header */}
//               <div className="bg-gray-50 border-b px-5 py-3 flex justify-between items-center shrink-0">
//                 <h2 className="text-lg font-bold text-gray-800">Request Details</h2>
//                 <button
//                   onClick={() => setSelectedApproval(null)}
//                   className="p-2 rounded-full hover:bg-gray-200"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>

//               {/* Content */}
//               <div className="p-5 flex-1 overflow-auto space-y-4 text-sm">
//                 {(() => {
//                   const ch = selectedApproval.change_details!;
//                   const Icon = getCategoryIcon(ch.four_m);
//                   const gradient = getCategoryColor(ch.four_m);
//                   const pending = selectedApproval.status === 'pending';

//                   return (
//                     <>
//                       <div className={`bg-gradient-to-r ${gradient} rounded-xl px-5 py-4 text-white`}>
//                         <div className="flex items-center justify-between gap-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-white/25 rounded-lg flex items-center justify-center">
//                               <Icon className="w-7 h-7" />
//                             </div>
//                             <div>
//                               <h3 className="text-xl font-bold">{ch.four_m} Change</h3>
//                               <p className="text-sm opacity-90">{ch.record_id}</p>
//                             </div>
//                           </div>
//                           <div className="text-right text-xs">
//                             <div>Shift {ch.shift}</div>
//                             <div className="mt-1">{getStatusBadge(selectedApproval.status)}</div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Calendar className="w-5 h-5 text-blue-600" />
//                             <span className="text-xs text-gray-600">Date</span>
//                           </div>
//                           <div className="font-medium">{new Date(ch.date).toLocaleDateString()}</div>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Clock className="w-5 h-5 text-indigo-600" />
//                             <span className="text-xs text-gray-600">Time</span>
//                           </div>
//                           <div className="font-medium">{ch.time}</div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-3 gap-4">
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs text-gray-600">Shopfloor</div>
//                           <div className="font-medium text-sm">{ch.shopfloor_name}</div>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs text-gray-600">Line</div>
//                           <div className="font-medium text-sm">{ch.line_name}</div>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs text-gray-600">Station</div>
//                           <div className="font-medium text-sm">{ch.station_name}</div>
//                         </div>
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-4">
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs font-semibold text-gray-700 mb-1">Category</div>
//                           <div className="space-y-1">
//                             <span
//                               className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
//                                 ch.category_details.category_type === 'Planned'
//                                   ? 'bg-green-100 text-green-700'
//                                   : ch.category_details.category_type === 'Unplanned'
//                                   ? 'bg-yellow-100 text-yellow-700'
//                                   : 'bg-red-100 text-red-700'
//                               }`}
//                             >
//                               {ch.category_details.category_type}
//                             </span>
//                             <p className="text-sm leading-tight">{ch.category_details.description}</p>
//                           </div>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs font-semibold text-gray-700 mb-1">Authority</div>
//                           <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
//                               <User className="w-4 h-4 text-indigo-700" />
//                             </div>
//                             <span className="font-medium text-sm">{ch.action_details.approving_authority}</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-3 border">
//                         <div className="text-xs font-semibold text-gray-700 mb-1">Action Taken</div>
//                         <div className="bg-white rounded p-3 text-sm border leading-tight">
//                           {ch.action_details.action_taken}
//                         </div>
//                       </div>

//                       {ch.action_details.remarks && (
//                         <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
//                           <div className="text-xs font-semibold text-gray-700 mb-1">Additional Remarks</div>
//                           <p className="text-sm italic leading-tight">{ch.action_details.remarks}</p>
//                         </div>
//                       )}

//                       <div className="bg-gray-50 rounded-lg p-3 border text-xs">
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <span className="text-gray-600">Role:</span>{' '}
//                             <span className="font-medium">{selectedApproval.role_name}</span>
//                           </div>
//                           <div className="text-right">
//                             <span className="text-gray-600">Created:</span>{' '}
//                             <span className="font-medium">
//                               {new Date(selectedApproval.created_at).toLocaleString([], {
//                                 dateStyle: 'medium',
//                                 timeStyle: 'short',
//                               })}
//                             </span>
//                           </div>
//                         </div>

//                         {!pending && selectedApproval.approved_by_name && (
//                           <div className="mt-3 pt-3 border-t border-gray-300">
//                             <div className="flex items-center gap-2">
//                               {selectedApproval.status === 'approved' ? (
//                                 <CheckCircle className="w-4 h-4 text-green-600" />
//                               ) : (
//                                 <XCircle className="w-4 h-4 text-red-600" />
//                               )}
//                               <span className="font-medium">
//                                 {selectedApproval.status === 'approved' ? 'Approved' : 'Rejected'} by{' '}
//                                 {selectedApproval.approved_by_name}
//                               </span>
//                             </div>
//                             {selectedApproval.approved_at && (
//                               <p className="text-xs text-gray-600 mt-1">
//                                 on {new Date(selectedApproval.approved_at).toLocaleString()}
//                               </p>
//                             )}
//                             {selectedApproval.remarks && (
//                               <p className="mt-1 italic text-gray-600 text-xs">
//                                 "{selectedApproval.remarks}"
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {pending && (
//                         <div className="flex flex-col sm:flex-row gap-3 pt-3">
//                           <button
//                             onClick={() => openRemarkModal(selectedApproval.id, 'reject', selectedApproval.change_details!.record_id)}
//                             disabled={actionLoading === selectedApproval.id}
//                             className="flex-1 py-3 bg-white text-red-700 font-semibold rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50 text-base"
//                           >
//                             Reject
//                           </button>
//                           <button
//                             onClick={() => openRemarkModal(selectedApproval.id, 'approve', selectedApproval.change_details!.record_id)}
//                             disabled={actionLoading === selectedApproval.id}
//                             className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 text-base shadow-md"
//                           >
//                             {actionLoading === selectedApproval.id ? 'Processing...' : 'Approve'}
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Remark Modal */}
//         {remarkModal.show && (
//           <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 {remarkModal.action === 'approve' ? (
//                   <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                     <CheckCircle className="w-7 h-7 text-green-600" />
//                   </div>
//                 ) : (
//                   <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                     <XCircle className="w-7 h-7 text-red-600" />
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">
//                     {remarkModal.action === 'approve' ? 'Approve Change' : 'Reject Change'}
//                   </h3>
//                   <p className="text-sm text-gray-600">Record ID: {remarkModal.recordId}</p>
//                 </div>
//               </div>

//               <p className="text-gray-600 mb-5">
//                 {remarkModal.action === 'approve'
//                   ? 'You are about to approve this change request. This action will allow the change to proceed.'
//                   : 'You are about to reject this change request. Please provide a reason for rejection.'}
//               </p>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium mb-2">
//                   Remarks{' '}
//                   <span className="text-gray-500 font-normal">
//                     {remarkModal.action === 'approve' ? '(Optional)' : '(Required)'}
//                   </span>
//                 </label>
//                 <textarea
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                   className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                   placeholder={
//                     remarkModal.action === 'approve'
//                       ? 'Add any comments (optional)...'
//                       : 'Please explain why you are rejecting this change...'
//                   }
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={closeRemarkModal}
//                   className="flex-1 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (remarkModal.action === 'reject' && !remarks.trim()) {
//                       setFeedback({
//                         type: 'error',
//                         message: 'Please provide a reason for rejection.',
//                       });
//                       setTimeout(() => setFeedback(null), 4000);
//                       return;
//                     }
//                     if (remarkModal.approvalId && remarkModal.action) {
//                       handleApprovalAction(remarkModal.approvalId, remarkModal.action, remarkModal.recordId);
//                     }
//                   }}
//                   className={`flex-1 py-3 text-white rounded-lg font-medium text-sm ${
//                     remarkModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   Confirm {remarkModal.action === 'approve' ? 'Approve' : 'Reject'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerApprovalsPage;


// // CustomerApprovalsPage.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   Calendar,
//   FileText,
//   User,
//   AlertCircle,
//   CheckSquare,
//   Users,
//   Package,
//   Settings,
//   Wrench,
//   Filter,
//   List,
//   X,
//   Eye,
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api';

// interface PageProps {
//   setSelectedModule: (id: string) => void;
// }

// interface CustomerApprovalRequest {
//   id: number;
//   change: number;
//   role: number;
//   role_name: string;
//   role_code: string;
//   status: string;
//   approved_by: number | null;
//   approved_by_name: string | null;
//   remarks: string | null;
//   approved_at: string | null;
//   created_at: string;
//   change_details?: {
//     record_id: string;
//     four_m: string;
//     date: string;
//     time: string;
//     shift: string;
//     shopfloor_name: string;
//     line_name: string;
//     station_name: string;
//     category_details: {
//       category_type: string;
//       description: string;
//     };
//     action_details: {
//       action_taken: string;
//       approving_authority: string;
//       remarks?: string;
//     };
//   };
// }

// const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
//   Man: Users,
//   'Machine/Tool': Settings,
//   Material: Package,
//   Method: Wrench,
// };

// const categoryColors: { [key: string]: string } = {
//   Man: 'from-blue-600 to-indigo-600',
//   'Machine/Tool': 'from-green-600 to-emerald-600',
//   Material: 'from-purple-600 to-fuchsia-600',
//   Method: 'from-orange-600 to-red-500',
// };

// const categoryTextColors: { [key: string]: string } = {
//   Man: 'text-blue-600 bg-blue-50 border-blue-200',
//   'Machine/Tool': 'text-green-600 bg-green-50 border-green-200',
//   Material: 'text-purple-600 bg-purple-50 border-purple-200',
//   Method: 'text-orange-600 bg-orange-50 border-orange-200',
// };

// const CustomerApprovalsPage: React.FC<PageProps> = ({ setSelectedModule }) => {
//   const { user } = useAuth();
//   const [approvals, setApprovals] = useState<CustomerApprovalRequest[]>([]);
//   const [allApprovals, setAllApprovals] = useState<CustomerApprovalRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterId, setFilterId] = useState<string>('');
//   const [filterCategory, setFilterCategory] = useState<string>('All');
//   const [selectedApproval, setSelectedApproval] = useState<CustomerApprovalRequest | null>(null);
//   const [error, setError] = useState('');
//   const [actionLoading, setActionLoading] = useState<number | null>(null);
//   const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');
//   const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

//   const [remarkModal, setRemarkModal] = useState<{
//     show: boolean;
//     approvalId: number | null;
//     action: 'approve' | 'reject' | null;
//     recordId: string;
//   }>({
//     show: false,
//     approvalId: null,
//     action: null,
//     recordId: '',
//   });

//   const [remarks, setRemarks] = useState('');

//   useEffect(() => {
//     const passedId = localStorage.getItem('filter_change_request_id');
//     if (passedId) {
//       setFilterId(passedId);
//       localStorage.removeItem('filter_change_request_id');
//     }
//   }, []);

//   useEffect(() => {
//     fetchCustomerApprovals();
//   }, []);

//   const fetchCustomerApprovals = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const approvalsResponse = await api.get('/customer-approvals/');
//       let approvalsData = approvalsResponse.data;

//       // Filter for customer approvals only
//       const customerApprovals = approvalsData.filter(
//         (approval: CustomerApprovalRequest) => approval.role_code === 'CUSTOMER'
//       );

//       const approvalsWithDetails = await Promise.all(
//         customerApprovals.map(async (approval: CustomerApprovalRequest) => {
//           try {
//             const changeResponse = await api.get(`/4m-changes/${approval.change}/`);
//             return {
//               ...approval,
//               change_details: changeResponse.data,
//             };
//           } catch (err) {
//             console.error(`Failed to fetch details for change ${approval.change}`, err);
//             return approval;
//           }
//         })
//       );

//       setAllApprovals(approvalsWithDetails);
//       setApprovals(approvalsWithDetails.filter((a) => a.status === 'pending'));
//     } catch (err: any) {
//       console.error('Error fetching customer approvals:', err);
//       setError('Failed to load approval requests. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprovalAction = async (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
//     try {
//       setActionLoading(approvalId);

//       const endpoint = `/customer-approvals/${approvalId}/${action}/`;
//       await api.post(endpoint, {
//         remarks: remarks.trim() || undefined,
//       });

//       // Update allApprovals
//       setAllApprovals((prev) =>
//         prev.map((a) =>
//           a.id === approvalId
//             ? {
//                 ...a,
//                 status: action === 'approve' ? 'approved' : 'rejected',
//                 approved_by_name: user?.name || null,
//                 approved_at: new Date().toISOString(),
//                 remarks: remarks.trim() || null,
//               }
//             : a
//         )
//       );

//       // Remove from pending list
//       setApprovals((prev) => prev.filter((a) => a.id !== approvalId));

//       setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
//       setRemarks('');

//       setFeedback({
//         type: 'success',
//         message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
//       });
//       setTimeout(() => setFeedback(null), 4000);

//       // Check if we need to return to detail page
//       const returnId = localStorage.getItem('return_to_detail_id');
//       if (returnId && recordId === returnId) {
//         setTimeout(() => setSelectedModule('cm'), 1200);
//       }

//       setSelectedApproval(null);
//     } catch (err: any) {
//       console.error('Error processing approval:', err);
//       setFeedback({
//         type: 'error',
//         message: err.response?.data?.error || `Failed to ${action} the request. Please try again.`,
//       });
//       setTimeout(() => setFeedback(null), 5000);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const openRemarkModal = (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
//     setRemarkModal({ show: true, approvalId, action, recordId });
//     setRemarks('');
//   };

//   const closeRemarkModal = () => {
//     setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
//     setRemarks('');
//   };

//   const getCategoryColor = (fourM: string) => categoryColors[fourM] || 'from-gray-600 to-gray-700';
//   const getCategoryIcon = (fourM: string) => categoryIcons[fourM] || FileText;

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//       approved: 'bg-green-100 text-green-800 border-green-300',
//       rejected: 'bg-red-100 text-red-800 border-red-300',
//     }[status] || 'bg-gray-100 text-gray-800 border-gray-300';

//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
//         {status.toUpperCase()}
//       </span>
//     );
//   };

//   const filteredApprovals = (() => {
//     let data = viewMode === 'pending' ? approvals : allApprovals;
//     if (filterId) {
//       data = allApprovals.filter(
//         (a) => a.change_details?.record_id?.toLowerCase() === filterId.toLowerCase()
//       );
//     }
//     if (filterCategory !== 'All') {
//       data = data.filter((a) => a.change_details?.four_m === filterCategory);
//     }
//     return data;
//   })();

//   const pendingCount = approvals.length;
//   const approvedCount = allApprovals.filter((a) => a.status === 'approved').length;
//   const rejectedCount = allApprovals.filter((a) => a.status === 'rejected').length;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading customer approvals...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       {/* Feedback Toast */}
//       {feedback && (
//         <div className="fixed top-4 right-4 z-50 max-w-sm">
//           <div
//             className={`px-5 py-3 rounded-xl shadow-xl text-white flex items-center gap-3 border-l-4 ${
//               feedback.type === 'success' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'
//             }`}
//           >
//             {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             <span className="font-medium">{feedback.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//         {/* Page Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
//             <CheckSquare className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Customer Approvals</h1>
//             <p className="text-gray-600">Review and approve 4M change requests requiring customer authorization</p>
//           </div>
//         </div>

//         {/* User Info */}
//         {user && (
//           <div className="mb-6 bg-white border border-blue-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
//             <User className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-700">
//                 Logged in as: <span className="font-bold text-gray-900">{user.name}</span>
//                 <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold">CUSTOMER</span>
//               </p>
//               <p className="text-xs text-gray-600">Email: {user.email} | Department: {user.department}</p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
//             <AlertCircle className="text-red-600 mt-0.5" />
//             <p className="text-red-800">{error}</p>
//           </div>
//         )}

//         {/* Filter Banner */}
//         {filterId && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <Filter className="text-blue-600" />
//               <div>
//                 <p className="font-medium text-blue-900">Filtered by ID</p>
//                 <p className="text-blue-700 font-mono">{filterId}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 localStorage.getItem('return_to_detail_id') ? setSelectedModule('cm') : setFilterId('');
//               }}
//               className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50"
//             >
//               Clear
//             </button>
//           </div>
//         )}

//         {/* Controls */}
//         <div className="mb-6 space-y-5">
//           <div className="bg-white rounded-xl shadow border p-5 flex flex-wrap items-center justify-between gap-5">
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-3">
//                 <Clock className="text-yellow-600" />
//                 <span className="text-2xl font-bold">{pendingCount}</span>
//                 <span className="text-gray-600 text-sm">Pending</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="text-green-600" />
//                 <span className="text-2xl font-bold">{approvedCount}</span>
//                 <span className="text-gray-600 text-sm">Approved</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <XCircle className="text-red-600" />
//                 <span className="text-2xl font-bold">{rejectedCount}</span>
//                 <span className="text-gray-600 text-sm">Rejected</span>
//               </div>
//               <div className="flex items-center gap-3 border-l pl-6">
//                 <List className="text-blue-600" />
//                 <span className="text-2xl font-bold">{filteredApprovals.length}</span>
//                 <span className="text-gray-600 text-sm">Showing</span>
//               </div>
//             </div>

//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode('pending')}
//                 className={`px-4 py-2 text-sm rounded-md ${
//                   viewMode === 'pending' ? 'bg-white shadow font-medium' : 'text-gray-600'
//                 }`}
//               >
//                 Pending
//               </button>
//               <button
//                 onClick={() => setViewMode('all')}
//                 className={`px-4 py-2 text-sm rounded-md ${
//                   viewMode === 'all' ? 'bg-white shadow font-medium' : 'text-gray-600'
//                 }`}
//               >
//                 All
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {['All', 'Man', 'Machine/Tool', 'Material', 'Method'].map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setFilterCategory(cat)}
//                 className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
//                   filterCategory === cat
//                     ? 'bg-blue-600 text-white border-blue-600'
//                     : 'bg-white border-gray-300 hover:border-gray-400'
//                 }`}
//               >
//                 {cat === 'Machine/Tool' ? 'Machine' : cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* List Table */}
//         <div className="bg-white rounded-xl shadow border overflow-hidden">
//           {filteredApprovals.length === 0 ? (
//             <div className="py-16 text-center text-gray-500">
//               <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
//               <h3 className="text-xl font-bold text-gray-700 mb-2">All Caught Up!</h3>
//               <p>No matching customer approval requests found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
//                     <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredApprovals.map((approval) => {
//                     const ch = approval.change_details;
//                     if (!ch) return null;
//                     const pending = approval.status === 'pending';
//                     const isLoading = actionLoading === approval.id;

//                     return (
//                       <tr key={approval.id} className={pending ? 'bg-yellow-50/40' : 'hover:bg-gray-50'}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${categoryTextColors[ch.four_m] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>
//                             {React.createElement(getCategoryIcon(ch.four_m), { className: 'w-4 h-4' })}
//                             <span className="text-sm font-medium">{ch.four_m}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap font-medium">{ch.record_id}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>{ch.line_name}</div>
//                           <div className="text-xs text-gray-500">{ch.station_name}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>{new Date(ch.date).toLocaleDateString()}</div>
//                           <div className="text-xs text-gray-500">{ch.time}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(approval.status)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* View Button */}
//                             <button
//                               onClick={() => setSelectedApproval(approval)}
//                               className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
//                               title="View Details"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>

//                             {/* Approve/Reject Buttons - Only show for pending */}
//                             {pending && (
//                               <>
//                                 <button
//                                   onClick={() => openRemarkModal(approval.id, 'approve', ch.record_id)}
//                                   disabled={isLoading}
//                                   className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                   title="Approve"
//                                 >
//                                   {isLoading ? (
//                                     <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
//                                   ) : (
//                                     <CheckCircle className="w-4 h-4" />
//                                   )}
//                                 </button>
//                                 <button
//                                   onClick={() => openRemarkModal(approval.id, 'reject', ch.record_id)}
//                                   disabled={isLoading}
//                                   className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                   title="Reject"
//                                 >
//                                   <XCircle className="w-4 h-4" />
//                                 </button>
//                               </>
//                             )}

//                             {/* Show status indicator for non-pending */}
//                             {!pending && (
//                               <span className="text-xs text-gray-500 italic">
//                                 {approval.status === 'approved' ? 'Approved' : 'Rejected'}
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Fixed-size Detail Popup */}
//         {selectedApproval && selectedApproval.change_details && (
//           <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
//               {/* Slim fixed header */}
//               <div className="bg-gray-50 border-b px-5 py-3 flex justify-between items-center shrink-0">
//                 <h2 className="text-lg font-bold text-gray-800">Request Details</h2>
//                 <button
//                   onClick={() => setSelectedApproval(null)}
//                   className="p-2 rounded-full hover:bg-gray-200"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>

//               {/* Content */}
//               <div className="p-5 flex-1 overflow-auto space-y-4 text-sm">
//                 {(() => {
//                   const ch = selectedApproval.change_details!;
//                   const Icon = getCategoryIcon(ch.four_m);
//                   const gradient = getCategoryColor(ch.four_m);
//                   const pending = selectedApproval.status === 'pending';

//                   return (
//                     <>
//                       <div className={`bg-gradient-to-r ${gradient} rounded-xl px-5 py-4 text-white`}>
//                         <div className="flex items-center justify-between gap-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-white/25 rounded-lg flex items-center justify-center">
//                               <Icon className="w-7 h-7" />
//                             </div>
//                             <div>
//                               <h3 className="text-xl font-bold">{ch.four_m} Change</h3>
//                               <p className="text-sm opacity-90">{ch.record_id}</p>
//                             </div>
//                           </div>
//                           <div className="text-right text-xs">
//                             <div>Shift {ch.shift}</div>
//                             <div className="mt-1">{getStatusBadge(selectedApproval.status)}</div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Calendar className="w-5 h-5 text-blue-600" />
//                             <span className="text-xs text-gray-600">Date</span>
//                           </div>
//                           <div className="font-medium">{new Date(ch.date).toLocaleDateString()}</div>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Clock className="w-5 h-5 text-indigo-600" />
//                             <span className="text-xs text-gray-600">Time</span>
//                           </div>
//                           <div className="font-medium">{ch.time}</div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-3 gap-4">
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs text-gray-600">Shopfloor</div>
//                           <div className="font-medium text-sm">{ch.shopfloor_name}</div>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs text-gray-600">Line</div>
//                           <div className="font-medium text-sm">{ch.line_name}</div>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs text-gray-600">Station</div>
//                           <div className="font-medium text-sm">{ch.station_name}</div>
//                         </div>
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-4">
//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs font-semibold text-gray-700 mb-1">Category</div>
//                           <div className="space-y-1">
//                             <span
//                               className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
//                                 ch.category_details.category_type === 'Planned'
//                                   ? 'bg-green-100 text-green-700'
//                                   : ch.category_details.category_type === 'Unplanned'
//                                   ? 'bg-yellow-100 text-yellow-700'
//                                   : 'bg-red-100 text-red-700'
//                               }`}
//                             >
//                               {ch.category_details.category_type}
//                             </span>
//                             <p className="text-sm leading-tight">{ch.category_details.description}</p>
//                           </div>
//                         </div>

//                         <div className="bg-gray-50 rounded-lg p-3 border">
//                           <div className="text-xs font-semibold text-gray-700 mb-1">Authority</div>
//                           <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
//                               <User className="w-4 h-4 text-indigo-700" />
//                             </div>
//                             <span className="font-medium text-sm">{ch.action_details.approving_authority}</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-3 border">
//                         <div className="text-xs font-semibold text-gray-700 mb-1">Action Taken</div>
//                         <div className="bg-white rounded p-3 text-sm border leading-tight">
//                           {ch.action_details.action_taken}
//                         </div>
//                       </div>

//                       {ch.action_details.remarks && (
//                         <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
//                           <div className="text-xs font-semibold text-gray-700 mb-1">Additional Remarks</div>
//                           <p className="text-sm italic leading-tight">{ch.action_details.remarks}</p>
//                         </div>
//                       )}

//                       <div className="bg-gray-50 rounded-lg p-3 border text-xs">
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <span className="text-gray-600">Role:</span>{' '}
//                             <span className="font-medium">{selectedApproval.role_name}</span>
//                           </div>
//                           <div className="text-right">
//                             <span className="text-gray-600">Created:</span>{' '}
//                             <span className="font-medium">
//                               {new Date(selectedApproval.created_at).toLocaleString([], {
//                                 dateStyle: 'medium',
//                                 timeStyle: 'short',
//                               })}
//                             </span>
//                           </div>
//                         </div>

//                         {!pending && selectedApproval.approved_by_name && (
//                           <div className="mt-3 pt-3 border-t border-gray-300">
//                             <div className="flex items-center gap-2">
//                               {selectedApproval.status === 'approved' ? (
//                                 <CheckCircle className="w-4 h-4 text-green-600" />
//                               ) : (
//                                 <XCircle className="w-4 h-4 text-red-600" />
//                               )}
//                               <span className="font-medium">
//                                 {selectedApproval.status === 'approved' ? 'Approved' : 'Rejected'} by{' '}
//                                 {selectedApproval.approved_by_name}
//                               </span>
//                             </div>
//                             {selectedApproval.approved_at && (
//                               <p className="text-xs text-gray-600 mt-1">
//                                 on {new Date(selectedApproval.approved_at).toLocaleString()}
//                               </p>
//                             )}
//                             {selectedApproval.remarks && (
//                               <p className="mt-1 italic text-gray-600 text-xs">
//                                 "{selectedApproval.remarks}"
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {pending && (
//                         <div className="flex flex-col sm:flex-row gap-3 pt-3">
//                           <button
//                             onClick={() => openRemarkModal(selectedApproval.id, 'reject', selectedApproval.change_details!.record_id)}
//                             disabled={actionLoading === selectedApproval.id}
//                             className="flex-1 py-3 bg-white text-red-700 font-semibold rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50 text-base flex items-center justify-center gap-2"
//                           >
//                             <XCircle className="w-5 h-5" />
//                             Reject
//                           </button>
//                           <button
//                             onClick={() => openRemarkModal(selectedApproval.id, 'approve', selectedApproval.change_details!.record_id)}
//                             disabled={actionLoading === selectedApproval.id}
//                             className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 text-base shadow-md flex items-center justify-center gap-2"
//                           >
//                             {actionLoading === selectedApproval.id ? (
//                               <>
//                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                 Processing...
//                               </>
//                             ) : (
//                               <>
//                                 <CheckCircle className="w-5 h-5" />
//                                 Approve
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Remark Modal */}
//         {remarkModal.show && (
//           <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 {remarkModal.action === 'approve' ? (
//                   <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                     <CheckCircle className="w-7 h-7 text-green-600" />
//                   </div>
//                 ) : (
//                   <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                     <XCircle className="w-7 h-7 text-red-600" />
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">
//                     {remarkModal.action === 'approve' ? 'Approve Change' : 'Reject Change'}
//                   </h3>
//                   <p className="text-sm text-gray-600">Record ID: {remarkModal.recordId}</p>
//                 </div>
//               </div>

//               <p className="text-gray-600 mb-5">
//                 {remarkModal.action === 'approve'
//                   ? 'You are about to approve this change request. This action will allow the change to proceed.'
//                   : 'You are about to reject this change request. Please provide a reason for rejection.'}
//               </p>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium mb-2">
//                   Remarks{' '}
//                   <span className="text-gray-500 font-normal">
//                     {remarkModal.action === 'approve' ? '(Optional)' : '(Required)'}
//                   </span>
//                 </label>
//                 <textarea
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                   className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                   placeholder={
//                     remarkModal.action === 'approve'
//                       ? 'Add any comments (optional)...'
//                       : 'Please explain why you are rejecting this change...'
//                   }
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={closeRemarkModal}
//                   className="flex-1 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (remarkModal.action === 'reject' && !remarks.trim()) {
//                       setFeedback({
//                         type: 'error',
//                         message: 'Please provide a reason for rejection.',
//                       });
//                       setTimeout(() => setFeedback(null), 4000);
//                       return;
//                     }
//                     if (remarkModal.approvalId && remarkModal.action) {
//                       handleApprovalAction(remarkModal.approvalId, remarkModal.action, remarkModal.recordId);
//                     }
//                   }}
//                   className={`flex-1 py-3 text-white rounded-lg font-medium text-sm ${
//                     remarkModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   Confirm {remarkModal.action === 'approve' ? 'Approve' : 'Reject'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerApprovalsPage;


// CustomerApprovalsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  User,
  AlertCircle,
  CheckSquare,
  Users,
  Package,
  Settings,
  Wrench,
  Filter,
  List,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface PageProps {
  setSelectedModule: (id: string) => void;
}

interface CustomerApprovalRequest {
  id: number;
  change: number;
  role: number;
  role_name: string;
  role_code: string;
  status: string;
  approved_by: number | null;
  approved_by_name: string | null;
  remarks: string | null;
  approved_at: string | null;
  created_at: string;
  change_details?: {
    record_id: string;
    four_m: string;
    date: string;
    time: string;
    shift: string;
    shopfloor_name: string;
    line_name: string;
    station_name: string;
    category_details: {
      category_type: string;
      description: string;
    };
    action_details: {
      action_taken: string;
      approving_authority: string;
      remarks?: string;
    };
  };
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Man: Users,
  'Machine/Tool': Settings,
  Material: Package,
  Method: Wrench,
};

const categoryColors: { [key: string]: string } = {
  Man: 'from-blue-600 to-indigo-600',
  'Machine/Tool': 'from-green-600 to-emerald-600',
  Material: 'from-purple-600 to-fuchsia-600',
  Method: 'from-orange-600 to-red-500',
};

const categoryTextColors: { [key: string]: string } = {
  Man: 'text-blue-600 bg-blue-50 border-blue-200',
  'Machine/Tool': 'text-green-600 bg-green-50 border-green-200',
  Material: 'text-purple-600 bg-purple-50 border-purple-200',
  Method: 'text-orange-600 bg-orange-50 border-orange-200',
};

const CustomerApprovalsPage: React.FC<PageProps> = ({ setSelectedModule }) => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<CustomerApprovalRequest[]>([]);
  const [allApprovals, setAllApprovals] = useState<CustomerApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterId, setFilterId] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedApproval, setSelectedApproval] = useState<CustomerApprovalRequest | null>(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [remarkModal, setRemarkModal] = useState<{
    show: boolean;
    approvalId: number | null;
    action: 'approve' | 'reject' | null;
    recordId: string;
  }>({
    show: false,
    approvalId: null,
    action: null,
    recordId: '',
  });

  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const passedId = localStorage.getItem('filter_change_request_id');
    if (passedId) {
      setFilterId(passedId);
      localStorage.removeItem('filter_change_request_id');
    }
  }, []);

  useEffect(() => {
    fetchCustomerApprovals();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterId, filterCategory, viewMode]);

  const fetchCustomerApprovals = async () => {
    try {
      setLoading(true);
      setError('');

      const approvalsResponse = await api.get('/customer-approvals/');
      let approvalsData = approvalsResponse.data;

      // Filter for customer approvals only
      const customerApprovals = approvalsData.filter(
        (approval: CustomerApprovalRequest) => approval.role_code === 'CUSTOMER'
      );

      const approvalsWithDetails = await Promise.all(
        customerApprovals.map(async (approval: CustomerApprovalRequest) => {
          try {
            const changeResponse = await api.get(`/4m-changes/${approval.change}/`);
            return {
              ...approval,
              change_details: changeResponse.data,
            };
          } catch (err) {
            console.error(`Failed to fetch details for change ${approval.change}`, err);
            return approval;
          }
        })
      );

      setAllApprovals(approvalsWithDetails);
      setApprovals(approvalsWithDetails.filter((a) => a.status === 'pending'));
    } catch (err: any) {
      console.error('Error fetching customer approvals:', err);
      setError('Failed to load approval requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
    try {
      setActionLoading(approvalId);

      const endpoint = `/customer-approvals/${approvalId}/${action}/`;
      await api.post(endpoint, {
        remarks: remarks.trim() || undefined,
      });

      // Update allApprovals
      setAllApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: action === 'approve' ? 'approved' : 'rejected',
                approved_by_name: user?.name || null,
                approved_at: new Date().toISOString(),
                remarks: remarks.trim() || null,
              }
            : a
        )
      );

      // Remove from pending list
      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));

      setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
      setRemarks('');

      setFeedback({
        type: 'success',
        message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      });
      setTimeout(() => setFeedback(null), 4000);

      // Check if we need to return to detail page
      const returnId = localStorage.getItem('return_to_detail_id');
      if (returnId && recordId === returnId) {
        setTimeout(() => setSelectedModule('cm'), 1200);
      }

      setSelectedApproval(null);
    } catch (err: any) {
      console.error('Error processing approval:', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.error || `Failed to ${action} the request. Please try again.`,
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const openRemarkModal = (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
    setRemarkModal({ show: true, approvalId, action, recordId });
    setRemarks('');
  };

  const closeRemarkModal = () => {
    setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
    setRemarks('');
  };

  const getCategoryColor = (fourM: string) => categoryColors[fourM] || 'from-gray-600 to-gray-700';
  const getCategoryIcon = (fourM: string) => categoryIcons[fourM] || FileText;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    }[status] || 'bg-gray-100 text-gray-800 border-gray-300';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const filteredApprovals = (() => {
    let data = viewMode === 'pending' ? approvals : allApprovals;
    if (filterId) {
      data = allApprovals.filter(
        (a) => a.change_details?.record_id?.toLowerCase() === filterId.toLowerCase()
      );
    }
    if (filterCategory !== 'All') {
      data = data.filter((a) => a.change_details?.four_m === filterCategory);
    }
    return data;
  })();

  // Pagination calculations
  const totalItems = filteredApprovals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApprovals = filteredApprovals.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pendingCount = approvals.length;
  const approvedCount = allApprovals.filter((a) => a.status === 'approved').length;
  const rejectedCount = allApprovals.filter((a) => a.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading customer approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl text-white flex items-center gap-3 border-l-4 ${
              feedback.type === 'success' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Approvals</h1>
            <p className="text-gray-600">Review and approve 4M change requests requiring customer authorization</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-6 bg-white border border-blue-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Logged in as: <span className="font-bold text-gray-900">{user.name}</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold">CUSTOMER</span>
              </p>
              <p className="text-xs text-gray-600">Email: {user.email} | Department: {user.department}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle className="text-red-600 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filter Banner */}
        {filterId && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Filter className="text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Filtered by ID</p>
                <p className="text-blue-700 font-mono">{filterId}</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.getItem('return_to_detail_id') ? setSelectedModule('cm') : setFilterId('');
              }}
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50"
            >
              Clear
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 space-y-5">
          <div className="bg-white rounded-xl shadow border p-5 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" />
                <span className="text-2xl font-bold">{pendingCount}</span>
                <span className="text-gray-600 text-sm">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" />
                <span className="text-2xl font-bold">{approvedCount}</span>
                <span className="text-gray-600 text-sm">Approved</span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="text-red-600" />
                <span className="text-2xl font-bold">{rejectedCount}</span>
                <span className="text-gray-600 text-sm">Rejected</span>
              </div>
              <div className="flex items-center gap-3 border-l pl-6">
                <List className="text-blue-600" />
                <span className="text-2xl font-bold">{filteredApprovals.length}</span>
                <span className="text-gray-600 text-sm">Showing</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('pending')}
                  className={`px-4 py-2 text-sm rounded-md ${
                    viewMode === 'pending' ? 'bg-white shadow font-medium' : 'text-gray-600'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-2 text-sm rounded-md ${
                    viewMode === 'all' ? 'bg-white shadow font-medium' : 'text-gray-600'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Man', 'Machine/Tool', 'Material', 'Method'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                {cat === 'Machine/Tool' ? 'Machine' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* List Table */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          {filteredApprovals.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">All Caught Up!</h3>
              <p>No matching customer approval requests found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedApprovals.map((approval) => {
                      const ch = approval.change_details;
                      if (!ch) return null;
                      const pending = approval.status === 'pending';
                      const isLoading = actionLoading === approval.id;

                      return (
                        <tr key={approval.id} className={pending ? 'bg-yellow-50/40' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${categoryTextColors[ch.four_m] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                              {React.createElement(getCategoryIcon(ch.four_m), { className: 'w-4 h-4' })}
                              <span className="text-sm font-medium">{ch.four_m}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{ch.record_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{ch.line_name}</div>
                            <div className="text-xs text-gray-500">{ch.station_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{new Date(ch.date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{ch.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(approval.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {/* View Button */}
                              <button
                                onClick={() => setSelectedApproval(approval)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Approve/Reject Buttons - Only show for pending */}
                              {pending && (
                                <>
                                  <button
                                    onClick={() => openRemarkModal(approval.id, 'approve', ch.record_id)}
                                    disabled={isLoading}
                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Approve"
                                  >
                                    {isLoading ? (
                                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => openRemarkModal(approval.id, 'reject', ch.record_id)}
                                    disabled={isLoading}
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {/* Show status indicator for non-pending */}
                              {!pending && (
                                <span className="text-xs text-gray-500 italic">
                                  {approval.status === 'approved' ? 'Approved' : 'Rejected'}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Pagination Info */}
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-1">
                      {/* First Page */}
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="First Page"
                      >
                        <ChevronsLeft className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Previous Page */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1 mx-2">
                        {getPageNumbers().map((page, index) => (
                          <React.Fragment key={index}>
                            {page === '...' ? (
                              <span className="px-2 py-1 text-gray-500">...</span>
                            ) : (
                              <button
                                onClick={() => goToPage(page as number)}
                                className={`min-w-[40px] h-10 rounded-lg border text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Next Page */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="Next Page"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="Last Page"
                      >
                        <ChevronsRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Quick Jump */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Go to:</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (!isNaN(page)) {
                            goToPage(page);
                          }
                        }}
                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-sm text-gray-600">of {totalPages}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Fixed-size Detail Popup */}
        {selectedApproval && selectedApproval.change_details && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
              {/* Slim fixed header */}
              <div className="bg-gray-50 border-b px-5 py-3 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-gray-800">Request Details</h2>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 overflow-auto space-y-4 text-sm">
                {(() => {
                  const ch = selectedApproval.change_details!;
                  const Icon = getCategoryIcon(ch.four_m);
                  const gradient = getCategoryColor(ch.four_m);
                  const pending = selectedApproval.status === 'pending';

                  return (
                    <>
                      <div className={`bg-gradient-to-r ${gradient} rounded-xl px-5 py-4 text-white`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/25 rounded-lg flex items-center justify-center">
                              <Icon className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{ch.four_m} Change</h3>
                              <p className="text-sm opacity-90">{ch.record_id}</p>
                            </div>
                          </div>
                          <div className="text-right text-xs">
                            <div>Shift {ch.shift}</div>
                            <div className="mt-1">{getStatusBadge(selectedApproval.status)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="text-xs text-gray-600">Date</span>
                          </div>
                          <div className="font-medium">{new Date(ch.date).toLocaleDateString()}</div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-5 h-5 text-indigo-600" />
                            <span className="text-xs text-gray-600">Time</span>
                          </div>
                          <div className="font-medium">{ch.time}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="text-xs text-gray-600">Shopfloor</div>
                          <div className="font-medium text-sm">{ch.shopfloor_name}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="text-xs text-gray-600">Line</div>
                          <div className="font-medium text-sm">{ch.line_name}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="text-xs text-gray-600">Station</div>
                          <div className="font-medium text-sm">{ch.station_name}</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Category</div>
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                                ch.category_details.category_type === 'Planned'
                                  ? 'bg-green-100 text-green-700'
                                  : ch.category_details.category_type === 'Unplanned'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {ch.category_details.category_type}
                            </span>
                            <p className="text-sm leading-tight">{ch.category_details.description}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Authority</div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-indigo-700" />
                            </div>
                            <span className="font-medium text-sm">{ch.action_details.approving_authority}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 border">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Action Taken</div>
                        <div className="bg-white rounded p-3 text-sm border leading-tight">
                          {ch.action_details.action_taken}
                        </div>
                      </div>

                      {ch.action_details.remarks && (
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Additional Remarks</div>
                          <p className="text-sm italic leading-tight">{ch.action_details.remarks}</p>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-lg p-3 border text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600">Role:</span>{' '}
                            <span className="font-medium">{selectedApproval.role_name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-600">Created:</span>{' '}
                            <span className="font-medium">
                              {new Date(selectedApproval.created_at).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                        </div>

                        {!pending && selectedApproval.approved_by_name && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <div className="flex items-center gap-2">
                              {selectedApproval.status === 'approved' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="font-medium">
                                {selectedApproval.status === 'approved' ? 'Approved' : 'Rejected'} by{' '}
                                {selectedApproval.approved_by_name}
                              </span>
                            </div>
                            {selectedApproval.approved_at && (
                              <p className="text-xs text-gray-600 mt-1">
                                on {new Date(selectedApproval.approved_at).toLocaleString()}
                              </p>
                            )}
                            {selectedApproval.remarks && (
                              <p className="mt-1 italic text-gray-600 text-xs">
                                "{selectedApproval.remarks}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {pending && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-3">
                          <button
                            onClick={() => openRemarkModal(selectedApproval.id, 'reject', selectedApproval.change_details!.record_id)}
                            disabled={actionLoading === selectedApproval.id}
                            className="flex-1 py-3 bg-white text-red-700 font-semibold rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50 text-base flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </button>
                          <button
                            onClick={() => openRemarkModal(selectedApproval.id, 'approve', selectedApproval.change_details!.record_id)}
                            disabled={actionLoading === selectedApproval.id}
                            className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 text-base shadow-md flex items-center justify-center gap-2"
                          >
                            {actionLoading === selectedApproval.id ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Approve
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Remark Modal */}
        {remarkModal.show && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                {remarkModal.action === 'approve' ? (
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <XCircle className="w-7 h-7 text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {remarkModal.action === 'approve' ? 'Approve Change' : 'Reject Change'}
                  </h3>
                  <p className="text-sm text-gray-600">Record ID: {remarkModal.recordId}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-5">
                {remarkModal.action === 'approve'
                  ? 'You are about to approve this change request. This action will allow the change to proceed.'
                  : 'You are about to reject this change request. Please provide a reason for rejection.'}
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Remarks{' '}
                  <span className="text-gray-500 font-normal">
                    {remarkModal.action === 'approve' ? '(Optional)' : '(Required)'}
                  </span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={
                    remarkModal.action === 'approve'
                      ? 'Add any comments (optional)...'
                      : 'Please explain why you are rejecting this change...'
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeRemarkModal}
                  className="flex-1 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (remarkModal.action === 'reject' && !remarks.trim()) {
                      setFeedback({
                        type: 'error',
                        message: 'Please provide a reason for rejection.',
                      });
                      setTimeout(() => setFeedback(null), 4000);
                      return;
                    }
                    if (remarkModal.approvalId && remarkModal.action) {
                      handleApprovalAction(remarkModal.approvalId, remarkModal.action, remarkModal.recordId);
                    }
                  }}
                  className={`flex-1 py-3 text-white rounded-lg font-medium text-sm ${
                    remarkModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {remarkModal.action === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerApprovalsPage;