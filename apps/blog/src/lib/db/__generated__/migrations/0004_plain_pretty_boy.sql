RENAME TABLE `blog_events` TO `events`;--> statement-breakpoint
ALTER TABLE `events` MODIFY COLUMN `created_at` timestamp DEFAULT (now());