# Checklist de nettoyage du systu00e8me de cache MCP

Ce document du00e9crit les u00e9tapes pour nettoyer le systu00e8me de cache redundant (mcpCache) et consolider toute la gestion de cache sur React Query.

## 1. Identifier les du00e9pendances

- [x] Analyser tous les fichiers utilisant `mcpCache`
  ```bash
  # Exu00e9cuter cette commande pour trouver toutes les ru00e9fu00e9rences
  grep -r "mcpCache" --include="*.ts" --include="*.tsx" ./utils
  ```
- [x] Lister les fichiers avec des imports et des usages directs de mcpCache
  - `utils/mcp/sqlite-server.ts` (principal utilisateur)
  - `utils/mcp/examples/improved-cache-example.ts` (exemples d'utilisation)
  - `utils/mcp/__tests__/mcp-cache.test.ts` (tests)
- [x] Identifier les mu00e9thodes dans `SQLiteMCPServer` qui utilisent mcpCache en interne
  - `generateUserContext`
  - `getIngredientsListViaMCP`
  - `createNewMealViaMCP`
  - `getPlansListViaMCP`
  - `getMealsListViaMCP`
  - `getMealByIdWithIngredientsViaMCP`
  - `deleteMealViaMCP`
  - `getUserDetailsViaMCP`

## 2. Neutraliser le mcpCache temporairement (approche progressive)

- [x] Modifier `mcpCache.get` pour toujours retourner `undefined` (du00e9sactive le cache sans supprimer les appels)
  ```typescript
  // utils/mcp/cache/mcp-cache.ts
  get<T>(key: string): T | undefined {
    // Du00e9sactivu00e9 en faveur de React Query
    this.stats.misses++;
    return undefined;
  }
  ```
- [x] Modifier `mcpCache.set` pour ne faire que les logs sans stocker en cache
  ```typescript
  set(key: string, data: T, group: CacheGroup, expiresIn: number = CacheDuration.MEDIUM): void {
    // Ne pas mettre en cache, juste logger
    logger.debug(LogCategory.CACHE, `Cache disabled: would have stored ${key} (group: ${group})`);
  }
  ```
- [x] Modifier `mcpCache.invalidateEntity` et autres mu00e9thodes d'invalidation pour n'effectuer que les logs
  ```typescript
  invalidateEntity(group: CacheGroup, entityId: number): void {
    // Ne rien faire sauf logger
    logger.debug(LogCategory.CACHE, `Cache invalidation skipped for ${group}/${entityId}`);
  }
  ```
- [x] Tester l'application pour vu00e9rifier qu'elle continue u00e0 fonctionner correctement

## 3. Simplifier les mu00e9thodes du MCP Server

- [x] Pour chaque mu00e9thode identifiu00e9e qui utilise mcpCache :
  - [x] generateUserContext
  - [x] getIngredientsListViaMCP 
  - [x] createNewMealViaMCP
  - [x] getPlansListViaMCP
  - [x] getMealsListViaMCP
  - [x] getMealByIdWithIngredientsViaMCP
  - [x] deleteMealViaMCP
  - [x] getUserDetailsViaMCP

Pour chaque mu00e9thode :
  - [x] Supprimer le code de gestion de cache (get/set)
  - [x] Conserver les logs de performance
  - [x] Conserver l'appel direct au handler correspondant

Exemple pour `getMealsListViaMCP` :
```typescript
public async getMealsListViaMCP(userId?: number, cuisine?: string, mealType?: string, mealName?: string) {
  try {
    logger.info(LogCategory.DATABASE, `Getting meals list for user ${userId || 'all'} via MCP`);
    
    // Mesurer le temps pour les logs
    const startTime = performance.now();
    
    // Appel direct au handler
    const result = await handleGetMealsList(this.db, { userId: userId || 0 });
    
    const accessTime = performance.now() - startTime;
    logger.debug(LogCategory.DATABASE, `Database access time for meals list: ${accessTime.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error getting meals list via MCP: ${error}`);
    return {
      success: false,
      error: `Failed to get meals list: ${error}`
    };
  }
}
```

## 4. Standardiser l'utilisation de React Query

- [x] Identifier le probu00e8me des doubles notifications : dans `MealForm.tsx`, les notifications sont du00e9clenchu00e9es par plusieurs invalidations de cache successives
  ```typescript
  // Problu00e8me identifiu00e9 dans MealForm.tsx
  // 1. Force une nouvelle requu00eate en ignorant le cache
  await sqliteMCPServer.getMealsListViaMCP(userId, undefined, undefined, undefined, true);
  
  // 2. Invalide le cache React Query (redu00e9clenche la requu00eate)
  invalidateCache(queryClient, DataType.MEALS_LIST, { invalidateRelated: true });
  
  // 3. Force une autre requu00eate pour vu00e9rification (inutile)
  const mealsResult = await sqliteMCPServer.getMealsListViaMCP(userId, undefined, undefined, undefined, true);
  ```
  
- [x] Corriger le probu00e8me dans MealForm.tsx en simplifiant le code pour n'avoir qu'une seule invalidation de cache
  ```typescript
  // Simplification - Une seule invalidation de cache est requise
  invalidateCache(queryClient, DataType.MEALS_LIST, { invalidateRelated: true });
  ```
  
- [x] Standardiser les paramu00e8tres de mise en cache (staleTime, gcTime) en fonction du type de donnu00e9es
- [x] Standardiser la structure des clu00e9s de requ00eate pour garantir une cohu00e9rence
- [x] Implu00e9menter un systu00e8me d'invalidation de cache unique et centralisu00e9 pour u00e9viter les invalidations multiples
- [x] Ajouter des commentaires expliquant la stratu00e9gie de cache dans les composants complexes

## 5. Supprimer le code du mcpCache

Apru00e8s avoir vu00e9rifiu00e9 que l'application fonctionne correctement sans mcpCache :

- [x] Supprimer les imports de mcpCache dans tous les fichiers identifiu00e9s
  - [x] utils/mcp/sqlite-server.ts
  - [x] utils/mcp/examples/improved-cache-example.ts
- [x] Supprimer les appels u00e0 mcpCache.invalidateEntity, mcpCache.invalidateByGroup, etc.
- [x] Supprimer le fichier utils/mcp/cache/mcp-cache.ts
- [x] Supprimer utils/mcp/cache/cache-config.ts s'il n'est plus utilisu00e9
- [x] Supprimer les tests associu00e9s : utils/mcp/__tests__/mcp-cache.test.ts

## 6. Mise u00e0 jour de la documentation

- [ ] Mettre u00e0 jour la documentation de l'architecture MCP
- [x] Documenter l'utilisation standardisu00e9e de React Query
  - [x] Ajout d'un exemple complet dans `utils/mcp/examples/improved-cache-example.ts`
- [ ] Cru00e9er un guide de bonnes pratiques pour la gestion du cache
- [ ] Ajouter une section expliquant la raison de la suppression du mcpCache

## 7. Tests et validation

- [x] Exu00e9cuter/supprimer tous les tests unitaires associu00e9s au mcpCache
- [ ] Tester manuellement les fonctionnalitu00e9s qui utilisaient intensivement le cache :
  - [ ] Chargement des repas
  - [ ] Cru00e9ation/modification de repas
  - [ ] Chargement des plans
  - [ ] Cru00e9ation/modification de plans
- [ ] Vu00e9rifier les performances de l'application
- [x] Vu00e9rifier que le probu00e8me des doubles notifications toast est ru00e9solu
