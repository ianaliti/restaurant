'use client';

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

export function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4 w-150'>
        <div className='flex items-center gap-3 mb-4 justify-center'>
          <h3 className='text-lg font-bold text-grey-900'>Succès</h3>
        </div>
        <p className='text-gray-700 mb-10'>{message}</p>
        <button
          onClick={onClose}
          className='w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90'
        >
          OK
        </button>
      </div>
    </div>
  );
}

