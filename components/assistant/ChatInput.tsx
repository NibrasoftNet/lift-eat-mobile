import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Send } from 'lucide-react-native';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Posez une question...',
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <HStack className="p-3 space-x-2 bg-white border-t border-gray-200 items-center">
      <TextInput
        className="flex-1 min-h-10 max-h-24 bg-gray-100 rounded-full px-4 py-2.5 mr-2.5 text-base"
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        placeholderTextColor="#888"
        multiline
        maxLength={500}
        editable={!isLoading}
      />
      <Pressable
        className={`w-11 h-11 rounded-full bg-green-500 items-center justify-center ${
          !message.trim() || isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        <Send size={20} color="#FFF" />
      </Pressable>
    </HStack>
  );
};

export default ChatInput;
