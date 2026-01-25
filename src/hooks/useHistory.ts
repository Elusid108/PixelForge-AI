import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getHistoryFromDB, deleteFromDB } from '../services/storage/indexedDB';
import { ImageItem } from '../types';

export const useHistory = () => {
  const { history, setHistory, removeFromHistory, setConfirmationModal } = useAppStore();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [filterStyle, setFilterStyle] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    refreshHistory();
  }, []);

  const refreshHistory = async () => {
    try {
      const data = await getHistoryFromDB();
      setHistory(data);
    } catch (e) {
      console.error('DB Error', e);
    }
  };

  const filteredHistory = useMemo(() => {
    let result = [...history];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const promptMatch = item.prompt?.toLowerCase().includes(searchLower);
        const filenameMatch = item.filename?.toLowerCase().includes(searchLower);
        const styleMatch = item.style?.toLowerCase().includes(searchLower);
        return promptMatch || filenameMatch || styleMatch;
      });
    }

    if (filterStyle !== 'ALL') {
      result = result.filter((item) => item.style === filterStyle);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });

    // Group variations: show only one entry per groupId (the first variation)
    const groupedMap = new Map<string, ImageItem>();
    const singleItems: ImageItem[] = [];

    result.forEach((item) => {
      if (item.groupId) {
        if (!groupedMap.has(item.groupId)) {
          // Store the first variation of each group
          groupedMap.set(item.groupId, item);
        }
      } else {
        // Single items (no groupId) are added directly
        singleItems.push(item);
      }
    });

    // Combine grouped items and single items, maintaining sort order
    const groupedItems = Array.from(groupedMap.values());
    const combined = [...groupedItems, ...singleItems];

    // Re-sort to maintain chronological order
    combined.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });

    return combined;
  }, [history, sortBy, filterStyle, searchTerm]);

  const deleteItem = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationModal({
        title: 'Delete Image',
        message: 'Are you sure you want to delete this image?',
        confirmText: 'Delete',
        onConfirm: async () => {
          await deleteFromDB(id);
          removeFromHistory(id);
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };

  const getVariationsByGroupId = (groupId: string): ImageItem[] => {
    return history
      .filter((item) => item.groupId === groupId)
      .sort((a, b) => (a.variationIndex || 0) - (b.variationIndex || 0));
  };

  return {
    history,
    filteredHistory,
    sortBy,
    setSortBy,
    filterStyle,
    setFilterStyle,
    searchTerm,
    setSearchTerm,
    refreshHistory,
    deleteItem,
    getVariationsByGroupId,
  };
};
