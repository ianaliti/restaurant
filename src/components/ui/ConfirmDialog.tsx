'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
  error?: string | null;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  error = null,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getButtonColor = () => {
    if (variant === 'danger') return 'bg-red-500 hover:bg-red-600 focus:ring-red-400';
    if (variant === 'warning') return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400';
    return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400';
  };

  return (
    <div
      className='fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex items-center justify-center z-50'
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-title'
      aria-describedby='confirm-description'
    >
      <div className='bg-white rounded p-6 max-w-md w-11/12 shadow-2xl'>
        <h3 id='confirm-title' className='text-xl font-bold mb-3'>{title}</h3>
        <p id='confirm-description' className='mb-5'>{message}</p>
        {error && (
          <p className='mb-4 text-sm text-red-600 bg-red-50 rounded px-3 py-2'>{error}</p>
        )}
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className='flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${getButtonColor()} text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={confirmText}
          >
            {isLoading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

