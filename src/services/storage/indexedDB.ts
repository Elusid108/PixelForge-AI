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

import { ImageItem, PromptTemplate } from '../../types';

const DB_NAME = 'PixelForgeDB';
const STORE_NAME = 'history';
const TEMPLATES_STORE_NAME = 'templates';
const DB_VERSION = 3; // Upgraded version for templates store

/** Single shared DB connection; reused across all operations. */
let dbPromise: Promise<IDBDatabase> | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains(TEMPLATES_STORE_NAME)) {
        const templatesStore = db.createObjectStore(TEMPLATES_STORE_NAME, { keyPath: 'id' });
        templatesStore.createIndex('category', 'category', { unique: false });
        templatesStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
  return dbPromise;
};

export const saveToDB = async (item: ImageItem): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/** Batch save multiple items in a single transaction. Reduces main-thread blocking. */
export const saveManyToDB = async (items: ImageItem[]): Promise<void> => {
  if (items.length === 0) return;
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    for (const item of items) {
      store.put(item);
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getHistoryFromDB = async (): Promise<ImageItem[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.getAll();
    request.onsuccess = () => {
      const result = request.result as ImageItem[];
      queueMicrotask(() => resolve(result.reverse()));
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteFromDB = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getVariationsByGroupId = async (groupId: string): Promise<ImageItem[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const allItems = request.result as ImageItem[];
      queueMicrotask(() => {
        const variations = allItems
          .filter((item) => item.groupId === groupId)
          .sort((a, b) => (a.variationIndex || 0) - (b.variationIndex || 0));
        resolve(variations);
      });
    };
    request.onerror = () => reject(request.error);
  });
};

// Template CRUD operations
export const saveTemplate = async (template: PromptTemplate): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TEMPLATES_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(TEMPLATES_STORE_NAME);
    const request = store.put(template);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getTemplates = async (): Promise<PromptTemplate[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TEMPLATES_STORE_NAME], 'readonly');
    const store = transaction.objectStore(TEMPLATES_STORE_NAME);
    const index = store.index('createdAt');
    const request = index.getAll();
    request.onsuccess = () => {
      const result = request.result as PromptTemplate[];
      queueMicrotask(() => resolve(result.reverse()));
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteTemplate = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TEMPLATES_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(TEMPLATES_STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getTemplatesByCategory = async (category: string): Promise<PromptTemplate[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TEMPLATES_STORE_NAME], 'readonly');
    const store = transaction.objectStore(TEMPLATES_STORE_NAME);
    const index = store.index('category');
    const request = index.getAll(category);
    request.onsuccess = () => {
      const templates = request.result as PromptTemplate[];
      queueMicrotask(() => {
        templates.sort((a, b) => b.createdAt - a.createdAt);
        resolve(templates);
      });
    };
    request.onerror = () => reject(request.error);
  });
};
