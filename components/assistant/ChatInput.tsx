import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Send } from 'lucide-react-native';
import { Colors } from '@/utils/constants/Colors';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <HStack className="flex-row items-center px-4 py-2.5 border-t border-gray-200 bg-white">
      <TextInput
        className="flex-1 min-h-10 max-h-24 bg-gray-100 rounded-full px-4 py-2.5 mr-2.5 text-base"
        value={message}
        onChangeText={setMessage}
        placeholder="Comment puis-je vous aider aujourd'hui ?"
        placeholderTextColor="#888"
        multiline
        maxLength={500}
        editable={!isLoading}
      />
      <Pressable 
        className={`w-11 h-11 rounded-full bg-primary-background items-center justify-center ${
          !message.trim() || isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        <Icon as={Send} className="w-6 h-6 text-white" />
      </Pressable>
    </HStack>
  );
};



export default ChatInput;
