import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

interface UseBarcodeScanner {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isScanning: boolean;
  lastScannedCode: string | null;
  error: string | null;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
}

export const useBarcodeScanner = (
  onScan: (barcode: string) => void
): UseBarcodeScanner => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setError(null);
      codeReaderRef.current = new BrowserMultiFormatReader();
      
      const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        setError("Tidak ada kamera yang ditemukan");
        return;
      }

      // Prefer back camera on mobile
      const selectedDevice = videoInputDevices.find(
        (device) => device.label.toLowerCase().includes("back")
      ) || videoInputDevices[0];

      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDevice.deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const now = Date.now();
            // Debounce: only accept scan if 1.5 seconds have passed
            if (now - lastScanTimeRef.current > 1500) {
              lastScanTimeRef.current = now;
              const code = result.getText();
              setLastScannedCode(code);
              onScan(code);
            }
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error("Scan error:", err);
          }
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
    }
  }, [onScan]);

  const stopScanning = useCallback(() => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    videoRef,
    isScanning,
    lastScannedCode,
    error,
    startScanning,
    stopScanning,
  };
};
