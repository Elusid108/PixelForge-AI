import React from 'react';

interface StatusNotificationProps {
  message: string;
}

export const StatusNotification: React.FC<StatusNotificationProps> = ({ message }) => {
  return (
    <div className="status-notification absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 bg-gray-900/95 border border-purple-500/50 rounded-full shadow-2xl backdrop-blur-md">
      <div className="loader w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-semibold text-purple-100 uppercase tracking-wide">{message}</span>
    </div>
  );
};
