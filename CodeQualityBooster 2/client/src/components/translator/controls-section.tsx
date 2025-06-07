import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, RotateCcw, AlignLeft, AlignCenter, AlignRight, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlsSectionProps {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
  textAlign: string;
  onFontSizeChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
  onLetterSpacingChange: (value: number) => void;
  onFontFamilyChange: (value: string) => void;
  onTextAlignChange: (value: string) => void;
  onReset: () => void;
  stats: {
    characters: number;
    words: number;
    lines: number;
  };
}

export function ControlsSection({
  fontSize,
  lineHeight,
  letterSpacing,
  fontFamily,
  textAlign,
  onFontSizeChange,
  onLineHeightChange,
  onLetterSpacingChange,
  onFontFamilyChange,
  onTextAlignChange,
  onReset,
  stats,
}: ControlsSectionProps) {
  const alignments = [
    { value: 'left', icon: AlignLeft, label: 'Left' },
    { value: 'center', icon: AlignCenter, label: 'Center' },
    { value: 'right', icon: AlignRight, label: 'Right' },
  ];

  return (
    <div className="space-y-6">
      {/* Font Controls */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Font Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Selection */}
          <div className="space-y-2">
            <Label htmlFor="font-select">Font Style</Label>
            <Select value={fontFamily} onValueChange={onFontFamilyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aurebesh">Aurebesh Regular</SelectItem>
                <SelectItem value="aurebesh-code">Aurebesh Code</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>
              Font Size: <Badge variant="secondary">{fontSize}px</Badge>
            </Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => onFontSizeChange(value[0])}
              min={12}
              max={72}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12px</span>
              <span>72px</span>
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-2">
            <Label>
              Line Height: <Badge variant="secondary">{lineHeight}</Badge>
            </Label>
            <Slider
              value={[lineHeight]}
              onValueChange={(value) => onLineHeightChange(value[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-2">
            <Label>
              Letter Spacing: <Badge variant="secondary">{letterSpacing}px</Badge>
            </Label>
            <Slider
              value={[letterSpacing]}
              onValueChange={(value) => onLetterSpacingChange(value[0])}
              min={-2}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Text Alignment */}
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <div className="flex gap-1">
              {alignments.map((alignment) => {
                const Icon = alignment.icon;
                return (
                  <Button
                    key={alignment.value}
                    variant={textAlign === alignment.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onTextAlignChange(alignment.value)}
                    className={cn(
                      "flex-1",
                      textAlign === alignment.value && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Characters:</span>
            <Badge variant="secondary">{stats.characters}</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Words:</span>
            <Badge variant="secondary">{stats.words}</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Lines:</span>
            <Badge variant="secondary">{stats.lines}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
