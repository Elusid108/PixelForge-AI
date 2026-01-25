import { create } from 'zustand';
import { ImageItem, GenerationOptions } from '../types';

interface AppState {
  // API Key
  apiKey: string;
  setApiKey: (key: string) => void;

  // History
  history: ImageItem[];
  setHistory: (history: ImageItem[]) => void;
  addToHistory: (item: ImageItem) => void;
  removeFromHistory: (id: string) => void;

  // Current Image
  currentImage: ImageItem | null;
  setCurrentImage: (image: ImageItem | null) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  // Generation Options
  generationOptions: GenerationOptions;
  setGenerationOptions: (options: Partial<GenerationOptions>) => void;
  resetGenerationOptions: () => void;

  // UI State
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  processingStatus: string | null;
  setProcessingStatus: (status: string | null) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showImageDetails: boolean;
  setShowImageDetails: (show: boolean) => void;
  selectedImageDetails: ImageItem | null;
  setSelectedImageDetails: (image: ImageItem | null) => void;
}

const defaultGenerationOptions: GenerationOptions = {
  prompt: '',
  negativePrompt: '',
  style: '',
  ratio: '1:1',
  lighting: '',
  mood: '',
};

export const useAppStore = create<AppState>((set) => ({
  // API Key
  apiKey: '',
  setApiKey: (key: string) => set({ apiKey: key }),

  // History
  history: [],
  setHistory: (history: ImageItem[]) => set({ history }),
  addToHistory: (item: ImageItem) =>
    set((state) => ({ history: [item, ...state.history] })),
  removeFromHistory: (id: string) =>
    set((state) => ({ history: state.history.filter((item) => item.id !== id) })),

  // Current Image
  currentImage: null,
  setCurrentImage: (image: ImageItem | null) => set({ currentImage: image }),
  selectedId: null,
  setSelectedId: (id: string | null) => set({ selectedId: id }),

  // Generation Options
  generationOptions: defaultGenerationOptions,
  setGenerationOptions: (options: Partial<GenerationOptions>) =>
    set((state) => ({
      generationOptions: { ...state.generationOptions, ...options },
    })),
  resetGenerationOptions: () => set({ generationOptions: defaultGenerationOptions }),

  // UI State
  showSettings: false,
  setShowSettings: (show: boolean) => set({ showSettings: show }),
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  error: null,
  setError: (error: string | null) => set({ error }),
  processingStatus: null,
  setProcessingStatus: (status: string | null) => set({ processingStatus: status }),
  toast: null,
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' } | null) => set({ toast }),
  showShortcuts: false,
  setShowShortcuts: (show: boolean) => set({ showShortcuts: show }),
  showImageDetails: false,
  setShowImageDetails: (show: boolean) => set({ showImageDetails: show }),
  selectedImageDetails: null,
  setSelectedImageDetails: (image: ImageItem | null) => set({ selectedImageDetails: image }),
}));
