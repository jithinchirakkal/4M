import React, { useState } from 'react';
import { Check, X, Upload, Download, RotateCcw, Save, ChevronDown, ChevronUp, FileImage, AlertCircle } from 'lucide-react';

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

export default function ProductCharacteristicsSheet() {
  const [markData, setMarkData] = useState<MarkData>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    processName: '5-SEATER REAR SEAT ASSY / 6-SEATER 2ND ROW / 6-SEATER 3RD ROW',
    model: 'YG8 RC25',
    shift: 'A',
    month: 'APRIL',
    year: '2025',
    docRef: 'F/PROD/612',
    materialIdentification: '',
    disposition: '',
    engineerSign: '',
    inchargeSign: '',
    hodSign: '',
    qaSign: ''
  });

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());
  const shifts = ['A', 'B', 'G'];

  const productChecks: ProductCheck[] = [
    {
      id: 1,
      productCharacteristics: "NUT,RR CTR ELR (7/16-20 UNF) 6 SEATER",
      acceptanceCriteria: "(36 - 50) N-m (1 PLACE)",
      checkingMethod: "TORQUE METER",
      specialChar: "MARU-A",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 2,
      productCharacteristics: "BOLT REAR HUB MOUNTING (Marriage Assy) 5 SEATER",
      acceptanceCriteria: "(60 - 70) N-m (4 PLACES)",
      checkingMethod: "TORQUE METER",
      specialChar: "MARU-A",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 3,
      productCharacteristics: "BUCKLE BOLT (7/16 - 20 UNF) 6-SEATER 3RD ROW",
      acceptanceCriteria: "25 - 45 N-m (2 PLACES)",
      checkingMethod: "TORQUE METER",
      specialChar: "MARU-A",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 4,
      productCharacteristics: "BOLT,RR BACK FIX 6-SEATER 3RD ROW",
      acceptanceCriteria: "(36 - 50) N-m (4 PLACES)",
      checkingMethod: "TORQUE METER",
      specialChar: "GENERAL",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 5,
      productCharacteristics: "BOLT,REAR BACK FIX (01651-1020A) (Marriage Assy) CAPTAIN SEAT",
      acceptanceCriteria: "(36 - 50) N-m (4 PLACES)",
      checkingMethod: "TORQUE METER",
      specialChar: "GENERAL",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 6,
      productCharacteristics: "NO. OF C-RING IN RSB & RSC 6-SEATER",
      acceptanceCriteria: "RSB - 24 Nos.\nRSC - 44 Nos.\n(As per location in pad & Trim)",
      checkingMethod: "VISUAL",
      specialChar: "GENERAL",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 7,
      productCharacteristics: "NO. OF C-RING IN RSB & RSC 6-SEATER 3RD Row",
      acceptanceCriteria: "RSB - 24 Nos.\nRSC - 44 Nos.\n(As per location in pad & Trim)",
      checkingMethod: "VISUAL",
      specialChar: "GENERAL",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 8,
      productCharacteristics: "NO. OF C-RING IN RSB & RSC (2ND ROW 6- SEATER) CAPTAIN SEAT",
      acceptanceCriteria: "RSB - 10 Nos.\nRSC - 27 Nos.\n(As per location in pad & Trim)",
      checkingMethod: "VISUAL",
      specialChar: "GENERAL",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 9,
      productCharacteristics: "TRIM LINE MISMATCH",
      acceptanceCriteria: "10MM MAX. 6-SEATER 6S-2ND ROW 6S-3RD ROW",
      checkingMethod: "SCALE",
      specialChar: "GENERAL",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 10,
      productCharacteristics: "BUCKLE CONTINUITY 5-SEATER 6S-2ND ROW 6S-3RD ROW",
      acceptanceCriteria: "SHOULD BE OK",
      checkingMethod: "MANUAL",
      specialChar: "DIGITAL DISPLAY",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 11,
      productCharacteristics: "BAR CODE PASTING AS PER VARIANT",
      acceptanceCriteria: "SHOULD BE OK",
      checkingMethod: "VISUAL",
      specialChar: "GENERAL",
      reactionPlan: "INFORM TO INCHARGE"
    },
    {
      id: 12,
      productCharacteristics: "K LOGO IN REAR CUSHION TRIM 6-SEATER 6S-2ND ROW 6S-3RD ROW",
      acceptanceCriteria: "No Logo miss, No reverse logo, Check Logo print & position as per limit sample",
      checkingMethod: "HOMOLOGATION CAMERA",
      specialChar: "VISUAL",
      reactionPlan: "INFORM TO INCHARGE",
      hasImage: true
    },
    {
      id: 13,
      productCharacteristics: "BAR CODE IN REAR CUSHION & REAR BACKTRIM 5-SEATER 6S-2ND ROW 6S-3RD ROW",
      acceptanceCriteria: "No bar code miss, No reverse fitment, Check print miss & position as per limit sample",
      checkingMethod: "HOMOLOGATION CAMERA",
      specialChar: "VISUAL",
      reactionPlan: "INFORM TO INCHARGE",
      hasImage: true
    },
    {
      id: 14,
      productCharacteristics: "SEAT APPEARANCE",
      acceptanceCriteria: "Steam burnt, torn, wrinkle, plastic part loose & white mark, PU visible, Margin direction NG, Stitch line mismatch, Trim dirty, Colour variation, Loose or missing parts & Gap in ELR plastic part",
      checkingMethod: "VISUAL",
      specialChar: "VISUAL",
      reactionPlan: "INFORM TO INCHARGE"
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
  const visibleChecks = isExpanded ? productChecks : productChecks.slice(0, 6);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setMarkData({});
    setFormData({
      ...formData,
      materialIdentification: '',
      disposition: '',
      engineerSign: '',
      inchargeSign: '',
      hodSign: '',
      qaSign: ''
    });
  };

  const handleSave = () => {
    alert('Product characteristics check sheet saved successfully!');
  };

  const handleExport = () => {
    alert('Check sheet exported successfully!');
  };

  const getStatusCounts = () => {
    const okCount = Object.values(markData).filter(mark => mark === 'check').length;
    const ngCount = Object.values(markData).filter(mark => mark === 'cross').length;
    const totalPossible = productChecks.length * 31;
    const completion = Math.round(((okCount + ngCount) / totalPossible) * 100);
    return { okCount, ngCount, completion };
  };

  const { okCount, ngCount, completion } = getStatusCounts();

  return (
    <div className="max-w-full min-h-screen">
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold">PRODUCT CHARACTERISTICS CHECK SHEET</h1>
                <p className="text-indigo-100 text-sm mt-1">Assembly Process Quality Inspection</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                  <span className="font-semibold">{formData.docRef}</span>
                </div>
                <div className="flex space-x-2 text-sm">
                  <span className="bg-green-500/80 px-2 py-1 rounded">✓ {okCount}</span>
                  <span className="bg-red-500/80 px-2 py-1 rounded">✗ {ngCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Information */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Process & Document Information
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Process Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                  value={formData.processName}
                  onChange={(e) => handleInputChange('processName', e.target.value)}
                  placeholder="Process name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Model"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shift</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                  value={formData.shift}
                  onChange={(e) => handleInputChange('shift', e.target.value)}
                >
                  {shifts.map((shift) => (
                    <option key={shift} value={shift}>
                      SHIFT-{shift}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
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
            </div>
          </div>
        </div>

        {/* Product Characteristics Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Daily Product Characteristics Inspection
                </h2>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm"
              >
                {isExpanded ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Show All ({productChecks.length - 6} more)</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1800px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                    <th className="sticky left-0 bg-gradient-to-r from-slate-200 to-gray-200 px-3 py-2 text-left border-r border-gray-300 z-10 w-12">
                      <div className="text-xs font-bold text-gray-800">S.No</div>
                    </th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-64">
                      <div className="text-xs font-bold text-gray-800">PRODUCT CHARACTERISTICS</div>
                    </th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-56">
                      <div className="text-xs font-bold text-gray-800">ACCEPTANCE CRITERIA / SPECIFICATION</div>
                    </th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-40">
                      <div className="text-xs font-bold text-gray-800">CHECKING METHOD</div>
                    </th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-32">
                      <div className="text-xs font-bold text-gray-800">SPECIAL CHAR. /SRC REQMT.</div>
                    </th>
                    <th className="px-3 py-2 text-left border-r border-gray-300 w-32">
                      <div className="text-xs font-bold text-gray-800">REACTION PLAN</div>
                    </th>
                    {days.map((day) => (
                      <th key={day} className="px-1 py-2 text-center border-r border-gray-300 w-10">
                        <div className="text-xs font-bold text-gray-800">{day}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleChecks.map((check, index) => {
                    const isMaruA = check.specialChar === "MARU-A";

                    return (
                      <tr key={check.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="sticky left-0 bg-white px-3 py-2 border-r border-gray-300 border-b z-10">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                            {check.id}
                          </span>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b">
                          <div className="font-semibold text-gray-900 text-xs leading-relaxed">
                            {check.productCharacteristics}
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b">
                          <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                            {check.acceptanceCriteria}
                          </div>
                          {check.hasImage && (
                            <div className="mt-2 p-2 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                              <FileImage className="w-12 h-12 text-gray-400" />
                              <span className="text-xs text-gray-500 ml-2">Image Placeholder</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b">
                          <div className="text-xs font-medium text-indigo-700">
                            {check.checkingMethod}
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b">
                          {isMaruA ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600">
                                <span className="text-xs font-bold text-gray-900">A</span>
                              </div>
                              <span className="text-xs font-semibold text-gray-700">MARU-A</span>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-700">{check.specialChar}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 border-r border-gray-300 border-b">
                          <div className="text-xs text-gray-700">
                            {check.reactionPlan}
                          </div>
                        </td>
                        {days.map((day) => {
                          const col = day - 1;
                          const key = `${index}-${col}`;
                          const markState = markData[key] || 'none';

                          return (
                            <td key={day} className="px-1 py-2 text-center border-r border-gray-300 border-b">
                              <button
                                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 font-bold text-xs shadow-sm hover:shadow-md transform hover:scale-110 ${
                                  markState === 'check' 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white shadow-green-200' 
                                    : markState === 'cross'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-600 text-white shadow-red-200'
                                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
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

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 p-2 text-center">
            <p className="text-xs text-blue-600">
              ← Scroll horizontally to view all inspection days →
            </p>
          </div>

          {!isExpanded && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 p-3 text-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center space-x-2 mx-auto"
              >
                <span>Click "Show All" to view remaining {productChecks.length - 6} checks</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Section - Signatures & Disposition */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Material Identification & Approvals
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Material Identification</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  value={formData.materialIdentification}
                  onChange={(e) => handleInputChange('materialIdentification', e.target.value)}
                  placeholder="Material identification"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Disposition (OK/Rework/Scrap)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  value={formData.disposition}
                  onChange={(e) => handleInputChange('disposition', e.target.value)}
                  placeholder="OK / Rework / Scrap"
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Signatures & Approvals</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Engineer (Prod.) Sign</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    value={formData.engineerSign}
                    onChange={(e) => handleInputChange('engineerSign', e.target.value)}
                    placeholder="Engineer signature"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Incharge (Prod.) Sign</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    value={formData.inchargeSign}
                    onChange={(e) => handleInputChange('inchargeSign', e.target.value)}
                    placeholder="Incharge signature"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">HOD (Prod.) Sign</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    value={formData.hodSign}
                    onChange={(e) => handleInputChange('hodSign', e.target.value)}
                    placeholder="HOD signature"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Engineer (QA) Sign</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                    value={formData.qaSign}
                    onChange={(e) => handleInputChange('qaSign', e.target.value)}
                    placeholder="QA Engineer signature"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Legend & Instructions
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-green-800 text-sm">OK</div>
                  <div className="text-xs text-green-600">Check passed</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-red-800 text-sm">NG</div>
                  <div className="text-xs text-red-600">Check failed</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-7 h-7 bg-white border-2 border-gray-300 rounded-lg flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Not Checked</div>
                  <div className="text-xs text-gray-600">Pending inspection</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600 flex-shrink-0">
                  <span className="text-xs font-bold text-gray-900">A</span>
                </div>
                <div>
                  <div className="font-semibold text-yellow-800 text-sm">MARU-A</div>
                  <div className="text-xs text-yellow-600">Special characteristic</div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> Click cells to mark inspection results. MARU-A items are critical characteristics requiring special attention. Follow reaction plan for any NG results.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
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
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}