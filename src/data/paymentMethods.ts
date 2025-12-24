import QrisLogo from '@/assets/payments/qris.svg?react';

export interface PaymentMethod {
    value: string;
    label: string;
    logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const paymentMethods: PaymentMethod[] = [
    {
        value: "qris",
        label: "QRIS",
        logo: QrisLogo,
    },
];
