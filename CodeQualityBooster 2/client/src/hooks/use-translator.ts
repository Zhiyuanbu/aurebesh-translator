import { useState, useCallback, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/clipboard";

interface TranslatorState {
  inputText: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
  textAlign: string;
  copySuccess: boolean;
}

const DEFAULT_STATE: TranslatorState = {
  inputText: "Welcome to the Aurebesh Translator!",
  fontSize: 24,
  lineHeight: 1.5,
  letterSpacing: 0.5,
  fontFamily: "aurebesh",
  textAlign: "center",
  copySuccess: false,
};

export function useTranslator() {
  const [state, setState] = useState<TranslatorState>(DEFAULT_STATE);
  const { toast } = useToast();

  // Real-time translation (Aurebesh fonts handle the visual translation)
  const translatedText = useMemo(() => state.inputText, [state.inputText]);

  // Character count
  const characterCount = useMemo(() => state.inputText.length, [state.inputText]);

  // Text statistics
  const stats = useMemo(() => {
    const text = state.inputText;
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    
    return { characters, words, lines };
  }, [state.inputText]);

  // Update functions
  const setInputText = useCallback((text: string) => {
    setState(prev => ({ ...prev, inputText: text }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    setState(prev => ({ ...prev, fontSize: size }));
  }, []);

  const setLineHeight = useCallback((height: number) => {
    setState(prev => ({ ...prev, lineHeight: height }));
  }, []);

  const setLetterSpacing = useCallback((spacing: number) => {
    setState(prev => ({ ...prev, letterSpacing: spacing }));
  }, []);

  const setFontFamily = useCallback((family: string) => {
    setState(prev => ({ ...prev, fontFamily: family }));
    toast({
      title: "Font changed",
      description: `Switched to ${family === 'aurebesh-code' ? 'Aurebesh Code' : 'Aurebesh Regular'}`,
    });
  }, [toast]);

  const setTextAlign = useCallback((align: string) => {
    setState(prev => ({ ...prev, textAlign: align }));
  }, []);

  const clearText = useCallback(() => {
    setState(prev => ({ ...prev, inputText: "", copySuccess: false }));
    toast({
      title: "Text cleared",
      description: "Input has been cleared.",
    });
  }, [toast]);

  const resetSettings = useCallback(() => {
    setState(prev => ({
      ...prev,
      fontSize: DEFAULT_STATE.fontSize,
      lineHeight: DEFAULT_STATE.lineHeight,
      letterSpacing: DEFAULT_STATE.letterSpacing,
      fontFamily: DEFAULT_STATE.fontFamily,
      textAlign: DEFAULT_STATE.textAlign,
    }));
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
    });
  }, [toast]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!translatedText.trim()) {
      toast({
        title: "Nothing to copy",
        description: "Please enter some text first.",
        variant: "destructive",
      });
      return;
    }

    const success = await copyToClipboard(translatedText);
    
    if (success) {
      setState(prev => ({ ...prev, copySuccess: true }));
      toast({
        title: "Copied!",
        description: "Text copied to clipboard successfully.",
      });
      
      // Reset copy success state after 2 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, copySuccess: false }));
      }, 2000);
    } else {
      toast({
        title: "Copy failed",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  }, [translatedText, toast]);

  // Reset copy success when text changes
  useEffect(() => {
    if (state.copySuccess) {
      setState(prev => ({ ...prev, copySuccess: false }));
    }
  }, [state.inputText]);

  return {
    inputText: state.inputText,
    translatedText,
    fontSize: state.fontSize,
    lineHeight: state.lineHeight,
    letterSpacing: state.letterSpacing,
    fontFamily: state.fontFamily,
    textAlign: state.textAlign,
    copySuccess: state.copySuccess,
    characterCount,
    stats,
    setInputText,
    setFontSize,
    setLineHeight,
    setLetterSpacing,
    setFontFamily,
    setTextAlign,
    clearText,
    resetSettings,
    copyToClipboard: handleCopyToClipboard,
  };
}
