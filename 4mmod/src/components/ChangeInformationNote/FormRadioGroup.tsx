import React from 'react';

interface FormRadioGroupProps {
  label: string;
  name: string;
  value: 'YES' | 'NO' | '';
  onChange: (value: 'YES' | 'NO') => void;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ label, name, value, onChange }) => (
  <div className="flex flex-col p-2 border border-gray-200 bg-white/70">
    <label className="text-xs font-semibold text-gray-600 mb-1 uppercase">{label}</label>
    <div className="flex justify-start space-x-4 mt-1">
      {['YES', 'NO'].map((option) => (
        <label key={option} className="flex items-center space-x-1 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option as 'YES' | 'NO')}
            className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <span className="text-sm font-medium">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export default FormRadioGroup;