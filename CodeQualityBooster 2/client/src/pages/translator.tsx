import { Header } from "@/components/translator/header";
import { InputSection } from "@/components/translator/input-section";
import { OutputSection } from "@/components/translator/output-section";
import { ControlsSection } from "@/components/translator/controls-section";
import { PreviewSection } from "@/components/translator/preview-section";
import { useTranslator } from "@/hooks/use-translator";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function TranslatorPage() {
  const translator = useTranslator();
  useKeyboardShortcuts(translator);

  return (
    <div className="min-h-screen bg-aurebesh-background dark:bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <InputSection 
              value={translator.inputText}
              onChange={translator.setInputText}
              onClear={translator.clearText}
              characterCount={translator.characterCount}
            />
            
            <OutputSection
              text={translator.translatedText}
              fontSize={translator.fontSize}
              lineHeight={translator.lineHeight}
              letterSpacing={translator.letterSpacing}
              fontFamily={translator.fontFamily}
              textAlign={translator.textAlign}
              onCopy={translator.copyToClipboard}
              copySuccess={translator.copySuccess}
            />
          </div>
          
          <div>
            <ControlsSection
              fontSize={translator.fontSize}
              lineHeight={translator.lineHeight}
              letterSpacing={translator.letterSpacing}
              fontFamily={translator.fontFamily}
              textAlign={translator.textAlign}
              onFontSizeChange={translator.setFontSize}
              onLineHeightChange={translator.setLineHeight}
              onLetterSpacingChange={translator.setLetterSpacing}
              onFontFamilyChange={translator.setFontFamily}
              onTextAlignChange={translator.setTextAlign}
              onReset={translator.resetSettings}
              stats={translator.stats}
            />
          </div>
        </div>
        
        <PreviewSection />
      </main>
    </div>
  );
}
