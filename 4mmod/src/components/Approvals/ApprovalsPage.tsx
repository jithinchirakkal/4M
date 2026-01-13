// // src/components/Approvals/ApprovalsPage.tsx
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
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api';

// interface ApprovalRequest {
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

// const ApprovalsPage: React.FC = () => {
//   const { user } = useAuth();
//   const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [actionLoading, setActionLoading] = useState<number | null>(null);
//   const [remarkModal, setRemarkModal] = useState<{
//     show: boolean;
//     approvalId: number | null;
//     action: 'approve' | 'reject' | null;
//   }>({
//     show: false,
//     approvalId: null,
//     action: null,
//   });
//   const [remarks, setRemarks] = useState('');

//   useEffect(() => {
//     fetchApprovals();
//   }, []);

//   const fetchApprovals = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       // Fetch pending approvals
//       const approvalsResponse = await api.get('/4m-approvals/');
//       const pendingApprovals = approvalsResponse.data;

//       // Fetch change details for each approval
//       const approvalsWithDetails = await Promise.all(
//         pendingApprovals.map(async (approval: ApprovalRequest) => {
//           try {
//             const changeResponse = await api.get(
//               `/4m-changes/${approval.change}/`
//             );
//             return {
//               ...approval,
//               change_details: changeResponse.data,
//             };
//           } catch (err) {
//             console.error(
//               `Failed to fetch details for change ${approval.change}`,
//               err
//             );
//             return approval;
//           }
//         })
//       );

//       setApprovals(approvalsWithDetails);
//     } catch (err: any) {
//       console.error('Error fetching approvals:', err);
//       setError('Failed to load approval requests. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprovalAction = async (
//     approvalId: number,
//     action: 'approve' | 'reject'
//   ) => {
//     try {
//       setActionLoading(approvalId);

//       const endpoint = `/4m-approvals/${approvalId}/${action}/`;
//       await api.post(endpoint, {
//         remarks: remarks.trim() || undefined,
//       });

//       // Remove the approved/rejected item from the list
//       setApprovals((prev) => prev.filter((a) => a.id !== approvalId));

//       // Reset modal
//       setRemarkModal({ show: false, approvalId: null, action: null });
//       setRemarks('');

//       // Show success message (you can add a toast notification here)
//       alert(
//         `Successfully ${action === 'approve' ? 'approved' : 'rejected'} the request!`
//       );
//     } catch (err: any) {
//       console.error('Error processing approval:', err);
//       alert(
//         err.response?.data?.error ||
//           `Failed to ${action} the request. Please try again.`
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const openRemarkModal = (
//     approvalId: number,
//     action: 'approve' | 'reject'
//   ) => {
//     setRemarkModal({ show: true, approvalId, action });
//     setRemarks('');
//   };

//   const closeRemarkModal = () => {
//     setRemarkModal({ show: false, approvalId: null, action: null });
//     setRemarks('');
//   };

//   const getCategoryColor = (fourM: string) => {
//     return categoryColors[fourM] || 'from-gray-600 to-gray-700';
//   };

//   const getCategoryIcon = (fourM: string) => {
//     return categoryIcons[fourM] || FileText;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading approval requests...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//             <CheckSquare className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-4xl font-extrabold text-gray-900">
//               Approval Requests
//             </h1>
//             <p className="text-gray-500 text-lg">
//               Review and approve 4M change management requests
//             </p>
//           </div>
//         </div>

//         {user && (
//           <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
//             <User className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm font-medium text-gray-700">
//                 Logged in as:{' '}
//                 <span className="font-bold text-gray-900">{user.name}</span>
//               </p>
//               <p className="text-xs text-gray-600">
//                 Role: {user.role_name} | Department: {user.department}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
//           <div>
//             <p className="font-medium text-red-900">Error</p>
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Pending Count */}
//       <div className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Clock className="w-6 h-6 text-orange-500" />
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {approvals.length}
//               </p>
//               <p className="text-sm text-gray-600">Pending Approvals</p>
//             </div>
//           </div>
//           <button
//             onClick={fetchApprovals}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Approval Cards */}
//       {approvals.length === 0 ? (
//         <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">
//             All Caught Up!
//           </h3>
//           <p className="text-gray-600">
//             You have no pending approval requests at the moment.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {approvals.map((approval) => {
//             const change = approval.change_details;
//             if (!change) return null;

//             const Icon = getCategoryIcon(change.four_m);
//             const gradient = getCategoryColor(change.four_m);

//             return (
//               <div
//                 key={approval.id}
//                 className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
//               >
//                 {/* Header with 4M Type */}
//                 <div
//                   className={`bg-gradient-to-r ${gradient} p-6 text-white`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                       <Icon className="w-8 h-8" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-2xl font-bold">
//                         {change.four_m} Change
//                       </h3>
//                       <p className="text-white/90 text-sm">
//                         Record ID: {change.record_id}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
//                         Shift {change.shift}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6 space-y-4">
//                   {/* Date & Time */}
//                   <div className="flex items-center gap-6 pb-4 border-b border-gray-200">
//                     <div className="flex items-center gap-2 flex-1">
//                       <Calendar className="w-5 h-5 text-blue-600" />
//                       <div>
//                         <p className="text-xs text-gray-500">Date</p>
//                         <p className="font-bold text-gray-900">
//                           {new Date(change.date).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 flex-1">
//                       <Clock className="w-5 h-5 text-purple-600" />
//                       <div>
//                         <p className="text-xs text-gray-500">Time</p>
//                         <p className="font-bold text-gray-900">{change.time}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Location */}
//                   <div className="grid grid-cols-3 gap-3 pb-4 border-b border-gray-200">
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Shopfloor</p>
//                       <p className="font-medium text-gray-900 text-sm">
//                         {change.shopfloor_name}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Line</p>
//                       <p className="font-medium text-gray-900 text-sm">
//                         {change.line_name}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Station</p>
//                       <p className="font-medium text-gray-900 text-sm">
//                         {change.station_name}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Category */}
//                   <div className="pb-4 border-b border-gray-200">
//                     <p className="text-xs text-gray-500 mb-2">Category</p>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-bold ${
//                           change.category_details.category_type === 'Planned'
//                             ? 'bg-green-100 text-green-700'
//                             : change.category_details.category_type ===
//                               'Unplanned'
//                             ? 'bg-yellow-100 text-yellow-700'
//                             : 'bg-red-100 text-red-700'
//                         }`}
//                       >
//                         {change.category_details.category_type}
//                       </span>
//                       <p className="text-sm text-gray-700 font-medium">
//                         {change.category_details.description}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Action Taken */}
//                   <div className="pb-4 border-b border-gray-200">
//                     <p className="text-xs text-gray-500 mb-2">Action Taken</p>
//                     <p className="text-sm text-gray-900 leading-relaxed">
//                       {change.action_details.action_taken}
//                     </p>
//                   </div>

//                   {/* Approving Authority */}
//                   <div className="pb-4 border-b border-gray-200">
//                     <p className="text-xs text-gray-500 mb-2">
//                       Approving Authority
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <User className="w-4 h-4 text-indigo-600" />
//                       <p className="font-bold text-gray-900">
//                         {change.action_details.approving_authority}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Approval Request Info */}
//                   <div className="bg-blue-50 rounded-xl p-4">
//                     <p className="text-xs text-gray-600 mb-1">
//                       Requested for role:
//                     </p>
//                     <p className="font-bold text-blue-900">
//                       {approval.role_name}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Created:{' '}
//                       {new Date(approval.created_at).toLocaleString()}
//                     </p>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-3 pt-4">
//                     <button
//                       onClick={() => openRemarkModal(approval.id, 'reject')}
//                       disabled={actionLoading === approval.id}
//                       className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors border-2 border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <XCircle className="w-5 h-5" />
//                       Reject
//                     </button>
//                     <button
//                       onClick={() => openRemarkModal(approval.id, 'approve')}
//                       disabled={actionLoading === approval.id}
//                       className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {actionLoading === approval.id ? (
//                         <>
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle className="w-5 h-5" />
//                           Approve
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Remark Modal */}
//       {remarkModal.show && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               {remarkModal.action === 'approve' ? 'Approve' : 'Reject'} Request
//             </h3>
//             <p className="text-gray-600 mb-4">
//               {remarkModal.action === 'approve'
//                 ? 'You are about to approve this change request.'
//                 : 'You are about to reject this change request.'}
//             </p>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Remarks (Optional)
//               </label>
//               <textarea
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 rows={4}
//                 placeholder="Add any comments or remarks..."
//               />
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={closeRemarkModal}
//                 className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   if (remarkModal.approvalId && remarkModal.action) {
//                     handleApprovalAction(
//                       remarkModal.approvalId,
//                       remarkModal.action
//                     );
//                   }
//                 }}
//                 className={`flex-1 px-4 py-3 text-white rounded-lg font-bold transition-colors ${
//                   remarkModal.action === 'approve'
//                     ? 'bg-green-600 hover:bg-green-700'
//                     : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 Confirm {remarkModal.action === 'approve' ? 'Approval' : 'Rejection'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApprovalsPage;

// src/components/Approvals/ApprovalsPage.tsx
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
  Shield,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface ApprovalRequest {
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
    };
  };
}

const categoryIcons: { [key: string]: any } = {
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

const ApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [allApprovals, setAllApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');
  const [remarkModal, setRemarkModal] = useState<{
    show: boolean;
    approvalId: number | null;
    action: 'approve' | 'reject' | null;
  }>({
    show: false,
    approvalId: null,
    action: null,
  });
  const [remarks, setRemarks] = useState('');

  const isAdmin = user?.is_superuser || user?.role?.toLowerCase().includes('admin');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all approvals (backend filters by role if not admin)
      const approvalsResponse = await api.get('/4m-approvals/');
      let approvalsData = approvalsResponse.data;

      // Fetch change details for each approval
      const approvalsWithDetails = await Promise.all(
        approvalsData.map(async (approval: ApprovalRequest) => {
          try {
            const changeResponse = await api.get(
              `/4m-changes/${approval.change}/`
            );
            return {
              ...approval,
              change_details: changeResponse.data,
            };
          } catch (err) {
            console.error(
              `Failed to fetch details for change ${approval.change}`,
              err
            );
            return approval;
          }
        })
      );

      // For admin: show all approvals separately
      if (isAdmin) {
        setAllApprovals(approvalsWithDetails);
        // Filter only pending for main view
        setApprovals(approvalsWithDetails.filter((a: ApprovalRequest) => a.status === 'pending'));
      } else {
        // For non-admin: only show pending approvals for their role
        const pendingForUser = approvalsWithDetails.filter(
          (a: ApprovalRequest) => a.status === 'pending' && a.role_code === user?.role
        );
        setApprovals(pendingForUser);
        setAllApprovals(approvalsWithDetails);
      }
    } catch (err: any) {
      console.error('Error fetching approvals:', err);
      setError('Failed to load approval requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (
    approvalId: number,
    action: 'approve' | 'reject'
  ) => {
    try {
      setActionLoading(approvalId);

      const endpoint = `/4m-approvals/${approvalId}/${action}/`;
      await api.post(endpoint, {
        remarks: remarks.trim() || undefined,
      });

      // Remove the approved/rejected item from the list
      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));
      setAllApprovals((prev) => 
        prev.map((a) => 
          a.id === approvalId 
            ? { ...a, status: action === 'approve' ? 'approved' : 'rejected', approved_by_name: user?.name || null }
            : a
        )
      );

      // Reset modal
      setRemarkModal({ show: false, approvalId: null, action: null });
      setRemarks('');

      // Show success message
      alert(
        `Successfully ${action === 'approve' ? 'approved' : 'rejected'} the request!`
      );
    } catch (err: any) {
      console.error('Error processing approval:', err);
      alert(
        err.response?.data?.error ||
          `Failed to ${action} the request. Please try again.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const openRemarkModal = (
    approvalId: number,
    action: 'approve' | 'reject'
  ) => {
    setRemarkModal({ show: true, approvalId, action });
    setRemarks('');
  };

  const closeRemarkModal = () => {
    setRemarkModal({ show: false, approvalId: null, action: null });
    setRemarks('');
  };

  const getCategoryColor = (fourM: string) => {
    return categoryColors[fourM] || 'from-gray-600 to-gray-700';
  };

  const getCategoryIcon = (fourM: string) => {
    return categoryIcons[fourM] || FileText;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            PENDING
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            APPROVED
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            REJECTED
          </span>
        );
      default:
        return null;
    }
  };

  const displayApprovals = viewMode === 'pending' ? approvals : allApprovals;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading approval requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Approval Requests
            </h1>
            <p className="text-gray-500 text-lg">
              Review and approve 4M change management requests
            </p>
          </div>
        </div>

        {user && (
          <div className={`mt-4 border rounded-xl p-4 flex items-center gap-3 ${
            isAdmin ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'
          }`}>
            {isAdmin ? (
              <Shield className="w-5 h-5 text-purple-600" />
            ) : (
              <User className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                Logged in as:{' '}
                <span className="font-bold text-gray-900">{user.name}</span>
                {isAdmin && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-xs font-bold">
                    ADMIN
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-600">
                Role: {user.role_name} | Department: {user.department}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats & Controls */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {approvals.length}
                </p>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
            </div>
            
            {isAdmin && (
              <>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {allApprovals.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Approvals</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('pending')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    viewMode === 'pending'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pending Only
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    viewMode === 'all'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Approvals
                </button>
              </div>
            )}
            <button
              onClick={fetchApprovals}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Approval Cards */}
      {displayApprovals.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {viewMode === 'pending' ? 'All Caught Up!' : 'No Approvals Found'}
          </h3>
          <p className="text-gray-600">
            {viewMode === 'pending'
              ? 'You have no pending approval requests at the moment.'
              : 'No approval records found in the system.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayApprovals.map((approval) => {
            const change = approval.change_details;
            if (!change) return null;

            const Icon = getCategoryIcon(change.four_m);
            const gradient = getCategoryColor(change.four_m);
            const isPending = approval.status === 'pending';
            const canApprove = isPending && !isAdmin;

            return (
              <div
                key={approval.id}
                className={`bg-white rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${
                  isPending ? 'border-gray-100' : 'border-gray-200 opacity-75'
                }`}
              >
                {/* Header with 4M Type */}
                <div
                  className={`bg-gradient-to-r ${gradient} p-6 text-white relative`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">
                        {change.four_m} Change
                      </h3>
                      <p className="text-white/90 text-sm">
                        Record ID: {change.record_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
                        Shift {change.shift}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge in Header */}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(approval.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 flex-1">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-bold text-gray-900">
                          {new Date(change.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-bold text-gray-900">{change.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-3 gap-3 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Shopfloor</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {change.shopfloor_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Line</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {change.line_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Station</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {change.station_name}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Category</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          change.category_details.category_type === 'Planned'
                            ? 'bg-green-100 text-green-700'
                            : change.category_details.category_type ===
                              'Unplanned'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {change.category_details.category_type}
                      </span>
                      <p className="text-sm text-gray-700 font-medium">
                        {change.category_details.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Taken */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Action Taken</p>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {change.action_details.action_taken}
                    </p>
                  </div>

                  {/* Approving Authority */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                      Approving Authority
                    </p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      <p className="font-bold text-gray-900">
                        {change.action_details.approving_authority}
                      </p>
                    </div>
                  </div>

                  {/* Approval Request Info */}
                  <div className={`rounded-xl p-4 ${
                    isPending ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    <p className="text-xs text-gray-600 mb-1">
                      Requested for role:
                    </p>
                    <p className={`font-bold ${
                      isPending ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {approval.role_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(approval.created_at).toLocaleString()}
                    </p>
                    
                    {!isPending && approval.approved_by_name && (
                      <>
                        <p className="text-xs text-gray-600 mt-2 mb-1">
                          {approval.status === 'approved' ? 'Approved by:' : 'Rejected by:'}
                        </p>
                        <p className="font-bold text-gray-900">
                          {approval.approved_by_name}
                        </p>
                        {approval.approved_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(approval.approved_at).toLocaleString()}
                          </p>
                        )}
                        {approval.remarks && (
                          <>
                            <p className="text-xs text-gray-600 mt-2 mb-1">Remarks:</p>
                            <p className="text-sm text-gray-700 italic">
                              {approval.remarks}
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Buttons - Only show for pending requests for non-admin users */}
                  {canApprove && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => openRemarkModal(approval.id, 'reject')}
                        disabled={actionLoading === approval.id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors border-2 border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                      <button
                        onClick={() => openRemarkModal(approval.id, 'approve')}
                        disabled={actionLoading === approval.id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === approval.id ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                  
                  {/* Admin View Message */}
                  {isAdmin && isPending && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mt-2">
                      <p className="text-sm text-purple-800 font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin View - Approval requires {approval.role_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Remark Modal */}
      {remarkModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {remarkModal.action === 'approve' ? 'Approve' : 'Reject'} Request
            </h3>
            <p className="text-gray-600 mb-4">
              {remarkModal.action === 'approve'
                ? 'You are about to approve this change request.'
                : 'You are about to reject this change request.'}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Add any comments or remarks..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeRemarkModal}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (remarkModal.approvalId && remarkModal.action) {
                    handleApprovalAction(
                      remarkModal.approvalId,
                      remarkModal.action
                    );
                  }
                }}
                className={`flex-1 px-4 py-3 text-white rounded-lg font-bold transition-colors ${
                  remarkModal.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {remarkModal.action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;