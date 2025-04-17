import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
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
import geminiService from '@/utils/services/gemini-service';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import nutritionDatabaseService from '@/utils/services/nutrition-database.service';

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
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const drizzleDb = useDrizzleDb();
  const toast = useToast();

  // Récupérer l'ID de l'utilisateur actuel
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Pour cette démo, nous allons simplement prendre le premier utilisateur de la base de données
        // Dans une application réelle, vous utiliseriez un système d'authentification
        const userResults = await drizzleDb.select().from(users).limit(1);
        
        if (userResults.length > 0) {
          const userId = userResults[0].id;
          setCurrentUserId(userId);
          
          // Configurer le service Gemini avec l'ID de l'utilisateur actuel
          geminiService.setCurrentUserId(userId);
          
          // Initialiser le service de base de données nutritionnelle
          nutritionDatabaseService.initialize(drizzleDb);
          
          console.log(`Assistant initialized with user ID: ${userId}`);
        } else {
          console.warn('No users found in the database');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    getCurrentUser();
  }, [drizzleDb]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Get response from Gemini
    try {
      const responseText = await generateResponse(text);
      
      // Check if this was likely a request to add meal/plan
      const isAddingMeal = text.toLowerCase().includes('ajoute') && text.toLowerCase().includes('repas');
      const isAddingPlan = text.toLowerCase().includes('ajoute') && text.toLowerCase().includes('plan');
      
      if (isAddingMeal || isAddingPlan) {
        // Show confirmation toast using MultiPurposeToast
        toast.show({
          render: ({ id }) => {
            return (
              <MultiPurposeToast 
                id={id}
                color={ToastTypeEnum.SUCCESS}
                title={isAddingMeal ? "Repas ajouté" : "Plan ajouté"}
                description={isAddingMeal 
                  ? "Le repas a été ajouté à votre base de données avec succès."
                  : "Le plan nutritionnel a été ajouté à votre base de données avec succès."
                }
              />
            );
          },
          placement: "bottom"
        });
      }
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        type: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      
      // Scroll to bottom again
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error getting response:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ThemedView style={styles.header}>
        <ThemedText type="title">Assistant Lift-Eat</ThemedText>
        {currentUserId ? (
          <ThemedText style={styles.subtitle}>Prêt à vous aider avec vos questions et tâches</ThemedText>
        ) : (
          <ThemedText style={styles.subtitle}>Chargement des préférences...</ThemedText>
        )}
      </ThemedView>
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {currentUserId 
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
