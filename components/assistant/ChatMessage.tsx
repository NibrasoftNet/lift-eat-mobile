import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Brain, Volume2, VolumeX } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { useTTS } from '@/hooks/ia/voice';
import { StyleSheet } from 'react-native';

export type MessageType = 'user' | 'assistant';

interface ChatMessageProps {
  message: string;
  type: MessageType;
  timestamp: Date;
  showIcon?: boolean;
  isThinking?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  type, 
  timestamp, 
  showIcon = true,
  isThinking = false
}) => {
  const isUser = type === 'user';
  const { speak, stop, isSpeaking } = useTTS();
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSpeakMessage = () => {
    if (isSpeaking) {
      stop();
    } else if (message && !isThinking) {
      speak(message);
    }
  };

  return (
    <Box 
      className={`my-1.5 p-3 rounded-xl max-w-[85%] ${
        isUser 
          ? 'self-end bg-blue-50 rounded-br-none' 
          : 'self-start bg-white rounded-bl-none'
      } shadow-sm`}
    >
      {showIcon && (
        <HStack className="items-center mb-1 space-x-1 justify-between w-full">
          <HStack className="items-center space-x-1">
            <Brain size={14} color="#666" />
            <Text className="text-xs text-gray-500">
              {isUser ? 'Vous' : 'Assistant IA'}
            </Text>
          </HStack>
          
          {!isUser && !isThinking && (
            <Pressable
              onPress={handleSpeakMessage}
              style={[styles.voiceButton, isSpeaking ? styles.voiceButtonActive : null]}
            >
              {isSpeaking ? (
                <VolumeX size={16} color="#4F46E5" />
              ) : (
                <Volume2 size={16} color="#666" />
              )}
            </Pressable>
          )}
        </HStack>
      )}
      <Text className="text-base leading-6">
        {isThinking ? 'En train de réfléchir...' : message}
      </Text>
      <Box className="items-end mt-1">
        <Text className="text-xs text-gray-500">
          {formatTime(timestamp)}
        </Text>
      </Box>
    </Box>
  );
};

// Styles pour le bouton de synthèse vocale
const styles = StyleSheet.create({
  voiceButton: {
    borderRadius: 20,
    padding: 4,
  },
  voiceButtonActive: {
    backgroundColor: '#E0E7FF' // Couleur lilas clair compatible avec le design Figma
  }
});

export default ChatMessage;
