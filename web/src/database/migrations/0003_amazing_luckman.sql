DO $$ BEGIN
 CREATE TYPE "public"."avatar_variant" AS ENUM('TEXT', 'PICTORIAL', 'IMAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "avatar" (
	"avatar_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"content" varchar(1024) NOT NULL,
	"variant" "avatar_variant" NOT NULL,
	"primary_color" varchar(64),
	"secondary_color" varchar(64),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "transaction_method" ADD COLUMN "icon_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_method" ADD CONSTRAINT "transaction_method_icon_id_avatar_avatar_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."avatar"("avatar_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transaction_method" DROP COLUMN IF EXISTS "icon_content";--> statement-breakpoint
ALTER TABLE "transaction_method" DROP COLUMN IF EXISTS "icon_variant";--> statement-breakpoint
ALTER TABLE "transaction_method" DROP COLUMN IF EXISTS "icon_primary_color";--> statement-breakpoint
ALTER TABLE "transaction_method" DROP COLUMN IF EXISTS "icon_secondary_color";