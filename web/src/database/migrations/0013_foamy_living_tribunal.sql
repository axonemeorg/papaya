ALTER TABLE "journal_entry_attachment" ADD COLUMN "memo" varchar(1024);--> statement-breakpoint
ALTER TABLE "journal_entry_attachment" ADD COLUMN "memo_embedding" vector(1536);