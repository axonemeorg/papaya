DO $$ BEGIN
 CREATE TYPE "public"."user_file_upload_type" AS ENUM('IMAGE_AVATAR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_file_uploads" (
	"user_file_upload_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"file_upload_type" "user_file_upload_type" NOT NULL,
	"original_file_name" varchar(260) NOT NULL,
	"mime_type" varchar(256) NOT NULL,
	"file_name" varchar(256) NOT NULL,
	"s3_key" varchar(2048) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_file_uploads" ADD CONSTRAINT "user_file_uploads_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
