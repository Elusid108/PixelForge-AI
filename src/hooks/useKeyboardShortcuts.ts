import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useRandomizer } from './useRandomizer';
import { useImageGeneration } from './useImageGeneration';

export const useKeyboardShortcuts = () => {
  const {
    showSettings,
    setShowSettings,
    showShortcuts,
    setShowShortcuts,
    showImageDetails,
    setShowImageDetails,
  } = useAppStore();
  const { randomize } = useRandomizer();
  const { generate } = useImageGeneration();
  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Prevent shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Space shortcut when prompt textarea is focused
        if (e.key === ' ' && target.tagName === 'TEXTAREA' && !e.shiftKey && !ctrlOrCmd) {
          e.preventDefault();
          randomize();
          return;
        }
        // Allow Ctrl/Cmd + K to focus prompt
        if (ctrlOrCmd && e.key === 'k') {
          e.preventDefault();
          const textarea = document.querySelector('textarea[placeholder*="futuristic"]') as HTMLTextAreaElement;
          if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
          }
          return;
        }
        // Allow Esc to close modals even when in input
        if (e.key === 'Escape') {
          if (showSettings) {
            setShowSettings(false);
            return;
          }
          if (showShortcuts) {
            setShowShortcuts(false);
            return;
          }
          if (showImageDetails) {
            setShowImageDetails(false);
            return;
          }
        }
        // Don't process other shortcuts when in input
        return;
      }

      // Ctrl/Cmd + R - Randomize
      if (ctrlOrCmd && e.key === 'r') {
        e.preventDefault();
        randomize();
        return;
      }

      // Ctrl/Cmd + G - Generate
      if (ctrlOrCmd && e.key === 'g') {
        e.preventDefault();
        generate();
        return;
      }

      // Ctrl/Cmd + K - Focus prompt
      if (ctrlOrCmd && e.key === 'k') {
        e.preventDefault();
        const textarea = document.querySelector('textarea[placeholder*="futuristic"]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
        return;
      }

      // Ctrl/Cmd + / - Show shortcuts help
      if (ctrlOrCmd && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
        return;
      }

      // Esc - Close modals, exit selection mode
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
          return;
        }
        if (showShortcuts) {
          setShowShortcuts(false);
          return;
        }
        if (showImageDetails) {
          setShowImageDetails(false);
          return;
        }
        // Could add exit selection mode here if needed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    randomize,
    generate,
    showSettings,
    setShowSettings,
    showShortcuts,
    setShowShortcuts,
    showImageDetails,
    setShowImageDetails,
  ]);

  return { promptTextareaRef };
};
