import { pgEnum } from "drizzle-orm/pg-core";

export const TransactionType = pgEnum("transaction_type", ["DEBIT", "CREDIT"]);
export const PaymentType = pgEnum("transaction_type", ["CASH", "ETRANSFER", "DEBIT", "CREDIT"]);
