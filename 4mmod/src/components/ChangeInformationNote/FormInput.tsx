import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  colSpan?: string; // e.g., 'col-span-1', 'col-span-2'
  type?: 'text' | 'date' | 'number';
  isTextArea?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  colSpan = 'col-span-1',
  type = 'text',
  isTextArea = false,
}) => (
  <div className={`flex flex-col p-2 border border-gray-200 bg-white/70 ${colSpan}`}>
    <label className="text-xs font-semibold text-gray-600 mb-1 uppercase">{label}</label>
    {isTextArea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full text-sm font-medium border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full text-sm font-medium border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
      />
    )}
  </div>
);

export default FormInput;