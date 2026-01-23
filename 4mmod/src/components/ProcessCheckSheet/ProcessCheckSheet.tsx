import React, { useState, useEffect } from 'react';
import { 
  X, Save, RotateCcw, Unlock, Download, ArrowLeft, 
  Loader2, AlertCircle, Edit, ChevronDown, ChevronUp 
} from 'lucide-react';
import api from '../../services/api';

// --- TYPES ---
interface Row {
  id: number;
  sno: string;
  characteristic: string;
  method: string;
  criteria: string;
  ovenNo: string;
}

interface CheckData {
  [key: string]: 'O' | 'X';
}

interface SheetProps {
  onBack?: () => void;
  embedded?: boolean;
}

const ProcessCheckSheet = ({ onBack, embedded = false }: SheetProps) => {
  // --- LOGIC STATE ---
  const [isSaving, setIsSaving] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasContextError, setHasContextError] = useState(false);
  const [sheetEntryId, setSheetEntryId] = useState<number | null>(null);

  // --- UI STATE ---
  const [expanded, setExpanded] = useState(true);

  // --- DATA STATE ---
  const [formData, setFormData] = useState({
    processName: 'ASSEMBLY SHOP',
    line: '',
    model: '',
    month: '',
    engineerSign: '',
    inchargeSign: '',
    hodProdSign: '',
    engineerQASign: '',
    hodQASign: ''
  });

  const [rows, setRows] = useState<Row[]>([
    { id: 1, sno: '', characteristic: '', method: '', criteria: '', ovenNo: '' }
  ]);

  const [checkData, setCheckData] = useState<CheckData>({});
  const [saveMessage, setSaveMessage] = useState('');

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
      
      // Default ReadOnly from Dashboard logic
      let shouldBeReadOnly = JSON.parse(storedReadOnly || "false");

      if (parsedRecord.setup_sheet_data) {
          const saved = parsedRecord.setup_sheet_data;
          if (saved.formData) setFormData(prev => ({...prev, ...saved.formData}));
          if (saved.rows && saved.rows.length > 0) setRows(saved.rows);
          if (saved.checkData) setCheckData(saved.checkData);
      } else {
          // Defaults for new sheet
          const dateObj = parsedRecord.date ? new Date(parsedRecord.date) : new Date();
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          
          setFormData(prev => ({
              ...prev,
              line: parsedRecord.line_name || '',
              model: parsedRecord.model || '',
              processName: parsedRecord.shopfloor_name || 'ASSEMBLY SHOP',
              month: months[dateObj.getMonth()]
          }));
      }

      // B. Fetch Backend ID & Data
      try {
        const response = await api.get(`setup-sheet/?change=${parsedRecord.id}`);
        
        // ✅ CRITICAL FIX: Match BOTH Sheet Type AND Change ID
        const existingSheet = response.data.find((s: any) => 
            s.sheet_type === 'PROCESS' && s.change === parsedRecord.id
        );
        
        if (existingSheet) {
            setSheetEntryId(existingSheet.id);
            // Sync from DB
            if (existingSheet.data) {
                if (existingSheet.data.formData) setFormData(prev => ({...prev, ...existingSheet.data.formData}));
                if (existingSheet.data.rows) setRows(existingSheet.data.rows);
                if (existingSheet.data.checkData) setCheckData(existingSheet.data.checkData);
            }
        } else {
            // ✅ If no data exists, FORCE UNLOCK (Even for Admin)
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

  const addRow = () => {
    if (isDisabled) return;
    setRows([...rows, { 
      id: rows.length + 1, 
      sno: '', 
      characteristic: '', 
      method: '', 
      criteria: '', 
      ovenNo: '' 
    }]);
  };

  const updateRow = (id: number, field: keyof Row, value: string) => {
    if (isDisabled) return;
    setRows(rows.map(row => 
      row.id === id ? {...row, [field]: value} : row
    ));
  };

  const saveProgress = async () => {
    if (!record?.id) return;
    setIsSaving(true);
    setSaveMessage('');

    const payload = {
        change: record.id,
        sheet_type: 'PROCESS', // Identifies this sheet type
        data: { formData, rows, checkData },
        overall_result: "OK"
    };

    try {
        if (sheetEntryId) {
            // Update existing (PATCH)
            await api.patch(`setup-sheet/${sheetEntryId}/`, payload);
        } else {
            // Create new (POST)
            const response = await api.post('setup-sheet/', payload);
            setSheetEntryId(response.data.id);
        }

        setSaveMessage('✓ Progress saved successfully!');
        
        // Update LocalStorage
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

  const CellWithClick = ({ rowId, day }: { rowId: number; day: number }) => {
    const key = `${rowId}-${day}`;
    const value = checkData[key];
    
    const handleClick = () => {
      if (isDisabled) return;

      setCheckData(prev => {
        const currentValue = prev[key];
        const newData = {...prev};
        
        if (!currentValue) {
          newData[key] = 'O';
        } else if (currentValue === 'O') {
          newData[key] = 'X';
        } else {
          delete newData[key];
        }
        
        return newData;
      });
    };

    return (
      <td 
        className={`border border-gray-300 text-center transition h-16 w-12 p-1 
            ${isDisabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-purple-50'}`}
        onClick={handleClick}
      >
        {value === 'O' && <span className="text-green-600 font-bold text-2xl">O</span>}
        {value === 'X' && <X className="w-6 h-6 text-red-600 mx-auto" strokeWidth={3} />}
      </td>
    );
  };

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

  // Helper class for table inputs to make them visible
  const inputClass = `w-full h-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${isDisabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900 shadow-sm'}`;

  return (
    <div className={`min-h-screen bg-gray-50 ${embedded ? 'p-0' : 'p-8'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className={embedded ? 'w-full' : 'max-w-full mx-auto'}>
        
        {/* Header */}
        <div className="bg-white shadow-sm mb-6 rounded-lg relative">
            {!embedded && (
                <button 
                    onClick={onBack} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
            )}
            <h1 className="text-center text-xl font-semibold py-5 text-gray-800">
                PROCESS CHARACTERISTICS / JOB SET - UP CHECK SHEET
            </h1>
        </div>
        
        {/* Machine & Schedule Information Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <h2 className="bg-teal-500 text-white font-semibold text-base px-6 py-3 rounded-t-lg flex items-center">
            <span className="bg-white text-teal-500 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">●</span>
            Machine & Schedule Information
          </h2>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Process Name</label>
                <input
                  type="text"
                  disabled={isDisabled}
                  value={formData.processName}
                  onChange={(e) => setFormData({...formData, processName: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm disabled:bg-gray-50"
                  placeholder="Enter process name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Line</label>
                <input
                  type="text"
                  disabled={isDisabled}
                  value={formData.line}
                  onChange={(e) => setFormData({...formData, line: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm disabled:bg-gray-50"
                  placeholder="Enter line"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Model</label>
                <input
                  type="text"
                  disabled={isDisabled}
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm disabled:bg-gray-50"
                  placeholder="Enter model"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Month</label>
                <select
                  disabled={isDisabled}
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm bg-white disabled:bg-gray-50"
                >
                  <option value="">Select month</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Process Characteristics Checksheet Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-base px-6 py-3 rounded-t-lg flex items-center">
            <span className="bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">●</span>
            Process Characteristics Checksheet
          </h2>
          
          <div className="p-6">
            {/* Main Table */}
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-3 text-xs font-bold text-gray-700 w-16 bg-gray-100">S.NO</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-bold text-gray-700 w-48 bg-gray-100">PROCESS CHARACTERISTIC</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-bold text-gray-700 w-48 bg-gray-100">CHECKING METHOD</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-bold text-gray-700 w-40 bg-gray-100">ACCEPTANCE CRITERIA</th>
                      <th className="border border-gray-300 px-3 py-3 text-xs font-bold text-gray-700 w-32 bg-gray-100">DATE / OVEN NO</th>
                      {[...Array(31)].map((_, i) => (
                        <th key={i} className="border border-gray-300 px-2 py-3 text-xs font-bold text-gray-700 w-12 bg-gray-100">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            disabled={isDisabled}
                            value={row.sno}
                            onChange={(e) => updateRow(row.id, 'sno', e.target.value)}
                            className={inputClass + " text-center"}
                            placeholder="#"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            disabled={isDisabled}
                            value={row.characteristic}
                            onChange={(e) => updateRow(row.id, 'characteristic', e.target.value)}
                            className={inputClass}
                            placeholder="Characteristic..."
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            disabled={isDisabled}
                            value={row.method}
                            onChange={(e) => updateRow(row.id, 'method', e.target.value)}
                            className={inputClass}
                            placeholder="Method..."
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            disabled={isDisabled}
                            value={row.criteria}
                            onChange={(e) => updateRow(row.id, 'criteria', e.target.value)}
                            className={inputClass}
                            placeholder="Criteria..."
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            disabled={isDisabled}
                            value={row.ovenNo}
                            onChange={(e) => updateRow(row.id, 'ovenNo', e.target.value)}
                            className={`${inputClass} text-xs`}
                            placeholder="OVEN NO"
                          />
                        </td>
                        {[...Array(31)].map((_, day) => (
                          <CellWithClick key={day} rowId={row.id} day={day + 1} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-center py-2 text-xs text-blue-600 bg-blue-50 border-t border-gray-200 font-medium">
                ← Scroll horizontally to view all days of the month →
              </div>
            </div>

            {(!isDisabled) && (
                <button
                onClick={addRow}
                className="mt-4 px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition shadow-sm flex items-center gap-2"
                >
                <span>+ Add Inspection Row</span>
                </button>
            )}
          </div>
        </div>

        {/* Signature Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <h2 className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-base px-6 py-3 rounded-t-lg">
            Signatures
          </h2>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {['engineerSign', 'inchargeSign', 'hodProdSign', 'engineerQASign', 'hodQASign'].map((field, i) => {
                  const labels = ['ENGINEER (PROD)', 'INCHARGE (PROD)', 'HOD (PROD)', 'ENGINEER (QA)', 'HOD (QA)'];
                  return (
                    <div key={field}>
                        <label className="block text-gray-700 text-xs font-bold mb-2">{labels[i]} SIGN.</label>
                        <input
                        type="text"
                        disabled={isDisabled}
                        value={(formData as any)[field]}
                        onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                        className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm disabled:bg-gray-50"
                        placeholder="Sign..."
                        />
                    </div>
                  );
              })}
            </div>
          </div>
        </div>

        {/* Instructions and Action Buttons */}
        {!embedded && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                        <strong className="text-purple-600 block mb-1">Instructions:</strong> 
                        Click once on a date cell to mark as <span className="text-green-600 font-bold">"O"</span> (OK), 
                        click twice for <span className="text-red-600 font-bold">"X"</span> (Not OK), click three times to clear.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    {/* Reset */}
                    {(!readOnly || isEditing) && (
                        <button
                            onClick={() => {
                                setCheckData({});
                                setRows([{ id: 1, sno: '', characteristic: '', method: '', criteria: '', ovenNo: '' }]);
                            }}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm shadow-sm"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    )}

                    {/* Edit Mode */}
                    {readOnly && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition font-medium text-sm shadow-md"
                        >
                            <Unlock className="w-4 h-4" /> Edit Sheet
                        </button>
                    )}

                    {/* Save */}
                    {(!readOnly || isEditing) && (
                        <button
                            onClick={saveProgress}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition shadow-md text-sm"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Progress
                        </button>
                    )}

                    {/* Print */}
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Print
                    </button>
                </div>
            </div>
            
            {saveMessage && (
                <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded animate-in fade-in slide-in-from-bottom-2 text-sm font-medium">
                {saveMessage}
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProcessCheckSheet;

// import React, { useState } from 'react';
// import { X, Save } from 'lucide-react';

// interface Row {
//   id: number;
//   sno: string;
//   characteristic: string;
//   method: string;
//   criteria: string;
//   ovenNo: string;
// }

// interface CheckData {
//   [key: string]: 'O' | 'X';
// }

// const ProcessCheckSheet = () => {
//   const [formData, setFormData] = useState({
//     processName: 'ASSEMBLY SHOP',
//     line: '',
//     model: '',
//     month: '',
//     engineerSign: '',
//     inchargeSign: '',
//     hodProdSign: '',
//     engineerQASign: '',
//     hodQASign: ''
//   });

//   const [rows, setRows] = useState<Row[]>([
//     { id: 1, sno: '', characteristic: '', method: '', criteria: '', ovenNo: '' }
//   ]);

//   const [checkData, setCheckData] = useState<CheckData>({});
//   const [saveMessage, setSaveMessage] = useState('');

//   const addRow = () => {
//     setRows([...rows, { 
//       id: rows.length + 1, 
//       sno: '', 
//       characteristic: '', 
//       method: '', 
//       criteria: '', 
//       ovenNo: '' 
//     }]);
//   };

//   const updateRow = (id: number, field: keyof Row, value: string) => {
//     setRows(rows.map(row => 
//       row.id === id ? {...row, [field]: value} : row
//     ));
//   };

//   const saveProgress = () => {
//     const data = {
//       formData,
//       rows,
//       checkData,
//       savedAt: new Date().toISOString()
//     };
    
//     console.log('Saving data:', data);
//     setSaveMessage('✓ Progress saved successfully!');
//     setTimeout(() => setSaveMessage(''), 3000);
//   };

//   const CellWithClick = ({ rowId, day }: { rowId: number; day: number }) => {
//     const key = `${rowId}-${day}`;
//     const value = checkData[key];
    
//     const handleClick = () => {
//       setCheckData(prev => {
//         const currentValue = prev[key];
//         const newData = {...prev};
        
//         if (!currentValue) {
//           newData[key] = 'O';
//         } else if (currentValue === 'O') {
//           newData[key] = 'X';
//         } else {
//           delete newData[key];
//         }
        
//         return newData;
//       });
//     };

//     return (
//       <td 
//         className="border border-gray-300 text-center cursor-pointer hover:bg-blue-50 transition h-16 w-12"
//         onClick={handleClick}
//       >
//         {value === 'O' && <span className="text-green-600 font-bold text-2xl">O</span>}
//         {value === 'X' && <X className="w-6 h-6 text-red-600 mx-auto" strokeWidth={3} />}
//       </td>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
//       <div className="max-w-full mx-auto">
//         {/* Header */}
//         <div className="bg-white shadow-sm mb-6 rounded-lg">
//           <h1 className="text-center text-xl font-semibold py-5 text-gray-800">
//             PROCESS CHARACTERISTICS / JOB SET - UP CHECK SHEET
//           </h1>
//         </div>
        
//         {/* Machine & Schedule Information Section */}
//         <div className="bg-white shadow-sm rounded-lg mb-6">
//           <h2 className="bg-teal-500 text-white font-semibold text-base px-6 py-3 rounded-t-lg flex items-center">
//             <span className="bg-white text-teal-500 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">●</span>
//             Machine & Schedule Information
//           </h2>
//           <div className="p-6">
//             <div className="grid grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">Process Name</label>
//                 <input
//                   type="text"
//                   value={formData.processName}
//                   onChange={(e) => setFormData({...formData, processName: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm"
//                   placeholder="Enter process name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">Line</label>
//                 <input
//                   type="text"
//                   value={formData.line}
//                   onChange={(e) => setFormData({...formData, line: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm"
//                   placeholder="Enter line"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">Model</label>
//                 <input
//                   type="text"
//                   value={formData.model}
//                   onChange={(e) => setFormData({...formData, model: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm"
//                   placeholder="Enter model"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">Month</label>
//                 <select
//                   value={formData.month}
//                   onChange={(e) => setFormData({...formData, month: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-teal-500 focus:outline-none text-sm bg-white"
//                 >
//                   <option value="">Select month</option>
//                   <option value="January">January</option>
//                   <option value="February">February</option>
//                   <option value="March">March</option>
//                   <option value="April">April</option>
//                   <option value="May">May</option>
//                   <option value="June">June</option>
//                   <option value="July">July</option>
//                   <option value="August">August</option>
//                   <option value="September">September</option>
//                   <option value="October">October</option>
//                   <option value="November">November</option>
//                   <option value="December">December</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Process Characteristics Checksheet Section */}
//         <div className="bg-white shadow-sm rounded-lg mb-6">
//           <h2 className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-base px-6 py-3 rounded-t-lg flex items-center">
//             <span className="bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">●</span>
//             Process Characteristics Checksheet
//           </h2>
          
//           <div className="p-6">
//             {/* Main Table */}
//             <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-16">S.NO</th>
//                       <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-48">PROCESS CHARACTERISTIC</th>
//                       <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-48">CHECKING METHOD</th>
//                       <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-40">ACCEPTANCE CRITERIA</th>
//                       <th className="border border-gray-300 px-3 py-3 text-xs font-semibold text-gray-700 w-32">DATE / OVEN NO</th>
//                       {[...Array(31)].map((_, i) => (
//                         <th key={i} className="border border-gray-300 px-2 py-3 text-xs font-semibold text-gray-700 w-12">{i + 1}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((row, idx) => (
//                       <tr key={row.id} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
//                         <td className="border border-gray-300 p-0">
//                           <input
//                             type="text"
//                             value={row.sno}
//                             onChange={(e) => updateRow(row.id, 'sno', e.target.value)}
//                             className="w-full px-2 py-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-0">
//                           <input
//                             type="text"
//                             value={row.characteristic}
//                             onChange={(e) => updateRow(row.id, 'characteristic', e.target.value)}
//                             className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-0">
//                           <input
//                             type="text"
//                             value={row.method}
//                             onChange={(e) => updateRow(row.id, 'method', e.target.value)}
//                             className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-0">
//                           <input
//                             type="text"
//                             value={row.criteria}
//                             onChange={(e) => updateRow(row.id, 'criteria', e.target.value)}
//                             className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-sm"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-0">
//                           <input
//                             type="text"
//                             value={row.ovenNo}
//                             onChange={(e) => updateRow(row.id, 'ovenNo', e.target.value)}
//                             className="w-full px-2 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent text-xs"
//                             placeholder="OVEN NO"
//                           />
//                         </td>
//                         {[...Array(31)].map((_, day) => (
//                           <CellWithClick key={day} rowId={row.id} day={day + 1} />
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
              
//               {/* Scroll hint */}
//               <div className="text-center py-2 text-xs text-blue-600 bg-blue-50 border-t border-gray-200">
//                 ← Scroll horizontally to view all days of the month →
//               </div>
//             </div>

//             {/* Add Row Button */}
//             <button
//               onClick={addRow}
//               className="mt-4 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition"
//             >
//               + Add Row
//             </button>
//           </div>
//         </div>

//         {/* Signature Section */}
//         <div className="bg-white shadow-sm rounded-lg mb-6">
//           <h2 className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-base px-6 py-3 rounded-t-lg">
//             Signatures
//           </h2>
//           <div className="p-6">
//             <div className="grid grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">ENGINEER (PROD) SIGN.</label>
//                 <input
//                   type="text"
//                   value={formData.engineerSign}
//                   onChange={(e) => setFormData({...formData, engineerSign: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">INCHARGE (PROD) SIGN.</label>
//                 <input
//                   type="text"
//                   value={formData.inchargeSign}
//                   onChange={(e) => setFormData({...formData, inchargeSign: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">HOD (PROD) SIGN. (WEEKLY)</label>
//                 <input
//                   type="text"
//                   value={formData.hodProdSign}
//                   onChange={(e) => setFormData({...formData, hodProdSign: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">ENGINEER (QA) SIGN.</label>
//                 <input
//                   type="text"
//                   value={formData.engineerQASign}
//                   onChange={(e) => setFormData({...formData, engineerQASign: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 text-sm font-medium mb-2">HOD (QA) SIGN. (WEEKLY)</label>
//                 <input
//                   type="text"
//                   value={formData.hodQASign}
//                   onChange={(e) => setFormData({...formData, hodQASign: e.target.value})}
//                   className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Instructions and Save Button */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <p className="text-sm text-gray-700">
//                 <strong className="text-purple-600">Instructions:</strong> Click once on a date cell to mark as <span className="text-green-600 font-bold">"O"</span> (OK), 
//                 click twice for <span className="text-red-600 font-bold">"X"</span> (Not OK), click three times to clear.
//               </p>
//             </div>
//             <button
//               onClick={saveProgress}
//               className="ml-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition shadow-md"
//             >
//               <Save className="w-5 h-5" />
//               Save Progress
//             </button>
//           </div>
          
//           {saveMessage && (
//             <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
//               {saveMessage}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProcessCheckSheet;