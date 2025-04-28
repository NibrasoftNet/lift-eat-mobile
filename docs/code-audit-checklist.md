# Checklist d'Audit de Code pour Lift-Eat-Mobile

Cette checklist exhaustive permet d'u00e9valuer tous les flux possibles au niveau du code avant de passer u00e0 une revue au niveau UI. Elle est organisu00e9e par domaine fonctionnel et couvre tous les aspects critiques de l'application.

## 1. ud83dudd10 Flux d'Authentification et Gestion Utilisateur

- [ ] **Enregistrement utilisateur**
  - [ ] Vu00e9rifier la validation des entru00e9es (email, mot de passe)
  - [ ] Confirmer le flux de cru00e9ation utilisateur via MCP server (`createUserViaMCP`)
  - [ ] Vu00e9rifier la gestion des erreurs (email existant, validation u00e9chouu00e9e)
  - [ ] Valider le stockage des tokens JWT ou mu00e9canismes d'authentification

- [ ] **Connexion utilisateur**
  - [ ] Vu00e9rifier le processus d'authentification (appels API, validation locale)
  - [ ] Confirmer la mise u00e0 jour du state global utilisateur via SessionStore
  - [ ] Vu00e9rifier les pru00e9requis d'authentification pour les routes protu00e9gu00e9es
  - [ ] Valider le mu00e9canisme de rafrau00eechissement des tokens

- [ ] **Gestion du profil utilisateur**
  - [ ] Vu00e9rifier les appels u00e0 `updateUserPreferencesViaMCP`
  - [ ] Confirmer la mise u00e0 jour des donnu00e9es utilisateur (poids, taille, activitu00e9 physique)
  - [ ] Valider les mu00e9canismes de changement de mot de passe
  - [ ] Vu00e9rifier la gestion des images de profil (upload, stockage)

- [ ] **Du00e9connexion**
  - [ ] Confirmer l'effacement correct des donnu00e9es de session
  - [ ] Vu00e9rifier la redirection vers l'u00e9cran de login
  - [ ] Valider l'invalidation des tokens u00e9ventuels

## 2. ud83cudf57 Flux de Gestion des Repas

- [ ] **Cru00e9ation de repas**
  - [ ] Vu00e9rifier les appels u00e0 `createMealViaMCP` et `createNewMealViaMCP`
  - [ ] Confirmer la validation des champs obligatoires (nom, calories, etc.)
  - [ ] Valider le flux d'ajout d'ingru00e9dients au repas
  - [ ] Vu00e9rifier le calcul des macronutriments (somme des ingru00e9dients)

- [ ] **Modification de repas**
  - [ ] Vu00e9rifier les appels u00e0 `updateMealViaMCP`
  - [ ] Confirmer que seul le cru00e9ateur peut modifier le repas
  - [ ] Valider la mise u00e0 jour des relations repas-ingru00e9dients
  - [ ] Vu00e9rifier l'invalidation des caches apru00e8s modification

- [ ] **Suppression de repas**
  - [ ] Vu00e9rifier les appels u00e0 `deleteMealViaMCP`
  - [ ] Confirmer la gestion des du00e9pendances (plans utilisant ce repas)
  - [ ] Valider les messages de confirmation avant suppression
  - [ ] Vu00e9rifier l'invalidation des caches apru00e8s suppression

- [ ] **Recherche et filtrage de repas**
  - [ ] Vu00e9rifier les appels u00e0 `getMealsListViaMCP` avec filtres
  - [ ] Confirmer le fonctionnement des filtres (type de cuisine, type de repas)
  - [ ] Valider la mise en cache des ru00e9sultats de recherche
  - [ ] Vu00e9rifier la pagination des ru00e9sultats

## 3. ud83dudcc8 Flux de Gestion des Plans Nutritionnels

- [ ] **Cru00e9ation de plan**
  - [ ] Vu00e9rifier les appels u00e0 `createPlanViaMCP`
  - [ ] Confirmer le calcul des objectifs nutritionnels (calories, macros)
  - [ ] Valider la cru00e9ation des plans journaliers associu00e9s
  - [ ] Vu00e9rifier la du00e9finition du plan comme courant si nu00e9cessaire

- [ ] **Modification de plan**
  - [ ] Vu00e9rifier les appels u00e0 `updatePlanViaMCP`
  - [ ] Confirmer la mise u00e0 jour des plans journaliers associu00e9s
  - [ ] Valider la recalcul des objectifs en cas de changement
  - [ ] Vu00e9rifier la propagation des changements aux jours futurs

- [ ] **Ajout de repas u00e0 un plan**
  - [ ] Vu00e9rifier les appels u00e0 `addMealToDailyPlanViaMCP`
  - [ ] Confirmer la mise u00e0 jour des totaux nutritionnels
  - [ ] Valider les contru00f4les de compatibilitu00e9 (objectifs du00e9passu00e9s, etc.)
  - [ ] Vu00e9rifier la gestion des quantitu00e9s de repas

- [ ] **Suivi de progression de plan**
  - [ ] Vu00e9rifier les appels u00e0 `getDailyProgressByPlanViaMCP`
  - [ ] Confirmer le calcul des pourcentages d'accomplissement
  - [ ] Valider l'interface entre plans et progressions quotidiennes
  - [ ] Vu00e9rifier les mu00e9canismes de mise u00e0 jour du suivi

## 4. ud83eudd16 Flux d'Intelligence Artificielle

- [ ] **Gu00e9nu00e9ration de contexte utilisateur**
  - [ ] Vu00e9rifier les appels u00e0 `generateUserContext`
  - [ ] Confirmer l'enrichissement correct du contexte (profil, plans, repas ru00e9cents)
  - [ ] Valider la performance de gu00e9nu00e9ration du contexte (mise en cache)
  - [ ] Vu00e9rifier la gestion des erreurs lors de l'accu00e8s aux donnu00e9es

- [ ] **Requu00eates utilisateur vers l'IA**
  - [ ] Vu00e9rifier le hook `useGemini` et son utilisation
  - [ ] Confirmer l'authentification utilisateur avant l'envoi des requu00eates
  - [ ] Valider la du00e9tection du type de prompt (`determinePromptType`)
  - [ ] Vu00e9rifier l'enrichissement des prompts avec le contexte

- [ ] **Du00e9tection et exu00e9cution d'actions**
  - [ ] Vu00e9rifier la du00e9tection des actions dans `detectDatabaseAction`
  - [ ] Confirmer le parsing des donnu00e9es JSON (repas, plans, ingru00e9dients)
  - [ ] Valider les appels MCP lors de l'exu00e9cution d'actions
  - [ ] Vu00e9rifier la gestion des erreurs lors de l'exu00e9cution

- [ ] **Recommandations personnalisu00e9es**
  - [ ] Vu00e9rifier la pertinence des suggestions basu00e9es sur le profil
  - [ ] Confirmer l'adaptation aux restrictions alimentaires
  - [ ] Valider l'intu00e9gration des recommandations dans l'interface
  - [ ] Vu00e9rifier le mu00e9canisme de feedback sur les suggestions

## 5. ud83cudf51 Flux de Gestion des Ingru00e9dients

- [ ] **Ajout d'ingru00e9dients standards**
  - [ ] Vu00e9rifier les appels u00e0 `addIngredientViaMCP`
  - [ ] Confirmer la validation des donnu00e9es nutritionnelles
  - [ ] Valider la du00e9duplication des ingru00e9dients similaires
  - [ ] Vu00e9rifier la gestion des unitu00e9s de mesure

- [ ] **Recherche d'ingru00e9dients**
  - [ ] Vu00e9rifier les appels u00e0 `getIngredientsListViaMCP`
  - [ ] Confirmer les mu00e9canismes de filtrage et tri
  - [ ] Valider la mise en cache des ru00e9sultats
  - [ ] Vu00e9rifier la performance des requu00eates sur de grandes listes

- [ ] **Su00e9lection d'ingru00e9dients pour les repas**
  - [ ] Vu00e9rifier le flux d'ajout d'ingru00e9dients lors de la cru00e9ation de repas
  - [ ] Confirmer le calcul des valeurs nutritionnelles totales
  - [ ] Valider la gestion des quantitu00e9s et portions
  - [ ] Vu00e9rifier la pru00e9sentation des ingru00e9dients ru00e9cemment utilisu00e9s

## 6. ud83dudcf8 Flux d'Upload de Mu00e9dias

- [ ] **Upload de photos de repas**
  - [ ] Vu00e9rifier les mu00e9canismes d'accu00e8s u00e0 la galerie/camu00e9ra
  - [ ] Confirmer le redimensionnement et compression des images
  - [ ] Valider le stockage et ru00e9cupu00e9ration des images
  - [ ] Vu00e9rifier la gestion des erreurs d'upload

- [ ] **Photos de profil utilisateur**
  - [ ] Vu00e9rifier le processus de su00e9lection d'avatar
  - [ ] Confirmer le crop/redimensionnement des images
  - [ ] Valider le stockage et la mise u00e0 jour du profil
  - [ ] Vu00e9rifier les fallbacks en cas d'image non disponible

## 7. ud83dudccb Flux de Suivi de Progression

- [ ] **Progression quotidienne**
  - [ ] Vu00e9rifier les appels u00e0 `getDailyProgressByDateViaMCP`
  - [ ] Confirmer le marquage des repas comme consommu00e9s
  - [ ] Valider le calcul des totaux nutritionnels consommu00e9s
  - [ ] Vu00e9rifier la comparaison avec les objectifs

- [ ] **Progression de plan**
  - [ ] Vu00e9rifier le suivi de l'u00e9volution du poids
  - [ ] Confirmer le calcul des statistiques hebdomadaires
  - [ ] Valider les visualisations de progression
  - [ ] Vu00e9rifier la du00e9tection de plateaux ou ru00e9gressions

- [ ] **Historique de consommation**
  - [ ] Vu00e9rifier l'enregistrement de l'historique des repas consommu00e9s
  - [ ] Confirmer l'accu00e8s u00e0 l'historique par pu00e9riode
  - [ ] Valider les mu00e9canismes d'export/sauvegarde des donnu00e9es
  - [ ] Vu00e9rifier les visualisations de tendances

## 8. ud83dudd03 Flux de Synchronisation des Donnu00e9es

- [ ] **Initialisation locale**
  - [ ] Vu00e9rifier l'initialisation de la base SQLite
  - [ ] Confirmer le chargement des donnu00e9es seed si nu00e9cessaire
  - [ ] Valider la vu00e9rification d'intu00e9gritu00e9 de la base
  - [ ] Vu00e9rifier les migrations de schu00e9ma si nu00e9cessaire

- [ ] **Gestion de cache**
  - [ ] Vu00e9rifier les mu00e9canismes de mise en cache (React Query)
  - [ ] Confirmer l'invalidation des caches apru00e8s modification
  - [ ] Valider les stratu00e9gies de rafrau00eechissement (staleTime, etc.)
  - [ ] Vu00e9rifier la gestion de l'u00e9tat de chargement

- [ ] **Gestion des erreurs**
  - [ ] Vu00e9rifier la capture et le logging des erreurs
  - [ ] Confirmer les mu00e9canismes de ru00e9cupu00e9ration apru00e8s erreur
  - [ ] Valider les feedback utilisateur en cas d'erreur
  - [ ] Vu00e9rifier le reporting des erreurs non gu00e9ru00e9es

## 9. ud83dudce1 Flux d'API et Intu00e9grations

- [ ] **Intu00e9gration API Gemini**
  - [ ] Vu00e9rifier la configuration des clu00e9s API
  - [ ] Confirmer la gestion des limites d'appels et quotas
  - [ ] Valider les timeout et retry en cas d'u00e9chec
  - [ ] Vu00e9rifier la gestion des ru00e9ponses d'erreur

- [ ] **MCP Server**
  - [ ] Vu00e9rifier l'initialisation du serveur MCP
  - [ ] Confirmer la gestion des transactions
  - [ ] Valider les mu00e9canismes de rollback en cas d'erreur
  - [ ] Vu00e9rifier les logs de performance

## 10. ud83dudd0a Flux de Notifications

- [ ] **Notifications locales**
  - [ ] Vu00e9rifier les mu00e9canismes de cru00e9ation de notifications
  - [ ] Confirmer les rappels pour les repas planifiu00e9s
  - [ ] Valider les notifications de progression
  - [ ] Vu00e9rifier la gestion des permissions

- [ ] **In-app notifications**
  - [ ] Vu00e9rifier le systu00e8me de toast/alert
  - [ ] Confirmer les notifications de succu00e8s/erreur
  - [ ] Valider l'accessibilitu00e9 des messages
  - [ ] Vu00e9rifier la consistance du style

---

## ud83dudccb Instructions d'Audit

1. Pour chaque item, vu00e9rifier le code source correspondant
2. Documenter les problu00e8mes trouvu00e9s avec :
   - Chemin du fichier et numu00e9ro de ligne
   - Description du problu00e8me
   - Impact potentiel
   - Suggestion de correction
3. Attribuer une prioritu00e9 (Critique, u00c9levu00e9e, Moyenne, Faible) u00e0 chaque problu00e8me
4. Cru00e9er des issues GitHub pour les problu00e8mes critiques et u00e9levu00e9s

Cette checklist devrait \u00eatre utilis\u00e9e avant toute revue UI pour s'assurer que tous les flux de donn\u00e9es fonctionnent correctement au niveau du code.
