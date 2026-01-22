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
  User,
  AlertCircle
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
  action_details?: { identification_psn_batch_no: boolean };
}

// ✅ NEW: Interface for the backend response
interface SavedIdentificationRecord {
  id: number;
  change: number;
  old_batch_no: string;
  new_batch_no: string;
  psn_start: string;
  identification_method: string;
  part_name: string;
  remarks: string;
  updated_by: string;
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
  const [isViewMode, setIsViewMode] = useState(false); 
  
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

      const changes: ChangeRecord[] = await changesRes.json();
      const existingIds: SavedIdentificationRecord[] = await idsRes.json();
      
      // Map existing IDs for easy lookup
      const doneMap = new Map<number, SavedIdentificationRecord>(
        existingIds.map((item) => [item.change, item])
      );
      
      // Filter Pending: Needs ID but NOT in doneMap
      const pending = changes.filter((c) => 
        c.action_details?.identification_psn_batch_no === true && 
        !doneMap.has(c.id)
      );
      
      setPendingChanges(pending);

      // --- AUTO OPEN LOGIC ---
      const filterId = localStorage.getItem("filter_change_request_id");
      if (filterId) {
        localStorage.removeItem("filter_change_request_id");
        
        // Find record in ALL changes (could be pending OR completed)
        const targetChange = changes.find((c) => c.record_id === filterId);
        
        if (targetChange) {
            const savedData = doneMap.get(targetChange.id);

            if (savedData) {
                // CASE A: VIEW MODE
                setIsViewMode(true);
                setSelectedChange(targetChange);
                setForm({
                    old_batch_no: savedData.old_batch_no || '',
                    new_batch_no: savedData.new_batch_no || '',
                    psn_start: savedData.psn_start || '',
                    identification_method: savedData.identification_method || 'Green Tag',
                    part_name: savedData.part_name || '', 
                    remarks: savedData.remarks || ''
                });
            } else {
                // CASE B: EDIT MODE
                setIsViewMode(false);
                handleSelect(targetChange);
            }
        }
      }

    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (record: ChangeRecord) => {
    setIsViewMode(false);
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

    // View Mode: Close or Return
    if (isViewMode) {
        const returnId = localStorage.getItem("return_to_detail_id");
        if (returnId) {
            setSelectedModule("cm");
        } else {
            setSelectedChange(null);
            setForm({ old_batch_no: '', new_batch_no: '', psn_start: '', identification_method: 'Green Tag', part_name: '', remarks: '' });
            setIsViewMode(false);
        }
        return;
    }

    try {
      setLoading(true);
      
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
      alert("Error saving record. Check console.");
      console.error(error);
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
            No pending records require identification or batch control.
        </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-900 flex flex-col">
      
      {/* ── Page Header ────────────────────────────────────── */}
      <header className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-md text-white">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Identification & Batch Control</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Traceability management for 4M changes</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="hidden md:flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            <div className="text-right">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</span>
                <span className="block text-xl font-bold text-indigo-600 leading-none">{pendingChanges.length}</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <AlertCircle className="w-5 h-5 text-indigo-400" />
        </div>
      </header>

      {/* ── Main Layout ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* ── Left Sidebar: Pending List ───────────────────── */}
        <div className="xl:col-span-4 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-180px)]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Pending Actions
            </h3>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                {pendingChanges.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
            {pendingChanges.length === 0 ? <EmptyState /> : (
                pendingChanges.map(change => (
                <div 
                    key={change.id}
                    onClick={() => handleSelect(change)}
                    className={`
                        group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer
                        ${selectedChange?.id === change.id 
                            ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-300' 
                            : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm'
                        }
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Record ID</span>
                            <div className="font-bold text-gray-900 text-base">{change.record_id}</div>
                        </div>
                        <span className={`
                            px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                            ${change.category_details?.category_type === 'Planned' ? 'bg-green-50 text-green-700 border-green-200' : 
                              change.category_details?.category_type === 'Unplanned' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                              'bg-red-50 text-red-700 border-red-200'}
                        `}>
                            {change.category_details?.category_type || 'N/A'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200/50">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{change.line_name || 'No Line'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            <Layout className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{change.four_m}</span>
                        </div>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* ── Right Area: Form ────────────────────────────── */}
        <div className="xl:col-span-8 flex flex-col h-[calc(100vh-180px)]">
          {selectedChange ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
              
              {/* Form Header */}
              <div className={`px-6 py-4 border-b flex justify-between items-center ${isViewMode ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className={`text-lg font-bold ${isViewMode ? 'text-green-800' : 'text-gray-900'}`}>
                        {isViewMode ? 'Record Details (Read Only)' : 'Identification Details'}
                    </h2>
                    {isViewMode && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-200 text-green-800 text-[10px] font-bold rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> COMPLETED
                        </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">ID:</span>
                    <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                        {selectedChange.record_id}
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedChange(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Context Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Shopfloor', value: selectedChange.shopfloor_name, icon: MapPin },
                        { label: 'Line', value: selectedChange.line_name, icon: Layout },
                        { label: 'Station', value: selectedChange.station_name, icon: Hash },
                        { label: 'Shift', value: selectedChange.shift, icon: Clock },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <item.icon className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-xs truncate" title={item.value || '-'}>
                                {item.value || '-'}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="h-px bg-gray-100 w-full" />

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Part Name / Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input 
                            required
                            disabled={isViewMode}
                            type="text" 
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium disabled:opacity-60"
                            placeholder="e.g. Engine Valve 202X"
                            value={form.part_name}
                            onChange={e => setForm({...form, part_name: e.target.value})}
                            />
                            <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Identification Method</label>
                        <div className="relative">
                            <select 
                            disabled={isViewMode}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium appearance-none disabled:opacity-60"
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
                            <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>
                </div>

                <div className={`p-5 rounded-xl border grid grid-cols-1 md:grid-cols-3 gap-5 ${isViewMode ? 'bg-gray-50 border-gray-200' : 'bg-indigo-50/40 border-indigo-100'}`}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Old Batch No.</label>
                        <input 
                        disabled={isViewMode}
                        type="text" 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm disabled:text-gray-500"
                        placeholder="Last OK Batch"
                        value={form.old_batch_no}
                        onChange={e => setForm({...form, old_batch_no: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-indigo-600 uppercase">New Batch No. (Start) *</label>
                        <input 
                        required
                        disabled={isViewMode}
                        type="text" 
                        className="w-full px-3 py-2 bg-white border-2 border-indigo-200 rounded-lg focus:border-indigo-500 outline-none text-sm font-bold text-indigo-900 disabled:text-gray-600 disabled:border-gray-200"
                        placeholder="First Change Batch"
                        value={form.new_batch_no}
                        onChange={e => setForm({...form, new_batch_no: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Start Serial (PSN)</label>
                        <input 
                        disabled={isViewMode}
                        type="text" 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm disabled:text-gray-500"
                        placeholder="Optional"
                        value={form.psn_start}
                        onChange={e => setForm({...form, psn_start: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Remarks / Notes</label>
                    <textarea 
                        disabled={isViewMode}
                        rows={3}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-none resize-none text-sm disabled:bg-gray-100"
                        placeholder="Add any specific details..."
                        value={form.remarks}
                        onChange={e => setForm({...form, remarks: e.target.value})}
                    />
                </div>
              </div>

              {/* Form Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    <span>User: <strong>{user?.name || 'Unknown'}</strong></span>
                 </div>
                 <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={() => setSelectedChange(null)}
                        className="px-5 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isViewMode ? 'Close' : 'Cancel'}
                    </button>
                    {!isViewMode && (
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> Submit
                                </>
                            )}
                        </button>
                    )}
                 </div>
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <div className="bg-gray-50 p-5 rounded-full mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Selection</h3>
              <p className="text-gray-500 text-sm">Select a record from the left to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentificationPage;