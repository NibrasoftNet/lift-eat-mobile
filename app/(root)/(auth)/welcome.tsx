import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Import du nouveau système de thème
import { useTheme } from '../../../themeNew';

// Import des icônes SVG
import GoogleIcon from '../../../assets/icons/GoogleIcon';
import FacebookIcon from '../../../assets/icons/FacebookIcon';
import AppleIcon from '../../../assets/icons/AppleIcon';
import LogoIcon from '../../../assets/icons/LogoIcon';

// SSO imports
import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/clerk-expo';
import { OnboardingService } from '../../../utils/services/core/onboarding.service';
import { authPagesService } from '../../../utils/services/pages/auth-pages.service';
import useSessionStore from '../../../utils/store/sessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../../utils/providers/UserContextProvider';

// Le composant SocialButton n'est plus utilisé - nous définissons directement les styles dans le composant principal

export default function WelcomeScreen() {
  // Utilisation du nouveau système de thème
  const theme = useTheme();

  // Clerk SSO hook
  const { startSSOFlow } = useSSO();
  const { setUser } = useSessionStore();
  const { setCurrentUser, currentUser } = useUserContext();

  /**
   * Lance un flux SSO avec Clerk (Google, Apple, Facebook)
   */
  const signInWithSSO = async (
    strategy: 'oauth_google' | 'oauth_apple' | 'oauth_facebook',
  ) => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy,
          redirectUrl: Linking.createURL('/'),
        });

      let email: string | undefined;
      if ('emailAddress' in ((signIn as any) || {})) {
        // @ts-ignore
        email = signIn?.emailAddress;
      }
      if (!email && 'emailAddress' in ((signUp as any) || {})) {
        // @ts-ignore
        email = signUp?.emailAddress;
      }

      if (email) {
        const result = await authPagesService.findOrCreateUser(email);

        if (result.success && result.data) {
          setUser({ id: result.data.id, email: result.data.email });
          setCurrentUser(result.data);
          await AsyncStorage.setItem('userId', result.data.id.toString());
        }

        const isNewUser = !!signUp;

        if (createdSessionId) {
          await setActive?.({ session: createdSessionId });

          if (isNewUser) {
            await OnboardingService.clearUserData();
            router.replace('/(root)/onboarding/onboarding-step1');
          } else {
            router.replace('/(root)/(tabs)/meals/my-meals');
          }
        }
      }
    } catch (error: any) {
      if (error?.message?.includes('already signed in')) {
        // Si l'utilisateur est déjà authentifié, rediriger simplement vers l'app principale
        router.replace('/(root)/(tabs)/meals/my-meals');
        return;
      }
      console.error('Erreur SSO', error);
    }
  };

  // Rediriger immédiatement si l'utilisateur est déjà connecté
  React.useEffect(() => {
    if (currentUser?.id) {
      router.replace('/(root)/(tabs)/meals/my-meals');
    }
  }, [currentUser]);

  // Fonctions de navigation
  const handleGoogleSignIn = () => signInWithSSO('oauth_google');
  const handleFacebookSignIn = () => signInWithSSO('oauth_facebook');
  const handleAppleSignIn = () => signInWithSSO('oauth_apple');
  const handleCreateAccount = () => {
    router.push('/registerNew');
  };
  const handleSignIn = () => {
    router.push('../loginNew');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.color('background') }]}
    >
      <StatusBar style="dark" />

      <View style={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LogoIcon size={60} />
        </View>

        {/* Titre et description */}
        <View style={styles.headerContainer}>
          <Text
            style={[
              {
                fontFamily: 'Urbanist',
                fontWeight: '700',
                fontSize: 32,
                lineHeight: 38,
                color: theme.color('primary'),
                textAlign: 'center',
                marginBottom: 8,
              },
            ]}
          >
            Let's Get Started!
          </Text>
          <Text
            style={[
              {
                fontFamily: 'Urbanist',
                fontWeight: '400',
                fontSize: 16,
                lineHeight: 24,
                color: theme.color('blueGrey'),
                textAlign: 'center',
                marginBottom: 8,
              },
            ]}
          >
            Let's dive in into your account
          </Text>
        </View>

        {/* Boutons sociaux */}
        <View style={styles.socialButtonsContainer}>
          {/* Bouton Google - fond blanc avec bordure */}
          <View style={styles.socialButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: theme.color('background'),
                  borderWidth: 0.5,
                  borderColor: theme.color('blueGrey'),
                },
              ]}
              onPress={handleGoogleSignIn}
            >
              <View style={styles.socialButtonContent}>
                <GoogleIcon size={30} />
                <Text
                  style={[
                    {
                      fontFamily: 'Urbanist',
                      fontWeight: '600',
                      fontSize: 16,
                      lineHeight: 19,
                    },
                    styles.socialButtonText,
                  ]}
                >
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bouton Apple - fond blanc avec bordure - uniquement sur iOS */}
          {Platform.OS === 'ios' && (
            <View style={styles.socialButtonWrapper}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.color('background'),
                    borderWidth: 0.5,
                    borderColor: theme.color('blueGrey'),
                  },
                ]}
                onPress={handleAppleSignIn}
              >
                <View style={styles.socialButtonContent}>
                  <AppleIcon size={24} />
                  <Text
                    style={[
                      {
                        fontFamily: 'Urbanist',
                        fontWeight: '600',
                        fontSize: 16,
                        lineHeight: 19,
                      },
                      styles.socialButtonText,
                    ]}
                  >
                    Continue with Apple
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Bouton Facebook - fond bleu */}
          <View style={styles.socialButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: theme.color('background'),
                  borderWidth: 0.5,
                  borderColor: theme.color('blueGrey'),
                },
              ]}
              onPress={handleFacebookSignIn}
            >
              <View style={styles.socialButtonContent}>
                <FacebookIcon size={40} />
                <Text
                  style={[
                    {
                      fontFamily: 'Urbanist',
                      fontWeight: '600',
                      fontSize: 16,
                      lineHeight: 19,
                    },
                    styles.socialButtonText,
                  ]}
                >
                  Continue with Facebook
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Séparateur */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Bouton de création de compte */}
        <TouchableOpacity
          style={[
            styles.createAccountButton,
            {
              backgroundColor: theme.color('successLighter'),
              borderWidth: 0.5,
              borderColor: theme.color('successLight'),
            },
          ]}
          onPress={handleCreateAccount}
        >
          <Text
            style={[
              {
                fontFamily: 'Urbanist',
                fontWeight: '600',
                fontSize: 14,
                lineHeight: 17,
                letterSpacing: 0.1,
                color: 'black',
                textAlign: 'center',
              },
            ]}
          >
            Sign up
          </Text>
        </TouchableOpacity>

        {/* Lien de connexion */}
        <View style={styles.signInContainer}>
          <TouchableOpacity
            style={[
              styles.createAccountButton,
              {
                backgroundColor: theme.color('green'),
                borderWidth: 0.5,
                borderColor: theme.color('lime'),
              },
            ]}
            onPress={handleSignIn}
          >
            <Text
              style={[
                {
                  fontFamily: 'Urbanist',
                  fontWeight: '600',
                  fontSize: 14,
                  lineHeight: 17,
                  letterSpacing: 0.1,
                  color: 'black',
                  textAlign: 'center',
                },
              ]}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  socialButtonsContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 20,
  },
  socialButtonWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  socialButton: {
    width: '100%',
    height: 60,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#000000',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16, // Marges verticales exactes
    marginTop: 24,
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#9E9E9E',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    marginTop: 2,
  },
  createAccountButton: {
    width: '100%',
    height: 56,
    borderRadius: 1000,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  signInText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
});
