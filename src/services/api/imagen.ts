import { ImagenResponse } from '../../types';

export interface ImageGenerationOptions {
  prompt: string;
  modifiers?: string;
  ratio?: string;
  negativePrompt?: string;
}

export const generateImage = async (
  key: string,
  options: ImageGenerationOptions
): Promise<string> => {
  const { prompt, modifiers, ratio = '1:1', negativePrompt } = options;
  const fullPrompt = modifiers ? `${prompt} ${modifiers}` : prompt;

  const payload = {
    instances: [{ prompt: fullPrompt }],
    parameters: {
      sampleCount: 1,
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

  if (!data.predictions || data.predictions.length === 0 || !data.predictions[0]?.bytesBase64Encoded) {
    throw new Error('Generation Failed: No image data returned. (Possible safety block)');
  }

  return data.predictions[0].bytesBase64Encoded;
};
