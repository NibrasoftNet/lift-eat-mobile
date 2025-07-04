PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_plan` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week` integer DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 1 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`type` text DEFAULT 'MANUAL' NOT NULL,
	`day` text DEFAULT 'MONDAY' NOT NULL,
	`plan_id` integer NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `plan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_daily_plan`("created_at", "updated_at", "id", "week", "calories", "carbs", "fat", "protein", "type", "day", "plan_id") SELECT "created_at", "updated_at", "id", "week", "calories", "carbs", "fat", "protein", "type", "day", "plan_id" FROM `daily_plan`;--> statement-breakpoint
DROP TABLE `daily_plan`;--> statement-breakpoint
ALTER TABLE `__new_daily_plan` RENAME TO `daily_plan`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_daily_progress` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`pourcentage_completion` real DEFAULT 0 NOT NULL,
	`calories` real DEFAULT 1 NOT NULL,
	`carbs` real DEFAULT 0 NOT NULL,
	`fat` real DEFAULT 0 NOT NULL,
	`protein` real DEFAULT 0 NOT NULL,
	`user_id` integer NOT NULL,
	`plan_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `plan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_daily_progress`("created_at", "updated_at", "id", "date", "pourcentage_completion", "calories", "carbs", "fat", "protein", "user_id", "plan_id") SELECT "created_at", "updated_at", "id", "date", "pourcentage_completion", "calories", "carbs", "fat", "protein", "user_id", "plan_id" FROM `daily_progress`;--> statement-breakpoint
DROP TABLE `daily_progress`;--> statement-breakpoint
ALTER TABLE `__new_daily_progress` RENAME TO `daily_progress`;--> statement-breakpoint
CREATE TABLE `__new_ingredients_standard` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'felfel' NOT NULL,
	`unit` text DEFAULT 'GRAMMES',
	`quantity` real DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 1 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`image` blob
);
--> statement-breakpoint
INSERT INTO `__new_ingredients_standard`("created_at", "updated_at", "id", "name", "unit", "quantity", "calories", "carbs", "fat", "protein", "image") SELECT "created_at", "updated_at", "id", "name", "unit", "quantity", "calories", "carbs", "fat", "protein", "image" FROM `ingredients_standard`;--> statement-breakpoint
DROP TABLE `ingredients_standard`;--> statement-breakpoint
ALTER TABLE `__new_ingredients_standard` RENAME TO `ingredients_standard`;--> statement-breakpoint
CREATE TABLE `__new_meal_ingredients` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quantity` real DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 1 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`ingredient_standard_id` integer NOT NULL,
	`meal_id` integer NOT NULL,
	FOREIGN KEY (`ingredient_standard_id`) REFERENCES `ingredients_standard`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_meal_ingredients`("created_at", "updated_at", "id", "quantity", "calories", "carbs", "fat", "protein", "ingredient_standard_id", "meal_id") SELECT "created_at", "updated_at", "id", "quantity", "calories", "carbs", "fat", "protein", "ingredient_standard_id", "meal_id" FROM `meal_ingredients`;--> statement-breakpoint
DROP TABLE `meal_ingredients`;--> statement-breakpoint
ALTER TABLE `__new_meal_ingredients` RENAME TO `meal_ingredients`;--> statement-breakpoint
CREATE TABLE `__new_meals` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text DEFAULT 'BREAKFAST' NOT NULL,
	`name` text DEFAULT 'kosksi' NOT NULL,
	`description` text DEFAULT 'no description' NOT NULL,
	`cuisine` text DEFAULT 'GENERAL' NOT NULL,
	`unit` text DEFAULT 'GRAMMES' NOT NULL,
	`quantity` real DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 1 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`image` blob,
	`creator_id` integer NOT NULL,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_meals`("created_at", "updated_at", "id", "type", "name", "description", "cuisine", "unit", "quantity", "calories", "carbs", "fat", "protein", "image", "creator_id") SELECT "created_at", "updated_at", "id", "type", "name", "description", "cuisine", "unit", "quantity", "calories", "carbs", "fat", "protein", "image", "creator_id" FROM `meals`;--> statement-breakpoint
DROP TABLE `meals`;--> statement-breakpoint
ALTER TABLE `__new_meals` RENAME TO `meals`;--> statement-breakpoint
CREATE TABLE `__new_plan` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'PlanB' NOT NULL,
	`goal` text DEFAULT 'MAINTAIN' NOT NULL,
	`unit` text DEFAULT 'KG' NOT NULL,
	`initial_weight` real DEFAULT 60 NOT NULL,
	`target_weight` real DEFAULT 60 NOT NULL,
	`public` integer DEFAULT true NOT NULL,
	`current` integer DEFAULT false NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`duration_weeks` integer DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 1 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`type` text DEFAULT 'MANUAL' NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_plan`("created_at", "updated_at", "id", "name", "goal", "unit", "initial_weight", "target_weight", "public", "current", "completed", "duration_weeks", "calories", "carbs", "fat", "protein", "type", "user_id") SELECT "created_at", "updated_at", "id", "name", "goal", "unit", "initial_weight", "target_weight", "public", "current", "completed", "duration_weeks", "calories", "carbs", "fat", "protein", "type", "user_id" FROM `plan`;--> statement-breakpoint
DROP TABLE `plan`;--> statement-breakpoint
ALTER TABLE `__new_plan` RENAME TO `plan`;