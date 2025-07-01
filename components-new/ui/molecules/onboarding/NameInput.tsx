import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface NameInputProps {
  /**
   * Mode sombre activé
   * Correspond au variant "Dark" dans Figma
   */
  dark?: boolean;

  /**
   * Valeur actuelle du nom
   */
  name: string;

  /**
   * Fonction appelée lors du changement de nom
   */
  onNameChange: (name: string) => void;
  
  /**
   * Texte placeholder du champ
   */
  placeholder?: string;
}

/**
 * NameInput component for onboarding screens
 * Based on Figma design:
 * - Light mode: node-id=48444:18418
 * - Dark mode: node-id=48444:18415
 */
const NameInput: React.FC<NameInputProps> = ({
  dark = false,
  name,
  onNameChange,
  placeholder = 'Andrew'
}) => {
  
  // Styles based on dark mode
  const containerStyle = dark ? styles.containerDark : styles.containerLight;
  const textStyle = dark ? styles.textDark : styles.textLight;
  const placeholderColor = dark ? '#8A8A8A' : '#AAAAAA';

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.textInput, textStyle]}
        value={name}
        onChangeText={onNameChange}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        autoCapitalize="words"
        multiline={false}
        textAlign="center"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  containerLight: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEEE',
  },
  containerDark: {
    backgroundColor: '#1F222A',
    borderColor: '#35383F',
  },
  textInput: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 48,
    lineHeight: 67.2, // 48 * 1.4
    width: '100%',
    padding: 0,
    margin: 0,
  },
  textLight: {
    color: '#212121',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default NameInput;
