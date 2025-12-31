CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`customer_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`priority` text DEFAULT 'medium',
	`start_date` integer,
	`end_date` integer,
	`budget` integer,
	`notes` text,
	`created_by` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
