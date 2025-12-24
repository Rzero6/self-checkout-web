import { useState, useCallback, useEffect, useRef } from "react";
import { transactionApi } from "@/services/transaction_service";
import {
    TransactionStatus,
    type Transaction,
    type TransactionDetails,
} from "@/types/transaction_type";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

type LoadingState = {
    create: boolean;
    fetch: boolean;
    cancel: boolean;
};

export const useTransaction = (onPaymentSuccess?: () => void) => {
    const prevStatusRef = useRef<String | null>(null);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [details, setDetails] = useState<TransactionDetails[]>([]);
    const [loading, setLoading] = useState<LoadingState>({
        create: false,
        fetch: false,
        cancel: false,
    });

    const createTransaction = useCallback(async (paymentType: string) => {
        setLoading((l) => ({ ...l, create: true }));
        try {
            const result = await transactionApi.createTransaction(paymentType);
            if (!result) throw new Error("Failed to create transaction");

            setTransaction(result);
            return result;
        } catch (err) {
            toast.error("Failed to create transaction", {
                description: getErrorMessage(err),
            });
            return null;
        } finally {
            setLoading((l) => ({ ...l, create: false }));
        }
    }, []);

    const fetchTransaction = useCallback(async (orderId: string) => {
        setLoading((l) => ({ ...l, fetch: true }));
        try {
            const trx = await transactionApi.getTransaction(orderId);
            const trxDetails = await transactionApi.getTransactionDetails(orderId);

            if (trx) {
                setTransaction(trx);
                setDetails(trxDetails ?? []);
            }
        } catch (err) {
            toast.error("Failed to fetch transaction", {
                description: getErrorMessage(err),
            });
        } finally {
            setLoading((l) => ({ ...l, fetch: false }));
        }
    }, []);

    const cancelTransaction = useCallback(async (orderId: string) => {
        setLoading((l) => ({ ...l, cancel: true }));
        try {
            const trx = await transactionApi.createTransactionCancellation(orderId);
            if (!trx) throw new Error("Cancel failed");

            setTransaction(trx);
            toast.info("Transaction cancelled");
            return trx;
        } catch (err) {
            toast.error("Failed to cancel transaction", {
                description: getErrorMessage(err),
            });
            return null;
        } finally {
            setLoading((l) => ({ ...l, cancel: false }));
        }
    }, []);

    const resetTransaction = useCallback(() => {
        setTransaction(null);
        setDetails([]);
        prevStatusRef.current = null;
    }, [])
    
    // success side-effect
    useEffect(() => {
        if (
            prevStatusRef.current !== TransactionStatus.SUCCESS &&
            transaction?.status === TransactionStatus.SUCCESS
        ) {
            onPaymentSuccess?.();
        }

        prevStatusRef.current = transaction?.status ?? null;
    }, [transaction?.status, onPaymentSuccess]);

    return {
        transaction,
        details,
        loading,
        createTransaction,
        fetchTransaction,
        cancelTransaction,
        resetTransaction,
    };
};
