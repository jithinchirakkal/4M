import { useState, useEffect } from 'react';
import { Plus, Hash, User, Edit3 } from 'lucide-react';

type MachineBlock = { machineNo: string; operator: string; date: string; time: string };
type ProcessRow = {
  sno: string;
  parameter: string;
  specification: string;
  method: string;
  machineData: MachineBlock;
  firstChange: MachineBlock;
  secondChange: MachineBlock;
  action: string;
};
type InprocessRow = { 
  sno: string; 
  parameter: string; 
  specification: string;
  method: string; 
  readings: string[] 
};

type FormState = {
  partName: string;
  partNumber: string;
  customer: string;
  operationName: string;
  overallJudgement: 'OK' | 'NG';
  preparedBy: string;
  approvedBy: string;
  processRows: ProcessRow[];
  inprocessRows: InprocessRow[];
};

const API = 'http://localhost:8000/api';

const newMachine = (): MachineBlock => ({ machineNo: '', operator: '', date: '', time: '' });
const newProcess = (idx = 1): ProcessRow => ({
  sno: String(idx),
  parameter: '',
  specification: '',
  method: '',
  machineData: newMachine(),
  firstChange: newMachine(),
  secondChange: newMachine(),
  action: '',
});
const newInproc = (idx = 1): InprocessRow => ({
  sno: String(idx),
  parameter: '',
  specification: '',
  method: '',
  readings: Array(10).fill(''),
});

export default function InspectionForm() {
  const [step, setStep] = useState<0 | 1>(0);          
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => { if (step === 0) fetchReports(); }, [step]);

  const fetchReports = async () => {
    setLoading(true);
    try { 
      const r = await fetch(`${API}/reports/`);
      if (!r.ok) throw new Error();
      setReports(await r.json());
    } catch { 
      alert('Could not load reports'); 
    }
    finally { setLoading(false); }
  };

  const [form, setForm] = useState<FormState>({
    partName: '',
    partNumber: '',
    customer: '',
    operationName: '',
    overallJudgement: 'OK',
    preparedBy: '',
    approvedBy: '',
    processRows: [newProcess()],
    inprocessRows: [newInproc()],
  });

  const resetForm = () => {
    setCurrentId(null);
    setForm({
      partName: '',
      partNumber: '',
      customer: '',
      operationName: '',
      overallJudgement: 'OK',
      preparedBy: '',
      approvedBy: '',
      processRows: [newProcess()],
      inprocessRows: [newInproc()],
    });
  };

  const setField = (k: keyof FormState, v: any) => setForm(p => ({ ...p, [k]: v }));

  const buildPayload = () => ({
    part_name: form.partName,
    part_number: form.partNumber,
    customer: form.customer,
    operation_name: form.operationName,
    overall_judgement: form.overallJudgement,
    prepared_by: form.preparedBy,
    approved_by: form.approvedBy,

    process_parameters: form.processRows.map(r => ({
      sno: r.sno,
      parameter_name: r.parameter,
      specification: r.specification,
      method: r.method,
      process_machine_no: r.machineData.machineNo,
      process_operator: r.machineData.operator,
      process_date_time: `${r.machineData.date} ${r.machineData.time}`.trim(),
      change_machine_no: r.firstChange.machineNo,
      change_operator: r.firstChange.operator,
      change_date_time: `${r.firstChange.date} ${r.firstChange.time}`.trim(),
      lqa_machine_no: r.secondChange.machineNo,
      lqa_operator: r.secondChange.operator,
      lqa_date_time: `${r.secondChange.date} ${r.secondChange.time}`.trim(),
      action: r.action,
    })),

    inprocess_parameters: form.inprocessRows.map(r => ({
      sno: r.sno,
      parameter_name: r.parameter,
      specification: r.specification,
      method: r.method,
      readings: r.readings,
    })),
  });

  const save = async () => {
    setLoading(true);
    try {
      const url = currentId ? `${API}/reports/${currentId}/` : `${API}/reports/`;
      const method = currentId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) throw new Error(await res.text());
      alert(currentId ? 'Report updated' : 'Report submitted');
      resetForm();
      setStep(0);
    } catch (e) { 
      console.error(e); 
      alert('Save failed'); 
    }
    finally { setLoading(false); }
  };

  const openReport = async (id: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/reports/${id}/`);
      if (!r.ok) throw new Error();
      const data = await r.json();

      setForm({
        partName: data.part_name || '',
        partNumber: data.part_number || '',
        customer: data.customer || '',
        operationName: data.operation_name || '',
        overallJudgement: data.overall_judgement || 'OK',
        preparedBy: data.prepared_by || '',
        approvedBy: data.approved_by || '',
        processRows: (data.process_parameters || []).map((p: any, idx: number): ProcessRow => ({
          sno: p.sno || String(idx + 1),
          parameter: p.parameter_name || '',
          specification: p.specification || '',
          method: p.method || '',
          machineData: {
            machineNo: p.process_machine_no || '',
            operator: p.process_operator || '',
            date: p.process_date_time?.split(' ')[0] || '',
            time: p.process_date_time?.split(' ')[1] || '',
          },
          firstChange: {
            machineNo: p.change_machine_no || '',
            operator: p.change_operator || '',
            date: p.change_date_time?.split(' ')[0] || '',
            time: p.change_date_time?.split(' ')[1] || '',
          },
          secondChange: {
            machineNo: p.lqa_machine_no || '',
            operator: p.lqa_operator || '',
            date: p.lqa_date_time?.split(' ')[0] || '',
            time: p.lqa_date_time?.split(' ')[1] || '',
          },
          action: p.action || '',
        })),
        inprocessRows: (data.inprocess_parameters || []).map((p: any, idx: number): InprocessRow => ({
          sno: p.sno || String(idx + 1),
          parameter: p.parameter_name || '',
          specification: p.specification || '',
          method: p.method || '',
          readings: p.readings?.length === 10 ? p.readings : Array(10).fill('').map((_,i) => p.readings?.[i] || ''),
        })),
      });

      if (!data.process_parameters?.length) {
        setForm(prev => ({ ...prev, processRows: [newProcess()] }));
      }
      if (!data.inprocess_parameters?.length) {
        setForm(prev => ({ ...prev, inprocessRows: [newInproc()] }));
      }

      setCurrentId(id);
      setStep(1);
    } catch { 
      alert('Could not load report'); 
    }
    finally { setLoading(false); }
  };

  const addProcessRow = () =>
    setForm(p => ({ ...p, processRows: [...p.processRows, newProcess(p.processRows.length + 1)] }));
  const addInprocessRow = () =>
    setForm(p => ({ ...p, inprocessRows: [...p.inprocessRows, newInproc(p.inprocessRows.length + 1)] }));
  const removeProcessRow = (i: number) => setForm(p =>
    p.processRows.length === 1 ? p : { ...p, processRows: p.processRows.filter((_,idx) => idx !== i) });
  const removeInprocessRow = (i: number) => setForm(p =>
    p.inprocessRows.length === 1 ? p : { ...p, inprocessRows: p.inprocessRows.filter((_,idx) => idx !== i) });

  const updateProcessRow = (rowIndex: number, field: keyof ProcessRow, value: any) => {
    setForm(prev => ({
      ...prev,
      processRows: prev.processRows.map((row, i) => 
        i === rowIndex ? { ...row, [field]: value } : row
      )
    }));
  };

  const updateInprocessRow = (rowIndex: number, field: keyof InprocessRow, value: any) => {
    setForm(prev => ({
      ...prev,
      inprocessRows: prev.inprocessRows.map((row, i) => 
        i === rowIndex ? { ...row, [field]: value } : row
      )
    }));
  };

  const updateReading = (rowIndex: number, readingIndex: number, value: string) => {
    setForm(prev => ({
      ...prev,
      inprocessRows: prev.inprocessRows.map((row, i) => 
        i === rowIndex ? {
          ...row,
          readings: row.readings.map((reading, j) => j === readingIndex ? value : reading)
        } : row
      )
    }));
  };

  return (
    <div className=" min-h-screen">
      <div className="p-6">
        {/* Header - Reduced padding */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">IN-PROCESS INSPECTION / SETTING APPROVAL</h1>
                <p className="text-blue-100 text-sm mt-1">Quality control and process management</p>
              </div>
              {step === 0 ? (
                <button
                  onClick={() => { resetForm(); setStep(1); }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Report</span>
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

        {/*  LIST VIEW  */}
        {step === 0 && (
          <>
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reports...</p>
              </div>
            )}
            
            {!loading && reports.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-4 mb-3">
                  <Hash className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-blue-700 mb-2">No Inspection Reports Yet</h2>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Click the <span className="font-semibold text-blue-600">Add Report</span> button to create your first inspection report.
                </p>
              </div>
            )}
            
            {!loading && reports.length > 0 && (
              <div className="grid gap-4">
                {reports.map((r: any) => (
                  <div
                    key={r.id}
                    onClick={() => openReport(r.id)}
                    className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center">
                          <Hash className="w-4 h-4 mr-2" />
                          Report #{r.id} - {r.part_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Edit3 className="w-3 h-3 opacity-70" />
                          <span className="text-xs opacity-80">{r.created_at?.slice(0, 10) || '—'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Part Number</label>
                          <p className="text-base font-semibold text-gray-800">{r.part_number || '—'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Customer</label>
                          <p className="text-base font-semibold text-gray-800">{r.customer || '—'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Operation</label>
                          <p className="text-base font-semibold text-gray-800">{r.operation_name || '—'}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-600">Judgement: </span>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              r.overall_judgement === 'OK'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {r.overall_judgement}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Prepared by: {r.prepared_by || '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* FORM VIEW */}
        {step === 1 && (
          <>
            {/* Part Information Card - Reduced padding */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Part Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="Enter part name"
                        value={form.partName}
                        onChange={(e) => setField('partName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Part Number</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="Enter part number"
                        value={form.partNumber}
                        onChange={(e) => setField('partNumber', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="Enter customer name"
                        value={form.customer}
                        onChange={(e) => setField('customer', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Operation Name/No</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="Enter operation details"
                        value={form.operationName}
                        onChange={(e) => setField('operationName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Setting Data - Reduced padding */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Process Setting Data
                </h2>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <div className="grid gap-3">
                    {form.processRows.map((row, i) => (
                      <div key={`process-${i}`} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xs font-semibold text-gray-700">Parameter #{i + 1}</h3>
                          {form.processRows.length > 1 && (
                            <button 
                              onClick={() => removeProcessRow(i)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-0.5 rounded hover:bg-red-50 transition-all"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">S.No</label>
                            <input 
                              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400" 
                              value={row.sno}
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Parameter</label>
                            <input 
                              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                              value={row.parameter}
                              onChange={(e) => updateProcessRow(i, 'parameter', e.target.value)}
                              placeholder="Enter parameter"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Specification</label>
                            <input 
                              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                              value={row.specification}
                              onChange={(e) => updateProcessRow(i, 'specification', e.target.value)}
                              placeholder="Enter specification"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
                            <input 
                              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                              value={row.method}
                              onChange={(e) => updateProcessRow(i, 'method', e.target.value)}
                              placeholder="Enter method"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          {[
                            { title: 'PROCESS SETTING DATA/(OK)', key: 'machineData' as const },
                            { title: 'DATA AFTER M/C CHANGE', key: 'firstChange' as const },
                            { title: 'DATA AFTER M/C CHANGE/ LQA', key: 'secondChange' as const }
                          ].map(({ title, key }) => {
                            const block = row[key];
                            
                            return (
                              <div key={key} className="bg-white rounded-lg p-2 border border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-700 mb-2 text-center">{title}</h4>
                                
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">M/C No</label>
                                    <input
                                      className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-400"
                                      value={block.machineNo}
                                      onChange={(e) =>
                                        updateProcessRow(i, key, { ...block, machineNo: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Operator</label>
                                    <input
                                      className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-400"
                                      value={block.operator}
                                      onChange={(e) =>
                                        updateProcessRow(i, key, { ...block, operator: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">DATE / TIME</label>
                                    <input
                                      className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-400"
                                      value={`${block.date} ${block.time}`.trim()}
                                      onChange={(e) => {
                                        const [date = '', time = ''] = e.target.value.split(' ');
                                        updateProcessRow(i, key, { ...block, date, time });
                                      }}
                                      placeholder="YYYY-MM-DD HH:MM"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Action</label>
                          <input 
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                            value={row.action}
                            onChange={(e) => updateProcessRow(i, 'action', e.target.value)}
                            placeholder="Enter action taken"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button 
                      onClick={addProcessRow}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                    >
                      + Add Parameter
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-800 text-sm">Overall Judgement</span>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="process-judgement" 
                          value="OK"
                          checked={form.overallJudgement === 'OK'}
                          onChange={(e) => setField('overallJudgement', e.target.value)}
                          className="mr-2 text-green-600" 
                        />
                        <span className="text-green-700 font-medium text-sm">OK</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="process-judgement" 
                          value="NG"
                          checked={form.overallJudgement === 'NG'}
                          onChange={(e) => setField('overallJudgement', e.target.value)}
                          className="mr-2 text-red-600" 
                        />
                        <span className="text-red-700 font-medium text-sm">NG</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* In-Process Data - Reduced padding */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  In-Process Data
                </h2>
              </div>
              <div className="p-4">
                <div className="grid gap-3">
                  {form.inprocessRows.map((row, i) => (
                    <div key={`inprocess-${i}`} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xs font-semibold text-gray-700">Parameter #{i + 1}</h3>
                        {form.inprocessRows.length > 1 && (
                          <button 
                            onClick={() => removeInprocessRow(i)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-0.5 rounded hover:bg-red-50 transition-all"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">S.No</label>
                          <input 
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400" 
                            value={row.sno}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Parameter</label>
                          <input 
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                            value={row.parameter}
                            onChange={(e) => updateInprocessRow(i, 'parameter', e.target.value)}
                            placeholder="Enter parameter"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Specification</label>
                          <input 
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                            value={row.specification}
                            onChange={(e) => updateInprocessRow(i, 'specification', e.target.value)}
                            placeholder="Enter specification"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
                          <input 
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                            value={row.method}
                            onChange={(e) => updateInprocessRow(i, 'method', e.target.value)}
                            placeholder="Enter method"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Readings</label>
                        <div className="grid grid-cols-5 lg:grid-cols-10 gap-1.5">
                          {row.readings.map((reading, j) => (
                            <input 
                              key={j}
                              className="w-full px-1.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-center" 
                              placeholder={`#${j+1}`}
                              value={reading}
                              onChange={(e) => updateReading(i, j, e.target.value)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <button 
                    onClick={addInprocessRow}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                  >
                    + Add Parameter
                  </button>
                </div>
              </div>
            </div>

            {/* Signatures - Reduced padding */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white p-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Approvals
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prepared By</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="Name and signature"
                      value={form.preparedBy}
                      onChange={(e) => setField('preparedBy', e.target.value)}
                    />
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Approved By</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                      placeholder="Name and signature"
                      value={form.approvedBy}
                      onChange={(e) => setField('approvedBy', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button - Reduced size */}
            <div className="flex justify-center mb-6">
              <button
                onClick={save}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4" />
                <span>{loading ? 'Saving...' : currentId ? 'Save Changes' : 'Submit Report'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


