import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  colSpan?: string;
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
  <div className={`flex flex-col p-3 border border-slate-300/60 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${colSpan}`}>
    <label className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">{label}</label>
    {isTextArea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full text-sm font-medium border-b-2 border-slate-300 focus:outline-none focus:border-cyan-500 bg-transparent px-1 py-2 transition-colors duration-200 resize-none"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full text-sm font-medium border-b-2 border-slate-300 focus:outline-none focus:border-cyan-500 bg-transparent px-1 py-2 transition-colors duration-200"
      />
    )}
  </div>
);

export default FormInput;
