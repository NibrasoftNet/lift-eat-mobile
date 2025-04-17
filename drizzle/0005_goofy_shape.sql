PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_plan_meals` (
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`daily_plan_id` integer NOT NULL,
	`meal_id` integer NOT NULL,
	`quantity` real DEFAULT 10 NOT NULL,
	`calories` real,
	`carbs` real,
	`fat` real,
	`protein` real,
	FOREIGN KEY (`daily_plan_id`) REFERENCES `daily_plan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_daily_plan_meals`("created_at", "updated_at", "id", "daily_plan_id", "meal_id", "quantity", "calories", "carbs", "fat", "protein") SELECT "created_at", "updated_at", "id", "daily_plan_id", "meal_id", "quantity", "calories", "carbs", "fat", "protein" FROM `daily_plan_meals`;--> statement-breakpoint
DROP TABLE `daily_plan_meals`;--> statement-breakpoint
ALTER TABLE `__new_daily_plan_meals` RENAME TO `daily_plan_meals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;