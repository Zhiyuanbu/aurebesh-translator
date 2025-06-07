import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Image as ImageIcon, Scan, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Tesseract from "tesseract.js";

interface ImageScannerProps {
  onTextExtracted: (text: string) => void;
}

interface ScanResult {
  text: string;
  confidence: number;
  words: number;
}

export function ImageScanner({ onTextExtracted }: ImageScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImage = useCallback(async (imageFile: File) => {
    setIsScanning(true);
    setProgress(0);
    setScanResult(null);

    try {
      // Create image preview
      const imageUrl = URL.createObjectURL(imageFile);
      setSelectedImage(imageUrl);

      // Initialize Tesseract worker
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      // Perform OCR
      const { data } = await worker.recognize(imageFile);
      
      // Clean up worker
      await worker.terminate();

      const extractedText = data.text.trim();
      const confidence = Math.round(data.confidence);
      const wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length;

      if (extractedText) {
        const result: ScanResult = {
          text: extractedText,
          confidence,
          words: wordCount
        };
        
        setScanResult(result);
        onTextExtracted(extractedText);
        
        toast({
          title: "Text extracted successfully",
          description: `Found ${wordCount} words with ${confidence}% confidence`,
        });
      } else {
        toast({
          title: "No text found",
          description: "Could not extract text from this image. Try a clearer image with readable text.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Scan failed",
        description: "Failed to process the image. Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      setProgress(0);
    }
  }, [onTextExtracted, toast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      processImage(file);
    }
  }, [processImage, toast]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, [processImage]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    setScanResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-primary" />
          Image Text Scanner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload an image containing text to extract and translate it to Aurebesh
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {selectedImage ? (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Selected for scanning"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={clearImage}>
                  Clear Image
                </Button>
                <Button size="sm" onClick={openFileDialog}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Different
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Scanning Progress */}
        {isScanning && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Scanning image...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground text-center">
              {progress}% - Analyzing text content
            </p>
          </div>
        )}

        {/* Scan Results */}
        {scanResult && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Scan Results
              </h4>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {scanResult.words} words
                </Badge>
                <Badge 
                  variant={scanResult.confidence > 80 ? "default" : "secondary"}
                  className={scanResult.confidence > 80 ? "bg-green-600" : ""}
                >
                  {scanResult.confidence}% confidence
                </Badge>
              </div>
            </div>
            
            <div className="p-3 bg-background rounded border text-sm max-h-32 overflow-y-auto custom-scrollbar">
              {scanResult.text}
            </div>

            {scanResult.confidence < 70 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Low confidence detected</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Try using a clearer image with better lighting for more accurate text extraction.
                  </p>
                </div>
              </div>
            )}

            <Button 
              onClick={() => onTextExtracted(scanResult.text)} 
              size="sm" 
              className="w-full"
            >
              Use This Text
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Tips for better results:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use high-contrast images with clear, readable text</li>
            <li>• Ensure text is horizontal and not rotated</li>
            <li>• Avoid blurry or low-resolution images</li>
            <li>• Good lighting improves recognition accuracy</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}