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

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getHistoryFromDB, deleteFromDB } from '../services/storage/indexedDB';
import { ImageItem } from '../types';
import { DEBUG_HISTORY, debugHistory } from '../utils/debug';

export const useHistory = () => {
  const { history, setHistory, removeFromHistory, setConfirmationModal } = useAppStore();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [filterStyle, setFilterStyle] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const refreshHistory = useCallback(async () => {
    try {
      const t0 = performance.now();
      const data = await getHistoryFromDB();
      const t1 = performance.now();
      setHistory(data);
      const t2 = performance.now();
      debugHistory('load', { fetchMs: t1 - t0, setStateMs: t2 - t1, count: data.length });
      if (DEBUG_HISTORY) {
        const base64Bytes = data.reduce((acc, i) => acc + (i.base64?.length || 0), 0);
        debugHistory('base64 bytes (approx)', base64Bytes);
      }
    } catch (e) {
      console.error('DB Error', e);
    }
  }, [setHistory]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

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

  const getVariationsByGroupId = useCallback(
    (groupId: string): ImageItem[] => {
      return history
        .filter((item) => item.groupId === groupId)
        .sort((a, b) => (a.variationIndex || 0) - (b.variationIndex || 0));
    },
    [history]
  );

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
