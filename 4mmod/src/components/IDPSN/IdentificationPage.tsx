import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Hash, 
  Tag, 
  MapPin, 
  Calendar, 
  FileText,
  CheckCircle2,
  Clock,
  Layout,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// --- Interfaces ---
interface PageProps {
  setSelectedModule: (id: string) => void;
}

interface ChangeRecord {
  id: number;
  record_id: string;
  four_m: string;
  shopfloor_name: string;
  line_name: string;
  station_name: string;
  shift: string;
  category_details?: { category_type: string; description: string };
}

interface BatchFormData {
  old_batch_no: string;
  new_batch_no: string;
  psn_start: string;
  identification_method: string;
  part_name: string;
  remarks: string;
}

const API_BASE = 'http://127.0.0.1:8000/api';

const IdentificationPage: React.FC<PageProps> = ({ setSelectedModule }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ChangeRecord[]>([]);
  const [selectedChange, setSelectedChange] = useState<ChangeRecord | null>(null);
  
  // Form State
  const [form, setForm] = useState<BatchFormData>({
    old_batch_no: '',
    new_batch_no: '',
    psn_start: '',
    identification_method: 'Green Tag',
    part_name: '',
    remarks: ''
  });

  // --- Initial Data Fetching ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [changesRes, idsRes] = await Promise.all([
        fetch(`${API_BASE}/4m-changes/`),
        fetch(`${API_BASE}/identification/`)
      ]);

      const changes = await changesRes.json();
      const existingIds = await idsRes.json();
      const doneIds = new Set(existingIds.map((item: any) => item.change));
      
      const pending = changes.filter((c: any) => 
        c.action_details?.identification_psn_batch_no === true && 
        !doneIds.has(c.id)
      );
      
      setPendingChanges(pending);

      // Auto-open logic
      const filterId = localStorage.getItem("filter_change_request_id");
      if (filterId) {
        localStorage.removeItem("filter_change_request_id");
        const target = pending.find((c: any) => c.record_id === filterId);
        if (target) handleSelect(target);
      }

    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (record: ChangeRecord) => {
    setSelectedChange(record);
    setForm({
      old_batch_no: '',
      new_batch_no: '',
      psn_start: '',
      identification_method: 'Green Tag',
      part_name: '', 
      remarks: record.category_details?.description || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChange) return;

    try {
      setLoading(true);
      
      // Sanitize payload to avoid null errors
      const payload = {
        change: selectedChange.id,
        shopfloor_name: selectedChange.shopfloor_name || "",
        line_name: selectedChange.line_name || "",
        updated_by: user?.name || 'Unknown',
        ...form
      };

      const res = await fetch(`${API_BASE}/identification/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save");

      // Success Logic
      const returnId = localStorage.getItem("return_to_detail_id");
      if (returnId && selectedChange.record_id === returnId) {
         setSelectedModule("cm"); 
      } else {
         setSelectedChange(null);
         fetchData();
         alert("Batch Identification Record Saved!");
      }

    } catch (error) {
      alert("Error saving record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI COMPONENTS ---

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-50 rounded-full p-4 mb-4 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
        <p className="text-sm text-gray-500 max-w-xs mt-1">
            No pending records require identification or batch control at the moment.
        </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-900">
      
      {/* ── Page Header ────────────────────────────────────── */}
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-5">
          <div className="p-3.5 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg shadow-indigo-200 text-white">
            <Tag className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Identification & Batch Control</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Manage traceability for 4M changes</p>
          </div>
        </div>
        
        {/* Quick Stats (Optional) */}
        <div className="hidden md:flex gap-6">
            <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{pendingChanges.length}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</div>
            </div>
        </div>
      </header>

      {/* ── Main Layout ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* ── Left Sidebar: Pending List ───────────────────── */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Pending Actions
            </h3>
            <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{pendingChanges.length}</span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {pendingChanges.length === 0 ? <EmptyState /> : (
                pendingChanges.map(change => (
                <div 
                    key={change.id}
                    onClick={() => handleSelect(change)}
                    className={`
                        group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                        ${selectedChange?.id === change.id 
                            ? 'bg-white border-indigo-500 shadow-lg ring-1 ring-indigo-500/20' 
                            : 'bg-white border-gray-100 hover:border-indigo-300 hover:shadow-md'
                        }
                    `}
                >
                    {/* Active Indicator Strip */}
                    {selectedChange?.id === change.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
                    )}

                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Record ID</span>
                            <div className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                                {change.record_id}
                            </div>
                        </div>
                        <span className={`
                            px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border
                            ${change.category_details?.category_type === 'Planned' ? 'bg-green-50 text-green-700 border-green-200' : 
                              change.category_details?.category_type === 'Unplanned' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                              'bg-red-50 text-red-700 border-red-200'}
                        `}>
                            {change.category_details?.category_type || 'N/A'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 mt-2 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[100px]" title={change.line_name}>{change.line_name || 'No Line'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Layout className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate">{change.four_m}</span>
                        </div>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* ── Right Area: Form ────────────────────────────── */}
        <div className="xl:col-span-8">
          {selectedChange ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white overflow-hidden ring-1 ring-black/5 animate-in slide-in-from-right-4 duration-500">
              
              {/* Form Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Identification Details</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-gray-500">Editing Record:</span>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                        {selectedChange.record_id}
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedChange(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close Form"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-8">
                
                {/* Context Cards (Read-only info) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Shopfloor', value: selectedChange.shopfloor_name, icon: MapPin },
                        { label: 'Line', value: selectedChange.line_name, icon: Layout },
                        { label: 'Station', value: selectedChange.station_name, icon: Hash },
                        { label: 'Date', value: new Date().toLocaleDateString(), icon: Calendar },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <item.icon className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm truncate" title={item.value || '-'}>
                                {item.value || '-'}
                            </span>
                        </div>
                    ))}
                </div>

                <hr className="border-gray-100" />

                {/* Input Fields */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700">Part Name / Number <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <input 
                                required
                                type="text" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                placeholder="e.g. Engine Valve 202X"
                                value={form.part_name}
                                onChange={e => setForm({...form, part_name: e.target.value})}
                                />
                                <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700">Identification Method</label>
                            <div className="relative group">
                                <select 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                                value={form.identification_method}
                                onChange={e => setForm({...form, identification_method: e.target.value})}
                                >
                                <option>Green Tag</option>
                                <option>Red Tag</option>
                                <option>White Marker</option>
                                <option>Punch Mark</option>
                                <option>Sticker</option>
                                <option>Paint Dot</option>
                                </select>
                                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Old Batch No.</label>
                            <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                            placeholder="Last OK Batch"
                            value={form.old_batch_no}
                            onChange={e => setForm({...form, old_batch_no: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-indigo-600 uppercase tracking-wide">New Batch No. (Start) <span className="text-red-500">*</span></label>
                            <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 bg-white border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-indigo-900"
                            placeholder="First Change Batch"
                            value={form.new_batch_no}
                            onChange={e => setForm({...form, new_batch_no: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Start Serial (PSN)</label>
                            <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                            placeholder="Optional"
                            value={form.psn_start}
                            onChange={e => setForm({...form, psn_start: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">Remarks / Notes</label>
                        <textarea 
                            rows={3}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all text-sm"
                            placeholder="Add any specific details about the identification process..."
                            value={form.remarks}
                            onChange={e => setForm({...form, remarks: e.target.value})}
                        />
                    </div>
                </div>

              </div>

              {/* Form Footer */}
              <div className="bg-gray-50/80 px-8 py-5 flex justify-between items-center border-t border-gray-200">
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User className="w-3.5 h-3.5" />
                    <span>Logged in as <strong>{user?.name || 'User'}</strong></span>
                 </div>
                 <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={() => setSelectedChange(null)}
                        className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Submit Record
                            </>
                        )}
                    </button>
                 </div>
              </div>
            </form>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-6 animate-pulse">
                <FileText className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Record Selected</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Select a pending change record from the list on the left to start filling out the Identification & Batch details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentificationPage;