import { GeminiResponse } from '../../types';

export const callTextAI = async (
  key: string,
  systemInstruction: string,
  userPrompt: string
): Promise<string> => {
  // Models to try in order of preference for Public API keys.
  // gemini-1.5-pro is best for creativity.
  // gemini-1.5-flash is fast/cheap.
  // gemini-pro (1.0) is the ultimate fallback.
  const models = [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.0-pro',
    'gemini-2.0-flash-exp', // Experimental public model
  ];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      // Legacy models (1.0) don't support 'systemInstruction' property at root
      const isLegacy = model.includes('1.0') || model === 'gemini-pro';

      // v1 API doesn't support systemInstruction at root - only v1beta does
      // For non-legacy models, we must use v1beta. For legacy, we can try both.
      const apiVersions = isLegacy ? ['v1beta', 'v1'] : ['v1beta'];
      let lastVersionError: Error | null = null;

      for (const version of apiVersions) {
        try {
          // Build payload based on API version and model type
          let payload;
          if (isLegacy) {
            // Legacy models: merge system prompt into user prompt
            payload = {
              contents: [{ parts: [{ text: `${systemInstruction}\n\nTask: ${userPrompt}` }] }],
            };
          } else if (version === 'v1beta') {
            // v1beta supports systemInstruction at root
            payload = {
              contents: [{ parts: [{ text: userPrompt }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: { temperature: 1.4 }, // High creativity
            };
          } else {
            // v1 doesn't support systemInstruction - merge it into contents
            payload = {
              contents: [{ parts: [{ text: `${systemInstruction}\n\nTask: ${userPrompt}` }] }],
            };
          }

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
