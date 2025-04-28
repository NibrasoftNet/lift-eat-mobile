import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VStack } from '../ui/vstack';
import NavbarUser from '../navbars/NavbarUser';
import { Calendar, DateData } from 'react-native-calendars';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { UserOrmPros, DailyProgressOrmProps, PlanOrmProps, MealOrmProps } from '@/db/schema';
import useSessionStore from '@/utils/store/sessionStore';
import { HStack } from '../ui/hstack';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { Center } from '../ui/center';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { getDailyProgressByDate, getDailyProgressByPlan } from '@/utils/services/progress.service';
import useProgressStore, { MealWithProgress, MealsByType } from '@/utils/store/progressStore';
import { View, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import MealsClickSelection from '../progress/MealsClickSelection';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { getCurrentUserId, getCurrentUserIdSync, hasUserInSession } from '@/utils/helpers/userContext';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';
import { DataType } from '@/utils/helpers/queryInvalidation';

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
    queryKey: [DataType.USER, 'me'],
    queryFn: async () => {
      // Enregistrer le début du processus de récupération utilisateur
      logger.info(LogCategory.DATABASE, "Fetching user data for progress calendar");
      
      try {
        // Utiliser notre fonction centralisée pour récupérer l'ID utilisateur
        const userId = await getCurrentUserId(true);
        
        if (userId) {
          logger.info(LogCategory.DATABASE, `Using user ID: ${userId}`);
          
          // Utiliser le MCP Server pour récupérer l'utilisateur
          const result = await sqliteMCPServer.getDefaultUserViaMCP(userId);
          
          if (result.success && result.user) {
            return result.user;
          } else {
            logger.warn(LogCategory.DATABASE, `Failed to get user with ID ${userId}, trying default user`);
          }
        }
        
        // Si pas d'utilisateur en session ou la récupération a échoué, récupérer l'utilisateur par défaut
        const defaultUserResult = await sqliteMCPServer.getDefaultUserViaMCP();
        
        if (!defaultUserResult.success || !defaultUserResult.user) {
          logger.error(LogCategory.DATABASE, "Failed to get default user");
          throw new Error("No user found");
        }
        
        const userResult = defaultUserResult.user;
        logger.info(LogCategory.DATABASE, `Loaded user from database: ${userResult?.id}`);
        
        // Si on trouve un utilisateur, mettre à jour la session
        if (userResult && !hasUserInSession()) {
          useSessionStore.setState({ user: { id: userResult.id, email: userResult.email } });
        }
        
        return userResult;
      } catch (error) {
        logger.error(LogCategory.DATABASE, `Error fetching user: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    },
    ...getCacheConfig(DataType.USER)
  });

  // Requête pour récupérer le plan courant
  const {
    data: currentPlan,
    isPending: isPlanPending,
    isLoading: isPlanLoading,
    error: planError,
  } = useQuery<PlanOrmProps | null>({
    queryKey: ['currentPlan', getCurrentUserIdSync()],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!userId) return null;
      
      try {
        logger.info(LogCategory.DATABASE, `Fetching current plan for user ${userId} via MCP`);
        
        const result = await sqliteMCPServer.getCurrentPlanViaMCP(userId);
        
        if (!result.success) {
          logger.error(LogCategory.DATABASE, `Failed to get current plan: ${result.error}`);
          return null;
        }
        
        // Assurez-vous que nous retournons toujours un PlanOrmProps ou null, jamais undefined
        return result.plan || null;
      } catch (error) {
        logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération du plan courant:', { error });
        return null; // Retourner null en cas d'erreur
      }
    },
    enabled: hasUserInSession(),
    ...getCacheConfig(DataType.PLAN)
  });

  // Récupérer tous les jours avec progression pour le plan courant
  const {
    data: progressDays,
    isLoading: isProgressLoading,
  } = useQuery<DailyProgressOrmProps[]>({    
    queryKey: ['progressDays', currentPlan?.id],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!currentPlan?.id || !userId) return [];
      
      // Utiliser la méthode MCP au lieu de l'accès direct à la base de données
      logger.info(LogCategory.DATABASE, 'Fetching progress days for current plan via MCP', {
        userId,
        planId: currentPlan.id
      });
      
      const result = await getDailyProgressByPlan(drizzleDb, userId, currentPlan.id);
      
      if (!result) {
        logger.warn(LogCategory.DATABASE, 'No progress days found for current plan', {
          userId,
          planId: currentPlan.id
        });
        return [];
      }
      
      return result;
    },
    enabled: !!currentPlan?.id && hasUserInSession(),
  });

  // Préparer les dates marquées pour le calendrier
  const markedDates: Record<string, any> = {};
  
  if (progressDays && progressDays.length > 0) {
    // Créer les marqueurs pour chaque date avec progression
    progressDays.forEach((progress) => {
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
  const handleDateSelect = async (day: any) => {
    try {
      // Utiliser notre fonction centralisée pour récupérer l'ID utilisateur
      const userId = await getCurrentUserId();
      if (!userId || !currentPlan) {
        setError('Aucun plan actif. Veuillez définir un plan comme courant.');
        return;
      }
      
      setSelectedDate(day.dateString);
      
      // Récupérer la progression pour cette date
      logger.info(LogCategory.DATABASE, 'Récupération de la progression des repas via MCP Server', {
        userId: userId,
        date: day.dateString
      });
      
      const result = await sqliteMCPServer.getMealProgressByDateViaMCP(userId, day.dateString);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Échec de récupération des données de progression: ${result.error}`);
        throw new Error(result.error || 'Erreur lors de la récupération des données de progression');
      }
      
      // Conversion explicite des types pour satisfaire TypeScript
      const dailyProgressData = result.progress || null;
      const mealsProgressData = result.meals || [];
      
      setDailyProgress(dailyProgressData);
      setMealsWithProgress(mealsProgressData);

      // Réinitialiser les erreurs si tout va bien
      setError(null);
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des données de progression', { error });
      setError(`Erreur: ${error instanceof Error ? error.message : String(error)}`);
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
            onDayPress={handleDateSelect}
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
                    {dailyProgress && (
                      <MealsClickSelection 
                        selectedDate={selectedDate}
                        dailyProgress={dailyProgress}
                        mealsWithProgress={mealsWithProgress}
                        onMealStatusChange={() => {
                          // Rafraîchir les données de progression après un changement
                          if (hasUserInSession()) {
                            queryClient.invalidateQueries({ queryKey: ['progressDays', currentPlan?.id] });
                          }
                        }}
                      />
                    )}
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
