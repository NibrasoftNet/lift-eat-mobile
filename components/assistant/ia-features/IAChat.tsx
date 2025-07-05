import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Eye, EyeOff, User } from 'lucide-react-native';
import ChatMessage from '@/components/assistant/ChatMessage';
import { ChatInput } from '@/components/assistant/ChatInput';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
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
  'Comment augmenter mon apport en protéines?',
  'Quels aliments sont riches en vitamine D?',
  'Combien de calories par jour pour perdre du poids?',
  'Explique-moi le régime cétogène',
  'Quels fruits sont faibles en sucre?',
  "Comment réduire l'inflammation par l'alimentation?",
];

const IAChat: React.FC<IAChatProps> = ({ onMessageSent }) => {
  const { currentUser } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [showUserContext, setShowUserContext] = useState(false);
  const [userContext, setUserContext] = useState<string>('');

  // Récupérer le contexte utilisateur pour l'afficher lorsque demandé
  useEffect(() => {
    if (currentUser) {
      iaService
        .getUserContext()
        .then((context) => {
          setUserContext(context || 'Aucun contexte utilisateur disponible');
        })
        .catch((error) => {
          console.error(
            'Erreur lors de la récupération du contexte utilisateur:',
            error,
          );
          setUserContext('Impossible de récupérer le contexte utilisateur');
        });
    }
  }, [currentUser]);

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
        },
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

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentUser) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      // Indiquer à l'utilisateur que l'IA est en train de répondre
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: '...',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);

      // Utiliser le service IA pour générer une réponse
      const response = await iaService.generateResponse(text.trim());

      // Remplacer le message "..." par la vraie réponse
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          id: messages.length + 2,
          text: response.text,
          sender: 'assistant',
          timestamp: new Date(),
        }),
      );

      // Si une action a été détectée (par exemple, création d'un repas ou d'un plan)
      if (response.action) {
        if (response.action.success) {
          toast.show({
            render: ({ id }) => (
              <MultiPurposeToast
                id={id}
                color={ToastTypeEnum.SUCCESS}
                title="Action réussie"
                description={`L'action ${response.action?.type} a été exécutée avec succès.`}
              />
            ),
          });
        } else {
          toast.show({
            render: ({ id }) => (
              <MultiPurposeToast
                id={id}
                color={ToastTypeEnum.ERROR}
                title="Erreur lors de l'action"
                description={`L'action ${response.action?.type} a échoué: ${
                  response.action?.message || 'Erreur inconnue'
                }`}
              />
            ),
          });
        }
      }

      // Callback si fourni
      if (onMessageSent) {
        onMessageSent(text.trim(), response.text);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);

      // Remplacer le message "..." par un message d'erreur
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          id: messages.length + 2,
          text: "Désolé, je n'ai pas pu générer une réponse. Veuillez réessayer plus tard.",
          sender: 'assistant',
          timestamp: new Date(),
        }),
      );

      toast.show({
        render: ({ id }) => (
          <MultiPurposeToast
            id={id}
            color={ToastTypeEnum.ERROR}
            title="Erreur"
            description="Impossible de communiquer avec l'assistant IA. Veuillez réessayer."
          />
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const toggleUserContext = () => {
    setShowUserContext(!showUserContext);
  };

  return (
    <Box className="flex-1 bg-gray-50">
      {/* En-tête */}
      <Box className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between bg-white shadow-sm">
        <Text className="text-lg font-bold">Assistant IA</Text>
        <Pressable
          onPress={toggleUserContext}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {showUserContext ? (
            <EyeOff size={20} color="#666" />
          ) : (
            <Eye size={20} color="#666" />
          )}
        </Pressable>
      </Box>

      {/* Contexte utilisateur (visible/masqué) */}
      {showUserContext && (
        <Box className="p-4 bg-blue-50 border-b border-blue-200 shadow-sm">
          <HStack className="items-center space-x-2 mb-2">
            <User size={16} color="#0077B6" />
            <Text className="font-bold text-blue-700">
              Contexte Utilisateur
            </Text>
          </HStack>
          <Box className="p-2 bg-white rounded-md border border-blue-100">
            <Text className="text-xs font-mono text-gray-800 whitespace-pre-wrap">
              {userContext || 'Chargement du contexte utilisateur...'}
            </Text>
          </Box>
        </Box>
      )}

      {/* Zone de messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            type={message.sender}
            timestamp={message.timestamp}
            isThinking={message.text === '...'}
          />
        ))}
      </ScrollView>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <Box className="p-4 border-t border-gray-200 bg-white shadow-sm">
          <Text className="font-bold mb-2.5 text-sm">Suggestions:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full mr-3 shadow-xs"
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text className="text-sm font-medium">{suggestion}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Box>
      )}

      {/* Zone de saisie */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ChatInput onSendMessage={sendMessage} isLoading={loading} />
      </KeyboardAvoidingView>

      <Box className="py-3 items-center bg-white border-t border-gray-100 shadow-sm">
        <Text className="text-xs text-gray-500 font-medium">
          Propulsé par Gemini
        </Text>
      </Box>
    </Box>
  );
};

export default IAChat;
