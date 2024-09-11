ALTER TABLE "transaction" DROP CONSTRAINT "transaction_journal_entry_id_journal_entry_journal_entry_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_journal_entry_id_journal_entry_journal_entry_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entry"("journal_entry_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
