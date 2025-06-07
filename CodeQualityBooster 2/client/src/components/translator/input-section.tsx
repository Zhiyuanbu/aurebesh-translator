import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit3, X, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  characterCount: number;
}

export function InputSection({ value, onChange, onClear, characterCount }: InputSectionProps) {
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      toast({
        title: "Text pasted",
        description: "Content has been pasted from clipboard.",
      });
    } catch (error) {
      toast({
        title: "Paste failed",
        description: "Please use Ctrl+V to paste manually.",
        variant: "destructive",
      });
    }
  };

  const sampleTexts = [
    "Welcome to the Aurebesh Translator!",
    "May the Force be with you!",
    "In a galaxy far, far away...",
    "These are not the droids you're looking for.",
    "Do or do not, there is no try.",
    "The Force will be with you, always.",
  ];

  const insertSampleText = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    onChange(randomText);
    toast({
      title: "Sample text inserted",
      description: randomText,
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            Input Text
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {characterCount} characters
            </Badge>
            {value && (
              <Button variant="ghost" size="sm" onClick={onClear}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Textarea
          placeholder="Type or paste your text here... (Ctrl+Enter to translate)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[160px] resize-none custom-scrollbar"
          autoFocus
        />
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={insertSampleText}
            className="text-xs"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Sample Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePaste}
            className="text-xs"
          >
            <Clipboard className="w-3 h-3 mr-1" />
            Paste
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
