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
  userPrompt: string
): Promise<string> => {
  // Models to try in order of preference. Use current stable models per Google's docs.
  // Try v1 (stable API) first, then v1beta. v1 requires merged payload (no systemInstruction at root).
  const models = [
    'gemini-2.5-flash', // Best price-performance
    'gemini-2.0-flash', // Stable
    'gemini-2.5-flash-lite', // Fast/cheap
    'gemini-2.0-flash-lite', // Fallback
    'gemini-2.0-flash-exp', // Experimental last resort
  ];
  let lastError: Error | null = null;

  // Merged prompt for v1 (stable API doesn't support systemInstruction at root)
  const mergedPrompt = `${systemInstruction}\n\nTask: ${userPrompt}`;

  for (const model of models) {
    try {
      // Try v1 (stable) first, then v1beta. v1 has broader model availability.
      const apiVersions = ['v1', 'v1beta'] as const;
      let lastVersionError: Error | null = null;

      for (const version of apiVersions) {
        try {
          // v1: merged payload. v1beta: systemInstruction at root.
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

          const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${key}`;

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const data: GeminiResponse = await response.json();

          if (data.error) {
            // If model not found or invalid payload, try next API version (if available)
            if (data.error.message?.includes('not found') || response.status === 404) {
              lastVersionError = new Error(`Model ${model} not found in ${version}`);
              continue; // Try next version
            }
            // If invalid payload (like systemInstruction not supported), try next version
            if (data.error.message?.includes('Unknown name') || data.error.message?.includes('Cannot find field') || response.status === 400) {
              lastVersionError = new Error(`Model ${model} payload error in ${version}`);
              continue; // Try next version
            }
            throw new Error(`Model ${model} failed: ${data.error.message}`);
          }

          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (!text) throw new Error(`Model ${model} returned no text`);

          return text; // Success!
        } catch (versionError) {
          const error = versionError as Error;
          lastVersionError = error;
          // If it's a 404, 400, or "not found", try next version
          if (error.message.includes('not found') || error.message.includes('404') || error.message.includes('400') || error.message.includes('payload error')) {
            continue; // Try next API version
          }
          // Otherwise, rethrow to try next model
          throw error;
        }
      }

      // If all API versions failed for this model, throw the last error
      throw lastVersionError || new Error(`Model ${model} failed in all API versions`);
    } catch (e) {
      const error = e as Error;
      // Only log if it's not an expected "not found" error (these are normal fallback attempts)
      if (import.meta.env.DEV && !error.message.includes('not found') && !error.message.includes('404')) {
        console.warn(`Attempt with ${model} failed:`, error.message);
      }
      lastError = error;
      // Continue loop to try next model
    }
  }

  // If all models fail
  throw lastError || new Error('All text models failed');
};
