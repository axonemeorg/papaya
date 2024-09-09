ALTER TABLE "transaction" ALTER COLUMN "payment_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "transaction_method_id" DROP NOT NULL;