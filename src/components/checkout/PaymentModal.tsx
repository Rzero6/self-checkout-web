import {
    QrCode,
    CheckCircle2,
    XCircle,
    Loader2,
    FileDown,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import Countdown from "react-countdown";
import { formatPrice } from "@/lib/utils";
import { isQrisTransaction, TransactionStatus } from "@/types/transaction_type";
import { useTransaction } from "@/hooks/useTransaction";
import { useEffect, useState } from "react";
import { PaymentOption } from "./PaymentOptions";
import { paymentMethods } from "@/data/paymentMethods";
import { Input } from "../ui/input";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
}

export const PaymentModal = ({
    isOpen,
    onClose,
    onPaymentSuccess,
}: PaymentModalProps) => {
    const {
        transaction,
        details,
        loading,
        fetchTransaction,
        createTransaction,
        cancelTransaction,
        resetTransaction,
        createInvoice,
    } = useTransaction(onPaymentSuccess);
    const [email, setEmail] = useState("");

    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const handleCreateNewPayment = () => {
        setPaymentMethod(null);
        resetTransaction();
    }

    const handleCreateTransaction = () => {
        if (!paymentMethod) return;
        createTransaction(paymentMethod);
    };
    const handleClose = () => {
        if (loading.invoice) return;
        setEmail("");
        if (transaction?.status !== TransactionStatus.PENDING) {
            resetTransaction();
            setPaymentMethod(null);
        }
        onClose();
    };
    // silent polling
    useEffect(() => {
        if (
            !isOpen ||
            !transaction ||
            transaction.status !== TransactionStatus.PENDING
        ) return;

        const interval = setInterval(() => {
            console.log("Silent polling active.");
            fetchTransaction(transaction.order_id);
        }, 5000);

        return () => clearInterval(interval);
    }, [isOpen, transaction?.order_id, transaction?.status]);


    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <QrCode className="h-6 w-6 text-primary" />
                        Payment
                    </DialogTitle>
                    <DialogDescription>
                        {!paymentMethod
                            && "Choose a payment method to continue."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* ===== NO TRANSACTION ===== */}
                    {!transaction && (
                        <>
                            <RadioGroup
                                value={paymentMethod ?? ""}
                                onValueChange={setPaymentMethod}
                                className="space-y-3"
                            >
                                {paymentMethods.map((method) => (
                                    <PaymentOption
                                        key={method.value}
                                        value={method.value}
                                        label={method.label}
                                        logo={method.logo}
                                        selected={paymentMethod === method.value}
                                    />
                                ))}
                            </RadioGroup>

                            <Button
                                onClick={handleCreateTransaction}
                                disabled={!paymentMethod || loading.create}
                                className="w-full"
                            >
                                {loading.create && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Create Transaction
                            </Button>
                        </>
                    )}

                    {/* ===== PENDING ===== */}
                    {transaction?.status === TransactionStatus.PENDING && (
                        <div className="flex flex-col items-center gap-4">
                            {isQrisTransaction(transaction) && (
                                <div className="relative">
                                    <img
                                        src={transaction.qris_link}
                                        alt="QRIS"
                                        className="rounded-lg border w-56 h-56"
                                    />
                                    {loading.fetch && (
                                        <Loader2 className="absolute top-2 right-2 h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            )}

                            <p className="text-secondary-foreground">
                                Expired in:{" "}
                                <Countdown
                                    date={new Date(transaction.expire_time)}
                                    daysInHours
                                />
                            </p>

                            <p className="text-xl font-bold">
                                {formatPrice(transaction.amount)}
                            </p>

                            <div className="flex gap-2 w-full">
                                <Button
                                    className="flex-1 flex items-center justify-center gap-2"
                                    onClick={() => fetchTransaction(transaction.order_id)}
                                    disabled={loading.fetch}
                                >
                                    {loading.fetch && (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    {loading.fetch ? "Checking " : "Check "}
                                    Status
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="flex-1 flex items-center justify-center gap-2"
                                    onClick={() => cancelTransaction(transaction.order_id)}
                                    disabled={loading.cancel}
                                >
                                    {loading.cancel && (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ===== SUCCESS ===== */}
                    {transaction?.status === TransactionStatus.SUCCESS && (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <CheckCircle2 className="h-16 w-16 text-success" />
                            <h3 className="text-xl font-bold text-success">
                                Payment Success
                            </h3>
                            <Input
                                type="email"
                                placeholder="Enter email to receive invoice"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading.invoice}
                            />
                            <Button
                                className="w-full"
                                onClick={() => createInvoice(transaction.order_id, email)}
                                disabled={!email || loading.invoice}
                            >
                                <FileDown className="h-4 w-4 mr-1" />
                                {loading.invoice ? "Sending..." : "Send Invoice"}
                            </Button>
                        </div>
                    )}

                    {/* ===== FAILED / EXPIRED ===== */}
                    {transaction &&
                        transaction.status !== TransactionStatus.PENDING &&
                        transaction.status !== TransactionStatus.SUCCESS && (
                            <div className="flex flex-col items-center gap-4 py-6">
                                <XCircle className="h-16 w-16 text-destructive" />
                                <h3 className="text-xl font-bold text-destructive">
                                    Payment {transaction.status}
                                </h3>

                                <Button
                                    className="w-full"
                                    onClick={handleCreateNewPayment}
                                >
                                    Choose Payment Method Again
                                </Button>
                            </div>
                        )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
