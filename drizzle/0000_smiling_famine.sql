CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meal_id` integer NOT NULL,
	`quantity` real NOT NULL,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ingredients_ingredients_standard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ingredient_id` integer NOT NULL,
	`ingredient_standard_id` integer NOT NULL,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredient_standard_id`) REFERENCES `ingredients_standard`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ingredients_standard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`unit` text DEFAULT 'GRAMMES',
	`quantity` real NOT NULL,
	`carbs` real NOT NULL,
	`fat` real NOT NULL,
	`protein` real NOT NULL,
	`image` blob
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text DEFAULT 'BREAKFAST',
	`name` text NOT NULL,
	`unit` text DEFAULT 'GRAMMES',
	`quantity` real NOT NULL,
	`calories` real NOT NULL,
	`carbs` real NOT NULL,
	`fat` real NOT NULL,
	`protein` real NOT NULL,
	`image` blob
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`gender` text DEFAULT 'MALE' NOT NULL,
	`weight` real DEFAULT 30 NOT NULL,
	`weight_unit` text DEFAULT 'KG' NOT NULL,
	`height` real DEFAULT 150 NOT NULL,
	`height_unit` text DEFAULT 'CM' NOT NULL,
	`profile_image` blob
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);