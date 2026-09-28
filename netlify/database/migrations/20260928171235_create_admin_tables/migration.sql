CREATE TABLE "guests" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"note" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'tamu' NOT NULL,
	"invitation_count" integer DEFAULT 1 NOT NULL,
	"max_surat" integer DEFAULT 1 NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"opened_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY,
	"guest_slug" text,
	"guest_name" text NOT NULL,
	"attendance" text NOT NULL,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_config" (
	"id" serial PRIMARY KEY,
	"key" text NOT NULL UNIQUE,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
