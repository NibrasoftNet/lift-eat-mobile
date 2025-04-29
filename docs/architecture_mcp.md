# Architecture MCP de Lift-Eat-Mobile

## Introduction à l'Architecture MCP

L'architecture MCP (Model-Controller-Persistence) est une variante du modèle MVC adaptée aux applications mobiles avec accès à une base de données locale. Cette architecture centralise l'accès aux données via des handlers spécifiques plutôt que d'accéder directement à la base de données depuis les composants UI.

## Structure des Couches

### 1. Couche UI (User Interface)

**Rôle** : Présentation des données et interaction avec l'utilisateur.

**Composants** :
- Écrans (`/app/`)
- Composants réutilisables (`/components/`)
- Modals, Drawers, Cards, etc.

**Responsabilités** :
- Affichage des informations
- Capture des entrées utilisateur
- Navigation entre les écrans
- Gestion des états UI locaux

**À ne pas faire** :
- ❌ Accéder directement à la base de données
- ❌ Implémenter de la logique métier complexe

### 2. Couche Service

**Rôle** : Logique métier et coordination.

**Composants** :
- Services génériques (`/utils/services/`)
- Services spécifiques aux pages (`/utils/services/pages/`)

**Responsabilités** :
- Implémenter la logique métier
- Coordonner les appels au serveur MCP
- Gérer les erreurs et les exceptions
- Fournir des interfaces claires aux composants UI

**Conventions de nommage** :
- Services génériques : `<domaine>.service.ts` (ex: `plan.service.ts`)
- Services de pages : `<domaine>-pages.service.ts` (ex: `plan-pages.service.ts`)

### 3. Couche MCP (Model-Controller-Persistence)

**Rôle** : Point d'entrée unique pour toutes les opérations de base de données.

**Composants** :
- Serveur MCP (`/utils/mcp/sqlite-server.ts`)
- Handlers spécifiques (`/utils/mcp/handlers/`)
- Interfaces MCP (`/utils/mcp/interfaces/`)

**Responsabilités** :
- Fournir des méthodes pour toutes les opérations CRUD
- Valider les entrées avant manipulation de la base de données
- Gérer les transactions et la cohérence des données
- Formater les résultats de manière cohérente

**Conventions de nommage** :
- Méthodes du serveur MCP : `<action><Entité>ViaMCP` (ex: `getPlanViaMCP`)
- Handlers : `handle<Action><Entité>` (ex: `handleGetPlan`)

### 4. Couche DB (Database)

**Rôle** : Stockage et récupération des données.

**Composants** :
- Schémas (`/db/schema.ts`)
- Connexion et configuration (`/db/config.ts`)
- Migrations et seeds (`/db/migrations/`)

**Responsabilités** :
- Définir la structure des données
- Gérer les relations entre entités
- Exécuter les requêtes SQL
- Garantir l'intégrité des données

## Flux de Données

1. **Composant UI** demande des données ou action
2. → Appelle une méthode du **Service**
3. → Le Service coordonne et appelle le **Serveur MCP**
4. → Le Serveur MCP délègue au **Handler** approprié
5. → Le Handler exécute la logique et interagit avec la **DB**
6. → Résultats remontés au Handler → Serveur MCP → Service → UI

## Gestion des Erreurs

- Handlers : Capture et journalisation des erreurs DB
- Serveur MCP : Formatage uniforme des erreurs
- Services : Traitement métier des erreurs
- UI : Affichage approprié à l'utilisateur

## Conventions de Développement

### Structures de Retour

Tous les handlers MCP retournent un objet avec cette structure :
```typescript
{
  success: boolean;
  error?: string;
  data?: T; // T est le type de données retourné, si success est true
}
```

### Validation

La validation des entrées doit se faire à plusieurs niveaux :
1. UI : Validation utilisateur (formulaires)
2. Services : Validation métier
3. Handlers : Validation avant interaction avec la DB

### Logging

Utiliser `logger` pour journaliser les opérations importantes :
```typescript
logger.info(LogCategory.DATABASE, 'Message descriptif', { contexte: 'données' });
```

## Exemple Complet

**UI (PlanCard.tsx)**
```typescript
const handleDelete = async () => {
  const result = await planService.deletePlan(plan.id);
  if (result.success) {
    // Traitement UI du succès
  } else {
    // Traitement UI de l'erreur
  }
};
```

**Service (plan.service.ts)**
```typescript
async deletePlan(planId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserIdSync();
    if (!userId) {
      return { success: false, error: 'Authentification requise' };
    }
    
    const result = await sqliteMCPServer.deletePlanViaMCP(planId, userId);
    return result;
  } catch (error) {
    logger.error(LogCategory.SERVICE, `Erreur service suppression plan: ${error}`);
    return { success: false, error: String(error) };
  }
}
```

**MCP Server (sqlite-server.ts)**
```typescript
async deletePlanViaMCP(planId: number, userId: number): Promise<DeletePlanResult> {
  try {
    return await handleDeletePlan(this.db, { planId, userId });
  } catch (error) {
    logger.error(LogCategory.MCP, `Erreur MCP suppression plan: ${error}`);
    return { success: false, error: String(error) };
  }
}
```

**Handler (plan-handlers.ts)**
```typescript
async function handleDeletePlan(db: any, params: DeletePlanParams): Promise<DeletePlanResult> {
  try {
    const { planId, userId } = params;
    
    // Vérification que l'utilisateur possède ce plan
    const plan = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
    if (plan.length === 0) {
      return { success: false, error: 'Plan non trouvé' };
    }
    
    if (plan[0].userId !== userId) {
      return { success: false, error: 'Accès non autorisé à ce plan' };
    }
    
    // Suppression du plan
    await db.delete(plans).where(eq(plans.id, planId));
    
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.HANDLER, `Erreur handler suppression plan: ${error}`);
    return { success: false, error: String(error) };
  }
}
```
