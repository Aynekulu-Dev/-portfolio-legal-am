ALTER TABLE "profile" ADD COLUMN "timeline" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "credentials" jsonb DEFAULT '[]'::jsonb;