/**
 * SocialLoginGroup - Groupe de boutons pour l'authentification sociale
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=40432-39033
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import AppleIcon from '@/assets/icons/AppleIcon';
import FacebookIcon from '@/assets/icons/FacebookIcon';

interface SocialLoginGroupProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  showFacebook?: boolean;
  onFacebookPress?: () => void;
}

export const SocialLoginGroup: React.FC<SocialLoginGroupProps> = ({
  onGooglePress,
  onApplePress,
  showFacebook = false,
  onFacebookPress,
}) => {
  const theme = useAppTheme();

  // Pour le RegisterScreen, nous n'avons besoin que de Google et Apple
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.socialButton}
        onPress={onGooglePress}
        activeOpacity={0.7}
      >
        <GoogleIcon />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={onApplePress}
        activeOpacity={0.7}
      >
        <AppleIcon />
      </TouchableOpacity>

      {showFacebook && (
        <TouchableOpacity
          style={styles.socialButton}
          onPress={onFacebookPress}
          activeOpacity={0.7}
        >
          <FacebookIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
