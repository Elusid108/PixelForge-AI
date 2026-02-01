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
