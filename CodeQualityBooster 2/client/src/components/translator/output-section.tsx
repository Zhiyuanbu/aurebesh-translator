import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputSectionProps {
  text: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
  textAlign: string;
  onCopy: () => void;
  copySuccess: boolean;
}

export function OutputSection({ 
  text, 
  fontSize, 
  lineHeight, 
  letterSpacing, 
  fontFamily, 
  textAlign, 
  onCopy, 
  copySuccess 
}: OutputSectionProps) {
  const fontClass = fontFamily === 'aurebesh-code' ? 'font-aurebesh-code' : 'font-aurebesh';
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-aurebesh-secondary" />
            Aurebesh Translation
          </CardTitle>
          <Button
            onClick={onCopy}
            variant="outline"
            size="sm"
            className={cn(
              "transition-all duration-200",
              copySuccess && "bg-aurebesh-success text-white hover:bg-aurebesh-success/90"
            )}
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className={cn(
            "min-h-[160px] p-4 bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg",
            "custom-scrollbar overflow-auto break-words",
            fontClass
          )}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            letterSpacing: `${letterSpacing}px`,
            textAlign: textAlign as any,
          }}
        >
          {text || (
            <span className="text-muted-foreground text-base font-sans">
              Your Aurebesh translation will appear here...
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
