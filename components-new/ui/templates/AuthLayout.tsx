import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '../organisms/navigation';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  darkMode?: boolean;
}

/**
 * AuthLayout component
 * 
 * Template dédié aux écrans d'authentification avec:
 * - HeaderBar optionnel (avec ou sans titre)
 * - Zone de contenu centrée avec scroll
 * - Gestion du clavier pour éviter qu'il ne recouvre les champs de saisie
 * 
 * Reproduit fidèlement le design Figma des écrans d'authentification.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onBackPress,
  darkMode = false, // Par défaut en mode clair pour les écrans d'auth
}) => {
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const statusBarStyle = darkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="transparent"
        translucent
      />
      
      <View className={`flex-1 ${bgColor}`}>
        {(title || showBackButton) && (
          <HeaderBar
            title={title || ''}
            showBackButton={showBackButton}
            onBackPress={onBackPress}
            darkMode={darkMode}
          />
        )}
        
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
        </KeyboardAvoidingView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default AuthLayout;
