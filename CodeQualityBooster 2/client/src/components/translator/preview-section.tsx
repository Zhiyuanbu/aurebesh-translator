import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Info } from "lucide-react";

export function PreviewSection() {
  const sampleTexts = [
    {
      english: "May the Force be with you",
      description: "Classic Star Wars greeting",
    },
    {
      english: "A long time ago in a galaxy far, far away...",
      description: "Opening crawl text",
    },
    {
      english: "Hello World 2024",
      description: "Mixed text with numbers",
    },
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Font Preview & Character Reference
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Aurebesh Regular Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Aurebesh Regular (AF)</h3>
              <Badge variant="outline">Regular</Badge>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Uppercase Letters:</p>
                <p className="font-aurebesh text-2xl text-foreground">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Lowercase Letters:</p>
                <p className="font-aurebesh text-2xl text-foreground">abcdefghijklmnopqrstuvwxyz</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Numbers:</p>
                <p className="font-aurebesh text-2xl text-foreground">0123456789</p>
              </div>
            </div>
          </div>

          {/* Aurebesh Code Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Aurebesh Code</h3>
              <Badge variant="outline">Monospace</Badge>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Uppercase Letters:</p>
                <p className="font-aurebesh-code text-2xl text-foreground">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Lowercase Letters:</p>
                <p className="font-aurebesh-code text-2xl text-foreground">abcdefghijklmnopqrstuvwxyz</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Numbers:</p>
                <p className="font-aurebesh-code text-2xl text-foreground">0123456789</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Translations */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Sample Translations</h3>
          <div className="grid gap-4">
            {sampleTexts.map((sample, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">English:</span>
                  <Badge variant="secondary" className="text-xs">{sample.description}</Badge>
                </div>
                <p className="text-foreground">{sample.english}</p>
                <div className="text-sm text-muted-foreground">Aurebesh:</div>
                <p className="font-aurebesh text-xl text-foreground">{sample.english}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Quick Reference
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Aurebesh is the writing system used in the Star Wars universe. Simply type any text above and it will be displayed using authentic Aurebesh fonts. The characters map directly to the English alphabet, so "A" becomes the Aurebesh equivalent of "A".
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
