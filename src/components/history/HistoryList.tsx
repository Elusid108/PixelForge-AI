import React from 'react';
import { History, X, CheckSquare, ChevronLeft } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import { useSelection } from '../../hooks/useSelection';
import { useAppStore } from '../../store/useAppStore';
import { ImageItem } from '../../types';
import { FilterControls } from './FilterControls';
import { BulkActions } from './BulkActions';
import { HistoryItem } from './HistoryItem';
import { deleteFromDB } from '../../services/storage/indexedDB';
import { createZipFromImages, downloadBlob } from '../../services/download/zipService';

export const HistoryList: React.FC = () => {
  const { filteredHistory, sortBy, setSortBy, filterStyle, setFilterStyle, deleteItem, getVariationsByGroupId } =
    useHistory();
  const { selectionMode, selectedItems, toggleSelection, toggleSelectionMode, clearSelection, toggleSelectAll, isAllSelected } =
    useSelection(filteredHistory);
  const {
    sidebarOpen,
    setSidebarOpen,
    setCurrentImage,
    selectedId,
    setSelectedId,
    resetGenerationOptions,
    setGenerationOptions,
    removeFromHistory,
  } = useAppStore();

  const handleSelectItem = (item: ImageItem) => {
    if (selectionMode) {
      toggleSelection(item.id);
      return;
    }
    
    // If item has a groupId, get all variations and set the first one
    if (item.groupId) {
      const variations = getVariationsByGroupId(item.groupId);
      if (variations.length > 0) {
        setCurrentImage(variations[0]);
        setSelectedId(variations[0].id);
      } else {
        setCurrentImage(item);
        setSelectedId(item.id);
      }
    } else {
      setCurrentImage(item);
      setSelectedId(item.id);
    }
    
    // RELOAD ALL SETTINGS
    setGenerationOptions({
      prompt: item.prompt || '',
      negativePrompt: item.negativePrompt || '',
      style: item.style || '',
      ratio: item.ratio || '1:1',
      lighting: item.lighting || '',
      mood: item.mood || '',
      resolution: item.resolution || '1K',
      variations: 1, // Reset to 1 when loading from existing image
    });
  };

  const handleDelete = async (id: string) => {
    // Find the item to check if it has a groupId
    const item = filteredHistory.find((i) => i.id === id);
    
    if (item?.groupId) {
      // Delete all variations in the group
      const variations = getVariationsByGroupId(item.groupId);
      if (confirm(`Delete ${variations.length} variation${variations.length > 1 ? 's' : ''}?`)) {
        for (const variation of variations) {
          await deleteFromDB(variation.id);
          removeFromHistory(variation.id);
        }
        if (variations.some((v) => v.id === selectedId)) {
          setCurrentImage(null);
          setSelectedId(null);
          resetGenerationOptions();
        }
      }
    } else {
      const deleted = await deleteItem(id);
      if (deleted && selectedId === id) {
        setCurrentImage(null);
        setSelectedId(null);
        resetGenerationOptions();
      }
    }
  };

  const handleBulkDelete = async (ids: Set<string>) => {
    if (confirm(`Delete ${ids.size} items?`)) {
      for (const id of ids) {
        await deleteFromDB(id);
        removeFromHistory(id);
      }
      clearSelection();
      if (ids.has(selectedId || '')) {
        setCurrentImage(null);
        setSelectedId(null);
        resetGenerationOptions();
      }
    }
  };

  const handleBulkDownload = async (items: ImageItem[]) => {
    try {
      const blob = await createZipFromImages(items);
      downloadBlob(blob, 'pixelforge_batch.zip');
    } catch (e) {
      console.error('Zip failed', e);
      useAppStore.getState().setError('Failed to zip files');
    }
  };

  return (
    <div
      className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col shrink-0 relative`}
    >
      <div className="p-4 border-b border-gray-800 flex justify-between items-center whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-2 text-purple-400">
          <History size={18} />
          <span className="font-bold">History</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleSelectionMode}
            className={`p-1.5 rounded transition-colors ${
              selectionMode ? 'text-purple-400 bg-purple-400/10' : 'text-gray-500 hover:text-white'
            }`}
            title={selectionMode ? 'Cancel Selection' : 'Select Multiple'}
          >
            {selectionMode ? <X size={16} /> : <CheckSquare size={16} />}
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500"
          >
            <ChevronLeft />
          </button>
        </div>
      </div>

      <FilterControls
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterStyle={filterStyle}
        setFilterStyle={setFilterStyle}
      />

      {selectionMode && (
        <BulkActions
          items={filteredHistory}
          selectedItems={selectedItems}
          onBulkDownload={handleBulkDownload}
          onBulkDelete={handleBulkDelete}
          onToggleSelectAll={toggleSelectAll}
          allSelected={isAllSelected}
        />
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center text-gray-600 mt-10 text-xs">
            No history yet
          </div>
        ) : (
          filteredHistory.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              isActive={selectedId === item.id}
              selectionMode={selectionMode}
              onSelect={toggleSelection}
              onDelete={handleDelete}
              onClick={handleSelectItem}
            />
          ))
        )}
      </div>
    </div>
  );
};
