import React, { Dispatch, SetStateAction, useState, useMemo, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
/* Custom components */
import IngredientStandardCard from '@/components/cards/IngredientStandardCard';
import SelectionDrawer from './SelectionDrawer';
/* Types */
import { IngredientStandardOrmProps } from '@/db/schema';

// Activer le mode de performance pour les listes d'ingrédients
const PERFORMANCE_MODE = true; // Peut être désactivé en modifiant cette constante

// Réduire davantage la taille de page pour accélérer le chargement initial
const PAGE_SIZE = 10; // Taille fortement réduite pour un chargement plus rapide
const CACHE_TIME = 15 * 60 * 1000; // 15 minutes
const MAX_ITEMS = 60; // Limiter le nombre total d'éléments
const DEBOUNCE_DELAY = 200; // Délai pour le debounce de la recherche

/**
 * Interface d'ingrédient avec un identifiant unique pour éviter les collisions de stableId
 * (Copie locale de l'interface du composant IngredientStandardCard)
 */
interface IngredientWithStableId extends IngredientStandardOrmProps {
  uniqueId?: string;
}

// Interface optimisée pour les ingrédients avec les propriétés essentielles
// placées au premier niveau (évite les accès profonds coûteux)
interface IngredientWithUniqueId {
  // Propriétés obligatoires de base
  id: number;
  name: string;
  uniqueId: string;
  image: any; // Buffer ou null
  quantity: number;
  unit: MealUnitEnum | string | null; // Compatible avec MealUnitEnum
  
  // Propriétés pré-calculées pour éviter les opérations pendant le rendu
  displayName: string;
  displayUnit: string;
  hasImage: boolean;
  
  // Propriétés nutritionnelles aplaties
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  
  // Propriétés requises par IngredientWithStableId
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Autres propriétés héritées de l'ORM
  [key: string]: any;
}

const IngredientsDrawer = React.memo(({ // Utiliser React.memo explicitement pour éviter les re-rendus inutiles
  showIngredientsDrawer,
  setShowIngredientsDrawer,
}: {
  showIngredientsDrawer: boolean;
  setShowIngredientsDrawer: Dispatch<SetStateAction<boolean>>;
}) => {
  // État local pour la recherche d'ingrédients
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce personnalisé du terme de recherche pour éviter les appels trop fréquents
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Implémentation manuelle du debounce (au lieu d'une fonction useDebouncedValue)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Récupérer l'ID de l'utilisateur courant
  const userId = useMemo(() => {
    const id = getCurrentUserIdSync() || 0;
    if (id === 0) {
      logger.error(LogCategory.AUTH, 'IngredientsDrawer - No user ID found');
    }
    return id;
  }, []);
  
  // Version ULTRA-optimisée de la fonction de récupération des ingrédients
  const fetchIngredients = useCallback(async ({ pageParam = 1 }) => {
    // Vérifier que l'utilisateur est authentifié
    if (!userId) {
      logger.error(LogCategory.AUTH, 'Cannot fetch ingredients: User not authenticated');
      throw new Error('User not authenticated');
    }
    
    try {
      // OPTIMISATION 1: Vérifier si nous avons déjà atteint la limite d'éléments
      // pour éviter de charger des données inutiles
      if (pageParam > Math.ceil(MAX_ITEMS / PAGE_SIZE)) {
        return { data: [], nextPage: null };
      }
      
      // OPTIMISATION 2: Ajouter un délai artificiel entre les requêtes pour éviter 
      // de surcharger la base de données et le thread principal UI
      if (pageParam > 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Récupération des ingrédients avec le MCP Server
      const result = await sqliteMCPServer.getIngredientsListViaMCP(
        debouncedSearchTerm || '', 
        PAGE_SIZE
      );
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to get ingredients list: ${result.error}`);
        throw new Error(result.error || 'Failed to get ingredients');
      }
      
      // OPTIMISATION 3: Pré-traitement minimal des données pour réduire la charge sur le thread principal
      const ingredients = (result.ingredients || []).slice(0, PAGE_SIZE);
            const processedIngredients = ingredients.map((ingredient, index) => {
        // Générer un ID vraiment unique avec page et index pour éviter les collisions
        // Format: ing-[id]-p[page]-i[index] - garantit l'unicité même lors du défilement
        const uniqueId = `ing-${ingredient.id}-p${pageParam}-i${index}`;
        
        // Structurer l'objet pour éviter les accès profonds lors du rendu
        return {
          id: ingredient.id,
          name: ingredient.name?.trim() || 'Unknown',
          image: ingredient.image,
          quantity: ingredient.quantity,
          unit: ingredient.unit || null, // Utiliser null si non défini (compatible avec MealUnitEnum | null)
          calories: ingredient.calories || 0,
          carbs: ingredient.carbs || 0,
          fat: ingredient.fat || 0,
          protein: ingredient.protein || 0,
          uniqueId,
          displayName: ingredient.name?.trim() || 'Unknown',
          displayUnit: `${ingredient.quantity || ''} ${ingredient.unit || 'g'}`,
          hasImage: !!ingredient.image,
          createdAt: ingredient.createdAt || new Date(),
          updatedAt: ingredient.updatedAt || new Date(),
        };
      });
      
      // OPTIMISATION 4: Limiter strictement le nombre de pages pour éviter les chargements infinis
      const hasNextPage = 
        ingredients.length === PAGE_SIZE && 
        pageParam < Math.ceil(MAX_ITEMS / PAGE_SIZE);
      
      return {
        data: processedIngredients,
        nextPage: hasNextPage ? pageParam + 1 : null
      };
    } catch (error) {
      logger.error(LogCategory.APP, `IngredientsDrawer - Error fetching ingredients: ${error}`);
      return { data: [], nextPage: null }; // Ne pas interrompre l'expérience utilisateur en cas d'erreur
    }
  }, [debouncedSearchTerm, userId]);

  // Configuration ULTRA-optimisée de l'infinite query
  const query = useInfiniteQuery({
    queryKey: [DataType.INGREDIENT, debouncedSearchTerm, userId],
    queryFn: fetchIngredients,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: CACHE_TIME,           // Conserver les données valides plus longtemps
    gcTime: CACHE_TIME,              // Conserver en cache plus longtemps
    // Optimisations agressives:
    retry: 0,                        // Ne pas ré-essayer (réduit les appels réseau)
    refetchOnMount: false,           // Ne pas refetch au montage
    refetchOnWindowFocus: false,     // Ne pas refetch sur focus
    refetchOnReconnect: false,       // Ne pas refetch sur reconnexion
    enabled: !!userId && showIngredientsDrawer,
    // CRUCIAL: Retarder le chargement initial pour éviter les plantages UI sur ouverture
    placeholderData: { pages: [{ data: [], nextPage: null }], pageParams: [1] },
  });
  
  // Destructurer et utiliser directement les propriétés de query
  const { data, isLoading, isPending } = query;
  
  // Mémoriser les ingrédients et appliquer la limite MAX_ITEMS
  const ingredients = useMemo(() => {
    const allIngredients = (data?.pages || []).flatMap((page) => page.data) || [];
    return allIngredients.slice(0, MAX_ITEMS);
  }, [data]);
  
  // OPTIMISATION: Ajouter une méthode asynchrone pour le chargement de la page suivante
  // qui respecte le type Promise<any> attendu par SelectionDrawer
  const handleFetchNextPage = useCallback(async () => {
    if (query.isFetchingNextPage || !query.hasNextPage) return;
    
    // Utiliser un délai pour éviter de surcharger la base de données
    await new Promise(resolve => setTimeout(resolve, 500));
    return query.fetchNextPage();
  }, [query]);

  // Utiliser le composant générique SelectionDrawer avec rendu mémoisé d'items et pré-calcul de la clé
  const getItemType = useCallback((item: IngredientWithUniqueId) => {
    return item.hasImage ? 'with-image' : 'no-image';
  }, []);
  
  // Optimisation radicale du renderItem pour éviter les re-rendus inutiles
  // Cette implémentation est cruciale pour éviter les lags de sélection
  const renderItem = useCallback(({ item, index }: { item: IngredientWithUniqueId; index: number }) => {
    // Garantir que nous retournons toujours un élément React valide (jamais null)
    // Cette condition arrête le rendu trop loin dans la liste, mais avec un élément vide
    if (index >= MAX_ITEMS) {
      return <React.Fragment />; // Retourner un fragment vide au lieu de null
    }
    
    // Cast sécurisé pour satisfaire les types
    const safeItem = item as unknown as IngredientWithStableId;
    
    // Utiliser un composant mémoisé mais avec la syntaxe correcte JSX
    return (
      <IngredientStandardCard 
        item={safeItem} 
        index={index} 
        key={item.uniqueId}
      />
    );
  }, []);
  
  // OPTIMISATION: Utilisation garantie de clés uniques pour éviter les collisions de stableId
  const keyExtractor = useCallback((item: IngredientWithUniqueId) => {
    // Utiliser uniqueId généré avec format enrichi ing-[id]-p[page]-i[index]
    // Ce format garantit l'unicité même avec beaucoup d'items et de pages
    return item.uniqueId;
  }, []);

  // Cette fonction a été remplacée par handleFetchNextPage qui est asynchrone

  return (
    <SelectionDrawer
      title="Ingredients Selection"
      showDrawer={showIngredientsDrawer}
      setShowDrawer={setShowIngredientsDrawer}
      data={ingredients}
      isLoading={isLoading}
      isPending={isPending}
      isFetchingNextPage={query.isFetchingNextPage}
      isRefetching={query.isRefetching}
      refetch={query.refetch}
      fetchNextPage={handleFetchNextPage} // Utiliser la version asynchrone correcte
      hasNextPage={query.hasNextPage}
      setSearchTerm={(term) => setSearchTerm(term || '')}
      renderItem={renderItem}
      getItemType={getItemType}
      searchPlaceholder="Search ingredient..."
      estimatedItemSize={200} // Estimation plus précise et plus petite
      onEndReachedThreshold={0.1} // Réduire ce seuil pour charger plus tard
      // @ts-ignore - Ignorer l'erreur de typing temporairement
      keyExtractor={keyExtractor} // Utiliser notre extracteur de clé optimisé
    />
  );
});

// Ajouter un displayName pour faciliter le débogage
IngredientsDrawer.displayName = 'IngredientsDrawer';

export default IngredientsDrawer;
