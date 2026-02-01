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

import React, { useMemo } from 'react';
import { Download, Image as ImageIcon, RefreshCw, Info } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useHistory } from '../../hooks/useHistory';
import { VariationGrid } from './VariationGrid';

export const ImagePreview: React.FC = () => {
  const { currentImage, setGenerationOptions, showToast, setShowImageDetails, setSelectedImageDetails } = useAppStore();
  const { getVariationsByGroupId } = useHistory();

  const variations = useMemo(() => {
    if (!currentImage?.groupId) return null;
    return getVariationsByGroupId(currentImage.groupId);
  }, [currentImage?.groupId, getVariationsByGroupId]);

  const handleNewFromThis = () => {
    if (!currentImage) return;

    setGenerationOptions({
      prompt: currentImage.prompt,
      negativePrompt: currentImage.negativePrompt || '',
      style: currentImage.style || '',
      ratio: currentImage.ratio || '1:1',
      lighting: currentImage.lighting || '',
      mood: currentImage.mood || '',
      resolution: currentImage.resolution || '1K',
      variations: 1, // Reset to 1 when loading from existing image
    });

    showToast('Parameters loaded from image', 'success');
  };

  const handleViewDetails = () => {
    if (!currentImage) return;
    setSelectedImageDetails(currentImage);
    setShowImageDetails(true);
  };

  const handleDownload = (item: typeof currentImage) => {
    if (!item) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${item.base64}`;
    link.download = item.filename ? `${item.filename}.png` : `pixelforge-${item.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If we have variations, show the grid
  if (variations && variations.length > 1) {
    return <VariationGrid variations={variations} />;
  }

  // Otherwise show single image view
  return (
    <div className="flex-1 bg-gray-950 p-6 flex items-center justify-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
      {currentImage ? (
        <div className="relative group max-w-full max-h-full animate-in fade-in zoom-in duration-300">
          <img
            src={`data:image/png;base64,${currentImage.base64}`}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-gray-800"
            alt={currentImage.filename || currentImage.prompt}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleViewDetails}
              className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
              title="View Details"
            >
              <Info size={20} />
            </button>
            <button
              onClick={handleNewFromThis}
              className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
              title="New from This - Reuse Parameters"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => handleDownload(currentImage)}
              className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
              title="Download to Computer"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center opacity-30">
          <ImageIcon className="w-16 h-16 mx-auto mb-4" />
          <p>Ready to create</p>
        </div>
      )}
    </div>
  );
};
