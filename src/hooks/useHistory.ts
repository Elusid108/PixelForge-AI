import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getHistoryFromDB, deleteFromDB } from '../services/storage/indexedDB';

export const useHistory = () => {
  const { history, setHistory, removeFromHistory } = useAppStore();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [filterStyle, setFilterStyle] = useState<string>('ALL');

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

    if (filterStyle !== 'ALL') {
      result = result.filter((item) => item.style === filterStyle);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });

    return result;
  }, [history, sortBy, filterStyle]);

  const deleteItem = async (id: string) => {
    if (confirm('Delete this image?')) {
      await deleteFromDB(id);
      removeFromHistory(id);
      return true;
    }
    return false;
  };

  return {
    history,
    filteredHistory,
    sortBy,
    setSortBy,
    filterStyle,
    setFilterStyle,
    refreshHistory,
    deleteItem,
  };
};
