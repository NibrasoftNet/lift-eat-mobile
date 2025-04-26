-- Ajouter la colonne mealType à la table dailyPlanMeals
ALTER TABLE `daily_plan_meals` ADD COLUMN `meal_type` text;
--> statement-breakpoint

-- Mettre à jour les valeurs existantes pour utiliser le type de repas défini dans la table des repas
UPDATE `daily_plan_meals` 
SET `meal_type` = (
  SELECT `type` FROM `meals` 
  WHERE `meals`.`id` = `daily_plan_meals`.`meal_id`
);
