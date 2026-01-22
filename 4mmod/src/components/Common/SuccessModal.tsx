// src/components/Common/SuccessModal.tsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: React.ReactNode; // ReactNode allows bold text or spans inside
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Success!", 
  message, 
  buttonText = "Continue" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Animated Icon Circle */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50/50">
          <CheckCircle2 className="w-10 h-10 text-green-600 drop-shadow-sm" />
        </div>

        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {title}
        </h3>
        
        <div className="text-gray-500 mb-8 text-sm leading-relaxed">
          {message}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0 focus:ring-4 focus:ring-green-100 outline-none"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;