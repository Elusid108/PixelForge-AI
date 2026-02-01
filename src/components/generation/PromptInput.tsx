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
import { Ban, Copy, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Randomizer } from './Randomizer';

export const PromptInput: React.FC = () => {
  const { generationOptions, setGenerationOptions, showToast, setShowTemplates } = useAppStore();

  const handleCopyPrompt = async () => {
    const fullPrompt = [
      generationOptions.prompt,
      generationOptions.style,
      generationOptions.lighting,
      generationOptions.mood,
    ]
      .filter(Boolean)
      .join(' ');

    if (!fullPrompt.trim()) {
      showToast('No prompt to copy', 'info');
      return;
    }

    try {
      await navigator.clipboard.writeText(fullPrompt);
      showToast('Prompt copied to clipboard', 'success');
    } catch (err) {
      showToast('Failed to copy prompt', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Randomizer Section */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase">Randomizer</label>
        <Randomizer />
      </div>

      {/* Prompt Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase mb-1">Prompt</label>
            <button
              onClick={handleCopyPrompt}
              className="p-1 text-gray-500 hover:text-purple-400 transition-colors"
              title="Copy full prompt with modifiers"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="p-1 text-gray-500 hover:text-purple-400 transition-colors"
              title="Manage prompt templates"
            >
              <FileText size={14} />
            </button>
          </div>
        </div>
        <textarea
          value={generationOptions.prompt}
          onChange={(e) => setGenerationOptions({ prompt: e.target.value })}
          placeholder="A futuristic city..."
          className="w-full h-24 bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder-gray-600"
        ></textarea>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
          <Ban size={12} /> Exclude (Negative)
        </label>
        <input
          value={generationOptions.negativePrompt || ''}
          onChange={(e) => setGenerationOptions({ negativePrompt: e.target.value })}
          placeholder="Blurry, low quality, distorted..."
          className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>
    </div>
  );
};
