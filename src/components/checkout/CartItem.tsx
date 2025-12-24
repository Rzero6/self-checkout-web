import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/utils";
import type { CartDetail } from "@/types/cart_type";

interface CartItemProps {
    item: CartDetail;
    onUpdateQuantity: (detailId: string, quantity: number) => void;
    onRemove: (detailId: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
    return (
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg animate-fade-in">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{item.product_name}</h4>
                <p className="text-sm font-mono text-muted-foreground">{formatPrice(item.price)}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <p className="font-semibold text-primary">
                    {formatPrice(item.subtotal)}
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-mono font-medium">
                        {item.quantity}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRemove(item.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
