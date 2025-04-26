import React from 'react';
import { Box } from '@/components/ui/box';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/utils/constants/Colors';

export type MessageType = 'user' | 'assistant';

interface ChatMessageProps {
  message: string;
  type: MessageType;
  timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, type, timestamp }) => {
  const isUser = type === 'user';
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box className={`my-1.5 max-w-[80%] ${
      isUser ? 'self-end' : 'self-start'
    }`}>
      <Box className={`rounded-2xl px-4 py-2.5 mb-0.5 ${
        isUser ? 'bg-primary-background' : 'bg-gray-100'
      }`}>
        <ThemedText className={`text-base leading-snug ${
          isUser ? 'text-white' : 'text-black'
        }`}>
          {message}
        </ThemedText>
      </Box>
      <ThemedText className="text-xs text-gray-500 mx-1.5 self-end">
        {formatTime(timestamp)}
      </ThemedText>
    </Box>
  );
};



export default ChatMessage;
