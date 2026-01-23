import React, { useState, useEffect } from 'react';
import { 
  Save, RotateCcw, Unlock, ArrowLeft, Loader2, AlertCircle, 
  FileText, Calendar, User, CheckCircle, Clock, 
  Briefcase, Activity, MessageSquare 
} from 'lucide-react';
import api from '../../services/api';
import SuccessModal from '../Common/SuccessModal';

// --- TYPES ---
interface CommentRow {
  id: number;
  chassisNo: string;
  comment: string;
  sign: string;
}

interface FormData {
  date: string;
  reason: string;
  partNo: string;
  partName: string;
  vendor: string;
  model: string;
  quantity: string;
  modificationDetails: string;
  preparedBy: string;
  approvedBy: string;
  department1: string;
  inspectionItem1: string;
  department2: string;
  inspectionItem2: string;
  inspDate: string;
  feedingDate: string;
  feedingTime: string;
  personIncharge: string;
  secMgr: string;
  personInchargeProd: string;
  comments: CommentRow[];
}

interface SheetProps {
  onBack?: () => void;
  embedded?: boolean;
}

// --- UI COMPONENTS (Defined Outside) ---
const SectionHeader = ({ title, icon: Icon, color = "indigo" }: { title: string, icon?: any, color?: string }) => (
  <div className={`flex items-center gap-2 mb-6 pb-3 border-b border-gray-100`}>
    <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
      {Icon && <Icon className="w-5 h-5" />}
    </div>
    <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">{title}</h3>
  </div>
);

const InputField = ({ label, value, field, onChange, disabled, type = "text", placeholder = "", required = false }: any) => (
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none
        ${disabled 
          ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-300'
        }`}
      placeholder={placeholder}
    />
  </div>
);

export default function CustomerApprovalSheet({ onBack, embedded = false }: SheetProps) {
  // --- LOGIC STATE ---
  const [isSaving, setIsSaving] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasContextError, setHasContextError] = useState(false);
  const [sheetEntryId, setSheetEntryId] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- DATA STATE ---
  const [formData, setFormData] = useState<FormData>({
    date: '', reason: '', partNo: '', partName: '', vendor: '', model: '', quantity: '',
    modificationDetails: '', preparedBy: '', approvedBy: '',
    department1: '', inspectionItem1: '', department2: '', inspectionItem2: '',
    inspDate: '', feedingDate: '', feedingTime: '', personIncharge: '', secMgr: '', personInchargeProd: '',
    comments: [
      { id: 1, chassisNo: '', comment: '', sign: '' },
      { id: 2, chassisNo: '', comment: '', sign: '' },
      { id: 3, chassisNo: '', comment: '', sign: '' },
      { id: 4, chassisNo: '', comment: '', sign: '' }
    ]
  });

  // --- 1. LOAD & AUTOFILL ---
  useEffect(() => {
    const loadData = async () => {
      const storedRecord = localStorage.getItem("setup_sheet_record");
      if (!storedRecord) {
          setHasContextError(true);
          return;
      }
      const parsedRecord = JSON.parse(storedRecord);
      setRecord(parsedRecord);
      
      const today = new Date().toISOString().split('T')[0];
      const defaultState = {
          date: today,
          model: parsedRecord.model || '',
          partName: parsedRecord.part_name || parsedRecord.category_details?.description || '', 
          partNo: parsedRecord.part_number || '',
          vendor: 'KRISHNA MARUTI LTD.',
          quantity: '1',
          inspDate: today,
          feedingDate: today,
      };

      setFormData(prev => ({ ...prev, ...defaultState }));

      try {
        const response = await api.get(`customer-approval-sheets/?change_request=${parsedRecord.id}`);
        const existingSheet = response.data[0];
        
        if (existingSheet) {
            setSheetEntryId(existingSheet.id);
            setReadOnly(true);
            setFormData(prev => ({
                ...prev,
                date: existingSheet.date || prev.date,
                reason: existingSheet.reason_for_fpp || '',
                partNo: existingSheet.part_no || prev.partNo,
                partName: existingSheet.part_name || prev.partName,
                vendor: existingSheet.vendor_name || prev.vendor,
                model: existingSheet.model_name || prev.model,
                quantity: existingSheet.quantity || prev.quantity,
                modificationDetails: existingSheet.modification_details || '',
                preparedBy: existingSheet.prepared_by_sign || '',
                approvedBy: existingSheet.approved_by_sign || '',
                department1: existingSheet.inspection_data?.dept1 || '',
                inspectionItem1: existingSheet.inspection_data?.item1 || '',
                department2: existingSheet.inspection_data?.dept2 || '',
                inspectionItem2: existingSheet.inspection_data?.item2 || '',
                inspDate: existingSheet.insp_date || '',
                feedingDate: existingSheet.feeding_date || '',
                feedingTime: existingSheet.feeding_time || '',
                personIncharge: existingSheet.person_incharge || '',
                secMgr: existingSheet.sec_mgr || '',
                personInchargeProd: existingSheet.person_incharge_prod || '',
                comments: existingSheet.comments_data?.length > 0 ? existingSheet.comments_data : prev.comments
            }));
        } else {
            setReadOnly(false);
            setIsEditing(true); 
        }
      } catch (err) {
        console.warn("Could not fetch sheet, defaulting to new.");
        setReadOnly(false);
        setIsEditing(true);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const isDisabled = readOnly && !isEditing;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCommentChange = (id: number, field: keyof CommentRow, value: string) => {
    setFormData(prev => ({
      ...prev,
      comments: prev.comments.map(row => row.id === id ? { ...row, [field]: value } : row)
    }));
  };

  const resetForm = () => {
    if (readOnly && !isEditing) return;
    setFormData(prev => ({
        ...prev,
        reason: '', modificationDetails: '', preparedBy: '', approvedBy: '',
        department1: '', inspectionItem1: '', department2: '', inspectionItem2: '',
        personIncharge: '', secMgr: '', personInchargeProd: '',
        comments: [
            { id: 1, chassisNo: '', comment: '', sign: '' },
            { id: 2, chassisNo: '', comment: '', sign: '' },
            { id: 3, chassisNo: '', comment: '', sign: '' },
            { id: 4, chassisNo: '', comment: '', sign: '' }
        ]
    }));
  };

  const handleSave = async () => {
    if (!record?.id) return;
    setIsSaving(true);

    const payload = {
        change_request: record.id,
        date: formData.date || null,
        reason_for_fpp: formData.reason,
        part_no: formData.partNo,
        part_name: formData.partName,
        vendor_name: formData.vendor,
        model_name: formData.model,
        quantity: formData.quantity,
        modification_details: formData.modificationDetails,
        prepared_by_sign: formData.preparedBy,
        approved_by_sign: formData.approvedBy,
        inspection_data: { 
            dept1: formData.department1, item1: formData.inspectionItem1,
            dept2: formData.department2, item2: formData.inspectionItem2
        },
        insp_date: formData.inspDate || null,
        feeding_date: formData.feedingDate || null,
        feeding_time: formData.feedingTime || null,
        person_incharge: formData.personIncharge,
        sec_mgr: formData.secMgr,
        person_incharge_prod: formData.personInchargeProd,
        comments_data: formData.comments
    };

    try {
        if (sheetEntryId) {
            await api.patch(`customer-approval-sheets/${sheetEntryId}/`, payload);
        } else {
            const response = await api.post('customer-approval-sheets/', payload);
            setSheetEntryId(response.data.id);
        }
        
        const updatedRecord = { ...record, is_setup_sheet_filled: true };
        localStorage.setItem("setup_sheet_record", JSON.stringify(updatedRecord));
        
        setIsEditing(false);
        setReadOnly(true);
        setShowSuccessModal(true); // ✅ Show modal on success
    } catch (error: any) {
        console.error("Save Error:", error);
        alert("Failed to save. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };

  if (hasContextError) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-red-100 max-w-lg text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                  <p className="text-gray-500 mb-6">Please select a Change Request from the dashboard.</p>
                  <button onClick={onBack} className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold w-full">Back</button>
              </div>
          </div>
      );
  }

  if (!record) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  return (
    <div className={`min-h-screen bg-gray-50 ${embedded ? 'p-0' : 'p-6'} font-sans`}>
      <div className={`mx-auto ${embedded ? 'w-full' : 'max-w-6xl'}`}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
                {!embedded && (
                    <button onClick={onBack} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Approval</h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">FPP TAG</span>
                        <span className="text-sm text-gray-500 font-medium">First Production Part Approval</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {sheetEntryId ? (
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> SAVED
                    </span>
                ) : (
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-100 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> DRAFT
                    </span>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* 1. Basic Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Part Information" icon={Briefcase} color="blue" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <InputField label="Date" field="date" type="date" value={formData.date} onChange={handleInputChange} disabled={isDisabled} />
                        <InputField label="Model" field="model" value={formData.model} onChange={handleInputChange} disabled={isDisabled} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <InputField label="Part Name" field="partName" value={formData.partName} onChange={handleInputChange} disabled={isDisabled} />
                        <InputField label="Part Number" field="partNo" value={formData.partNo} onChange={handleInputChange} disabled={isDisabled} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Vendor Name" field="vendor" value={formData.vendor} onChange={handleInputChange} disabled={isDisabled} />
                        <InputField label="Quantity" field="quantity" value={formData.quantity} type="number" onChange={handleInputChange} disabled={isDisabled} />
                    </div>
                </div>

                {/* 2. Technical Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Technical Modifications" icon={FileText} color="indigo" />
                    <textarea 
                        disabled={isDisabled}
                        value={formData.modificationDetails}
                        onChange={(e) => handleInputChange('modificationDetails', e.target.value)}
                        className={`w-full h-32 p-4 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all
                            ${isDisabled ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'}`}
                        placeholder="Describe the modification details here..."
                    />
                </div>

                {/* 3. Inspection & Routing */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Inspection & Routing" icon={Activity} color="purple" />
                    
                    {/* Inspection Items */}
                    <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 mb-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Inspection Checklist</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1">DEPT 1</label>
                                    <input disabled={isDisabled} value={formData.department1} onChange={(e) => handleInputChange('department1', e.target.value)} placeholder="e.g. QA" className="w-full text-sm p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100" />
                                </div>
                                <div className="col-span-8">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1">INSPECTION ITEM 1</label>
                                    <input disabled={isDisabled} value={formData.inspectionItem1} onChange={(e) => handleInputChange('inspectionItem1', e.target.value)} placeholder="Parameter to check..." className="w-full text-sm p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100" />
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1">DEPT 2</label>
                                    <input disabled={isDisabled} value={formData.department2} onChange={(e) => handleInputChange('department2', e.target.value)} placeholder="e.g. Prod" className="w-full text-sm p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100" />
                                </div>
                                <div className="col-span-8">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1">INSPECTION ITEM 2</label>
                                    <input disabled={isDisabled} value={formData.inspectionItem2} onChange={(e) => handleInputChange('inspectionItem2', e.target.value)} placeholder="Parameter to check..." className="w-full text-sm p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Routing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Feeding Date & Time</label>
                            <div className="flex gap-2">
                                <input type="date" disabled={isDisabled} value={formData.feedingDate} onChange={(e) => handleInputChange('feedingDate', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-50" />
                                <input type="time" disabled={isDisabled} value={formData.feedingTime} onChange={(e) => handleInputChange('feedingTime', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-50" />
                            </div>
                        </div>
                        <InputField label="Inspection Date" field="inspDate" type="date" value={formData.inspDate} onChange={handleInputChange} disabled={isDisabled} />
                    </div>
                </div>

                {/* 4. Comments Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                    <SectionHeader title="Chassis Comments" icon={MessageSquare} color="emerald" />
                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 w-1/4">Chassis / Engine No</th>
                                    <th className="px-4 py-3 w-1/2">Comments</th>
                                    <th className="px-4 py-3 text-center">Signature</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {formData.comments.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-2">
                                            <input 
                                                disabled={isDisabled}
                                                value={row.chassisNo}
                                                onChange={(e) => handleCommentChange(row.id, 'chassisNo', e.target.value)}
                                                className="w-full p-2 bg-transparent rounded border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-300 outline-none transition-all disabled:text-gray-500"
                                                placeholder="Enter No."
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input 
                                                disabled={isDisabled}
                                                value={row.comment}
                                                onChange={(e) => handleCommentChange(row.id, 'comment', e.target.value)}
                                                className="w-full p-2 bg-transparent rounded border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-300 outline-none transition-all disabled:text-gray-500"
                                                placeholder="Enter observation..."
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input 
                                                disabled={isDisabled}
                                                value={row.sign}
                                                onChange={(e) => handleCommentChange(row.id, 'sign', e.target.value)}
                                                className="w-full p-2 bg-transparent text-center rounded border border-transparent hover:border-gray-200 focus:bg-white focus:border-emerald-300 outline-none transition-all disabled:text-gray-500"
                                                placeholder="Sign"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Reason Selection */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Reason for FPP" icon={CheckCircle} color="amber" />
                    <div className="space-y-3">
                        {[
                            { val: "1", label: "New Source" },
                            { val: "2", label: "Design/Material Change" },
                            { val: "3", label: "Process Change" },
                            { val: "4", label: "Subvendor Change" },
                            { val: "5", label: "Other" }
                        ].map((opt) => (
                            <label 
                                key={opt.val} 
                                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all
                                ${formData.reason === opt.val 
                                    ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm' 
                                    : 'border-gray-100 hover:bg-gray-50 text-gray-600'}`}
                            >
                                <input 
                                    type="radio"
                                    name="reason"
                                    disabled={isDisabled}
                                    checked={formData.reason === opt.val}
                                    onChange={() => handleInputChange('reason', opt.val)}
                                    className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                                />
                                <span className="ml-3 text-sm font-medium">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Signatures */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Approvals" icon={User} color="teal" />
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Prepared By</label>
                            <input 
                                disabled={isDisabled}
                                value={formData.preparedBy}
                                onChange={(e) => handleInputChange('preparedBy', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 font-medium focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                placeholder="Sign here"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Approved By</label>
                            <input 
                                disabled={isDisabled}
                                value={formData.approvedBy}
                                onChange={(e) => handleInputChange('approvedBy', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 font-medium focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-400"
                                placeholder="Sign here"
                            />
                        </div>
                    </div>
                </div>

                {/* Routing Staff */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Routing Staff" icon={User} color="rose" />
                    <div className="space-y-4">
                        <InputField label="Person Incharge" field="personIncharge" value={formData.personIncharge} onChange={handleInputChange} disabled={isDisabled} />
                        <InputField label="Section Manager" field="secMgr" value={formData.secMgr} onChange={handleInputChange} disabled={isDisabled} />
                        <InputField label="Prod Incharge" field="personInchargeProd" value={formData.personInchargeProd} onChange={handleInputChange} disabled={isDisabled} />
                    </div>
                </div>
            </div>
        </div>

        {/* ACTIONS BAR */}
        {!embedded && (
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 font-medium pl-2"></div>
                <div className="flex gap-3 w-full md:w-auto">
                    {(!readOnly || isEditing) && (
                        <button onClick={resetForm} disabled={isSaving} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    )}
                    {readOnly && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-lg hover:bg-amber-600 shadow-sm text-sm font-bold transition-all">
                            <Unlock className="w-4 h-4" /> Edit
                        </button>
                    )}
                    {(!readOnly || isEditing) && (
                        <button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg font-bold text-sm transition-all">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Sheet
                        </button>
                    )}
                </div>
            </div>
        )}

        {/* ✅ Success Modal Integration */}
        <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
                setShowSuccessModal(false);
                if (onBack) onBack(); // ✅ Navigate back on close
            }}
            title="Success"
            buttonText="OK"
            message={
                <span>
                    The <span className="font-bold text-gray-800">Customer Approval Sheet</span> has been successfully saved.
                </span>
            }
        />
      </div>
    </div>
  );
}