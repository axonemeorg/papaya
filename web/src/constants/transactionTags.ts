import { TransactionTag } from "@/types/enum";


export interface TransactionTagDetails {
    label: string;
    description: string;
}

export const TRANSACTION_TAG_LABELS: Record<TransactionTag, TransactionTagDetails> = {
    "APPROXIMATE": {
        label: "Approximate",
        description: "The amount is an estimate and may not be accurate."
    },
    "PENDING_REFUND": {
        label: "Pending Refund",
        description: "The transaction is pending a refund."
    },
    "REVIEW_REQUIRED": {
        label: "Review Required",
        description: "The transaction requires further review."
    },
    "TAX_DEDUCTIBLE": {
        label: "Tax Deductible",
        description: "The transaction is tax deductible."
    },
    "UNCONFIRMED": {
        label: "Unconfirmed",
        description: "The transaction is unconfirmed."
    },
    "UNPAID": {
        label: "Unpaid",
        description: "The transaction is unpaid."
    },
}
