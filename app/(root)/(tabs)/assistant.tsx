import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

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

// Import des composants IA depuis le dossier centralisé
import { IAChat, MealGenerator, NutritionAnalysis, PlanGenerator } from '@/components/assistant/ia-features';
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
  const { currentUser, isLoading: isUserLoading, refreshUser } = useUserContext();
  const toast = useToast();
  
  // État pour gérer la fonctionnalité IA active
  const [activeIAFeature, setActiveIAFeature] = useState<string | null>(null);

  // Récupérer l'utilisateur actuel via le contexte utilisateur global et initialiser les services
  useEffect(() => {
    // Utilisons une variable pour éviter des appels multiples
    let isUserFetched = false;
    
    const initializeAssistant = async () => {
      try {
        if (currentUser && !isUserFetched) {
          isUserFetched = true;
          logger.info(LogCategory.USER, 'Initializing assistant services with user ID', { userId: currentUser.id });
          
          // Nous pouvons configurer des services via assistantPagesService si nécessaire
          
          // Ajouter un message de bienvenue
          addSystemMessage(`Bonjour ${currentUser.name || 'utilisateur'}, je suis votre assistant nutritionnel. Comment puis-je vous aider aujourd'hui ?`);
        }
      } catch (error) {
        logger.error(LogCategory.USER, 'Error initializing assistant:', { error });
        toast.show({
          render: ({ id }) => <MultiPurposeToast 
            id={id}
            title="Erreur" 
            description="Erreur lors de l'initialisation de l'assistant" 
            color={ToastTypeEnum.ERROR} 
          />
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
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      logger.error(LogCategory.USER, 'Error generating response:', { error });
      
      toast.show({
        render: ({ id }) => <MultiPurposeToast 
          id={id}
          title="Erreur" 
          description="Désolé, je rencontre un problème technique." 
          color={ToastTypeEnum.ERROR} 
        />
      });
      
      const assistantErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre demande ?",
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
      <ThemedView style={styles.header}>
        <ThemedText type="title">Assistant Lift-Eat</ThemedText>
        {currentUser ? (
          <ThemedText style={styles.subtitle}>Prêt à vous aider avec vos questions et tâches</ThemedText>
        ) : (
          <ThemedText style={styles.subtitle}>Chargement des préférences...</ThemedText>
        )}
      </ThemedView>
      
      {/* Navigation Buttons Section */}
      <View style={styles.navButtonsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.navButton, activeIAFeature === 'meal-generator' && styles.navButtonActive]} 
            onPress={() => setActiveIAFeature(activeIAFeature === 'meal-generator' ? null : 'meal-generator')}
          >
            <ThemedView style={[styles.navButtonIcon, activeIAFeature === 'meal-generator' && styles.navButtonIconActive]}>  
              <ThemedText style={styles.iconText}>🍲</ThemedText>
            </ThemedView>
            <ThemedText style={styles.navButtonText}>Générateur de Repas</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, activeIAFeature === 'plan-generator' && styles.navButtonActive]} 
            onPress={() => setActiveIAFeature(activeIAFeature === 'plan-generator' ? null : 'plan-generator')}
          >
            <ThemedView style={[styles.navButtonIcon, activeIAFeature === 'plan-generator' && styles.navButtonIconActive]}>  
              <ThemedText style={styles.iconText}>📅</ThemedText>
            </ThemedView>
            <ThemedText style={styles.navButtonText}>Plan Nutritionnel</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, activeIAFeature === 'nutrition-analysis' && styles.navButtonActive]} 
            onPress={() => setActiveIAFeature(activeIAFeature === 'nutrition-analysis' ? null : 'nutrition-analysis')}
          >
            <ThemedView style={[styles.navButtonIcon, activeIAFeature === 'nutrition-analysis' && styles.navButtonIconActive]}>  
              <ThemedText style={styles.iconText}>📊</ThemedText>
            </ThemedView>
            <ThemedText style={styles.navButtonText}>Analyse Nutrition</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, activeIAFeature === 'ia-chat' && styles.navButtonActive]} 
            onPress={() => setActiveIAFeature(activeIAFeature === 'ia-chat' ? null : 'ia-chat')}
          >
            <ThemedView style={[styles.navButtonIcon, activeIAFeature === 'ia-chat' && styles.navButtonIconActive]}>  
              <ThemedText style={styles.iconText}>💬</ThemedText>
            </ThemedView>
            <ThemedText style={styles.navButtonText}>Chat IA</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Afficher la fonctionnalité IA sélectionnée */}
      {activeIAFeature && (
        <View style={styles.iaFeatureContainer}>
          {activeIAFeature === 'meal-generator' && (
            <ScrollView style={styles.iaContentScroll}>
              <ThemedView style={styles.iaContentContainer}>
                <ThemedText style={styles.iaFeatureTitle}>Générateur de Repas IA</ThemedText>
                <MealGenerator onMealGenerated={(meal) => {
                  console.log('Meal generated successfully:', meal.name);
                  setActiveIAFeature(null);
                  addSystemMessage(`L'IA a généré un nouveau repas: ${meal.name}`);
                }} />
              </ThemedView>
            </ScrollView>
          )}
          
          {activeIAFeature === 'plan-generator' && (
            <ScrollView style={styles.iaContentScroll}>
              <ThemedView style={styles.iaContentContainer}>
                <ThemedText style={styles.iaFeatureTitle}>Générateur de Plan Nutritionnel</ThemedText>
                <PlanGenerator onPlanGenerated={(plan) => {
                  console.log('Plan generated successfully.');
                  setActiveIAFeature(null);
                  addSystemMessage(`L'IA a généré un nouveau plan nutritionnel pour vous.`);
                }} />
              </ThemedView>
            </ScrollView>
          )}
          
          {activeIAFeature === 'nutrition-analysis' && (
            <ScrollView style={styles.iaContentScroll}>
              <ThemedView style={styles.iaContentContainer}>
                <ThemedText style={styles.iaFeatureTitle}>Analyse Nutritionnelle</ThemedText>
                <NutritionAnalysis onAnalysisComplete={(analysis) => {
                  console.log('Nutrition analysis completed');
                  // Option: laisser l'analyse visible ou revenir au chat
                  // setActiveIAFeature(null);
                  // addSystemMessage(`L'analyse nutritionnelle a été complétée.`);
                }} />
              </ThemedView>
            </ScrollView>
          )}
          
          {activeIAFeature === 'ia-chat' && (
            <View style={styles.iaChatContainer}>
              <IAChat onMessageSent={(userMessage, assistantResponse) => {
                console.log('Message sent in IA Chat');
                // Option: on peut choisir de synchroniser les messages avec le chat principal
                // setMessages(prev => [
                //   ...prev,
                //   { id: Date.now().toString(), text: userMessage, type: 'user', timestamp: new Date() },
                //   { id: (Date.now() + 1).toString(), text: assistantResponse, type: 'assistant', timestamp: new Date() }
                // ]);
              }} />
            </View>
          )}
        </View>
      )}
      
      {/* Chat assistant - affiché uniquement si aucune fonctionnalité IA n'est active */}
      {!activeIAFeature && (
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                {currentUser 
                  ? "Bonjour ! Je suis votre assistant personnel pour Lift-Eat. Je peux vous aider avec la nutrition, l'utilisation de l'application, vos préférences, et bien plus encore. Comment puis-je vous aider aujourd'hui ?"
                  : "Chargement de vos données personnelles..."}
              </ThemedText>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatMessage
                  message={item.text}
                  type={item.type}
                  timestamp={item.timestamp}
                />
              )}
              contentContainerStyle={styles.messageList}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />
          )}
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary.background} />
            </View>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  navButtonsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navButton: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 88,
  },
  navButtonActive: {
    opacity: 1,
  },
  navButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  navButtonIconActive: {
    backgroundColor: Colors.primary.background,
  },
  iconText: {
    fontSize: 28,
  },
  navButtonText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#444',
  },
  iaFeatureContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iaContentScroll: {
    flex: 1,
  },
  iaContentContainer: {
    padding: 16,
  },
  iaFeatureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  iaDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  iaButton: {
    backgroundColor: Colors.primary.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  iaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iaChatContainer: {
    padding: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    padding: 15,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
  }
});
