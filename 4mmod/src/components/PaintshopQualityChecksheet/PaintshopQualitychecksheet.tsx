import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Download, Save, RotateCcw, 
  ArrowLeft, Loader2, AlertCircle, Unlock 
} from 'lucide-react';
import api from '../../services/api';

// --- TYPES ---
interface TestData {
  sampleNo: string;
  source: string;
  pointA: string;
  pointB: string;
  pointC: string;
  pointD: string;
  pointE: string;
  avg: string;
  result: string;
  remarks: string;
}

interface FormData {
  date: string;
  model: string;
  shiftA: boolean;
  shiftB: boolean;
  preparedBy: string;
  checkedBy: string;
  dftMeter: TestData;
  adhesiveTest: TestData;
  hardnessTest: TestData;
  appearance: TestData;
}

type TestSection = 'dftMeter' | 'adhesiveTest' | 'hardnessTest' | 'appearance';

// --- PROPS ---
interface SheetProps {
  onBack?: () => void;
  embedded?: boolean;
}

export default function PaintQualitySheet({ onBack, embedded = false }: SheetProps) {
  const [expanded, setExpanded] = useState(true);
  
  // --- LOGIC STATE ---
  const [isSaving, setIsSaving] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasContextError, setHasContextError] = useState(false);
  
  // ✅ NEW: Store the specific ID of this sheet entry (for Updates)
  const [sheetEntryId, setSheetEntryId] = useState<number | null>(null);

  // --- FORM STATE ---
  const initialTestData = { sampleNo: '', source: '', pointA: '', pointB: '', pointC: '', pointD: '', pointE: '', avg: '', result: '', remarks: '' };
  
  const [formData, setFormData] = useState<FormData>({
    date: '',
    model: '',
    shiftA: false,
    shiftB: false,
    preparedBy: '',
    checkedBy: '',
    dftMeter: { ...initialTestData },
    adhesiveTest: { ...initialTestData },
    hardnessTest: { ...initialTestData },
    appearance: { ...initialTestData }
  });

  // --- 1. LOAD DATA & FIND EXISTING SHEET ID ---
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

      // A. Try to load data from LocalStorage (Fastest)
      if (parsedRecord.setup_sheet_data) {
          setFormData(parsedRecord.setup_sheet_data);
      } else {
          // Defaults if new
          setFormData(prev => ({
              ...prev,
              date: parsedRecord.date || new Date().toISOString().split('T')[0],
              model: parsedRecord.model || '', // ✅ Default from Record
              shiftA: parsedRecord.shift === 'A',
              shiftB: parsedRecord.shift === 'B',
          }));
      }

      // B. CRITICAL: Fetch the Backend ID for this sheet (For PATCH to work)
      // Even if we have data in localStorage, we need the DB ID to update it.
      try {
        const response = await api.get(`setup-sheet/?change=${parsedRecord.id}`);
        // Find the specific PAINT sheet in the list
        // const existingSheet = response.data.find((s: any) => s.sheet_type === 'PAINT');
        const existingSheet = response.data.find((s: any) => 
            s.sheet_type === 'PAINT' && s.change === parsedRecord.id
        );
        
        if (existingSheet) {
            setSheetEntryId(existingSheet.id); // ✅ Found it! Now we can PATCH.
            // Optional: Refresh data from backend to be safe
            if (existingSheet.data) {
                setFormData(prev => ({ ...prev, ...existingSheet.data }));
            }
        }
      } catch (err) {
        console.warn("Could not fetch existing sheet ID, defaulting to Create mode.");
      }
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (section: TestSection | null, field: string, value: string | boolean) => {
    if (readOnly && !isEditing) return;

    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...(prev[section] as TestData), [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateAverage = (section: TestSection) => {
    if (readOnly && !isEditing) return;

    const points = ['pointA', 'pointB', 'pointC', 'pointD', 'pointE'];
    const testData = formData[section];
    const values = points
      .map(p => parseFloat(testData[p as keyof TestData] as string) || 0)
      .filter(v => v > 0);
    
    if (values.length === 0) return '';
    
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    
    setFormData(prev => ({
        ...prev,
        [section]: { ...(prev[section] as TestData), avg: avg }
    }));
    return avg;
  };

  // --- 3. SAVE LOGIC (SMART UPSERT) ---
  const handleSave = async () => {
    if (!record?.id) { alert("Error: Missing Record ID"); return; }
    setIsSaving(true);

    const payload = {
        change: record.id,
        sheet_type: 'PAINT',
        data: formData,
        overall_result: "OK"
    };

    try {
        if (sheetEntryId) {
            // ✅ CASE 1: UPDATE (PATCH)
            // We found an ID during load, so we update the existing record
            await api.patch(`setup-sheet/${sheetEntryId}/`, payload);
        } else {
            // ✅ CASE 2: CREATE (POST)
            // No ID found, so we create a new one
            const response = await api.post('setup-sheet/', payload);
            setSheetEntryId(response.data.id); // Save the new ID for next time
        }

        alert('Paint Quality Sheet saved successfully!');
        
        // Update LocalStorage
        const updatedRecord = { 
            ...record, 
            is_setup_sheet_filled: true,
            setup_sheet_data: formData // Update local data immediately
        };
        localStorage.setItem("setup_sheet_record", JSON.stringify(updatedRecord));
        
        setIsEditing(false);
        setReadOnly(true);
        if (onBack) onBack();

    } catch (error: any) {
        console.error("Save Error:", error);
        alert(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Failed to save sheet.");
    } finally {
        setIsSaving(false);
    }
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

  const isDisabled = readOnly && !isEditing;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${embedded ? 'p-0' : 'p-4 md:p-8'}`}>
      <div className={embedded ? 'w-full' : 'max-w-7xl mx-auto'}>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                  {!embedded && (
                    <button onClick={onBack} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 text-white">
                        <ArrowLeft size={24} />
                    </button>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">KRISHNA MARUTI LIMITED</h1>
                    <p className="text-teal-100 text-lg">Paint Quality Check Sheet</p>
                  </div>
              </div>
              <button onClick={() => setExpanded(!expanded)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg">
                {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {expanded && (
            <>
              {/* Form Content */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Machine & Schedule Information
                </h2>
              </div>

              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input type="date" disabled={isDisabled} value={formData.date} onChange={(e) => handleInputChange(null, 'date', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:opacity-60" />
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                    <input type="text" disabled={isDisabled} value={formData.model} onChange={(e) => handleInputChange(null, 'model', e.target.value)} placeholder="Enter model" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:opacity-60" />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Shift</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" disabled={isDisabled} checked={formData.shiftA} onChange={(e) => handleInputChange(null, 'shiftA', e.target.checked)} className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-teal-500" />
                        <span className="text-sm font-medium text-gray-700">A</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" disabled={isDisabled} checked={formData.shiftB} onChange={(e) => handleInputChange(null, 'shiftB', e.target.checked)} className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-teal-500" />
                        <span className="text-sm font-medium text-gray-700">B</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PRE. BY</label>
                    <input type="text" disabled={isDisabled} value={formData.preparedBy} onChange={(e) => handleInputChange(null, 'preparedBy', e.target.value)} placeholder="Name" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:opacity-60" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CHK. BY</label>
                    <input type="text" disabled={isDisabled} value={formData.checkedBy} onChange={(e) => handleInputChange(null, 'checkedBy', e.target.value)} placeholder="Name" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 disabled:opacity-60" />
                  </div>
                </div>
              </div>

              {/* Quality Table */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Daily Paint Quality Inspection Checksheet
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Sample No</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Source</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Quality</th>
                      <th colSpan={5} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Point</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r">AVG</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Result</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Remarks</th>
                    </tr>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <th colSpan={3} className="border-r"></th>
                      <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">A</th>
                      <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">B</th>
                      <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">C</th>
                      <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">D</th>
                      <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">E</th>
                      <th colSpan={3}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {['dftMeter', 'adhesiveTest', 'hardnessTest', 'appearance'].map((section, idx) => (
                         <TestRow
                            key={section}
                            number={`${idx + 1}`}
                            label={section === 'dftMeter' ? "DFT Meter" : section === 'adhesiveTest' ? "ADHESIVE TEST" : section === 'hardnessTest' ? "HARDNESS" : "APPEARANCE"}
                            quality={section === 'dftMeter' ? "Min 50 μm" : section === 'adhesiveTest' ? "100/100" : section === 'hardnessTest' ? "≥ H" : "NO DEFECTS"}
                            data={formData[section as TestSection]}
                            disabled={isDisabled}
                            onChange={(field, value) => handleInputChange(section as TestSection, field, value)}
                            onCalculateAvg={() => calculateAverage(section as TestSection)}
                        />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              {!embedded && (
                  <div className="flex gap-4 justify-end p-6 bg-gray-50 border-t-2 border-gray-200">
                    {(!readOnly || isEditing) && (
                        <button onClick={() => setFormData(prev => ({ ...prev, dftMeter: initialTestData }))} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                            <RotateCcw size={20} /> Reset
                        </button>
                    )}
                    {readOnly && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 shadow-md font-semibold">
                            <Unlock size={20} /> Edit Sheet
                        </button>
                    )}
                    {(!readOnly || isEditing) && (
                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-semibold">
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Data
                        </button>
                    )}
                    {/* <button onClick={() => window.print()} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold">
                        <Download size={20} /> Download PDF
                    </button> */}
                  </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT ---
interface TestRowProps {
  number: string;
  label: string;
  quality: string;
  data: TestData;
  disabled: boolean;
  onChange: (field: string, value: string) => void;
  onCalculateAvg: () => void;
}

function TestRow({ number, label, quality, data, disabled, onChange, onCalculateAvg }: TestRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
      <td className="px-4 py-4 border-r border-gray-200">
        <input
          type="text"
          disabled={disabled}
          value={data.sampleNo}
          onChange={(e) => onChange('sampleNo', e.target.value)}
          className="w-20 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center text-sm disabled:opacity-60"
          placeholder="No."
        />
      </td>
      <td className="px-2 py-4 border-r border-gray-200">
        <input
          type="text"
          disabled={disabled}
          value={data.source}
          onChange={(e) => onChange('source', e.target.value)}
          className="w-24 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center text-sm disabled:opacity-60"
          placeholder="Source"
        />
      </td>
      <td className="px-4 py-4 border-r border-gray-200">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full font-bold text-sm flex-shrink-0">
            {number}
          </span>
          <div>
            <div className="font-semibold text-gray-800 text-sm">{label}</div>
            <div className="text-xs text-gray-600 mt-1 max-w-[150px] truncate" title={quality}>{quality}</div>
          </div>
        </div>
      </td>
      {['pointA', 'pointB', 'pointC', 'pointD', 'pointE'].map((point) => (
          <td key={point} className="px-2 py-4 border-r border-gray-200">
            <input
              type="number"
              step="0.01"
              disabled={disabled}
              value={data[point as keyof TestData]}
              onChange={(e) => onChange(point, e.target.value)}
              onBlur={onCalculateAvg}
              className="w-16 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center text-sm disabled:opacity-60"
            />
          </td>
      ))}
      <td className="px-4 py-4 border-r border-gray-200">
        <input
          type="text"
          value={data.avg}
          readOnly
          className="w-20 px-2 py-1 bg-yellow-50 border-2 border-yellow-300 rounded text-center font-semibold text-sm cursor-not-allowed"
          placeholder="Auto"
        />
      </td>
      <td className="px-4 py-4 border-r border-gray-200">
        <select
          disabled={disabled}
          value={data.result}
          onChange={(e) => onChange('result', e.target.value)}
          className="w-24 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-60"
        >
          <option value="">Select</option>
          <option value="OK">OK</option>
          <option value="NG">NG</option>
        </select>
      </td>
      <td className="px-4 py-4">
        <input
          type="text"
          disabled={disabled}
          value={data.remarks}
          onChange={(e) => onChange('remarks', e.target.value)}
          className="w-32 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-60"
          placeholder="Remarks"
        />
      </td>
    </tr>
  );
}

// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Download, Save } from 'lucide-react';

// interface TestData {
//   sampleNo: string;
//   source: string;
//   pointA: string;
//   pointB: string;
//   pointC: string;
//   pointD: string;
//   pointE: string;
//   avg: string;
//   result: string;
//   remarks: string;
// }

// interface FormData {
//   date: string;
//   model: string;
//   shiftA: boolean;
//   shiftB: boolean;
//   preparedBy: string;
//   checkedBy: string;
//   dftMeter: TestData;
//   adhesiveTest: TestData;
//   hardnessTest: TestData;
//   appearance: TestData;
// }

// type TestSection = 'dftMeter' | 'adhesiveTest' | 'hardnessTest' | 'appearance';

// export default function PaintQualitySheet() {
//   const [expanded, setExpanded] = useState(true);
//   const [formData, setFormData] = useState<FormData>({
//     date: '',
//     model: '',
//     shiftA: false,
//     shiftB: false,
//     preparedBy: '',
//     checkedBy: '',
//     dftMeter: { sampleNo: '', source: '', pointA: '', pointB: '', pointC: '', pointD: '', pointE: '', avg: '', result: '', remarks: '' },
//     adhesiveTest: { sampleNo: '', source: '', pointA: '', pointB: '', pointC: '', pointD: '', pointE: '', avg: '', result: '', remarks: '' },
//     hardnessTest: { sampleNo: '', source: '', pointA: '', pointB: '', pointC: '', pointD: '', pointE: '', avg: '', result: '', remarks: '' },
//     appearance: { sampleNo: '', source: '', pointA: '', pointB: '', pointC: '', pointD: '', pointE: '', avg: '', result: '', remarks: '' }
//   });

//   const handleInputChange = (section: TestSection | null, field: string, value: string | boolean) => {
//     if (section) {
//       setFormData(prev => ({
//         ...prev,
//         [section]: { ...(prev[section] as TestData), [field]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [field]: value }));
//     }
//   };

//   const calculateAverage = (section: TestSection) => {
//     const points = ['pointA', 'pointB', 'pointC', 'pointD', 'pointE'];
//     const testData = formData[section];
//     const values = points
//       .map(p => parseFloat(testData[p as keyof TestData] as string) || 0)
//       .filter(v => v > 0);
//     if (values.length === 0) return '';
//     const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
//     handleInputChange(section, 'avg', avg);
//     return avg;
//   };

//   const getCompletionPercentage = () => {
//     let filled = 0;
//     let total = 0;
//     const sections: TestSection[] = ['dftMeter', 'adhesiveTest', 'hardnessTest', 'appearance'];
//     sections.forEach(section => {
//       Object.entries(formData[section]).forEach(([key, value]) => {
//         total++;
//         if (value) filled++;
//       });
//     });
//     if (formData.date) filled++;
//     if (formData.model) filled++;
//     if (formData.preparedBy) filled++;
//     if (formData.checkedBy) filled++;
//     total += 4;
//     return Math.round((filled / total) * 100);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Main Form Card */}
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-white mb-1">KRISHNA MARUTI LIMITED</h1>
//                 <p className="text-teal-100 text-lg">Paint Quality Check Sheet</p>
//               </div>
//               <button
//                 onClick={() => setExpanded(!expanded)}
//                 className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
//               >
//                 {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
//               </button>
//             </div>
//           </div>

//           {expanded && (
//             <>
//               {/* Machine & Schedule Information */}
//               <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
//                 <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//                   <span className="w-2 h-2 bg-white rounded-full"></span>
//                   Machine & Schedule Information
//                 </h2>
//               </div>

//               <div className="p-6 bg-gray-50">
//                 <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//                   <div className="md:col-span-1">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
//                     <input
//                       type="date"
//                       value={formData.date}
//                       onChange={(e) => handleInputChange(null, 'date', e.target.value)}
//                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     />
//                   </div>
                  
//                   <div className="md:col-span-1">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
//                     <input
//                       type="text"
//                       value={formData.model}
//                       onChange={(e) => handleInputChange(null, 'model', e.target.value)}
//                       placeholder="Enter model"
//                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     />
//                   </div>

//                   <div className="md:col-span-1">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Shift</label>
//                     <div className="flex gap-4 mt-2">
//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={formData.shiftA}
//                           onChange={(e) => handleInputChange(null, 'shiftA', e.target.checked)}
//                           className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
//                         />
//                         <span className="text-sm font-medium text-gray-700">A</span>
//                       </label>
//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={formData.shiftB}
//                           onChange={(e) => handleInputChange(null, 'shiftB', e.target.checked)}
//                           className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
//                         />
//                         <span className="text-sm font-medium text-gray-700">B</span>
//                       </label>
//                     </div>
//                   </div>

//                   <div className="md:col-span-1">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">PRE. BY</label>
//                     <input
//                       type="text"
//                       value={formData.preparedBy}
//                       onChange={(e) => handleInputChange(null, 'preparedBy', e.target.value)}
//                       placeholder="Name"
//                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">CHK. BY</label>
//                     <input
//                       type="text"
//                       value={formData.checkedBy}
//                       onChange={(e) => handleInputChange(null, 'checkedBy', e.target.value)}
//                       placeholder="Name"
//                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Quality Check Tests */}
//               <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//                   <span className="w-2 h-2 bg-white rounded-full"></span>
//                   Daily Paint Quality Inspection Checksheet
//                 </h2>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-100 border-b-2 border-gray-300">
//                       <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Sample No</th>
//                       <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Source</th>
//                       <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Quality</th>
//                       <th colSpan={5} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Point</th>
//                       <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r">AVG</th>
//                       <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r">Result</th>
//                       <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Remarks</th>
//                     </tr>
//                     <tr className="bg-gray-50 border-b border-gray-300">
//                       <th className="border-r"></th>
//                       <th className="border-r"></th>
//                       <th className="border-r"></th>
//                       <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">A</th>
//                       <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">B</th>
//                       <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">C</th>
//                       <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">D</th>
//                       <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 border-r">E</th>
//                       <th className="border-r"></th>
//                       <th className="border-r"></th>
//                       <th></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <TestRow
//                       number="1"
//                       label="DFT Meter"
//                       quality="Min 50 μm"
//                       data={formData.dftMeter}
//                       onChange={(field: string, value: string) => handleInputChange('dftMeter', field, value)}
//                       onCalculateAvg={() => calculateAverage('dftMeter')}
//                     />
//                     <TestRow
//                       number="2"
//                       label="ADHESIVE TEST - ADHESIVE TESTER"
//                       quality="100/100"
//                       data={formData.adhesiveTest}
//                       onChange={(field: string, value: string) => handleInputChange('adhesiveTest', field, value)}
//                       onCalculateAvg={() => calculateAverage('adhesiveTest')}
//                     />
//                     <TestRow
//                       number="3"
//                       label="HARDNESS - PENCIL HARDNESS TESTER"
//                       quality="≥ H"
//                       data={formData.hardnessTest}
//                       onChange={(field: string, value: string) => handleInputChange('hardnessTest', field, value)}
//                       onCalculateAvg={() => calculateAverage('hardnessTest')}
//                     />
//                     <TestRow
//                       number="4"
//                       label="APPEARANCE - VISUAL CHECK"
//                       quality="NO LESS COATING UNEVENESS E. HEAVY SCRATCH. PAINT PEEL OFF, PIN HOLE, DAMAGE."
//                       data={formData.appearance}
//                       onChange={(field: string, value: string) => handleInputChange('appearance', field, value)}
//                       onCalculateAvg={() => calculateAverage('appearance')}
//                     />
//                   </tbody>
//                 </table>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-4 justify-end p-6 bg-gray-50 border-t-2 border-gray-200">
//                 <button
//                   onClick={() => window.print()}
//                   className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
//                 >
//                   <Download size={20} />
//                   Download PDF
//                 </button>
//                 <button
//                   onClick={() => alert('Data saved successfully!')}
//                   className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-semibold"
//                 >
//                   <Save size={20} />
//                   Save Data
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// interface TestRowProps {
//   number: string;
//   label: string;
//   quality: string;
//   data: TestData;
//   onChange: (field: string, value: string) => void;
//   onCalculateAvg: () => void;
// }

// function TestRow({ number, label, quality, data, onChange, onCalculateAvg }: TestRowProps) {
//   return (
//     <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
//       <td className="px-4 py-4 border-r border-gray-200">
//         <input
//           type="text"
//           value={data.sampleNo}
//           onChange={(e) => onChange('sampleNo', e.target.value)}
//           className="w-20 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
//           placeholder="No."
//         />
//       </td>
//       <td className="px-2 py-4 border-r border-gray-200">
//         <input
//           type="text"
//           value={data.source}
//           onChange={(e) => onChange('source', e.target.value)}
//           className="w-24 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
//           placeholder="Source"
//         />
//       </td>
//       <td className="px-4 py-4 border-r border-gray-200">
//         <div className="flex items-center gap-3">
//           <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full font-bold text-sm flex-shrink-0">
//             {number}
//           </span>
//           <div>
//             <div className="font-semibold text-gray-800 text-sm">{label}</div>
//             <div className="text-xs text-gray-600 mt-1">{quality}</div>
//           </div>
//         </div>
//       </td>
//       <td className="px-2 py-4 border-r border-gray-200">
//         <input
//           type="number"
//           step="0.01"
//           value={data.pointA}
//           onChange={(e) => onChange('pointA', e.target.value)}
//           className="w-16 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
//         />
//       </td>
//       <td className="px-2 py-4 border-r border-gray-200">
//         <input
//           type="number"
//           step="0.01"
//           value={data.pointB}
//           onChange={(e) => onChange('pointB', e.target.value)}
//           className="w-16 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
//         />
//       </td>
//       <td className="px-2 py-4 border-r border-gray-200">
//         <input
//           type="number"
//           step="0.01"
//           value={data.pointC}
//           onChange={(e) => onChange('pointC', e.target.value)}
//           className="w-16 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
//         />
//       </td>
//       <td className="px-2 py-4 border-r border-gray-200">
//         <input
//           type="number"
//           step="0.01"
//           value={data.pointD}
//           onChange={(e) => onChange('pointD', e.target.value)}
//           className="w-16 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
//         />
//       </td>
//       <td className="px-2 py-4 border-r border-gray-200">
//         <input
//           type="number"
//           step="0.01"
//           value={data.pointE}
//           onChange={(e) => onChange('pointE', e.target.value)}
//           onBlur={onCalculateAvg}
//           className="w-16 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-sm"
//         />
//       </td>
//       <td className="px-4 py-4 border-r border-gray-200">
//         <input
//           type="text"
//           value={data.avg}
//           readOnly
//           className="w-20 px-2 py-1 bg-yellow-50 border-2 border-yellow-300 rounded text-center font-semibold text-sm"
//           placeholder="Auto"
//         />
//       </td>
//       <td className="px-4 py-4 border-r border-gray-200">
//         <select
//           value={data.result}
//           onChange={(e) => onChange('result', e.target.value)}
//           className="w-24 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//         >
//           <option value="">Select</option>
//           <option value="OK">OK</option>
//           <option value="NG">NG</option>
//         </select>
//       </td>
//       <td className="px-4 py-4">
//         <input
//           type="text"
//           value={data.remarks}
//           onChange={(e) => onChange('remarks', e.target.value)}
//           className="w-32 px-2 py-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//           placeholder="Remarks"
//         />
//       </td>
//     </tr>
//   );
// }