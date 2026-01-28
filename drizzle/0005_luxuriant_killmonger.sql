CREATE TABLE `reminder_log` (
	`id` integer PRIMARY KEY NOT NULL,
	`invoice_id` integer NOT NULL,
	`sent_at` integer NOT NULL,
	`reminder_type` text NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `invoices` ALTER COLUMN "due_date" TO "due_date" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `last_reminder_sent` integer;--> statement-breakpoint
ALTER TABLE `invoices` ADD `reminder_count` integer DEFAULT 0;