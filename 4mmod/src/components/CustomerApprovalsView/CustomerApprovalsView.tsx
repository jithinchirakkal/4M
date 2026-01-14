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
  Building2,
  Router,
  MapPin,
  Sun,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

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

const CustomerApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<CustomerApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
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
    fetchCustomerApprovals();
  }, []);

  const fetchCustomerApprovals = async () => {
    try {
      setLoading(true);
      setError('');

      const approvalsResponse = await api.get('/customer-approvals/');
      let approvalsData = approvalsResponse.data;

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

      setApprovals(approvalsWithDetails);
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

      setApprovals((prev) =>
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

      setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
      setRemarks('');

      alert(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} change ${recordId}!`);
    } catch (err: any) {
      console.error('Error processing approval:', err);
      alert(err.response?.data?.error || `Failed to ${action} the request. Please try again.`);
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

  const getCategoryColor = (fourM: string) => {
    return categoryColors[fourM] || 'from-gray-600 to-gray-700';
  };

  const getCategoryIcon = (fourM: string) => {
    return categoryIcons[fourM] || FileText;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 animate-pulse">PENDING</span>;
      case 'approved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">✓ APPROVED</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">✗ REJECTED</span>;
      default:
        return null;
    }
  };

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading approval requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Customer Approvals</h1>
            <p className="text-gray-600 text-lg">Review and approve 4M change requests requiring customer authorization</p>
          </div>
        </div>

        {user && (
          <div className="bg-white border border-blue-200 rounded-xl p-4 flex items-center gap-3 shadow-md">
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
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3 shadow-md">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-yellow-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
              <p className="text-4xl font-extrabold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Approved</p>
              <p className="text-4xl font-extrabold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-red-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Rejected</p>
              <p className="text-4xl font-extrabold text-gray-900">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <button onClick={fetchCustomerApprovals} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Refresh List
        </button>
      </div>

      {approvals.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">You have no pending customer approval requests at this time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {approvals.map((approval) => {
            const change = approval.change_details;
            if (!change) return null;

            const Icon = getCategoryIcon(change.four_m);
            const gradient = getCategoryColor(change.four_m);
            const isPending = approval.status === 'pending';
            const isExpanded = expandedCard === approval.id;

            return (
              <div key={approval.id} className={`bg-white rounded-3xl shadow-xl border overflow-hidden transition-all duration-300 ${isPending ? 'border-blue-200 hover:shadow-2xl' : 'border-gray-200 opacity-80'}`}>
                <div className={`bg-gradient-to-r ${gradient} p-6 text-white relative`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{change.record_id}</h3>
                        <p className="text-white/90 font-medium text-lg">{change.four_m} Change Request</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(approval.status)}
                      <button onClick={() => setExpandedCard(isExpanded ? null : approval.id)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Date</p>
                        <p className="font-bold text-gray-900 text-sm">{new Date(change.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Time</p>
                        <p className="font-bold text-gray-900 text-sm">{change.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <Sun className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Shift</p>
                        <p className="font-bold text-gray-900 text-sm">Shift {change.shift}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Type</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${change.category_details.category_type === 'Planned' ? 'bg-green-200 text-green-800' : change.category_details.category_type === 'Unplanned' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                          {change.category_details.category_type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-gray-600 font-semibold">Shopfloor</p>
                      </div>
                      <p className="font-bold text-gray-900">{change.shopfloor_name}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Router className="w-4 h-4 text-purple-600" />
                        <p className="text-xs text-gray-600 font-semibold">Line</p>
                      </div>
                      <p className="font-bold text-gray-900">{change.line_name}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-gray-600 font-semibold">Station</p>
                      </div>
                      <p className="font-bold text-gray-900">{change.station_name}</p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-4 border-t border-gray-200 pt-6 mt-6">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Change Description
                        </h4>
                        <p className="text-gray-800 leading-relaxed">{change.category_details.description}</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Action Taken
                        </h4>
                        <p className="text-gray-800 leading-relaxed">{change.action_details.action_taken}</p>
                      </div>

                      {change.action_details.remarks && (
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            Additional Remarks
                          </h4>
                          <p className="text-gray-800 italic leading-relaxed">{change.action_details.remarks}</p>
                        </div>
                      )}

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <User className="w-5 h-5 text-indigo-600" />
                          Approving Authority
                        </h4>
                        <p className="text-gray-800 font-semibold">{change.action_details.approving_authority}</p>
                      </div>
                    </div>
                  )}

                  {!isPending && (
                    <div className={`mt-6 rounded-xl p-4 border ${approval.status === 'approved' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {approval.status === 'approved' ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                        <h4 className={`font-bold text-lg ${approval.status === 'approved' ? 'text-green-900' : 'text-red-900'}`}>
                          {approval.status === 'approved' ? 'Approved' : 'Rejected'}
                        </h4>
                      </div>
                      {approval.approved_by_name && (
                        <>
                          <p className="text-sm text-gray-700"><span className="font-semibold">By:</span> {approval.approved_by_name}</p>
                          {approval.approved_at && <p className="text-sm text-gray-700"><span className="font-semibold">Date:</span> {new Date(approval.approved_at).toLocaleString()}</p>}
                        </>
                      )}
                      {approval.remarks && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs text-gray-600 font-semibold mb-1">Remarks:</p>
                          <p className="text-sm text-gray-800 italic">{approval.remarks}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {isPending && (
                    <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                      <button onClick={() => openRemarkModal(approval.id, 'reject', change.record_id)} disabled={actionLoading === approval.id} className="flex-1 py-4 bg-white border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <XCircle className="w-5 h-5" />
                        Reject Change
                      </button>

                      <button onClick={() => openRemarkModal(approval.id, 'approve', change.record_id)} disabled={actionLoading === approval.id} className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allow">
                        {actionLoading === approval.id ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Approve Change
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {remarkModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
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
                <h3 className="text-2xl font-bold text-gray-900">{remarkModal.action === 'approve' ? 'Approve Change' : 'Reject Change'}</h3>
                <p className="text-sm text-gray-600">Record ID: {remarkModal.recordId}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              {remarkModal.action === 'approve' ? 'You are about to approve this change request. This action will allow the change to proceed.' : 'You are about to reject this change request. Please provide a reason for rejection.'}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Remarks <span className="text-gray-500 font-normal">{remarkModal.action === 'approve' ? '(Optional)' : '(Required)'}</span>
              </label>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full rounded-xl border-2 border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all" rows={4} placeholder={remarkModal.action === 'approve' ? 'Add any comments (optional)...' : 'Please explain why you are rejecting this change...'} />
            </div>

            <div className="flex gap-3">
              <button onClick={closeRemarkModal} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => {
                if (remarkModal.action === 'reject' && !remarks.trim()) {
                  alert('Please provide a reason for rejection.');
                  return;
                }
                if (remarkModal.approvalId && remarkModal.action) {
                  handleApprovalAction(remarkModal.approvalId, remarkModal.action, remarkModal.recordId);
                }
              }} className={`flex-1 px-6 py-3 text-white rounded-xl font-bold transition-colors ${remarkModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Confirm {remarkModal.action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerApprovalsPage;