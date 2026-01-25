import React from 'react';
import { Ban, Copy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Randomizer } from './Randomizer';

export const PromptInput: React.FC = () => {
  const { generationOptions, setGenerationOptions, setToast } = useAppStore();

  const handleCopyPrompt = async () => {
    const fullPrompt = [
      generationOptions.prompt,
      generationOptions.style,
      generationOptions.lighting,
      generationOptions.mood,
    ]
      .filter(Boolean)
      .join(' ');

    if (!fullPrompt.trim()) {
      setToast({ message: 'No prompt to copy', type: 'info' });
      return;
    }

    try {
      await navigator.clipboard.writeText(fullPrompt);
      setToast({ message: 'Prompt copied to clipboard', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to copy prompt', type: 'error' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase mb-1">Prompt</label>
            <button
              onClick={handleCopyPrompt}
              className="p-1 text-gray-500 hover:text-purple-400 transition-colors"
              title="Copy full prompt with modifiers"
            >
              <Copy size={14} />
            </button>
          </div>
          <Randomizer />
        </div>
        <textarea
          value={generationOptions.prompt}
          onChange={(e) => setGenerationOptions({ prompt: e.target.value })}
          placeholder="A futuristic city..."
          className="w-full h-24 bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder-gray-600"
        ></textarea>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
          <Ban size={12} /> Exclude (Negative)
        </label>
        <input
          value={generationOptions.negativePrompt || ''}
          onChange={(e) => setGenerationOptions({ negativePrompt: e.target.value })}
          placeholder="Blurry, low quality, distorted..."
          className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>
    </div>
  );
};
