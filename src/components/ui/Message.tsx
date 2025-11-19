'use client';

type MessageType = 'success' | 'warning' | 'error';

interface MessageProps {
  type: MessageType;
  message: string;
  onClose: () => void;
}

export function Message({ type, message, onClose }: MessageProps) {
  const getTitle = () => {
    if (type === 'success') return 'Succès';
    if (type === 'warning') return 'Attention';
    if (type === 'error') return 'Erreur';
    return 'Message';
  };

  const getButtonColor = () => {
    if (type === 'success') return 'bg-green-500 hover:bg-green-600';
    if (type === 'warning') return 'bg-yellow-500 hover:bg-yellow-600';
    if (type === 'error') return 'bg-red-500 hover:bg-red-600';
    return 'bg-blue-500 hover:bg-blue-600';
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-title"
      aria-describedby="message-description"
    >
      <div className="bg-white rounded p-6 max-w-md w-11/12 shadow-2xl">
        <h3 id="message-title" className="text-xl font-bold mb-3">{getTitle()}</h3>
        <p id="message-description" className="mb-5">{message}</p>
        <button
          onClick={onClose}
          className={`w-full ${getButtonColor()} text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white`}
          aria-label="Fermer le message"
        >
          OK
        </button>
      </div>
    </div>
  );
}

