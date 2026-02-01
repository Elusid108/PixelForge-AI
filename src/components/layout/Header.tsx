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
import { Sparkles, Settings, Menu } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { APP_VERSION } from '../../constants/version';

export const Header: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, setShowSettings } = useAppStore();

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950/50 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-1.5 rounded-lg">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            PixelForge AI
          </h1>
          <span className="text-xs text-gray-400 font-medium ml-1">
            v{APP_VERSION}
          </span>
        </div>
      </div>
      <button
        onClick={() => setShowSettings(true)}
        className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800"
      >
        <Settings size={20} />
      </button>
    </header>
  );
};
