ALTER TABLE "journal_entry" ALTER COLUMN "date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "journal_entry" ADD COLUMN "time" time NOT NULL;