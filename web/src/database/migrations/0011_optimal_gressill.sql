CREATE TABLE IF NOT EXISTS "journal_entry_attachment" (
	"journal_entry_attachment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journal_entry_id" uuid,
	"user_file_upload_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_entry_attachment" ADD CONSTRAINT "journal_entry_attachment_journal_entry_id_journal_entry_journal_entry_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entry"("journal_entry_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_entry_attachment" ADD CONSTRAINT "journal_entry_attachment_user_file_upload_id_user_file_uploads_user_file_upload_id_fk" FOREIGN KEY ("user_file_upload_id") REFERENCES "public"."user_file_uploads"("user_file_upload_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
