import React, { useState } from 'react';
import FormInput from './FormInput';
import FormRadioGroup from './FormRadioGroup';
import FormSection from './FormSection';

// ... (Interfaces and initialFormState from the section above) ...
// NOTE: Assume FormInput, FormRadioGroup, FormSection are imported

// Interfaces for the form data
interface PartA {
  partName: string;
  model: string;
  partNo: string;
  customer: 'Inhouse' | 'External';
  issueDate: string;
  originator: string;
  // 4M Checklist
  man: boolean;
  machine: boolean;
  material: boolean;
  method: boolean;
  tool: boolean;
  others: string;
  detailsOfChangingPoints: string;
  originatorSign: string;
}

interface PartB {
  // Supplier Related Change
  isSupplierRelated: boolean;
  childPartName: string;
  supplierName: string;
  // Quality Feedback
  changeAcceptance: 'YES' | 'NO' | '';
  customerIntimationRequired: 'YES' | 'NO' | '';
  remarksIfAnyByQA: string;
  qaSignPartB: string;
}

interface Termination {
  terminationDate: string;
  commentsIfAny: string;
  qaSignTermination: string;
}

interface ChangeNoteFormState {
  partA: PartA;
  partB: PartB;
  termination: Termination;
}

// Mock/Initial Data
const initialFormState: ChangeNoteFormState = {
  partA: {
    partName: 'BUMPER ASSY, FR',
    model: 'MS-A2024',
    partNo: '71711M64R00',
    customer: 'Inhouse',
    issueDate: '2025-10-22',
    originator: 'Rajesh Sharma',
    man: true,
    machine: false,
    material: true,
    method: false,
    tool: false,
    others: 'N/A',
    detailsOfChangingPoints: 'Switching from Grade X to Grade Y Polymer due to supply chain disruption. New material has equivalent properties but requires minor machine parameter adjustment.',
    originatorSign: 'R.Sharma',
  },
  partB: {
    isSupplierRelated: true,
    childPartName: 'Injection Moulded Clip',
    supplierName: 'Reliable Plastics Pvt. Ltd.',
    changeAcceptance: '', // Default empty
    customerIntimationRequired: '', // Default empty
    remarksIfAnyByQA: 'Initial review suggests acceptable change. Full PPAP sample required before final approval.',
    qaSignPartB: '',
  },
  termination: {
    terminationDate: '',
    commentsIfAny: '',
    qaSignTermination: '',
  },
};


// === MAIN COMPONENT ===
const ChangeInformationNote: React.FC = () => {
  const [formData, setFormData] = useState<ChangeNoteFormState>(initialFormState);

  const handleInputChange = (section: keyof ChangeNoteFormState, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      },
    }));
  };
  
  const handleRadioChange = (section: 'partB', name: keyof PartB, value: 'YES' | 'NO') => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Change Information Note Submitted/Saved! Check console for data.');
    // In a real application, you'd send formData to an API here.
  };

  // --- RENDERING ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
          4M CHANGE INFORMATION NOTE
        </h1>
        <p className="text-md text-gray-500 font-medium mt-1">
          Record 4M change details in record sheet as per 4M change work instructions.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        
        {/* === PART - A: INITIAL CHANGE INFORMATION === */}
        <FormSection title="PART - A: CHANGE INITIATION">
          {/* Top Row Grid: 4 Columns (Part Name, Model, Part No, Customer) */}
          <FormInput
            label="PART NAME"
            name="partName"
            value={formData.partA.partName}
            onChange={(e) => handleInputChange('partA', e)}
          />
          <FormInput
            label="MODEL"
            name="model"
            value={formData.partA.model}
            onChange={(e) => handleInputChange('partA', e)}
          />
          <FormInput
            label="PART NO"
            name="partNo"
            value={formData.partA.partNo}
            onChange={(e) => handleInputChange('partA', e)}
          />
          <div className="flex flex-col p-2 border border-gray-200 bg-white/70">
            <label className="text-xs font-semibold text-gray-600 mb-1 uppercase">CUSTOMER</label>
            <p className="text-sm font-bold pt-1 text-green-700">{formData.partA.customer}</p>
          </div>
          
          {/* Issue Date & Originator */}
          <FormInput
            label="ISSUE DATE"
            name="issueDate"
            type="date"
            value={formData.partA.issueDate}
            onChange={(e) => handleInputChange('partA', e)}
          />
          <FormInput
            label="ORIGINATOR"
            name="originator"
            value={formData.partA.originator}
            onChange={(e) => handleInputChange('partA', e)}
          />

          {/* 4M Checklist */}
          <div className="col-span-4 p-2 border border-gray-200 bg-white/70">
            <label className="text-xs font-semibold text-gray-600 mb-1 uppercase block">
              CHANGING POINT (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
              {['MAN', 'MACHINE', 'MATERIAL', 'METHOD', 'TOOL'].map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={key.toLowerCase()}
                    checked={formData.partA[key.toLowerCase() as keyof PartA] as boolean}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="font-medium">{key}</span>
                </label>
              ))}
              <div className="flex-1 min-w-[200px]">
                <FormInput
                  label="OTHERS"
                  name="others"
                  value={formData.partA.others}
                  onChange={(e) => handleInputChange('partA', e)}
                  colSpan="col-span-1" // Override colSpan for internal use
                />
              </div>
            </div>
          </div>
          
          {/* Details of Changing Points (Full Width) */}
          <FormInput
            label="DETAILS OF CHANGING POINTS (Detailed Description)"
            name="detailsOfChangingPoints"
            value={formData.partA.detailsOfChangingPoints}
            onChange={(e) => handleInputChange('partA', e)}
            isTextArea
            colSpan="col-span-4"
          />

          {/* Originator Sign */}
          <div className="col-span-4 p-2 pt-4 flex justify-end items-center">
            <FormInput
              label="ORIGINATOR SIGN"
              name="originatorSign"
              value={formData.partA.originatorSign}
              onChange={(e) => handleInputChange('partA', e)}
              colSpan="lg:col-span-1 md:col-span-2 col-span-4"
            />
          </div>
        </FormSection>

        {/* === PART - B: QUALITY FEEDBACK & APPROVAL === */}
        <FormSection title="PART - B: QUALITY FEEDBACK & APPROVAL">
          
          {/* Supplier Related Checkbox (Custom Grid for this section) */}
          <div className="col-span-4 p-2 border border-gray-200 bg-white/70 flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700 uppercase">
              IS SUPPLIER RELATED CHANGE?
            </label>
            <input
              type="checkbox"
              checked={formData.partB.isSupplierRelated}
              onChange={() => setFormData(prev => ({ 
                ...prev, 
                partB: { 
                  ...prev.partB, 
                  isSupplierRelated: !prev.partB.isSupplierRelated 
                } 
              }))}
              className="form-checkbox h-5 w-5 text-red-600 rounded"
            />
          </div>

          {/* Supplier Info (Conditional Display) */}
          {formData.partB.isSupplierRelated && (
            <>
              <FormInput
                label="CHILD PART NAME"
                name="childPartName"
                value={formData.partB.childPartName}
                onChange={(e) => handleInputChange('partB', e)}
              />
              <FormInput
                label="SUPPLIER NAME"
                name="supplierName"
                value={formData.partB.supplierName}
                onChange={(e) => handleInputChange('partB', e)}
              />
              <div className="col-span-2" /> {/* Spacer */}
            </>
          )}

          {/* Acceptance and Intimation */}
          <FormRadioGroup
            label="CHANGE ACCEPTANCE"
            name="changeAcceptance"
            value={formData.partB.changeAcceptance}
            onChange={(val) => handleRadioChange('partB', 'changeAcceptance', val)}
          />
          <FormRadioGroup
            label="CUSTOMER INTIMATION REQUIRED (IF CHANGE ACCEPT)"
            name="customerIntimationRequired"
            value={formData.partB.customerIntimationRequired}
            onChange={(val) => handleRadioChange('partB', 'customerIntimationRequired', val)}
          />

          {/* QA Remarks */}
          <FormInput
            label="REMARKS IF ANY BY QA:"
            name="remarksIfAnyByQA"
            value={formData.partB.remarksIfAnyByQA}
            onChange={(e) => handleInputChange('partB', e)}
            isTextArea
            colSpan="col-span-4"
          />

          {/* QA Sign Part B */}
          <div className="col-span-4 p-2 pt-4 flex justify-end items-center">
            <FormInput
              label="QA SIGN (APPROVAL)"
              name="qaSignPartB"
              value={formData.partB.qaSignPartB}
              onChange={(e) => handleInputChange('partB', e)}
              colSpan="lg:col-span-1 md:col-span-2 col-span-4"
            />
          </div>

        </FormSection>

        {/* === CHANGE TERMINATION === */}
        <FormSection title="CHANGE TERMINATION (Implemented & Confirmed)">
          <FormInput
            label="TERMINATION DATE"
            name="terminationDate"
            type="date"
            value={formData.termination.terminationDate}
            onChange={(e) => handleInputChange('termination', e)}
          />
          
          <FormInput
            label="COMMENTS IF ANY"
            name="commentsIfAny"
            value={formData.termination.commentsIfAny}
            onChange={(e) => handleInputChange('termination', e)}
            isTextArea
            colSpan="col-span-3"
          />
          
          {/* QA Sign Termination */}
          <div className="col-span-4 p-2 pt-4 flex justify-end items-center">
            <FormInput
              label="QA SIGN (TERMINATION)"
              name="qaSignTermination"
              value={formData.termination.qaSignTermination}
              onChange={(e) => handleInputChange('termination', e)}
              colSpan="lg:col-span-1 md:col-span-2 col-span-4"
            />
          </div>

        </FormSection>

        {/* === SUBMIT BUTTON === */}
        <div className="flex justify-center pb-10">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-12 rounded-full shadow-xl transition duration-300 transform hover:scale-105 disabled:opacity-50"
            disabled={formData.partB.changeAcceptance === ''} // Example validation
          >
            Submit Note & Request Quality Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeInformationNote;