import { handleDeleteRequest, handleGetRequest, handlePatchRequest, handlePostRequest } from "@/lib/api";
import type { CartDetail, Cart, } from "../types/cart_type";

const apiGroupURL = "/cart";
export const cartApi = {
    createCart: async (): Promise<Cart | null> => {
        return handlePostRequest<Cart>(apiGroupURL, undefined, {
            requireSession: false,
        })
    },

    getCurrentCart: async (): Promise<Cart | null> => {
        return handleGetRequest<Cart>(apiGroupURL, {
            requireSession: true,
        });
    },

    getCurrentCartDetails: async (): Promise<CartDetail[] | null> => {
        return handleGetRequest<CartDetail[]>(`${apiGroupURL}/details`, {
            requireSession: true,
        })
    },

    addProduct: async (barcode: string, quantity: number): Promise<CartDetail | null> => {
        return handlePostRequest<CartDetail>(`${apiGroupURL}/detail`, {
            barcode: barcode,
            quantity: quantity,
        }, { requireSession: true })
    },

    updateQuantity: async (detailId: string, quantity: number): Promise<CartDetail | null> => {
        return handlePatchRequest<CartDetail>(`${apiGroupURL}/detail`, {
            id: detailId,
            quantity: quantity,
        }, { requireSession: true })
    },

    deleteDetail: async (detailId: string): Promise<CartDetail | null> => {
        return handleDeleteRequest<CartDetail>(`${apiGroupURL}/detail/${detailId}`, { requireSession: true })
    },

    deleteAllDetails: async (cartId: string): Promise<void | null> => {
        return handleDeleteRequest<void>(`${apiGroupURL}/${cartId}`, { requireSession: true })
    },
};
