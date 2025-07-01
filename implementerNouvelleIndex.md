# Audit des imports – `app/(root)/(tabs)/plans/my-plans/index.tsx`

## Tableau de vérification des composants

| # | Import | Présent dans le fichier | Lignes utilisées | Statut |
|---|--------|-------------------------|------------------|--------|
| 1 | `React, useCallback, useState` | ✔︎ | 20-24, 50, 56 | OK |
| 2 | `FlashList` | ✔︎ | 82-114 | OK |
| 3 | `Link, useRouter` | ✔︎ | 21, 68-70, 119-123 | OK |
| 4 | `Box` | ✔︎ | 66-71, 73, 102-107 | OK |
| 5 | `Text` | ✔︎ | 67, 104-107, 111-113 | OK |
| 6 | `Fab, FabLabel, FabIcon` | ✔︎ | 116-123 | OK |
| 7 | `AddIcon, Icon, SearchIcon` | ✔︎ | 69-70, 75, 118-120 | OK |
| 8 | `SoupIcon` | ✔︎ | 69 | OK |
| 9 | `useSessionStore` | ✘ | — | À supprimer ou utiliser |
|10 | `useQuery` | ✔︎ | 26-44 | OK |
|11 | `PlanOrmProps` | ✘ | — | À supprimer ou typer `plansList` |
|12 | `QueryStateHandler` | ✔︎ | 62, 131 | OK |
|13 | `PlanCard` | ✔︎ | 83-85 | OK |
|14 | `VStack` | ✔︎ | 65, 126 | OK |
|15 | `RefreshControl` | ✔︎ | 86-92 | OK |
|16 | `planPagesService` | ✔︎ | 35 | OK |
|17 | `Input, InputIcon, InputSlot, InputField` | ✔︎ | 73-80 | OK |
|18 | `HStack` | ✔︎ | 108-113 | OK |

---

## Points d'action

1. **Imports non utilisés**
   - `useSessionStore`: non référencé.
   - `PlanOrmProps`: non référencé.

   ➜ Supprimer ces imports ou les employer (par ex. typage de `plansList`).

2. **Typage recommandé**
   ```ts
   const plansList: PlanOrmProps[] = data?.plans ?? [];
   ```

3. **Alias `@/`**
   Vérifier la cohérence entre `tsconfig.json` et `babel.config.js`:
   ```jsonc
   // tsconfig.json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

4. **Nettoyage ESLint/TS**
   Retirer les imports inutiles pour éviter les warnings et réduire la taille du bundle.

5. **Tests**
   Après modifications :
   ```bash
   npx expo start -c
   ```
   pour relancer Metro avec cache vidé.

---

## Plan d’implémentation – Écran “My Plans”

### Étape 1 – UI (Composants & Layout)
- ⬜ Ajuster `CircularNutritionProgress` (`strokeWidth`, `segmentGap`, couleurs).
- ⬜ Configurer `Chips` comme MacroStatChip.
- ✅ Créer `PlanCardNew` (infos, `CircularNutritionProgress`, MacroStatChip, menu, menu overlay) – image header non requise.
- ⬜ Ajouter `SegmentedTabButtons` en haut.
- ⬜ Header : titre + `SoupIcon`.
- ✅ `SearchBarWithFilter` intégrée.
- ⬜ Pagination label (`PaginationLabel`).
- ⬜ Remplacer toutes les couleurs/espaces hardcodés par `theme.color`, `theme.space`, `theme.radius`, `theme.shadow`. Utiliser `useTheme`. 
- ⬜ FAB vert “Créer un plan”.
- ⬜ Layout list (`FlashList` + padding/gap).

> **Workflow recommandé**
> 1. Finaliser les composants manquants : `PaginationLabel`, `FabButton`, pré-sets MacroStatChip, réglages `CircularNutritionProgress`.
> 2. Ensuite seulement, intégrer ces composants dans `my-plans/index.tsx` (SegmentedTabButtons, remplacement `PlanCard`, pagination label, FAB, etc.).
> 3. Terminer par les ajustements de thème, spacing et QA.

- ⬜ Vérifier alias `@/*` dans `tsconfig.json` / `babel.config.js`.
- ⬜ Typage `plansList` avec `PlanOrmProps[]`.
- ⬜ Supprimer imports inutiles (`useSessionStore`, `PlanOrmProps`).
- ⬜ Lancer `npm run lint` & corriger warnings.
- ⬜ Redémarrer Metro (`npx expo start -c`).

#### 3.7 Pull-to-refresh & scroll infini
- ⬜ Conserver `RefreshControl` et `onEndReached` pour pagination.

### Étape 2 – Logique & Données
- ⬜ Typage `plansList` (`PlanOrmProps[]`) et suppression imports inutiles.
- ⬜ Vérifier alias `@/*` (tsconfig/babel).
- ⬜ Gestion d’état `activeTab` pour filtrer (mine/community/company).
- ⬜ Intégrer pagination / infinite scroll (`onEndReached` TanStack).
- ⬜ Conserver `RefreshControl` pour pull-to-refresh.
- ⬜ Implémenter recherche (`searchQuery`) via `SearchBarWithFilter`.
- ⬜ Navigation vers écran création plan (`router.push`).
- ⬜ Tests unitaires TanStack query mock.
- ⬜ QA multi-plateforme, Dark Mode.
- ⬜ Audit accessibilité & performance.
- ⬜ Tests iOS/Android, Dark Mode, pull-to-refresh.
- ⬜ Audit accessibilité & performance.
