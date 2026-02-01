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

import { ImagenResponse } from '../../types';

export interface ImageGenerationOptions {
  prompt: string;
  modifiers?: string;
  ratio?: string;
  negativePrompt?: string;
  resolution?: string;
  variations?: number;
}

export const generateImage = async (
  key: string,
  options: ImageGenerationOptions
): Promise<string[]> => {
  const { prompt, modifiers, ratio = '1:1', negativePrompt, resolution = '1K', variations = 1 } = options;
  const fullPrompt = modifiers ? `${prompt} ${modifiers}` : prompt;

  const payload = {
    instances: [{ prompt: fullPrompt }],
    parameters: {
      sampleCount: variations,
      sampleImageSize: resolution,
      aspectRatio: ratio,
      negativePrompt: negativePrompt || undefined,
    },
  };

  // Imagen only works with v1beta - v1 has CORS issues and doesn't support it
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${key}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data: ImagenResponse = await response.json();

  // Check for API errors
  if (data.error) {
    const errMsg = data.error.message?.toLowerCase() || '';
    // Check specifically for content safety violations
    if (errMsg.includes('safety') || errMsg.includes('blocked') || errMsg.includes('policy')) {
      throw new Error('Content Violation: This prompt triggered safety filters.');
    }
    throw new Error('Imagen Error: ' + data.error.message);
  }

  if (!data.predictions || data.predictions.length === 0) {
    throw new Error('Generation Failed: No image data returned. (Possible safety block)');
  }

  // Return all predictions as an array of base64 strings
  const images = data.predictions
    .map((p) => p.bytesBase64Encoded)
    .filter((img): img is string => img !== undefined);

  if (images.length === 0) {
    throw new Error('Generation Failed: No valid image data returned.');
  }

  return images;
};
