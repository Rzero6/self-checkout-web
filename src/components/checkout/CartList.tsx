import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { CartItem } from "./CartItem";
import { formatPrice } from "@/lib/utils";
import type { CartDetail } from "@/types/cart_type";

interface CartListProps {
    items: CartDetail[];
    total: number;
    itemCount: number;
    loading: boolean;
    onUpdateQuantity: (detailId: string, quantity: number) => void;
    onRemove: (detailId: string) => void;
    onClear: () => void;
    onCheckout: () => void;
}

export const CartList = ({
    items,
    total,
    itemCount,
    loading,
    onUpdateQuantity,
    onRemove,
    onClear,
    onCheckout,
}: CartListProps) => {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Shopping Cart
                        {itemCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </CardTitle>
                    {items.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={onClear}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete All
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 p-0">
                {loading && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                        <div className="flex flex-col items-center gap-4 animate-fade-in">
                            {/* Spinner */}
                            <div className="relative h-12 w-12">
                                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                            </div>

                            {/* Text */}
                            <p className="text-sm text-muted-foreground tracking-wide">
                                Preparing your cart...
                            </p>
                        </div>
                    </div>
                )
                }
                {!loading && items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                        <ShoppingCart className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-center">Empty Cart</p>
                        <p className="text-sm text-center">Scan barcode to add product.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-full px-4">
                        <div className="space-y-2 pb-4">
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={onUpdateQuantity}
                                    onRemove={onRemove}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>

            {items.length > 0 && (
                <CardFooter className="flex-col gap-4 border-t pt-4">
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal ({itemCount} item)</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">{formatPrice(total)}</span>
                        </div>
                    </div>
                    <Button onClick={onCheckout} className="w-full h-12 text-lg font-semibold">
                        Pay Now
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};
