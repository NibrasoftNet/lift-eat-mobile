import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Send, Brain, ArrowUpRight } from 'lucide-react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useUserContext } from '@/utils/providers/UserContextProvider';
import iaService from '@/utils/services/ia/ia.service';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const initialSuggestions = [
  "Comment augmenter mon apport en protéines?",
  "Quels aliments sont riches en vitamine D?",
  "Combien de calories par jour pour perdre du poids?",
  "Explique-moi le régime cétogène",
  "Quels fruits sont faibles en sucre?",
  "Comment réduire l'inflammation par l'alimentation?"
];

export default function AssistantScreen() {
  const { currentUser, isLoading: isUserLoading, refreshUser } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  
  // Récupérer l'utilisateur actuel via le contexte global
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Si aucun utilisateur n'est chargé dans le contexte, récupérer l'utilisateur 1 par défaut
        if (!currentUser && !isUserLoading) {
          refreshUser(1);
          return; // Attendre que l'utilisateur soit chargé avant de continuer
        }
        
        if (currentUser) {
          // Configurer le service IA avec l'ID de l'utilisateur actuel
          iaService.setCurrentUserId(currentUser.id);
          
          // Ajouter un message de bienvenue
          setMessages([
            {
              id: 1,
              text: "Bonjour! Je suis votre assistant nutritionnel IA. Comment puis-je vous aider aujourd'hui?",
              sender: 'assistant',
              timestamp: new Date(),
            }
          ]);
        } else {
          console.warn('No users found in the database');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    initializeChat();
  }, [currentUser, isUserLoading, refreshUser, drizzleDb]);

  // Faire défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async (text: string = inputText) => {
    if (!text.trim() || !currentUser) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    try {
      setLoading(true);
      
      // Indiquer à l'utilisateur que l'IA est en train de répondre
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        text: "...",
        sender: 'assistant',
        timestamp: new Date(),
      }]);
      
      // Utiliser le service IA pour générer une réponse
      const response = await iaService.generateResponse(text.trim());
      
      // Remplacer le message "..." par la vraie réponse
      setMessages(prev => prev.slice(0, -1).concat({
        id: messages.length + 2,
        text: response.text,
        sender: 'assistant',
        timestamp: new Date(),
      }));
      
      // Mettre à jour les suggestions
      // Si l'API renvoie des suggestions, les utiliser
      // Comme cette propriété manque, nous utilisons les suggestions par défaut
      // setSuggestions(initialSuggestions);
      
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Remplacer le message "..." par un message d'erreur
      setMessages(prev => prev.slice(0, -1).concat({
        id: messages.length + 2,
        text: "Désolé, j'ai rencontré une erreur en essayant de répondre. Pourriez-vous reformuler votre question?",
        sender: 'assistant',
        timestamp: new Date(),
      }));
      
      toast.show({
        render: ({ id }) => (
          <MultiPurposeToast
            id={id}
            color={ToastTypeEnum.ERROR}
            title="Erreur"
            description={`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`}
          />
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    return (
      <ThemedView 
        key={message.id}
        style={[
          styles.messageContainer,
          message.sender === 'user' ? styles.userMessage : styles.assistantMessage,
          message.text === "..." ? styles.loadingMessage : {}
        ]}
      >
        {message.sender === 'assistant' && message.text !== "..." && (
          <View style={styles.iconContainer}>
            <Brain color="#FFFFFF" size={16} />
          </View>
        )}
        
        <ThemedText style={[
          styles.messageText,
          message.sender === 'user' ? styles.userMessageText : styles.assistantMessageText
        ]}>
          {message.text}
        </ThemedText>
      </ThemedView>
    );
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#000" />
          <ThemedText style={styles.backButtonText}>Retour</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Assistant IA</ThemedText>
      </ThemedView>
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          style={styles.messagesContainer} 
          contentContainerStyle={styles.messagesContent}
          ref={scrollViewRef}
        >
          {messages.map(renderMessage)}
        </ScrollView>
        
        {suggestions.length > 0 && (
          <ScrollView 
            horizontal 
            style={styles.suggestionsContainer}
            showsHorizontalScrollIndicator={false}
          >
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.suggestionButton}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <ThemedText style={styles.suggestionText}>{suggestion}</ThemedText>
                <ArrowUpRight size={14} color="#2196F3" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Posez votre question..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage()}
          />
          
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => sendMessage()}
            disabled={loading || !inputText.trim()}
          >
            <Send size={24} color={inputText.trim() ? "#2196F3" : "#A0A0A0"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2196F3',
    borderTopRightRadius: 2,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 2,
  },
  loadingMessage: {
    backgroundColor: '#E0E0E0',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#2196F3',
  },
  messageText: {
    flex: 1,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#000000',
  },
  suggestionsContainer: {
    maxHeight: 60,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  suggestionButton: {
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    marginRight: 4,
    fontSize: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    color: '#2196F3',
  },
  sendButton: {
    padding: 8,
  },
  inputContainer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
});
