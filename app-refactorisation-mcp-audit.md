# Audit et plan de refactorisation MCP du dossier `app`

## Résumé exécutif

L'application Lift-Eat-Mobile a récemment adopté l'architecture MCP (Model-Controller-Presenter) pour améliorer la séparation des préoccupations et faciliter la maintenance. Cet audit évalue la conformité du dossier `app` avec cette architecture et propose un plan de refactorisation.

**Constat principal :** Le dossier `app` contient principalement la logique de présentation mais intègre aussi directement la logique métier et l'accès aux données, ce qui va à l'encontre des principes MCP déjà établis dans d'autres parties de l'application.

## 1. Structure actuelle du dossier `app`

Le dossier `app` est organisé selon la structure d'**Expo Router** :
- `/app` : Point d'entrée de l'application
  - `(root)` : Contient les routes principales
    - `(auth)` : Authentification (login, register, reset-password)
    - `(tabs)` : Pages principales (meals, plans, progress, etc.)
    - `(user)` : Gestion du profil et préférences utilisateur

## 2. Problèmes identifiés

### 2.1. Non-conformité avec l'architecture MCP

#### 2.1.1. Présence de logique métier dans les composants
```typescript
// Exemple de login.tsx
const loginMutation = useMutation({
  mutationFn: async (data: LoginFormData) => {
    return sqliteMCPServer.loginUserViaMCP(data.email, data.password);
  },
  // Gestion d'état, erreurs et succès...
});
```

#### 2.1.2. Accès direct à la couche de persistance
```typescript
// Exemple de my-meals/index.tsx
const queryFn = useCallback(async () => {
  return sqliteMCPServer.getMealsListViaMCP({
    userId: getCurrentUserIdSync(),
    search: searchMealName,
    mealType: selectedMealType,
    cuisine: selectedCuisine
  });
}, [selectedCuisine, selectedMealType, searchMealName]);
```

#### 2.1.3. Gestion d'erreurs non standardisée
Chaque composant implémente sa propre approche de gestion d'erreurs, ce qui crée de l'incohérence.

#### 2.1.4. Duplication de code
Des logiques similaires (filtrage, pagination, validation) sont redéfinies dans plusieurs composants.

### 2.2. Impact sur la maintenance et l'évolution

- **Difficulté à tester** : La logique métier liée à l'interface utilisateur est difficile à tester unitairement
- **Incohérence** : Différentes approches pour des problèmes similaires
- **Fragilité** : Les changements dans l'API du serveur MCP nécessitent des modifications dans de nombreux fichiers

## 3. Principes de refactorisation MCP

Pour rappel, l'architecture MCP se compose de :

- **Model** : Gestion des données et règles métier
- **Controller** : Orchestration et coordination des flux
- **Presenter** : Rendu et interactions UI

## 4. Analyse des différentes catégories de pages

### 4.1. Pages d'authentification
**Exemple :** `login.tsx`
- **Problèmes** : Appels directs à `sqliteMCPServer`, logique métier mélangée à l'interface
- **Solution** : Extraire la logique d'authentification dans un service dédié

### 4.2. Pages de gestion des repas
**Exemple :** `meals/my-meals/index.tsx`
- **Problèmes** : Logique de filtrage et requêtes directement dans le composant
- **Solution** : Créer un service pour gérer les opérations CRUD et le filtrage

### 4.3. Pages d'assistant IA
**Exemple :** `assistant.tsx`
- **Problèmes** : Mélange de logique de communication avec l'IA et d'UI
- **Solution** : Extraire les interactions IA dans un service dédié

## 5. Plan de refactorisation

### 5.1. Structure cible des services
```
/utils/services/pages/
  ├── auth-pages.service.ts
  ├── meal-pages.service.ts
  ├── plan-pages.service.ts
  ├── progress-pages.service.ts
  ├── user-pages.service.ts
  └── assistant-pages.service.ts
```

### 5.2. Exemple d'implémentation
```typescript
// auth-pages.service.ts
import { LoginFormData } from '@/utils/validation/auth/login-schema.validation';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export const authPagesService = {
  /**
   * Authentifie un utilisateur avec son email et mot de passe
   */
  login: async (data: LoginFormData) => {
    try {
      logger.info(LogCategory.AUTH, 'Tentative de connexion', { email: data.email });
      const result = await sqliteMCPServer.loginUserViaMCP(data.email, data.password);
      
      if (!result.success) {
        throw new Error(result.error || 'Échec de la connexion');
      }
      
      return result;
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Erreur de connexion', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
};
```

### 5.3. Refactorisation d'un composant
```typescript
// login.tsx refactorisé
import { authPagesService } from '@/utils/services/pages/auth-pages.service';

// Dans le composant Login
const loginMutation = useMutation({
  mutationFn: async (data: LoginFormData) => {
    return authPagesService.login(data);
  },
  // Reste du code...
});
```

## 6. Checklist de refactorisation

### Phase 1: Préparation et organisation

- [x] Créer une structure de dossiers pour les services de pages
  ```
  /utils/services/pages/
  ```
- [x] Définir les interfaces pour les nouveaux services de pages
  ```
  /utils/interfaces/pages.interface.ts
  ```
- [x] Mettre à jour les mocks pour les tests

### Phase 2: Services d'authentification (Priorité Haute)

- [x] Créer `auth-pages.service.ts`
  - [x] Implémenter la fonction `login`
  - [x] Implémenter la fonction `register`
  - [x] Implémenter la fonction `resetPassword`
  - [x] Implémenter la fonction `updatePassword`
- [x] Refactoriser `/app/(root)/(auth)/login.tsx`
- [x] Refactoriser `/app/(root)/(auth)/register.tsx`
- [x] Refactoriser `/app/(root)/(auth)/reset-password.tsx`
- [x] Refactoriser `/app/(root)/(auth)/new-password.tsx`

### Phase 3: Services de gestion des repas (Priorité Haute)

- [x] Créer `meal-pages.service.ts`
  - [x] Implémenter la fonction `getMealsList`
  - [x] Implémenter la fonction `getMealDetails`
  - [x] Implémenter la fonction `createMeal`
  - [x] Implémenter la fonction `updateMeal`
  - [x] Implémenter la fonction `deleteMeal`
- [x] Refactoriser `/app/(root)/(tabs)/meals/my-meals/index.tsx`
- [x] Refactoriser `/app/(root)/(tabs)/meals/my-meals/details/[id].tsx`
- [x] Refactoriser `/app/(root)/(tabs)/meals/my-meals/edit/[id].tsx`
- [x] Refactoriser `/app/(root)/(tabs)/meals/community.tsx`

### Phase 4: Services de gestion des plans (Priorité Haute)

- [x] Créer `plan-pages.service.ts`
  - [x] Implémenter la fonction `getPlansList`
  - [x] Implémenter la fonction `getPlanDetails`
  - [x] Implémenter la fonction `createPlan`
  - [x] Implémenter la fonction `updatePlan`
  - [x] Implémenter la fonction `deletePlan`
- [x] Refactoriser `/app/(root)/(tabs)/plans/my-plans/index.tsx`
- [x] Refactoriser `/app/(root)/(tabs)/plans/my-plans/details/[id].tsx`
- [x] Refactoriser `/app/(root)/(tabs)/plans/my-plans/edit/[id].tsx`
- [x] Refactoriser `/app/(root)/(tabs)/plans/my-plans/create/index.tsx`

### Phase 5: Services de progression et d'analytics (Priorité Moyenne)

- [x] Créer `progress-pages.service.ts`
  - [x] Implémenter la fonction `getDailyProgress`
  - [x] Implémenter la fonction `updateProgress` 
  - [x] Implémenter la fonction `getProgressHistory`
  - [x] Implémenter la fonction `getProgressByPlan`
  - [x] Implémenter la fonction `createDailyProgress`
- [x] Refactoriser `/app/(root)/(tabs)/progress.tsx`
- [ ] Refactoriser `/app/(root)/(tabs)/analytics.tsx`

### Phase 6: Services de gestion utilisateur (Priorité Moyenne)

- [x] Créer `user-pages.service.ts`
  - [x] Implémenter la fonction `getUserProfile`
  - [x] Implémenter la fonction `updateUserProfile`
  - [x] Implémenter la fonction `getUserPreferences`
  - [x] Implémenter la fonction `updateUserPreferences`
- [x] Refactoriser `/app/(root)/(user)/profile/[id].tsx`
- [x] Refactoriser `/app/(root)/(user)/details/edit/[id].tsx`
- [x] Refactoriser `/app/(root)/(user)/preference/edit/[id].tsx`

### Phase 7: Intégration de l'assistant IA (Priorité Moyenne)

- [x] Créer `assistant-pages.service.ts`
  - [x] Implémenter la fonction `generateMeal`
  - [x] Implémenter la fonction `generatePlan`
  - [x] Implémenter la fonction `generateShoppingList`
  - [x] Implémenter la fonction `analyzeProgress`
- [x] Refactoriser `/app/(root)/(tabs)/assistant.tsx`
- [x] Refactoriser les composants IA (MealGeneratorForm, etc.)

### Phase 8: Standardisation et optimisation (Priorité Basse)

- [x] Créer des HOC (Higher Order Components) pour la gestion des états communs
- [x] Standardiser les hooks personnalisés pour les requêtes
- [x] Optimiser les imports et dépendances
- [x] Mettre à jour les exemples d'utilisation des nouveaux services

### Phase 9: Tests et validation

- [ ] Écrire des tests unitaires pour les nouveaux services
- [ ] Écrire des tests d'intégration pour les composants refactorisés
- [ ] Vérifier la couverture de tests
- [ ] Valider les performances

### Phase 10: Documentation et finalisation

- [ ] Mettre à jour la documentation technique
- [ ] Créer des exemples d'utilisation des services
- [ ] Finaliser un rapport de refactorisation
- [ ] Préparer une présentation pour l'équipe

## 7. Avantages attendus

- **Meilleure séparation des préoccupations** : Services autonomes et ciblés
- **Réduction de la duplication** : Logique centralisée et réutilisable
- **Amélioration de la testabilité** : Tests unitaires facilités
- **Standardisation des pratiques** : Approche cohérente
- **Évolutivité simplifiée** : Modification et extension plus faciles

## 8. Conclusion

Cette refactorisation alignera le dossier `app` avec les principes de l'architecture MCP déjà appliquée aux composants modaux, formulaires et autres parties de l'application. Cette uniformisation rendra le codebase plus robuste, maintenable et évolutif.

Le processus de refactorisation peut être effectué progressivement, en commençant par les pages les plus critiques (authentification, repas, plans) tout en maintenant les fonctionnalités existantes.

*Date de l'audit : 26 avril 2025*
