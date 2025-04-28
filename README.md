# Lift-Eat-Mobile 🍽️🍕💪

Application mobile de gestion nutritionnelle et planification de repas développée avec Expo et React Native.

## Démarrage rapide

1. Installer les dépendances

   ```bash
   npm install
   ```

2. Lancer l'application

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Architecture

Lift-Eat-Mobile suit une architecture modulaire avec séparation des responsabilités :

- **/app** : Routes et écrans (auth, tabs, user)
- **/components** : Composants réutilisables
- **/utils** : Services, providers et utilitaires
- **/db** : Schéma et configuration de la base de données

## Services disponibles

### Scanner Service

Service centralisant les interactions avec l'API OpenFoodFacts pour scanner des codes-barres et rechercher des produits alimentaires.

```typescript
import scannerService from '@/utils/services/scanner.service';

// Scan d'un code-barres
const result = await scannerService.scanBarcode(barcodeData);

// Recherche de produits
const products = await scannerService.searchProducts(searchTerms, cuisineType);
```

Pour une documentation détaillée sur ce service, voir [scanner-service.md](docs/scanner-service.md).

## Technologies utilisées

- **Frontend** : React Native, Expo, GlueStack UI, NativeWind
- **Gestion d'état** : Zustand, React Query
- **Base de données** : SQLite avec Drizzle ORM
- **Validation** : Zod, React Hook Form

## Fonctionnalités principales

- Calcul des besoins caloriques personnalisés
- Gestion des repas et ingrédients
- Plans nutritionnels personnalisés
- Scanner de codes-barres pour identification des produits
- Recherche dans la base OpenFoodFacts
- Suivi des progrès
- Analyse nutritionnelle assistante par IA
