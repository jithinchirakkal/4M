import React, { useState } from 'react';
import FormInput from './FormInput';
import FormRadioGroup from './FormRadioGroup';
import FormSection from './FormSection';

// --- INTERFACES ---
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
// Defines the structure of a single submitted note (including an ID)
interface ChangeNoteFormState {
  id: number;
  partA: PartA; partB: PartB; termination: Termination;
}
// Defines the structure of the active form state (without an ID yet)
type ActiveFormState = Omit<ChangeNoteFormState, 'id'>;

// --- MOCK/INITIAL DATA ---
const initialFormState: ActiveFormState = {
  partA: {
    partName: 'BUMPER ASSY, FR', model: 'MS-A2024', partNo: '71711M64R00',
    customer: 'Inhouse', issueDate: new Date().toISOString().split('T')[0], // Current date
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

// --- MOCK SUBMITTED LIST DATA for initial load demo
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


// === MAIN COMPONENT ===
const ChangeInformationNote: React.FC = () => {
  // Current form data state (ActiveFormState without ID)
  const [formData, setFormData] = useState<ActiveFormState>({...initialFormState});

  // Submitted list state (Array of ChangeNoteFormState with IDs)
  const [submittedNotes, setSubmittedNotes] = useState<ChangeNoteFormState[]>(mockSubmittedData);

  // General input handler for PartA, PartB, Termination sections
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

  // Checkbox handler specifically for 4M flags in PartA
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      partA: {
        ...prev.partA,
        [name]: checked,
      } as PartA, // Type assertion ensures TypeScript knows the PartA properties are being updated
    }));
  };
  
  // Radio handler specifically for YES/NO options in PartB
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

    // 1. Basic Validation: Ensure QA Acceptance is set before submission
    if (formData.partB.changeAcceptance === '') {
      alert('Please confirm Change Acceptance (YES/NO) before submitting the note.');
      return;
    }
    
    // 2. Determine the next unique ID
    const nextId = submittedNotes.length > 0 ? Math.max(...submittedNotes.map(n => n.id)) + 1 : 1;
    
    // 3. Create the new submitted note
    const newNote: ChangeNoteFormState = {
        id: nextId,
        ...formData
    };

    // 4. Add to the submitted list (at the front) and reset the form
    setSubmittedNotes((prev) => [newNote, ...prev]);
    setFormData({...initialFormState});

    console.log('New Note Submitted:', newNote);
    // You would typically send this 'newNote' object to your backend API here.
    alert(`Note ${newNote.id} submitted successfully! The form has been reset.`);
  };

  // --- RENDERING ---
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
          4M CHANGE INFORMATION NOTE
        </h1>
        <p className="text-md text-gray-500 font-medium mt-1">
          Record 4M change details in record sheet as per 4M change work instructions.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-full mx-auto space-y-8">
        
        {/* === PART - A: INITIAL CHANGE INFORMATION === */}
        <FormSection title="PART - A: CHANGE INITIATION">
          <FormInput label="PART NAME" name="partName" value={formData.partA.partName} onChange={(e) => handleInputChange('partA', e)} />
          <FormInput label="MODEL" name="model" value={formData.partA.model} onChange={(e) => handleInputChange('partA', e)} />
          <FormInput label="PART NO" name="partNo" value={formData.partA.partNo} onChange={(e) => handleInputChange('partA', e)} />
          <div className="flex flex-col p-2 border border-gray-200 bg-white/70">
            <label className="text-xs font-semibold text-gray-600 mb-1 uppercase">CUSTOMER</label>
            <p className="text-sm font-bold pt-1 text-green-700">{formData.partA.customer}</p>
          </div>
          
          <FormInput label="ISSUE DATE" name="issueDate" type="date" value={formData.partA.issueDate} onChange={(e) => handleInputChange('partA', e)} />
          <FormInput label="ORIGINATOR" name="originator" value={formData.partA.originator} onChange={(e) => handleInputChange('partA', e)} />

          {/* 4M Checklist */}
          <div className="col-span-4 p-2 border border-gray-200 bg-white/70">
            <label className="text-xs font-semibold text-gray-600 mb-1 uppercase block">CHANGING POINT (Select all that apply)</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
              {['MAN', 'MACHINE', 'MATERIAL', 'METHOD', 'TOOL'].map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox" name={key.toLowerCase()}
                    checked={formData.partA[key.toLowerCase() as keyof PartA] as boolean}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="font-medium">{key}</span>
                </label>
              ))}
              <div className="flex-1 min-w-[200px]">
                <FormInput label="OTHERS" name="others" value={formData.partA.others} onChange={(e) => handleInputChange('partA', e)} colSpan="col-span-1" />
              </div>
            </div>
          </div>
          
          <FormInput label="DETAILS OF CHANGING POINTS (Detailed Description)" name="detailsOfChangingPoints" value={formData.partA.detailsOfChangingPoints} onChange={(e) => handleInputChange('partA', e)} isTextArea colSpan="col-span-4" />

          <div className="col-span-4 p-2 pt-4 flex justify-end items-center">
            <FormInput label="ORIGINATOR SIGN" name="originatorSign" value={formData.partA.originatorSign} onChange={(e) => handleInputChange('partA', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
          </div>
        </FormSection>

        {/* === PART - B: QUALITY FEEDBACK & APPROVAL === */}
        <FormSection title="PART - B: QUALITY FEEDBACK & APPROVAL">
          
          <div className="col-span-4 p-2 border border-gray-200 bg-white/70 flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700 uppercase">IS SUPPLIER RELATED CHANGE?</label>
            <input
              type="checkbox" checked={formData.partB.isSupplierRelated}
              onChange={() => setFormData(prev => ({ ...prev, partB: { ...prev.partB, isSupplierRelated: !prev.partB.isSupplierRelated } }))}
              className="form-checkbox h-5 w-5 text-red-600 rounded"
            />
          </div>

          {/* Supplier Info (Conditional Display) */}
          {formData.partB.isSupplierRelated && (
            <>
              <FormInput label="CHILD PART NAME" name="childPartName" value={formData.partB.childPartName} onChange={(e) => handleInputChange('partB', e)} />
              <FormInput label="SUPPLIER NAME" name="supplierName" value={formData.partB.supplierName} onChange={(e) => handleInputChange('partB', e)} />
              <div className="col-span-2" />
            </>
          )}

          {/* Acceptance and Intimation */}
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

          <div className="col-span-4 p-2 pt-4 flex justify-end items-center">
            <FormInput label="QA SIGN (APPROVAL)" name="qaSignPartB" value={formData.partB.qaSignPartB} onChange={(e) => handleInputChange('partB', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
          </div>

        </FormSection>

        {/* === CHANGE TERMINATION === */}
        <FormSection title="CHANGE TERMINATION (Implemented & Confirmed)">
          <FormInput label="TERMINATION DATE" name="terminationDate" type="date" value={formData.termination.terminationDate} onChange={(e) => handleInputChange('termination', e)} />
          <FormInput label="COMMENTS IF ANY" name="commentsIfAny" value={formData.termination.commentsIfAny} onChange={(e) => handleInputChange('termination', e)} isTextArea colSpan="col-span-3" />
          
          <div className="col-span-4 p-2 pt-4 flex justify-end items-center">
            <FormInput label="QA SIGN (TERMINATION)" name="qaSignTermination" value={formData.termination.qaSignTermination} onChange={(e) => handleInputChange('termination', e)} colSpan="lg:col-span-1 md:col-span-2 col-span-4" />
          </div>
        </FormSection>

        {/* === SUBMIT BUTTON === */}
        <div className="flex justify-center pb-10">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-12 rounded-full shadow-xl transition duration-300 transform hover:scale-105 disabled:opacity-50"
            disabled={formData.partB.changeAcceptance === ''}
          >
            Submit Note & Request Quality Approval
          </button>
        </div>
      </form>

      {/* -------------------------------------------------------------------------- */}
      {/* 🚀 SUBMITTED NOTES LIST (DEMO) */}
      {/* -------------------------------------------------------------------------- */}
      <div className="max-w-full mx-auto mt-12 pt-8 border-t border-gray-300">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-l-4 border-blue-600 pl-3">
          Submitted 4M Change Notes ({submittedNotes.length})
        </h2>

        {submittedNotes.length === 0 ? (
          <p className="text-gray-500 italic p-4 bg-white rounded-lg shadow-md">No notes submitted yet. Fill out the form above and submit!</p>
        ) : (
          <div className="space-y-4">
            {submittedNotes.map((note) => (
              <div 
                key={note.id} 
                className={`p-4 rounded-xl shadow-lg transition duration-300 
                  ${note.partB.changeAcceptance === 'YES' ? 'bg-green-50 border-l-4 border-green-500' : 
                   note.partB.changeAcceptance === 'NO' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-white border-l-4 border-yellow-500'}`
                }
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-bold text-blue-800">Note ID: {note.id}</span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                    ${note.partB.changeAcceptance === 'YES' ? 'bg-green-200 text-green-800' : 
                      note.partB.changeAcceptance === 'NO' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`
                  }>
                    QA STATUS: {note.partB.changeAcceptance || 'PENDING'}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold">Part:</span> {note.partA.partName} ({note.partA.partNo})
                  <span className="ml-4 font-semibold">Originator:</span> {note.partA.originator}
                </p>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  <span className="font-semibold">Details:</span> {note.partA.detailsOfChangingPoints}
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