import React from 'react';
import { Trash2, Info } from 'lucide-react';
import { ImageItem } from '../../types';
import { STYLES } from '../../constants/styles';
import { Checkbox } from '../common/Checkbox';
import { useAppStore } from '../../store/useAppStore';
import { useHistory } from '../../hooks/useHistory';

const formatGenerationTime = (ms: number): string => {
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

interface HistoryItemProps {
  item: ImageItem;
  isSelected: boolean;
  isActive: boolean;
  selectionMode: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (item: ImageItem) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  isSelected,
  isActive,
  selectionMode,
  onSelect,
  onDelete,
  onClick,
}) => {
  const { setShowImageDetails, setSelectedImageDetails } = useAppStore();
  const { getVariationsByGroupId } = useHistory();
  
  const variationCount = item.groupId ? getVariationsByGroupId(item.groupId).length : 0;

  const handleClick = () => {
    if (selectionMode) {
      onSelect(item.id);
    } else {
      onClick(item);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageDetails(item);
    setShowImageDetails(true);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative p-2 rounded-lg border cursor-pointer transition-all flex gap-3 items-center ${
        isActive && !selectionMode
          ? 'bg-gray-800 border-purple-500/50'
          : selectionMode && isSelected
            ? 'bg-purple-900/20 border-purple-500/50'
            : 'bg-gray-950 border-gray-800 hover:bg-gray-800'
      }`}
    >
      {/* Selection Checkbox Overlay */}
      {selectionMode && (
        <div
          className="absolute inset-0 z-10 flex items-center pl-2"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
        >
          <Checkbox checked={isSelected} onChange={() => onSelect(item.id)} className="ml-1" />
        </div>
      )}

      <div
        className={`w-12 h-12 bg-black rounded overflow-hidden shrink-0 relative ${
          selectionMode ? 'opacity-50 ml-6' : ''
        } transition-all`}
      >
        {variationCount > 1 ? (
          <div className="grid grid-cols-2 w-full h-full">
            {getVariationsByGroupId(item.groupId!)
              .slice(0, 4)
              .map((variation, idx) => (
                <img
                  key={variation.id}
                  src={`data:image/png;base64,${variation.base64}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  alt={`${item.filename || item.prompt} - ${idx + 1}`}
                />
              ))}
          </div>
        ) : (
          <img
            src={`data:image/png;base64,${item.base64}`}
            className="w-full h-full object-cover"
            loading="lazy"
            alt={item.filename || item.prompt}
          />
        )}
        {variationCount > 1 && (
          <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-[8px] px-1 rounded-tl">
            {variationCount}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-300 truncate font-medium">
          {item.filename || item.prompt}
          {variationCount > 1 && (
            <span className="ml-1 text-[10px] text-purple-400">({variationCount} variations)</span>
          )}
        </p>
        <div className="flex justify-between items-center mt-0.5">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] text-gray-500">
              {new Date(item.timestamp).toLocaleTimeString()}
            </p>
            {item.generationTime && (
              <p className="text-[9px] text-gray-600">
                {formatGenerationTime(item.generationTime)}
              </p>
            )}
          </div>
          {item.style && (
            <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 rounded truncate max-w-[60px]">
              {STYLES.find((s) => s.value === item.style)?.label || 'Custom'}
            </span>
          )}
        </div>
      </div>
      {!selectionMode && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleViewDetails}
            className="p-1.5 bg-gray-800 text-gray-500 hover:text-purple-400 rounded transition-colors"
            title="View Details"
          >
            <Info size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-gray-800 text-gray-500 hover:text-red-400 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
