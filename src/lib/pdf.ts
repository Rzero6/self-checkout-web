import jsPDF from "jspdf";
import type { Transaction, TransactionDetails } from "@/types/transaction_type";
import { formatPrice } from "./utils";

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const COMPANY = {
    name: "Rzero6",
    link: "https://reynoldkun.vercel.app",
    email: "michaelreynoldk@gmail.com",
};

const COLORS = {
    primaryText: { r: 6, g: 95, b: 70 },
    secondaryText: { r: 255, g: 255, b: 255 },
    tableHeader: { r: 0, g: 128, b: 96 },
    tableRowBg: { r: 225, g: 245, b: 240 },
    divider: { r: 169, g: 223, b: 210 },
};

const MARGIN = 20;

/* -------------------------------------------------------------------------- */
/*                              MAIN PDF FUNCTION                              */
/* -------------------------------------------------------------------------- */

export const generateTransactionPDF = async (
    transaction: Transaction,
    details: TransactionDetails[]
) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20;

    /* ------------------------------- LOGO ---------------------------------- */
    try {
        const logo = await loadImage("/logo.png");
        pdf.addImage(logo, "PNG", MARGIN, y, 40, 40);
    } catch (err) {
        console.warn("Logo not loaded", err);
    }

    /* ------------------------------- HEADER -------------------------------- */
    drawInvoiceHeader(pdf, pageWidth, y);
    y += 40;

    drawDivider(pdf, pageWidth, y);
    y += 10;

    /* --------------------------- ORDER INFO BAR ---------------------------- */
    drawOrderIdBar(pdf, pageWidth, y, transaction.order_id);
    y += 20;

    drawPaymentInfo(pdf, pageWidth, y, transaction);
    y += 40;

    /* ---------------------------- ITEMS TABLE ------------------------------ */
    drawItemsTableHeader(pdf, pageWidth, y);
    y += 15;

    y = drawItemsTableRows(pdf, pageWidth, y, details);
    y += 10;

    /* ------------------------------ TOTAL ---------------------------------- */
    drawDivider(pdf, pageWidth, y, true);
    y += 15;

    drawTotalBox(pdf, pageWidth, y, transaction.amount);
    y += 40;

    /* ------------------------------ FOOTER --------------------------------- */
    drawFooter(pdf, pageWidth, y);

    pdf.save(`invoice-${transaction.order_id}.pdf`);
};

/* -------------------------------------------------------------------------- */
/*                               DRAW HELPERS                                 */
/* -------------------------------------------------------------------------- */

const drawInvoiceHeader = (pdf: jsPDF, pageWidth: number, y: number) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(COLORS.primaryText.r, COLORS.primaryText.g, COLORS.primaryText.b);
    pdf.text("INVOICE", pageWidth - MARGIN, y + 10, { align: "right" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(COLORS.primaryText.r, COLORS.primaryText.g, COLORS.primaryText.b);
    pdf.text(COMPANY.name, pageWidth - MARGIN, y + 20, { align: "right" });
    pdf.textWithLink(COMPANY.link, pageWidth - MARGIN, y + 26, {
        align: "right",
        url: COMPANY.link,
    });
};

const drawDivider = (
    pdf: jsPDF,
    pageWidth: number,
    y: number,
    rightOnly = false
) => {
    pdf.setDrawColor(COLORS.divider.r, COLORS.divider.g, COLORS.divider.b);
    pdf.setLineWidth(0.5);

    if (rightOnly) {
        pdf.line(pageWidth - MARGIN - 80, y, pageWidth - MARGIN, y);
    } else {
        pdf.line(MARGIN, y, pageWidth - MARGIN, y);
    }
};

const drawOrderIdBar = (
    pdf: jsPDF,
    pageWidth: number,
    y: number,
    orderId: string
) => {
    pdf.setFillColor(
        COLORS.tableHeader.r,
        COLORS.tableHeader.g,
        COLORS.tableHeader.b
    );
    pdf.roundedRect(MARGIN, y, pageWidth - MARGIN * 2, 12, 2, 2, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(
        COLORS.secondaryText.r,
        COLORS.secondaryText.g,
        COLORS.secondaryText.b
    );
    pdf.text(`ORDER ID: ${orderId}`, pageWidth - MARGIN - 10, y + 8, {
        align: "right",
    });
};

const drawPaymentInfo = (
    pdf: jsPDF,
    pageWidth: number,
    startY: number,
    transaction: Transaction
) => {
    const headerHeight = 12;
    const rowHeight = 14;

    /* ---------------------------- TABLE HEADER ---------------------------- */
    pdf.setFillColor(
        COLORS.tableHeader.r,
        COLORS.tableHeader.g,
        COLORS.tableHeader.b
    );
    pdf.roundedRect(
        MARGIN,
        startY,
        pageWidth - MARGIN * 2,
        headerHeight,
        2,
        2,
        "F"
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(
        COLORS.secondaryText.r,
        COLORS.secondaryText.g,
        COLORS.secondaryText.b
    );

    pdf.text("PAYMENT METHOD", MARGIN + 10, startY + 8);
    pdf.text("STATUS", MARGIN + 100, startY + 8, {
        align: "center",
    });
    pdf.text("DATE", pageWidth - MARGIN - 10, startY + 8, {
        align: "right",
    });

    /* ----------------------------- TABLE BODY ----------------------------- */
    const bodyY = startY + headerHeight - 2;

    // Row background
    pdf.setFillColor(
        COLORS.tableRowBg.r,
        COLORS.tableRowBg.g,
        COLORS.tableRowBg.b
    );
    pdf.rect(
        MARGIN,
        bodyY,
        pageWidth - MARGIN * 2,
        rowHeight,
        "F"
    );

    // Text styling
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(
        COLORS.primaryText.r,
        COLORS.primaryText.g,
        COLORS.primaryText.b
    );

    // Vertically center text in row
    const textY = bodyY + rowHeight / 2 + 3;

    // Payment Method
    pdf.text(transaction.payment_type, MARGIN + 10, textY);

    // Status (colored)
    const statusColor = getStatusColor(transaction.status);
    pdf.setTextColor(statusColor.r, statusColor.g, statusColor.b);
    pdf.text(transaction.status.toUpperCase(), MARGIN + 100, textY, { align: "center" });

    // Date
    pdf.setTextColor(
        COLORS.primaryText.r,
        COLORS.primaryText.g,
        COLORS.primaryText.b
    );
    pdf.text(
        new Date().toLocaleDateString("id-ID"),
        pageWidth - MARGIN - 10,
        textY, {
        align: "right",
    }
    );

    /* -------------------------- RETURN NEXT Y ----------------------------- */
    return bodyY + rowHeight + 10;
};


const drawItemsTableHeader = (
    pdf: jsPDF,
    pageWidth: number,
    y: number
) => {
    pdf.setFillColor(
        COLORS.tableHeader.r,
        COLORS.tableHeader.g,
        COLORS.tableHeader.b
    );
    pdf.roundedRect(MARGIN, y, pageWidth - MARGIN * 2, 12, 2, 2, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(COLORS.secondaryText.r, COLORS.secondaryText.g, COLORS.secondaryText.b);

    pdf.text("PRODUCT", MARGIN + 10, y + 8);
    pdf.text("PRICE", MARGIN + 90, y + 8, { align: "center" });
    pdf.text("QTY", pageWidth - MARGIN - 50, y + 8, { align: "center" });
    pdf.text("SUBTOTAL", pageWidth - MARGIN - 10, y + 8, { align: "right" });
};

const drawItemsTableRows = (
    pdf: jsPDF,
    pageWidth: number,
    startY: number,
    details: TransactionDetails[]
) => {
    let y = startY;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(COLORS.primaryText.r, COLORS.primaryText.g, COLORS.primaryText.b);

    details.forEach((item, index) => {
        if (index % 2 === 0) {
            pdf.setFillColor(
                COLORS.tableRowBg.r,
                COLORS.tableRowBg.g,
                COLORS.tableRowBg.b
            );
            pdf.rect(MARGIN, y - 5, pageWidth - MARGIN * 2, 14, "F");
        }
        const productName = ellipsisText(pdf, item.product_name, 70)
        pdf.text(productName, MARGIN + 10, y + 4);
        pdf.text(formatPrice(item.price), MARGIN + 90, y + 4, {
            align: "center",
        });
        pdf.text(item.quantity.toString(), pageWidth - MARGIN - 50, y + 4, {
            align: "center",
        });
        pdf.text(formatPrice(item.subtotal), pageWidth - MARGIN - 10, y + 4, {
            align: "right",
        });

        y += 14;
    });

    return y;
};

const drawTotalBox = (
    pdf: jsPDF,
    pageWidth: number,
    y: number,
    total: number
) => {
    pdf.setFillColor(
        COLORS.tableHeader.r,
        COLORS.tableHeader.g,
        COLORS.tableHeader.b
    );
    pdf.roundedRect(pageWidth - MARGIN - 80, y - 5, 80, 20, 3, 3, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(COLORS.secondaryText.r, COLORS.secondaryText.g, COLORS.secondaryText.b);

    pdf.text("TOTAL", pageWidth - MARGIN - 70, y + 7);
    pdf.text(formatPrice(total), pageWidth - MARGIN - 10, y + 7, {
        align: "right",
    });
};

const drawFooter = (pdf: jsPDF, pageWidth: number, y: number) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);

    pdf.text("Thank you for your purchase!", pageWidth / 2, y, {
        align: "center",
    });
    pdf.text(`For questions, contact ${COMPANY.email}`, pageWidth / 2, y + 12, {
        align: "center",
    });
};

/* -------------------------------------------------------------------------- */
/*                                   UTILS                                    */
/* -------------------------------------------------------------------------- */

const loadImage = (src: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d")?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = reject;
        img.src = src;
    });

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "success":
        case "paid":
        case "completed":
            return { r: 34, g: 197, b: 94 };
        case "pending":
            return { r: 234, g: 179, b: 8 };
        case "failed":
        case "cancelled":
            return { r: 239, g: 68, b: 68 };
        default:
            return { r: 100, g: 100, b: 100 };
    }
};

const ellipsisText = (
    pdf: jsPDF,
    text: string,
    maxWidth: number
): string => {
    if (pdf.getTextDimensions(text).w <= maxWidth) {
        return text;
    }

    let trimmed = text;
    while (trimmed.length > 0) {
        trimmed = trimmed.slice(0, -1);
        if (pdf.getTextDimensions(trimmed + "...").w <= maxWidth) {
            return trimmed + "...";
        }
    }

    return "...";
};
