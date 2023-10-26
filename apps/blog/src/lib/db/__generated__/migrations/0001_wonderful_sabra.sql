ALTER TABLE `blog_events` RENAME COLUMN `page_id` TO `event_type`;--> statement-breakpoint
ALTER TABLE `blog_events` ADD `metadata` json;