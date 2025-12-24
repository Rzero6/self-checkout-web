import { handleGetRequest, handlePostRequest } from "@/lib/api";
import type { Transaction, TransactionDetails } from "@/types/transaction_type";

const apiGroupURL = "/transaction";

export const transactionApi = {
    createTransaction: async (paymentType: string): Promise<Transaction | null> => {
        return handlePostRequest(`${apiGroupURL}`, { payment_type: paymentType }, { requireSession: true })
    },
    getTransaction: async (orderId: string): Promise<Transaction | null> => {
        return handleGetRequest(`${apiGroupURL}/${orderId}`, { requireSession: true })
    },
    getTransactionDetails: async (orderId: string): Promise<TransactionDetails[] | null> => {
        return handleGetRequest(`${apiGroupURL}/${orderId}/details`, { requireSession: true })
    },
    createTransactionCancellation: async (orderId: string): Promise<Transaction | null> => {
        return handlePostRequest(`${apiGroupURL}/${orderId}/cancel`, undefined, { requireSession: true })
    },
};
