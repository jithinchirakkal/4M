import React, { useState, useEffect } from 'react';
import { 
  Check, X, Download, RotateCcw, Save, ChevronDown, ChevronUp, 
  FileImage, ArrowLeft, Loader2, AlertCircle, Edit, Unlock 
} from 'lucide-react';

// ✅ IMPORT YOUR API SERVICE
import api from '../../services/api'; 

// --- TYPES ---
type MarkState = 'none' | 'check' | 'cross';

interface MarkData {
  [key: string]: MarkState;
}

interface ProductCheck {
  id: number;
  productCharacteristics: string;
  acceptanceCriteria: string;
  checkingMethod: string;
  specialChar: string;
  reactionPlan: string;
  hasImage?: boolean;
  imageUrl?: string;
}

// --- PROPS ---
interface SheetProps {
  onBack?: () => void;
  embedded?: boolean; 
}

export default function ProductCharacteristicsSheet({ onBack, embedded = false }: SheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // --- STATE FOR RECORD & DATA ---
  const [record, setRecord] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  
  // ✅ NEW: Edit Mode, Context Error, and Sheet Entry ID
  const [isEditing, setIsEditing] = useState(false);
  const [hasContextError, setHasContextError] = useState(false);
  const [sheetEntryId, setSheetEntryId] = useState<number | null>(null);

  const [markData, setMarkData] = useState<MarkData>({});
  
  const [formData, setFormData] = useState({
      processName: '', model: '', shift: '', month: '', year: '', docRef: 'F/PROD/612',
      materialIdentification: '', disposition: '', 
      engineerSign: '', inchargeSign: '', hodSign: '', qaSign: ''
  });

  // --- 1. LOAD DATA & CHECK CONTEXT ---
  useEffect(() => {
    const loadData = async () => {
        const storedRecord = localStorage.getItem("setup_sheet_record");
        const storedReadOnly = localStorage.getItem("setup_sheet_readonly");

        if (!storedRecord) {
            setHasContextError(true);
            return;
        }

        const parsedRecord = JSON.parse(storedRecord);
        setRecord(parsedRecord);
        setReadOnly(JSON.parse(storedReadOnly || "false"));

        // 1. Set Defaults from Record Context
        const dateObj = parsedRecord.date ? new Date(parsedRecord.date) : new Date();
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        
        setFormData(prev => ({
            ...prev,
            processName: parsedRecord.shopfloor_name ? `${parsedRecord.shopfloor_name} - ${parsedRecord.line_name || ''}` : '',
            model: parsedRecord.model || 'YG8 RC25',
            shift: parsedRecord.shift || 'A',
            month: months[dateObj.getMonth()],
            year: dateObj.getFullYear().toString(),
        }));

        // 2. ✅ FETCH FROM API TO CHECK FOR EXISTING DATA & ID
        try {
            const response = await api.get(`setup-sheet/?change=${parsedRecord.id}`);
            
            // ✅ CRITICAL FIX: Match BOTH Sheet Type AND Change ID
            const existingSheet = response.data.find((s: any) => 
                s.sheet_type === 'PRODUCT' && s.change === parsedRecord.id
            );
            
            if (existingSheet) {
                console.log("Found existing sheet:", existingSheet);
                setSheetEntryId(existingSheet.id); // Save ID for PATCH
                
                // Load the saved data into the form
                if (existingSheet.data) {
                    if (existingSheet.data.formData) setFormData(prev => ({ ...prev, ...existingSheet.data.formData }));
                    if (existingSheet.data.markData) setMarkData(existingSheet.data.markData);
                }
            } else if (parsedRecord.setup_sheet_data) {
                // Fallback to LocalStorage if API didn't return (e.g., just saved but not synced)
                const saved = parsedRecord.setup_sheet_data;
                if (saved.formData) setFormData(prev => ({ ...prev, ...saved.formData }));
                if (saved.markData) setMarkData(saved.markData);
            }
        } catch (err) {
            console.warn("Could not fetch existing sheet ID, defaulting to Create mode.");
        }
    };

    loadData();
  }, []);

  // --- CONSTANTS & CHECKLIST DATA ---
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());
  const shifts = ['A', 'B', 'G'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const productChecks: ProductCheck[] = [
    { id: 1, productCharacteristics: "NUT,RR CTR ELR (7/16-20 UNF) 6 SEATER", acceptanceCriteria: "(36 - 50) N-m (1 PLACE)", checkingMethod: "TORQUE METER", specialChar: "MARU-A", reactionPlan: "INFORM TO INCHARGE" },
    { id: 2, productCharacteristics: "BOLT REAR HUB MOUNTING (Marriage Assy) 5 SEATER", acceptanceCriteria: "(60 - 70) N-m (4 PLACES)", checkingMethod: "TORQUE METER", specialChar: "MARU-A", reactionPlan: "INFORM TO INCHARGE" },
    { id: 3, productCharacteristics: "BUCKLE BOLT (7/16 - 20 UNF) 6-SEATER 3RD ROW", acceptanceCriteria: "25 - 45 N-m (2 PLACES)", checkingMethod: "TORQUE METER", specialChar: "MARU-A", reactionPlan: "INFORM TO INCHARGE" },
    { id: 4, productCharacteristics: "BOLT,RR BACK FIX 6-SEATER 3RD ROW", acceptanceCriteria: "(36 - 50) N-m (4 PLACES)", checkingMethod: "TORQUE METER", specialChar: "GENERAL", reactionPlan: "INFORM TO INCHARGE" },
    { id: 5, productCharacteristics: "BOLT,REAR BACK FIX (01651-1020A) (Marriage Assy) CAPTAIN SEAT", acceptanceCriteria: "(36 - 50) N-m (4 PLACES)", checkingMethod: "TORQUE METER", specialChar: "GENERAL", reactionPlan: "INFORM TO INCHARGE" },
    { id: 6, productCharacteristics: "NO. OF C-RING IN RSB & RSC 6-SEATER", acceptanceCriteria: "RSB - 24 Nos.\nRSC - 44 Nos.\n(As per location in pad & Trim)", checkingMethod: "VISUAL", specialChar: "GENERAL", reactionPlan: "INFORM TO INCHARGE" },
    { id: 7, productCharacteristics: "NO. OF C-RING IN RSB & RSC 6-SEATER 3RD Row", acceptanceCriteria: "RSB - 24 Nos.\nRSC - 44 Nos.\n(As per location in pad & Trim)", checkingMethod: "VISUAL", specialChar: "GENERAL", reactionPlan: "INFORM TO INCHARGE" },
    { id: 8, productCharacteristics: "NO. OF C-RING IN RSB & RSC (2ND ROW 6- SEATER) CAPTAIN SEAT", acceptanceCriteria: "RSB - 10 Nos.\nRSC - 27 Nos.\n(As per location in pad & Trim)", checkingMethod: "VISUAL", specialChar: "GENERAL", reactionPlan: "INFORM TO INCHARGE" },
    { id: 9, productCharacteristics: "TRIM LINE MISMATCH", acceptanceCriteria: "10MM MAX. 6-SEATER 6S-2ND ROW 6S-3RD ROW", checkingMethod: "SCALE", specialChar: "GENERAL", reactionPlan: "INFORM TO INCHARGE" },
    { id: 10, productCharacteristics: "BUCKLE CONTINUITY 5-SEATER 6S-2ND ROW 6S-3RD ROW", acceptanceCriteria: "SHOULD BE OK", checkingMethod: "MANUAL", specialChar: "DIGITAL DISPLAY", reactionPlan: "INFORM TO INCHARGE" },
    { id: 11, productCharacteristics: "BAR CODE PASTING AS PER VARIANT", acceptanceCriteria: "SHOULD BE OK", checkingMethod: "VISUAL", specialChar: "GENERAL", reactionPlan: "INFORM TO INCHARGE" },
    { id: 12, productCharacteristics: "K LOGO IN REAR CUSHION TRIM 6-SEATER 6S-2ND ROW 6S-3RD ROW", acceptanceCriteria: "No Logo miss, No reverse logo, Check Logo print & position as per limit sample", checkingMethod: "HOMOLOGATION CAMERA", specialChar: "VISUAL", reactionPlan: "INFORM TO INCHARGE", hasImage: true },
    { id: 13, productCharacteristics: "BAR CODE IN REAR CUSHION & REAR BACKTRIM 5-SEATER 6S-2ND ROW 6S-3RD ROW", acceptanceCriteria: "No bar code miss, No reverse fitment, Check print miss & position as per limit sample", checkingMethod: "HOMOLOGATION CAMERA", specialChar: "VISUAL", reactionPlan: "INFORM TO INCHARGE", hasImage: true },
    { id: 14, productCharacteristics: "SEAT APPEARANCE", acceptanceCriteria: "Steam burnt, torn, wrinkle, plastic part loose & white mark, PU visible, Margin direction NG, Stitch line mismatch, Trim dirty, Colour variation, Loose or missing parts & Gap in ELR plastic part", checkingMethod: "VISUAL", specialChar: "VISUAL", reactionPlan: "INFORM TO INCHARGE" }
  ];

  const visibleChecks = isExpanded ? productChecks : productChecks.slice(0, 6);

  // --- HANDLERS ---
  const handleCellClick = (row: number, col: number) => {
    // 🔒 EDIT GUARD: Block if readOnly AND not editing
    if (readOnly && !isEditing) return;
    
    const key = `${row}-${col}`;
    setMarkData(prev => {
      const currentValue = prev[key] || 'none';
      if (currentValue === 'none') return { ...prev, [key]: 'check' };
      if (currentValue === 'check') return { ...prev, [key]: 'cross' };
      return { ...prev, [key]: 'none' };
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    // 🔒 EDIT GUARD
    if (readOnly && !isEditing) return;

    setMarkData({});
    setFormData(prev => ({
      ...prev,
      materialIdentification: '', disposition: '',
      engineerSign: '', inchargeSign: '', hodSign: '', qaSign: ''
    }));
  };

  // --- 3. SAVE TO BACKEND (USING API INSTANCE) ---
  const handleSave = async () => {
    if (!record?.id) {
        alert("Error: Missing Record ID");
        return;
    }

    setIsSaving(true);

    const payload = {
        change: record.id,
        sheet_type: 'PRODUCT', 
        data: { formData, markData },
        overall_result: "OK"
    };

    try {
        if (sheetEntryId) {
            // ✅ CASE 1: UPDATE (PATCH)
            await api.patch(`setup-sheet/${sheetEntryId}/`, payload);
        } else {
            // ✅ CASE 2: CREATE (POST)
            const response = await api.post('setup-sheet/', payload);
            setSheetEntryId(response.data.id); // Save ID for next time
        }

        alert('Product characteristics check sheet saved successfully!');
        
        const updatedRecord = { ...record, is_setup_sheet_filled: true };
        localStorage.setItem("setup_sheet_record", JSON.stringify(updatedRecord));
        
        // Turn off edit mode after successful save
        setIsEditing(false);
        setReadOnly(true); 
        
        if (onBack) onBack();

    } catch (error: any) {
        console.error("Save Error:", error);
        const message = error.response?.data?.detail || "Failed to save sheet.";
        alert(message);
    } finally {
        setIsSaving(false);
    }
  };

  const handleExport = () => { window.print(); };

  const getStatusCounts = () => {
    const okCount = Object.values(markData).filter(mark => mark === 'check').length;
    const ngCount = Object.values(markData).filter(mark => mark === 'cross').length;
    return { okCount, ngCount };
  };

  const { okCount, ngCount } = getStatusCounts();

  // --- 🛑 DIRECT ACCESS GUARD RENDER 🛑 ---
  if (hasContextError) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6 animate-in fade-in duration-500">
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-red-100 max-w-lg w-full">
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-3 tracking-tight">Access Denied</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                      You are attempting to access the Setup Sheet directly. <br/>
                      Please select a <strong>Change Request</strong> from the Dashboard or List View to proceed.
                  </p>
                  <button 
                      onClick={onBack || (() => window.history.back())}
                      className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full"
                  >
                      <ArrowLeft className="w-5 h-5" /> Return to Dashboard
                  </button>
              </div>
          </div>
      );
  }

  if (!record) {
      return (
          <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <span className="ml-3 text-lg font-medium text-gray-600">Loading Sheet Data...</span>
          </div>
      );
  }

  // --- MAIN RENDER ---
  return (
    <div className={`max-w-full ${embedded ? '' : 'min-h-screen bg-gray-50 pb-10'}`}>
      <div className={embedded ? '' : 'max-w-[1920px] mx-auto p-4'}>
        
        {/* HIDE HEADER IF EMBEDDED */}
        {!embedded && (
            <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white rounded-2xl shadow-xl mb-6 animate-in slide-in-from-top duration-500">
            <div className="p-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">PRODUCT CHARACTERISTICS CHECK SHEET</h1>
                        <p className="text-indigo-100 text-sm mt-0.5 opacity-90">Assembly Process Quality Inspection</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4 bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                    <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                    <span className="font-semibold tracking-wider">{formData.docRef}</span>
                    </div>
                    <div className="flex space-x-2 text-sm font-bold">
                    <span className="bg-green-500 text-white px-2 py-1 rounded shadow-sm border border-green-400">✓ {okCount}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded shadow-sm border border-red-400">✗ {ngCount}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* PROCESS INFO */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-3 px-5">
            <h2 className="text-lg font-bold flex items-center tracking-wide">
              <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></span>
              Process & Document Information
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Process Name</label>
                <input
                  disabled={readOnly && !isEditing}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.processName}
                  onChange={(e) => handleInputChange('processName', e.target.value)}
                  placeholder="Process name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Model</label>
                <input
                  disabled={readOnly && !isEditing}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Model"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Shift</label>
                <select
                  disabled={readOnly && !isEditing}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-700 disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                  value={formData.shift}
                  onChange={(e) => handleInputChange('shift', e.target.value)}
                >
                  {shifts.map((shift) => (
                    <option key={shift} value={shift}>SHIFT-{shift}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Month</label>
                <select
                  disabled={readOnly && !isEditing}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-700 disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                >
                  {months.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Year</label>
                <select
                  disabled={readOnly && !isEditing}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-700 disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                >
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 px-5 flex flex-col lg:flex-row justify-between items-center gap-3">
            <h2 className="text-lg font-bold flex items-center tracking-wide">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Inspection Points
            </h2>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
            >
              {isExpanded ? (
                <><span>Show Less</span><ChevronUp className="w-4 h-4" /></>
              ) : (
                <><span>Show All ({productChecks.length - 6})</span><ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[1800px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="sticky left-0 bg-gray-50 px-3 py-3 text-left border-r border-gray-200 z-10 w-14 font-extrabold text-gray-600 text-xs uppercase">S.No</th>
                    <th className="px-4 py-3 text-left border-r border-gray-200 w-64 font-extrabold text-gray-600 text-xs uppercase">Characteristics</th>
                    <th className="px-4 py-3 text-left border-r border-gray-200 w-56 font-extrabold text-gray-600 text-xs uppercase">Criteria</th>
                    <th className="px-4 py-3 text-left border-r border-gray-200 w-40 font-extrabold text-gray-600 text-xs uppercase">Method</th>
                    <th className="px-4 py-3 text-left border-r border-gray-200 w-32 font-extrabold text-gray-600 text-xs uppercase">Special Char.</th>
                    <th className="px-4 py-3 text-left border-r border-gray-200 w-32 font-extrabold text-gray-600 text-xs uppercase">Reaction Plan</th>
                    {days.map((day) => (
                      <th key={day} className="px-1 py-3 text-center border-r border-gray-200 w-10 font-bold text-gray-500 text-xs">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleChecks.map((check, index) => {
                    const isMaruA = check.specialChar === "MARU-A";
                    return (
                      <tr key={check.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="sticky left-0 bg-white px-3 py-3 border-r border-gray-200 border-b z-10">
                          <span className="bg-slate-200 text-slate-700 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {check.id}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 border-b">
                          <div className="font-bold text-gray-800 text-xs leading-relaxed">{check.productCharacteristics}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 border-b">
                          <div className="text-xs text-gray-600 whitespace-pre-line leading-relaxed font-medium">{check.acceptanceCriteria}</div>
                          {check.hasImage && (
                            <div className="mt-2 p-2 bg-gray-100 rounded border border-gray-200 flex items-center justify-center gap-2 text-gray-400">
                              <FileImage className="w-4 h-4" /> <span className="text-[10px]">Reference Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 border-b">
                          <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wide border border-indigo-100">
                            {check.checkingMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 border-b">
                          {isMaruA ? (
                            <div className="flex items-center space-x-2 bg-yellow-50 px-2 py-1 rounded border border-yellow-100 w-fit">
                              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border border-yellow-600 text-[10px] font-bold">A</div>
                              <span className="text-[10px] font-bold text-yellow-800">MARU-A</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 font-medium">{check.specialChar}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 border-b">
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                            {check.reactionPlan}
                          </span>
                        </td>
                        {days.map((day) => {
                          const col = day - 1;
                          const key = `${index}-${col}`;
                          const markState = markData[key] || 'none';
                          const isDisabled = readOnly && !isEditing;

                          return (
                            <td key={day} className="px-1 py-1 text-center border-r border-gray-200 border-b">
                              <button
                                disabled={isDisabled}
                                className={`w-7 h-7 rounded-md transition-all duration-200 flex items-center justify-center
                                  ${isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:scale-110 active:scale-95 cursor-pointer'}
                                  ${markState === 'check' 
                                    ? 'bg-green-500 text-white shadow-sm shadow-green-200' 
                                    : markState === 'cross'
                                    ? 'bg-red-500 text-white shadow-sm shadow-red-200'
                                    : 'bg-white border border-gray-200 hover:border-blue-300'
                                  }`}
                                onClick={() => handleCellClick(index, col)}
                              >
                                {markState === 'check' && <Check className="w-4 h-4" strokeWidth={3} />}
                                {markState === 'cross' && <X className="w-4 h-4" strokeWidth={3} />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {!isExpanded && (
            <button
                onClick={() => setIsExpanded(true)}
                className="w-full bg-gray-50 hover:bg-gray-100 py-3 text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border-t border-gray-200"
            >
                <span>View remaining {productChecks.length - 6} items</span>
                <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* FOOTER: SIGNATURES & DISPOSITION */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 px-5">
            <h2 className="text-lg font-bold flex items-center tracking-wide">
              <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></span>
              Approvals & Disposition
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Material Identification</label>
                <input
                  disabled={readOnly && !isEditing}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm font-medium disabled:opacity-70"
                  value={formData.materialIdentification}
                  onChange={(e) => handleInputChange('materialIdentification', e.target.value)}
                  placeholder="Enter details..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Disposition (OK/Rework/Scrap)</label>
                <div className="relative">
                    <input
                    disabled={readOnly && !isEditing}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm font-medium disabled:opacity-70"
                    value={formData.disposition}
                    onChange={(e) => handleInputChange('disposition', e.target.value)}
                    placeholder="Enter status..."
                    />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Authorized Signatures</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Engineer (Prod.)', 'Incharge (Prod.)', 'HOD (Prod.)', 'Engineer (QA)'].map((role, i) => {
                    const fieldMap = ['engineerSign', 'inchargeSign', 'hodSign', 'qaSign'];
                    const fieldName = fieldMap[i];
                    return (
                        <div key={role}>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{role}</label>
                            <input
                                disabled={readOnly && !isEditing}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-bold text-gray-800 disabled:bg-gray-50"
                                value={(formData as any)[fieldName]}
                                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                                placeholder="Sign here"
                            />
                        </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
                <span className="font-bold text-gray-400 uppercase tracking-wider mr-2">Legend:</span>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 text-green-700">
                    <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-white"><Check className="w-3 h-3"/></div>
                    OK
                </div>
                <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-red-700">
                    <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center text-white"><X className="w-3 h-3"/></div>
                    NG
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 text-yellow-800">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600 flex items-center justify-center text-[9px] font-bold text-black">A</div>
                    Critical (MARU-A)
                </div>
            </div>
        </div>

        {/* ACTION BUTTONS (Hide if Embedded) */}
        {!embedded && (
            <div className="flex flex-wrap justify-center gap-4 pb-8">
            
            {/* RESET BUTTON */}
            {(!readOnly || isEditing) && (
                <button 
                    onClick={resetForm}
                    disabled={isSaving}
                    className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 hover:shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                </button>
            )}

            {/* SAVE BUTTON */}
            {(!readOnly || isEditing) && (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-70 disabled:scale-100"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? 'Saving...' : 'Submit Sheet'}</span>
                </button>
            )}
            
            {/* 🛑 EDIT BUTTON (Only if ReadOnly and NOT Currently Editing) */}
            {readOnly && !isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-600 transition-all flex items-center space-x-2"
                >
                    <Unlock className="w-4 h-4" />
                    <span>Edit Sheet</span>
                </button>
            )}

            <button 
                onClick={handleExport}
                className="bg-white text-emerald-700 border border-emerald-200 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-emerald-50 hover:shadow-md transition-all flex items-center space-x-2"
            >
                <Download className="w-4 h-4" />
                <span>Export / Print</span>
            </button>

            {readOnly && !isEditing && (
                <button 
                    onClick={onBack}
                    className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-900 transition-all flex items-center space-x-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            )}
            </div>
        )}

      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import { Check, X, Upload, Download, RotateCcw, Save, ChevronDown, ChevronUp, FileImage, AlertCircle } from 'lucide-react';

// type MarkState = 'none' | 'check' | 'cross';
// interface MarkData {
//   [key: string]: MarkState;
// }

// interface ProductCheck {
//   id: number;
//   productCharacteristics: string;
//   acceptanceCriteria: string;
//   checkingMethod: string;
//   specialChar: string;
//   reactionPlan: string;
//   hasImage?: boolean;
//   imageUrl?: string;
// }

// export default function ProductCharacteristicsSheet() {
//   const [markData, setMarkData] = useState<MarkData>({});
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [formData, setFormData] = useState({
//     processName: '5-SEATER REAR SEAT ASSY / 6-SEATER 2ND ROW / 6-SEATER 3RD ROW',
//     model: 'YG8 RC25',
//     shift: 'A',
//     month: 'APRIL',
//     year: '2025',
//     docRef: 'F/PROD/612',
//     materialIdentification: '',
//     disposition: '',
//     engineerSign: '',
//     inchargeSign: '',
//     hodSign: '',
//     qaSign: ''
//   });

//   const months = [
//     'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
//     'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
//   ];

//   const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());
//   const shifts = ['A', 'B', 'G'];

//   const productChecks: ProductCheck[] = [
//     {
//       id: 1,
//       productCharacteristics: "NUT,RR CTR ELR (7/16-20 UNF) 6 SEATER",
//       acceptanceCriteria: "(36 - 50) N-m (1 PLACE)",
//       checkingMethod: "TORQUE METER",
//       specialChar: "MARU-A",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 2,
//       productCharacteristics: "BOLT REAR HUB MOUNTING (Marriage Assy) 5 SEATER",
//       acceptanceCriteria: "(60 - 70) N-m (4 PLACES)",
//       checkingMethod: "TORQUE METER",
//       specialChar: "MARU-A",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 3,
//       productCharacteristics: "BUCKLE BOLT (7/16 - 20 UNF) 6-SEATER 3RD ROW",
//       acceptanceCriteria: "25 - 45 N-m (2 PLACES)",
//       checkingMethod: "TORQUE METER",
//       specialChar: "MARU-A",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 4,
//       productCharacteristics: "BOLT,RR BACK FIX 6-SEATER 3RD ROW",
//       acceptanceCriteria: "(36 - 50) N-m (4 PLACES)",
//       checkingMethod: "TORQUE METER",
//       specialChar: "GENERAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 5,
//       productCharacteristics: "BOLT,REAR BACK FIX (01651-1020A) (Marriage Assy) CAPTAIN SEAT",
//       acceptanceCriteria: "(36 - 50) N-m (4 PLACES)",
//       checkingMethod: "TORQUE METER",
//       specialChar: "GENERAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 6,
//       productCharacteristics: "NO. OF C-RING IN RSB & RSC 6-SEATER",
//       acceptanceCriteria: "RSB - 24 Nos.\nRSC - 44 Nos.\n(As per location in pad & Trim)",
//       checkingMethod: "VISUAL",
//       specialChar: "GENERAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 7,
//       productCharacteristics: "NO. OF C-RING IN RSB & RSC 6-SEATER 3RD Row",
//       acceptanceCriteria: "RSB - 24 Nos.\nRSC - 44 Nos.\n(As per location in pad & Trim)",
//       checkingMethod: "VISUAL",
//       specialChar: "GENERAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 8,
//       productCharacteristics: "NO. OF C-RING IN RSB & RSC (2ND ROW 6- SEATER) CAPTAIN SEAT",
//       acceptanceCriteria: "RSB - 10 Nos.\nRSC - 27 Nos.\n(As per location in pad & Trim)",
//       checkingMethod: "VISUAL",
//       specialChar: "GENERAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 9,
//       productCharacteristics: "TRIM LINE MISMATCH",
//       acceptanceCriteria: "10MM MAX. 6-SEATER 6S-2ND ROW 6S-3RD ROW",
//       checkingMethod: "SCALE",
//       specialChar: "GENERAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 10,
//       productCharacteristics: "BUCKLE CONTINUITY 5-SEATER 6S-2ND ROW 6S-3RD ROW",
//       acceptanceCriteria: "SHOULD BE OK",
//       checkingMethod: "MANUAL",
//       specialChar: "DIGITAL DISPLAY",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 11,
//       productCharacteristics: "BAR CODE PASTING AS PER VARIANT",
//       acceptanceCriteria: "SHOULD BE OK",
//       checkingMethod: "VISUAL",
//       specialChar: "GENERAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     },
//     {
//       id: 12,
//       productCharacteristics: "K LOGO IN REAR CUSHION TRIM 6-SEATER 6S-2ND ROW 6S-3RD ROW",
//       acceptanceCriteria: "No Logo miss, No reverse logo, Check Logo print & position as per limit sample",
//       checkingMethod: "HOMOLOGATION CAMERA",
//       specialChar: "VISUAL",
//       reactionPlan: "INFORM TO INCHARGE",
//       hasImage: true
//     },
//     {
//       id: 13,
//       productCharacteristics: "BAR CODE IN REAR CUSHION & REAR BACKTRIM 5-SEATER 6S-2ND ROW 6S-3RD ROW",
//       acceptanceCriteria: "No bar code miss, No reverse fitment, Check print miss & position as per limit sample",
//       checkingMethod: "HOMOLOGATION CAMERA",
//       specialChar: "VISUAL",
//       reactionPlan: "INFORM TO INCHARGE",
//       hasImage: true
//     },
//     {
//       id: 14,
//       productCharacteristics: "SEAT APPEARANCE",
//       acceptanceCriteria: "Steam burnt, torn, wrinkle, plastic part loose & white mark, PU visible, Margin direction NG, Stitch line mismatch, Trim dirty, Colour variation, Loose or missing parts & Gap in ELR plastic part",
//       checkingMethod: "VISUAL",
//       specialChar: "VISUAL",
//       reactionPlan: "INFORM TO INCHARGE"
//     }
//   ];

//   const handleCellClick = (row: number, col: number) => {
//     const key = `${row}-${col}`;
//     setMarkData(prev => {
//       const currentValue = prev[key] || 'none';
      
//       if (currentValue === 'none') return { ...prev, [key]: 'check' };
//       if (currentValue === 'check') return { ...prev, [key]: 'cross' };
//       return { ...prev, [key]: 'none' };
//     });
//   };

//   const days = Array.from({ length: 31 }, (_, i) => i + 1);
//   const visibleChecks = isExpanded ? productChecks : productChecks.slice(0, 6);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const resetForm = () => {
//     setMarkData({});
//     setFormData({
//       ...formData,
//       materialIdentification: '',
//       disposition: '',
//       engineerSign: '',
//       inchargeSign: '',
//       hodSign: '',
//       qaSign: ''
//     });
//   };

//   const handleSave = () => {
//     alert('Product characteristics check sheet saved successfully!');
//   };

//   const handleExport = () => {
//     alert('Check sheet exported successfully!');
//   };

//   const getStatusCounts = () => {
//     const okCount = Object.values(markData).filter(mark => mark === 'check').length;
//     const ngCount = Object.values(markData).filter(mark => mark === 'cross').length;
//     const totalPossible = productChecks.length * 31;
//     const completion = Math.round(((okCount + ngCount) / totalPossible) * 100);
//     return { okCount, ngCount, completion };
//   };

//   const { okCount, ngCount, completion } = getStatusCounts();

//   return (
//     <div className="max-w-full min-h-screen">
//       <div className="max-w-full">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white rounded-2xl shadow-xl mb-6">
//           <div className="p-4">
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
//               <div>
//                 <h1 className="text-2xl font-bold">PRODUCT CHARACTERISTICS CHECK SHEET</h1>
//                 <p className="text-indigo-100 text-sm mt-1">Assembly Process Quality Inspection</p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
//                   <span className="font-semibold">{formData.docRef}</span>
//                 </div>
//                 <div className="flex space-x-2 text-sm">
//                   <span className="bg-green-500/80 px-2 py-1 rounded">✓ {okCount}</span>
//                   <span className="bg-red-500/80 px-2 py-1 rounded">✗ {ngCount}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Process Information */}
//         <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
//           <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3">
//             <h2 className="text-lg font-semibold flex items-center">
//               <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//               Process & Document Information
//             </h2>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//               <div className="lg:col-span-2">
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Process Name</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
//                   value={formData.processName}
//                   onChange={(e) => handleInputChange('processName', e.target.value)}
//                   placeholder="Process name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
//                   value={formData.model}
//                   onChange={(e) => handleInputChange('model', e.target.value)}
//                   placeholder="Model"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Shift</label>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
//                   value={formData.shift}
//                   onChange={(e) => handleInputChange('shift', e.target.value)}
//                 >
//                   {shifts.map((shift) => (
//                     <option key={shift} value={shift}>
//                       SHIFT-{shift}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
//                   value={formData.month}
//                   onChange={(e) => handleInputChange('month', e.target.value)}
//                 >
//                   {months.map((month) => (
//                     <option key={month} value={month}>
//                       {month}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
//                   value={formData.year}
//                   onChange={(e) => handleInputChange('year', e.target.value)}
//                 >
//                   {years.map((year) => (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product Characteristics Table */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-6">
//           <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3">
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
//               <div>
//                 <h2 className="text-lg font-semibold flex items-center">
//                   <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//                   Daily Product Characteristics Inspection
//                 </h2>
//               </div>
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm"
//               >
//                 {isExpanded ? (
//                   <>
//                     <span>Show Less</span>
//                     <ChevronUp className="w-4 h-4" />
//                   </>
//                 ) : (
//                   <>
//                     <span>Show All ({productChecks.length - 6} more)</span>
//                     <ChevronDown className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <div className="min-w-[1800px]">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
//                     <th className="sticky left-0 bg-gradient-to-r from-slate-200 to-gray-200 px-3 py-2 text-left border-r border-gray-300 z-10 w-12">
//                       <div className="text-xs font-bold text-gray-800">S.No</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-64">
//                       <div className="text-xs font-bold text-gray-800">PRODUCT CHARACTERISTICS</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-56">
//                       <div className="text-xs font-bold text-gray-800">ACCEPTANCE CRITERIA / SPECIFICATION</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-40">
//                       <div className="text-xs font-bold text-gray-800">CHECKING METHOD</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-32">
//                       <div className="text-xs font-bold text-gray-800">SPECIAL CHAR. /SRC REQMT.</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-32">
//                       <div className="text-xs font-bold text-gray-800">REACTION PLAN</div>
//                     </th>
//                     {days.map((day) => (
//                       <th key={day} className="px-1 py-2 text-center border-r border-gray-300 w-10">
//                         <div className="text-xs font-bold text-gray-800">{day}</div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleChecks.map((check, index) => {
//                     const isMaruA = check.specialChar === "MARU-A";

//                     return (
//                       <tr key={check.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                         <td className="sticky left-0 bg-white px-3 py-2 border-r border-gray-300 border-b z-10">
//                           <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
//                             {check.id}
//                           </span>
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           <div className="font-semibold text-gray-900 text-xs leading-relaxed">
//                             {check.productCharacteristics}
//                           </div>
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
//                             {check.acceptanceCriteria}
//                           </div>
//                           {check.hasImage && (
//                             <div className="mt-2 p-2 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
//                               <FileImage className="w-12 h-12 text-gray-400" />
//                               <span className="text-xs text-gray-500 ml-2">Image Placeholder</span>
//                             </div>
//                           )}
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           <div className="text-xs font-medium text-indigo-700">
//                             {check.checkingMethod}
//                           </div>
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           {isMaruA ? (
//                             <div className="flex items-center space-x-2">
//                               <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600">
//                                 <span className="text-xs font-bold text-gray-900">A</span>
//                               </div>
//                               <span className="text-xs font-semibold text-gray-700">MARU-A</span>
//                             </div>
//                           ) : (
//                             <div className="text-xs text-gray-700">{check.specialChar}</div>
//                           )}
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           <div className="text-xs text-gray-700">
//                             {check.reactionPlan}
//                           </div>
//                         </td>
//                         {days.map((day) => {
//                           const col = day - 1;
//                           const key = `${index}-${col}`;
//                           const markState = markData[key] || 'none';

//                           return (
//                             <td key={day} className="px-1 py-2 text-center border-r border-gray-300 border-b">
//                               <button
//                                 className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 font-bold text-xs shadow-sm hover:shadow-md transform hover:scale-110 ${
//                                   markState === 'check' 
//                                     ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white shadow-green-200' 
//                                     : markState === 'cross'
//                                     ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-600 text-white shadow-red-200'
//                                     : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                                 }`}
//                                 onClick={() => handleCellClick(index, col)}
//                               >
//                                 {markState === 'check' && <Check className="w-3 h-3 mx-auto" />}
//                                 {markState === 'cross' && <X className="w-3 h-3 mx-auto" />}
//                               </button>
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 p-2 text-center">
//             <p className="text-xs text-blue-600">
//               ← Scroll horizontally to view all inspection days →
//             </p>
//           </div>

//           {!isExpanded && (
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 p-3 text-center">
//               <button
//                 onClick={() => setIsExpanded(true)}
//                 className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center space-x-2 mx-auto"
//               >
//                 <span>Click "Show All" to view remaining {productChecks.length - 6} checks</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Footer Section - Signatures & Disposition */}
//         <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
//           <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3">
//             <h2 className="text-lg font-semibold flex items-center">
//               <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//               Material Identification & Approvals
//             </h2>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Material Identification</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
//                   value={formData.materialIdentification}
//                   onChange={(e) => handleInputChange('materialIdentification', e.target.value)}
//                   placeholder="Material identification"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Disposition (OK/Rework/Scrap)</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
//                   value={formData.disposition}
//                   onChange={(e) => handleInputChange('disposition', e.target.value)}
//                   placeholder="OK / Rework / Scrap"
//                 />
//               </div>
//             </div>
            
//             <div className="border-t pt-4">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">Signatures & Approvals</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Engineer (Prod.) Sign</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
//                     value={formData.engineerSign}
//                     onChange={(e) => handleInputChange('engineerSign', e.target.value)}
//                     placeholder="Engineer signature"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Incharge (Prod.) Sign</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     value={formData.inchargeSign}
//                     onChange={(e) => handleInputChange('inchargeSign', e.target.value)}
//                     placeholder="Incharge signature"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">HOD (Prod.) Sign</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
//                     value={formData.hodSign}
//                     onChange={(e) => handleInputChange('hodSign', e.target.value)}
//                     placeholder="HOD signature"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Engineer (QA) Sign</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
//                     value={formData.qaSign}
//                     onChange={(e) => handleInputChange('qaSign', e.target.value)}
//                     placeholder="QA Engineer signature"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-6">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3">
//             <h3 className="text-lg font-semibold flex items-center">
//               <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//               Legend & Instructions
//             </h3>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//               <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
//                 <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Check className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <div className="font-semibold text-green-800 text-sm">OK</div>
//                   <div className="text-xs text-green-600">Check passed</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
//                 <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <X className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <div className="font-semibold text-red-800 text-sm">NG</div>
//                   <div className="text-xs text-red-600">Check failed</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="w-7 h-7 bg-white border-2 border-gray-300 rounded-lg flex-shrink-0"></div>
//                 <div>
//                   <div className="font-semibold text-gray-800 text-sm">Not Checked</div>
//                   <div className="text-xs text-gray-600">Pending inspection</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                 <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600 flex-shrink-0">
//                   <span className="text-xs font-bold text-gray-900">A</span>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-yellow-800 text-sm">MARU-A</div>
//                   <div className="text-xs text-yellow-600">Special characteristic</div>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//               <p className="text-sm text-blue-800">
//                 <strong>Instructions:</strong> Click cells to mark inspection results. MARU-A items are critical characteristics requiring special attention. Follow reaction plan for any NG results.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap justify-center gap-3 mb-6">
//           <button 
//             onClick={resetForm}
//             className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
//           >
//             <RotateCcw className="w-4 h-4" />
//             <span>Reset Form</span>
//           </button>
//           <button 
//             onClick={handleSave}
//             className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
//           >
//             <Save className="w-4 h-4" />
//             <span>Save Progress</span>
//           </button>
//           <button 
//             onClick={handleExport}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export Report</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }