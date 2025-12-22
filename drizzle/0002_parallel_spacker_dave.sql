CREATE TYPE "public"."customer_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."customer_type" AS ENUM('individual', 'business');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_type" "customer_type" NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"business_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"address_line1" varchar(255),
	"address_line2" varchar(255),
	"city" varchar(100),
	"province" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100) DEFAULT 'South Africa',
	"id_number" varchar(20),
	"registration_number" varchar(50),
	"vat_number" varchar(20),
	"tax_number" varchar(20),
	"status" "customer_status" DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "clients" CASCADE;--> statement-breakpoint
DROP TABLE "test" CASCADE;