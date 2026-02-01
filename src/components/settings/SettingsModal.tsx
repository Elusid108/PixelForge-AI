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

import React, { FormEvent } from 'react';
import { Settings, ExternalLink } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const SettingsModal: React.FC = () => {
  const { apiKey, showSettings, setShowSettings, saveSettings } = useSettings();

  if (!showSettings) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get('key') as string;
    saveSettings(key);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-purple-400">
          <Settings className="w-6 h-6" />
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          To use PixelForge, you need a Google Gemini API Key. Your key is stored locally in your
          browser and never sent to our servers.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">API Key</label>
            <input
              name="key"
              defaultValue={apiKey}
              type="password"
              placeholder="AIza..."
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none mt-1"
            />
          </div>
          <div className="flex gap-2 text-xs text-blue-400">
            <ExternalLink size={12} />
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Get a free API Key from Google AI Studio
            </a>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            {apiKey && (
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
