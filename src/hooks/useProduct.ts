import { getErrorMessage } from "@/lib/utils";
import { productsApi } from "@/services/product_service";
import type { Product } from "@/types/product_type";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProduct = () => {
    const {
        data: item,
        isFetching: fetchingItem,
        refetch: fetchRandomItem,
    } = useQuery<Product>({
        queryKey: ["randomProduct"],
        queryFn: async () => {
            try {
                const result = await productsApi.getRandom();
                if (!result) throw new Error("Product not found");
                return result;
            } catch (error) {
                toast.error("Failed to fetch product", {
                    description: getErrorMessage(error),
                });
                throw error;
            }
        },
        staleTime: 1000 * 30,
    });

    const {
        data: donationItems,
        isFetching: fetchingDonations,
    } = useQuery<Product[]>({
        queryKey: ["donationProducts"],
        queryFn: async () => {
            try {
                const result = await productsApi.getAllDonations();
                return result ?? [];
            } catch (error) {
                toast.error("Failed to fetch donation products", {
                    description: getErrorMessage(error),
                });
                throw error;
            }
        },
        staleTime: 1000 * 60,
    });

    return {
        item,
        donationItems: donationItems ?? [],
        loading: fetchingItem || fetchingDonations,
        fetchRandomItem,
    };
};
