import React, { useState, useEffect } from 'react';
import { 
  User, 
  Hash, 
  Calendar, 
  Package, 
  Settings, 
  FileText, 
  ArrowLeft, 
  Save, 
  Clock, 
  CheckCircle2, 
  Layout, 
  MapPin,
  AlertCircle
} from 'lucide-react';

import SuccessModal from '../Common/SuccessModal';
// --- Interfaces ---

interface PageProps {
  setSelectedModule: (id: string) => void;
}

interface ChangeRecord {
  id: number;
  record_id: string;
  four_m: string;
  shopfloor_name?: string;
  line_name?: string;
  station_name?: string;
  shift?: string;
  category_details?: {
    category_type: string;
  };
  action_details?: {
    retroactive_inspection: boolean;
  };
}

interface SubmittedRCR {
  id: number;
  change: number;
  record_id?: string;
  four_m_type?: string;
  date: string;
  part_name_number: string;
  type_of_change: string;
  lot_qty: number;
  ok_qty: number;
  reject_qty: number;
  rework_qty: number;
  parameter: string;
  specification: string;
  inspection_method: string;
  observation1: string;
  observation2: string;
  observation3: string;
  observation4: string;
  observation5: string;
  inspected_by: string;
  remarks: string;
  checked_by?: string;
}

interface RowData {
  date: string;
  partNameNo: string;
  typeOfChange: string;
  lotQty: string;
  okQty: string;
  rejQty: string;
  reworkQty: string;
  parameter: string;
  specification: string;
  inspectionMethod: string;
  observations: string[];
  inspectedBy: string;
  remarks: string;
}

interface FormData {
  checkedBy: string;
  row: RowData;
}

const API_BASE = 'http://127.0.0.1:8000/api';

export default function RetroactiveCheckRecord({ setSelectedModule }: PageProps) {
  const [loading, setLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ChangeRecord[]>([]);
  const [selectedChange, setSelectedChange] = useState<ChangeRecord | null>(null);
  const [isViewMode, setIsViewMode] = useState(false); // Controls Read-Only state  
  // Custom Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    checkedBy: '',
    row: {
      date: new Date().toISOString().split('T')[0],
      partNameNo: '', 
      typeOfChange: '', 
      lotQty: '', okQty: '', rejQty: '', reworkQty: '',
      parameter: '', specification: '', inspectionMethod: '', 
      observations: Array(5).fill(''),
      inspectedBy: '', remarks: '',
    },
  });

  // --- Initial Load ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [changesRes, rcrRes] = await Promise.all([
        fetch(API_BASE + '/4m-changes/'),
        fetch(API_BASE + '/rcr/')
      ]);
      
      const changes: ChangeRecord[] = await changesRes.json();
      const rcrs: SubmittedRCR[] = await rcrRes.json();
      
      // Map for easy lookup: ChangeID -> RCR Data
      const rcrMap = new Map(rcrs.map((r) => [r.change, r]));
      
      // Filter Pending: Changes that need Retro but DON'T have an RCR yet
      const pending = changes.filter((c) => 
        c.action_details?.retroactive_inspection === true && 
        !rcrMap.has(c.id)
      );
      
      setPendingChanges(pending);

      // --- AUTO OPEN LOGIC (Handle Return from Detail Page) ---
      const filterId = localStorage.getItem("filter_change_request_id");
      if (filterId) {
        localStorage.removeItem("filter_change_request_id");
        
        // Look in ALL changes (because it might be already done/completed)
        const targetChange = changes.find(c => c.record_id === filterId);
        
        if (targetChange) {
          const savedRCR = rcrMap.get(targetChange.id);

          if (savedRCR) {
            // CASE A: VIEW MODE (Already Done)
            setIsViewMode(true);
            setSelectedChange(targetChange);
            populateForm(savedRCR);
          } else {
            // CASE B: EDIT MODE (Pending)
            setIsViewMode(false);
            handleSelectChange(targetChange);
          }
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (rcr: SubmittedRCR) => {
    setFormData({
      checkedBy: rcr.checked_by || '',
      row: {
        date: rcr.date,
        partNameNo: rcr.part_name_number,
        typeOfChange: rcr.type_of_change,
        lotQty: String(rcr.lot_qty),
        okQty: String(rcr.ok_qty),
        rejQty: String(rcr.reject_qty),
        reworkQty: String(rcr.rework_qty),
        parameter: rcr.parameter,
        specification: rcr.specification,
        inspectionMethod: rcr.inspection_method,
        observations: [
          rcr.observation1 || '',
          rcr.observation2 || '',
          rcr.observation3 || '',
          rcr.observation4 || '',
          rcr.observation5 || '',
        ],
        inspectedBy: rcr.inspected_by,
        remarks: rcr.remarks
      }
    });
  };

  const handleSelectChange = (change: ChangeRecord) => {
    setIsViewMode(false);
    setSelectedChange(change);
    // Reset form with Change Context
    setFormData({
      checkedBy: '',
      row: {
        ...formData.row,
        date: new Date().toISOString().split('T')[0],
        typeOfChange: change.category_details?.category_type || '',
        partNameNo: '', lotQty: '', okQty: '', rejQty: '', reworkQty: '',
        parameter: '', specification: '', inspectionMethod: '',
        observations: Array(5).fill(''), inspectedBy: '', remarks: ''
      }
    });
  };

  const handleInputChange = (field: keyof RowData, value: string) => {
    setFormData({ ...formData, row: { ...formData.row, [field]: value } });
  };

  const handleObservationChange = (idx: number, value: string) => {
    const obs = [...formData.row.observations];
    obs[idx] = value;
    setFormData({ ...formData, row: { ...formData.row, observations: obs } });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   // IF VIEW MODE: Just close or return
  //   if (isViewMode) {
  //     const returnId = localStorage.getItem("return_to_detail_id");
  //     if (returnId) {
  //       setSelectedModule("cm");
  //     } else {
  //       setSelectedChange(null);
  //       setIsViewMode(false);
  //     }
  //     return;
  //   }

  //   if (!selectedChange) return;

  //   try {
  //     setLoading(true);
  //     const row = formData.row;
  //     const payload = {
  //       change: selectedChange.id, 
  //       date: row.date, 
  //       part_name_number: row.partNameNo,
  //       type_of_change: row.typeOfChange, 
  //       lot_qty: Number(row.lotQty) || 0,
  //       ok_qty: Number(row.okQty) || 0, 
  //       reject_qty: Number(row.rejQty) || 0,
  //       rework_qty: Number(row.reworkQty) || 0, 
  //       parameter: row.parameter,
  //       specification: row.specification, 
  //       inspection_method: row.inspectionMethod,
  //       observation1: row.observations[0], 
  //       observation2: row.observations[1],
  //       observation3: row.observations[2], 
  //       observation4: row.observations[3],
  //       observation5: row.observations[4], 
  //       inspected_by: row.inspectedBy,
  //       remarks: row.remarks, 
  //       checked_by: formData.checkedBy,
  //     };

  //     const res = await fetch(API_BASE + '/rcr/', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) throw new Error('Failed to save RCR');

  //     alert('RCR saved successfully!');

  //     // --- RETURN LOGIC ---
  //     const returnId = localStorage.getItem("return_to_detail_id");
  //     if (returnId && selectedChange.record_id === returnId) {
  //         setSelectedModule("cm"); 
  //     } else {
  //         // Reset and Refresh
  //         setSelectedChange(null);
  //         fetchData(); 
  //     }

  //   } catch (error) {
  //     alert('Error saving record. Please check console.');
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // IF VIEW MODE: Just close or return
 if (isViewMode) {
      handleReturn();
      return;
    }

    if (!selectedChange) return;

    try {
      setLoading(true);
      const row = formData.row;
      const payload = {
        change: selectedChange.id, 
        date: row.date, 
        part_name_number: row.partNameNo,
        type_of_change: row.typeOfChange, 
        lot_qty: Number(row.lotQty) || 0,
        ok_qty: Number(row.okQty) || 0, 
        reject_qty: Number(row.rejQty) || 0,
        rework_qty: Number(row.reworkQty) || 0, 
        parameter: row.parameter,
        specification: row.specification, 
        inspection_method: row.inspectionMethod,
        observation1: row.observations[0], 
        observation2: row.observations[1],
        observation3: row.observations[2], 
        observation4: row.observations[3],
        observation5: row.observations[4], 
        inspected_by: row.inspectedBy,
        remarks: row.remarks, 
        checked_by: formData.checkedBy,
      };

      const res = await fetch(API_BASE + '/rcr/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save RCR');

      // alert('RCR saved successfully!');
      // ✅ OPEN THE REUSABLE MODAL
      setShowSuccessModal(true);

      // // --- RETURN LOGIC ---
      // const returnId = localStorage.getItem("return_to_detail_id");
      // if (returnId && selectedChange.record_id === returnId) {
      //     setSelectedModule("cm"); 
      // } else {
      //     // Reset and Refresh
      //     setSelectedChange(null);
      //     fetchData(); 
      // }

    } catch (error) {
      alert('Error saving record. Please check console.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleReturn = () => {
      setShowSuccessModal(false);
      const returnId = localStorage.getItem("return_to_detail_id");
      if (returnId) { 
          setSelectedModule("cm"); 
      } else {
          setSelectedChange(null);
          setIsViewMode(false);
          fetchData(); 
      }
  };

  // --- UI Components ---

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-50 rounded-full p-4 mb-4 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No Pending Items</h3>
        <p className="text-sm text-gray-500 max-w-xs mt-1">
            All retroactive checks have been completed.
        </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-900 flex flex-col">
      {/* ✅ USE THE REUSABLE MODAL HERE */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleReturn}
        title="RCR Saved!"
        message={
          <>
            Retroactive Check Record for <span className="font-bold text-gray-900">{selectedChange?.record_id}</span> has been submitted successfully.
          </>
        }
      />
      {/* ── Page Header ────────────────────────────────────── */}
      <header className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-md text-white">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Retroactive Check Record</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Quality Inspection for previous batches</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            <div className="text-right">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</span>
                <span className="block text-xl font-bold text-orange-600 leading-none">{pendingChanges.length}</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <AlertCircle className="w-5 h-5 text-orange-400" />
        </div>
      </header>

      {/* ── Main Layout ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* ── Left Sidebar: Pending List ───────────────────── */}
        <div className="xl:col-span-4 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-180px)]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" /> Pending Actions
            </h3>
            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                {pendingChanges.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
            {pendingChanges.length === 0 ? <EmptyState /> : (
                pendingChanges.map(change => (
                <div 
                    key={change.id}
                    onClick={() => handleSelectChange(change)}
                    className={`
                        group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer
                        ${selectedChange?.id === change.id 
                            ? 'bg-orange-50 border-orange-200 shadow-sm ring-1 ring-orange-300' 
                            : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-sm'
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
                        {isViewMode ? 'Record Details (Read Only)' : 'RCR Entry'}
                    </h2>
                    {isViewMode && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-200 text-green-800 text-[10px] font-bold rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> COMPLETED
                        </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">For Record:</span>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                
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

                {/* --- Form Section 1: Basic Info --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Date</label>
                        <input type="date" disabled={isViewMode} className="w-full p-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500" value={formData.row.date} onChange={(e) => handleInputChange('date', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Part Name/No</label>
                        <input type="text" disabled={isViewMode} className="w-full p-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500" value={formData.row.partNameNo} onChange={(e) => handleInputChange('partNameNo', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Type of Change</label>
                        <input type="text" disabled className="w-full p-2 border rounded-lg text-sm bg-gray-100 text-gray-600" value={formData.row.typeOfChange} />
                    </div>
                </div>

                {/* --- Form Section 2: Quantities --- */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2"><Package className="w-4 h-4"/> Quantities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['lotQty', 'okQty', 'rejQty', 'reworkQty'].map((field) => (
                            <div key={field}>
                                <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">
                                    {field.replace('Qty', '').toUpperCase()}
                                </label>
                                <input 
                                    type="number" 
                                    disabled={isViewMode}
                                    className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-white/50 disabled:text-gray-500"
                                    value={formData.row[field as keyof RowData] as string} 
                                    onChange={(e) => handleInputChange(field as keyof RowData, e.target.value)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Form Section 3: Technical Specs --- */}
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <h4 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2"><Settings className="w-4 h-4"/> Technical Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['parameter', 'specification', 'inspectionMethod'].map((field) => (
                            <div key={field}>
                                <label className="text-[10px] font-bold text-purple-600 uppercase mb-1 block">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input 
                                    type="text" 
                                    disabled={isViewMode}
                                    className="w-full p-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-200 outline-none disabled:bg-white/50 disabled:text-gray-500"
                                    value={formData.row[field as keyof RowData] as string} 
                                    onChange={(e) => handleInputChange(field as keyof RowData, e.target.value)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Form Section 4: Observations --- */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Observations (5 Samples)</label>
                    <div className="grid grid-cols-5 gap-2">
                        {formData.row.observations.map((obs, idx) => (
                            <input 
                                key={idx}
                                type="text"
                                disabled={isViewMode}
                                placeholder={`Obs ${idx + 1}`}
                                className="w-full p-2 border rounded-lg text-sm text-center disabled:bg-gray-50 disabled:text-gray-500"
                                value={obs}
                                onChange={(e) => handleObservationChange(idx, e.target.value)}
                            />
                        ))}
                    </div>
                </div>

                {/* --- Form Section 5: Signatures & Remarks --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Remarks</label>
                        <textarea 
                            rows={2} 
                            disabled={isViewMode}
                            className="w-full p-3 border rounded-lg text-sm resize-none disabled:bg-gray-50 disabled:text-gray-500" 
                            value={formData.row.remarks} 
                            onChange={(e) => handleInputChange('remarks', e.target.value)} 
                        />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Inspected By</label>
                            <input 
                                type="text" 
                                disabled={isViewMode}
                                className="w-full p-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500" 
                                value={formData.row.inspectedBy} 
                                onChange={(e) => handleInputChange('inspectedBy', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Checked By</label>
                            <input 
                                type="text" 
                                disabled={isViewMode}
                                className="w-full p-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500" 
                                value={formData.checkedBy} 
                                onChange={(e) => setFormData({...formData, checkedBy: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

              </div>

              {/* Form Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
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
                        className="px-6 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg shadow-md shadow-orange-200 hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Submit Record
                            </>
                        )}
                    </button>
                 )}
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <div className="bg-gray-50 p-5 rounded-full mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Selection</h3>
              <p className="text-gray-500 text-sm">Select a pending record from the left to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// import { useState, useEffect } from 'react';
// import { Plus, User, Hash, Calendar, Package, Settings, FileText, Eye, ArrowLeft, CheckCircle } from 'lucide-react';


// interface PageProps {
//   setSelectedModule: (id: string) => void;
// }

// interface RowData {
//   date: string;
//   partNameNo: string;
//   typeOfChange: string;
//   lotQty: string;
//   okQty: string;
//   rejQty: string;
//   reworkQty: string;
//   parameter: string;
//   specification: string;
//   inspectionMethod: string;
//   observations: string[];
//   inspectedBy: string;
//   remarks: string;
// }

// interface FormData {
//   checkedBy: string;
//   row: RowData;
// }

// interface ChangeRecord {
//   id: number;
//   record_id: string;
//   four_m: string;
//   category_details?: {
//     category_type: string;
//   };
// }

// interface SubmittedRCR {
//   id: number;
//   change: number;
//   record_id?: string;
//   four_m_type?: string;
//   date: string;
//   part_name_number: string;
//   type_of_change: string;
//   lot_qty: number;
//   ok_qty: number;
//   reject_qty: number;
//   rework_qty: number;
//   parameter: string;
//   specification: string;
//   inspection_method: string;
//   observation1: string;
//   observation2: string;
//   observation3: string;
//   observation4: string;
//   observation5: string;
//   inspected_by: string;
//   remarks: string;
//   checked_by?: string;
// }

// const API_BASE = 'http://localhost:8000/api';

// // export default function RetroactiveCheckRecord() {
// export default function RetroactiveCheckRecord({ setSelectedModule }: PageProps) {
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     checkedBy: '',
//     row: {
//       date: '', partNameNo: '', typeOfChange: '', lotQty: '', okQty: '', rejQty: '', reworkQty: '',
//       parameter: '', specification: '', inspectionMethod: '', observations: Array(5).fill(''),
//       inspectedBy: '', remarks: '',
//     },
//   });
//   const [submittedRCRs, setSubmittedRCRs] = useState<SubmittedRCR[]>([]);
//   const [pendingChanges, setPendingChanges] = useState<ChangeRecord[]>([]);
//   const [selectedChange, setSelectedChange] = useState<ChangeRecord | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [filterId, setFilterId] = useState<string>(''); // NEW

//   useEffect(() => {
//     fetchPendingChanges();
//     fetchSubmittedRCRs();
//   }, []);

//   // NEW: Catch ID from Detail Page
//   useEffect(() => {
//     const passedId = localStorage.getItem("filter_change_request_id");
//     if (passedId) {
//       setFilterId(passedId);
//       localStorage.removeItem("filter_change_request_id");
//     }
//   }, []);

//   // NEW: Auto-open form if filterId matches a pending change
//   useEffect(() => {
//     if (filterId && pendingChanges.length > 0) {
//       const targetChange = pendingChanges.find(c => c.record_id === filterId);
//       if (targetChange) {
//         handleSelectChange(targetChange);
//       }
//     }
//   }, [filterId, pendingChanges]);

//   const fetchSubmittedRCRs = async () => {
//     try {
//       const res = await fetch(API_BASE + '/rcr/');
//       if (res.ok) setSubmittedRCRs(await res.json());
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchPendingChanges = async () => {
//     setLoading(true);
//     try {
//       const [changesRes, rcrRes] = await Promise.all([
//         fetch(API_BASE + '/4m-changes/'),
//         fetch(API_BASE + '/rcr/')
//       ]);
      
//       const changes = await changesRes.json();
//       const rcrs = await rcrRes.json();
//       const submittedIds = new Set(rcrs.map((r: any) => r.change));
      
//       const pending = changes.filter((c: any) => 
//         c.action_details?.retroactive_inspection && !submittedIds.has(c.id)
//       );

//       // You can filter the display list:
//       // const displayPending = filterId 
//       //   ? pendingChanges.filter(c => c.record_id === filterId)
//       //   : pendingChanges;
      
//       setPendingChanges(pending);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectChange = (change: ChangeRecord) => {
//     setSelectedChange(change);
//     setFormData({
//       ...formData,
//       row: { ...formData.row, typeOfChange: change.category_details?.category_type || '' }
//     });
//     setShowForm(true);
//   };

//   const handleInputChange = (field: keyof RowData, value: string) => {
//     setFormData({ ...formData, row: { ...formData.row, [field]: value } });
//   };

//   const handleObservationChange = (idx: number, value: string) => {
//     const obs = [...formData.row.observations];
//     obs[idx] = value;
//     setFormData({ ...formData, row: { ...formData.row, observations: obs } });
//   };

//   const handleSubmit = async () => {
//     if (!selectedChange) return alert('No change record selected');

//     try {
//       setLoading(true);
//       const row = formData.row;
//       const payload = {
//         change: selectedChange.id, date: row.date, part_name_number: row.partNameNo,
//         type_of_change: row.typeOfChange, lot_qty: Number(row.lotQty) || 0,
//         ok_qty: Number(row.okQty) || 0, reject_qty: Number(row.rejQty) || 0,
//         rework_qty: Number(row.reworkQty) || 0, parameter: row.parameter,
//         specification: row.specification, inspection_method: row.inspectionMethod,
//         observation1: row.observations[0], observation2: row.observations[1],
//         observation3: row.observations[2], observation4: row.observations[3],
//         observation5: row.observations[4], inspected_by: row.inspectedBy,
//         remarks: row.remarks, checked_by: formData.checkedBy,
//       };

//       const res = await fetch(API_BASE + '/rcr/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) return alert('Failed to save RCR');

//       alert('RCR saved successfully!');

//       // --- NEW: RETURN LOGIC ---
//       const returnId = localStorage.getItem("return_to_detail_id");
//       // If the record we just saved matches the return ticket
//       if (returnId && selectedChange?.record_id === returnId) {
//           setTimeout(() => {
//               setSelectedModule("cm"); // Go back to Detail Page
//           }, 500);
//           return; // Stop here
//       }
//       // -------------------------

//       setFormData({
//         checkedBy: '',
//         row: {
//           date: '', partNameNo: '', typeOfChange: '', lotQty: '', okQty: '', rejQty: '', reworkQty: '',
//           parameter: '', specification: '', inspectionMethod: '', observations: Array(5).fill(''),
//           inspectedBy: '', remarks: '',
//         },
//       });
//       setSelectedChange(null);
//       setShowForm(false);
//       await fetchPendingChanges();
//       await fetchSubmittedRCRs();
//     } catch (error) {
//       alert('Unexpected error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const EmptyState = ({ message }: { message: string }) => (
//     <div className="flex flex-col items-center justify-center py-8">
//       <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-3 mb-2">
//         <FileText className="w-8 h-8 text-blue-400" />
//       </div>
//       <p className="text-sm text-gray-600">{message}</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6 p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Retroactive Check Record</h1>
//             <p className="text-blue-100 text-sm mt-1">Quality control and inspection management</p>
//           </div>
//         </div>
//       </div>

//       {!showForm ? (
//         <>
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <FileText className="w-6 h-6 text-orange-600" />
//               Pending Change Records
//             </h2>
            
//             {loading && (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                 <p className="text-gray-600">Loading...</p>
//               </div>
//             )}

//             {!loading && pendingChanges.length === 0 && (
//               <EmptyState message="No pending change records requiring RCR" />
//             )}

//             {!loading && pendingChanges.length > 0 && (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {pendingChanges.map((change) => (
//                   <div
//                     key={change.id}
//                     className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
//                     onClick={() => handleSelectChange(change)}
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex items-center gap-2">
//                         <Hash className="w-5 h-5 text-orange-600" />
//                         <span className="font-bold text-lg text-gray-800">{change.record_id}</span>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-semibold text-gray-600">4M Type:</span>
//                         <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
//                           {change.four_m}
//                         </span>
//                       </div>
                      
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-semibold text-gray-600">Change Type:</span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
//                           change.category_details?.category_type === 'Planned' ? 'bg-green-100 text-green-700' :
//                           change.category_details?.category_type === 'Unplanned' ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-red-100 text-red-700'
//                         }`}>
//                           {change.category_details?.category_type || 'N/A'}
//                         </span>
//                       </div>
//                     </div>

//                     <button className="mt-4 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
//                       Create RCR
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//               Submitted RCRs
//             </h2>
//           </div>

//           {submittedRCRs.length === 0 && <EmptyState message="No RCR entries yet" />}

//           {submittedRCRs.length > 0 && (
//             <div className="grid gap-4">
//               {submittedRCRs.map((entry) => (
//                 <div key={entry.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-green-500 hover:shadow-xl transition-all duration-200">
//                   <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3">
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold flex items-center gap-2">
//                         <Hash className="w-4 h-4" />
//                         {entry.record_id || `RCR-${entry.id}`}
//                       </h3>
//                       <div className="flex items-center gap-3 text-sm opacity-90">
//                         <span className="px-2 py-1 bg-white/20 rounded-lg">
//                           {entry.four_m_type || 'N/A'}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Calendar className="w-3 h-3" />
//                           {entry.date || '––'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="p-4">
//                     <div className="grid md:grid-cols-3 gap-3 mb-4">
//                       <div className="bg-blue-50 rounded-lg p-3">
//                         <div className="flex items-center mb-1 gap-2">
//                           <Package className="w-4 h-4 text-blue-600" />
//                           <span className="font-semibold text-gray-700 text-sm">Part Information</span>
//                         </div>
//                         <p className="text-base font-bold text-blue-800">{entry.part_name_number || 'Not specified'}</p>
//                         <p className="text-xs text-gray-600">{entry.type_of_change || 'No change type'}</p>
//                       </div>
                      
//                       <div className="bg-green-50 rounded-lg p-3">
//                         <div className="flex items-center mb-1 gap-2">
//                           <Eye className="w-4 h-4 text-green-600" />
//                           <span className="font-semibold text-gray-700 text-sm">Quality Metrics</span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-1 text-xs">
//                           <div>OK: <span className="font-bold text-green-600">{entry.ok_qty}</span></div>
//                           <div>Reject: <span className="font-bold text-red-600">{entry.reject_qty}</span></div>
//                           <div>Lot: <span className="font-bold text-blue-600">{entry.lot_qty}</span></div>
//                           <div>Rework: <span className="font-bold text-amber-600">{entry.rework_qty}</span></div>
//                         </div>
//                       </div>
                      
//                       <div className="bg-purple-50 rounded-lg p-3">
//                         <div className="flex items-center mb-1 gap-2">
//                           <Settings className="w-4 h-4 text-purple-600" />
//                           <span className="font-semibold text-gray-700 text-sm">Technical Details</span>
//                         </div>
//                         <p className="text-xs"><strong>Parameter:</strong> {entry.parameter || 'Not specified'}</p>
//                         <p className="text-xs"><strong>Method:</strong> {entry.inspection_method || 'Not specified'}</p>
//                       </div>
//                     </div>

//                     {[entry.observation1, entry.observation2, entry.observation3, entry.observation4, entry.observation5].some(obs => obs?.trim()) && (
//                       <div className="bg-amber-50 rounded-lg p-3 mb-3">
//                         <h4 className="font-semibold text-amber-800 mb-2 text-sm">Observations</h4>
//                         <div className="grid grid-cols-5 gap-2">
//                           {[entry.observation1, entry.observation2, entry.observation3, entry.observation4, entry.observation5].map((obs, obsIdx) => (
//                             <div key={obsIdx} className="text-center">
//                               <div className="text-xs text-gray-500">Obs {obsIdx + 1}</div>
//                               <div className="font-medium text-amber-800 text-xs">{obs || '–'}</div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {entry.specification && (
//                       <div className="bg-indigo-50 rounded-lg p-3 mb-3">
//                         <h4 className="font-semibold text-indigo-800 mb-1 text-sm">Specification</h4>
//                         <p className="text-xs text-gray-700">{entry.specification}</p>
//                       </div>
//                     )}

//                     {entry.remarks && (
//                       <div className="bg-gray-50 rounded-lg p-3 mb-3">
//                         <h4 className="font-semibold text-gray-800 mb-1 text-sm">Remarks</h4>
//                         <p className="text-xs text-gray-700">{entry.remarks}</p>
//                       </div>
//                     )}

//                     <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-xs text-gray-600">
//                       <div className="flex items-center gap-1">
//                         <User className="w-3 h-3" />
//                         <span><strong>Inspected by:</strong> {entry.inspected_by || 'Not specified'}</span>
//                       </div>
//                       {entry.checked_by && (
//                         <div className="flex items-center gap-1">
//                           <User className="w-3 h-3" />
//                           <span><strong>Checked by:</strong> {entry.checked_by}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       ) : (
//         <div>
//           <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-l-4 border-blue-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="font-bold mb-2">Creating RCR for {selectedChange?.record_id}</h3>
//                 <div className="flex gap-4 text-sm">
//                   <span>4M: <strong>{selectedChange?.four_m}</strong></span>
//                   <span>Type: <strong>{selectedChange?.category_details?.category_type}</strong></span>
//                 </div>
//               </div>
//               {/* <button
//                 onClick={() => { setShowForm(false); setSelectedChange(null); }}
//                 className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//               </button> */}
//               <button
//                 onClick={() => {
//                   const returnId = localStorage.getItem("return_to_detail_id");
//                   if (returnId) {
//                       setSelectedModule("cm");
//                   } else {
//                       setShowForm(false);
//                       setSelectedChange(null);
//                   }
//                 }}
//                 className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//               </button>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg mb-6">
//             <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
//               <h2 className="font-semibold">RCR Details</h2>
//             </div>
//             <div className="p-4 space-y-4">
//               <div className="grid md:grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-xs font-medium mb-1">Date</label>
//                   <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.row.date} onChange={(e) => handleInputChange('date', e.target.value)} />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium mb-1">Part Name/No</label>
//                   <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.partNameNo} onChange={(e) => handleInputChange('partNameNo', e.target.value)} />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium mb-1">Type of Change</label>
//                   <input className="w-full px-3 py-2 border rounded-lg bg-gray-50" value={formData.row.typeOfChange} disabled />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium mb-1">Inspected By</label>
//                   <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.inspectedBy} onChange={(e) => handleInputChange('inspectedBy', e.target.value)} />
//                 </div>
//               </div>

//               <div className="bg-blue-50 rounded-xl p-3">
//                 <h3 className="font-semibold mb-3">Quantity</h3>
//                 <div className="grid grid-cols-4 gap-3">
//                   <div>
//                     <label className="block text-xs font-medium mb-1">Lot</label>
//                     <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.lotQty} onChange={(e) => handleInputChange('lotQty', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium mb-1">OK</label>
//                     <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.okQty} onChange={(e) => handleInputChange('okQty', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium mb-1">Reject</label>
//                     <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.rejQty} onChange={(e) => handleInputChange('rejQty', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium mb-1">Rework</label>
//                     <input type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.row.reworkQty} onChange={(e) => handleInputChange('reworkQty', e.target.value)} />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-purple-50 rounded-xl p-3">
//                 <h3 className="font-semibold mb-3">Technical Specs</h3>
//                 <div className="grid md:grid-cols-3 gap-3">
//                   <div>
//                     <label className="block text-xs font-medium mb-1">Parameter</label>
//                     <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.parameter} onChange={(e) => handleInputChange('parameter', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium mb-1">Specification</label>
//                     <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.specification} onChange={(e) => handleInputChange('specification', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium mb-1">Inspection Method</label>
//                     <input className="w-full px-3 py-2 border rounded-lg" value={formData.row.inspectionMethod} onChange={(e) => handleInputChange('inspectionMethod', e.target.value)} />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-amber-50 rounded-xl p-3">
//                 <h3 className="font-semibold mb-3">Observations</h3>
//                 <div className="grid grid-cols-5 gap-3">
//                   {formData.row.observations.map((obs, idx) => (
//                     <div key={idx}>
//                       <label className="block text-xs font-medium mb-1">Obs {idx + 1}</label>
//                       <input className="w-full px-3 py-2 border rounded-lg" value={obs} onChange={(e) => handleObservationChange(idx, e.target.value)} />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium mb-1">Remarks</label>
//                 <textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={formData.row.remarks} onChange={(e) => handleInputChange('remarks', e.target.value)} />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium mb-1">Checked By</label>
//                 <input className="w-full px-3 py-2 border rounded-lg" value={formData.checkedBy} onChange={(e) => setFormData({ ...formData, checkedBy: e.target.value })} />
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4 justify-center">
//             <button onClick={() => { setShowForm(false); setSelectedChange(null); }} className="bg-gray-500 text-white px-6 py-2.5 rounded-xl font-semibold" disabled={loading}>
//               Cancel
//             </button>
//             <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2" disabled={loading}>
//               <User className="w-4 h-4" />
//               {loading ? 'Saving...' : 'Submit RCR'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }