import { getErrorMessage } from "@/lib/utils";
import { productsApi } from "@/services/product_service";
import type { Product } from "@/types/product_type";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useProduct = () => {
    const [item, setItem] = useState<Product | null>(null);
    const [donationItems, setDonationItems] = useState<Product[] | null>([]);
    const [loading, setLoading] = useState(true);
    const effectRan = useRef(false);

    const fetchRandomItem = async (isCancelled: boolean = false) => {
        setLoading(true);
        try {
            const randomItem = await productsApi.getRandom();
            if (!isCancelled) setItem(randomItem);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch product", {
                description: getErrorMessage(error),
            });
        } finally {
            setLoading(false);
        }
    };
    const fetchDonationItems = async (isCancelled: boolean) => {
        try {
            const items = await productsApi.getAllDonations();
            console.log(isCancelled);
            if (!isCancelled) setDonationItems(items);
        } catch (error) {
            toast.error("Failed to fetch products", {
                description: getErrorMessage(error)
            });
        }
    };

    useEffect(() => {
        let isCancelled = false;

        if (!effectRan.current) {
            fetchRandomItem(isCancelled);
            fetchDonationItems(isCancelled);
        }

        return () => {
            isCancelled = true;
            effectRan.current = true;
        };
    }, []);


    return {
        item,
        donationItems,
        loading,
        fetchRandomItem,
    };
}