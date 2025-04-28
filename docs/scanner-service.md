# Scanner Service

## Vue d'ensemble

Le Scanner Service est un service centralisé pour gérer les interactions avec l'API OpenFoodFacts. Il fournit des fonctionnalités pour scanner des codes-barres et rechercher des produits alimentaires, tout en intégrant un mécanisme de mise en cache pour optimiser les performances.

## Fonctionnalités

- **Scan de codes-barres** : Obtenir les informations nutritionnelles d'un produit à partir de son code-barres
- **Recherche de produits** : Rechercher des produits par termes et filtrer par type de cuisine
- **Mise en cache** : Stockage temporaire des produits déjà scannés et des recherches récentes
- **Gestion des erreurs** : Traitement uniforme des erreurs de l'API

## Comment utiliser le service

### Pour scanner un code-barres

```typescript
import scannerService from '@/utils/services/scanner.service';

// Dans votre composant
const handleBarCodeScanned = async (scanResult: BarcodeScanningResult) => {
  const { data } = scanResult;
  
  try {
    setLoading(true);
    // Utiliser le service pour scanner le code-barres
    const result = await scannerService.scanBarcode(data);
    
    if (result.isValid && result.productResult) {
      // Traiter le produit trouvé
      console.log('Produit trouvé:', result.productResult);
    } else {
      // Gérer le cas où aucun produit n'est trouvé
      console.log('Produit non trouvé:', result.message);
    }
  } catch (error) {
    console.error('Erreur lors du scan:', error);
  } finally {
    setLoading(false);
  }
};
```

### Pour rechercher des produits

```typescript
import scannerService from '@/utils/services/scanner.service';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';

// Dans votre composant
const searchProducts = async (searchTerms: string, cuisineType?: CuisineTypeEnum) => {
  try {
    setLoading(true);
    // Utiliser le service pour rechercher des produits
    const results = await scannerService.searchProducts(searchTerms, cuisineType);
    
    if (results && results.length > 0) {
      // Traiter les résultats de recherche
      console.log(`${results.length} produits trouvés`);
    } else {
      // Gérer le cas où aucun résultat n'est trouvé
      console.log('Aucun produit trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
  } finally {
    setLoading(false);
  }
};
```

## Architecture

Le service est implémenté selon le modèle Singleton pour garantir une instance unique à travers l'application. Il utilise un système de cache pour éviter les requêtes redondantes vers l'API:

- `cachedProducts`: Map stockant les produits déjà scannés par code-barres
- `lastSearchParams` et `lastSearchResults`: Cache pour les derniers paramètres et résultats de recherche

## Avantages de cette architecture

1. **Séparation des préoccupations**: La logique métier est séparée de l'interface utilisateur
2. **Réutilisabilité**: Le service peut être utilisé par plusieurs composants
3. **Maintenabilité**: Modifications centralisées de la logique d'interaction avec l'API
4. **Performance**: Mise en cache des résultats pour réduire les appels API
5. **Testabilité**: Facilite l'écriture de tests unitaires
