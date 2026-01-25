import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getApiKey, setApiKey as saveApiKey } from '../services/storage/localStorage';

export const useSettings = () => {
  const { apiKey, setApiKey, showSettings, setShowSettings } = useAppStore();

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowSettings(true);
    }
  }, [setApiKey, setShowSettings]);

  const saveSettings = (key: string) => {
    if (key.trim()) {
      saveApiKey(key.trim());
      setApiKey(key.trim());
      setShowSettings(false);
    }
  };

  return {
    apiKey,
    showSettings,
    setShowSettings,
    saveSettings,
  };
};
