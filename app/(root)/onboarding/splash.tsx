/**
 * Splash Screen - Based on Figma design (node-id: 3821-124001)
 * Implémenté avec les spécifications exactes de la maquette Figma
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../themeNew';
import Text from '../../../components-new/ui/atoms/base/Text';
import LogoIcon from '../../../assets/icons/LogoIcon';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de fade-in pour le logo et le texte
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Redirection après un délai
    const timer = setTimeout(() => {
      router.replace('./walkthrough1');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#A1CE50' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#A1CE50" />
      
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <LogoIcon size={80} />
        <Text 
          variant="h1" 
          style={styles.appName}
          bold
          color="#212121"
        >
          Nutrio
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    gap: 32, // Gap exact entre le logo et le texte (figma: layout_AKKU7M.gap)
  },
  appName: {
    fontFamily: 'Urbanist',
    fontSize: 40, // Taille exacte (figma: style_T1PNM9.fontSize)
    lineHeight: 56, // Ligne exacte (figma: style_T1PNM9.lineHeight = 1.4em * 40px)
    color: '#212121', // Couleur exacte (figma: fill_PZYZY9)
  },
});
