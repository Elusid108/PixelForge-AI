import React, { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, Download, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { STYLES } from '../../constants/styles';
import { RATIOS } from '../../constants/ratios';
import { LIGHTING } from '../../constants/lighting';
import { MOODS } from '../../constants/moods';
import { useImageGeneration } from '../../hooks/useImageGeneration';
import { useHistory } from '../../hooks/useHistory';

const formatGenerationTime = (ms?: number): string => {
  if (!ms) return 'N/A';
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

interface CopyableFieldProps {
  label: string;
  value: string;
  onCopy: () => void;
}

const CopyableField: React.FC<CopyableFieldProps> = ({ label, value, onCopy }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label className="text-xs uppercase font-bold text-gray-500">{label}</label>
      <button
        onClick={onCopy}
        className="p-1 text-gray-500 hover:text-purple-400 transition-colors"
        title="Copy to clipboard"
      >
        <Copy size={14} />
      </button>
    </div>
    <p className="text-sm text-gray-300 break-words bg-gray-950 p-2 rounded border border-gray-800">
      {value || '(empty)'}
    </p>
  </div>
);

export const ImageDetailsModal: React.FC = () => {
  const {
    showImageDetails,
    setShowImageDetails,
    selectedImageDetails,
    setGenerationOptions,
    showToast,
    setSelectedImageDetails,
  } = useAppStore();
  const { generate } = useImageGeneration();
  const { getVariationsByGroupId } = useHistory();
  const [imageDimensions, setImageDimensions] = useState<string>('Loading...');

  useEffect(() => {
    if (!selectedImageDetails?.base64) {
      setImageDimensions('N/A');
      return;
    }

    setImageDimensions('Loading...');
    const img = new Image();
    img.onload = () => {
      setImageDimensions(`${img.naturalWidth}x${img.naturalHeight}`);
    };
    img.onerror = () => {
      setImageDimensions('N/A');
    };
    img.src = `data:image/png;base64,${selectedImageDetails.base64}`;
  }, [selectedImageDetails?.base64]);

  if (!showImageDetails || !selectedImageDetails) return null;

  const item = selectedImageDetails;
  const variations = item.groupId ? getVariationsByGroupId(item.groupId) : null;
  const currentVariationIndex = item.variationIndex !== undefined ? item.variationIndex : null;
  const canNavigatePrev = variations && currentVariationIndex !== null && currentVariationIndex > 0;
  const canNavigateNext = variations && currentVariationIndex !== null && currentVariationIndex < variations.length - 1;

  const handleNavigateVariation = (direction: 'prev' | 'next') => {
    if (!variations || currentVariationIndex === null) return;
    
    const newIndex = direction === 'prev' ? currentVariationIndex - 1 : currentVariationIndex + 1;
    if (variations[newIndex]) {
      setSelectedImageDetails(variations[newIndex]);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`, 'success');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleRegenerate = () => {
    setGenerationOptions({
      prompt: item.prompt,
      negativePrompt: item.negativePrompt || '',
      style: item.style || '',
      ratio: item.ratio || '1:1',
      lighting: item.lighting || '',
      mood: item.mood || '',
      resolution: item.resolution || '1K',
      variations: 1, // Reset to 1 when regenerating
    });
    setShowImageDetails(false);
    generate();
  };

  const handleExportMetadata = () => {
    const metadata = {
      prompt: item.prompt,
      negativePrompt: item.negativePrompt,
      style: item.style,
      ratio: item.ratio,
      lighting: item.lighting,
      mood: item.mood,
      resolution: item.resolution,
      filename: item.filename,
      timestamp: new Date(item.timestamp).toISOString(),
      generationTime: item.generationTime ? formatGenerationTime(item.generationTime) : null,
      groupId: item.groupId || null,
      variationIndex: item.variationIndex !== undefined ? item.variationIndex : null,
      totalVariations: variations ? variations.length : null,
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.filename || 'pixelforge'}-metadata.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Metadata exported', 'success');
  };

  const styleLabel = STYLES.find((s) => s.value === item.style)?.label || item.style || 'Default';
  const ratioLabel = RATIOS.find((r) => r.value === item.ratio)?.label || item.ratio || '1:1';
  const lightingLabel = LIGHTING.find((l) => l.value === item.lighting)?.label || item.lighting || 'Default';
  const moodLabel = MOODS.find((m) => m.value === item.mood)?.label || item.mood || 'Default';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
      onClick={() => setShowImageDetails(false)}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-purple-400">
            <ImageIcon className="w-6 h-6" />
            <h2 className="text-xl font-bold">Image Details</h2>
            {variations && variations.length > 1 && currentVariationIndex !== null && (
              <span className="text-sm text-gray-400">
                (Variation {currentVariationIndex + 1} of {variations.length})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {variations && variations.length > 1 && (
              <>
                <button
                  onClick={() => handleNavigateVariation('prev')}
                  disabled={!canNavigatePrev}
                  className={`p-1.5 rounded transition-colors ${
                    canNavigatePrev
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 cursor-not-allowed'
                  }`}
                  title="Previous variation"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => handleNavigateVariation('next')}
                  disabled={!canNavigateNext}
                  className={`p-1.5 rounded transition-colors ${
                    canNavigateNext
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 cursor-not-allowed'
                  }`}
                  title="Next variation"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <button
              onClick={() => setShowImageDetails(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <CopyableField
            label="Prompt"
            value={item.prompt}
            onCopy={() => handleCopy(item.prompt, 'Prompt')}
          />

          <CopyableField
            label="Negative Prompt"
            value={item.negativePrompt || ''}
            onCopy={() => handleCopy(item.negativePrompt || '', 'Negative prompt')}
          />

          <div className="grid grid-cols-2 gap-4">
            <CopyableField
              label="Style"
              value={styleLabel}
              onCopy={() => handleCopy(styleLabel, 'Style')}
            />
            <CopyableField
              label="Ratio"
              value={ratioLabel}
              onCopy={() => handleCopy(ratioLabel, 'Ratio')}
            />
            <CopyableField
              label="Lighting"
              value={lightingLabel}
              onCopy={() => handleCopy(lightingLabel, 'Lighting')}
            />
            <CopyableField
              label="Mood"
              value={moodLabel}
              onCopy={() => handleCopy(moodLabel, 'Mood')}
            />
            {item.resolution && (
              <CopyableField
                label="Resolution"
                value={item.resolution}
                onCopy={() => handleCopy(item.resolution || '', 'Resolution')}
              />
            )}
            <CopyableField
              label="Image Resolution"
              value={imageDimensions}
              onCopy={() => handleCopy(imageDimensions, 'Image Resolution')}
            />
          </div>

          <CopyableField
            label="Filename"
            value={item.filename}
            onCopy={() => handleCopy(item.filename, 'Filename')}
          />

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-gray-500">Timestamp</label>
            <p className="text-sm text-gray-300 bg-gray-950 p-2 rounded border border-gray-800">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>

          {item.generationTime && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-gray-500">Generation Time</label>
              <p className="text-sm text-gray-300 bg-gray-950 p-2 rounded border border-gray-800">
                {formatGenerationTime(item.generationTime)}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
          <button
            onClick={handleRegenerate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Regenerate
          </button>
          <button
            onClick={handleExportMetadata}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
          >
            <Download size={18} />
            Export Metadata
          </button>
        </div>
      </div>
    </div>
  );
};
