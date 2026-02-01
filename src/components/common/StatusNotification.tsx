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
