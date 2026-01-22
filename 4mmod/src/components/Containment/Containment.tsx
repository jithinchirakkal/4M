

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader, ArrowLeft, X } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

interface ChangeFormData {
  record_id: string;
  department: string;
  process: string;
  line: string;
  change_type: string;
  reason: string;
  potential_risk: string;
  impact: string;
  risk_level: 'L' | 'M' | 'H';
  containment_action: string;
  area_affected: string;
  duration: string;
  responsibility: string;
  inspection_method: string;
  acceptance_criteria: string;
  trial_quantity: string;
  defects_observed: string;
  observations: string;
  prepared_by: string;
  reviewed_by: string;
  approved_by: string;
}

interface ApiResponse {
  message: string;
  data: ChangeFormData & {
    id: number;
    is_complete: boolean;
    completion_percentage: number;
  };
}

interface ContainmentProps {
  onReturnToDetail?: () => void;
}

const Containment: React.FC<ContainmentProps> = ({ onReturnToDetail }) => {
  const [formData, setFormData] = useState<ChangeFormData>({
    record_id: '',
    department: '',
    process: '',
    line: '',
    change_type: '',
    reason: '',
    potential_risk: '',
    impact: '',
    risk_level: 'L',
    containment_action: '',
    area_affected: '',
    duration: '',
    responsibility: '',
    inspection_method: '',
    acceptance_criteria: '',
    trial_quantity: '',
    defects_observed: '',
    observations: '',
    prepared_by: '',
    reviewed_by: '',
    approved_by: '',
  });

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Prefill & Fetch logic
  useEffect(() => {
    const savedPrefill = localStorage.getItem("containment_prefill_data");

    if (savedPrefill) {
      try {
        const data = JSON.parse(savedPrefill);

        setFormData(prev => ({
          ...prev,
          record_id: data.record_id || '',
          department: data.department || '',
          line: data.line || '',
          process: data.process || '',
          change_type: data.change_type || '',
          reason: data.reason || '',
        }));

        if (data.record_id) {
          fetchTrackingSheet(data.record_id);
        }

        localStorage.removeItem("containment_prefill_data");
      } catch (e) {
        console.error("Failed to parse prefill data", e);
      }
    }
  }, []);

  const fetchTrackingSheet = async (recordId: string) => {
    if (!recordId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/fourm-change-details/by_record_id/?record_id=${recordId}`
      );

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setCompletionPercentage(data.completion_percentage || 0);
        setIsComplete(data.is_complete || false);
        setSuccess('Data loaded successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else if (response.status === 404) {
        setError('New tracking sheet initialized for this record.');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Failed to sync with server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.record_id.trim()) {
      setError('Record ID is required');
      return;
    }

    setSaveLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/fourm-change-details/create_or_update/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save data');

      const result: ApiResponse = await response.json();

      setSuccess('Details saved successfully!');
      setCompletionPercentage(result.data.completion_percentage || 0);
      setIsComplete(result.data.is_complete || false);

      setShowSuccessModal(true);

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Failed to save data');
    } finally {
      setSaveLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'L': return 'bg-green-100 text-green-800 border-green-300';
      case 'M': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'H': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Handle return to detail view
  const handleReturnToDetail = () => {
    if (onReturnToDetail) {
      onReturnToDetail();
    }
    setShowSuccessModal(false);
  };

  // Optional: Auto-return to detail view after 7 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (showSuccessModal && onReturnToDetail) {
      timer = setTimeout(() => {
        handleReturnToDetail();
      }, 7000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessModal, onReturnToDetail]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Containment Plan</h1>
              <p className="text-sm text-gray-500 font-medium">Man • Machine • Material • Method</p>
            </div>
          </div>
          {loading && <div className="flex items-center gap-2 text-blue-600 font-bold animate-pulse"><Loader className="w-5 h-5 animate-spin"/> SYNCING...</div>}
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {formData.record_id && (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-200">
                  📋 {formData.record_id}
                </span>
              )}
              <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${getRiskBadge(formData.risk_level)}`}>
                Risk: {formData.risk_level === 'L' ? 'Low' : formData.risk_level === 'M' ? 'Medium' : 'High'}
              </span>
              {completionPercentage > 0 && (
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${isComplete ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                  {isComplete ? '✓ Complete' : `${completionPercentage}% Form Progress`}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500 font-medium">📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          {error && <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-medium"><AlertCircle className="w-5 h-5" /> <span>{error}</span></div>}
          {success && <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium"><CheckCircle className="w-5 h-5" /> <span>{success}</span></div>}
        </div>
      )}

      {/* Main Form Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">

          {/* Change Details Section */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider">Change Details</h3>
              {/* <span className="text-xs bg-white/20 text-white px-2 py-1 rounded font-bold">SECTION 01</span> */}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Change Request No</label>
                  <input type="text" value={formData.record_id} readOnly className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Department (Shopfloor)</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Line / Station</label>
                  <input type="text" value={`${formData.line} Station: ${formData.process}`} readOnly className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Type of Change</label>
                  <div className="px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 font-bold">{formData.change_type || 'N/A'}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Reason for Change</label>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 italic text-sm">{formData.reason || 'No description available.'}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Assessment */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Risk Assessment</h3>
              {/* <span className="text-xs bg-white/20 text-white px-2 py-1 rounded font-bold">SECTION 02</span> */}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Potential Risk</label>
                  <input type="text" name="potential_risk" value={formData.potential_risk} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Impact</label>
                  <input type="text" name="impact" value={formData.impact} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Risk Level</label>
                  <div className="flex gap-2">
                    {['L', 'M', 'H'].map((level) => (
                      <button key={level} type="button" onClick={() => setFormData(p => ({ ...p, risk_level: level as any }))}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${formData.risk_level === level ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                        {level === 'L' ? 'LOW' : level === 'M' ? 'MED' : 'HIGH'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Containment Plan */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Containment Plan</h3>
              {/* <span className="text-xs bg-white/20 text-white px-2 py-1 rounded font-bold">SECTION 03</span> */}
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">1. Containment Action</label>
                  <textarea name="containment_action" value={formData.containment_action} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-24" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">2. Area Affected</label>
                  <textarea name="area_affected" value={formData.area_affected} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-24" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">3. Duration</label>
                  <textarea name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-24" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">4. Responsibility</label>
                  <input type="text" name="responsibility" value={formData.responsibility} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">5. Inspection Method</label>
                  <input type="text" name="inspection_method" value={formData.inspection_method} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">6. Acceptance Criteria</label>
                  <input type="text" name="acceptance_criteria" value={formData.acceptance_criteria} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
          </section>

          {/* Trial & Validation */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-teal-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Trial & Validation</h3>
              {/* <span className="text-xs bg-white/20 text-white px-2 py-1 rounded font-bold">SECTION 04</span> */}
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Trial Quantity</label>
                  <input type="text" name="trial_quantity" value={formData.trial_quantity} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Defects Observed?</label>
                  <div className="flex gap-3">
                    {['Yes', 'No'].map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(p => ({ ...p, defects_observed: opt }))}
                        className={`flex-1 py-2 rounded-lg font-bold border transition-all ${formData.defects_observed === opt ? 'bg-teal-600 text-white border-teal-700 shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Observations</label>
                  <textarea name="observations" value={formData.observations} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-24" />
                </div>
              </div>
            </div>
          </section>

          {/* Approval Progress */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Approval & Closure</h3>
              {/* <span className="text-xs bg-white/20 text-white px-2 py-1 rounded font-bold">SECTION 05</span> */}
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Prepared By', name: 'prepared_by', color: 'blue' },
                { label: 'Quality Review', name: 'reviewed_by', color: 'amber' },
                { label: 'Management Approval', name: 'approved_by', color: 'green' }
              ].map(field => (
                <div key={field.name} className={`p-4 bg-${field.color}-50 border border-${field.color}-200 rounded-lg`}>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name as keyof ChangeFormData]} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white" placeholder="Sign Name" />
                </div>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <button onClick={handleSave} disabled={saveLoading || !formData.record_id}
              className={`flex items-center gap-3 px-12 py-4 rounded-xl font-bold text-xl transition-all shadow-xl hover:scale-105 active:scale-95 ${saveLoading || !formData.record_id ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'}`}>
              {saveLoading ? <><Loader className="w-6 h-6 animate-spin" /> SAVING...</> : 'SAVE FINAL DETAILS'}
            </button>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-green-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-white" />
                <h2 className="text-xl font-bold text-white">Containment Plan Completed</h2>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-white hover:text-green-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Success!</h3>
                <p className="text-gray-600 mt-2">
                  Containment actions have been successfully recorded.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Record ID:</span>
                  <span className="font-bold text-gray-900">{formData.record_id || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Risk Level:</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-xs ${getRiskBadge(formData.risk_level)}`}>
                    {formData.risk_level === 'L' ? 'Low' : formData.risk_level === 'M' ? 'Medium' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Completion:</span>
                  <span className={`font-bold ${isComplete ? 'text-green-700' : 'text-amber-700'}`}>
                    {isComplete ? '100% – Complete' : `${completionPercentage}%`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleReturnToDetail}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors border border-gray-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Change Details
                </button>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-md"
                >
                  Continue Editing
                </button>
              </div>

              {onReturnToDetail && (
                <div className="text-center text-sm text-gray-500 mt-4 pt-2 border-t border-gray-200">
                  Redirecting to change details in 7 seconds...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Containment;