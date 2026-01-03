import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export type ModalType = 'confirm' | 'success' | 'error' | 'warning';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  type = 'confirm',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-yellow-600" />;
      default:
        return <AlertCircle className="w-12 h-12 text-blue-600" />;
    }
  };

  const getConfirmButtonColor = () => {
    if (isDangerous) return 'bg-red-600 hover:bg-red-700';
    if (type === 'success') return 'bg-green-600 hover:bg-green-700';
    if (type === 'error') return 'bg-red-600 hover:bg-red-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">{title}</h2>
        <p className="text-center text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md transition ${getConfirmButtonColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
