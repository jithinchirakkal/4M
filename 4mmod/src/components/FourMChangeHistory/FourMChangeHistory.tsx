






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
} from 'lucide-react';
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
  const styles: Record<string, { bg: string; text: string; border: string; Icon: any }> = {
    'N/A': {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      Icon: FileText,
    },
    APPROVED: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      Icon: CheckCircle,
    },
    REJECTED: {
      bg: 'bg-rose-100',
      text: 'text-rose-800',
      border: 'border-rose-300',
      Icon: XCircle,
    },
    REQUIRED: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      Icon: Clock,
    },
  };

  const { bg, text, border, Icon } = styles[status] || styles['N/A'];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
        border shadow-sm ${bg} ${text} ${border}
        ${status === 'REQUIRED' ? 'animate-pulse' : ''}
        transition-all duration-200
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
        p-1.5 rounded-full transition-all duration-200
        ${done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}
        group-hover:scale-110
      `}
    >
      {done ? <CheckCircle size={18} /> : <XCircle size={18} />}
    </div>
    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900/95 text-white text-xs rounded-lg whitespace-nowrap shadow-xl z-20 border border-slate-700/50">
      {label}: {done ? 'Completed' : 'Pending'}
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

// ────────────────────────────────────────────────
// Main Component – Enhanced UI
// ────────────────────────────────────────────────
export default function FourMChangeHistory() {
  const [changes, setChanges] = useState<FourMChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    fourM: '',
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  });

  const [selectedRecord, setSelectedRecord] = useState<FourMChange | null>(null);

  useEffect(() => {
    fetchChanges();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">4M Change History</h1>
            <p className="mt-1.5 text-slate-600 text-base">
              Monitor and audit all Man-Machine-Material-Method changes
            </p>
          </div>
          <button
            onClick={fetchChanges}
            disabled={loading}
            className={`
              inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white
              bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
              shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200
              disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed
            `}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>

        {/* Filters – Card */}
        <div className="bg-white rounded-2xl shadow border border-slate-200/80 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* 4M Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">4M Category</label>
              <select
                value={filters.fourM}
                onChange={(e) => setFilters({ ...filters, fourM: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-white shadow-sm"
              >
                <option value="">All Categories</option>
                <option value="Man">Man</option>
                <option value="Machine/Tool">Machine / Tool</option>
                <option value="Material">Material</option>
                <option value="Method">Method</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Approval Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-white shadow-sm"
              >
                <option value="">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="REQUIRED">Pending</option>
                <option value="N/A">No Approval Needed</option>
              </select>
            </div>

            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Search</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Record ID, shopfloor, action..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-1 lg:grid-cols-1 lg:gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow border border-slate-200/80 overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-500">
              <RefreshCw size={32} className="animate-spin mb-4 opacity-70" />
              <p>Loading 4M change records...</p>
            </div>
          ) : error ? (
            <div className="py-16 px-8 text-center text-rose-700 bg-rose-50/60">
              <AlertTriangle size={28} className="mx-auto mb-3" />
              {error}
            </div>
          ) : filteredChanges.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <Layers size={40} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No matching 4M changes found</p>
              <p className="mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Record ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">4M</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date / Shift</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category / Action</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Approval</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Follow-ups</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredChanges.map((item) => {
                    const style = getFourMStyle(item.four_m);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 group-hover:underline"
                          >
                            {item.record_id}
                            <ExternalLink
                              size={14}
                              className="opacity-0 group-hover:opacity-70 transition-opacity"
                            />
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`
                              inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-sm font-semibold border
                              ${style.bg} ${style.text} ${style.border} shadow-sm
                            `}
                          >
                            <span className={`p-1.5 rounded-full ${style.iconBg}`}>
                              <FourMIcon fourM={item.four_m} />
                            </span>
                            {item.four_m}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <div className="font-medium">
                            {item.date ? new Date(item.date).toLocaleDateString('en-GB') : '—'}
                          </div>
                          <div className="text-xs mt-1 text-slate-500">Shift {item.shift}</div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.shopfloor_name || '—'}
                          {item.line_name && <span className="text-slate-400"> → </span>}
                          {item.line_name}
                          {item.station_name && <span className="text-slate-400"> → </span>}
                          {item.station_name}
                        </td>

                        <td className="px-6 py-4 max-w-xl">
                          <div className="font-medium text-slate-900">
                            {item.category_details?.category_type || '—'}
                          </div>
                          <div className="text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                            {item.action_details?.action_taken || 'No action description provided'}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={item.approval_status} />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-6">
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/60 font-medium transition-colors"
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
          )}
        </div>

        {/* Footer summary */}
        {!loading && !error && (
          <div className="text-sm text-slate-500 text-center pt-3 pb-6">
            Showing <strong className="text-slate-700">{filteredChanges.length}</strong> of{' '}
            <strong className="text-slate-700">{changes.length}</strong> records
          </div>
        )}
      </div>
    </div>
  );
}













































// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Search,
//   RefreshCw,
//   Calendar,
//   Clock,
//   Building2,
//   Router,
//   MapPin,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Layers,
//   UserCheck,
//   Flag,
//   FileText,
//   ArrowUpRight,
//   Eye,
//   ExternalLink,
//   Users,
//   Settings,
//   Package,
//   Wrench,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Filter,
//   Download,
//   TrendingUp,
// } from 'lucide-react';

// // ────────────────────────────────────────────────
// // Type Definitions
// // ────────────────────────────────────────────────
// interface Approval {
//   role: { code: string; name: string };
//   status: 'pending' | 'approved' | 'rejected';
//   approved_by?: { username: string };
//   approved_at?: string;
//   remarks?: string;
// }

// interface FourMChange {
//   id: number;
//   record_id: string;
//   four_m: 'Man' | 'Machine/Tool' | 'Material' | 'Method';
//   shift: 'A' | 'B';
//   date: string;
//   time: string;
//   created_at: string;
//   shopfloor_name?: string;
//   line_name?: string;
//   station_name?: string;
//   category_details?: {
//     four_m: string;
//     category_type: 'Planned' | 'Unplanned' | 'Abnormal';
//     description: string;
//   };
//   action_details?: {
//     action_taken: string;
//     set_up_approval: boolean;
//     retroactive_inspection: boolean;
//     ojt: boolean;
//     containment_action: boolean;
//     identification_psn_batch_no: boolean;
//     change_record: boolean;
//     customer_approval: boolean;
//     approving_authority?: string;
//   };
//   approval_status: 'N/A' | 'REQUIRED' | 'APPROVED' | 'REJECTED';
//   approvals: Approval[];
//   is_retro_done: boolean;
//   is_ojt_done: boolean;
//   is_containment_done: boolean;
//   is_batch_done: boolean;
//   is_tracking_done: boolean;
// }

// // ────────────────────────────────────────────────
// // Reusable Components
// // ────────────────────────────────────────────────
// const StatusBadge = ({ status }: { status: string }) => {
//   const styles: Record<string, { bg: string; text: string; border: string; Icon?: any }> = {
//     'N/A': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
//     'APPROVED': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', Icon: CheckCircle },
//     'REJECTED': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', Icon: XCircle },
//     'REQUIRED': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', Icon: Clock },
//   };

//   const config = styles[status] || styles['N/A'];
//   const Icon = config.Icon;

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
//       {Icon && <Icon size={14} strokeWidth={2.5} />}
//       {status}
//     </span>
//   );
// };

// const CompletionIcon = ({ done, label }: { done: boolean; label: string }) => (
//   <div className="group relative">
//     <div className={`p-1.5 rounded-lg transition-all ${done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
//       {done ? (
//         <CheckCircle className="text-emerald-600" size={16} strokeWidth={2.5} />
//       ) : (
//         <XCircle className="text-slate-400" size={16} strokeWidth={2} />
//       )}
//     </div>
//     <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap shadow-xl z-10">
//       {label}: {done ? 'Completed' : 'Pending'}
//       <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
//     </div>
//   </div>
// );

// const FourMIcon = ({ fourM }: { fourM: string }) => {
//   const icons = {
//     'Man': Users,
//     'Machine/Tool': Settings,
//     'Material': Package,
//     'Method': Wrench,
//   };
//   const Icon = icons[fourM as keyof typeof icons] || FileText;
//   return <Icon size={18} strokeWidth={2.5} />;
// };

// const StatCard = ({ icon: Icon, label, value, color }: any) => (
//   <div className={`bg-gradient-to-br ${color} p-5 rounded-xl shadow-sm border border-white/20`}>
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium opacity-90">{label}</p>
//         <p className="text-2xl font-bold mt-1">{value}</p>
//       </div>
//       <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
//         <Icon size={24} strokeWidth={2} />
//       </div>
//     </div>
//   </div>
// );

// // ────────────────────────────────────────────────
// // Main Component
// // ────────────────────────────────────────────────
// export default function FourMChangeHistory() {
//   const [changes, setChanges] = useState<FourMChange[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showFilters, setShowFilters] = useState(true);
//   const [selectedRecord, setSelectedRecord] = useState<FourMChange | null>(null);

//   const [filters, setFilters] = useState({
//     fourM: '',
//     status: '',
//     search: '',
//     dateFrom: '',
//     dateTo: '',
//   });

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   useEffect(() => {
//     fetchChanges();
//   }, []);

//   const fetchChanges = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Simulated data - replace with your actual API call
//       const mockData: FourMChange[] = Array.from({ length: 45 }, (_, i) => ({
//         id: i + 1,
//         record_id: `4M-2025-${String(i + 1).padStart(4, '0')}`,
//         four_m: ['Man', 'Machine/Tool', 'Material', 'Method'][i % 4] as any,
//         shift: i % 2 === 0 ? 'A' : 'B',
//         date: new Date(2025, 0, Math.floor(i / 2) + 1).toISOString().split('T')[0],
//         time: `${8 + (i % 12)}:${(i * 15) % 60}:00`,
//         created_at: new Date(2025, 0, i + 1).toISOString(),
//         shopfloor_name: `Shopfloor ${Math.floor(i / 5) + 1}`,
//         line_name: `Line ${String.fromCharCode(65 + (i % 3))}`,
//         station_name: `Station ${(i % 10) + 1}`,
//         category_details: {
//           four_m: ['Man', 'Machine/Tool', 'Material', 'Method'][i % 4],
//           category_type: ['Planned', 'Unplanned', 'Abnormal'][i % 3] as any,
//           description: 'Category description here',
//         },
//         action_details: {
//           action_taken: `Action taken for change ${i + 1} - detailed description of the actions performed`,
//           set_up_approval: i % 3 === 0,
//           retroactive_inspection: i % 2 === 0,
//           ojt: i % 4 === 0,
//           containment_action: i % 5 === 0,
//           identification_psn_batch_no: i % 3 === 0,
//           change_record: true,
//           customer_approval: i % 6 === 0,
//         },
//         approval_status: ['N/A', 'REQUIRED', 'APPROVED', 'REJECTED'][i % 4] as any,
//         approvals: [],
//         is_retro_done: i % 2 === 0,
//         is_ojt_done: i % 3 === 0,
//         is_containment_done: i % 4 === 0,
//         is_batch_done: i % 5 === 0,
//         is_tracking_done: i % 6 === 0,
//       }));
      
//       setChanges(mockData);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load 4M changes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredChanges = useMemo(() => {
//     return changes.filter((item) => {
//       const matchFourM = !filters.fourM || item.four_m === filters.fourM;
//       const matchStatus = !filters.status || item.approval_status === filters.status;
//       const searchLower = filters.search.toLowerCase();
//       const matchSearch =
//         !filters.search ||
//         item.record_id?.toLowerCase().includes(searchLower) ||
//         item.shopfloor_name?.toLowerCase().includes(searchLower) ||
//         item.line_name?.toLowerCase().includes(searchLower) ||
//         item.action_details?.action_taken?.toLowerCase().includes(searchLower);

//       const matchDate =
//         (!filters.dateFrom || item.date >= filters.dateFrom) &&
//         (!filters.dateTo || item.date <= filters.dateTo);

//       return matchFourM && matchStatus && matchSearch && matchDate;
//     });
//   }, [changes, filters]);

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredChanges.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentItems = filteredChanges.slice(startIndex, endIndex);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters, itemsPerPage]);

//   const getFourMStyle = (fourM: string) => {
//     switch (fourM) {
//       case 'Man': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
//       case 'Machine/Tool': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
//       case 'Material': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
//       case 'Method': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
//       default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
//     }
//   };

//   // Statistics
//   const stats = useMemo(() => ({
//     total: changes.length,
//     approved: changes.filter(c => c.approval_status === 'APPROVED').length,
//     pending: changes.filter(c => c.approval_status === 'REQUIRED').length,
//     rejected: changes.filter(c => c.approval_status === 'REJECTED').length,
//   }), [changes]);

//   // Show detail view if record is selected
//   if (selectedRecord) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <button
//             onClick={() => setSelectedRecord(null)}
//             className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition shadow-sm border border-slate-200"
//           >
//             <ChevronLeft size={18} />
//             Back to List
//           </button>
          
//           <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-slate-900 mb-2">Change Request Details</h2>
//               <p className="text-slate-600">Record ID: {selectedRecord.record_id}</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Basic Information */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                   <FileText size={20} className="text-indigo-600" />
//                   Basic Information
//                 </h3>
                
//                 <div className="space-y-3 pl-7">
//                   <div>
//                     <label className="text-sm font-medium text-slate-500">4M Type</label>
//                     <div className="mt-1">
//                       <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getFourMStyle(selectedRecord.four_m).bg} ${getFourMStyle(selectedRecord.four_m).text} ${getFourMStyle(selectedRecord.four_m).border}`}>
//                         <FourMIcon fourM={selectedRecord.four_m} />
//                         {selectedRecord.four_m}
//                       </span>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Date & Shift</label>
//                     <p className="mt-1 text-slate-900 font-medium">
//                       {new Date(selectedRecord.date).toLocaleDateString('en-GB')} - Shift {selectedRecord.shift}
//                     </p>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Time</label>
//                     <p className="mt-1 text-slate-900 font-medium">{selectedRecord.time}</p>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Approval Status</label>
//                     <div className="mt-1">
//                       <StatusBadge status={selectedRecord.approval_status} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Location Information */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                   <MapPin size={20} className="text-indigo-600" />
//                   Location
//                 </h3>
                
//                 <div className="space-y-3 pl-7">
//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Shopfloor</label>
//                     <p className="mt-1 text-slate-900 font-medium">{selectedRecord.shopfloor_name || 'N/A'}</p>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Line</label>
//                     <p className="mt-1 text-slate-900 font-medium">{selectedRecord.line_name || 'N/A'}</p>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Station</label>
//                     <p className="mt-1 text-slate-900 font-medium">{selectedRecord.station_name || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Category Details */}
//               <div className="space-y-4 md:col-span-2">
//                 <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                   <Layers size={20} className="text-indigo-600" />
//                   Category Details
//                 </h3>
                
//                 <div className="space-y-3 pl-7">
//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Category Type</label>
//                     <p className="mt-1 text-slate-900 font-medium">{selectedRecord.category_details?.category_type || 'N/A'}</p>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Description</label>
//                     <p className="mt-1 text-slate-700">{selectedRecord.category_details?.description || 'No description available'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Details */}
//               <div className="space-y-4 md:col-span-2">
//                 <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                   <Wrench size={20} className="text-indigo-600" />
//                   Action Details
//                 </h3>
                
//                 <div className="space-y-3 pl-7">
//                   <div>
//                     <label className="text-sm font-medium text-slate-500">Action Taken</label>
//                     <p className="mt-1 text-slate-700">{selectedRecord.action_details?.action_taken || 'No action specified'}</p>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                     <div className="flex items-center gap-2">
//                       {selectedRecord.action_details?.set_up_approval ? (
//                         <CheckCircle className="text-emerald-600" size={18} />
//                       ) : (
//                         <XCircle className="text-slate-400" size={18} />
//                       )}
//                       <span className="text-sm text-slate-700">Setup Approval</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {selectedRecord.action_details?.retroactive_inspection ? (
//                         <CheckCircle className="text-emerald-600" size={18} />
//                       ) : (
//                         <XCircle className="text-slate-400" size={18} />
//                       )}
//                       <span className="text-sm text-slate-700">Retro Inspection</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {selectedRecord.action_details?.ojt ? (
//                         <CheckCircle className="text-emerald-600" size={18} />
//                       ) : (
//                         <XCircle className="text-slate-400" size={18} />
//                       )}
//                       <span className="text-sm text-slate-700">OJT</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {selectedRecord.action_details?.containment_action ? (
//                         <CheckCircle className="text-emerald-600" size={18} />
//                       ) : (
//                         <XCircle className="text-slate-400" size={18} />
//                       )}
//                       <span className="text-sm text-slate-700">Containment</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Follow-up Status */}
//               <div className="space-y-4 md:col-span-2">
//                 <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                   <CheckCircle size={20} className="text-indigo-600" />
//                   Follow-up Status
//                 </h3>
                
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pl-7">
//                   <div className="text-center p-4 bg-slate-50 rounded-xl">
//                     <CompletionIcon done={selectedRecord.is_retro_done} label="Retroactive" />
//                     <p className="text-xs text-slate-600 mt-2">Retro Inspection</p>
//                   </div>
//                   <div className="text-center p-4 bg-slate-50 rounded-xl">
//                     <CompletionIcon done={selectedRecord.is_ojt_done} label="OJT" />
//                     <p className="text-xs text-slate-600 mt-2">OJT</p>
//                   </div>
//                   <div className="text-center p-4 bg-slate-50 rounded-xl">
//                     <CompletionIcon done={selectedRecord.is_containment_done} label="Containment" />
//                     <p className="text-xs text-slate-600 mt-2">Containment</p>
//                   </div>
//                   <div className="text-center p-4 bg-slate-50 rounded-xl">
//                     <CompletionIcon done={selectedRecord.is_batch_done} label="Batch ID" />
//                     <p className="text-xs text-slate-600 mt-2">Batch ID</p>
//                   </div>
//                   <div className="text-center p-4 bg-slate-50 rounded-xl">
//                     <CompletionIcon done={selectedRecord.is_tracking_done} label="Tracking" />
//                     <p className="text-xs text-slate-600 mt-2">Tracking</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-[1600px] mx-auto space-y-6">

//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
//                 <Layers className="text-white" size={28} strokeWidth={2.5} />
//               </div>
//               <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
//                 4M Change History
//               </h1>
//             </div>
//             <p className="text-slate-600 ml-16">
//               Track and review all recorded 4M changes with approval & follow-up status
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition shadow-sm border border-slate-200"
//             >
//               <Filter size={18} />
//               {showFilters ? 'Hide' : 'Show'} Filters
//             </button>
//             <button
//               onClick={fetchChanges}
//               disabled={loading}
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-500/30 disabled:opacity-50"
//             >
//               <RefreshCw size={18} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard
//             icon={FileText}
//             label="Total Changes"
//             value={stats.total}
//             color="from-blue-500 to-blue-600 text-white"
//           />
//           <StatCard
//             icon={CheckCircle}
//             label="Approved"
//             value={stats.approved}
//             color="from-emerald-500 to-emerald-600 text-white"
//           />
//           <StatCard
//             icon={Clock}
//             label="Pending"
//             value={stats.pending}
//             color="from-amber-500 to-amber-600 text-white"
//           />
//           <StatCard
//             icon={XCircle}
//             label="Rejected"
//             value={stats.rejected}
//             color="from-rose-500 to-rose-600 text-white"
//           />
//         </div>

//         {/* Filters */}
//         {showFilters && (
//           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 backdrop-blur-sm">
//             <div className="flex items-center gap-2 mb-5">
//               <Filter className="text-indigo-600" size={20} strokeWidth={2.5} />
//               <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">4M Type</label>
//                 <select
//                   value={filters.fourM}
//                   onChange={e => setFilters({ ...filters, fourM: e.target.value })}
//                   className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 >
//                   <option value="">All Types</option>
//                   <option value="Man">Man</option>
//                   <option value="Machine/Tool">Machine/Tool</option>
//                   <option value="Material">Material</option>
//                   <option value="Method">Method</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Approval Status</label>
//                 <select
//                   value={filters.status}
//                   onChange={e => setFilters({ ...filters, status: e.target.value })}
//                   className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 >
//                   <option value="">All Status</option>
//                   <option value="APPROVED">Approved</option>
//                   <option value="REJECTED">Rejected</option>
//                   <option value="REQUIRED">Pending</option>
//                   <option value="N/A">No Approval</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                   <input
//                     type="text"
//                     placeholder="Search records..."
//                     value={filters.search}
//                     onChange={e => setFilters({ ...filters, search: e.target.value })}
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
//                 <input
//                   type="date"
//                   value={filters.dateFrom}
//                   onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
//                   className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
//                 <input
//                   type="date"
//                   value={filters.dateTo}
//                   onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
//                   className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Table */}
//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <FileText className="text-indigo-600" size={20} strokeWidth={2.5} />
//                 <h3 className="font-semibold text-slate-900">Change Records</h3>
//                 <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
//                   {filteredChanges.length}
//                 </span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <label className="text-sm text-slate-600">Show:</label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={e => setItemsPerPage(Number(e.target.value))}
//                   className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="py-24 text-center">
//               <RefreshCw className="animate-spin mx-auto mb-4 text-indigo-600" size={40} />
//               <p className="text-slate-500 font-medium">Loading 4M change records...</p>
//             </div>
//           ) : error ? (
//             <div className="py-16 px-6 text-center">
//               <XCircle className="mx-auto mb-4 text-rose-500" size={48} />
//               <p className="text-rose-600 font-medium">{error}</p>
//             </div>
//           ) : filteredChanges.length === 0 ? (
//             <div className="py-20 text-center">
//               <Search className="mx-auto mb-4 text-slate-400" size={48} />
//               <p className="text-slate-500 font-medium">No records found matching your filters</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-slate-200">
//                   <thead className="bg-slate-50">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Record ID</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">4M Type</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date / Shift</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Location</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Category / Action</th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Approval</th>
//                       <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Follow-ups</th>
//                       <th className="px-6 py-4"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-slate-100">
//                     {currentItems.map((item, idx) => {
//                       const style = getFourMStyle(item.four_m);
//                       return (
//                         <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               <div className="w-1 h-8 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                               <button className="font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5">
//                                 {item.record_id}
//                                 <ExternalLink size={13} className="opacity-0 group-hover:opacity-70 transition-opacity" />
//                               </button>
//                             </div>
//                           </td>

//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm ${style.bg} ${style.text} ${style.border}`}>
//                               <FourMIcon fourM={item.four_m} />
//                               {item.four_m}
//                             </div>
//                           </td>

//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-2 text-sm text-slate-600">
//                               <Calendar size={14} className="text-slate-400" />
//                               <div>
//                                 <div className="font-medium text-slate-900">
//                                   {item.date ? new Date(item.date).toLocaleDateString('en-GB') : '—'}
//                                 </div>
//                                 <div className="text-xs text-slate-500">Shift {item.shift}</div>
//                               </div>
//                             </div>
//                           </td>

//                           <td className="px-6 py-4">
//                             <div className="flex items-start gap-2 text-sm">
//                               <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
//                               <div className="text-slate-600">
//                                 <div className="font-medium text-slate-900">{item.shopfloor_name || '—'}</div>
//                                 {item.line_name && <div className="text-xs">{item.line_name}</div>}
//                               </div>
//                             </div>
//                           </td>

//                           <td className="px-6 py-4 max-w-sm">
//                             <div className="space-y-1">
//                               <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-700">
//                                 {item.category_details?.category_type || '—'}
//                               </div>
//                               <div className="text-sm text-slate-600 line-clamp-2">
//                                 {item.action_details?.action_taken || 'No action description'}
//                               </div>
//                             </div>
//                           </td>

//                           <td className="px-6 py-4">
//                             <StatusBadge status={item.approval_status} />
//                           </td>

//                           <td className="px-6 py-4">
//                             <div className="flex justify-center gap-3">
//                               <CompletionIcon done={item.is_retro_done} label="Retroactive Inspection" />
//                               <CompletionIcon done={item.is_ojt_done} label="On-Job Training" />
//                               <CompletionIcon done={item.is_containment_done} label="Containment Action" />
//                               <CompletionIcon done={item.is_batch_done} label="Batch / PSN Identification" />
//                               <CompletionIcon done={item.is_tracking_done} label="Change Tracking Sheet" />
//                             </div>
//                           </td>

//                           <td className="px-6 py-4 text-right whitespace-nowrap">
//                             <button 
//                               onClick={() => setSelectedRecord(item)}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg font-medium transition"
//                             >
//                               <Eye size={16} strokeWidth={2.5} />
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                   <div className="text-sm text-slate-600">
//                     Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{' '}
//                     <span className="font-semibold text-slate-900">{Math.min(endIndex, filteredChanges.length)}</span> of{' '}
//                     <span className="font-semibold text-slate-900">{filteredChanges.length}</span> results
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => setCurrentPage(1)}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronsLeft size={18} />
//                     </button>
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronLeft size={18} />
//                     </button>

//                     <div className="flex items-center gap-1">
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
//                             className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition ${
//                               currentPage === pageNum
//                                 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
//                                 : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       })}
//                     </div>

//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronRight size={18} />
//                     </button>
//                     <button
//                       onClick={() => setCurrentPage(totalPages)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronsRight size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

