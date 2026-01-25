import { useState } from 'react';
import { ImageItem } from '../types';

export const useSelection = (items: ImageItem[]) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedItems(new Set());
    } else {
      setSelectionMode(true);
    }
  };

  const toggleSelectAll = () => {
    const allSelected = items.length > 0 && items.every((item) => selectedItems.has(item.id));
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(items.map((item) => item.id));
      setSelectedItems(allIds);
    }
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const getSelectedItems = (): ImageItem[] => {
    return items.filter((item) => selectedItems.has(item.id));
  };

  const isAllSelected = items.length > 0 && items.every((item) => selectedItems.has(item.id));

  return {
    selectionMode,
    selectedItems,
    toggleSelection,
    toggleSelectionMode,
    toggleSelectAll,
    clearSelection,
    getSelectedItems,
    isAllSelected,
  };
};
