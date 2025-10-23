import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className="border-2 border-slate-300/70 rounded-2xl shadow-xl mb-8 overflow-hidden backdrop-blur-sm bg-white/50 hover:shadow-2xl transition-all duration-300">
    <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-white font-bold text-center py-4 text-lg tracking-wider shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <h3 className="relative z-10">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">{children}</div>
  </div>
);

export default FormSection;
