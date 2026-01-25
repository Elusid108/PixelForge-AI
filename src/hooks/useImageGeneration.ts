import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateImage } from '../services/api/imagen';
import { generateFilename } from '../services/api/gemini';
import { saveToDB } from '../services/storage/indexedDB';
import { ImageItem } from '../types';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { apiKey, generationOptions, addToHistory, setCurrentImage, setSelectedId, setError, setProcessingStatus } =
    useAppStore();

  const generate = async () => {
    if (!apiKey) {
      useAppStore.getState().setShowSettings(true);
      return;
    }
    if (!generationOptions.prompt) return;

    setIsGenerating(true);
    setProcessingStatus('Dreaming up image...');
    setError(null);

    const startTime = Date.now();

    try {
      // 1. Generate Image
      const modifiers = generationOptions.style + generationOptions.lighting + generationOptions.mood;
      const newImageBase64 = await generateImage(apiKey, {
        prompt: generationOptions.prompt,
        modifiers,
        ratio: generationOptions.ratio,
        negativePrompt: generationOptions.negativePrompt,
      });

      // 2. Generate Filename (API Call)
      setProcessingStatus('Generating title...');
      let filename = `PixelForge-${Date.now()}`;
      try {
        filename = await generateFilename(apiKey, generationOptions.prompt);
      } catch (e) {
        console.warn('Filename generation failed, using default', e);
      }

      setProcessingStatus('Saving to gallery...');
      const generationTime = Date.now() - startTime;
      const newItem: ImageItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        prompt: generationOptions.prompt,
        negativePrompt: generationOptions.negativePrompt,
        style: generationOptions.style,
        ratio: generationOptions.ratio,
        lighting: generationOptions.lighting,
        mood: generationOptions.mood,
        base64: newImageBase64,
        filename: filename,
        generationTime: generationTime,
      };

      await saveToDB(newItem);
      addToHistory(newItem);
      setCurrentImage(newItem);
      setSelectedId(newItem.id);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsGenerating(false);
      setProcessingStatus(null);
    }
  };

  return {
    isGenerating,
    generate,
  };
};
