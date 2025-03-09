CREATE TABLE `daily_plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week` integer DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 17 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`type` text DEFAULT 'MANUAL' NOT NULL,
	`day` text DEFAULT 'MONDAY' NOT NULL,
	`plan_id` integer NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `plan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `daily_plan_meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`daily_plan_id` integer NOT NULL,
	`meal_id` integer NOT NULL,
	FOREIGN KEY (`daily_plan_id`) REFERENCES `daily_plan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ingredients_standard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'felfel' NOT NULL,
	`unit` text DEFAULT 'GRAMMES',
	`quantity` real DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 17 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`image` blob
);
--> statement-breakpoint
CREATE TABLE `meal_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quantity` real DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 17 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`ingredient_standard_id` integer NOT NULL,
	`meal_id` integer NOT NULL,
	FOREIGN KEY (`ingredient_standard_id`) REFERENCES `ingredients_standard`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text DEFAULT 'BREAKFAST' NOT NULL,
	`name` text DEFAULT 'kosksi' NOT NULL,
	`description` text DEFAULT 'no description' NOT NULL,
	`cuisine` text DEFAULT 'GENERAL' NOT NULL,
	`unit` text DEFAULT 'GRAMMES' NOT NULL,
	`quantity` real DEFAULT 1 NOT NULL,
	`calories` real DEFAULT 17 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`image` blob,
	`creator_id` integer NOT NULL,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plan` (
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
	`calories` real DEFAULT 17 NOT NULL,
	`carbs` real DEFAULT 1 NOT NULL,
	`fat` real DEFAULT 1 NOT NULL,
	`protein` real DEFAULT 1 NOT NULL,
	`type` text DEFAULT 'MANUAL' NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'John' NOT NULL,
	`email` text NOT NULL,
	`gender` text DEFAULT 'MALE' NOT NULL,
	`weight` integer DEFAULT 0 NOT NULL,
	`weight_unit` text DEFAULT 'KG' NOT NULL,
	`height` real DEFAULT 150 NOT NULL,
	`height_unit` text DEFAULT 'CM' NOT NULL,
	`profile_image` blob,
	`physical_activity` text DEFAULT 'MODERATE' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);