DROP TABLE "avatar";--> statement-breakpoint
ALTER TABLE "transaction_method" DROP CONSTRAINT "transaction_method_icon_id_avatar_avatar_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction_method" DROP COLUMN IF EXISTS "icon_id";