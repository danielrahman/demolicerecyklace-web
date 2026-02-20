CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text NOT NULL,
	"active" boolean NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "container_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"customer_type" text NOT NULL,
	"name" text NOT NULL,
	"company_name" text,
	"ico" text,
	"dic" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"postal_code" text NOT NULL,
	"city" text NOT NULL,
	"street" text NOT NULL,
	"house_number" text NOT NULL,
	"pin_lat" double precision,
	"pin_lng" double precision,
	"waste_type" text NOT NULL,
	"container_size_m3" integer NOT NULL,
	"container_count" integer NOT NULL,
	"rental_days" integer NOT NULL,
	"delivery_date_requested" text NOT NULL,
	"delivery_date_end_requested" text,
	"delivery_flexibility_days" integer,
	"time_window_requested" text NOT NULL,
	"delivery_date_confirmed" text,
	"time_window_confirmed" text,
	"placement_type" text NOT NULL,
	"permit_confirmed" boolean NOT NULL,
	"extras" text NOT NULL,
	"price_estimate" text NOT NULL,
	"note" text,
	"callback_note" text,
	"internal_note" text,
	"cancel_reason" text,
	"cancelled_at" timestamp with time zone,
	"gdpr_consent" boolean NOT NULL,
	"marketing_consent" boolean NOT NULL,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_events" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text,
	"event_type" text NOT NULL,
	"payload" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit_buckets" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"window_start" timestamp with time zone NOT NULL
);
