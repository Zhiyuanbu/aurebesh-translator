import { useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

interface TranslatorHook {
  clearText: () => void;
  copyToClipboard: () => void;
  setFontFamily: (family: string) => void;
  fontFamily: string;
}

export function useKeyboardShortcuts(translator: TranslatorHook) {
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'enter':
            // Ctrl+Enter doesn't need special handling as translation is real-time
            break;
          
          case 'c':
            if (!isTyping) {
              event.preventDefault();
              translator.copyToClipboard();
            }
            break;
          
          case 'l':
            event.preventDefault();
            translator.clearText();
            break;
          
          case 'd':
            event.preventDefault();
            toggleTheme();
            break;
          
          case 'f':
            event.preventDefault();
            const newFont = translator.fontFamily === 'aurebesh' ? 'aurebesh-code' : 'aurebesh';
            translator.setFontFamily(newFont);
            break;
        }
      }

      // Escape key to close any open dialogs
      if (event.key === 'Escape') {
        // This could be extended to close specific dialogs
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [translator, toggleTheme]);
}
