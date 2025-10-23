import React from 'react';

interface FormRadioGroupProps {
  label: string;
  name: string;
  value: 'YES' | 'NO' | '';
  onChange: (value: 'YES' | 'NO') => void;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ label, name, value, onChange }) => (
  <div className="flex flex-col p-3 border border-slate-300/60 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
    <label className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">{label}</label>
    <div className="flex justify-start space-x-6 mt-1">
      {['YES', 'NO'].map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option as 'YES' | 'NO')}
            className="form-radio h-5 w-5 text-cyan-600 transition duration-150 ease-in-out cursor-pointer"
          />
          <span className="text-sm font-semibold text-slate-700 group-hover:text-cyan-600 transition-colors duration-200">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export default FormRadioGroup;
