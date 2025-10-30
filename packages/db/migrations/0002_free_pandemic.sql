ALTER TABLE "posts" ADD COLUMN "author_name" varchar(256) DEFAULT 'Admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "image_url" text;