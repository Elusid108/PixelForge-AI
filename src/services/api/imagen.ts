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

import type { ImageEndpointType } from '../../store/useAppStore';
import { GeminiResponse, ImagenResponse } from '../../types';

export interface ImageGenerationOptions {
  prompt: string;
  modifiers?: string;
  ratio?: string;
  negativePrompt?: string;
  resolution?: string;
  variations?: number;
  model?: string;
  imageEndpoint?: ImageEndpointType;
}

export const generateImage = async (
  key: string,
  options: ImageGenerationOptions
): Promise<string[]> => {
  const {
    prompt,
    modifiers,
    ratio = '1:1',
    negativePrompt,
    resolution = '1K',
    variations = 1,
    model = 'imagen-4.0-generate-001',
    imageEndpoint = 'predict',
  } = options;
  const fullPrompt = modifiers ? `${prompt} ${modifiers}` : prompt;
  const modelId = model.replace(/^models\//, '');

  if (imageEndpoint === 'generateContent') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${key}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data: GeminiResponse = await response.json();

    if (data.error) {
      const errMsg = data.error.message?.toLowerCase() || '';
      if (errMsg.includes('safety') || errMsg.includes('blocked') || errMsg.includes('policy')) {
        throw new Error('Content Violation: This prompt triggered safety filters.');
      }
      throw new Error('Image API Error: ' + data.error.message);
    }

    const candidate = data.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error('Generation Failed: No image data returned. (Possible safety block)');
    }

    const images = candidate.content.parts
      .filter((p) => p.inlineData?.data && (p.inlineData?.mimeType ?? '').startsWith('image/'))
      .map((p) => p.inlineData!.data!);

    if (images.length === 0) {
      throw new Error('Generation Failed: No valid image data returned.');
    }

    return images;
  }

  const payload = {
    instances: [{ prompt: fullPrompt }],
    parameters: {
      sampleCount: variations,
      sampleImageSize: resolution,
      aspectRatio: ratio,
      negativePrompt: negativePrompt || undefined,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predict?key=${key}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data: ImagenResponse = await response.json();

  if (data.error) {
    const errMsg = data.error.message?.toLowerCase() || '';
    if (errMsg.includes('safety') || errMsg.includes('blocked') || errMsg.includes('policy')) {
      throw new Error('Content Violation: This prompt triggered safety filters.');
    }
    throw new Error('Imagen Error: ' + data.error.message);
  }

  if (!data.predictions || data.predictions.length === 0) {
    throw new Error('Generation Failed: No image data returned. (Possible safety block)');
  }

  const images = data.predictions
    .map((p) => p.bytesBase64Encoded)
    .filter((img): img is string => img !== undefined);

  if (images.length === 0) {
    throw new Error('Generation Failed: No valid image data returned.');
  }

  return images;
};
