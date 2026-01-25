import React from 'react';
import { Trash2 } from 'lucide-react';
import { ImageItem } from '../../types';
import { STYLES } from '../../constants/styles';
import { Checkbox } from '../common/Checkbox';

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
        className={`w-12 h-12 bg-black rounded overflow-hidden shrink-0 ${
          selectionMode ? 'opacity-50 ml-6' : ''
        } transition-all`}
      >
        <img
          src={`data:image/png;base64,${item.base64}`}
          className="w-full h-full object-cover"
          loading="lazy"
          alt={item.filename || item.prompt}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-300 truncate font-medium">{item.filename || item.prompt}</p>
        <div className="flex justify-between items-center mt-0.5">
          <p className="text-[10px] text-gray-500">
            {new Date(item.timestamp).toLocaleTimeString()}
          </p>
          {item.style && (
            <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 rounded truncate max-w-[60px]">
              {STYLES.find((s) => s.value === item.style)?.label || 'Custom'}
            </span>
          )}
        </div>
      </div>
      {!selectionMode && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-2 p-1.5 bg-gray-800 text-gray-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};
