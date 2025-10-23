import React, { useState } from 'react';
import { Check, X, Calendar, Settings, User, Save, RotateCcw, FileDown, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

type MarkState = 'none' | 'check' | 'cross';
interface MarkData {
  [key: string]: MarkState;
}

interface CheckPoint {
  id: number;
  checkPoint: string;
  specification: string;
  method: string;
}

export default function MachineCheckSheet() {
  const [markData, setMarkData] = useState<MarkData>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    refNo: 'PRD-F-335',
    revNo: '11',
    date: new Date().toISOString().split('T')[0],
    machineNo: '',
    shift: 'A',
    month: 'APRIL',
    year: '2025',
    operatorSignature: '',
    supervisorSignature: ''
  });

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

  const checkPoints: CheckPoint[] = [
    {
      id: 1,
      checkPoint: "Air Pressure\nहवा का दबाव",
      specification: "4 - 6 Kgf / cm²",
      method: "Pressure gauge में से Reading चेक करें"
    },
    {
      id: 2,
      checkPoint: "Machine lubrication\nमशीन लुब्रिकेशन",
      specification: "Lubrication pump should work\nलुब्रिकेशन पंप को काम करना चाहिए",
      method: "Panel पर लुब्रिकेशन पंप की शुरू करनी चाहिए"
    },
    {
      id: 3,
      checkPoint: "Red Bin",
      specification: "रोजाना के दौरान देखो (Daily)",
      method: "Scrap all rejected parts in red bin during set up"
    },
    {
      id: 4,
      checkPoint: "Machine overload Meter",
      specification: "Machine overload meter should work",
      method: "ओवरलोड मीटर को कैसे समझना चाहिए? 0 - 3 एम्पेयर"
    },
    {
      id: 5,
      checkPoint: "Die Locking Bolts",
      specification: "Die Locking Bolt Should Tight",
      method: "Die Lock Bolt को Allen Key से टाइट करें"
    },
    {
      id: 6,
      checkPoint: "Machine Short Feed\nमशीन शॉर्ट फीड Sensors",
      specification: "Short Feed Sensor should work",
      method: "SHORT FEED में सेटिंग रखनी चाहिए"
    },
    {
      id: 7,
      checkPoint: "Punch locking by grub screw",
      specification: "Punch lock by grub screw only\nसिर्फ ग्रब स्क्रू द्वारा पंच को टाइट करें",
      method: "Grub screw को allen key से टाइट करें"
    },
    {
      id: 8,
      checkPoint: "Finger condition",
      specification: "फिंगर कंडीशन को फिंगर टी से चेक करे",
      method: "नुकसान फिंगर Damage T Worn out नहीं होना चाहिए"
    },
    {
      id: 9,
      checkPoint: "No Play in Transfer cam shaft",
      specification: "No Play in Transfer cam shaft",
      method: "Transfer cam shaft को घुमाकर देखें"
    },
    {
      id: 10,
      checkPoint: "Link rod play to be check",
      specification: "Pin or Bearing के पिन खो नहीं होना चाहिए",
      method: "Link Rod अपने पीछे घूमने देखे"
    },
    {
      id: 11,
      checkPoint: "Trimming Plate To Be Check",
      specification: "Trimming की Item जरुरी समान होनी चाहिए",
      method: "Side gap को visually से जांच करें"
    },
    {
      id: 12,
      checkPoint: "Instrument Condition\nVernier / Micrometer / Dial",
      specification: "1. Zero Error\n2. Damage\n3. Calibration sticker",
      method: "Check Visually"
    },
    {
      id: 13,
      checkPoint: "Magnetic Separator",
      specification: "Magnetic Separator काम करना चाहिए",
      method: "Check Visually"
    },
    {
      id: 14,
      checkPoint: "3 Station Part In 4 Station Machine",
      specification: "यदि 3 Station का पार्ट, 4 Station Machine में सेट है",
      method: "Check Visually (यदि applicable नहीं है तो NA लिखें)"
    },
    {
      id: 15,
      checkPoint: "Coolant pipe",
      specification: "कूलिंग काम पाइप पर 3rd & 4th स्टेशन पर",
      method: "Check Visually"
    },
    {
      id: 16,
      checkPoint: "Operator Panel fan",
      specification: "पैनल फैन कंडीशन चेक करनी है",
      method: "Check Visually/ Sound"
    }
  ];

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setMarkData(prev => {
      const currentValue = prev[key] || 'none';
      
      if (currentValue === 'none') return { ...prev, [key]: 'check' };
      if (currentValue === 'check') return { ...prev, [key]: 'cross' };
      return { ...prev, [key]: 'none' };
    });
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const visibleCheckPoints = isExpanded ? checkPoints : checkPoints.slice(0, 4);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setMarkData({});
    setFormData({
      ...formData,
      machineNo: '',
      operatorSignature: '',
      supervisorSignature: ''
    });
  };

  const handleSave = () => {
    console.log('Saving checksheet...', { formData, markData });
    alert('Checksheet saved successfully!');
  };

  const handleExport = () => {
    console.log('Exporting checksheet...');
    alert('Checksheet exported successfully!');
  };

  const getStatusCounts = () => {
    const okCount = Object.values(markData).filter(mark => mark === 'check').length;
    const ngCount = Object.values(markData).filter(mark => mark === 'cross').length;
    const totalPossible = checkPoints.length * 31;
    const completion = Math.round(((okCount + ngCount) / totalPossible) * 100);
    return { okCount, ngCount, completion };
  };

  const { okCount, ngCount, completion } = getStatusCounts();

  return (
    <div className="max-w-full min-h-screen">
    {/* <div className="max-w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-2 md:px-4"> */}
      {/* REDUCED MAX WIDTH CONTAINER */}
      {/* <div className="max-w-full mx-auto p-4"> */}
      <div className="max-w-full">
        {/* Header - Reduced padding */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold">फोर्जिंग मशीन चेक SHEET</h1>
                <p className="text-blue-100 text-sm mt-1">4M Machine Checksheet - Interactive Daily Inspection</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                  <span className="font-semibold">Progress: {completion}%</span>
                </div>
                <div className="flex space-x-2 text-sm">
                  <span className="bg-green-500/80 px-2 py-1 rounded">✓ {okCount}</span>
                  <span className="bg-red-500/80 px-2 py-1 rounded">✗ {ngCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel - Improved responsive grid */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Machine & Schedule Information
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Machine Name & CC No.</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  value={formData.machineNo}
                  onChange={(e) => handleInputChange('machineNo', e.target.value)}
                  placeholder="Enter machine details"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shift</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  value={formData.shift}
                  onChange={(e) => handleInputChange('shift', e.target.value)}
                >
                  <option value="A">SHIFT-A</option>
                  <option value="B">SHIFT-B</option>
                  <option value="C">SHIFT-C</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Operator Signature</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  value={formData.operatorSignature}
                  onChange={(e) => handleInputChange('operatorSignature', e.target.value)}
                  placeholder="Operator name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Supervisor Signature</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  value={formData.supervisorSignature}
                  onChange={(e) => handleInputChange('supervisorSignature', e.target.value)}
                  placeholder="Supervisor name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Interactive Table with Horizontal Scroll */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Daily Machine Inspection Checksheet
                </h2>
                {/* <p className="text-purple-100 text-xs mt-1">
                  Click on day cells: Empty → ✓ (OK) → ✗ (NG) → Empty
                  {!isExpanded && ` • Showing ${visibleCheckPoints.length} of ${checkPoints.length} check points`}
                </p> */}
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm"
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Show All ({checkPoints.length - 4} more)</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SCROLLABLE TABLE CONTAINER */}
          <div className="overflow-x-auto">
            <div className="min-w-[1400px]"> {/* Minimum width to ensure proper table display */}
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                    <th className="sticky left-0 bg-gradient-to-r from-slate-200 to-gray-200 px-3 py-2 text-left border-r border-gray-300 z-10 w-64">
                      <div className="text-xs font-bold text-gray-800">CHECK POINT</div>
                    </th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-48">
                      <div className="text-xs font-bold text-gray-800">SPECIFICATION</div>
                    </th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-48">
                      <div className="text-xs font-bold text-gray-800">METHOD OF CHECKING</div>
                    </th>
                    {days.map((day) => (
                      <th key={day} className="px-1 py-2 text-center border-r border-gray-300 w-8">
                        <div className="text-xs font-bold text-gray-800">{day}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleCheckPoints.map((point, index) => (
                    <tr key={point.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="sticky left-0 bg-white px-3 py-2 border-r border-gray-300 border-b z-10">
                        <div className="flex items-start space-x-2">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                            {point.id}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 text-xs leading-tight">
                              {point.checkPoint.split('\n').map((line, i) => (
                                <div key={i} className={i > 0 ? "text-gray-600 text-xs mt-1" : ""}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 border-r border-gray-300 border-b">
                        <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                          {point.specification}
                        </div>
                      </td>
                      <td className="px-3 py-2 border-r border-gray-300 border-b">
                        <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                          {point.method}
                        </div>
                      </td>
                      {days.map((day) => {
                        const col = day - 1;
                        const key = `${index}-${col}`;
                        const markState = markData[key] || 'none';

                        return (
                          <td key={day} className="px-1 py-2 text-center border-r border-gray-300 border-b">
                            <button
                              className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 font-bold text-xs shadow-sm hover:shadow-md transform hover:scale-110 ${
                                markState === 'check' 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white shadow-green-200' 
                                  : markState === 'cross'
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-600 text-white shadow-red-200'
                                  : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                              onClick={() => handleCellClick(index, col)}
                              title={`Day ${day} - Current: ${markState === 'none' ? 'Empty' : markState === 'check' ? 'OK' : 'NG'}`}
                            >
                              {markState === 'check' && <Check className="w-3 h-3 mx-auto" />}
                              {markState === 'cross' && <X className="w-3 h-3 mx-auto" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Horizontal Scroll Indicator */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 p-2 text-center">
            <p className="text-xs text-blue-600">
              ← Scroll horizontally to view all days of the month →
            </p>
          </div>

          {/* Expand/Collapse Message - FIXED */}
          {!isExpanded && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 p-3 text-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center space-x-2 mx-auto"
              >
                <span>Click "Show All" to view remaining {checkPoints.length - 4} check points</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Legend & Instructions - Reduced width */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Legend & Instructions
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-green-800 text-sm">OK Status</div>
                  <div className="text-xs text-green-600">Check point passed</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-red-800 text-sm">NG Status</div>
                  <div className="text-xs text-red-600">Check point failed</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-7 h-7 bg-white border-2 border-gray-300 rounded-lg flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Not Checked</div>
                  <div className="text-xs text-gray-600">Pending inspection</div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> Click on any day cell to cycle through statuses. Scroll horizontally to view all days. Complete all daily checks for comprehensive machine maintenance tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button 
            onClick={resetForm}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>
          <button 
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Progress</span>
          </button>
          <button 
            onClick={handleExport}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}


