-- Add reminder tracking fields to invoices table
ALTER TABLE invoices ADD COLUMN last_reminder_sent INTEGER;
ALTER TABLE invoices ADD COLUMN reminder_count INTEGER DEFAULT 0;
