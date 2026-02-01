/*
 * Copyright 2026 Christopher Moore
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ToastItemProps {
  toast: { id: string; message: string; type: 'success' | 'error' | 'info' };
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-green-900/20 border-green-500/50',
    error: 'bg-red-900/20 border-red-500/50',
    info: 'bg-blue-900/20 border-blue-500/50',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md min-w-[200px] max-w-[400px] animate-slide-in-right ${bgColors[toast.type]}`}
    >
      {icons[toast.type]}
      <span className="text-sm text-gray-100 flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
