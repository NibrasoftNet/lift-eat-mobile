import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VStack } from '../ui/vstack';
import NavbarUser from '../navbars/NavbarUser';
import { Calendar, DateData } from 'react-native-calendars';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { UserOrmPros, DailyProgressOrmProps } from '@/db/schema';
import useSessionStore from '@/utils/store/sessionStore';
import { HStack } from '../ui/hstack';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { Center } from '../ui/center';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { getCurrentPlan } from '@/utils/services/plan.service';
import { getDailyProgressByDate, getMealProgressByDate } from '@/utils/services/progress.service';
import useProgressStore, { MealWithProgress, MealsByType } from '@/utils/store/progressStore';
import { View, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import MealsClickSelection from '../progress/MealsClickSelection';

const ProgressCalendarTab = () => {
  const drizzleDb = useDrizzleDb();
  const { user } = useSessionStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  // États locaux des stores Zustand
  const { 
    selectedDate, setSelectedDate, 
    dailyProgress, setDailyProgress,
    mealsWithProgress, setMealsWithProgress,
    getAvailableMeals, getConsumedMeals,
    isLoading: storeLoading, setIsLoading, 
    error, setError
  } = useProgressStore();

  // Requête pour récupérer l'utilisateur actuel
  const {
    data: actualUser,
    isPending: isUserPending,
    isFetching: isUserFetching,
    isLoading: isUserLoading,
    isRefetching: isUserRefetching,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const userResult = await drizzleDb.query.users.findFirst();
      return userResult ?? null;
    },
  });

  // Requête pour récupérer le plan courant
  const {
    data: currentPlan,
    isPending: isPlanPending,
    isLoading: isPlanLoading,
    error: planError,
  } = useQuery({
    queryKey: ['currentPlan', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        const result = await getCurrentPlan(drizzleDb, user.id);
        return result || null; // Assurer que undefined devient null
      } catch (error) {
        console.error('Erreur lors de la récupération du plan courant:', error);
        return null; // Retourner null en cas d'erreur
      }
    },
    enabled: !!user?.id,
  });

  // Récupérer tous les jours avec progression pour le plan courant
  const {
    data: allProgressDays,
    isPending: isProgressPending,
    isLoading: isProgressLoading,
  } = useQuery({
    queryKey: ['progressDays', currentPlan?.id],
    queryFn: async () => {
      if (!currentPlan?.id || !user?.id) return [];
      
      // Vous devrez compléter cette fonction dans progress.service.ts
      // pour récupérer toutes les progressions associées au plan courant
      // Exemple de structure attendue:
      return await drizzleDb.query.dailyProgress.findMany({
        where: (fields, { eq, and }) => and(
          eq(fields.userId, user.id),
          eq(fields.planId, currentPlan.id)
        )
      });
    },
    enabled: !!currentPlan?.id && !!user?.id,
  });

  // Préparer les dates marquées pour le calendrier
  const markedDates: Record<string, any> = {};
  
  if (allProgressDays && allProgressDays.length > 0) {
    // Créer les marqueurs pour chaque date avec progression
    allProgressDays.forEach((progress: DailyProgressOrmProps) => {
      const isSelected = selectedDate === progress.date;
      
      // Déterminer la couleur directement basée sur le pourcentage
      let progressColor = '#F44336'; // Rouge par défaut
      if (progress.pourcentageCompletion >= 80) {
        progressColor = '#4CAF50'; // Vert si >= 80%
      } else if (progress.pourcentageCompletion >= 50) {
        progressColor = '#FFC107'; // Jaune si >= 50%
      }
      
      // Créer un marqueur de progression basé sur le pourcentage de complétion
      const progressDot = { 
        key: 'progress', 
        color: progressColor,
        selectedDotColor: '#FFFFFF'
      };
      
      markedDates[progress.date] = {
        dots: [progressDot],
        selected: isSelected,
        selectedColor: '#007AFF',
      };
    });
  }
  
  // Si une date est sélectionnée mais qu'elle n'a pas de progression, l'ajouter quand même comme sélectionnée
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#007AFF',
    };
  }

  // Gérer la sélection d'une date
  const handleDateSelection = async (day: DateData) => {
    try {
      if (!user?.id || !currentPlan) {
        setError('Aucun plan actif. Veuillez définir un plan comme courant.');
        return;
      }
      
      setIsLoading(true);
      setSelectedDate(day.dateString);
      
      // Récupérer la progression pour cette date
      const progressResult = await getMealProgressByDate(drizzleDb, user.id, day.dateString);
      
      setDailyProgress(progressResult.progress);
      setMealsWithProgress(progressResult.meals);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
      setIsLoading(false);
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => {
          return (
            <Box className="bg-red-600 px-4 py-3 rounded-sm mb-5">
              <Text className="text-white font-medium">
                Erreur: {error.message || 'Une erreur est survenue'}
              </Text>
            </Box>
          );
        }
      });
    }
  };

  // Afficher un message de chargement
  if (isUserLoading || isPlanLoading || isProgressLoading || storeLoading) {
    return (
      <Center className="flex-1">
        <Spinner className="size-large" />
        <Text className="mt-2">Chargement en cours...</Text>
      </Center>
    );
  }

  // Afficher un message si aucun plan n'est défini comme courant
  if (!currentPlan) {
    return (
      <VStack>
        <NavbarUser user={actualUser!} />
        <Center className="flex-1 p-4">
          <Text className="text-lg text-center mb-4">
            Aucun plan n'est défini comme courant.
          </Text>
          <Text className="text-center mb-4">
            Veuillez définir un plan comme courant dans l'onglet Plans pour suivre votre progression.
          </Text>
          <Button
            onPress={() => {
              // Naviguer vers l'onglet des plans
              // Cette partie dépend de votre système de navigation
            }}
            className="bg-primary-500"
          >
            <Text className="text-white">Voir mes plans</Text>
          </Button>
        </Center>
      </VStack>
    );
  }

  // Format d'affichage de la date sélectionnée
  const formattedSelectedDate = selectedDate 
    ? new Date(selectedDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  // Préparer les données pour l'affichage des repas
  const availableMeals: MealsByType = getAvailableMeals();
  const consumedMeals: MealsByType = getConsumedMeals();

  return (
    <QueryStateHandler<UserOrmPros>
      data={actualUser}
      isLoading={isUserLoading}
      isFetching={isUserFetching}
      isPending={isUserPending}
      isRefetching={isUserRefetching}
    >
      <ScrollView className="flex-1 bg-white">
        <VStack className="h-full">
          <NavbarUser user={actualUser!} />
          <Box className="px-4 py-2">
            <Text className="text-xl font-bold mb-2">
              Suivi de votre plan: {currentPlan?.name || ''}
            </Text>
            <Text className="text-sm text-gray-600 mb-4">
              Sélectionnez une date pour voir et gérer vos repas
            </Text>
          </Box>

          <Calendar
            markingType={'multi-dot'}
            markedDates={markedDates}
            onDayPress={handleDateSelection}
            theme={{
              todayTextColor: '#007AFF',
              arrowColor: '#007AFF',
              dotColor: '#007AFF',
              selectedDayBackgroundColor: '#007AFF',
            }}
          />

          {selectedDate && (
            <Animated.View entering={FadeInRight.duration(300)}>
              <Box className="px-4 py-4 mt-2">
                <Text className="text-lg font-bold mb-2">
                  {formattedSelectedDate}
                </Text>
                
                {dailyProgress && (
                  <HStack space="md" className="mb-2">
                    <Box className="mr-2">
                      <Text className="text-sm text-gray-600">
                        Progression: {dailyProgress.pourcentageCompletion.toFixed(0)}%
                      </Text>
                    </Box>
                    <Box>
                      <Text className="text-sm text-gray-600">
                        Calories: {dailyProgress.calories.toFixed(0)}
                      </Text>
                    </Box>
                  </HStack>
                )}

                {error && (
                  <Box className="bg-red-100 p-3 rounded-sm mb-4">
                    <Text className="text-red-700">{error}</Text>
                  </Box>
                )}

                {mealsWithProgress.length === 0 ? (
                  <Text className="mt-2">Aucun repas programmé pour cette date.</Text>
                ) : (
                  <Box className="mt-3" style={{ minHeight: 300 }}>
                    <Text className="text-blue-800 mb-2">Nombre de repas trouvés: {mealsWithProgress.length}</Text>
                    <MealsClickSelection 
                      selectedDate={selectedDate}
                      dailyProgress={dailyProgress!}
                      mealsWithProgress={mealsWithProgress}
                      onMealStatusChange={() => {
                        // Rafraîchir les données de progression après un changement
                        if (user?.id) {
                          queryClient.invalidateQueries({ queryKey: ['progressDays', currentPlan?.id] });
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Animated.View>
          )}
        </VStack>
      </ScrollView>
    </QueryStateHandler>
  );
};

export default ProgressCalendarTab;
