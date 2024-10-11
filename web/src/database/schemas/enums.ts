import { pgEnum } from "drizzle-orm/pg-core";

export const TransactionTypeEnum = pgEnum("transaction_type", [
    "DEBIT",
    "CREDIT"
]);

export const PaymentTypeEnum = pgEnum("payment_type", [
    "CASH",
    "ETRANSFER",
    "DEBIT",
    "CREDIT"
]);

export const AvatarVariantEnum = pgEnum("avatar_variant", ["TEXT", "PICTORIAL", "IMAGE"]);

export const UserFileUploadTypeEnum = pgEnum("user_file_upload_type", [
    "IMAGE_AVATAR",
    "JOURNAL_ENTRY_ATTACHMENT",
]);

export type UserFileUploadTypeEnum = (typeof UserFileUploadTypeEnum.enumValues)[number];
