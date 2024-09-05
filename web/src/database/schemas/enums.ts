import { pgEnum } from "drizzle-orm/pg-core";

export const TransactionTypeEnum = pgEnum("transaction_type", ["DEBIT", "CREDIT"]);
export const PaymentTypeEnum = pgEnum("payment_type", ["CASH", "ETRANSFER", "DEBIT", "CREDIT"]);
export const TransactionMethodIconVariantEnum = pgEnum("transaction_method_icon_variant", ["TEXT", "PICTORIAL", "IMAGE"]);
