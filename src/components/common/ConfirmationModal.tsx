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

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ConfirmationModal: React.FC = () => {
  const { confirmationModal, setConfirmationModal } = useAppStore();

  if (!confirmationModal) return null;

  const handleConfirm = () => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm();
    }
    setConfirmationModal(null);
  };

  const handleCancel = () => {
    if (confirmationModal.onCancel) {
      confirmationModal.onCancel();
    }
    setConfirmationModal(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-red-900/20 rounded-lg border border-red-500/50">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100 mb-1">
              {confirmationModal.title || 'Confirm Action'}
            </h3>
            <p className="text-sm text-gray-400">
              {confirmationModal.message}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
          >
            {confirmationModal.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
