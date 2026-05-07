CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"location" geometry(Point, 4326),
	"address" text NOT NULL,
	"plus_code" varchar(50),
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"price_range" varchar(50),
	"rating" double precision DEFAULT 0,
	"one_liner" varchar(255),
	"open_hours" varchar(100),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"contributed_by" varchar(100),
	"popularity" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
