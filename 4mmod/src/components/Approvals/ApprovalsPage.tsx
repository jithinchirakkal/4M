
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

const ApprovalsPage: React.FC<PageProps> = ({ setSelectedModule }) => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [allApprovals, setAllApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterId, setFilterId] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const isAdmin = user?.is_superuser || user?.role?.toLowerCase().includes('admin');

  useEffect(() => {
    const passedId = localStorage.getItem('filter_change_request_id');
    if (passedId) {
      setFilterId(passedId);
      localStorage.removeItem('filter_change_request_id');
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterId, filterCategory, viewMode]);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/4m-approvals/');
      const data = res.data;

      const withDetails = await Promise.all(
        data.map(async (approval: ApprovalRequest) => {
          try {
            const changeRes = await api.get(`/4m-changes/${approval.change}/`);
            return { ...approval, change_details: changeRes.data };
          } catch {
            return approval;
          }
        })
      );

      setAllApprovals(withDetails);
      if (isAdmin) {
        setApprovals(withDetails.filter((a) => a.status === 'pending'));
      } else {
        setApprovals(
          withDetails.filter((a) => a.status === 'pending' && a.role_code === user?.role)
        );
      }
    } catch (err: any) {
      setError('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (approvalId: number, action: 'approve' | 'reject', recordId: string) => {
    try {
      setActionLoading(approvalId);

      await api.post(`/4m-approvals/${approvalId}/${action}/`, {
        remarks: remarks.trim() || undefined,
      });

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

      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));

      setRemarkModal({ show: false, approvalId: null, action: null, recordId: '' });
      setRemarks('');

      setFeedback({
        type: 'success',
        message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      });
      setTimeout(() => setFeedback(null), 4000);

      const returnId = localStorage.getItem('return_to_detail_id');
      if (returnId && recordId === returnId) {
        setTimeout(() => setSelectedModule('cm'), 1200);
      }

      setSelectedApproval(null);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.error || 'Action failed',
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const openRemarkModal = (id: number, action: 'approve' | 'reject', recordId: string) => {
    setRemarkModal({ show: true, approvalId: id, action, recordId });
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

  // Check if user can act on a specific approval
  const canActOnApproval = (approval: ApprovalRequest) => {
    return approval.status === 'pending' && (approval.role_code === user?.role || isAdmin);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading approvals...</p>
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Approval Requests</h1>
            <p className="text-gray-600">Review and manage 4M change requests</p>
          </div>
        </div>

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
                <Clock className="text-orange-600" />
                <span className="text-2xl font-bold">{approvals.length}</span>
                <span className="text-gray-600 text-sm">Pending</span>
              </div>
              <div className="flex items-center gap-3">
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

              {isAdmin && (
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
              )}
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
              <p>No matching records found</p>
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
                      const canAct = canActOnApproval(approval);
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

                              {/* Approve/Reject Buttons - Only show for pending and if user can act */}
                              {canAct && (
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
                                <span className="text-xs text-gray-500 italic ml-2">
                                  {approval.status === 'approved' ? 'Approved' : 'Rejected'}
                                </span>
                              )}

                              {/* Show waiting indicator if pending but can't act */}
                              {pending && !canAct && (
                                <span className="text-xs text-yellow-600 italic ml-2">
                                  Waiting for {approval.role_name}
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
                  const canAct = canActOnApproval(selectedApproval);

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

                      {canAct && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-3">
                          <button
                            onClick={() => openRemarkModal(selectedApproval.id, 'reject', ch.record_id)}
                            disabled={actionLoading === selectedApproval.id}
                            className="flex-1 py-3 bg-white text-red-700 font-semibold rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50 text-base flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </button>
                          <button
                            onClick={() => openRemarkModal(selectedApproval.id, 'approve', ch.record_id)}
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

                      {/* Show waiting message if pending but user can't act */}
                      {pending && !canAct && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                          <p className="text-yellow-800 font-medium">
                            Waiting for approval from: <span className="font-bold">{selectedApproval.role_name}</span>
                          </p>
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
                    {remarkModal.action === 'approve' ? 'Approve Request' : 'Reject Request'}
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

export default ApprovalsPage;