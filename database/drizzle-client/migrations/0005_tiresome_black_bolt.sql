ALTER TABLE "journal_entry" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "journal_entry" ALTER COLUMN "time" SET DEFAULT now();