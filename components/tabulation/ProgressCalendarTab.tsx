import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VStack } from '../ui/vstack';
import NavbarUser from '../navbars/NavbarUser';
import { Calendar, DateData } from 'react-native-calendars';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { UserOrmPros, DailyProgressOrmProps, PlanOrmProps, MealOrmProps, DailyPlanOrmProps } from '@/db/schema';
import useSessionStore from '@/utils/store/sessionStore';
import { HStack } from '../ui/hstack';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { Center } from '../ui/center';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
// Ces fonctions ont été remplacées par des appels directs au serveur MCP
import useProgressStore, { MealWithProgress, MealsByType } from '@/utils/store/progressStore';
import { View, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import MealsClickSelection from '../progress/MealsClickSelection';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserId, getCurrentUserIdSync, hasUserInSession } from '@/utils/helpers/userContext';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { progressPagesService } from '@/utils/services/pages/progress-pages.service';
import { userPagesService } from '@/utils/services/pages/user-pages.service';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { DayEnum } from '@/utils/enum/general.enum';

// Interface pour le type de plan journalier avec repas
interface DailyPlanWithMeals extends DailyPlanOrmProps {
  meals: MealOrmProps[];
}

const ProgressCalendarTab = () => {
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
          
          // Utiliser userPagesService pour récupérer l'utilisateur
          const result = await userPagesService.getUserProfile(userId);
          
          if (result.success && result.data && result.data.user) {
            return result.data.user;
          } else {
            logger.warn(LogCategory.DATABASE, `Failed to get user with ID ${userId}, trying default user`);
          }
        }
        
        // Si pas d'utilisateur en session ou la récupération a échoué, obtenir l'utilisateur par défaut
        // Note: Cette partie devrait être implémentée dans userPagesService à terme
        logger.error(LogCategory.DATABASE, "No user ID found or retrieval failed");
        throw new Error("No user found");
        
        // Le code ci-dessous est commenté car userResult n'est pas défini
        // et cette partie du code est inaccessible après le throw Error ci-dessus
        
        // Une fois implémenté dans le service:
        // const defaultUserResult = await userPagesService.getDefaultUser();
        // 
        // if (!defaultUserResult.success || !defaultUserResult.data || !defaultUserResult.data.user) {
        //   logger.error(LogCategory.DATABASE, "Failed to get default user");
        //   throw new Error("No user found");
        // }
        // 
        // const userResult = defaultUserResult.data.user;
        // logger.info(LogCategory.DATABASE, `Loaded user from database: ${userResult?.id}`);
        // 
        // // Si on trouve un utilisateur, mettre à jour la session
        // if (userResult && !hasUserInSession()) {
        //   useSessionStore.setState({ user: { id: userResult.id, email: userResult.email } });
        // }
        // 
        // return userResult;
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
        
        // Utiliser planPagesService pour récupérer le plan courant
        const result = await planPagesService.getCurrentPlan();
        
        if (!result.success) {
          logger.error(LogCategory.DATABASE, `Failed to get current plan: ${result.error}`);
          return null;
        }
        
        // Assurez-vous que nous retournons toujours un PlanOrmProps ou null, jamais undefined
        return result.data?.plan || null;
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
      
      // Utiliser la méthode getProgressByPlan du service progressPagesService
      logger.info(LogCategory.DATABASE, 'Fetching progress days for current plan via service', {
        planId: currentPlan.id
      });
      
      const result = await progressPagesService.getProgressByPlan(currentPlan.id);
      
      if (!result.success || !result.data) {
        logger.warn(LogCategory.DATABASE, 'No progress days found for current plan', {
          planId: currentPlan.id
        });
        return [];
      }
      
      return result.data.progressions || [];
    },
    enabled: !!currentPlan?.id && hasUserInSession(),
  });

  // Récupérer les détails du plan pour obtenir les jours planifiés
  const {
    data: planResult,
    isLoading: isPlanDetailsLoading,
  } = useQuery({
    queryKey: ['planDetails', currentPlan?.id],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!currentPlan?.id || !userId) return null;
      
      // Récupérer les détails du plan via MCP Server
      logger.info(LogCategory.DATABASE, 'Fetching plan details to display calendar markers', {
        userId,
        planId: currentPlan.id
      });
      
      // Utiliser planPagesService pour récupérer les détails du plan
      const result = await planPagesService.getPlanDetails(currentPlan.id);
      
      // Extraire les données du résultat
      const planData = result.success && result.data ? result.data.plan : null;
      const dailyPlansData = result.success && result.data ? result.data.dailyPlans : [];
      
      logger.debug(LogCategory.DATABASE, 'Plan details fetched', {
        success: result.success,
        hasPlan: !!planData,
        hasDailyPlans: dailyPlansData && dailyPlansData.length > 0,
        dailyPlansType: dailyPlansData ? typeof dailyPlansData : 'undefined',
        dailyPlansLength: dailyPlansData?.length,
        firstPlanDetails: dailyPlansData?.[0] ? Object.keys(dailyPlansData[0]) : [],
      });
      
      return result.success ? { success: result.success, plan: planData, dailyPlans: dailyPlansData } : null;
    },
    enabled: !!currentPlan?.id && hasUserInSession(),
  });

  // Fonction pour convertir un jour de la semaine en date ISO pour la semaine courante
  const getDayOfCurrentWeek = (day: DayEnum): string => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 pour dimanche, 1 pour lundi, etc.
    const daysMap: Record<DayEnum, number> = {
      [DayEnum.SUNDAY]: 0,
      [DayEnum.MONDAY]: 1,
      [DayEnum.TUESDAY]: 2,
      [DayEnum.WEDNESDAY]: 3,
      [DayEnum.THURSDAY]: 4,
      [DayEnum.FRIDAY]: 5,
      [DayEnum.SATURDAY]: 6,
    };
    
    const targetDay = daysMap[day];
    const diff = targetDay - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff + (diff < 0 ? 7 : 0)); // Ajouter 7 si le jour est déjà passé
    
    return targetDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  // Fonction pour convertir une date en jour de la semaine (DayEnum)
  const getWeekDayFromDate = (dateStr: string): DayEnum => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
    
    const dayMap: Record<number, DayEnum> = {
      0: DayEnum.SUNDAY,
      1: DayEnum.MONDAY,
      2: DayEnum.TUESDAY,
      3: DayEnum.WEDNESDAY,
      4: DayEnum.THURSDAY,
      5: DayEnum.FRIDAY,
      6: DayEnum.SATURDAY,
    };
    
    return dayMap[dayOfWeek];
  };

  // Préparer les dates marquées pour le calendrier en utilisant useMemo pour éviter les recalculs
  const markedDates = React.useMemo(() => {
    // Log détaillé au début du calcul des marqueurs de calendrier
    logger.info(LogCategory.UI, 'Calculating calendar markers', {
      planId: currentPlan?.id,
      hasProgressDays: !!progressDays && progressDays.length > 0,
      progressDaysCount: progressDays?.length || 0
    });
    
    // Ajouter des logs détaillés pour comprendre la structure des données du plan
    logger.debug(LogCategory.UI, 'Calendar plan data debug', {
      hasPlanResult: !!planResult,
      planResultStructure: planResult ? Object.keys(planResult) : [],
      hasDailyPlans: planResult?.dailyPlans !== undefined,
      dailyPlansType: planResult?.dailyPlans ? typeof planResult.dailyPlans : 'undefined',
      dailyPlansLength: planResult?.dailyPlans?.length,
      firstPlanDetails: planResult?.dailyPlans?.[0] ? Object.keys(planResult.dailyPlans[0]) : [],
    });
    
    const dates: Record<string, any> = {};
    
    // D'abord, si les détails du plan sont disponibles, marquer tous les jours du plan
    if (planResult?.dailyPlans && Array.isArray(planResult.dailyPlans) && planResult.dailyPlans.length > 0) {
      logger.info(LogCategory.UI, `Processing ${planResult.dailyPlans.length} daily plans for calendar markers`);
      
      // Parcourir tous les plans journaliers
      planResult.dailyPlans.forEach((dailyPlan: DailyPlanOrmProps, index: number) => {
        // Ajouter un log pour chaque plan journalier
        logger.debug(LogCategory.UI, `Daily plan ${index}:`, {
          day: dailyPlan.day,
          week: dailyPlan.week,
          id: dailyPlan.id
        });
        
        // Convertir le jour enum en date ISO (format YYYY-MM-DD)
        const planDate = getDayOfCurrentWeek(dailyPlan.day as DayEnum);
        logger.debug(LogCategory.UI, `Converted ${dailyPlan.day} to date: ${planDate}`);
        
        const isSelected = selectedDate === planDate;
        
        // Ajouter un marqueur par défaut pour tous les jours du plan
        const planDot = { 
          key: 'planned', 
          color: '#808080', // Gris pour indiquer qu'il y a des repas planifiés
          selectedDotColor: '#FFFFFF'
        };
        
        dates[planDate] = {
          dots: [planDot],
          selected: isSelected,
          selectedColor: '#007AFF',
        };
        
        logger.debug(LogCategory.UI, `Added marker for date: ${planDate}`, {
          dots: 1,
          isSelected,
          dailyPlanId: dailyPlan.id
        });
      });
      
      logger.info(LogCategory.UI, `Added markers for ${Object.keys(dates).length} days`);
    }
    
    // Ensuite, superposer les marqueurs pour les jours avec progression (pour avoir la couleur correcte)
    if (progressDays && progressDays.length > 0) {
    // Créer les marqueurs pour chaque date avec progression
    progressDays.forEach((progress: DailyProgressOrmProps) => {
      // Convertir la date au format YYYY-MM-DD
      const progressDate = progress.date.split('T')[0];
      
      // Les points colorés correspondent au % de complétion
      const percentComplete = progress.pourcentageCompletion || 0;
      let dotColor;
      
      if (percentComplete < 30) {
        dotColor = '#ff4d4d'; // Rouge pour moins de 30%
      } else if (percentComplete < 70) {
        dotColor = '#ffcc00'; // Jaune pour moins de 70%
      } else {
        dotColor = '#00cc66'; // Vert pour 70% et plus
      }
      
      // Vérifier si la date est déjà marquée (pour un plan), sinon créer un nouveau marqueur
      if (dates[progressDate]) {
        // Ajouter le point de progression aux points existants
        dates[progressDate].dots = [
          ...dates[progressDate].dots,
          {
            key: 'progress',
            color: dotColor,
            selectedDotColor: '#FFFFFF'
          }
        ];
      } else {
        // Créer un nouveau marqueur pour cette date
        dates[progressDate] = {
          dots: [{
            key: 'progress',
            color: dotColor,
            selectedDotColor: '#FFFFFF'
          }],
          selected: selectedDate === progressDate,
          selectedColor: '#007AFF',
        };
      }
    });
    }
    
    return dates;
  }, [planResult, progressDays, selectedDate]);
  
  // Pour garantir que markedDates est toujours défini et que les dates sélectionnées sont marquées
  const finalMarkedDates = React.useMemo(() => {
    // Créer une copie pour éviter de modifier l'original
    const markedDatesWithSelection = {...markedDates};
    
    // Ajouter un log pour voir toutes les dates marquées
    logger.info(LogCategory.UI, 'Final calendar markers before selection', {
      datesCount: Object.keys(markedDatesWithSelection).length,
      dates: Object.keys(markedDatesWithSelection),
      selectedDate
    });
    
    // Si une date est sélectionnée mais qu'elle n'a pas de progression, l'ajouter comme sélectionnée
    if (selectedDate && !markedDatesWithSelection[selectedDate]) {
      markedDatesWithSelection[selectedDate] = {
        selected: true,
        selectedColor: '#007AFF',
      };
      logger.debug(LogCategory.UI, `Added selection marker for date: ${selectedDate}`);
    }
    
    logger.info(LogCategory.UI, 'Final calendar markers after selection', {
      datesCount: Object.keys(markedDatesWithSelection).length
    });
    
    return markedDatesWithSelection;
  }, [markedDates, selectedDate]);

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
      logger.info(LogCategory.DATABASE, 'Récupération de la progression des repas via progress-pages service', {
        userId: userId,
        date: day.dateString
      });
      
      // Convertir la date sélectionnée en jour de la semaine
      const selectedDayOfWeek = getWeekDayFromDate(day.dateString);
      logger.info(LogCategory.UI, `Date sélectionnée ${day.dateString} correspond au jour: ${selectedDayOfWeek}`);
      
      // Chercher tous les plans journaliers correspondant au jour de la semaine dans les données du plan
      if (currentPlan && currentPlan.id) {
        // Note: progressPagesService ne possède pas encore la méthode getPlanDetails
        // Utiliser planPagesService à la place
        const dailyPlanDetails = await planPagesService.getPlanDetails(currentPlan.id);
        
        // Extraire les données du plan pour faciliter l'accès et corriger les erreurs TypeScript
        const dailyPlanData = dailyPlanDetails.success && dailyPlanDetails.data ? dailyPlanDetails.data.dailyPlans : [];
        
        logger.info(LogCategory.UI, `Détails du plan récupérés pour le plan ${currentPlan.id}`, {
          planSuccess: dailyPlanDetails.success,
          dailyPlansCount: dailyPlanData?.length || 0,
          dailyPlanIds: dailyPlanData?.map((dp: {id: number}) => dp.id) || [],
        });
        
        if (dailyPlanDetails.success && dailyPlanData && dailyPlanData.length > 0) {
          // Trouver tous les plans journaliers correspondant au jour sélectionné
          const matchingDailyPlans = dailyPlanData.filter(
            (dp: {day: string}) => dp.day === selectedDayOfWeek
          ) as DailyPlanWithMeals[];
          
          logger.info(LogCategory.UI, `Plans journaliers trouvés pour ${selectedDayOfWeek}`, {
            count: matchingDailyPlans.length,
            ids: matchingDailyPlans.map((dp: {id: number}) => dp.id)
          });
          
          // Chercher le premier plan journalier qui contient des repas
          const dailyPlanWithMeals = matchingDailyPlans.find((dp: {meals?: any[]}) => dp.meals && dp.meals.length > 0);
          
          if (dailyPlanWithMeals) {
            logger.info(LogCategory.UI, `Trouvé un plan journalier avec repas: ${dailyPlanWithMeals.id}`, {
              mealsCount: dailyPlanWithMeals.meals.length,
              mealsData: JSON.stringify(dailyPlanWithMeals.meals.map(m => ({id: m.id, name: m.name})))
            });
            
            // Créer un DailyProgress temporaire si nécessaire
            // Cela permettra de créer les relations nécessaires lorsque l'utilisateur déplace un repas
            if (!dailyProgress && currentPlan && selectedDate) {
              // Créer une entrée temporaire dans la base de données
              try {
                logger.info(LogCategory.DATABASE, `Création d'une progression quotidienne pour la date ${selectedDate}`);
                // Utiliser la méthode createDailyProgress du service progressPagesService
                const createResult = await progressPagesService.createDailyProgress(selectedDate);
                
                if (createResult.success && createResult.data) {
                  logger.info(LogCategory.DATABASE, `Progression quotidienne créée avec succès: ${createResult.data.progress.id}`);
                  // Mettre à jour la progression quotidienne locale pour éviter un rechargement
                  setDailyProgress(createResult.data.progress);
                } else {
                  logger.error(LogCategory.DATABASE, `Échec de création de la progression: ${createResult.error}`);
                }
              } catch (error) {
                logger.error(LogCategory.DATABASE, `Erreur lors de la création de la progression quotidienne`, { error });
              }
            }
            
            // Transformer les MealOrmProps en MealWithProgress
            // TypeScript ne connaît pas le type exact retourné par l'API, donc on type explicitement
            const mealsWithProgressFormat = dailyPlanWithMeals.meals.map(meal => {
              // Création d'un objet compatible MealWithProgress
              return {
                ...meal, // Toutes les propriétés du repas
                progress: null, // Pas de progression pour l'instant
                mealType: meal.type, // Conserver le type de repas original
                // On utilise un cast pour éviter les erreurs TypeScript
                // Normalement, ces IDs seraient créés lors du déplacement du repas
                dailyPlanMealId: null
              };
            });
            
            setMealsWithProgress(mealsWithProgressFormat);
          } else {
            // Aucun plan journalier avec repas trouvé
            setMealsWithProgress([]);
            logger.warn(LogCategory.UI, `Aucun plan journalier pour ${selectedDayOfWeek} ne contient de repas`);
          }
        } else {
          // Erreur lors de la récupération des détails
          setMealsWithProgress([]);
          logger.warn(LogCategory.UI, `Erreur lors de la récupération des détails du plan: ${dailyPlanDetails.error || 'unknown error'}`);
        }
      } else {
        setMealsWithProgress([]);
        logger.warn(LogCategory.UI, `Plan courant non trouvé ou sans ID valide`);
      }
      
      // Récupérer aussi les progrès pour cette date
      const result = await progressPagesService.getDailyProgress(day.dateString);
      
      if (result.success) {
        // Conversion explicite des types pour satisfaire TypeScript
        const dailyProgressData = result.data?.dailyProgress || null;
        setDailyProgress(dailyProgressData);
      } else {
        // Pas de données de progression - c'est OK, on pourrait quand même avoir des repas
        setDailyProgress(null);
      }

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
            markedDates={finalMarkedDates}
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
                    <MealsClickSelection 
                      selectedDate={selectedDate}
                      dailyProgress={dailyProgress || {
                        id: 0, // ID temporaire
                        pourcentageCompletion: 0,
                        calories: 0,
                        carbs: 0,
                        protein: 0,
                        fat: 0,
                        date: selectedDate,
                        userId: user?.id || 0,
                        planId: currentPlan?.id || 0,
                        createdAt: null,
                        updatedAt: null
                      }}
                      mealsWithProgress={mealsWithProgress}
                      onMealStatusChange={() => {
                        // Rafraîchir les données de progression après un changement
                        if (hasUserInSession()) {
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
