import { useState } from "react";
import { BarcodeScanner } from "../components/checkout/BarcodeScanner";
import { ManualInput } from "../components/checkout/ManualInput";
import { CartList } from "../components/checkout/CartList";
import { PaymentModal } from "../components/checkout/PaymentModal";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";

const Index = () => {
    const { items, total, itemCount, loading, addItem, updateQuantity, removeItem, clearCart } =
        useCart();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const handleScan = (barcode: string) => {
        addItem(barcode);
    };

    const handleManualInput = (barcode: string, quantity: number) => {
        addItem(barcode, quantity);
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            toast.error("Empty Cart!");
            return;
        }
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        clearCart();
        toast.success("Transaction Done!", {
            description: "Thank you for your purchase.",
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-4">
                <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
                    {/* Left: Cart */}
                    <div className="order-2 lg:order-1 h-full min-h-100">
                        <CartList
                            items={items}
                            total={total}
                            itemCount={itemCount}
                            loading={loading}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                            onClear={clearCart}
                            onCheckout={handleCheckout}
                        />
                    </div>

                    {/* Right: Scanner & Manual Input */}
                    <div className="order-1 lg:order-2 flex flex-col gap-4 h-full">
                        <div className="flex-1 min-h-75">
                            <BarcodeScanner onScan={handleScan} />
                        </div>
                        <ManualInput onSubmit={handleManualInput} />
                    </div>
                </div>
            </main>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default Index;