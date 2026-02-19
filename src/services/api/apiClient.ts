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

import { GeminiResponse } from '../../types';

export const callTextAI = async (
  key: string,
  systemInstruction: string,
  userPrompt: string,
  model: string = 'gemini-2.5-flash-lite'
): Promise<string> => {
  const modelId = model.replace(/^models\//, '');

  // Merged prompt for v1 (stable API doesn't support systemInstruction at root)
  const mergedPrompt = `${systemInstruction}\n\nTask: ${userPrompt}`;

  const apiVersions = ['v1', 'v1beta'] as const;
  let lastError: Error | null = null;

  for (const version of apiVersions) {
    try {
      const payload =
        version === 'v1'
          ? {
              contents: [{ parts: [{ text: mergedPrompt }] }],
            }
          : {
              contents: [{ parts: [{ text: userPrompt }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: { temperature: 1.4 },
            };

      const url = `https://generativelanguage.googleapis.com/${version}/models/${modelId}:generateContent?key=${key}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: GeminiResponse = await response.json();

      if (data.error) {
        if (data.error.message?.includes('not found') || response.status === 404) {
          lastError = new Error(`Model ${modelId} not found in ${version}`);
          continue;
        }
        if (data.error.message?.includes('Unknown name') || data.error.message?.includes('Cannot find field') || response.status === 400) {
          lastError = new Error(`Model ${modelId} payload error in ${version}`);
          continue;
        }
        throw new Error(`Model ${modelId} failed: ${data.error.message}`);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) throw new Error(`Model ${modelId} returned no text`);

      return text;
    } catch (e) {
      const error = e as Error;
      if (!error.message.includes('not found') && !error.message.includes('404') && !error.message.includes('payload error')) {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError || new Error(`Model ${modelId} failed in all API versions`);
};
