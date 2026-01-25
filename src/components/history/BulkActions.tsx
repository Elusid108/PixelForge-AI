import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { ImageItem } from '../../types';

interface BulkActionsProps {
  items: ImageItem[];
  selectedItems: Set<string>;
  onBulkDownload: (items: ImageItem[]) => void;
  onBulkDelete: (ids: Set<string>) => void;
  onToggleSelectAll: () => void;
  allSelected: boolean;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  items,
  selectedItems,
  onBulkDownload,
  onBulkDelete,
  onToggleSelectAll,
  allSelected,
}) => {
  const handleBulkDownload = () => {
    const selected = items.filter((item) => selectedItems.has(item.id));
    if (selected.length > 0) {
      onBulkDownload(selected);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size > 0) {
      onBulkDelete(selectedItems);
    }
  };

  return (
    <div className="p-2 bg-purple-900/20 border-b border-purple-500/20 flex justify-between items-center px-4 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={allSelected}
          onChange={onToggleSelectAll}
          title="Select All"
        />
        <span className="text-xs text-purple-200 font-medium">{selectedItems.size} selected</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleBulkDownload}
          disabled={selectedItems.size === 0}
          className="p-1.5 hover:bg-purple-500/20 rounded text-purple-200 disabled:opacity-50"
          title="Download Zip"
        >
          <Download size={14} />
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selectedItems.size === 0}
          className="p-1.5 hover:bg-red-500/20 rounded text-red-300 disabled:opacity-50"
          title="Delete Selected"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
