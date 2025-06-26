import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/components/ui/icon';
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Comment puis-je vous aider aujourd'hui ?"
        placeholderTextColor="#888"
        multiline
        maxLength={500}
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[
          styles.sendButton, 
          { opacity: message.trim() && !isLoading ? 1 : 0.5 }
        ]} 
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        <Icon as={Send} className="w-6 h-6 text-white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.primary.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput;
