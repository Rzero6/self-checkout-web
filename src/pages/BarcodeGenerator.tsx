import { BarcodeCard } from "@/components/barcode/BarcodeCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { BarcodeCardList } from "@/components/barcode/BarcodeCardList";
import { useProduct } from "@/hooks/useProduct";

const BarcodeGenerator = () => {
    const { item, donationItems, loading, fetchRandomItem } =
        useProduct();

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto py-6 flex flex-col items-center justify-center gap-6">
                <div className="w-full max-w-7xl px-6 mt-8 animate-fade-in">
                    {item && (
                        <BarcodeCard
                            barcode={item?.barcode ?? ""}
                            name={item?.name ?? ""}
                            price={item?.price ?? 0}
                            loading={loading}
                        />
                    )}
                    {!loading && !item && (
                        <p className="text-muted-foreground">No available product</p>
                    )}

                    <Button className="w-full mt-4 flex items-center justify-center" onClick={() => fetchRandomItem()} variant="outline" size="lg" disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        {loading ? "Loading Products" : "Refresh Barcode"}
                    </Button>
                </div>


                {/* Barcode list */}
                <div className="w-full max-w-7xl px-6 mt-8">
                    <BarcodeCardList products={donationItems ?? []} />
                </div>
            </main>
        </div>
    );
};

export default BarcodeGenerator;
