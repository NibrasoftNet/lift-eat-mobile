# ✅ Checklist – Migration de l’écran « Mettre à jour un plan » vers le nouveau design system

> Objectif : Re-créer l’écran d’édition d’un plan en utilisant exclusivement le dossier `components-new` (NativeWind + ThemeProvider maison) et en supprimant toute dépendance à GlueStack UI ou aux anciens composants.

## 1. Analyse et préparation
- [ ] Répertorier tous les champs du modèle `Plan` qui doivent être éditables (nom, description, calories, macros, objectif, dates de validité, etc.).
- [ ] Vérifier le schéma de validation existant (Zod) ou en créer un nouveau dans `utils/validation/plan`.
- [ ] Recenser les hooks/services existants :
  - `usePlanDetails`, `usePlanNutritionGoals`, `planPagesService.updatePlan`.
  - Identifier les données manquantes ou à enrichir.

## 2. Définition des types et hooks
- [ ] Créer / mettre à jour une interface `PlanFormFields` (dans `utils/interfaces/plan.interface.ts`).
- [ ] Implémenter `useUpdatePlan` (React Query mutation) dans `utils/hooks/mutations/useUpdatePlan.ts` enveloppant `planPagesService.updatePlan`.
- [ ] Ajouter invalidation de cache (`planPagesService.invalidatePlanCache`).

## 3. Construction du formulaire UI (formulaire unique)
> Pour l’écran d’édition, on fusionne les **deux** formulaires utilisés lors de la création (ex : informations générales + objectifs nutritionnels) en **un seul** composant. Toutes les données devront être chargées, affichées et validées dans ce formulaire unique.
- [ ] Créer un composant **`PlanEditForm`** dans `components-new/ui/organisms/plan/PlanEditForm.tsx`.
  - [ ] Utiliser les nouveaux composants :`Input`, `Textarea`, `Select`, `DatePicker`, `Button` depuis `components-new/ui/atoms` ou `molecules`.
  - [ ] Disposer les champs (regroupés logiquement : détails généraux, objectifs/calories, dates, etc.)
  - [ ] Afficher messages d’erreur de validation sous chaque champ.
  - [ ] Ajouter indicateurs de chargement et d’état (`isSubmitting`, `isDirty`).
- [ ] Ajouter un bouton « Supprimer le plan » si la fonctionnalité existe.

## 4. Écran et navigation Expo Router
- [ ] Créer le fichier d’écran `app/(root)/(tabs)/plans/my-plans/edit/[id]-new.tsx` ou remplacer l’ancien.
  - [ ] Récupérer `id` via `useLocalSearchParams`.
  - [ ] Charger les données initiales via `usePlanDetails` et hydrater le formulaire.
  - [ ] Sur submit, appeler `useUpdatePlan` puis rediriger (toast + router.back()).
- [ ] Mettre à jour toutes les navigations (`router.push`) pointant vers l’ancien écran.

## 5. Thème et styles
- [ ] Utiliser la fonction `useTheme()` pour les couleurs, espaces, typographies.
- [ ] Appliquer Tailwind classes via NativeWind pour layout réactif.
- [ ] Tester en mode sombre / clair.

## 6. Gestion d’état et UX
- [ ] Ajouter feedbacks visuels : `MultiPurposeToast` pour succès/erreur.
- [ ] Désactiver le bouton « Enregistrer » tant que le formulaire n’est pas valide.
- [ ] Gérer les cas d’erreur réseau avec retry / alert.

## 7. Tests et qualité
- [ ] Créer des tests unitaires (Jest + React Native Testing Library) pour :
  - [ ] Validation Zod.
  - [ ] Soumission réussie / échouée.
- [ ] Vérifier ESLint/Prettier (pas de warning).

## 8. Nettoyage & documentation
- [ ] Supprimer les imports GlueStack inutilisés dans tout le projet.
- [ ] Archiver ou supprimer l’ancien écran `edit/[id].tsx`.
- [ ] Mettre à jour la documentation développeur (`docs/MPC.md` ou README) avec le nouveau flux.
- [ ] Ajouter changelog de migration.

---
Une fois toutes les cases cochées, l’écran de mise à jour du plan sera entièrement migré vers le nouveau design system sans dépendances héritées.
