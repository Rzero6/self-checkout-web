import { useState } from "react";
import { Plus, Barcode } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ManualInputProps {
    onSubmit: (barcode: string, quantity: number) => void;
}

export const ManualInput = ({ onSubmit }: ManualInputProps) => {
    const [barcode, setBarcode] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (barcode.trim()) {
            onSubmit(barcode.trim(), quantity);
            setBarcode("");
            setQuantity(1);
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Barcode className="h-5 w-5 text-primary" />
                    Input Manual
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="barcode">Barcode</Label>
                            <Input
                                id="barcode"
                                type="text"
                                placeholder="Masukkan barcode..."
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={!barcode.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
