'use client';

import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const toastStyle = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <>
      <style>{toastStyle}</style>
      <div
        className='fixed bottom-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md'
        style={{ animation: 'slideIn 0.3s ease-out' }}
        role='alert'
        aria-live='polite'
        aria-atomic='true'
      >
      <CheckCircle2 className='w-5 h-5' aria-hidden='true' />
      <p className='flex-1 text-sm font-medium'>{message}</p>
      <button
        onClick={onClose}
        className='hover:bg-green-600 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-500'
        aria-label='Fermer la notification'
      >
        <X className='w-4 h-4' aria-hidden='true' />
      </button>
    </div>
    </>
  );
}

