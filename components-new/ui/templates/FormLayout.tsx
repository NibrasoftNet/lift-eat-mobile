import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '../organisms/navigation';

interface FormLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  submitLabel?: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  darkMode?: boolean;
}

/**
 * FormLayout component
 * 
 * Template dédié aux formulaires avec:
 * - HeaderBar avec titre
 * - Zone de contenu scrollable
 * - Bouton de soumission en bas de l'écran
 * - Gestion du clavier
 * 
 * Reproduit fidèlement le design Figma sans aucune modification personnelle.
 */
const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  showBackButton = true,
  onBackPress,
  submitLabel = 'Enregistrer',
  onSubmit,
  submitDisabled = false,
  darkMode = false,
}) => {
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  
  const buttonBgEnabled = 'bg-green-500'; // #A1CE50 from Figma
  const buttonBgDisabled = 'bg-gray-300';
  const buttonTextEnabled = 'text-white';
  const buttonTextDisabled = 'text-gray-500';

  return (
    <View className={`flex-1 ${bgColor}`}>
      <HeaderBar
        title={title}
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        darkMode={darkMode}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView className="flex-1 px-5" edges={['bottom']}>
            {children}
          </SafeAreaView>
        </ScrollView>
        
        {onSubmit && (
          <SafeAreaView edges={['bottom']} className="px-5 py-3">
            <Pressable
              onPress={submitDisabled ? undefined : onSubmit}
              disabled={submitDisabled}
              className={`py-4 rounded-xl items-center ${submitDisabled ? buttonBgDisabled : buttonBgEnabled}`}
              style={styles.submitButton}
            >
              <Text
                className={`font-urbanist-bold text-base ${submitDisabled ? buttonTextDisabled : buttonTextEnabled}`}
              >
                {submitLabel}
              </Text>
            </Pressable>
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  submitButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default FormLayout;
