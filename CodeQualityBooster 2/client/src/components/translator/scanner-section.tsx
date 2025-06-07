import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageScanner } from "./image-scanner";
import { QRScanner } from "./qr-scanner";
import { Camera, QrCode } from "lucide-react";

interface ScannerSectionProps {
  onTextExtracted: (text: string) => void;
}

export function ScannerSection({ onTextExtracted }: ScannerSectionProps) {
  return (
    <Tabs defaultValue="image" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="image" className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Image OCR
        </TabsTrigger>
        <TabsTrigger value="qr" className="flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          QR Scanner
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="image" className="mt-4">
        <ImageScanner onTextExtracted={onTextExtracted} />
      </TabsContent>
      
      <TabsContent value="qr" className="mt-4">
        <QRScanner onTextExtracted={onTextExtracted} />
      </TabsContent>
    </Tabs>
  );
}