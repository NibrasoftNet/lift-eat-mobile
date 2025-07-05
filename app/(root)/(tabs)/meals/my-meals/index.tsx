import MealsScreen from '@/components-new/screens/meals/MealsScreen';
export default MealsScreen;

// --- Legacy implementation (kept for reference) ---
/**
 * Écran des Repas (MealsNew) - Version améliorée
 * Conforme au design Figma de l'écran Meals
 * Architecture MCP: Couche Presenter
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Text } from '@/components-new/ui/atoms/base';
import SearchBarWithScanner from '@/components-new/ui/molecules/search/SearchBarWithScanner';
import FilterButton from '@/components-new/ui/molecules/interaction/FilterButton';
import CreateMealButton from '@/components-new/ui/molecules/interaction/CreateMealButton';
import MealListItem from '@/components-new/ui/molecules/tracking/MealListItem';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import SegmentedTabButtons from '@/components-new/ui/molecules/navigation/SegmentedTabButtons';
import { FilterPanel } from '@/components-new/ui/molecules/filtering';
import { ThemeInterface } from '@/themeNew';

// Image de repas par défaut
const DEFAULT_MEAL_IMAGE = require('@/assets/images/logo_no_bg.png');

// Services et API
import { useQuery } from '@tanstack/react-query';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { MealListFilter } from '@/utils/mcp/interfaces/meal-interfaces';
import { MealOrmProps } from '@/db/schema';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useTranslation } from 'react-i18next';


// Types pour les données de repas
type MealDisplay = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageBase64?: string; // Format base64 pour afficher l'image
  type: MealTypeEnum;
  cuisine: CuisineTypeEnum;
  date?: Date;
};

// Interface pour les options de filtre
interface FilterOption {
  id: string;
  label: string;
  value: string;
  isSelected: boolean;
}




/**
 * MealsScreen - Écran principal pour afficher et gérer les repas
 * Version améliorée conforme au design Figma
 */
 function MealsScreenLegacy() {
  // Utiliser le thème de l'application pour les styles
  const theme = useAppTheme();
  const { t } = useTranslation();

  // Traductions pour les alertes
  const deleteConfirmTitle = t('meal.delete.confirm');
  const deleteConfirmMessage = t('meal.delete.message');
  const deleteConfirmCancel = t('meal.delete.cancel');
  const deleteConfirmDelete = t('meal.delete.delete');

  // Tabs pour la catégorisation des repas (dépendent de la langue)
  const mealTabs = useMemo(() => [
    { id: 'recent', label: t('meal.tabs.recent') },
    { id: 'favorites', label: t('meal.tabs.favorites') },
    { id: 'personal', label: t('meal.tabs.personal') },
  ], [t]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recent');
  
  // États pour les filtres
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealTypeEnum[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineTypeEnum[]>([]);
  const filterPanelHeight = new Animated.Value(0);

  // Fonction pour convertir les images binaires en base64
  const convertBufferToBase64 = (buffer: Buffer | null) => {
    if (!buffer) return undefined;
    
    try {
      // Vérifier si le buffer est déjà une chaîne complète avec un préfixe
      const bufferString = buffer.toString();
      if (bufferString.startsWith('data:image')) {
        return bufferString; // Retourner directement la chaîne si déjà formatée
      }
      
      // Sinon, conversion normale du buffer en base64
      const base64String = buffer.toString('base64');
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error('Erreur lors de la conversion de l\'image:', error);
      return undefined;
    }
  };
  
  // Fonction pour convertir MealOrmProps en MealDisplay
  const convertToMealDisplay = (mealData: MealOrmProps): MealDisplay => {
    // Tenter de convertir l'image binaire en base64
    let imageBase64;
    try {
      if (mealData.image) {
        imageBase64 = convertBufferToBase64(mealData.image);
      }
    } catch (error) {
      console.error('Erreur lors de la conversion de l\'image:', error);
      // En cas d'erreur, l'image par défaut sera utilisée
    }
    
    return {
      id: mealData.id,
      name: mealData.name,
      calories: mealData.calories || 0,
      protein: mealData.protein || 0,
      carbs: mealData.carbs || 0,
      fat: mealData.fat || 0,
      imageBase64: imageBase64, // Peut être undefined si la conversion échoue
      type: mealData.type || MealTypeEnum.BREAKFAST,
      cuisine: mealData.cuisine || CuisineTypeEnum.GENERAL,
      date: mealData.createdAt ? new Date(mealData.createdAt) : undefined
    };
  };
  
  // Fonction pour récupérer les repas avec filtrage
  const fetchMeals = useCallback(async () => {
    logger.info(LogCategory.DATABASE, `Getting meals list via meal pages service`, {
      cuisine: selectedCuisines,
      mealType: selectedMealTypes,
      search: searchQuery
    });
    
    try {
      // Utiliser le service de pages pour récupérer les repas avec filtrage
      const filters = {
        search: searchQuery,
        mealType: selectedMealTypes.length > 0 ? selectedMealTypes[0] : undefined,
        cuisine: selectedCuisines.length > 0 ? selectedCuisines[0] : undefined,
        filter: activeTab as MealListFilter,
      };
      const result = await mealPagesService.getMealsList(filters);
      
      if (!result.success || !result.data?.meals) {
        logger.error(LogCategory.DATABASE, `Failed to get meals list: ${result.error || 'Unknown error'}`);
        return [];
      }
      
      // Convertir chaque repas au format d'affichage
      return result.data.meals.map(convertToMealDisplay);
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error fetching meals list: ${error}`);
      return [];
    }
  }, [searchQuery, selectedMealTypes, selectedCuisines, activeTab]);
  

  
  // Gestionnaire pour la navigation vers la page de détails d'un repas
  const handleMealPress = (mealId: string) => {
    logger.info(LogCategory.USER, `Navigation vers les détails du repas: ${mealId}`);
    // Navigation vers la page de détails du repas
    router.push(`/meals/my-meals/details/${mealId}`);
  };

  // Requête pour récupérer les données
  const {
    data: meals = [],
    isLoading,
    isFetching,
    refetch
  } = useQuery<MealDisplay[]>({
    queryKey: ['meals', activeTab, searchQuery, selectedMealTypes, selectedCuisines],
    queryFn: fetchMeals,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });

  // Gestion des changements d'onglets
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Gestion du scanner OpenFoodFacts
  const handleScanPress = () => {
    // Navigation vers l'écran de scanner
    router.push('/(root)/(tabs)/meals/scanner');
  };

  // Gestion de la création d'un nouveau repas
  const handleCreateMeal = () => {
    logger.info(LogCategory.USER, 'handleCreateMeal invoked - navigating to create meal screen');
    // Navigation vers le nouvel écran de création de repas V2 (refactoré)
    router.push('/(root)/(tabs)/meals/my-meals/create-v2');
  };

  // Gestion de la suppression d'un repas
  const queryClient = useQueryClient();
  const handleDeleteMeal = async (id: number) => {
    // Demander confirmation avant de supprimer
    Alert.alert(
      deleteConfirmTitle,
      deleteConfirmMessage,
      [
        {
          text: deleteConfirmCancel,
          style: 'cancel',
        },
        {
          text: deleteConfirmDelete,
          style: 'destructive',
          onPress: async () => {
            try {
              await mealPagesService.deleteMeal(id);
              // Invalider le cache pour mettre à jour la liste
              queryClient.invalidateQueries({ queryKey: [DataType.MEAL] });
              // Actualiser la liste des repas
              refetch();
              // Journaliser le succès
              logger.info(LogCategory.USER, `Repas supprimé avec succès: ${id}`);
            } catch (error) {
              logger.error(LogCategory.DATABASE, `Error deleting meal: ${error}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Fonction pour gérer l'ouverture/fermeture du panneau de filtres
  const handleFilterPress = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    
    // Animation pour ouvrir/fermer le panneau
    Animated.timing(filterPanelHeight, {
      toValue: isFilterPanelOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Fonction pour sélectionner/désélectionner un type de repas
  const toggleMealType = (type: MealTypeEnum) => {
    setSelectedMealTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Fonction pour sélectionner/désélectionner un type de cuisine
  const toggleCuisine = (cuisine: CuisineTypeEnum) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) {
        return prev.filter(c => c !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedMealTypes([]);
    setSelectedCuisines([]);
  };

  // Mise à jour des onglets pour refléter l'onglet actif
  const updatedTabs = mealTabs.map(tab => ({
    ...tab,
    isActive: tab.id === activeTab,
  }));

  return (
    <View style={styles.container}>
      {/* Titre de l'écran */}
      <Text style={styles.screenTitle}>{t('meal.title')}</Text>
      
      {/* Barre de recherche avec scanner */}
      <SearchBarWithScanner 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onScanPress={handleScanPress}
        placeholder={t('common.search')}
      />
      
      {/* Rangée de boutons */}
      <View style={styles.buttonRow}>
        <FilterButton onPress={handleFilterPress} />
        <View style={styles.buttonSpacer} />
        <CreateMealButton onPress={handleCreateMeal} />
      </View>
      
      {/* Panneau de filtres */}
      <FilterPanel 
        isOpen={isFilterPanelOpen}
        selectedMealTypes={selectedMealTypes}
        selectedCuisines={selectedCuisines}
        onMealTypeToggle={toggleMealType}
        onCuisineToggle={toggleCuisine}
        onResetFilters={resetFilters}
      />
      
      {/* Onglets segmentés */}
      <View style={styles.tabContainer}>
        <SegmentedTabButtons
          tabs={mealTabs}
          activeTabId={activeTab}
          onTabPress={handleTabChange}
        />
      </View>
      
      {/* État de chargement des repas */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.successLighter} />
          <Text variant="body" style={{marginTop: 16}}>
            {t('meal.loadingMeals')}
          </Text>
        </View>
      )}
      
      {/* Liste des repas avec scrolling et fonctionalité de suppression */}
      <FlashList
        data={meals}
        renderItem={({ item }: { item: MealDisplay }) => (
          <MealListItem
            id={item.id.toString()}
            name={item.name}
            calories={item.calories}
            // Utiliser le poids pour afficher des informations nutritionnelles
            weight={100} // Poids standard
            // Passer directement la base64 à MealListItem qui sait maintenant gérer les images
            imageUrl={item.imageBase64}
            // Navigation vers la page de détails du repas
            onPress={() => {
              // Utiliser router.navigate pour éviter les problèmes de typage
              // La structure du chemin est encapsulée dans un objet pour éviter les problèmes de typage
              try {
                router.navigate({
                  pathname: '/(root)/(tabs)/meals/my-meals/details/[id]',
                  params: { id: item.id.toString() }
                });
              } catch (error) {
                console.error('Navigation error:', error);
                Alert.alert('Erreur', 'Impossible d\'accéder aux détails de ce repas.');
              }
            }}
            onDelete={() => handleDeleteMeal(item.id)}
            showDeleteButton={true}
            showRightArrow={true}
          />
        )}
        keyExtractor={(item: MealDisplay) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={100}
        refreshControl={
          <RefreshControl 
            refreshing={isFetching} 
            onRefresh={refetch}
            colors={[theme.colors.successLighter]}
            tintColor={theme.colors.successLighter}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="body" style={{textAlign: 'center', marginBottom: 8}}>
              {isLoading ? t('meal.loadingMeals') : t('meal.noMeals')}
            </Text>
            {!isLoading && (
              <Text variant="caption" style={{textAlign: 'center'}}>
                {t('meal.emptyHint')}
              </Text>
            )}
          </View>
        }
        scrollEnabled={true} // Activer explicitement le scrolling
      />
      
      {/* Espace en bas pour le menu centralisé dans le layout */}
      <View style={styles.menuContainer} />
    </View>
  );
}

const createStyles = (theme: ThemeInterface) => {
  const isDark = theme.isDark;
  const textColor = isDark ? '#FFFFFF' : '#212121';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
      paddingTop: 40,
    },
    screenTitle: {
      fontSize: 24,
      fontFamily: 'Urbanist-Bold',
      color: textColor,
      marginBottom: 16,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    buttonSpacer: {
      width: 16,
    },
    tabContainer: {
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 100,
      flexGrow: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
      paddingHorizontal: 24,
    },
    menuContainer: {
      paddingVertical: 25,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#35383F' : '#F5F5F5',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
};
