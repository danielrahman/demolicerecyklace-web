CREATE TABLE "callback_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"phone" text NOT NULL,
	"name" text,
	"email" text,
	"preferred_call_time" text,
	"note" text,
	"wizard_snapshot" text
);
