DO $$ BEGIN
 CREATE TYPE "public"."transaction_method_icon_variant" AS ENUM('TEXT', 'PICTORIAL', 'IMAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transaction_method" ADD COLUMN "icon_content" varchar(512) NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_method" ADD COLUMN "icon_variant" "transaction_method_icon_variant" NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_method" ADD COLUMN "icon_primary_color" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_method" ADD COLUMN "icon_secondary_color" varchar(64);