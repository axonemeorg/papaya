ALTER TABLE "category" RENAME COLUMN "label_embedding" TO "description_embedding";--> statement-breakpoint
DROP INDEX IF EXISTS "embedding_index";--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "icon" varchar(1023) NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "color" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "description" varchar(1024) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embedding_index" ON "category" USING hnsw ("description_embedding" vector_cosine_ops);