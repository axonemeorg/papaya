DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('DEBIT', 'CREDIT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_entry" (
	"journal_entry_id" serial PRIMARY KEY NOT NULL,
	"memo" varchar(1023) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_transactions" (
	"journal_entry_id" integer NOT NULL,
	"transaction_id" integer NOT NULL,
	CONSTRAINT "journal_transactions_journal_entry_id_transaction_id_pk" PRIMARY KEY("journal_entry_id","transaction_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"memo" varchar(1023),
	"transaction_method_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_method" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"memo" varchar(1023),
	"default_payment_type" "transaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_transactions" ADD CONSTRAINT "journal_transactions_journal_entry_id_journal_entry_journal_entry_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entry"("journal_entry_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_transactions" ADD CONSTRAINT "journal_transactions_transaction_id_transaction_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("transaction_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transaction_method_id_transaction_method_transaction_id_fk" FOREIGN KEY ("transaction_method_id") REFERENCES "public"."transaction_method"("transaction_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
