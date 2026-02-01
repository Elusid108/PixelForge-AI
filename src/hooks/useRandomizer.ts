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

import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateRandomPrompt } from '../services/api/gemini';
import { STYLES } from '../constants/styles';
import { RATIOS } from '../constants/ratios';
import { LIGHTING } from '../constants/lighting';
import { MOODS } from '../constants/moods';
import { RANDOM_TYPES } from '../constants/randomTypes';

export type RandomizeMode = 'prompt-only' | 'style-only' | 'everything';

export const useRandomizer = () => {
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [randomType, setRandomType] = useState<string>('ANY');
  const [isRandomizerOpen, setIsRandomizerOpen] = useState(false);
  const { apiKey, setGenerationOptions, setError, setShowSettings, setProcessingStatus } = useAppStore();

  const randomize = async (mode: RandomizeMode = 'everything') => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    setIsRandomizing(true);
    setError(null);

    try {
      if (mode === 'prompt-only') {
        // Randomize prompt only, keep style/lighting/mood
        setProcessingStatus('Generating random prompt...');
        const randomPrompt = await generateRandomPrompt(apiKey, randomType);
        setGenerationOptions({ prompt: randomPrompt });
      } else if (mode === 'style-only') {
        // Randomize style/lighting/mood only, keep prompt
        setProcessingStatus('Randomizing style settings...');
        const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)].value;
        const randomRatio = RATIOS[Math.floor(Math.random() * RATIOS.length)].value;
        const randomLighting = LIGHTING[Math.floor(Math.random() * LIGHTING.length)].value;
        const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)].value;

        setGenerationOptions({
          style: randomStyle,
          ratio: randomRatio,
          lighting: randomLighting,
          mood: randomMood,
        });
      } else {
        // Randomize everything (current behavior)
        setProcessingStatus(`Hallucinating ${randomType.toLowerCase()}...`);
        
        // 1. Randomize Dropdowns
        const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)].value;
        const randomRatio = RATIOS[Math.floor(Math.random() * RATIOS.length)].value;
        const randomLighting = LIGHTING[Math.floor(Math.random() * LIGHTING.length)].value;
        const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)].value;

        setGenerationOptions({
          style: randomStyle,
          ratio: randomRatio,
          lighting: randomLighting,
          mood: randomMood,
        });

        // 2. Generate Random Prompt
        const randomPrompt = await generateRandomPrompt(apiKey, randomType);
        setGenerationOptions({ prompt: randomPrompt });
      }
    } catch (err) {
      const error = err as Error;
      setError('Randomizer failed: ' + error.message);
    } finally {
      setIsRandomizing(false);
      setProcessingStatus(null);
    }
  };

  return {
    isRandomizing,
    randomType,
    setRandomType,
    isRandomizerOpen,
    setIsRandomizerOpen,
    randomize,
    randomTypes: RANDOM_TYPES,
  };
};
