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
import { PlusCircle, Wand2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useImageGeneration } from '../../hooks/useImageGeneration';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { PromptInput } from '../generation/PromptInput';
import { GenerationControls } from '../generation/GenerationControls';
import { ImagePreview } from '../generation/ImagePreview';
import { ErrorDisplay } from '../common/ErrorDisplay';

export const Workspace: React.FC = () => {
  const { generationOptions, resetGenerationOptions, error } = useAppStore();
  const { isGenerating, generate } = useImageGeneration();
  useKeyboardShortcuts();

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* CONTROLS (LEFT) */}
      <div className="w-full lg:w-96 p-6 border-r border-gray-800 bg-gray-950 overflow-y-auto shrink-0 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Create New Image
          </div>
          <button
            onClick={resetGenerationOptions}
            className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300"
          >
            <PlusCircle size={12} /> Clear
          </button>
        </div>

        <PromptInput />
        <GenerationControls />

        <button
          onClick={generate}
          disabled={isGenerating || !generationOptions.prompt}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-purple-600 to-pink-600 ${
            isGenerating || !generationOptions.prompt
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] hover:shadow-purple-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="loader w-4 h-4 border-2"></div>
              <span>Dreaming...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate</span>
            </>
          )}
        </button>

        <ErrorDisplay error={error || ''} />
      </div>

      {/* PREVIEW (RIGHT) */}
      <ImagePreview />
    </div>
  );
};
