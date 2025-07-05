import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

// Composants UI standardisés
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';

// Composants légacy à refactoriser
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ChatInput from '@/components/assistant/ChatInput';
import ChatMessage, { MessageType } from '@/components/assistant/ChatMessage';
import { useGemini } from '@/hooks/useGemini';
import { Colors } from '@/utils/constants/Colors';
import { useUserContext } from '@/utils/providers/UserContextProvider';
import { users } from '@/db/schema';

// Import des services refactorisés
import { assistantPagesService } from '@/utils/services/pages/assistant-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import iaService from '@/utils/services/ia/ia.service';

// Import des composants IA depuis le dossier centralisé
import {
  MealGenerator,
  NutritionAnalysis,
  PlanGenerator,
} from '@/components/assistant/ia-features';
import { IaMealType, IaPlanType } from '@/utils/validation/ia/ia.schemas';

interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { loading, generateResponse } = useGemini();
  const flatListRef = useRef<FlatList>(null);
  const {
    currentUser,
    isLoading: isUserLoading,
    refreshUser,
  } = useUserContext();
  const toast = useToast();

  // États pour gérer les fonctionnalités IA et l'interface
  const [activeIAFeature, setActiveIAFeature] = useState<string | null>(null);
  const [showUserContext, setShowUserContext] = useState<boolean>(false);
  const [userContext, setUserContext] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([
    'Comment puis-je augmenter mon apport en protéines ?',
    'Quel repas riche en fibres me recommandes-tu ?',
    'Comment atteindre mes objectifs caloriques ?',
    'Génère-moi un repas équilibré',
  ]);

  // Récupérer l'utilisateur actuel via le contexte utilisateur global et initialiser les services
  // Fonction pour basculer l'affichage du contexte utilisateur
  const toggleUserContext = async () => {
    if (!showUserContext && userContext === '') {
      // Si on active le contexte pour la première fois et qu'il n'est pas encore chargé
      try {
        const context = await iaService.getUserContext();
        setUserContext(context);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération du contexte utilisateur:',
          error,
        );
        setUserContext(
          'Erreur lors de la récupération du contexte utilisateur',
        );
      }
    }
    setShowUserContext(!showUserContext);
  };

  // Gérer un clic sur une suggestion
  const handleSuggestionPress = (suggestionText: string) => {
    handleSendMessage(suggestionText);
  };

  useEffect(() => {
    // Utilisons une variable pour éviter des appels multiples
    let isUserFetched = false;

    const initializeAssistant = async () => {
      try {
        if (currentUser && !isUserFetched) {
          isUserFetched = true;
          logger.info(
            LogCategory.USER,
            'Initializing assistant services with user ID',
            { userId: currentUser.id },
          );

          // Initialiser le service IA avec l'ID utilisateur
          iaService.setCurrentUserId(currentUser.id);

          // Ajouter un message de bienvenue
          addSystemMessage(
            `Bonjour ${
              currentUser.name || 'utilisateur'
            }, je suis votre assistant nutritionnel. Comment puis-je vous aider aujourd'hui ?`,
          );
        }
      } catch (error) {
        logger.error(LogCategory.USER, 'Error initializing assistant:', {
          error,
        });
        toast.show({
          render: ({ id }) => (
            <MultiPurposeToast
              id={id}
              title="Erreur"
              description="Erreur lors de l'initialisation de l'assistant"
              color={ToastTypeEnum.ERROR}
            />
          ),
        });
      }
    };

    if (!isUserLoading) {
      initializeAssistant();
    }

    return () => {
      isUserFetched = false;
    };
  }, [currentUser, isUserLoading, refreshUser]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date(),
    };

    addMessage(newUserMessage);

    try {
      // Utiliser Gemini pour la réponse (via le hook existant)
      const responseText = await generateResponse(text);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        type: 'assistant',
        timestamp: new Date(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      logger.error(LogCategory.USER, 'Error generating response:', { error });

      toast.show({
        render: ({ id }) => (
          <MultiPurposeToast
            id={id}
            title="Erreur"
            description="Désolé, je rencontre un problème technique."
            color={ToastTypeEnum.ERROR}
          />
        ),
      });

      const assistantErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre demande ?',
        type: 'assistant',
        timestamp: new Date(),
      };
      addMessage(assistantErrorMessage);
    }
  };

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const addSystemMessage = (text: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'assistant',
      timestamp: new Date(),
    };
    addMessage(systemMessage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Box className="p-4 border-b border-gray-200 bg-white">
        <HStack className="justify-between items-center">
          <VStack className="flex-1">
            <Text className="text-xl font-bold">Assistant Lift-Eat</Text>
            {currentUser ? (
              <Text className="text-sm text-gray-500 mt-1">
                Prêt à vous aider avec vos questions et tâches
              </Text>
            ) : (
              <Text className="text-sm text-gray-500 mt-1">
                Chargement des préférences...
              </Text>
            )}
          </VStack>
          <Pressable
            className="bg-gray-100 px-3 py-1.5 rounded-full"
            onPress={toggleUserContext}
          >
            <Text className="text-sm text-gray-700">
              {showUserContext ? '🔍 Masquer' : '🔍 Contexte'}
            </Text>
          </Pressable>
        </HStack>
      </Box>

      {/* Affichage du contexte utilisateur */}
      {showUserContext && (
        <Box className="p-3 bg-blue-50 border-b border-blue-200">
          <HStack className="items-center mb-2 space-x-1">
            <Text className="text-sm font-bold text-blue-700">
              👤 Contexte Utilisateur
            </Text>
          </HStack>
          <Box className="max-h-40 overflow-scroll">
            <Text className="text-xs font-mono text-gray-800 bg-white p-2.5 rounded-md border border-gray-200 whitespace-pre-wrap">
              {userContext || 'Chargement du contexte utilisateur...'}
            </Text>
          </Box>
        </Box>
      )}

      {/* Navigation Buttons Section */}
      <Box className="py-3 border-b border-gray-200 bg-white">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            className={`px-4 py-2 mx-2 rounded-lg ${
              activeIAFeature === 'meal-generator'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
            onPress={() =>
              setActiveIAFeature(
                activeIAFeature === 'meal-generator' ? null : 'meal-generator',
              )
            }
          >
            <VStack className="items-center space-y-1">
              <Box
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  activeIAFeature === 'meal-generator'
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}
              >
                <Text className="text-xl">🍲</Text>
              </Box>
              <Text className="text-xs font-medium text-center">
                Générateur de Repas
              </Text>
            </VStack>
          </Pressable>

          <Pressable
            className={`px-4 py-2 mx-2 rounded-lg ${
              activeIAFeature === 'plan-generator'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
            onPress={() =>
              setActiveIAFeature(
                activeIAFeature === 'plan-generator' ? null : 'plan-generator',
              )
            }
          >
            <VStack className="items-center space-y-1">
              <Box
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  activeIAFeature === 'plan-generator'
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}
              >
                <Text className="text-xl">📅</Text>
              </Box>
              <Text className="text-xs font-medium text-center">
                Plan Nutritionnel
              </Text>
            </VStack>
          </Pressable>

          <Pressable
            className={`px-4 py-2 mx-2 rounded-lg ${
              activeIAFeature === 'nutrition-analysis'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
            onPress={() =>
              setActiveIAFeature(
                activeIAFeature === 'nutrition-analysis'
                  ? null
                  : 'nutrition-analysis',
              )
            }
          >
            <VStack className="items-center space-y-1">
              <Box
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  activeIAFeature === 'nutrition-analysis'
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}
              >
                <Text className="text-xl">📊</Text>
              </Box>
              <Text className="text-xs font-medium text-center">
                Analyse Nutrition
              </Text>
            </VStack>
          </Pressable>
        </ScrollView>
      </Box>

      {/* Afficher la fonctionnalité IA sélectionnée */}
      {activeIAFeature && (
        <Box className="flex-1 bg-white">
          {activeIAFeature === 'meal-generator' && (
            <ScrollView className="flex-1">
              <Box className="p-4">
                <Text className="text-xl font-bold mb-4 text-center">
                  Générateur de Repas IA
                </Text>
                <MealGenerator
                  onMealGenerated={(meal) => {
                    console.log('Meal generated successfully:', meal.name);
                    setActiveIAFeature(null);
                    addSystemMessage(
                      `L'IA a généré un nouveau repas: ${meal.name}`,
                    );
                  }}
                />
              </Box>
            </ScrollView>
          )}

          {activeIAFeature === 'plan-generator' && (
            <ScrollView className="flex-1">
              <Box className="p-4">
                <Text className="text-xl font-bold mb-4 text-center">
                  Générateur de Plan Nutritionnel
                </Text>
                <PlanGenerator
                  onPlanGenerated={(plan) => {
                    console.log('Plan generated successfully.');
                    setActiveIAFeature(null);
                    addSystemMessage(
                      `L'IA a généré un nouveau plan nutritionnel pour vous.`,
                    );
                  }}
                />
              </Box>
            </ScrollView>
          )}

          {activeIAFeature === 'nutrition-analysis' && (
            <ScrollView className="flex-1">
              <Box className="p-4">
                <Text className="text-xl font-bold mb-4 text-center">
                  Analyse Nutritionnelle
                </Text>
                <NutritionAnalysis
                  onAnalysisComplete={(analysis) => {
                    console.log('Nutrition analysis completed');
                    // Option: laisser l'analyse visible ou revenir au chat
                    // setActiveIAFeature(null);
                    // addSystemMessage(`L'analyse nutritionnelle a été complétée.`);
                  }}
                />
              </Box>
            </ScrollView>
          )}

          {/* Chat IA supprimé pour n'utiliser que l'interface principale */}
        </Box>
      )}

      {/* Chat assistant - affiché uniquement si aucune fonctionnalité IA n'est active */}
      {!activeIAFeature && (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Messages list */}
          <Box className="flex-1 bg-gray-50">
            {messages.length === 0 ? (
              <Box className="flex-1 justify-center items-center p-6 bg-gray-50">
                <Text className="text-center text-gray-700 text-base leading-6">
                  {currentUser
                    ? "Bonjour ! Je suis votre assistant personnel pour Lift-Eat. Je peux vous aider avec la nutrition, l'utilisation de l'application, vos préférences, et bien plus encore. Comment puis-je vous aider aujourd'hui ?"
                    : 'Chargement de vos données personnelles...'}
                </Text>
              </Box>
            ) : (
              <FlatList
                data={messages}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                  <ChatMessage
                    key={item.id}
                    message={item.text}
                    type={item.type}
                    timestamp={item.timestamp}
                  />
                )}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  paddingBottom: 10,
                }}
                style={{ flex: 1 }}
                ref={flatListRef}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
              />
            )}
          </Box>

          {/* Loading indicator when assistant is processing */}
          {loading && (
            <Box className="flex-row items-center justify-center py-2 bg-blue-50 border-t border-blue-100">
              <ActivityIndicator size="small" color="#0066CC" />
              <Text className="ml-2 text-sm text-blue-700">
                Assistant réfléchit...
              </Text>
            </Box>
          )}

          {/* Suggestions */}
          {messages.length <= 3 && (
            <Box className="px-4 py-3 border-t border-gray-200 bg-white">
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Suggestions:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className="space-x-2 flex-wrap">
                  {suggestions.map((suggestion, index) => (
                    <Pressable
                      key={index}
                      className="bg-gray-100 px-4 py-2 rounded-full mb-2"
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text className="text-sm text-gray-800">
                        {suggestion}
                      </Text>
                    </Pressable>
                  ))}
                </HStack>
              </ScrollView>
            </Box>
          )}

          <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    padding: 15,
    paddingBottom: 20,
  },
});
