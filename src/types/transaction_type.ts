export interface TransactionDetails {
    product_name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface Transaction {
    order_id: string;
    amount: number;
    status: string;
    payment_type: string;
    expire_time: Date;
    details: TransactionDetails;
}

export interface QrisTransaction extends Transaction {
    qris_link: string;
}

export const isQrisTransaction = (
    trx: Transaction
): trx is QrisTransaction => {
    return trx.payment_type === "qris" && "qris_link" in trx;
};

export const TransactionStatus = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    CANCELLED: "CANCELLED",
    FAILED: "FAILED",
    EXPIRED: "EXPIRED",
}