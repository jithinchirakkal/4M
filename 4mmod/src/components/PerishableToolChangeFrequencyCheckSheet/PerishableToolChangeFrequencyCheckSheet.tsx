import React, { useState, useEffect } from 'react';
import { 
  Check, X, AlertTriangle, Download, RotateCcw, Save, 
  ChevronDown, ChevronUp, ArrowLeft, Loader2, AlertCircle, 
  Unlock, Edit 
} from 'lucide-react';
import api from '../../services/api';

// --- TYPES ---
type MarkState = 'none' | 'check' | 'cross';
interface MarkData {
  [key: string]: MarkState;
}

interface ToolOperation {
  id: number;
  operationName: string;
  socketBitUsed: string;
  changeFrequency: string;
  frequencyDays: number;
}

// --- PROPS ---
interface SheetProps {
  onBack?: () => void;
  embedded?: boolean;
}

export default function PerishableToolSheet({ onBack, embedded = false }: SheetProps) {
  // --- LOGIC STATE ---
  const [isSaving, setIsSaving] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasContextError, setHasContextError] = useState(false);
  const [sheetEntryId, setSheetEntryId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  // --- UI STATE ---
  const [isExpanded, setIsExpanded] = useState(false);
  
  // --- DATA STATE ---
  const [markData, setMarkData] = useState<MarkData>({});
  
  // ✅ FIX: Initialize with empty strings, NOT static values like "YG-8"
  const [formData, setFormData] = useState({
    lineInfo: '', 
    model: '',
    month: '',
    year: '',
    docRef: 'F/PROD/153/02', // Doc Ref is usually static per sheet type
    shopEngineer: '',
    qualityEngineer: '',
    shopInchargeW1: '',
    shopInchargeW2: '',
    shopInchargeW3: '',
    shopInchargeW4: '',
    hodApproval: ''
  });

  // --- CONSTANTS ---
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

  const toolOperations: ToolOperation[] = [
    { id: 1, operationName: "CUSHION ASSY (ADJUSTER)", socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 2, operationName: "CUSHION ASSY (ADJUSTER) DC TOOL", socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 3, operationName: "BUCKLE FITMENT", socketBitUsed: "M10 HGIS 212 (SMALL 3/8\")", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 4, operationName: "BUCKLE BOLT TORQUE (DC TOOL)", socketBitUsed: "M10 HGIS 212 (SMALL 3/8\")", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 5, operationName: "Rec. Bolt M10", socketBitUsed: "SOCKET M-10 (3/8\") (SMALL)", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 6, operationName: "Rec. Bolt M8", socketBitUsed: "SOCKET M-6 (3/8\") (SMALL)", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 7, operationName: "RISER PANEL FITMENT", socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 8, operationName: "RISER PANEL DC Tool", socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")", changeFrequency: "60 DAYS", frequencyDays: 60 },
    { id: 9, operationName: "REC. COVER ASSY (SCREW)", socketBitUsed: "BIT NO. 2 (1 No)", changeFrequency: "07 DAYS", frequencyDays: 7 },
    { id: 10, operationName: "Hinge Cover ASSY (SCREW)", socketBitUsed: "BIT NO. 2 (1No)", changeFrequency: "07 DAYS", frequencyDays: 7 }
  ];

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
      
      let shouldBeReadOnly = JSON.parse(storedReadOnly || "false");

      // ✅ FIX: Dynamic Defaults from the Record ID
      const dateObj = parsedRecord.date ? new Date(parsedRecord.date) : new Date();
      
      setFormData(prev => ({
          ...prev,
          // Pull Line Name from record, fallback to empty if missing
          lineInfo: parsedRecord.line_name || '', 
          // Pull Model from record
          model: parsedRecord.model || '', 
          // Calculate Month/Year from the record date
          month: months[dateObj.getMonth()],
          year: dateObj.getFullYear().toString(),
      }));

      // B. Fetch Backend ID & Data
      try {
        const response = await api.get(`setup-sheet/?change=${parsedRecord.id}`);
        
        // Match specific sheet type for THIS change ID
        const existingSheet = response.data.find((s: any) => 
            s.sheet_type === 'TOOLING' && s.change === parsedRecord.id
        );
        
        if (existingSheet) {
            setSheetEntryId(existingSheet.id);
            // If data exists in DB, overwrite the dynamic defaults with the saved data
            if (existingSheet.data) {
                if (existingSheet.data.formData) setFormData(prev => ({...prev, ...existingSheet.data.formData}));
                if (existingSheet.data.markData) setMarkData(existingSheet.data.markData);
            }
        } else {
            // New Sheet: Force Unlock so user can edit
            shouldBeReadOnly = false;
        }
      } catch (err) {
        console.warn("Could not fetch existing sheet ID, defaulting to Create mode.");
        shouldBeReadOnly = false;
      }

      setReadOnly(shouldBeReadOnly);
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const isDisabled = readOnly && !isEditing;

  const handleCellClick = (row: number, col: number) => {
    if (isDisabled) return;

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
    if (isDisabled) return;
    setMarkData({});
    // Keep header info (Line/Model), only clear signatures
    setFormData(prev => ({
      ...prev,
      shopEngineer: '', qualityEngineer: '',
      shopInchargeW1: '', shopInchargeW2: '', shopInchargeW3: '', shopInchargeW4: '',
      hodApproval: ''
    }));
  };

  const handleSave = async () => {
    if (!record?.id) return;
    setIsSaving(true);
    setSaveMessage('');

    const payload = {
        change: record.id,
        sheet_type: 'TOOLING', 
        data: { formData, markData },
        overall_result: "OK"
    };

    try {
        if (sheetEntryId) {
            await api.patch(`setup-sheet/${sheetEntryId}/`, payload);
        } else {
            const response = await api.post('setup-sheet/', payload);
            setSheetEntryId(response.data.id);
        }

        setSaveMessage('✓ Tool Change Record Saved Successfully!');
        
        const updatedRecord = { 
            ...record, 
            is_setup_sheet_filled: true, 
            setup_sheet_data: payload.data 
        };
        localStorage.setItem("setup_sheet_record", JSON.stringify(updatedRecord));
        
        setIsEditing(false);
        setReadOnly(true);
        setTimeout(() => setSaveMessage(''), 3000);

    } catch (error: any) {
        console.error("Save Error:", error);
        alert(error.response?.data?.detail || "Failed to save sheet.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleExport = () => { window.print(); };

  // --- HELPERS ---
  const getStatusCounts = () => {
    const changedCount = Object.values(markData).filter(mark => mark === 'check').length;
    const issueCount = Object.values(markData).filter(mark => mark === 'cross').length;
    return { changedCount, issueCount };
  };

  const { changedCount, issueCount } = getStatusCounts();

  const getDaysUntilChange = (row: number) => {
    const operation = toolOperations[row];
    if (!operation) return null;

    const rowMarks = Object.entries(markData)
      .filter(([key, value]) => key.startsWith(`${row}-`) && value === 'check')
      .map(([key]) => parseInt(key.split('-')[1]) + 1);

    if (rowMarks.length === 0) return operation.frequencyDays;

    const lastChangeDay = Math.max(...rowMarks);
    const currentDay = new Date().getDate();
    const daysSinceChange = currentDay - lastChangeDay;
    return operation.frequencyDays - daysSinceChange;
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const visibleOperations = isExpanded ? toolOperations : toolOperations.slice(0, 5);

  // --- RENDER ---
  if (hasContextError) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-red-100 max-w-lg">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                  <p className="text-gray-500 mb-6">Please select a Change Request first.</p>
                  <button onClick={onBack} className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold w-full">Back</button>
              </div>
          </div>
      );
  }

  if (!record) return <div className="p-10 text-center flex justify-center"><Loader2 className="animate-spin" /> Loading...</div>;

  return (
    <div className={`min-h-screen bg-gray-50 ${embedded ? 'p-0' : 'p-4 md:p-8'}`}>
      <div className={embedded ? 'w-full' : 'max-w-full mx-auto'}>
        
        {/* Header */}
        {!embedded && (
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-xl mb-6 relative">
            <button onClick={onBack} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="p-4 pl-16">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold">PERISHABLE TOOL CHANGE FREQUENCY CHECK SHEET</h1>
                    <p className="text-blue-100 text-sm mt-1">Assembly Shop - Tool Change Tracking System</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                    <span className="font-semibold">{formData.docRef}</span>
                    </div>
                    <div className="flex space-x-2 text-sm">
                    <span className="bg-green-500/80 px-2 py-1 rounded">✓ {changedCount}</span>
                    <span className="bg-red-500/80 px-2 py-1 rounded">✗ {issueCount}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Line & Document Information */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Line & Document Information
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Line</label>
                <input
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all text-sm disabled:bg-gray-50"
                  value={formData.lineInfo}
                  onChange={(e) => handleInputChange('lineInfo', e.target.value)}
                  placeholder="Line information"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                <input
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all text-sm disabled:bg-gray-50"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Model"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
                <select
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all text-sm disabled:bg-gray-50"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                >
                  {months.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                <select
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all text-sm disabled:bg-gray-50"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                >
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Change Tracking Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Tool Change Tracking - Date on Which Changed
                </h2>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm"
              >
                {isExpanded ? <><span>Show Less</span><ChevronUp className="w-4 h-4" /></> : <><span>Show All</span><ChevronDown className="w-4 h-4" /></>}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[1600px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                    <th className="sticky left-0 bg-slate-100 px-3 py-2 text-left border-r border-gray-300 z-10 w-12 text-xs font-bold text-gray-800">S.NO</th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-56 text-xs font-bold text-gray-800">OPERATION NAME</th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-52 text-xs font-bold text-gray-800">SOCKET / BIT USED</th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-32 text-xs font-bold text-gray-800">CHANGE FREQ.</th>
                    {days.map((day) => (
                      <th key={day} className="px-1 py-2 text-center border-r border-gray-300 w-8 text-xs font-bold text-gray-800">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleOperations.map((operation, index) => {
                    const daysRemaining = getDaysUntilChange(index);
                    const isOverdue = daysRemaining !== null && daysRemaining < 0;
                    const isDueSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7;

                    return (
                      <tr key={operation.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="sticky left-0 bg-white px-3 py-2 border-r border-gray-300 border-b z-10">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">{operation.id}</span>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b">
                          <div className="flex items-center space-x-2">
                            <div className="font-semibold text-gray-900 text-xs">{operation.operationName}</div>
                            {isOverdue && <div title="Overdue!"><AlertTriangle className="w-4 h-4 text-red-500" /></div>}
                            {isDueSoon && <div title="Due soon!"><AlertTriangle className="w-4 h-4 text-amber-500" /></div>}
                          </div>
                          {daysRemaining !== null && (
                            <div className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-semibold' : isDueSoon ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                              {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : `${daysRemaining} days until change`}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b text-xs text-gray-700">{operation.socketBitUsed}</td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b text-xs font-semibold text-indigo-700">{operation.changeFrequency}</td>
                        {days.map((day) => {
                          const col = day - 1;
                          const key = `${index}-${col}`;
                          const markState = markData[key] || 'none';

                          return (
                            <td key={day} className="px-1 py-2 text-center border-r border-gray-300 border-b">
                              <button
                                disabled={isDisabled}
                                className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 font-bold text-xs shadow-sm hover:shadow-md transform hover:scale-110 
                                    ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}
                                    ${markState === 'check' 
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white' 
                                      : markState === 'cross'
                                      ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-600 text-white'
                                      : 'bg-white border-gray-300 hover:border-blue-400'
                                    }`}
                                onClick={() => handleCellClick(index, col)}
                              >
                                {markState === 'check' && <Check className="w-3 h-3 mx-auto" />}
                                {markState === 'cross' && <X className="w-3 h-3 mx-auto" />}
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
        </div>

        {/* Signatures Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Signatures & Approvals
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Signature of Shop Engineer</label>
                <input
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all text-sm disabled:bg-gray-50"
                  value={formData.shopEngineer}
                  onChange={(e) => handleInputChange('shopEngineer', e.target.value)}
                  placeholder="Shop Engineer name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Signature of Quality Engineer</label>
                <input
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all text-sm disabled:bg-gray-50"
                  value={formData.qualityEngineer}
                  onChange={(e) => handleInputChange('qualityEngineer', e.target.value)}
                  placeholder="Quality Engineer name"
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Shop Incharge Approval (Weekly)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(w => (
                    <div key={w}>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Week {w}</label>
                        <input
                            disabled={isDisabled}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 transition-all text-sm disabled:bg-gray-50"
                            value={(formData as any)[`shopInchargeW${w}`]}
                            onChange={(e) => handleInputChange(`shopInchargeW${w}`, e.target.value)}
                            placeholder={`W${w} approval`}
                        />
                    </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">HOD Approval</label>
              <input
                disabled={isDisabled}
                className="w-full md:w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all text-sm disabled:bg-gray-50"
                value={formData.hodApproval}
                onChange={(e) => handleInputChange('hodApproval', e.target.value)}
                placeholder="HOD approval signature"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!embedded && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                        <strong className="text-blue-800 block mb-1">Instructions:</strong> 
                        Tools must be changed according to specified frequency. Red alerts indicate overdue changes.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    {(!readOnly || isEditing) && (
                        <button onClick={resetForm} disabled={isSaving} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    )}

                    {readOnly && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 shadow-sm text-sm font-semibold">
                            <Unlock className="w-4 h-4" /> Edit Sheet
                        </button>
                    )}

                    {(!readOnly || isEditing) && (
                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:shadow-lg transition text-sm">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Progress
                        </button>
                    )}

                    <button onClick={handleExport} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 shadow-sm text-sm font-semibold">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>
            {saveMessage && <div className="mt-4 bg-green-100 text-green-700 px-4 py-3 rounded text-sm font-medium">{saveMessage}</div>}
            </div>
        )}

      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import { Check, X, AlertTriangle, Download, RotateCcw, Save, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

// type MarkState = 'none' | 'check' | 'cross';
// interface MarkData {
//   [key: string]: MarkState;
// }

// interface ToolOperation {
//   id: number;
//   operationName: string;
//   socketBitUsed: string;
//   changeFrequency: string;
//   frequencyDays: number;
// }

// export default function PerishableToolSheet() {
//   const [markData, setMarkData] = useState<MarkData>({});
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [formData, setFormData] = useState({
//     lineInfo: 'YG-8 RC25 FR',
//     model: 'YG-8',
//     month: 'APRIL',
//     year: '2025',
//     docRef: 'F/PROD/153/02',
//     shopEngineer: '',
//     qualityEngineer: '',
//     shopInchargeW1: '',
//     shopInchargeW2: '',
//     shopInchargeW3: '',
//     shopInchargeW4: '',
//     hodApproval: ''
//   });

//   const months = [
//     'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
//     'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
//   ];

//   const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

//   const toolOperations: ToolOperation[] = [
//     {
//       id: 1,
//       operationName: "CUSHION ASSY (ADJUSTER)",
//       socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 2,
//       operationName: "CUSHION ASSY (ADJUSTER) DC TOOL",
//       socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 3,
//       operationName: "BUCKLE FITMENT",
//       socketBitUsed: "M10 HGIS 212 (SMALL 3/8\")",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 4,
//       operationName: "BUCKLE BOLT TORQUE (DC TOOL)",
//       socketBitUsed: "M10 HGIS 212 (SMALL 3/8\")",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 5,
//       operationName: "Rec. Bolt M10",
//       socketBitUsed: "SOCKET M-10 (3/8\") (SMALL)",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 6,
//       operationName: "Rec. Bolt M8",
//       socketBitUsed: "SOCKET M-6 (3/8\") (SMALL)",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 7,
//       operationName: "RISER PANEL FITMENT",
//       socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 8,
//       operationName: "RISER PANEL DC Tool",
//       socketBitUsed: "M8 HGIS 112 (SMALL 3/8\")",
//       changeFrequency: "60 DAYS",
//       frequencyDays: 60
//     },
//     {
//       id: 9,
//       operationName: "REC. COVER ASSY (SCREW)",
//       socketBitUsed: "BIT NO. 2 (1 No)",
//       changeFrequency: "07 DAYS",
//       frequencyDays: 7
//     },
//     {
//       id: 10,
//       operationName: "Hinge Cover ASSY (SCREW)",
//       socketBitUsed: "BIT NO. 2 (1No)",
//       changeFrequency: "07 DAYS",
//       frequencyDays: 7
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
//   const visibleOperations = isExpanded ? toolOperations : toolOperations.slice(0, 5);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const resetForm = () => {
//     setMarkData({});
//     setFormData({
//       ...formData,
//       shopEngineer: '',
//       qualityEngineer: '',
//       shopInchargeW1: '',
//       shopInchargeW2: '',
//       shopInchargeW3: '',
//       shopInchargeW4: '',
//       hodApproval: ''
//     });
//   };

//   const handleSave = () => {
//     alert('Tool change record saved successfully!');
//   };

//   const handleExport = () => {
//     alert('Tool change sheet exported successfully!');
//   };

//   const getStatusCounts = () => {
//     const changedCount = Object.values(markData).filter(mark => mark === 'check').length;
//     const issueCount = Object.values(markData).filter(mark => mark === 'cross').length;
//     const totalPossible = toolOperations.length * 31;
//     const completion = Math.round(((changedCount + issueCount) / totalPossible) * 100);
//     return { changedCount, issueCount, completion };
//   };

//   const { changedCount, issueCount, completion } = getStatusCounts();

//   const getDaysUntilChange = (row: number) => {
//     const operation = toolOperations[row];
//     if (!operation) return null;

//     const rowMarks = Object.entries(markData)
//       .filter(([key, value]) => key.startsWith(`${row}-`) && value === 'check')
//       .map(([key]) => parseInt(key.split('-')[1]) + 1); // +1 because col index starts at 0 but day starts at 1

//     if (rowMarks.length === 0) return operation.frequencyDays;

//     const lastChangeDay = Math.max(...rowMarks);
//     const currentDay = new Date().getDate();
//     const daysSinceChange = currentDay - lastChangeDay;
//     const daysRemaining = operation.frequencyDays - daysSinceChange;

//     return daysRemaining;
//   };

//   return (
//     <div className="max-w-full min-h-screen">
//       <div className="max-w-full">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-xl mb-6">
//           <div className="p-4">
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
//               <div>
//                 <h1 className="text-2xl font-bold">PERISHABLE TOOL CHANGE FREQUENCY CHECK SHEET</h1>
//                 <p className="text-blue-100 text-sm mt-1">Assembly Shop - Tool Change Tracking System</p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
//                   <span className="font-semibold">{formData.docRef}</span>
//                 </div>
//                 <div className="flex space-x-2 text-sm">
//                   <span className="bg-green-500/80 px-2 py-1 rounded">✓ {changedCount}</span>
//                   <span className="bg-red-500/80 px-2 py-1 rounded">✗ {issueCount}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Line & Document Information */}
//         <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
//           <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3">
//             <h2 className="text-lg font-semibold flex items-center">
//               <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//               Line & Document Information
//             </h2>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Line</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
//                   value={formData.lineInfo}
//                   onChange={(e) => handleInputChange('lineInfo', e.target.value)}
//                   placeholder="Line information"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
//                   value={formData.model}
//                   onChange={(e) => handleInputChange('model', e.target.value)}
//                   placeholder="Model"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
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
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
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

//         {/* Tool Change Tracking Table */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-6">
//           <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3">
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
//               <div>
//                 <h2 className="text-lg font-semibold flex items-center">
//                   <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//                   Tool Change Tracking - Date on Which Changed
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
//                     <span>Show All ({toolOperations.length - 5} more)</span>
//                     <ChevronDown className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <div className="min-w-[1600px]">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
//                     <th className="sticky left-0 bg-gradient-to-r from-slate-200 to-gray-200 px-3 py-2 text-left border-r border-gray-300 z-10 w-12">
//                       <div className="text-xs font-bold text-gray-800">S.NO</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-56">
//                       <div className="text-xs font-bold text-gray-800">OPERATION NAME</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-52">
//                       <div className="text-xs font-bold text-gray-800">SOCKET / BIT USED</div>
//                     </th>
//                     <th className="px-3 py-2 text-left border-r border-gray-300 w-32">
//                       <div className="text-xs font-bold text-gray-800">CHANGE FREQUENCY</div>
//                     </th>
//                     {days.map((day) => (
//                       <th key={day} className="px-1 py-2 text-center border-r border-gray-300 w-8">
//                         <div className="text-xs font-bold text-gray-800">{day}</div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleOperations.map((operation, index) => {
//                     const daysRemaining = getDaysUntilChange(index);
//                     const isOverdue = daysRemaining !== null && daysRemaining < 0;
//                     const isDueSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7;

//                     return (
//                       <tr key={operation.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                         <td className="sticky left-0 bg-white px-3 py-2 border-r border-gray-300 border-b z-10">
//                           <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
//                             {operation.id}
//                           </span>
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           <div className="flex items-center space-x-2">
//                             <div className="font-semibold text-gray-900 text-xs">
//                               {operation.operationName}
//                             </div>
//                             {isOverdue && (
//   <div title="Overdue for change!">
//     <AlertTriangle className="w-4 h-4 text-red-500" />
//   </div>
// )}
// {isDueSoon && (
//   <div title="Due soon!">
//     <AlertTriangle className="w-4 h-4 text-amber-500" />
//   </div>
// )}
//                           </div>
//                           {daysRemaining !== null && (
//                             <div className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-semibold' : isDueSoon ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
//                               {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : `${daysRemaining} days until change`}
//                             </div>
//                           )}
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           <div className="text-xs text-gray-700">
//                             {operation.socketBitUsed}
//                           </div>
//                         </td>
//                         <td className="px-3 py-2 border-r border-gray-300 border-b">
//                           <div className="text-xs font-semibold text-indigo-700">
//                             {operation.changeFrequency}
//                           </div>
//                         </td>
//                         {days.map((day) => {
//                           const col = day - 1;
//                           const key = `${index}-${col}`;
//                           const markState = markData[key] || 'none';

//                           return (
//                             <td key={day} className="px-1 py-2 text-center border-r border-gray-300 border-b">
//                               <button
//                                 className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 font-bold text-xs shadow-sm hover:shadow-md transform hover:scale-110 ${
//                                   markState === 'check' 
//                                     ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white shadow-green-200' 
//                                     : markState === 'cross'
//                                     ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-600 text-white shadow-red-200'
//                                     : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                                 }`}
//                                 onClick={() => handleCellClick(index, col)}
//                                 title={`Day ${day} - ${markState === 'none' ? 'Not changed' : markState === 'check' ? 'Changed' : 'Issue reported'}`}
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
//               ← Scroll horizontally to view all days of the month →
//             </p>
//           </div>

//           {!isExpanded && (
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 p-3 text-center">
//               <button
//                 onClick={() => setIsExpanded(true)}
//                 className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center space-x-2 mx-auto"
//               >
//                 <span>Click "Show All" to view remaining {toolOperations.length - 5} operations</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Signatures Section */}
//         <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3">
//             <h2 className="text-lg font-semibold flex items-center">
//               <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//               Signatures & Approvals
//             </h2>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Signature of Shop Engineer</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
//                   value={formData.shopEngineer}
//                   onChange={(e) => handleInputChange('shopEngineer', e.target.value)}
//                   placeholder="Shop Engineer name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Signature of Quality Engineer</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
//                   value={formData.qualityEngineer}
//                   onChange={(e) => handleInputChange('qualityEngineer', e.target.value)}
//                   placeholder="Quality Engineer name"
//                 />
//               </div>
//             </div>
            
//             <div className="border-t pt-4">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">Shop Incharge Approval (Weekly)</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Week 1</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     value={formData.shopInchargeW1}
//                     onChange={(e) => handleInputChange('shopInchargeW1', e.target.value)}
//                     placeholder="W1 approval"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Week 2</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     value={formData.shopInchargeW2}
//                     onChange={(e) => handleInputChange('shopInchargeW2', e.target.value)}
//                     placeholder="W2 approval"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Week 3</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     value={formData.shopInchargeW3}
//                     onChange={(e) => handleInputChange('shopInchargeW3', e.target.value)}
//                     placeholder="W3 approval"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Week 4</label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     value={formData.shopInchargeW4}
//                     onChange={(e) => handleInputChange('shopInchargeW4', e.target.value)}
//                     placeholder="W4 approval"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="border-t pt-4 mt-4">
//               <label className="block text-xs font-medium text-gray-700 mb-1">HOD Approval</label>
//               <input
//                 className="w-full md:w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
//                 value={formData.hodApproval}
//                 onChange={(e) => handleInputChange('hodApproval', e.target.value)}
//                 placeholder="HOD approval signature"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-6">
//           <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3">
//             <h3 className="text-lg font-semibold flex items-center">
//               <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
//               Legend & Instructions
//             </h3>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
//                 <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Check className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <div className="font-semibold text-green-800 text-sm">Tool Changed</div>
//                   <div className="text-xs text-green-600">Tool replaced on this date</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
//                 <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <X className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <div className="font-semibold text-red-800 text-sm">Issue Reported</div>
//                   <div className="text-xs text-red-600">Problem with tool change</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="w-7 h-7 bg-white border-2 border-gray-300 rounded-lg flex-shrink-0"></div>
//                 <div>
//                   <div className="font-semibold text-gray-800 text-sm">Not Changed</div>
//                   <div className="text-xs text-gray-600">No change recorded</div>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//               <p className="text-sm text-blue-800">
//                 <strong>Instructions:</strong> Click cells to mark tool changes. Monitor frequency alerts. Tools must be changed according to specified frequency (7 days for bits, 60 days for sockets). Red alerts indicate overdue changes.
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
//         onClick={handleSave}
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