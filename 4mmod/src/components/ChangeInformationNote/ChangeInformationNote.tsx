import React, { useState } from 'react';
import { Bell, FileText, Save, Sparkles } from 'lucide-react';
import FormInput from './FormInput';
import FormRadioGroup from './FormRadioGroup';
import FormSection from './FormSection';

interface PartA {
  partName: string; model: string; partNo: string; customer: 'Inhouse' | 'External';
  issueDate: string; originator: string; man: boolean; machine: boolean;
  material: boolean; method: boolean; tool: boolean; others: string;
  detailsOfChangingPoints: string; originatorSign: string;
}
interface PartB {
  isSupplierRelated: boolean; childPartName: string; supplierName: string;
  changeAcceptance: 'YES' | 'NO' | ''; customerIntimationRequired: 'YES' | 'NO' | '';
  remarksIfAnyByQA: string; qaSignPartB: string;
}
interface Termination {
  terminationDate: string; commentsIfAny: string; qaSignTermination: string;
}
interface ChangeNoteFormState {
  id: number;
  partA: PartA; partB: PartB; termination: Termination;
}
type ActiveFormState = Omit<ChangeNoteFormState, 'id'>;

const initialFormState: ActiveFormState = {
  partA: {
    partName: 'BUMPER ASSY, FR', model: 'MS-A2024', partNo: '71711M64R00',
    customer: 'Inhouse', issueDate: new Date().toISOString().split('T')[0],
    originator: 'Rajesh Sharma', man: true, machine: false, material: true,
    method: false, tool: false, others: 'N/A',
    detailsOfChangingPoints: 'Switching from Grade X to Grade Y Polymer due to supply chain disruption.',
    originatorSign: 'R.Sharma',
  },
  partB: {
    isSupplierRelated: true, childPartName: 'Injection Moulded Clip', supplierName: 'Reliable Plastics Pvt. Ltd.',
    changeAcceptance: '', customerIntimationRequired: '',
    remarksIfAnyByQA: 'Initial review suggests acceptable change. Full PPAP sample required.',
    qaSignPartB: '',
  },
  termination: {
    terminationDate: '', commentsIfAny: '', qaSignTermination: '',
  },
};

const mockSubmittedData: ChangeNoteFormState[] = [
  {
    id: 1,
    partA: { ...initialFormState.partA, partName: 'HEADLAMP ASSY, LH', originator: 'S. Kumar' },
    partB: { ...initialFormState.partB, changeAcceptance: 'YES', qaSignPartB: 'QA-SK' },
    termination: { terminationDate: '2025-10-15', commentsIfAny: 'Completed successfully.', qaSignTermination: 'QA-SK' },
  },
  {
    id: 2,
    partA: { ...initialFormState.partA, partName: 'REAR AXLE BEAM', material: false, machine: true, originator: 'A. Patel' },
    partB: { ...initialFormState.partB, changeAcceptance: 'NO', remarksIfAnyByQA: 'Failure in fatigue test. Reject.', qaSignPartB: 'QA-AP' },
    termination: { terminationDate: '', commentsIfAny: '', qaSignTermination: '' },
  },
];

const ChangeInformationNote: React.FC = () => {
  const [formData, setFormData] = useState<ActiveFormState>({...initialFormState});
  const [submittedNotes, setSubmittedNotes] = useState<ChangeNoteFormState[]>(mockSubmittedData);

  const handleInputChange = (section: keyof ActiveFormState, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      partA: {
        ...prev.partA,
        [name]: checked,
      } as PartA,
    }));
  };

  const handleRadioChange = (name: keyof PartB, value: 'YES' | 'NO') => {
    setFormData((prev) => ({
      ...prev,
      partB: {
        ...prev.partB,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.partB.changeAcceptance === '') {
      alert('Please confirm Change Acceptance (YES/NO) before submitting the note.');
      return;
    }

    const nextId = submittedNotes.length > 0 ? Math.max(...submittedNotes.map(n => n.id)) + 1 : 1;

    const newNote: ChangeNoteFormState = {
        id: nextId,
        ...formData
    };

    setSubmittedNotes((prev) => [newNote, ...prev]);
    setFormData({...initialFormState});

    console.log('New Note Submitted:', newNote);
    alert(`Note ${newNote.id} submitted successfully! The form has been reset.`);
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 p-6">
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 p-6">
      <header className="text-center mb-8 relative">
        {/* <div className="inline-flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
            <Bell className="text-white" size={28} />
          </div>
        </div> */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent tracking-tight mb-2">
          4M CHANGE INFORMATION NOTE
        </h1>
        {/* <p className="text-lg text-slate-600 font-medium mt-2 max-w-3xl mx-auto">
          Record 4M change details in record sheet as per 4M change work instructions.
        </p> */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl -z-10" />
      </header>

      <form onSubmit={handleSubmit} className="max-w-full mx-auto space-y-8">

        <FormSection title="PART - A: CHANGE INITIATION">
          <FormInput label="PART NAME" name="partName" value={formData.partA.partName} onChange={(e) => handleInputChange('partA', e)} />
          <FormInput label="MODEL" name="model" value={formData.partA.model} onChange={(e) => handleInputChange('partA', e)} />
          <FormInput label="PART NO" name="partNo" value={formData.partA.partNo} onChange={(e) => handleInputChange('partA', e)} />
          <div className="flex flex-col p-3 border border-slate-300/60 bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm rounded-lg shadow-sm">
            <label className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">CUSTOMER</label>
            <p className="text-sm font-bold pt-1 text-emerald-700">{formData.partA.customer}</p>
          </div>

          <FormInput label="ISSUE DATE" name="issueDate" type="date" value={formData.partA.issueDate} onChange={(e) => handleInputChange('partA', e)} />
          <FormInput label="ORIGINATOR" name="originator" value={formData.partA.originator} onChange={(e) => handleInputChange('partA', e)} />

          <div className="col-span-4 p-4 border border-slate-300/60 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm rounded-lg shadow-sm">
            <label className="text-xs font-bold text-slate-700 mb-3 uppercase block tracking-wide">CHANGING POINT (Select all that apply)</label>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-2">
              {['MAN', 'MACHINE', 'MATERIAL', 'METHOD', 'TOOL'].map((key) => (
                <label key={key} className="flex items-center space-x-2 group cursor-pointer">
                  <input
                    type="checkbox" name={key.toLowerCase()}
                    checked={formData.partA[key.toLowerCase() as keyof PartA] as boolean}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-6 w-6 text-cyan-600 rounded border-2 border-slate-400 transition-all duration-200 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700 group-hover:text-cyan-600 transition-colors duration-200">{key}</span>
                </label>
              ))}
              <div className="flex-1 min-w-[200px]">
                <FormInput label="OTHERS" name="others" value={formData.partA.others} onChange={(e) => handleInputChange('partA', e)} colSpan="col-span-1" />
              </div>
            </div>
          </div>

          <FormInput label="DETAILS OF CHANGING POINTS (Detailed Description)" name="detailsOfChangingPoints" value={formData.partA.detailsOfChangingPoints} onChange={(e) => handleInputChange('partA', e)} isTextArea colSpan="col-span-4" />

          <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
            <FormInput label="ORIGINATOR SIGN" name="originatorSign" value={formData.partA.originatorSign} onChange={(e) => handleInputChange('partA', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
          </div>
        </FormSection>

        <FormSection title="PART - B: QUALITY FEEDBACK & APPROVAL">

          <div className="col-span-4 p-4 border border-slate-300/60 bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm rounded-lg shadow-sm flex items-center space-x-4">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">IS SUPPLIER RELATED CHANGE?</label>
            <input
              type="checkbox" checked={formData.partB.isSupplierRelated}
              onChange={() => setFormData(prev => ({ ...prev, partB: { ...prev.partB, isSupplierRelated: !prev.partB.isSupplierRelated } }))}
              className="form-checkbox h-6 w-6 text-red-600 rounded border-2 border-slate-400 cursor-pointer"
            />
          </div>

          {formData.partB.isSupplierRelated && (
            <>
              <FormInput label="CHILD PART NAME" name="childPartName" value={formData.partB.childPartName} onChange={(e) => handleInputChange('partB', e)} />
              <FormInput label="SUPPLIER NAME" name="supplierName" value={formData.partB.supplierName} onChange={(e) => handleInputChange('partB', e)} />
              <div className="col-span-2" />
            </>
          )}

          <FormRadioGroup
            label="CHANGE ACCEPTANCE" name="changeAcceptance"
            value={formData.partB.changeAcceptance}
            onChange={(val) => handleRadioChange('changeAcceptance', val)}
          />
          <FormRadioGroup
            label="CUSTOMER INTIMATION REQUIRED (IF CHANGE ACCEPT)" name="customerIntimationRequired"
            value={formData.partB.customerIntimationRequired}
            onChange={(val) => handleRadioChange('customerIntimationRequired', val)}
          />

          <FormInput label="REMARKS IF ANY BY QA:" name="remarksIfAnyByQA" value={formData.partB.remarksIfAnyByQA} onChange={(e) => handleInputChange('partB', e)} isTextArea colSpan="col-span-4" />

          <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
            <FormInput label="QA SIGN (APPROVAL)" name="qaSignPartB" value={formData.partB.qaSignPartB} onChange={(e) => handleInputChange('partB', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
          </div>

        </FormSection>

        <FormSection title="CHANGE TERMINATION (Implemented & Confirmed)">
          <FormInput label="TERMINATION DATE" name="terminationDate" type="date" value={formData.termination.terminationDate} onChange={(e) => handleInputChange('termination', e)} />
          <FormInput label="COMMENTS IF ANY" name="commentsIfAny" value={formData.termination.commentsIfAny} onChange={(e) => handleInputChange('termination', e)} isTextArea colSpan="col-span-3" />

          <div className="col-span-4 p-3 pt-4 flex justify-end items-center">
            <FormInput label="QA SIGN (TERMINATION)" name="qaSignTermination" value={formData.termination.qaSignTermination} onChange={(e) => handleInputChange('termination', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
          </div>
        </FormSection>

        <div className="flex justify-center pb-10">
          <button
            type="submit"
            className="group relative bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 hover:from-emerald-600 hover:via-green-700 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            disabled={formData.partB.changeAcceptance === ''}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-3">
              <Save size={20} />
              Submit Note & Request Quality Approval
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </form>

      <div className="max-w-full mx-auto mt-12 pt-8 border-t-2 border-slate-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="text-white" size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">
            Submitted 4M Change Notes ({submittedNotes.length})
          </h2>
        </div>

        {submittedNotes.length === 0 ? (
          <p className="text-slate-500 italic p-6 bg-white rounded-2xl shadow-md border border-slate-200">No notes submitted yet. Fill out the form above and submit!</p>
        ) : (
          <div className="space-y-4">
            {submittedNotes.map((note) => (
              <div
                key={note.id}
                className={`p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                  ${note.partB.changeAcceptance === 'YES' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500' :
                   note.partB.changeAcceptance === 'NO' ? 'bg-gradient-to-r from-rose-50 to-red-50 border-l-4 border-rose-500' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500'}`
                }
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-lg font-bold text-slate-800">Note ID: {note.id}</span>
                  <span className={`px-4 py-1.5 text-sm font-bold rounded-full shadow-md
                    ${note.partB.changeAcceptance === 'YES' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' :
                      note.partB.changeAcceptance === 'NO' ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'}`
                  }>
                    QA STATUS: {note.partB.changeAcceptance || 'PENDING'}
                  </span>
                </div>
                <p className="text-sm mb-2">
                  <span className="font-bold text-slate-700">Part:</span> {note.partA.partName} ({note.partA.partNo})
                  <span className="ml-4 font-bold text-slate-700">Originator:</span> {note.partA.originator}
                </p>
                <p className="text-sm text-slate-600 truncate bg-white/50 p-2 rounded-lg">
                  <span className="font-bold">Details:</span> {note.partA.detailsOfChangingPoints}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeInformationNote;
