import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateRandomPrompt } from '../services/api/gemini';
import { STYLES } from '../constants/styles';
import { RATIOS } from '../constants/ratios';
import { LIGHTING } from '../constants/lighting';
import { MOODS } from '../constants/moods';
import { RANDOM_TYPES } from '../constants/randomTypes';

export const useRandomizer = () => {
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [randomType, setRandomType] = useState<string>('ANY');
  const [isRandomizerOpen, setIsRandomizerOpen] = useState(false);
  const { apiKey, setGenerationOptions, setError, setShowSettings, setProcessingStatus } = useAppStore();

  const randomize = async () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    setIsRandomizing(true);
    setError(null);
    setProcessingStatus(`Hallucinating ${randomType.toLowerCase()}...`);

    try {
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
