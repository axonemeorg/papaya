CREATE TABLE IF NOT EXISTS "category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"label" varchar(128) NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "journal_entry" ADD COLUMN "category_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_entry" ADD CONSTRAINT "journal_entry_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
