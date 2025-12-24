import { handleGetRequest } from "@/lib/api";
import { type Product } from "../types/product_type";

const apiGroupURL = "/products";

export const productsApi = {
  getAll: async (): Promise<Product[] | null> => {
    return handleGetRequest(apiGroupURL, { requireSession: false })
  },

  getAllDonations: async (): Promise<Product[] | null> => {
    return handleGetRequest(`${apiGroupURL}/donations`, { requireSession: false })
  },

  searchByBarcode: async (barcode: string): Promise<Product | null> => {
    return handleGetRequest(`${apiGroupURL}/search`, { requireSession: false, params: { barcode: barcode } })
  },

  getRandom: async (): Promise<Product | null> => {
    return handleGetRequest(`${apiGroupURL}/random`, { requireSession: false })
  },
};
