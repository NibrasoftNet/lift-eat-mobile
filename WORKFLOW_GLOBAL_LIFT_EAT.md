# Workflow Global Lift-Eat — Modules IA & Plan

## 1. 🤖 Module IA / Assistant
### A. Analyse & Préparation
- [x] Cartographier tous les fichiers/services IA
- [x] Lire et comprendre l'existant (logique, prompts, parsing, UI)
- [x] Lister points forts/faiblesses
- [x] Définir les objectifs d'amélioration

### B. Refactorisation & Optimisation
- [x] Centraliser la génération du contexte utilisateur
- [x] Séparer la logique IA (prompts, parsing, actions) dans un module dédié
- [x] Améliorer le parsing des réponses Gemini (tolérance, gestion erreurs)
- [x] Ajouter des validations robustes sur les données IA
- [x] Optimiser les requêtes SQLite
- [x] Ajouter des logs explicites pour le debug

### C. Améliorations Fonctionnelles
- [ ] Ajouter la gestion multi-tour (historique conversationnel IA)
- [ ] Personnalisation avancée (préférences, allergies…)
- [ ] Feedback utilisateur sur les réponses IA
- [ ] Internationalisation (multi-langue)
- [ ] Explicabilité des conseils IA
- [ ] Séparation claire UI/logique IA

### E. UX & UI
- [ ] Améliorer la clarté des messages d'erreur
- [ ] Ajouter des toasts/notifications IA
- [ ] Permettre consultation/modification de l'historique IA


## 2. 📋 Module Plan
### A. Fonctionnalités de Base (MVP)
- [x] Lister tous les plans de nutrition de l'utilisateur
- [x] Afficher les détails d'un plan (calories, macros, durée, jours, repas associés)
- [x] Créer un nouveau plan nutritionnel (formulaire, validation, insertion DB)
- [ ] Modifier un plan existant
- [ ] Supprimer un plan
- [x] Ajouter/retirer des repas à un jour d'un plan
- [x] Afficher les repas d'un jour dans un plan
- [ ] Gestion des erreurs et messages utilisateur (succès/échec)

### B. UX/UI & Ergonomie
- [ ] Améliorer la navigation entre écrans
- [ ] Affichage clair des valeurs nutritionnelles (graphiques, box…)
- [ ] Composants réutilisables (PlanCard, DailyPlanCard…)
- [ ] Feedback utilisateur (toasts, loaders)
- [ ] Responsive & accessibilité

### C. Robustesse & Optimisation
- [ ] Optimiser les requêtes DB
- [ ] Validation forte des données (Zod, types)
- [ ] Gestion des cas limites
- [ ] Tests unitaires/services
- [ ] Séparer la logique métier et UI

### D. Fonctionnalités Avancées
- [ ] Duplication d'un plan
- [ ] Partage de plans (community, export/import)
- [ ] Historique des plans et progression
- [ ] Suggestions IA (génération automatique de plans)
- [ ] Personnalisation avancée (objectifs, allergies)
- [ ] Notifications (rappels)
- [ ] Internationalisation


## 3. 🚦 Tâches Transverses & Déploiement
- [ ] Documenter toutes les évolutions (README, changelog)
- [ ] Préparer des démos/cas d'usage
- [ ] Mettre à jour les tests end-to-end
- [ ] Déployer et monitorer les retours utilisateurs

---

Ce workflow global te permet de piloter l'avancement de tous les modules clés de Lift-Eat. Tu peux cocher chaque étape et détailler si besoin. Demande-moi pour zoomer sur une section ou ajouter d'autres modules !
