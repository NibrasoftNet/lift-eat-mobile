# Checklist – Migration de `Meal Search` vers le nouveau Design System

> Objectif : Remplacer tous les anciens composants Gluestack/UI personnalisés par leurs équivalents dans `components-new/ui` sans modifier la logique métier ni les services.

---

## 1. Analyse du fichier `app/(root)/(tabs)/meals/search.tsx`

- **`VStack`, `HStack`** : Layout vertical / horizontal → `Box` (`row`/`column`) – remplacer classes Tailwind par props `px`, `py`, `gap`.
- **`Input`, `InputField`, `InputIcon`** : Champ de recherche → `Input` (atoms/inputs/Input) + prop `leftIcon` – `InputField` & `InputIcon` fusionnés dans la nouvelle API.
- **`Button`, `ButtonText`, `ButtonIcon`, `ButtonSpinner`** : Actions “Rechercher” / “Charger plus” → `Button` (atoms/inputs/Button) + `leftIcon` / `rightIcon` + prop `isLoading` – supprimer sous-composants internes.
- **`Select*` (Trigger, Input, etc.)** : Sélecteur de pays → `Dropdown` (molecules/inputs/Dropdown) ou créer `CountrySelector` – intégrer `ChevronDown` via prop `rightIcon`.
- **`Text`** : Typographie → `Text` (atoms/base/Text) – adapter variantes (`body`, `caption`, …).
- **`useToast`, `MultiPurposeToast`** : Notifications → `useAppToast` + composant `Toast` centralisé – vérifier tokens succès/erreur.
- **`OpenFoodSearchCard`** : Carte résultat produit → Migrer/Créer dans `components-new/ui/organisms/meal` – utiliser `Box`, `Text`, `Image`.
- **`Colors` constant** : Palette → Utiliser tokens thème (`theme.color('primary')`, etc.) – remplacer références `Colors.light.text`.

## 2. Services / Hooks utilisés (à **conserver**) ✅

- `react-query` → `useQuery` (clé : `product-search`).
- `fetch` direct vers l’API OpenFoodFacts (pas de modification prévue).
- Enum : `CountryTypeEnum`, config : `CountryConfig`.
- `useTranslation` (i18n).

Aucune logique métier à déplacer ; seules les dépendances d’UI changent.

## 3. Étapes de migration

1. **Mettre en place le layout général (ordre visuel)** :
   - Ajouter un header `<TopBar>` avec titre & bouton "X" (`onClose` ⇒ `navigation.goBack`).
   - Remplacer le conteneur `VStack` racine par `<Box flex={1} bg={theme.color('background')}>`.
   - Convertir chaque `HStack`/`VStack` interne en `<Box row>` ou `<Box column>`.
   - Ordre final : **Header → Sélecteur de pays → Barre de recherche → Bouton Rechercher → Liste de résultats**.

2. **Champ de recherche** :
   - Importer `Input` depuis `components-new/ui/atoms/inputs`.
   - Passer `leftIcon={<Search size={20} color={theme.color('textMuted')}/>`.
   - Utiliser prop `onSubmitEditing` conservée.

3. **Sélecteur de pays** :
   - Utiliser `Dropdown` moléculaire (ou créer `CountryDropdown` si besoin).
   - Mapper les options déjà présentes (`CountryTypeEnum.*`).

4. **Boutons** :
   - Remplacer appels `Button` + `ButtonText/Icon/Spinner` par :
     ```tsx
     <Button
       isLoading={isLoading || isFetching}
       leftIcon={<Search size={18} color="#fff" />}
       onPress={handleSearch}
     >
       {t('meal.search.search')}
     </Button>
     ```
   - Pour “Charger plus”, utiliser variante `outlined` + `rightIcon={<ChevronDown …/>}`.

5. **Carte de résultat** :
   - Vérifier si `OpenFoodSearchCard` a déjà une version dans `components-new/ui/organisms/meal`.
   - Sinon, créer nouvelle carte selon Figma : image, nom, marques, grade nutritionnel.

6. **Couleurs & Styles** :
   - Supprimer `StyleSheet` local → utiliser design tokens (`theme.space`, `theme.radius`).
   - Remplacer `Colors.light.text` par `theme.color('text')`.

7. **Toast** :
   - Migrer vers `useAppToast` centralisé ; créer mapping toastType ↔ design tokens.

8. **Nettoyage imports** :
   - Supprimer tous les `/ui/` anciens et pointer vers `components-new/ui`.
   - Vérifier qu’aucune dépendance Gluestack (`@/gluestack/*`) ne reste.

9. **Tests manuels** :
   - i18n (EN/FR) fonctionne toujours.
   - Recherche, pagination et changement de pays OK.
   - Dark / light mode supporté.

10. **Documentation** :
    - Mettre à jour `integration-status-2025.md` (Organism `OpenFoodSearchCard` + Écran `Meal Search` → “Terminé”).
    - Ajouter capture d’écran avant/après si nécessaire.

---

### Suivi d’avancement (cochez au fur et à mesure)

- [ ] Header (titre + bouton "X") ajouté
- [ ] Layout migré vers `Box`
- [ ] Sélecteur de pays migré
- [ ] Barre de recherche migrée
- [ ] Boutons migrés (recherche & load more)
- [ ] Liste de résultats (FlashList + `OpenFoodSearchCard`) migrée
- [ ] Toasts migrés
- [ ] Couleurs & styles tokens
- [ ] Imports nettoyés
- [ ] Tests manuels réalisés
- [ ] Docs mises à jour
