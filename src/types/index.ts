export interface StyleOption {
  label: string;
  value: string;
}

export interface RatioOption {
  label: string;
  value: string;
}

export interface LightingOption {
  label: string;
  value: string;
}

export interface MoodOption {
  label: string;
  value: string;
}

export interface RandomTypeOption {
  label: string;
  value: string;
}

export interface ImageItem {
  id: string;
  timestamp: number;
  prompt: string;
  negativePrompt?: string;
  style: string;
  ratio: string;
  lighting: string;
  mood: string;
  base64: string;
  filename: string;
  generationTime?: number; // in milliseconds
}

export interface GenerationOptions {
  prompt: string;
  negativePrompt?: string;
  style: string;
  ratio: string;
  lighting: string;
  mood: string;
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

export interface ImagenResponse {
  predictions?: Array<{
    bytesBase64Encoded?: string;
  }>;
  error?: {
    message?: string;
  };
}
