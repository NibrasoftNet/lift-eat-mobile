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
