-- Migration pour ajouter le champ clerk_id à la table users
-- Ajout du champ clerk_id pour stocker l'identifiant Clerk d'authentification
ALTER TABLE `users` ADD COLUMN `clerk_id` text;

-- On n'ajoute pas de contrainte UNIQUE pour permettre NULL dans les comptes existants
-- Mais vous pourriez vouloir ajouter un index pour accélérer les recherches
CREATE INDEX `users_clerk_id_idx` ON `users` (`clerk_id`);
