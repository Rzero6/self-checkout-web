import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/services/cart_service";
import { productsApi } from "@/services/product_service";
import { clearSessionId, getSessionId, setSessionId, getErrorMessage } from "@/lib/utils";
import type { Cart, CartDetail } from "@/types/cart_type";
import { toast } from "sonner";

type CartResponse = {
  cart: Cart | null;
  items: CartDetail[];
};

const CART_QUERY_KEY = ["cart"];

let ensureSessionPromise: Promise<void> | null = null;

export const useCart = () => {
  const queryClient = useQueryClient();

  /* ---------------- SESSION ---------------- */
  const ensureCartSession = useCallback(async (): Promise<void> => {
    if (ensureSessionPromise) return ensureSessionPromise;

    ensureSessionPromise = (async () => {
      let sessionId = getSessionId();
      let cart = sessionId ? await cartApi.getCurrentCart() : null;

      if (!cart) {
        const createdCart = await cartApi.createCart();
        if (!createdCart?.session_id) {
          throw new Error("Failed to create cart session");
        }
        setSessionId(createdCart.session_id);
      }
    })();

    return ensureSessionPromise;
  }, []);

  /* ---------------- QUERY ---------------- */
  const cartQuery = useQuery<CartResponse>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      await ensureCartSession();

      const [cart, items] = await Promise.all([
        cartApi.getCurrentCart(),
        cartApi.getCurrentCartDetails(),
      ]);

      return {
        cart,
        items: items ?? [],
      };
    },
    staleTime: 1000 * 30,
  });

  /* ---------------- MUTATIONS ---------------- */
  const addItem = useCallback(
    async (barcode: string, quantity: number = 1) => {
      try {
        const product = await productsApi.searchByBarcode(barcode);
        if (!product) {
          toast.error("Product not found", {
            description: `Barcode: ${barcode}`,
          });
          return false;
        }

        await cartApi.addProduct(product.barcode, quantity);
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

        toast.success(`${product.name} added`, {
          description: `Quantity: ${quantity}`,
        });

        return true;
      } catch (error) {
        toast.error("Failed to add product", {
          description: getErrorMessage(error),
        });
        return false;
      }
    },
    [queryClient]
  );

  const updateQuantity = useCallback(
    async (detailId: string, quantity: number) => {
      try {
        if (quantity <= 0) {
          await removeItem(detailId);
          return;
        }

        await cartApi.updateQuantity(detailId, quantity);
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      } catch (error) {
        toast.error("Failed to update quantity", {
          description: getErrorMessage(error),
        });
      }
    },
    [queryClient]
  );

  const removeItem = useCallback(
    async (detailId: string) => {
      try {
        const item = cartQuery.data?.items.find((i) => i.id === detailId);

        await cartApi.deleteDetail(detailId);
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

        if (item) toast.info(`${item.product_name} removed from cart`);
      } catch (error) {
        toast.error("Failed to remove product", {
          description: getErrorMessage(error),
        });
      }
    },
    [cartQuery.data?.items, queryClient]
  );

  const clearCart = useCallback(async () => {
    const cartId = cartQuery.data?.cart?.id;
    if (!cartId) return;

    try {
      await cartApi.deleteAllDetails(cartId);
      clearSessionId();

      ensureSessionPromise = null;
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

      toast.info("Cart emptied");
    } catch (error) {
      toast.error("Failed to empty the cart", {
        description: getErrorMessage(error),
      });
    }
  }, [cartQuery.data?.cart?.id, queryClient]);

  const startNewCart = useCallback(async () => {
    try {
      // Clear existing session
      clearSessionId();
      ensureSessionPromise = null;

      // Create new cart
      const newCart = await cartApi.createCart();
      if (!newCart?.session_id) {
        throw new Error("Failed to create new cart session");
      }
      setSessionId(newCart.session_id);

      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

      toast.success("New cart started");
    } catch (error) {
      toast.error("Failed to start new cart", {
        description: getErrorMessage(error),
      });
    }
  }, [cartQuery.data?.cart?.id, queryClient]);

  /* ---------------- DERIVED ---------------- */
  const items = cartQuery.data?.items ?? [];
  const total = items.reduce((s, i) => s + (i.subtotal ?? 0), 0);
  const itemCount = items.reduce((s, i) => s + (i.quantity ?? 0), 0);
  const loading = cartQuery.isLoading;

  return {
    items,
    total,
    itemCount,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    startNewCart,
  };
};
