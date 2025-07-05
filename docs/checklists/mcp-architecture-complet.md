# Architecture MCP Complète de Lift

Ce document détaille l'architecture MCP (Model-Controller-Presenter) complète de l'application Lift, incluant toutes les couches de services, leurs responsabilités et les flux d'interaction.

## 1. Architecture Complète par Couches

```
UI (React/React Native Components)
    ↓ ↑
Services UI (UI spécifique)
    ↓ ↑
Services Forms (Gestion des formulaires)
    ↓ ↑
Services Pages (Presenter)
    ↓ ↑
Services Core (Controller)
    ↓ ↑
Handlers MCP (Model)
    ↓ ↑
Base de données (SQLite)
```

## 2. Responsabilités de Chaque Couche

### 2.1 Composants UI (React/React Native)

- **Rôle**: Affichage et interactions utilisateur
- **Emplacement**: `app/(root)/(tabs)/...` et composants dans `components/`
- **Responsabilités**:
  - Rendu des interfaces utilisateur
  - Gestion des interactions utilisateur basiques
  - Utilisation des hooks pour obtenir les données
- **Bonnes pratiques**:
  - Ne doit contenir aucune logique métier
  - Utiliser des hooks pour les données (useQuery, etc.)
  - Déléguer la logique aux services appropriés

### 2.2 Services UI (utils/services/ui)

- **Rôle**: Gestion des aspects UI spécifiques indépendants de la logique métier
- **Emplacement**: `utils/services/ui/*.service.ts`
- **Responsabilités**:
  - Formatage des données pour l'affichage
  - Classes CSS dynamiques
  - Utilitaires UI partagés
- **Bonnes pratiques**:
  - Pas d'accès aux données
  - Fonctions pures quand possible
  - Nommage avec `.service.ts` ou `-ui.service.ts`

### 2.3 Services Forms (utils/services/forms)

- **Rôle**: Gestion et validation des formulaires
- **Emplacement**: `utils/services/forms/form-*.service.ts`
- **Responsabilités**:
  - Validation des entrées utilisateur
  - Préparation et transformation des données de formulaire
  - Gestion des états de formulaire
- **Bonnes pratiques**:
  - Ne pas contenir de logique métier pure
  - Pas d'accès direct aux données
  - Déléguer aux services pages pour les soumissions
  - Implémenter des interfaces bien définies (FormServiceInterface)

### 2.4 Services Pages (Presenter)

- **Rôle**: Orchestration des interactions UI-métier
- **Emplacement**: `utils/services/pages/*-pages.service.ts`
- **Responsabilités**:
  - Délégation aux services core
  - Gestion des erreurs orientée UI
  - Orchestration des opérations
- **Bonnes pratiques**:
  - JAMAIS d'accès direct aux données (toujours via services core)
  - Pas de logique métier
  - Simple délégation au service core correspondant
  - Nommage avec `-pages.service.ts`

### 2.5 Services Core (Controller)

- **Rôle**: Logique métier et accès aux données
- **Emplacement**: `utils/services/core/*.service.ts`
- **Responsabilités**:
  - Implémenter toute la logique métier
  - Calculs et transformations de données
  - Orchestration des handlers MCP
- **Bonnes pratiques**:
  - Contenir toute la logique métier
  - Accès aux données uniquement via handlers MCP
  - Nommage avec `.service.ts` ou `-core.service.ts`

### 2.6 Handlers MCP (Model)

- **Rôle**: Accès direct à la base de données
- **Emplacement**: `utils/mcp/handlers/*.handler.ts` et `utils/mcp/sqlite-server.ts`
- **Responsabilités**:
  - Exécution des requêtes SQL
  - Transformation des données DB ↔ Domain
  - Gestion des erreurs DB
- **Bonnes pratiques**:
  - Méthodes avec suffixe "ViaMCP"
  - Validation des permissions
  - Gestion des transactions

## 3. Flux d'Exemple: Mise à jour d'un profil utilisateur

### Étape 1: Composant UI

```tsx
// Dans un composant React
function ProfileEditScreen() {
  const { form, handleSubmit, isSubmitting } = useUserProfileForm();

  return (
    <Form onSubmit={handleSubmit}>
      <FormField name="name" label="Nom" control={form.control} />
      <FormField name="email" label="Email" control={form.control} />
      <Button
        isLoading={isSubmitting}
        onPress={form.handleSubmit(handleSubmit)}
      >
        Enregistrer
      </Button>
    </Form>
  );
}
```

### Étape 2: Hook et Service UI

```typescript
// Hook utilisant service UI
function useUserProfileForm() {
  const form = useForm({
    resolver: (data) => userProfileFormService.validateUserProfile(data)
  });

  // Service UI pour le formatage
  const displayName = profileUIService.formatDisplayName(form.watch('name'));

  return { form, displayName, ... };
}
```

### Étape 3: Service Forms

```typescript
// Dans utils/services/forms/form-user-profile.service.ts
class UserProfileFormService implements UserProfileFormServiceInterface {
  validateUserProfile(data: UserProfileFormData): FormValidationResult {
    // Validation du formulaire
    const errors = {};
    if (!data.name) errors.name = 'Le nom est requis';
    if (!isValidEmail(data.email)) errors.email = 'Email invalide';
    return { errors };
  }

  prepareFormData(rawData: any): UserProfileData {
    // Transforme les données brutes en format adapté
    return {
      name: rawData.name?.trim(),
      email: rawData.email?.toLowerCase(),
      updatedAt: new Date().toISOString(),
    };
  }
}
```

### Étape 4: Service Pages (Presenter)

```typescript
// Dans utils/services/pages/user-pages.service.ts
class UserPagesService implements UserPagesServiceInterface {
  async updateUserProfile(
    id: number,
    data: any,
  ): Promise<OperationResult<any>> {
    try {
      logger.info(LogCategory.USER, 'Mise à jour du profil utilisateur', {
        id,
      });

      // Délégation au service core
      return await userService.updateUserProfile(id, data);
    } catch (error) {
      logger.error(
        LogCategory.USER,
        'Erreur lors de la mise à jour du profil',
        { error, id },
      );
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Une erreur est survenue',
      };
    }
  }
}
```

### Étape 5: Service Core (Controller)

```typescript
// Dans utils/services/core/user.service.ts
class UserService {
  async updateUserProfile(
    id: number,
    data: any,
  ): Promise<OperationResult<any>> {
    try {
      // Vérification et logique métier
      if (!id) {
        return { success: false, error: 'ID utilisateur requis' };
      }

      // Vérifier l'existence de l'utilisateur
      const userExists = await this.checkUserExists(id);
      if (!userExists) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      // Logique métier: vérification des contraintes
      if (data.email && (await this.isEmailTaken(data.email, id))) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      // Accès aux données via handler MCP
      const result = await updateUserProfileViaMCP(id, data);

      return {
        success: true,
        data: result.user,
        message: 'Profil mis à jour avec succès',
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur service user updateProfile', {
        error,
        id,
      });
      return { success: false, error: error.message };
    }
  }
}
```

### Étape 6: Handler MCP (Model)

```typescript
// Dans utils/mcp/handlers/user-handlers.ts
export async function updateUserProfileViaMCP(
  db: DrizzleDB,
  userId: number,
  data: Partial<UserDBSchema>,
): Promise<OperationResult<{ user: UserDBSchema }>> {
  try {
    // Drizzle DSL – pas de SQL brut !
    await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    // Mettre à jour les préférences si fournies
    if (data.preferences) {
      await db
        .update(userPreferences)
        .set({
          theme: data.preferences.theme,
          language: data.preferences.language,
        })
        .where(eq(userPreferences.userId, userId));
    }

    // Retourner l'utilisateur mis à jour
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    return { success: true, user };
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Erreur updateUserProfileViaMCP', {
      error,
      userId,
    });
    return { success: false, error: (error as Error).message };
  }
}
```

## 4. Directives pour la Refactorisation

Pour assurer la conformité avec cette architecture:

### 4.1 Services Pages

- Toujours déléguer au service core correspondant
- Jamais d'appel direct à sqliteMCPServer
- Pas de logique métier, uniquement orchestration et gestion d'erreurs
- Exemple modèle: `user-pages.service.ts`

### 4.2 Services UI et Forms

- Séparer clairement les responsabilités UI et formulaires
- Aucun accès direct aux données
- Déléguer aux services pages pour les opérations de données
- Mettre l'accent sur la validation et le formatage

### 4.3 Nommage cohérent

- Services pages: `*-pages.service.ts`
- Services forms: `form-*.service.ts`
- Services UI: `*-ui.service.ts`
- Services core: `*.service.ts` ou `*-core.service.ts`

## 5. Modèles à Suivre

| Type de service | Exemple modèle                   | Points forts                       |
| --------------- | -------------------------------- | ---------------------------------- |
| Pages           | `user-pages.service.ts`          | Délégation pure, gestion d'erreurs |
| Core            | `meal.service.ts`                | Logique métier bien encapsulée     |
| Forms           | `form-user-profile.service.ts`   | Validation et transformation       |
| UI              | `meals-company-style.service.ts` | Formatage UI uniquement            |

Cette architecture complète assure une séparation claire des responsabilités, ce qui facilite la maintenance, les tests et l'évolution de l'application.
