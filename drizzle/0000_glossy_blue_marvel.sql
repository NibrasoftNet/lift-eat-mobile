CREATE TABLE `daily_meal_progress` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consomme` integer DEFAULT false NOT NULL,
	`pourcentage_consomme` real DEFAULT 100 NOT NULL,
	`calories_effectives` real DEFAULT 0 NOT NULL,
	`protein_effectives` real DEFAULT 0 NOT NULL,
	`carbs_effectives` real DEFAULT 0 NOT NULL,
	`fat_effectives` real DEFAULT 0 NOT NULL,
	`daily_progress_id` integer NOT NULL,
	`daily_plan_meal_id` integer NOT NULL,
	`meal_id` integer NOT NULL,
	FOREIGN KEY (`daily_progress_id`) REFERENCES `daily_progress`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`daily_plan_meal_id`) REFERENCES `daily_plan_meals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `daily_plan` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`daily_plan_id` integer NOT NULL,
	`meal_id` integer NOT NULL,
	`meal_type` text,
	`quantity` real DEFAULT 10 NOT NULL,
	`calories` real,
	`carbs` real,
	`fat` real,
	`protein` real,
	FOREIGN KEY (`daily_plan_id`) REFERENCES `daily_plan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `daily_progress` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`pourcentage_completion` real DEFAULT 0 NOT NULL,
	`calories` real DEFAULT 0 NOT NULL,
	`carbs` real DEFAULT 0 NOT NULL,
	`fat` real DEFAULT 0 NOT NULL,
	`protein` real DEFAULT 0 NOT NULL,
	`user_id` integer NOT NULL,
	`plan_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `plan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ingredient_suggestions` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`unit` text DEFAULT 'GRAMMES',
	`quantity` real DEFAULT 100 NOT NULL,
	`suggested_calories` real DEFAULT 0,
	`suggested_carbs` real DEFAULT 0,
	`suggested_fat` real DEFAULT 0,
	`suggested_protein` real DEFAULT 0,
	`suggestion_source` text DEFAULT 'ia',
	`status` text DEFAULT 'pending',
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ingredients_standard` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
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
CREATE TABLE `nutrition_advice` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`type` text DEFAULT 'GENERAL' NOT NULL,
	`context` text,
	`liked` integer,
	`applied` integer DEFAULT false,
	`plan_id` integer,
	`meal_id` integer,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `plan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plan` (
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'John' NOT NULL,
	`email` text NOT NULL,
	`provider` text DEFAULT 'email' NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`age` integer DEFAULT 20 NOT NULL,
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