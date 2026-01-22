
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Calendar,
  Clock,
  Building2,
  Router,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Layers,
  UserCheck,
  Flag,
  FileText,
  ArrowUpRight,
  Eye,
  ExternalLink,
  Users,
  Settings,
  Package,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Download,
  MoreHorizontal,
  TrendingUp,
  Activity,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ChangeRequestDetail from '../cm/ChangeRequestDetail';

// ────────────────────────────────────────────────
// Type Definitions (unchanged)
// ────────────────────────────────────────────────
interface Approval {
  role: { code: string; name: string };
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: { username: string };
  approved_at?: string;
  remarks?: string;
}

interface FourMChange {
  id: number;
  record_id: string;
  four_m: 'Man' | 'Machine/Tool' | 'Material' | 'Method';
  shift: 'A' | 'B';
  date: string;
  time: string;
  created_at: string;

  shopfloor_name?: string;
  line_name?: string;
  station_name?: string;

  category_details?: {
    four_m: string;
    category_type: 'Planned' | 'Unplanned' | 'Abnormal';
    description: string;
  };

  action_details?: {
    action_taken: string;
    set_up_approval: boolean;
    retroactive_inspection: boolean;
    ojt: boolean;
    containment_action: boolean;
    identification_psn_batch_no: boolean;
    change_record: boolean;
    customer_approval: boolean;
    approving_authority?: string;
  };

  approval_status: 'N/A' | 'REQUIRED' | 'APPROVED' | 'REJECTED';
  approvals: Approval[];

  is_retro_done: boolean;
  is_ojt_done: boolean;
  is_containment_done: boolean;
  is_batch_done: boolean;
  is_tracking_done: boolean;
}

// ────────────────────────────────────────────────
// Reusable Components – Enhanced
// ────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; text: string; border: string; Icon: any; glow: string }> = {
    'N/A': {
      bg: 'bg-gradient-to-r from-slate-100 to-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-300',
      Icon: FileText,
      glow: '',
    },
    APPROVED: {
      bg: 'bg-gradient-to-r from-emerald-100 to-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      Icon: CheckCircle,
      glow: 'shadow-emerald-100',
    },
    REJECTED: {
      bg: 'bg-gradient-to-r from-rose-100 to-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      Icon: XCircle,
      glow: 'shadow-rose-100',
    },
    REQUIRED: {
      bg: 'bg-gradient-to-r from-amber-100 to-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      Icon: Clock,
      glow: 'shadow-amber-100',
    },
  };

  const { bg, text, border, Icon, glow } = styles[status] || styles['N/A'];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
        border shadow-sm ${bg} ${text} ${border} ${glow}
        ${status === 'REQUIRED' ? 'animate-pulse' : ''}
        transition-all duration-200 hover:scale-105
      `}
    >
      <Icon size={14} />
      {status}
    </span>
  );
};

const CompletionIcon = ({ done, label }: { done: boolean; label: string }) => (
  <div className="group relative">
    <div
      className={`
        p-1.5 rounded-full transition-all duration-300 cursor-pointer
        ${done 
          ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 shadow-sm shadow-emerald-200' 
          : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400'}
        group-hover:scale-125 group-hover:shadow-md
      `}
    >
      {done ? <CheckCircle size={18} /> : <XCircle size={18} />}
    </div>
    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900/95 text-white text-xs rounded-xl whitespace-nowrap shadow-2xl z-20 border border-slate-700/50 backdrop-blur-sm">
      <div className="font-medium">{label}</div>
      <div className={`text-xs mt-0.5 ${done ? 'text-emerald-400' : 'text-amber-400'}`}>
        {done ? '✓ Completed' : '○ Pending'}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
    </div>
  </div>
);

const FourMIcon = ({ fourM }: { fourM: string }) => {
  const icons = {
    Man: Users,
    'Machine/Tool': Settings,
    Material: Package,
    Method: Wrench,
  };
  const Icon = icons[fourM as keyof typeof icons] || FileText;

  const colors = {
    Man: 'text-blue-600',
    'Machine/Tool': 'text-teal-600',
    Material: 'text-violet-600',
    Method: 'text-amber-600',
  };

  return <Icon size={20} className={colors[fourM as keyof typeof colors] || 'text-slate-500'} />;
};

// Stats Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string;
  trend?: string;
}) => {
  const colorStyles: Record<string, { bg: string; iconBg: string; text: string }> = {
    blue: { bg: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-400/30', text: 'text-blue-100' },
    emerald: { bg: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-400/30', text: 'text-emerald-100' },
    amber: { bg: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-400/30', text: 'text-amber-100' },
    rose: { bg: 'from-rose-500 to-rose-600', iconBg: 'bg-rose-400/30', text: 'text-rose-100' },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.bg} p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${style.text}`}>{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs text-white/80">
              <TrendingUp size={12} />
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${style.iconBg}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <Icon size={100} />
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
      {/* Items per page selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-slate-600">entries</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> records
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
          title="First page"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
          title="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`
                min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200
                ${page === currentPage
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200'
                  : page === '...'
                  ? 'cursor-default text-slate-400'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
          title="Next page"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
          title="Last page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// Main Component – Enhanced UI with Pagination
// ────────────────────────────────────────────────
export default function FourMChangeHistory() {
  const [changes, setChanges] = useState<FourMChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    fourM: '',
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  });

  const [selectedRecord, setSelectedRecord] = useState<FourMChange | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchChanges();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const fetchChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/4m-changes/');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setChanges(Array.isArray(data) ? data : data.results || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load 4M changes');
    } finally {
      setLoading(false);
    }
  };

  const filteredChanges = useMemo(() => {
    return changes.filter((item) => {
      const matchFourM = !filters.fourM || item.four_m === filters.fourM;
      const matchStatus = !filters.status || item.approval_status === filters.status;
      const searchLower = filters.search.toLowerCase();
      const matchSearch =
        !filters.search ||
        item.record_id?.toLowerCase().includes(searchLower) ||
        item.shopfloor_name?.toLowerCase().includes(searchLower) ||
        item.line_name?.toLowerCase().includes(searchLower) ||
        item.action_details?.action_taken?.toLowerCase().includes(searchLower);

      const matchDate =
        (!filters.dateFrom || item.date >= filters.dateFrom) &&
        (!filters.dateTo || item.date <= filters.dateTo);

      return matchFourM && matchStatus && matchSearch && matchDate;
    });
  }, [changes, filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredChanges.length / itemsPerPage);
  const paginatedChanges = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredChanges.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredChanges, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to top of table
    document.getElementById('table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Export to Excel function
  const exportToExcel = () => {
    setExporting(true);
    
    try {
      // Prepare data for export based on filtered changes
      const exportData = filteredChanges.map((item, index) => ({
        'S.No': index + 1,
        'Record ID': item.record_id || '',
        '4M Category': item.four_m || '',
        'Shift': item.shift || '',
        'Date': item.date ? new Date(item.date).toLocaleDateString('en-GB') : '',
        'Time': item.time || '',
        'Shopfloor': item.shopfloor_name || '',
        'Line': item.line_name || '',
        'Station': item.station_name || '',
        'Category Type': item.category_details?.category_type || '',
        'Category Description': item.category_details?.description || '',
        'Action Taken': item.action_details?.action_taken || '',
        'Setup Approval': item.action_details?.set_up_approval ? 'Yes' : 'No',
        'Retroactive Inspection': item.action_details?.retroactive_inspection ? 'Yes' : 'No',
        'OJT Required': item.action_details?.ojt ? 'Yes' : 'No',
        'Containment Action': item.action_details?.containment_action ? 'Yes' : 'No',
        'Batch/PSN Identification': item.action_details?.identification_psn_batch_no ? 'Yes' : 'No',
        'Change Record': item.action_details?.change_record ? 'Yes' : 'No',
        'Customer Approval': item.action_details?.customer_approval ? 'Yes' : 'No',
        'Approving Authority': item.action_details?.approving_authority || '',
        'Approval Status': item.approval_status || '',
        'Retro Done': item.is_retro_done ? 'Yes' : 'No',
        'OJT Done': item.is_ojt_done ? 'Yes' : 'No',
        'Containment Done': item.is_containment_done ? 'Yes' : 'No',
        'Batch Done': item.is_batch_done ? 'Yes' : 'No',
        'Tracking Done': item.is_tracking_done ? 'Yes' : 'No',
        'Created At': item.created_at ? new Date(item.created_at).toLocaleString('en-GB') : '',
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 6 },   // S.No
        { wch: 15 },  // Record ID
        { wch: 15 },  // 4M Category
        { wch: 8 },   // Shift
        { wch: 12 },  // Date
        { wch: 10 },  // Time
        { wch: 15 },  // Shopfloor
        { wch: 15 },  // Line
        { wch: 15 },  // Station
        { wch: 12 },  // Category Type
        { wch: 30 },  // Category Description
        { wch: 40 },  // Action Taken
        { wch: 15 },  // Setup Approval
        { wch: 20 },  // Retroactive Inspection
        { wch: 12 },  // OJT Required
        { wch: 18 },  // Containment Action
        { wch: 22 },  // Batch/PSN Identification
        { wch: 15 },  // Change Record
        { wch: 18 },  // Customer Approval
        { wch: 20 },  // Approving Authority
        { wch: 15 },  // Approval Status
        { wch: 12 },  // Retro Done
        { wch: 10 },  // OJT Done
        { wch: 16 },  // Containment Done
        { wch: 12 },  // Batch Done
        { wch: 14 },  // Tracking Done
        { wch: 20 },  // Created At
      ];
      worksheet['!cols'] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '4M Changes');

      // Generate filename with current date and applied filters
      const dateStr = new Date().toISOString().split('T')[0];
      let filename = `4M_Changes_${dateStr}`;
      
      // Add filter info to filename
      if (filters.fourM) filename += `_${filters.fourM}`;
      if (filters.status) filename += `_${filters.status}`;
      if (filters.dateFrom || filters.dateTo) {
        filename += `_${filters.dateFrom || 'start'}_to_${filters.dateTo || 'end'}`;
      }
      filename += '.xlsx';

      // Save file
      XLSX.writeFile(workbook, filename);

    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: changes.length,
      approved: changes.filter(c => c.approval_status === 'APPROVED').length,
      pending: changes.filter(c => c.approval_status === 'REQUIRED').length,
      rejected: changes.filter(c => c.approval_status === 'REJECTED').length,
    };
  }, [changes]);

  const getFourMStyle = (fourM: string) => {
    const styles = {
      Man: {
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100/70',
        text: 'text-blue-800',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
      },
      'Machine/Tool': {
        bg: 'bg-gradient-to-r from-teal-50 to-teal-100/70',
        text: 'text-teal-800',
        border: 'border-teal-200',
        iconBg: 'bg-teal-100',
      },
      Material: {
        bg: 'bg-gradient-to-r from-violet-50 to-violet-100/70',
        text: 'text-violet-800',
        border: 'border-violet-200',
        iconBg: 'bg-violet-100',
      },
      Method: {
        bg: 'bg-gradient-to-r from-amber-50 to-amber-100/70',
        text: 'text-amber-800',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
      },
    };
    return styles[fourM as keyof typeof styles] || {
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      border: 'border-gray-200',
      iconBg: 'bg-gray-100',
    };
  };

  const clearFilters = () => {
    setFilters({
      fourM: '',
      status: '',
      search: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters = filters.fourM || filters.status || filters.search || filters.dateFrom || filters.dateTo;

  if (selectedRecord) {
    return (
      <ChangeRequestDetail
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
        setSelectedModule={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg shadow-indigo-200">
              <Activity size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                4M Change History
              </h1>
              <p className="mt-1 text-slate-600 text-base">
                Monitor and audit all Man-Machine-Material-Method changes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              disabled={exporting || filteredChanges.length === 0}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                bg-gradient-to-r from-emerald-600 to-emerald-700 text-white
                hover:from-emerald-700 hover:to-emerald-800
                shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300
                active:scale-[0.98] transition-all duration-200
                disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed
              `}
            >
              {exporting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet size={18} />
                  Export Excel
                  {hasActiveFilters && (
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      Filtered
                    </span>
                  )}
                </>
              )}
            </button>
            <button
              onClick={fetchChanges}
              disabled={loading}
              className={`
                inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white
                bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
                shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 
                active:scale-[0.98] transition-all duration-200
                disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed
              `}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Changes" 
            value={stats.total} 
            icon={Layers} 
            color="blue"
            trend="All time records"
          />
          <StatCard 
            title="Approved" 
            value={stats.approved} 
            icon={CheckCircle} 
            color="emerald"
            trend={`${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% approval rate`}
          />
          <StatCard 
            title="Pending Approval" 
            value={stats.pending} 
            icon={Clock} 
            color="amber"
            trend="Awaiting review"
          />
          <StatCard 
            title="Rejected" 
            value={stats.rejected} 
            icon={XCircle} 
            color="rose"
            trend="Requires attention"
          />
        </div>

        {/* Filters – Card - All in One Line */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 p-5 backdrop-blur-sm">
          <div className="flex flex-wrap items-end gap-4">
            {/* Filter Icon & Title */}
            <div className="flex items-center gap-2 mr-2">
              <Filter size={20} className="text-indigo-600" />
              <span className="text-sm font-semibold text-slate-700">Filters</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
            </div>

            {/* 4M Type */}
            <div className="flex-1 min-w-[160px] max-w-[200px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">4M Category</label>
              <select
                value={filters.fourM}
                onChange={(e) => setFilters({ ...filters, fourM: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-white shadow-sm hover:border-slate-400 cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Man">👤 Man</option>
                <option value="Machine/Tool">⚙️ Machine / Tool</option>
                <option value="Material">📦 Material</option>
                <option value="Method">🔧 Method</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex-1 min-w-[160px] max-w-[200px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">Approval Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-white shadow-sm hover:border-slate-400 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="APPROVED">✓ Approved</option>
                <option value="REJECTED">✗ Rejected</option>
                <option value="REQUIRED">◐ Pending</option>
                <option value="N/A">○ No Approval Needed</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-[2] min-w-[250px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Record ID, shopfloor, action..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-sm hover:border-slate-400"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Date Range - From and To in Same Container */}
            <div className="flex items-end gap-2 min-w-[280px]">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-sm hover:border-slate-400 cursor-pointer"
                  />
                </div>
              </div>
              <span className="text-slate-400 pb-2.5">—</span>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-sm hover:border-slate-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-medium transition-colors border border-rose-200 hover:border-rose-300"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Active filters:</span>
              {filters.fourM && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  4M: {filters.fourM}
                  <button onClick={() => setFilters({ ...filters, fourM: '' })} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                  Status: {filters.status}
                  <button onClick={() => setFilters({ ...filters, status: '' })} className="hover:text-purple-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  Search: "{filters.search}"
                  <button onClick={() => setFilters({ ...filters, search: '' })} className="hover:text-slate-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {(filters.dateFrom || filters.dateTo) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                  Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
                  <button onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })} className="hover:text-amber-900">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table Card */}
        <div id="table-container" className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
          {/* Table Header Bar */}
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-slate-800">Change Records</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                {filteredChanges.length} records
              </span>
            </div>
            {hasActiveFilters && (
              <div className="text-sm text-slate-500">
                Filtered from {changes.length} total records
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-500 bg-gradient-to-b from-white to-slate-50">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
                <Activity size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
              </div>
              <p className="mt-4 text-lg font-medium">Loading 4M change records...</p>
              <p className="text-sm text-slate-400 mt-1">Please wait while we fetch the data</p>
            </div>
          ) : error ? (
            <div className="py-20 px-8 text-center bg-gradient-to-b from-rose-50 to-white">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-rose-800">Failed to Load Data</h3>
              <p className="text-rose-600 mt-2">{error}</p>
              <button
                onClick={fetchChanges}
                className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredChanges.length === 0 ? (
            <div className="py-24 text-center bg-gradient-to-b from-white to-slate-50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700">No matching 4M changes found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your filters or search criteria</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FileText size={14} />
                          Record ID
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Layers size={14} />
                          4M Category
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          Date / Shift
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          Location
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Flag size={14} />
                          Category / Action
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <UserCheck size={14} />
                          Approval
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle size={14} />
                          Follow-ups
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedChanges.map((item, index) => {
                      const style = getFourMStyle(item.four_m);
                      return (
                        <tr
                          key={item.id}
                          className={`
                            hover:bg-indigo-50/50 transition-all duration-200 group
                            ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                          `}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRecord(item)}
                              className="font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 group/link transition-colors"
                            >
                              <span className="group-hover/link:underline">{item.record_id}</span>
                              <ExternalLink
                                size={14}
                                className="opacity-0 group-hover/link:opacity-70 transition-opacity"
                              />
                            </button>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`
                                inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold border
                                ${style.bg} ${style.text} ${style.border} shadow-sm
                                transition-all duration-200 hover:scale-105
                              `}
                            >
                              <span className={`p-1.5 rounded-lg ${style.iconBg}`}>
                                <FourMIcon fourM={item.four_m} />
                              </span>
                              {item.four_m}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                            <div className="font-medium flex items-center gap-2">
                              <Calendar size={14} className="text-slate-400" />
                              {item.date ? new Date(item.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : '—'}
                            </div>
                            <div className="text-xs mt-1.5 text-slate-500 flex items-center gap-1.5">
                              <span className={`inline-block w-2 h-2 rounded-full ${item.shift === 'A' ? 'bg-amber-400' : 'bg-indigo-400'}`}></span>
                              Shift {item.shift}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px]">
                            <div className="truncate" title={`${item.shopfloor_name || ''} ${item.line_name || ''} ${item.station_name || ''}`}>
                              <span className="font-medium text-slate-700">{item.shopfloor_name || '—'}</span>
                              {item.line_name && (
                                <>
                                  <span className="text-indigo-400 mx-1">→</span>
                                  <span>{item.line_name}</span>
                                </>
                              )}
                              {item.station_name && (
                                <>
                                  <span className="text-indigo-400 mx-1">→</span>
                                  <span>{item.station_name}</span>
                                </>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 max-w-xs">
                            <div className="flex items-center gap-2">
                              <span className={`
                                px-2.5 py-1 rounded-lg text-xs font-semibold
                                ${item.category_details?.category_type === 'Planned' 
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : item.category_details?.category_type === 'Unplanned'
                                  ? 'bg-amber-100 text-amber-700'
                                  : item.category_details?.category_type === 'Abnormal'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-100 text-slate-600'
                                }
                              `}>
                                {item.category_details?.category_type || 'N/A'}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                              {item.action_details?.action_taken || 'No action description provided'}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge status={item.approval_status} />
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-4">
                              <CompletionIcon done={item.is_retro_done} label="Retroactive Inspection" />
                              <CompletionIcon done={item.is_ojt_done} label="On-Job Training" />
                              <CompletionIcon done={item.is_containment_done} label="Containment Action" />
                              <CompletionIcon done={item.is_batch_done} label="Batch / PSN Identification" />
                              <CompletionIcon done={item.is_tracking_done} label="Change Tracking Sheet" />
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRecord(item)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={filteredChanges.length}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-sm text-slate-500">
            4M Change Management System • Last updated: {new Date().toLocaleString('en-GB')}
          </p>
        </div>
      </div>
    </div>
  );
}