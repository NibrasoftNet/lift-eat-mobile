import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../../../../../components-new/ui/atoms/base';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/themeNew';
import { getImageUrl } from '@/utils/getImageUrl';

// Services MCP
import { mealPagesService } from '../../../../../../utils/services/pages/meal-pages.service';

// Composants
import MealDetailHeader from '../../../../../../components-new/ui/organisms/meal/MealDetailHeader';
import CircularNutritionProgress from '../../../../../../components-new/ui/molecules/tracking/CircularNutritionProgress';
import GeneralInfoSection from '../../../../../../components-new/ui/molecules/info/GeneralInfoSection';
import IngredientsList from '../../../../../../components-new/ui/organisms/meal/IngredientsList';
import InstructionsSection from '../../../../../../components-new/ui/molecules/meal/InstructionsSection';
import { IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';

/**
 * MealDetailsScreen
 * Écran de détail d'un repas
 * Respecte l'architecture MCP et utilise nos nouveaux composants UI
 */
const MealDetailsScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Récupération de l'ID du repas depuis les paramètres d'URL
  const { id } = useLocalSearchParams();
  const mealId = Array.isArray(id) ? id[0] : id;

  // État pour le mode sombre
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean | undefined>(undefined);

  // Requête pour charger les détails du repas
  const {
    data: mealData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['meal', mealId],
    queryFn: () => mealPagesService.getMealDetails(Number(mealId)),
  });

  // Extraction des données du repas depuis le résultat de l'API
  const meal = mealData?.data?.meal;

  // Synchroniser l'état local favori avec les données récupérées
  React.useEffect(() => {
    if (meal?.isFavorite !== undefined && meal?.isFavorite !== null) {
      setIsFavorite(meal.isFavorite);
    }
  }, [meal?.isFavorite]);
  const ingredients = mealData?.data?.ingredients || [];

  // Refetch meal data when screen regains focus (e.g., after editing)
  useFocusEffect(
    React.useCallback(() => {
      if (mealId) {
        console.log('[MealDetails] Screen focused – refetching meal details');
        refetch();
      }
    }, [mealId, refetch]),
  );

  // Mutation pour mettre à jour le favori
  const toggleFavoriteMutation = useMutation({
    mutationFn: (newStatus: boolean) =>
      mealPagesService.toggleMealFavorite(Number(mealId), newStatus),
    onSuccess: () => {
      // Invalider la requête des détails pour récupérer la valeur mise à jour
      queryClient.invalidateQueries({ queryKey: ['meal', mealId] });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du favori:', error);
      // Revert UI
      setIsFavorite((prev) => (prev === undefined ? prev : !prev));
    },
  });

  // Mutation pour supprimer un repas
  const { mutate: deleteMeal } = useMutation({
    mutationFn: () => mealPagesService.deleteMeal(Number(mealId)),
    onSuccess: (data) => {
      if (data?.data?.meal) {
        setIsFavorite(data.data.meal.isFavorite);
      }
      // Invalider le cache pour mettre à jour la liste des repas
      queryClient.invalidateQueries({ queryKey: ['meals-list'] });
      // Retour à l'écran précédent
      router.back();
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert(t('meal.error.title'), t('meal.error.delete'));
    },
  });

  // Gestionnaire pour la suppression du repas
  const handleDeleteMeal = () => {
    Alert.alert(t('meal.delete.title'), t('meal.delete.confirm'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        onPress: () => deleteMeal(),
        style: 'destructive',
      },
    ]);
  };

  // Gestionnaire pour la navigation vers l'édition du repas
  // Gestionnaire de bascule favori
  const handleToggleFavorite = () => {
    console.log('[Favorite] Toggle requested. Current isFavorite:', isFavorite);
    const newStatus = !isFavorite; // If undefined, treats as true
    console.log('[Favorite] New status to send:', newStatus);

    toggleFavoriteMutation.mutate(newStatus, {
      onSuccess: (data) => {
        console.log('[Favorite] Mutation success. Response:', data);
      },
      onError: (error) => {
        console.log('[Favorite] Mutation error (override):', error);
      },
    });
    setIsFavorite(newStatus);
  };

  const handleEditMeal = () => {
    router.push(`/(root)/(tabs)/meals/my-meals/edit/${mealId}`);
  };

  /*
   * Legacy inline getImageUrl block – replaced by shared util
   * Keeping commented for reference, will be removed later
   *
    if (!image) {
      return 'https://via.placeholder.com/400x250?text=No+Image';
    }

    try {
      // Si c'est déjà une chaîne au format data URI
      if (typeof image === 'string') {
        if (image.startsWith('data:')) {
          return image;
        }
        // Si c'est une chaîne base64 sans le préfixe data URI
        return `data:image/jpeg;base64,${image}`;
      }

      // Si c'est un Buffer
      if (image.toString) {
        return `data:image/jpeg;base64,${image.toString('base64')}`;
      }

      console.log("Format d'image non pris en charge:", typeof image);
      return 'https://via.placeholder.com/400x250?text=Format+Error';
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
      return 'https://via.placeholder.com/400x250?text=Error';
    }
  };

*/
  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Affichage en cas d'erreur
  if (error || !meal) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {t('meal.error.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: '#FFFFFF' }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {/* En-tête avec image et titre */}
      <MealDetailHeader
        mealId={mealId}
        title={meal?.name ? meal.name : t('meal.details.noName')}
        imageUrl={getImageUrl(meal?.image) ?? ''}
        calories={meal?.calories || 0}
        isFavorite={!!isFavorite}
        favoriteLoading={toggleFavoriteMutation.isPending}
        onToggleFavorite={handleToggleFavorite}
        onEdit={handleEditMeal}
        onDelete={handleDeleteMeal}
      />

      {/* Informations nutritionnelles */}
      {meal && (
        <CircularNutritionProgress
          calories={meal.calories || 0}
          carbs={meal.carbs || 0}
          protein={meal.protein || 0}
          fat={meal.fat || 0}
          showDetails={true}
          size={110}
        />
      )}

      {/* Type de repas et cuisine */}
      <GeneralInfoSection
        mealType={meal?.type || t('common.notSpecified')}
        cuisineType={meal?.cuisine || t('common.notSpecified')}
        isDarkMode={isDarkMode}
      />

      {/* Liste des ingrédients */}
      <IngredientsList
        ingredients={ingredients.map((ing: any, index: number) => {
          const imageUrl = ing.ingredient?.image
            ? getImageUrl(ing.ingredient.image)
            : undefined;
          const unit = ing.ingredient?.unit || 'g';
          return {
            ...ing.ingredient,
            uniqueId: `${ing.id}-${index}`,
            id: ing.id?.toString() || '',
            name: ing.ingredient?.name ?? t('common.ingredient'),
            displayName: (ing.ingredient?.name ??
              t('common.ingredient')) as string,
            quantity: ing.quantity || 0,
            unit,
            displayUnit: unit as string,
            imageUrl,
            hasImage: !!imageUrl,
          } as IngredientWithUniqueId;
        })}
        showDeleteButtons={false}
        isDarkMode={isDarkMode}
      />

      {/* Instructions */}
      <InstructionsSection
        instructions={(meal as any)?.instructions || ''}
        isDarkMode={isDarkMode}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MealDetailsScreen;
