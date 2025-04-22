import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble
      ]}>
        <ThemedText style={[
          styles.messageText,
          isUser ? styles.userText : styles.assistantText
        ]}>
          {message}
        </ThemedText>
      </View>
      <ThemedText style={styles.timestamp}>
        {formatTime(timestamp)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: Colors.primary.background,
  },
  assistantBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'flex-end',
  },
});

export default ChatMessage;
