import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const cmdOrCtrl = isMac ? '⌘' : 'Ctrl';

interface ShortcutItem {
  keys: string[];
  description: string;
}

const shortcuts: ShortcutItem[] = [
  { keys: [cmdOrCtrl, 'R'], description: 'Randomize prompt' },
  { keys: [cmdOrCtrl, 'G'], description: 'Generate image' },
  { keys: [cmdOrCtrl, 'K'], description: 'Focus prompt input' },
  { keys: [cmdOrCtrl, '/'], description: 'Show/hide shortcuts' },
  { keys: ['Esc'], description: 'Close modals' },
  { keys: ['Space'], description: 'Quick randomize (when prompt focused)' },
];

export const ShortcutsModal: React.FC = () => {
  const { showShortcuts, setShowShortcuts } = useAppStore();

  if (!showShortcuts) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={() => setShowShortcuts(false)}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Keyboard className="w-6 h-6" />
            <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShowShortcuts(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <span className="text-sm text-gray-300">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-800 border border-gray-700 rounded">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-gray-500 text-xs">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            Press {cmdOrCtrl} + / to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
};
