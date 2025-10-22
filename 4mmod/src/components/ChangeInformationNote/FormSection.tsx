import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className="border border-gray-400 rounded-lg shadow-lg mb-6 overflow-hidden">
    <h3 className="bg-blue-600 text-white font-bold text-center py-2 text-lg tracking-wider">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">{children}</div>
  </div>
);

export default FormSection;