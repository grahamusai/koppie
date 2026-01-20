PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_type` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`business_name` text,
	`email` text NOT NULL,
	`phone` text,
	`address_line1` text,
	`address_line2` text,
	`city` text,
	`province` text,
	`postal_code` text,
	`country` text DEFAULT 'South Africa',
	`id_number` text,
	`registration_number` text,
	`vat_number` text,
	`tax_number` text,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_by` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_customers`("id", "customer_type", "first_name", "last_name", "business_name", "email", "phone", "address_line1", "address_line2", "city", "province", "postal_code", "country", "id_number", "registration_number", "vat_number", "tax_number", "status", "notes", "created_by", "created_at", "updated_at") SELECT "id", "customer_type", "first_name", "last_name", "business_name", "email", "phone", "address_line1", "address_line2", "city", "province", "postal_code", "country", "id_number", "registration_number", "vat_number", "tax_number", "status", "notes", "created_by", "created_at", "updated_at" FROM `customers`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
ALTER TABLE `__new_customers` RENAME TO `customers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`customer_id` text NOT NULL,
	`project_id` text,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`issue_date` text NOT NULL,
	`due_date` text,
	`description` text,
	`notes` text,
	`created_by` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoices`("id", "invoice_number", "customer_id", "project_id", "amount", "status", "issue_date", "due_date", "description", "notes", "created_by", "created_at", "updated_at") SELECT "id", "invoice_number", "customer_id", "project_id", "amount", "status", "issue_date", "due_date", "description", "notes", "created_by", "created_at", "updated_at" FROM `invoices`;--> statement-breakpoint
DROP TABLE `invoices`;--> statement-breakpoint
ALTER TABLE `__new_invoices` RENAME TO `invoices`;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`customer_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`priority` text DEFAULT 'medium',
	`start_date` text,
	`end_date` text,
	`budget` integer,
	`notes` text,
	`created_by` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "name", "description", "customer_id", "status", "priority", "start_date", "end_date", "budget", "notes", "created_by", "created_at", "updated_at") SELECT "id", "name", "description", "customer_id", "status", "priority", "start_date", "end_date", "budget", "notes", "created_by", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
CREATE TABLE `__new_task_columns` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_task_columns`("id", "title", "position", "created_at", "updated_at") SELECT "id", "title", "position", "created_at", "updated_at" FROM `task_columns`;--> statement-breakpoint
DROP TABLE `task_columns`;--> statement-breakpoint
ALTER TABLE `__new_task_columns` RENAME TO `task_columns`;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`assignee` text,
	`due_date` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`column_id` text NOT NULL,
	`position` integer NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`created_by` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`column_id`) REFERENCES `task_columns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "description", "assignee", "due_date", "priority", "column_id", "position", "archived", "created_by", "created_at", "updated_at") SELECT "id", "title", "description", "assignee", "due_date", "priority", "column_id", "position", "archived", "created_by", "created_at", "updated_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;