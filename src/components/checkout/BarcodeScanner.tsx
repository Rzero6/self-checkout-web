import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Camera, CameraOff, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useBarcodeScanner } from "../../hooks/useBarcodeScanner";

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
}

export const BarcodeScanner = forwardRef(({ onScan }: BarcodeScannerProps, ref) => {
    const { videoRef, isScanning, lastScannedCode, error, startScanning, stopScanning } =
        useBarcodeScanner(onScan);

    useImperativeHandle(ref, () => ({
        startScanning,
        stopScanning,
    }))

    useEffect(() => {
        startScanning();
        return () => stopScanning();
    }, []);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5 text-primary" />
                    Scanner Barcode
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="relative flex-1 min-h-75 bg-muted rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        playsInline
                        muted
                    />

                    {isScanning && <div className="scanner-overlay" />}

                    {/* Scanner frame overlay */}
                    {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3/4 h-1/2 border-2 border-primary rounded-lg relative">
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                            </div>
                        </div>
                    )}

                    {!isScanning && !error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                            <div className="text-center">
                                <CameraOff className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">Camera is not available</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                            <div className="text-center p-4">
                                <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-2" />
                                <p className="text-destructive font-medium">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={isScanning ? stopScanning : startScanning}
                        variant={isScanning ? "outline" : "default"}
                        className="flex-1"
                    >
                        {isScanning ? (
                            <>
                                <CameraOff className="h-4 w-4 mr-2" />
                                Stop Scanner
                            </>
                        ) : (
                            <>
                                <Camera className="h-4 w-4 mr-2" />
                                Start Scanner
                            </>
                        )}
                    </Button>
                </div>

                {lastScannedCode && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-sm text-muted-foreground">Last scanned:</p>
                        <p className="font-mono font-medium text-primary">{lastScannedCode}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
