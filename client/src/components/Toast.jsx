import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center space-x-3 px-5 py-4 rounded-card shadow-xl border ${
        type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
        type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        'bg-blue-50 border-blue-200 text-blue-800'
      }`}>
        <CheckCircle size={20} className={type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500'} />
        <span className="font-semibold text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
