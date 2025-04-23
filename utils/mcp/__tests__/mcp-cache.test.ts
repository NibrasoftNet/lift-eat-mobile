import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

/**
 * Tests unitaires pour la classe MCPCache
 * 
 * Ces tests vérifient le bon fonctionnement du mécanisme de cache
 * qui est utilisé dans le serveur SQLite MCP.
 */

// Import de la classe MCPCache
// Note: Comme MCPCache est une classe privée dans sqlite-server.ts, 
// nous la recréons ici pour les tests
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class MCPCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }
    
    // Vérifier si l'entrée a expiré
    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key); // Supprimer l'entrée expirée
      return undefined;
    }
    
    return entry.data;
  }
  
  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }
  
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Vérifier si l'entrée a expiré
    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key); // Supprimer l'entrée expirée
      return false;
    }
    
    return true;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  invalidateByPrefix(keyPrefix: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        keysToDelete.push(key);
      }
    }
    
    // Supprimer les clés en dehors de la boucle pour éviter les problèmes d'itération
    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }
}

describe('MCPCache', () => {
  let cache: MCPCache;
  
  beforeEach(() => {
    // Réinitialiser le cache avant chaque test
    cache = new MCPCache();
    
    // Mock Date.now() pour contrôler le temps dans les tests
    jest.spyOn(Date, 'now').mockImplementation(() => 1000);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('Méthode set et get', () => {
    it('devrait stocker et récupérer des données correctement', () => {
      const key = 'test-key';
      const data = { id: 1, name: 'Test Data' };
      
      cache.set(key, data);
      expect(cache.get(key)).toEqual(data);
    });
    
    it('devrait retourner undefined pour une clé inexistante', () => {
      expect(cache.get('nonexistent-key')).toBeUndefined();
    });
    
    it('devrait respecter le temps d\'expiration', () => {
      const key = 'expiring-key';
      const data = { value: 'test' };
      
      // Ajouter une entrée qui expire après 500ms
      cache.set(key, data, 500);
      
      // À t=1000ms, l'entrée ne devrait pas avoir expiré
      expect(cache.get(key)).toEqual(data);
      
      // Simuler t=1400ms (entrée toujours valide)
      jest.spyOn(Date, 'now').mockImplementation(() => 1400);
      expect(cache.get(key)).toEqual(data);
      
      // Simuler t=1600ms (entrée expirée)
      jest.spyOn(Date, 'now').mockImplementation(() => 1600);
      expect(cache.get(key)).toBeUndefined();
    });
    
    it('devrait permettre de mettre à jour une entrée existante', () => {
      const key = 'update-key';
      
      cache.set(key, { count: 1 });
      expect(cache.get(key)).toEqual({ count: 1 });
      
      cache.set(key, { count: 2 });
      expect(cache.get(key)).toEqual({ count: 2 });
    });
  });
  
  describe('Méthode has', () => {
    it('devrait retourner true si la clé existe et n\'a pas expiré', () => {
      const key = 'exists-key';
      cache.set(key, 'value');
      
      expect(cache.has(key)).toBe(true);
    });
    
    it('devrait retourner false si la clé n\'existe pas', () => {
      expect(cache.has('nonexistent-key')).toBe(false);
    });
    
    it('devrait retourner false si la clé a expiré', () => {
      const key = 'expired-key';
      cache.set(key, 'value', 500);
      
      // Simuler t=1600ms (entrée expirée)
      jest.spyOn(Date, 'now').mockImplementation(() => 1600);
      expect(cache.has(key)).toBe(false);
    });
  });
  
  describe('Méthode delete', () => {
    it('devrait supprimer une entrée du cache', () => {
      const key = 'delete-key';
      cache.set(key, 'value');
      
      expect(cache.has(key)).toBe(true);
      
      cache.delete(key);
      expect(cache.has(key)).toBe(false);
      expect(cache.get(key)).toBeUndefined();
    });
    
    it('ne devrait pas échouer si la clé n\'existe pas', () => {
      expect(() => cache.delete('nonexistent-key')).not.toThrow();
    });
  });
  
  describe('Méthode clear', () => {
    it('devrait supprimer toutes les entrées du cache', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(true);
      
      cache.clear();
      
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(false);
    });
  });
  
  describe('Méthode invalidateByPrefix', () => {
    it('devrait supprimer toutes les entrées qui commencent par un préfixe donné', () => {
      // Ajouter plusieurs entrées avec différents préfixes
      cache.set('user:1:profile', { name: 'User 1' });
      cache.set('user:1:settings', { theme: 'dark' });
      cache.set('user:2:profile', { name: 'User 2' });
      cache.set('product:1', { name: 'Product 1' });
      
      // Invalider les entrées avec le préfixe "user:1:"
      cache.invalidateByPrefix('user:1:');
      
      // Vérifier que seules les entrées avec le préfixe ont été supprimées
      expect(cache.has('user:1:profile')).toBe(false);
      expect(cache.has('user:1:settings')).toBe(false);
      expect(cache.has('user:2:profile')).toBe(true);
      expect(cache.has('product:1')).toBe(true);
    });
    
    it('devrait gérer correctement le cas où aucune entrée ne correspond au préfixe', () => {
      cache.set('key1', 'value1');
      
      cache.invalidateByPrefix('nonexistent-prefix:');
      
      expect(cache.has('key1')).toBe(true);
    });
    
    it('devrait être sensible à la casse des préfixes', () => {
      cache.set('User:1:profile', { name: 'User 1' });
      cache.set('user:1:settings', { theme: 'dark' });
      
      cache.invalidateByPrefix('user:');
      
      expect(cache.has('User:1:profile')).toBe(true);
      expect(cache.has('user:1:settings')).toBe(false);
    });
  });
});
