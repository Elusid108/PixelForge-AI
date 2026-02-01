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
import { Sun, Palette } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { STYLES } from '../../constants/styles';
import { RATIOS } from '../../constants/ratios';
import { LIGHTING } from '../../constants/lighting';
import { MOODS } from '../../constants/moods';

export const GenerationControls: React.FC = () => {
  const { generationOptions, setGenerationOptions } = useAppStore();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase">Style</label>
        <select
          value={generationOptions.style}
          onChange={(e) => setGenerationOptions({ style: e.target.value })}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg p-2.5 outline-none"
        >
          {STYLES.map((s, i) => (
            <option key={i} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase">Ratio</label>
        <select
          value={generationOptions.ratio}
          onChange={(e) => setGenerationOptions({ ratio: e.target.value })}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg p-2.5 outline-none"
        >
          {RATIOS.map((r, i) => (
            <option key={i} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
          <Sun size={12} /> Lighting
        </label>
        <select
          value={generationOptions.lighting}
          onChange={(e) => setGenerationOptions({ lighting: e.target.value })}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg p-2.5 outline-none"
        >
          {LIGHTING.map((l, i) => (
            <option key={i} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
          <Palette size={12} /> Mood
        </label>
        <select
          value={generationOptions.mood}
          onChange={(e) => setGenerationOptions({ mood: e.target.value })}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg p-2.5 outline-none"
        >
          {MOODS.map((m, i) => (
            <option key={i} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase">Resolution</label>
        <select
          value={generationOptions.resolution || '1K'}
          onChange={(e) => setGenerationOptions({ resolution: e.target.value })}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg p-2.5 outline-none"
        >
          <option value="1K">1K</option>
          <option value="2K">2K</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase">Variations</label>
        <select
          value={generationOptions.variations || 1}
          onChange={(e) => setGenerationOptions({ variations: parseInt(e.target.value, 10) })}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg p-2.5 outline-none"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
    </div>
  );
};
