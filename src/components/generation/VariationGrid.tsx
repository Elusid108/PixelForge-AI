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

import React, { useState } from 'react';
import { Download, DownloadCloud, Info } from 'lucide-react';
import { ImageItem } from '../../types';
import { FullscreenImageViewer } from '../common/FullscreenImageViewer';
import { createZipFromImages, downloadBlob } from '../../services/download/zipService';
import { useAppStore } from '../../store/useAppStore';

interface VariationGridProps {
  variations: ImageItem[];
}

export const VariationGrid: React.FC<VariationGridProps> = ({ variations }) => {
  const [fullscreenImage, setFullscreenImage] = useState<ImageItem | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | undefined>(undefined);
  const { setShowImageDetails, setSelectedImageDetails } = useAppStore();

  const getGridCols = (count: number): string => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2'; // 2 on top, 1 centered below
    if (count === 4) return 'grid-cols-2'; // 2x2 grid
    return 'grid-cols-2'; // Default to 2 columns
  };

  const getGridItemSpan = (index: number, count: number): string => {
    if (count === 3 && index === 2) {
      return 'col-span-2'; // Third item spans both columns
    }
    return '';
  };

  const handleImageClick = (image: ImageItem, index: number) => {
    setFullscreenImage(image);
    setFullscreenIndex(index);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
    setFullscreenIndex(undefined);
  };

  const handleNavigate = (index: number) => {
    if (variations[index]) {
      setFullscreenImage(variations[index]);
      setFullscreenIndex(index);
    }
  };

  const handleViewDetails = (e: React.MouseEvent, image: ImageItem) => {
    e.stopPropagation();
    setSelectedImageDetails(image);
    setShowImageDetails(true);
  };

  const handleDownload = (e: React.MouseEvent, image: ImageItem) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image.base64}`;
    link.download = image.filename ? `${image.filename}.png` : `pixelforge-${image.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSet = async () => {
    try {
      const blob = await createZipFromImages(variations);
      const baseFilename = variations[0]?.filename?.replace(/-\d+$/, '') || 'pixelforge-variations';
      downloadBlob(blob, `${baseFilename}.zip`);
    } catch (e) {
      console.error('Zip failed', e);
    }
  };

  const gridCols = getGridCols(variations.length);

  return (
    <>
      <div className="flex-1 bg-gray-950 p-6 flex flex-col items-center justify-center relative">
        <div className={`grid ${gridCols} gap-4 w-full max-w-4xl`}>
          {variations.map((variation, index) => {
            const spanClass = getGridItemSpan(index, variations.length);
            return (
              <div
                key={variation.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all ${spanClass}`}
                onClick={() => handleImageClick(variation, index)}
              >
                <img
                  src={`data:image/png;base64,${variation.base64}`}
                  className="w-full h-full object-contain"
                  style={{ aspectRatio: variations.length === 3 && index === 2 ? '2 / 1' : '1 / 1' }}
                  alt={variation.filename || variation.prompt}
                />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={(e) => handleViewDetails(e, variation)}
                  className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
                  title="View Details"
                >
                  <Info size={18} />
                </button>
                <button
                  onClick={(e) => handleDownload(e, variation)}
                  className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>
                {variations.length > 1 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-md border border-white/10">
                    {index + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {variations.length > 1 && (
          <button
            onClick={handleDownloadSet}
            className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <DownloadCloud size={18} />
            Download Set ({variations.length} images)
          </button>
        )}
      </div>

      {fullscreenImage && fullscreenIndex !== undefined && (
        <FullscreenImageViewer
          image={fullscreenImage}
          images={variations}
          currentIndex={fullscreenIndex}
          onClose={handleCloseFullscreen}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};
