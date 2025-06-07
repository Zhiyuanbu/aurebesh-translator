import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Upload, Camera, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onTextExtracted: (text: string) => void;
}

export function QRScanner({ onTextExtracted }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const processQRCode = useCallback(async (imageFile: File) => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const imageUrl = URL.createObjectURL(imageFile);
      setSelectedImage(imageUrl);

      // Create image element for canvas processing
      const img = new Image();
      img.onload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Use jsQR library for QR code detection
        try {
          const { default: jsQR } = await import('jsqr');
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            setScanResult(code.data);
            onTextExtracted(code.data);
            toast({
              title: "QR code detected",
              description: "Text extracted successfully from QR code",
            });
          } else {
            toast({
              title: "No QR code found",
              description: "Could not detect a QR code in this image",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "QR scanner unavailable",
            description: "QR code scanning library could not be loaded",
            variant: "destructive",
          });
        }
        
        setIsScanning(false);
        URL.revokeObjectURL(imageUrl);
      };

      img.onerror = () => {
        toast({
          title: "Invalid image",
          description: "Could not load the selected image",
          variant: "destructive",
        });
        setIsScanning(false);
        URL.revokeObjectURL(imageUrl);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('QR Code scanning error:', error);
      toast({
        title: "Scan failed",
        description: "Failed to process the QR code image",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  }, [onTextExtracted, toast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file containing a QR code",
          variant: "destructive",
        });
        return;
      }

      processQRCode(file);
    }
  }, [processQRCode, toast]);

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
          <QrCode className="w-5 h-5 text-primary" />
          QR Code Scanner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Scan QR codes to extract text for Aurebesh translation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas ref={canvasRef} className="hidden" />
        
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
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
                alt="QR code for scanning"
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
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Click to upload QR code image</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports JPG, PNG, GIF files
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload QR Code
              </Button>
            </div>
          )}
        </div>

        {isScanning && (
          <div className="flex items-center justify-center gap-2 py-4">
            <QrCode className="w-4 h-4 animate-pulse text-primary" />
            <span className="text-sm">Scanning QR code...</span>
          </div>
        )}

        {scanResult && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <h4 className="font-medium">QR Code Content</h4>
              <Badge variant="default" className="bg-green-600">
                Success
              </Badge>
            </div>
            
            <div className="p-3 bg-background rounded border text-sm max-h-32 overflow-y-auto custom-scrollbar">
              {scanResult}
            </div>

            <Button 
              onClick={() => onTextExtracted(scanResult)} 
              size="sm" 
              className="w-full"
            >
              Use This Text
            </Button>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            QR Code Tips:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Ensure the QR code is clearly visible and not damaged</li>
            <li>• Use good lighting for better recognition</li>
            <li>• Make sure the entire QR code is within the image frame</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}