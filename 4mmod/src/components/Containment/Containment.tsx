import React, { useState, useEffect } from 'react';

// Define the form data shape once
interface ChangeFormData {
  requestNo: string;
  date: string;
  department: string;
  process: string;
  changeType: string;
  reason: string;
  potentialRisk: string;
  impact: string;
  riskLevel: 'L' | 'M' | 'H';
  containmentAction: string;
  areaAffected: string;
  duration: string;
  responsibility: string;
  inspectionMethod: string;
  acceptanceCriteria: string;
  trialQuantity: string;
  defectsObserved: string;
  observations: string;
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
}

const Containment: React.FC = () => {
  const [formData, setFormData] = useState<ChangeFormData>({
    requestNo: '',
    date: '2026-01-22',
    department: '',
    process: '',
    changeType: '',
    reason: '',
    potentialRisk: '',
    impact: '',
    riskLevel: 'L',
    containmentAction: '',
    areaAffected: '',
    duration: '',
    responsibility: '',
    inspectionMethod: '',
    acceptanceCriteria: '',
    trialQuantity: '',
    defectsObserved: '',
    observations: '',
    preparedBy: '',
    reviewedBy: '',
    approvedBy: '',
  });

  // Mock data with proper typing
  const mockData: Record<string, ChangeFormData> = {
    'REQ-001': {
      requestNo: 'REQ-001',
      date: '2026-01-22',
      department: 'Engineering',
      process: 'Assembly Line',
      changeType: 'Machine',
      reason: 'Upgrade to new machinery for efficiency',
      potentialRisk: 'Downtime during installation',
      impact: 'Production delay',
      riskLevel: 'M',
      containmentAction: 'Temporary manual assembly',
      areaAffected: 'Production Floor',
      duration: '2 days',
      responsibility: 'Team Lead',
      inspectionMethod: 'Visual check',
      acceptanceCriteria: 'No defects in output',
      trialQuantity: '100 units',
      defectsObserved: 'No',
      observations: 'Trial ran smoothly with minor adjustments',
      preparedBy: 'John Doe',
      reviewedBy: 'Jane Smith',
      approvedBy: 'Manager X',
    },
    'REQ-002': {
      requestNo: 'REQ-002',
      date: '2026-01-25',
      department: 'Quality Control',
      process: 'Inspection',
      changeType: 'Method',
      reason: 'Implement AI-based defect detection',
      potentialRisk: 'False positives in detection',
      impact: 'Increased rework',
      riskLevel: 'H',
      containmentAction: 'Fallback to manual inspection',
      areaAffected: 'QC Station',
      duration: '1 week',
      responsibility: 'QC Supervisor',
      inspectionMethod: 'AI scan + human verify',
      acceptanceCriteria: 'Accuracy > 95%',
      trialQuantity: '500 units',
      defectsObserved: 'Yes (minor)',
      observations: 'AI improved speed but needs calibration',
      preparedBy: 'Alice Johnson',
      reviewedBy: 'Bob Lee',
      approvedBy: 'Director Y',
    },
  };

  // Default values for reset
  const defaultFormValues: Omit<ChangeFormData, 'requestNo'> = {
    date: '2026-01-22',
    department: '',
    process: '',
    changeType: '',
    reason: '',
    potentialRisk: '',
    impact: '',
    riskLevel: 'L',
    containmentAction: '',
    areaAffected: '',
    duration: '',
    responsibility: '',
    inspectionMethod: '',
    acceptanceCriteria: '',
    trialQuantity: '',
    defectsObserved: '',
    observations: '',
    preparedBy: '',
    reviewedBy: '',
    approvedBy: '',
  };

  const loadDemoData = (reqNo: string) => {
    const data = mockData[reqNo];
    if (data) {
      setFormData(data);
    } else {
      setFormData((prev) => ({
        ...prev,
        ...defaultFormValues,
      }));
    }
  };

  useEffect(() => {
    loadDemoData('REQ-001');
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reqNo = e.target.value;
    setFormData((prev) => ({ ...prev, requestNo: reqNo }));
    loadDemoData(reqNo);
  };

  const handleSave = () => {
    console.log('Saved data:', formData);
    alert('Form data saved! (Check console for details)');
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'L':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'M':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'H':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">4M Change Management</h1>
              <p className="text-sm text-gray-500">Man • Machine • Material • Method</p>
            </div>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {formData.requestNo && (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  📋 {formData.requestNo}
                </span>
              )}
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getRiskBadge(formData.riskLevel)}`}>
                Risk: {formData.riskLevel === 'L' ? 'Low' : formData.riskLevel === 'M' ? 'Medium' : 'High'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          
          {/* Change Details Section */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Change Details
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Request No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="requestNo"
                    value={formData.requestNo}
                    onChange={handleRequestNoChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g. REQ-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter department"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product / Process</label>
                  <input
                    type="text"
                    name="process"
                    value={formData.process}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter product or process"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Change</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['Man', 'Machine', 'Material', 'Method'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, changeType: type }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.changeType === type
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {type === 'Man' && '👤 '}
                        {type === 'Machine' && '⚙️ '}
                        {type === 'Material' && '📦 '}
                        {type === 'Method' && '📋 '}
                        {type}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="changeType"
                    value={formData.changeType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Or enter custom type"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Change</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Describe the reason for this change..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Risk Assessment Section */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-orange-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Risk Assessment
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Potential Risk</label>
                  <input
                    type="text"
                    name="potentialRisk"
                    value={formData.potentialRisk}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Identify risks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
                  <input
                    type="text"
                    name="impact"
                    value={formData.impact}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Describe impact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'L', label: 'Low', color: 'bg-green-500 hover:bg-green-600' },
                      { value: 'M', label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-600' },
                      { value: 'H', label: 'High', color: 'bg-red-500 hover:bg-red-600' },
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, riskLevel: level.value as 'L' | 'M' | 'H' }))}
                        className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          formData.riskLevel === level.value
                            ? `${level.color} text-white shadow-md`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Alert Box */}
              <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                formData.riskLevel === 'L' ? 'bg-green-50 border-green-500' :
                formData.riskLevel === 'M' ? 'bg-yellow-50 border-yellow-500' :
                'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    formData.riskLevel === 'L' ? 'bg-green-500' :
                    formData.riskLevel === 'M' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {formData.riskLevel}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {formData.riskLevel === 'L' && '✅ Low Risk - Standard controls apply'}
                      {formData.riskLevel === 'M' && '⚠️ Medium Risk - Additional monitoring required'}
                      {formData.riskLevel === 'H' && '🚨 High Risk - Immediate action needed'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.riskLevel === 'L' && 'Proceed with standard procedures and documentation.'}
                      {formData.riskLevel === 'M' && 'Implement enhanced monitoring and obtain supervisor approval.'}
                      {formData.riskLevel === 'H' && 'Stop work if unsafe. Obtain management approval before proceeding.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Containment Plan Section */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-purple-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Containment Plan
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mr-2">1</span>
                    Containment Action
                  </label>
                  <textarea
                    name="containmentAction"
                    value={formData.containmentAction}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Describe containment actions..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mr-2">2</span>
                    Area Affected
                  </label>
                  <textarea
                    name="areaAffected"
                    value={formData.areaAffected}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="List affected areas..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mr-2">3</span>
                    Duration
                  </label>
                  <textarea
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Expected duration..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mr-2">4</span>
                    Responsibility
                  </label>
                  <textarea
                    name="responsibility"
                    value={formData.responsibility}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Assign responsibilities..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mr-2">5</span>
                    Inspection Method
                  </label>
                  <textarea
                    name="inspectionMethod"
                    value={formData.inspectionMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Define inspection methods..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mr-2">6</span>
                    Acceptance Criteria
                  </label>
                  <textarea
                    name="acceptanceCriteria"
                    value={formData.acceptanceCriteria}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Set acceptance criteria..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Trial & Validation Section */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-teal-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Trial & Validation
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trial Quantity</label>
                  <input
                    type="text"
                    name="trialQuantity"
                    value={formData.trialQuantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="e.g., 100 units"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Defects Observed</label>
                  <div className="flex gap-3 mb-2">
                    {['Yes', 'No'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, defectsObserved: option }))}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                          formData.defectsObserved.toLowerCase() === option.toLowerCase()
                            ? option === 'Yes'
                              ? 'bg-red-500 text-white shadow-md'
                              : 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {option === 'Yes' ? '⚠️ ' : '✅ '}{option}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="defectsObserved"
                    value={formData.defectsObserved}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Add details..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-36 resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Document trial observations and findings..."
                />
              </div>
            </div>
          </section>

          {/* Approval Section */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Approval
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Prepared By', name: 'preparedBy', icon: '✍️', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
                  { label: 'Reviewed By (Quality)', name: 'reviewedBy', icon: '🔍', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
                  { label: 'Approved By (Management)', name: 'approvedBy', icon: '✅', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                ].map(({ label, name, icon, bgColor, borderColor }) => (
                  <div key={name} className={`p-4 rounded-lg ${bgColor} border ${borderColor}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{icon}</span>
                      <span className="font-semibold text-gray-800 text-sm">{label}</span>
                    </div>
                    <input
                      type="text"
                      name={name}
                      value={formData[name as keyof ChangeFormData]}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter name"
                    />
                  </div>
                ))}
              </div>

              {/* Approval Progress */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Approval Progress</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-2 rounded-full ${formData.preparedBy ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`w-8 h-2 rounded-full ${formData.reviewedBy ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                    <div className={`w-8 h-2 rounded-full ${formData.approvedBy ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.preparedBy && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      ✓ Prepared by {formData.preparedBy}
                    </span>
                  )}
                  {formData.reviewedBy && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      ✓ Reviewed by {formData.reviewedBy}
                    </span>
                  )}
                  {formData.approvedBy && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ✓ Approved by {formData.approvedBy}
                    </span>
                  )}
                  {!formData.preparedBy && !formData.reviewedBy && !formData.approvedBy && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      ⏳ Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Save Button at Bottom */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-3 px-10 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Details
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            4M Change Management System • Last Updated: {new Date().toLocaleString()}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Containment;