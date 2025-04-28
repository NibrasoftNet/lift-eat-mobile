import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, View, TouchableOpacity, Text } from 'react-native';
import { Send, Brain } from 'lucide-react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
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

interface IAChatProps {
  onMessageSent?: (message: string, response: string) => void;
}

const initialSuggestions = [
  "Comment augmenter mon apport en protéines?",
  "Quels aliments sont riches en vitamine D?",
  "Combien de calories par jour pour perdre du poids?",
  "Explique-moi le régime cétogène",
  "Quels fruits sont faibles en sucre?",
  "Comment réduire l'inflammation par l'alimentation?"
];

const IAChat: React.FC<IAChatProps> = ({ onMessageSent }) => {
  const { currentUser } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const toast = useToast();
  
  // Initialiser le chat avec un message de bienvenue
  useEffect(() => {
    if (currentUser && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Bonjour! Je suis votre assistant nutritionnel IA. Comment puis-je vous aider aujourd'hui?",
          sender: 'assistant',
          timestamp: new Date(),
        }
      ]);
    }
  }, [currentUser, messages.length]);

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
      
      // Notifier le composant parent si nécessaire
      if (onMessageSent) {
        onMessageSent(text.trim(), response.text);
      }
      
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
    <ThemedView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
      </ScrollView>
      
      {suggestions.length > 0 && messages.length <= 2 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsContainer}
          contentContainerStyle={styles.suggestionsContent}
        >
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Tapez votre message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => sendMessage()}
          editable={!loading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={loading || !inputText.trim()}
        >
          <Send color={loading || !inputText.trim() ? "#CCCCCC" : "#FFFFFF"} size={20} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    maxWidth: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  loadingMessage: {
    backgroundColor: '#EEEEEE',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#000000',
  },
  assistantMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#EEEEEE',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -10,
    left: -10,
  },
  suggestionsContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  suggestionsContent: {
    paddingHorizontal: 8,
  },
  suggestionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  suggestionText: {
    fontSize: 14,
    color: '#3498db',
  },
});

export default IAChat;
