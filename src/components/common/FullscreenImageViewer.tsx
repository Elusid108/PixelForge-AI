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

import React, { useEffect, useState, useRef } from 'react';
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, RotateCcw, Info } from 'lucide-react';
import { ImageItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';

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
  const { setShowImageDetails, setSelectedImageDetails } = useAppStore();
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and pan when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [image.id]);

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

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    if (!imageRef.current || !containerRef.current) return;
    const img = imageRef.current;
    const container = containerRef.current;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = container.clientWidth / container.clientHeight;
    
    let fitZoom = 1;
    if (imgAspect > containerAspect) {
      fitZoom = container.clientWidth / img.naturalWidth;
    } else {
      fitZoom = container.clientHeight / img.naturalHeight;
    }
    
    setZoom(fitZoom * 0.9); // 90% to add some padding
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleViewDetails = () => {
    setSelectedImageDetails(image);
    setShowImageDetails(true);
  };

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
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
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
                className="absolute left-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10 z-20"
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
                className="absolute right-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10 z-20"
                title="Next"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </>
        )}

        {/* Image Container with Zoom and Pan */}
        <div
          className="relative flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          onMouseDown={handleMouseDown}
        >
          <img
            ref={imageRef}
            src={`data:image/png;base64,${image.base64}`}
            className="max-w-full max-h-[95vh] object-contain rounded-lg select-none"
            alt={image.filename || image.prompt}
            draggable={false}
          />
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Zoom In (Ctrl+Wheel)"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Zoom Out (Ctrl+Wheel)"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetZoom();
            }}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Reset Zoom"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFitToScreen();
            }}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Fit to Screen"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="View Details"
          >
            <Info size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Download"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Zoom Level Indicator */}
        {zoom !== 1 && (
          <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 text-white text-sm rounded-lg backdrop-blur-md border border-white/10 z-20">
            {Math.round(zoom * 100)}%
          </div>
        )}

        {/* Image Counter */}
        {images && images.length > 1 && currentIndex !== undefined && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-lg backdrop-blur-md border border-white/10 z-20">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};
