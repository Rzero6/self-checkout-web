import { BarcodeCard } from "./BarcodeCard";

interface Product {
    id: string;
    name: string;
    price: number;
    barcode: string;
}

interface BarcodeCardListProps {
    products: Product[];
}

export const BarcodeCardList = ({ products }: BarcodeCardListProps) => {
    if (products.length) {
        return (
            <div
                className="
            grid gap-4
            grid-cols-1
            sm:grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
          "
            >
                {products.map((product) => (
                    <BarcodeCard
                        key={product.id}
                        barcode={product.barcode}
                        name={product.name}
                        price={product.price}
                    />
                ))}
            </div>
        );
    }

};
