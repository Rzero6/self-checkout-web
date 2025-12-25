import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { Card, CardContent } from "../ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface BarcodeCardProps {
    barcode: string;
    name: string;
    price: number;
    loading?: boolean; // new prop
}

export const BarcodeCard = ({ barcode, name, price, loading = false }: BarcodeCardProps) => {
    const barcodeRef = useRef<SVGSVGElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!loading && barcodeRef.current) {
            JsBarcode(barcodeRef.current, barcode, {
                format: "CODE128",
                width: 3,
                height: 100,
                displayValue: true,
                fontSize: 18,
                font: "JetBrains Mono",
                margin: 20,
                background: "transparent",
                lineColor: "currentColor",
            });
        }
    }, [barcode, loading]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(barcode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
            toast.success("Barcode copied");
        } catch {
            toast.error("Failed to copy barcode");
        }
    };

    return (
        <Card className="animate-fade-in">
            <CardContent className="p-6 space-y-3 text-center">
                {loading ? (
                    <Skeleton className="w-full h-62" />
                ) : (
                    <>
                        <div className="flex justify-center bg-secondary/30 rounded-lg p-4">
                            <svg ref={barcodeRef} className="max-w-full" />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div>
                                <h3 className="font-semibold text-base line-clamp-1">{name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {formatPrice(price)}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="flex items-center gap-2"
                                disabled={copied}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-success" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </>
                )
                }
            </CardContent >
        </Card >
    );
};
