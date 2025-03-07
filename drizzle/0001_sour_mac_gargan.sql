PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text DEFAULT 'BREAKFAST' NOT NULL,
	`name` text NOT NULL,
	`unit` text DEFAULT 'GRAMMES' NOT NULL,
	`quantity` real NOT NULL,
	`calories` real NOT NULL,
	`carbs` real NOT NULL,
	`fat` real NOT NULL,
	`protein` real NOT NULL,
	`image` blob
);
--> statement-breakpoint
INSERT INTO `__new_meals`("id", "type", "name", "unit", "quantity", "calories", "carbs", "fat", "protein", "image") SELECT "id", "type", "name", "unit", "quantity", "calories", "carbs", "fat", "protein", "image" FROM `meals`;--> statement-breakpoint
DROP TABLE `meals`;--> statement-breakpoint
ALTER TABLE `__new_meals` RENAME TO `meals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `users` ADD `physical_activity` text DEFAULT 'MODERATE' NOT NULL;