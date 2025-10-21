import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, User, Building2, Hash } from 'lucide-react';

// Types
interface Process {
  sNo: number;
  processNo: string;
  move: string;
  store: string;
  operation: string;
  delay: string;
  processDescription: string;
  productCharacteristics: string;
  processCharacteristics: string;
}

type SymbolType = 'operation' | 'transportation' | 'inspection' | 'operationInspection' | 'delay' | 'storage' | '';

interface Revision {
  revision: string;
  date: string;
  changeDescription: string;
  approvedBySupplier: string;
  approvedByCustomer: string;
  symbol?: SymbolType;
}

interface FormData {
  partName: string;
  partNumber: string;
  organizationName: string;
  customerName: string;
  docNo: string;
  revDate: string;
  revNo: string;
  processes: Process[];
  revisions: Revision[];
  preparedBy: string;
  approvedBy: string;
}

const API = 'http://localhost:8000/api';

export default function ProcessFlowDiagram() {
  const [step, setStep] = useState<0 | 1>(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    partName: '',
    partNumber: '',
    organizationName: '',
    customerName: '',
    docNo: '',
    revDate: '',
    revNo: '',
    processes: [
      { sNo: 1, processNo: '', move: '', store: '', operation: '', delay: '', processDescription: '', productCharacteristics: '', processCharacteristics: '' }
    ],
    revisions: [
      { revision: '', date: '', changeDescription: '', approvedBySupplier: '', approvedByCustomer: '', symbol: '' }
    ],
    preparedBy: '',
    approvedBy: ''
  });

  const [submittedList, setSubmittedList] = useState<FormData[]>([]);

  useEffect(() => {
    if (step === 0) fetchProcessFlows();
  }, [step]);

  const fetchProcessFlows = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/process-flows/`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      
      const mapped = data.map((item: any) => ({
        partName: item.part_name || '',
        partNumber: item.part_number || '',
        organizationName: item.organization_name || '',
        customerName: item.customer_name || '',
        docNo: item.doc_no || '',
        revDate: item.rev_date || '',
        revNo: item.rev_no || '',
        preparedBy: item.prepared_by || '',
        approvedBy: item.approved_by || '',
        processes: item.processes?.map((p: any) => ({
          sNo: p.s_no,
          processNo: p.process_no || '',
          move: p.move || '',
          store: p.store || '',
          operation: p.operation || '',
          delay: p.delay || '',
          processDescription: p.process_description || '',
          productCharacteristics: p.product_characteristics || '',
          processCharacteristics: p.process_characteristics || ''
        })) || [],
        revisions: item.revisions?.map((r: any) => ({
          revision: r.revision || '',
          date: r.date || '',
          changeDescription: r.change_description || '',
          approvedBySupplier: r.approved_by_supplier || '',
          approvedByCustomer: r.approved_by_customer || '',
          symbol: r.symbol as SymbolType || ''
        })) || []
      }));
      
      setSubmittedList(mapped);
    } catch {
      alert('Could not load process flows');
    } finally {
      setLoading(false);
    }
  };

  const buildPayload = () => ({
    part_name: formData.partName,
    part_number: formData.partNumber,
    organization_name: formData.organizationName,
    customer_name: formData.customerName,
    doc_no: formData.docNo,
    rev_date: formData.revDate || null,
    rev_no: formData.revNo,
    prepared_by: formData.preparedBy,
    approved_by: formData.approvedBy,

    processes: formData.processes.map(p => ({
      s_no: p.sNo,
      process_no: p.processNo,
      move: p.move,
      store: p.store,
      operation: p.operation,
      delay: p.delay,
      process_description: p.processDescription,
      product_characteristics: p.productCharacteristics,
      process_characteristics: p.processCharacteristics
    })),

    revisions: formData.revisions.map(r => ({
      revision: r.revision,
      date: r.date || null,
      change_description: r.changeDescription,
      approved_by_supplier: r.approvedBySupplier,
      approved_by_customer: r.approvedByCustomer,
      symbol: r.symbol || ''
    }))
  });

  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/process-flows/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      });
      if (!res.ok) throw new Error(await res.text());
      alert('Process flow saved successfully!');
      resetForm();
      setStep(0);
    } catch (e: any) {
      console.error(e);
      alert('Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      partName: '',
      partNumber: '',
      organizationName: '',
      customerName: '',
      docNo: '',
      revDate: '',
      revNo: '',
      processes: [
        { sNo: 1, processNo: '', move: '', store: '', operation: '', delay: '', processDescription: '', productCharacteristics: '', processCharacteristics: '' }
      ],
      revisions: [
        { revision: '', date: '', changeDescription: '', approvedBySupplier: '', approvedByCustomer: '', symbol: '' }
      ],
      preparedBy: '',
      approvedBy: ''
    });
  };

  const handleProcessChange = (index: number, field: keyof Process, value: string) => {
    const updatedProcesses = [...formData.processes];
    updatedProcesses[index] = {
      ...updatedProcesses[index],
      [field]: value
    };
    setFormData({ ...formData, processes: updatedProcesses });
  };

  const handleRevisionChange = (index: number, field: keyof Revision, value: string) => {
    const updatedRevisions = [...formData.revisions];
    updatedRevisions[index] = {
      ...updatedRevisions[index],
      [field]: value
    };
    setFormData({ ...formData, revisions: updatedRevisions });
  };

  const handleRevisionSymbolChange = (index: number, value: SymbolType) => {
    const updatedRevisions = [...formData.revisions];
    updatedRevisions[index] = {
      ...updatedRevisions[index],
      symbol: value
    };
    setFormData({ ...formData, revisions: updatedRevisions });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const addProcess = () => {
    const newProcess: Process = {
      sNo: formData.processes.length + 1,
      processNo: '',
      move: '',
      store: '',
      operation: '',
      delay: '',
      processDescription: '',
      productCharacteristics: '',
      processCharacteristics: ''
    };
    setFormData({ ...formData, processes: [...formData.processes, newProcess] });
  };

  const removeProcess = (index: number) => {
    if (formData.processes.length > 1) {
      const updatedProcesses = formData.processes.filter((_, i) => i !== index);
      const renumberedProcesses = updatedProcesses.map((process, i) => ({
        ...process,
        sNo: i + 1
      }));
      setFormData({ ...formData, processes: renumberedProcesses });
    }
  };

  const addRevision = () => {
    const newRevision: Revision = {
      revision: '',
      date: '',
      changeDescription: '',
      approvedBySupplier: '',
      approvedByCustomer: '',
      symbol: ''
    };
    setFormData({ ...formData, revisions: [...formData.revisions, newRevision] });
  };

  // Symbol Components
  const OperationSymbol = () => (
    <span title="Operation" className="inline-block align-middle">
      <span className="w-4 h-4 inline-block rounded-full border-2 border-blue-500 bg-blue-50"></span>
    </span>
  );
  
  const TransportationSymbol = () => (
    <span title="Transportation" className="inline-block align-middle">
      <svg width="16" height="12" viewBox="0 0 32 20" className="inline fill-current text-green-500">
        <rect x="4" y="5" width="20" height="10" stroke="currentColor" strokeWidth="2" fill="rgb(240 253 244)" />
        <polygon points="24,5 28,10 24,15" stroke="currentColor" strokeWidth="2" fill="rgb(240 253 244)" />
      </svg>
    </span>
  );
  
  const InspectionSymbol = () => (
    <span title="Inspection" className="inline-block align-middle">
      <span className="w-4 h-4 inline-block border-2 border-purple-500 bg-purple-50"></span>
    </span>
  );
  
  const OperationInspectionSymbol = () => (
    <span title="Operation + Inspection" className="inline-block align-middle">
      <span className="w-4 h-4 inline-block rounded-full border-2 border-indigo-500 bg-indigo-50 relative">
        <span className="absolute inset-1 border-2 border-indigo-400 rounded-sm bg-indigo-25"></span>
      </span>
    </span>
  );
  
  const DelaySymbol = () => (
    <span title="Delay" className="inline-block align-middle">
      <span className="w-4 h-4 inline-block rounded-l-full border-2 border-yellow-500 bg-yellow-50"></span>
    </span>
  );
  
  const StorageSymbol = () => (
    <span title="Storage" className="inline-block align-middle">
      <svg width="16" height="16" viewBox="0 0 32 32" className="inline fill-current text-red-500">
        <polygon points="4,4 28,4 16,28" stroke="currentColor" strokeWidth="2" fill="rgb(254 242 242)" />
      </svg>
    </span>
  );

  // Legend Section
  const LegendSection = () => (
    <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
          Process Symbols Legend
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center space-x-3 mb-2">
              <OperationSymbol />
              <div>
                <h3 className="font-semibold text-blue-800 text-sm">Operation</h3>
                <p className="text-xs text-blue-600">Manufacturing process</p>
              </div>
            </div>
            <p className="text-xs text-gray-700">When something is done to or by the subject being followed at a given work area.</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
            <div className="flex items-center space-x-3 mb-2">
              <TransportationSymbol />
              <div>
                <h3 className="font-semibold text-green-800 text-sm">Transportation</h3>
                <p className="text-xs text-green-600">Movement process</p>
              </div>
            </div>
            <p className="text-xs text-gray-700">When something is moving or being moved from one workspace to another.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center space-x-3 mb-2">
              <InspectionSymbol />
              <div>
                <h3 className="font-semibold text-purple-800 text-sm">Inspection</h3>
                <p className="text-xs text-purple-600">Quality check</p>
              </div>
            </div>
            <p className="text-xs text-gray-700">When something is checked or verified for quality or examined for information.</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-3 border border-indigo-200">
            <div className="flex items-center space-x-3 mb-2">
              <OperationInspectionSymbol />
              <div>
                <h3 className="font-semibold text-indigo-800 text-sm">Operation + Inspection</h3>
                <p className="text-xs text-indigo-600">Combined process</p>
              </div>
            </div>
            <p className="text-xs text-gray-700">When something is done & verified simultaneously.</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-200">
            <div className="flex items-center space-x-3 mb-2">
              <DelaySymbol />
              <div>
                <h3 className="font-semibold text-yellow-800 text-sm">Delay</h3>
                <p className="text-xs text-yellow-600">Waiting time</p>
              </div>
            </div>
            <p className="text-xs text-gray-700">When something or someone waits or is delayed.</p>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-3 border border-red-200">
            <div className="flex items-center space-x-3 mb-2">
              <StorageSymbol />
              <div>
                <h3 className="font-semibold text-red-800 text-sm">Storage</h3>
                <p className="text-xs text-red-600">Inventory storage</p>
              </div>
            </div>
            <p className="text-xs text-gray-700">When something is kept or protected against unauthorized removal.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-4 mb-3">
        <FileText className="w-10 h-10 text-blue-400" />
      </div>
      <h2 className="text-xl font-bold text-blue-700 mb-2">No Process Flow Entries Yet</h2>
      <p className="text-gray-500 text-center max-w-md text-sm">
        Click the <span className="font-semibold text-blue-600">Add New Flow</span> button to create your first process flow entry.
      </p>
    </div>
  );

  return (
    <div className="bg-[#f6faff] min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Process Flow Diagram</h1>
                <p className="text-blue-100 text-sm mt-1">Manufacturing process documentation and workflow management</p>
              </div>
              {step === 0 ? (
                <button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
                  onClick={() => setStep(1)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Flow</span>
                </button>
              ) : (
                <button
                  onClick={() => setStep(0)}
                  className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
                  disabled={loading}
                >
                  ← Back to List
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List View */}
        {step === 0 && (
          <>
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading process flows...</p>
              </div>
            )}
            
            {!loading && submittedList.length === 0 && <EmptyState />}
            
            {!loading && submittedList.length > 0 && (
              <div className="grid gap-4">
                {submittedList.map((submittedData, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center">
                          <Hash className="w-4 h-4 mr-2" />
                          {submittedData.partName || "Untitled Process Flow"}
                        </h3>
                        <span className="text-xs opacity-80">Entry #{idx + 1}</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid md:grid-cols-3 gap-3 mb-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <Hash className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="font-semibold text-gray-700 text-sm">Part Information</span>
                          </div>
                          <p className="text-base font-bold text-blue-800">{submittedData.partNumber || 'Not specified'}</p>
                          <p className="text-xs text-gray-600">{submittedData.docNo || 'No doc number'}</p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <Building2 className="w-4 h-4 text-green-600 mr-2" />
                            <span className="font-semibold text-gray-700 text-sm">Organization</span>
                          </div>
                          <p className="text-base font-bold text-green-800">{submittedData.organizationName || 'Not specified'}</p>
                          <p className="text-xs text-gray-600">Customer: {submittedData.customerName || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <FileText className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="font-semibold text-gray-700 text-sm">Process Count</span>
                          </div>
                          <p className="text-base font-bold text-purple-800">{submittedData.processes?.length || 0} steps</p>
                          <p className="text-xs text-gray-600">{submittedData.revisions?.length || 0} revisions</p>
                        </div>
                      </div>

                      {/* Process Steps Preview */}
                      {submittedData.processes && submittedData.processes.length > 0 && (
                        <div className="bg-amber-50 rounded-lg p-3 mb-3">
                          <h4 className="font-semibold text-amber-800 mb-2 text-sm">Process Steps</h4>
                          <div className="text-xs text-gray-700">
                            {submittedData.processes.slice(0, 3).map((p, i) => (
                              <div key={i} className="flex items-center mb-1">
                                <span className="bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold mr-2">
                                  {p.sNo}
                                </span>
                                <span>{p.processDescription || 'No description'}</span>
                              </div>
                            ))}
                            {submittedData.processes.length > 3 && (
                              <span className="text-gray-500">... and {submittedData.processes.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Revisions Preview */}
                      {submittedData.revisions && submittedData.revisions.length > 0 && (
                        <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                          <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Recent Revisions</h4>
                          <div className="text-xs text-gray-700">
                            {submittedData.revisions.slice(0, 2).map((r, i) => (
                              <div key={i} className="flex items-center mb-1">
                                <span className="font-medium mr-2">Rev {r.revision}:</span>
                                <span>{r.changeDescription || 'No description'}</span>
                                {r.symbol && (
                                  <span className="ml-2">
                                    {r.symbol === 'operation' && <OperationSymbol />}
                                    {r.symbol === 'transportation' && <TransportationSymbol />}
                                    {r.symbol === 'inspection' && <InspectionSymbol />}
                                    {r.symbol === 'operationInspection' && <OperationInspectionSymbol />}
                                    {r.symbol === 'delay' && <DelaySymbol />}
                                    {r.symbol === 'storage' && <StorageSymbol />}
                                  </span>
                                )}
                              </div>
                            ))}
                            {submittedData.revisions.length > 2 && (
                              <span className="text-gray-500">... and {submittedData.revisions.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-xs text-gray-600">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span><strong>Prepared by:</strong> {submittedData.preparedBy || 'Not specified'}</span>
                        </div>
                        {submittedData.approvedBy && (
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span><strong>Approved by:</strong> {submittedData.approvedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Form View */}
        {step === 1 && (
          <>
            <LegendSection />

            {/* Part Information */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Part Information
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                        <FileText className="w-3 h-3 mr-2 text-emerald-500" />
                        Part Name
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                        value={formData.partName}
                        onChange={(e) => handleInputChange('partName', e.target.value)}
                        placeholder="Enter part name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                        <Hash className="w-3 h-3 mr-2 text-emerald-500" />
                        Part Number
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                        value={formData.partNumber}
                        onChange={(e) => handleInputChange('partNumber', e.target.value)}
                        placeholder="Enter part number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Doc No.</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                        value={formData.docNo}
                        onChange={(e) => handleInputChange('docNo', e.target.value)}
                        placeholder="Enter document number"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                        <Building2 className="w-3 h-3 mr-2 text-emerald-500" />
                        Organization Name
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                        <User className="w-3 h-3 mr-2 text-emerald-500" />
                        Customer Name
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Rev Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                          value={formData.revDate}
                          onChange={(e) => handleInputChange('revDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Rev No</label>
                        <input
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                          value={formData.revNo}
                          onChange={(e) => handleInputChange('revNo', e.target.value)}
                          placeholder="00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps Table */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Process Steps Table
                  </h2>
                  <button
                    onClick={addProcess}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Row</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-slate-100">
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs font-semibold text-gray-700">S. No.</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs font-semibold text-gray-700">Process No.</th>
                        <th className="border border-gray-300 px-2 py-2 text-center text-xs font-semibold text-gray-700">Move</th>
                        <th className="border border-gray-300 px-2 py-2 text-center text-xs font-semibold text-gray-700">Store</th>
                        <th className="border border-gray-300 px-2 py-2 text-center text-xs font-semibold text-gray-700">Operation / Inspection</th>
                        <th className="border border-gray-300 px-2 py-2 text-center text-xs font-semibold text-gray-700">Delay</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs font-semibold text-gray-700">Process Description</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs font-semibold text-gray-700">Product Characteristics</th>
                        <th className="border border-gray-300 px-2 py-2 text-left text-xs font-semibold text-gray-700">Process Characteristics</th>
                        <th className="border border-gray-300 px-2 py-2 text-center text-xs font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.processes.map((process, index) => (
                        <tr key={index} className="hover:bg-amber-50 transition-colors">
                          <td className="border border-gray-300 px-2 py-2">
                            <div className="flex items-center justify-center">
                              <span className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {process.sNo}
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-xs"
                              value={process.processNo}
                              onChange={(e) => handleProcessChange(index, 'processNo', e.target.value)}
                              placeholder="Process no."
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-center text-xs"
                              value={process.move}
                              onChange={(e) => handleProcessChange(index, 'move', e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-center text-xs"
                              value={process.store}
                              onChange={(e) => handleProcessChange(index, 'store', e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-center text-xs"
                              value={process.operation}
                              onChange={(e) => handleProcessChange(index, 'operation', e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded text-center text-xs"
                              value={process.delay}
                              onChange={(e) => handleProcessChange(index, 'delay', e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <textarea
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded resize-none text-xs"
                              rows={1}
                              value={process.processDescription}
                              onChange={(e) => handleProcessChange(index, 'processDescription', e.target.value)}
                              placeholder="Describe process..."
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <textarea
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded resize-none text-xs"
                              rows={1}
                              value={process.productCharacteristics}
                              onChange={(e) => handleProcessChange(index, 'productCharacteristics', e.target.value)}
                              placeholder="Product characteristics..."
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <textarea
                              className="w-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-amber-500 rounded resize-none text-xs"
                              rows={1}
                              value={process.processCharacteristics}
                              onChange={(e) => handleProcessChange(index, 'processCharacteristics', e.target.value)}
                              placeholder="Process characteristics..."
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <div className="flex justify-center">
                              {formData.processes.length > 1 && (
                                <button
                                  onClick={() => removeProcess(index)}
                                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all"
                                  title="Remove Row"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Change/Modification Details */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Change / Modification Details
                  </h2>
                  <button
                    onClick={addRevision}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Revision</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {formData.revisions.map((revision, index) => (
                    <div key={index} className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Revision</label>
                          <input
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                            value={revision.revision}
                            onChange={(e) => handleRevisionChange(index, 'revision', e.target.value)}
                            placeholder="Rev number"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                            value={revision.date}
                            onChange={(e) => handleRevisionChange(index, 'date', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Change Description</label>
                          <textarea
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-xs"
                            rows={1}
                            value={revision.changeDescription}
                            onChange={(e) => handleRevisionChange(index, 'changeDescription', e.target.value)}
                            placeholder="Describe changes"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Approved by Supplier</label>
                          <input
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                            value={revision.approvedBySupplier}
                            onChange={(e) => handleRevisionChange(index, 'approvedBySupplier', e.target.value)}
                            placeholder="Supplier approval"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Approved by Customer</label>
                          <input
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                            value={revision.approvedByCustomer}
                            onChange={(e) => handleRevisionChange(index, 'approvedByCustomer', e.target.value)}
                            placeholder="Customer approval"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Process Symbol</label>
                          <select
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                            value={revision.symbol || ''}
                            onChange={e => handleRevisionSymbolChange(index, e.target.value as SymbolType)}
                          >
                            <option value="">Select</option>
                            <option value="operation">Operation</option>
                            <option value="transportation">Transportation</option>
                            <option value="inspection">Inspection</option>
                            <option value="operationInspection">Operation + Inspection</option>
                            <option value="delay">Delay</option>
                            <option value="storage">Storage</option>
                          </select>
                          <div className="mt-1 flex justify-center">
                            {revision.symbol === 'operation' && <OperationSymbol />}
                            {revision.symbol === 'transportation' && <TransportationSymbol />}
                            {revision.symbol === 'inspection' && <InspectionSymbol />}
                            {revision.symbol === 'operationInspection' && <OperationInspectionSymbol />}
                            {revision.symbol === 'delay' && <DelaySymbol />}
                            {revision.symbol === 'storage' && <StorageSymbol />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white p-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Signatures & Approval
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <User className="w-3 h-3 mr-2 text-blue-500" />
                      Prepared By
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="Name and signature"
                      value={formData.preparedBy}
                      onChange={(e) => handleInputChange('preparedBy', e.target.value)}
                    />
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <User className="w-3 h-3 mr-2 text-green-500" />
                      Approved By
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                      placeholder="Name and signature"
                      value={formData.approvedBy}
                      onChange={(e) => handleInputChange('approvedBy', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={submitForm}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Process Flow'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
