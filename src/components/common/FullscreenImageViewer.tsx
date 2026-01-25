import React, { useEffect } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageItem } from '../../types';

interface FullscreenImageViewerProps {
  image: ImageItem;
  images?: ImageItem[]; // Optional array for navigation
  currentIndex?: number; // Current index in images array
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  image,
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!images || currentIndex === undefined || !onNavigate) return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [onClose, images, currentIndex, onNavigate]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image.base64}`;
    link.download = image.filename ? `${image.filename}.png` : `pixelforge-${image.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canNavigatePrev = images && currentIndex !== undefined && currentIndex > 0;
  const canNavigateNext = images && currentIndex !== undefined && currentIndex < images.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows */}
        {images && images.length > 1 && (
          <>
            {canNavigatePrev && onNavigate && currentIndex !== undefined && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(currentIndex - 1);
                }}
                className="absolute left-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10 z-10"
                title="Previous"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {canNavigateNext && onNavigate && currentIndex !== undefined && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(currentIndex + 1);
                }}
                className="absolute right-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10 z-10"
                title="Next"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </>
        )}

        {/* Image */}
        <img
          src={`data:image/png;base64,${image.base64}`}
          className="max-w-full max-h-[95vh] object-contain rounded-lg"
          alt={image.filename || image.prompt}
        />

        {/* Close and Download Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleDownload}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Download"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image Counter */}
        {images && images.length > 1 && currentIndex !== undefined && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-lg backdrop-blur-md border border-white/10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};
