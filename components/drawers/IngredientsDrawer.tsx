import React, { Dispatch, SetStateAction, useState, useMemo, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
/* Custom components */
import IngredientStandardCard from '@/components/cards/IngredientStandardCard';
import SelectionDrawer from './SelectionDrawer';
/* Types */
import { IngredientStandardOrmProps } from '@/db/schema';
import { ingredientDrawerUIService } from '@/utils/services/ui/ingredient-drawer-ui.service';
import { GetIngredientsParams, IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';

// Constantes de pagination et performance importées du service
const DEBOUNCE_DELAY = 300; // Délai pour le debounce de la recherche

/**
 * Interface locale pour les ingrédients avec ID stable
 * (Restera dans le composant par compatibilité - l'interface principale est dans drawer.interface.ts)
 */
interface IngredientWithStableId extends IngredientStandardOrmProps {
  uniqueId?: string;
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
  
  // Utiliser le service pour le debounce du terme de recherche
  useEffect(() => {
    // On crée une fonction de rappel pour mettre à jour le terme debouncé
    const updateDebouncedTerm = (term: string) => {
      setDebouncedSearchTerm(term);
    };
    
    // Appeler le service pour débouncer le terme de recherche
    ingredientDrawerUIService.debounceSearchTerm(searchTerm, updateDebouncedTerm, DEBOUNCE_DELAY);
  }, [searchTerm]);
  
  // Récupérer l'ID de l'utilisateur courant
  const userId = useMemo(() => {
    const id = getCurrentUserIdSync() || 0;
    if (id === 0) {
      logger.error(LogCategory.AUTH, 'IngredientsDrawer - No user ID found');
    }
    return id;
  }, []);
  
  // Utilisation du service pour récupérer les ingrédients
  const fetchIngredients = useCallback(async ({ pageParam = 1 }) => {
    try {
      // Préparer les paramètres pour la récupération des ingrédients
      const params: GetIngredientsParams = {
        userId,
        searchTerm: debouncedSearchTerm,
        pageParam,
        pageSize: 10, // Nous utilisons une taille de page fixe définie par le service
        maxItems: 60  // Limite maximum d'éléments à charger
      };
      
      // Utiliser le service pour récupérer les ingrédients
      const result = await ingredientDrawerUIService.fetchIngredients(params);
      
      // Retourner les données au format attendu par useInfiniteQuery
      return {
        data: result.data,
        nextPage: result.nextPage
      };
    } catch (error) {
      logger.error(LogCategory.APP, `IngredientsDrawer - Error fetching ingredients: ${error}`);
      return { data: [], nextPage: null }; // Gestion gracieuse des erreurs
    }
  }, [debouncedSearchTerm, userId]);

  // Configuration ULTRA-optimisée de l'infinite query
  const query = useInfiniteQuery({
    queryKey: [DataType.INGREDIENT, debouncedSearchTerm, userId],
    queryFn: fetchIngredients,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 15 * 60 * 1000,           // Conserver les données valides plus longtemps
    gcTime: 15 * 60 * 1000,              // Conserver en cache plus longtemps
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
    return allIngredients.slice(0, 60);
  }, [data]);
  
  // Méthode pour charger la page suivante, adaptative et asynchrone
  const handleFetchNextPage = useCallback(async () => {
    if (query.isFetchingNextPage || !query.hasNextPage) return;
    
    // Utiliser un délai pour éviter de surcharger la base de données
    await new Promise(resolve => setTimeout(resolve, 500));
    return query.fetchNextPage();
  }, [query]);

  // Renderisation optimisée des éléments, utilisant le type du service
  const renderItem = useCallback(({ item, index }: { item: IngredientWithUniqueId; index: number }) => {
    // Cast sécurisé pour satisfaire les types du composant de carte d'ingrédient
    const safeItem = item as unknown as IngredientWithStableId;
    
    // Rendre le composant de carte d'ingrédient avec la clé unique du service
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

  // Utiliser la fonction getItemType du service pour déterminer le type d'élément
  const getItemType = useCallback((item: IngredientWithUniqueId) => {
    return ingredientDrawerUIService.getItemType(item);
  }, []);

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
