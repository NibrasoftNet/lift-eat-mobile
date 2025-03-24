ALTER TABLE `daily_plan` ADD `created_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `daily_plan` ADD `updated_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `daily_plan_meals` ADD `created_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `daily_plan_meals` ADD `updated_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `ingredients_standard` ADD `created_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `ingredients_standard` ADD `updated_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `meal_ingredients` ADD `created_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `meal_ingredients` ADD `updated_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `meals` ADD `created_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `meals` ADD `updated_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `plan` ADD `created_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `plan` ADD `updated_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `users` ADD `provider` text DEFAULT 'email' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;