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
import { generateImage } from '../services/api/imagen';
import { generateFilename } from '../services/api/gemini';
import { saveManyToDB } from '../services/storage/indexedDB';
import { ImageItem } from '../types';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { apiKey, generationOptions, addToHistory, setCurrentImage, setSelectedId, setError, setProcessingStatus, selectedTextModel, selectedImageModel, availableImageModels } =
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
    const variations = generationOptions.variations || 1;

    try {
      // 1. Generate Images
      const modifiers = generationOptions.style + generationOptions.lighting + generationOptions.mood;
      setProcessingStatus(`Generating ${variations} image${variations > 1 ? 's' : ''}...`);
      const selectedImageOption = availableImageModels.find(
        (m) => m.name.replace(/^models\//, '') === selectedImageModel
      );
      const imageEndpoint = selectedImageOption?.imageEndpoint ?? 'predict';

      const imageBase64Array = await generateImage(apiKey, {
        prompt: generationOptions.prompt,
        modifiers,
        ratio: generationOptions.ratio,
        negativePrompt: generationOptions.negativePrompt,
        resolution: generationOptions.resolution || '1K',
        variations: variations,
        model: selectedImageModel,
        imageEndpoint,
      });

      // 2. Generate Filename (API Call)
      setProcessingStatus('Generating title...');
      let baseFilename = `PixelForge-${Date.now()}`;
      try {
        baseFilename = await generateFilename(apiKey, generationOptions.prompt, selectedTextModel);
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn('Filename generation failed, using default', e);
        }
      }

      // 3. Create ImageItem for each variation
      setProcessingStatus('Saving to gallery...');
      const generationTime = Date.now() - startTime;
      const newItems: ImageItem[] = [];
      const baseTimestamp = Date.now();
      
      // Generate groupId if multiple variations
      const groupId = variations > 1 ? crypto.randomUUID() : undefined;

      for (let i = 0; i < imageBase64Array.length; i++) {
        const filename = imageBase64Array.length > 1
          ? `${baseFilename}-${i + 1}`
          : baseFilename;

        const newItem: ImageItem = {
          id: crypto.randomUUID(),
          timestamp: baseTimestamp, // Same timestamp for all variations in a group
          prompt: generationOptions.prompt,
          negativePrompt: generationOptions.negativePrompt,
          style: generationOptions.style,
          ratio: generationOptions.ratio,
          lighting: generationOptions.lighting,
          mood: generationOptions.mood,
          base64: imageBase64Array[i],
          filename: filename,
          generationTime: generationTime,
          resolution: generationOptions.resolution || '1K',
          groupId: groupId,
          variationIndex: groupId ? i : undefined,
        };

        newItems.push(newItem);
      }

      await saveManyToDB(newItems);
      newItems.forEach((item) => addToHistory(item));

      // Set the first generated image as current
      if (newItems.length > 0) {
        setCurrentImage(newItems[0]);
        setSelectedId(newItems[0].id);
      }
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
