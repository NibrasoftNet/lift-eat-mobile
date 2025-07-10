/**
 * Login Screen - Based on Figma design (node-id: 40432-41582)
 * Implémenté avec les spécifications exactes de la maquette
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusBar } from 'expo-status-bar';

// Import components from new component library
import LogoIcon from '../../../assets/icons/LogoIcon';
import { useTheme } from '../../../themeNew';
import Text from '../../../components-new/ui/atoms/base/Text';
import Input from '../../../components-new/ui/atoms/inputs/Input';
import Checkbox from '../../../components-new/ui/atoms/inputs/Checkbox';
import Divider from '../../../components-new/ui/atoms/layout/Divider';
import GoogleIcon from '../../../assets/icons/GoogleIcon';
import AppleIcon from '../../../assets/icons/AppleIcon';
import FacebookIcon from '../../../assets/icons/FacebookIcon';

// Import des icônes officielles de Figma
import { ShowRegularBoldIcon } from '../../../assets/icons/figma/regular-bold/ShowRegularBoldIcon';
import { HideRegularBoldIcon } from '../../../assets/icons/figma/regular-bold/HideRegularBoldIcon';
import { LockRegularTwotoneIcon } from '../../../assets/icons/figma/regular-two-tone/LockRegularTwotoneIcon';
import { MessageRegularTwotoneIcon } from '../../../assets/icons/figma/regular-two-tone/MessageRegularTwotoneIcon';
// Import validation schema and interfaces
import {
  LoginFormData,
  loginSchema,
} from '../../../utils/validation/auth/login-schema.validation';
import { useMutation } from '@tanstack/react-query';
import { authPagesService } from '../../../utils/services/pages/auth-pages.service';
import useSessionStore from '../../../utils/store/sessionStore';
import { LogCategory } from '../../../utils/enum/logging.enum';
import { logger } from '../../../utils/services/common/logging.service';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/clerk-expo';
import { OnboardingService } from '../../../utils/services/core/onboarding.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../../utils/providers/UserContextProvider';

/**
 * Nouvel écran de connexion basé sur le design Figma
 * Implémenté avec les nouveaux composants atomiques et le système de thème
 */
export default function LoginNew() {
  const router = useRouter();
  const theme = useTheme();
  const { setUser } = useSessionStore();
  const { setCurrentUser } = useUserContext();

  // Clerk SSO hook for social providers
  const { startSSOFlow } = useSSO();

  /**
   * Helper pour lancer l'authentification SSO (Google, Apple, Facebook).
   * En cas de succès, on active la session et on redirige vers l'écran principal.
   */
  const signInWithSSO = async (
    strategy: 'oauth_google' | 'oauth_apple' | 'oauth_facebook',
  ) => {
    console.log('[SSO] Début du flux SSO avec la stratégie:', strategy);
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy,
          redirectUrl: Linking.createURL('/'),
        });

      console.log(
        '[SSO] SSO flow terminé – createdSessionId:',
        createdSessionId,
      );
      console.log('[SSO] signIn object:', signIn);
      console.log('[SSO] signUp object:', signUp);

      let email: string | undefined;
      // Try to extract email from signIn/signUp objects if available
      if ('emailAddress' in ((signIn as any) || {})) {
        // @ts-ignore
        email = signIn?.emailAddress ?? undefined;
      }
      if (!email && 'emailAddress' in ((signUp as any) || {})) {
        // @ts-ignore
        email = signUp?.emailAddress ?? undefined;
      }

      console.log('[SSO] Email extrait:', email);

      if (email) {
        // Vérifier ou créer l'utilisateur dans SQLite via le service MCP
        const result = await authPagesService.findOrCreateUser(email);
        console.log('[SSO] Résultat findOrCreateUser:', result);
        if (result.success && result.data) {
          setUser({ id: result.data.id, email: result.data.email });
          setCurrentUser(result.data);
          await AsyncStorage.setItem('userId', result.data.id.toString());
          console.log('[SSO] userId stocké dans AsyncStorage:', result.data.id);
        }
        const isNewUser = !!signUp;
        console.log('[SSO] isNewUser:', isNewUser);
        const isExistingUser = !isNewUser;

        console.log('[SSO] createdSessionId présent ?', !!createdSessionId);

        if (createdSessionId) {
          // Active la session Clerk
          console.log('[SSO] Activation de la session Clerk');
          await setActive?.({ session: createdSessionId });

          if (isNewUser) {
            // Nettoyer les anciennes données d'onboarding pour éviter pré-remplissage
            console.log(
              '[SSO] Nouvel utilisateur – purge des données onboarding',
            );
            await OnboardingService.clearUserData();
            console.log('[SSO] Redirection vers onboarding-step1');
            router.replace('/(root)/onboarding/onboarding-step1');
          } else {
            console.log('[SSO] Utilisateur existant – redirection vers meals');
            router.replace('/(root)/(tabs)/meals/my-meals');
          }
        }
      }
    } catch (err) {
      console.error('[SSO] Erreur SSO', err);
    }
  };

  // Fonctions spécifiques aux fournisseurs
  const handleGoogleSignIn = () => signInWithSSO('oauth_google');
  const handleAppleSignIn = () => signInWithSSO('oauth_apple');
  const handleFacebookSignIn = () => signInWithSSO('oauth_facebook');

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Login mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      logger.info(LogCategory.AUTH, 'Authentification utilisateur', {
        email: data.email,
      });

      // Utiliser le service d'authentification avec la méthode login
      const result = await authPagesService.login(data);

      if (!result.success) {
        logger.error(LogCategory.AUTH, `Échec de connexion: ${result.error}`);
        throw new Error(result.error || 'Échec de connexion');
      }

      if (!result.data || !result.data.user) {
        logger.warn(
          LogCategory.AUTH,
          `Utilisateur avec l'email ${data.email} non trouvé`,
        );
        throw new Error(
          "Utilisateur non trouvé. Veuillez vous inscrire d'abord.",
        );
      }

      return result.data.user;
    },
    onSuccess: (data) => {
      setUser({
        id: data?.id!,
        email: data?.email!,
      });
      setCurrentUser(data);
      AsyncStorage.setItem('userId', data.id.toString());
      // Redirection directe vers l'écran des repas après connexion
      try {
        // Utiliser router.push qui est compatible avec les types d'Expo Router
        router.push('/(root)/(tabs)/meals/my-meals');

        console.log("Navigation vers l'écran des repas après connexion");
      } catch (error) {
        console.error('Erreur lors de la navigation:', error);
        // En cas d'échec, essayer une approche plus simple
        router.push('/');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      // On pourrait ajouter un état pour afficher l'erreur dans l'UI
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRememberMe = () => {
    setIsRememberMeChecked(!isRememberMeChecked);
  };

  const handleForgotPassword = () => {
    router.push('/reset-password');
  };

  const handleSignUp = () => {
    router.push('/registerNew');
  };

  // Handle any pending auth sessions (Clerk recommendation)
  WebBrowser.maybeCompleteAuthSession();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.contentContainer}>
          {/* En-tête avec logo et titres */}
          <View style={styles.headerContainer}>
            <LogoIcon size={60} />
            <View style={styles.titleContainer}>
              <Text variant="h2" bold color="#212121" align="center" mb={10}>
                Welcome Back! 👋
              </Text>
              <Text variant="body" color="#616161" align="center">
                Sign in to continue your journey towards a healthier you.
              </Text>
            </View>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            {/* Champ Email */}
            <View style={styles.inputContainer}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  fontFamily: 'Urbanist',
                  color: '#212121',
                  marginBottom: 8,
                }}
              >
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="filledLight"
                    placeholder="Enter your email"
                    placeholderTextColor="#9E9E9E"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    width="100%"
                    px={20}
                    py={10}
                    rounded={10}
                    leftIcon={
                      <MessageRegularTwotoneIcon size={20} color="#A4C73B" />
                    }
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  fontFamily: 'Urbanist',
                  color: '#212121',
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="filledLight"
                    placeholder="Enter your password"
                    placeholderTextColor="#9E9E9E"
                    secureTextEntry={!isPasswordVisible}
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    width="100%"
                    px={20}
                    py={10}
                    rounded={10}
                    leftIcon={
                      <LockRegularTwotoneIcon size={20} color="#A4C73B" />
                    }
                    rightIcon={
                      <TouchableOpacity onPress={togglePasswordVisibility}>
                        {isPasswordVisible ? (
                          <HideRegularBoldIcon size={20} color="#A4C73B" />
                        ) : (
                          <ShowRegularBoldIcon size={20} color="#A4C73B" />
                        )}
                      </TouchableOpacity>
                    }
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Options Remember me et Forgot password */}
            <View style={[styles.optionsContainer, { gap: 20 }]}>
              <Checkbox
                checked={isRememberMeChecked}
                onChange={toggleRememberMe}
                label="Remember me"
                style="text"
                theme="light"
                containerStyle={styles.rememberMeContainer}
                labelStyle={{
                  color: '#212121',
                  fontFamily: 'Urbanist',
                  fontSize: 14,
                  fontWeight: '500',
                }}
              />

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text
                  variant="caption"
                  semibold
                  color="#A4C73B"
                  style={{ fontFamily: 'Urbanist', fontWeight: '800' }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bouton de connexion */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                isPending && styles.signInButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>

            {/* Divider + Social Buttons */}
            <View style={styles.socialContainer}>
              <Divider label="or continue with" />

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleSignIn}
                >
                  <GoogleIcon size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleAppleSignIn}
                >
                  <AppleIcon size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleFacebookSignIn}
                >
                  <FacebookIcon size={24} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Lien vers inscription */}
            <View style={styles.signUpContainer}>
              <Text variant="caption" color="#616161">
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text
                  variant="caption"
                  semibold
                  color="#81A540"
                  style={{ marginLeft: 4 }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Couleur exacte du fond (figma: fill_MUEG6P)
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24, // Padding horizontal exact (figma: layout_3LOWPR)
    paddingTop: 100, // Padding top fortement augmenté pour décaler vers le bas sans scrolling
    paddingBottom: 24, // Padding bottom conservé
    justifyContent: 'space-between', // Répartit l'espace verticalement
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10, // Espacement réduit
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginTop: 24,
    width: '100%', // Largeur exacte (figma: layout_HLPFLK)
  },
  title: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 24, // Taille exacte (figma: style_MUDG36)
    lineHeight: 28.8, // 1.2 * fontSize (figma: style_MUDG36 lineHeight: 1.2em)
    color: '#212121', // Couleur exacte (figma: fill_X536AK)
    textAlign: 'center',
    marginBottom: 8, // Espace entre titre et description
  },
  description: {
    fontFamily: 'Urbanist',
    fontWeight: '400',
    fontSize: 16, // Taille exacte (figma: style_XPN2EU)
    lineHeight: 22.4, // 1.4 * fontSize (figma: style_XPN2EU lineHeight: 1.4em)
    color: '#616161', // Couleur exacte (figma: fill_2WL5V6)
    textAlign: 'center',
    marginBottom: 0,
  },
  formContainer: {
    width: '100%',
    gap: 30, // Espacement exact entre les champs (figma: layout_4MCQ7S)
    marginTop: 10, // Marge supplémentaire
  },
  inputContainer: {
    marginBottom: 15, // Espacement exact (figma: layout_4MCQ7S)
  },
  inputLabel: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600', // Poids exact (figma: style_XRWGCM)
    marginBottom: 8, // Espace exact (figma: layout_YGIJGQ)
    color: '#212121', // Couleur exacte (figma: fill_GYJR03)
  },
  inputWrapper: {
    flexDirection: 'row',
    height: 56, // Hauteur exacte (figma: layout_RWIGQP.dimensions.height: 56)
    borderWidth: 1,
    borderColor: '#E0E0E0', // Couleur exacte (figma: stroke_DYDJ7R.colors[0])
    borderRadius: 8, // Rayon exact (figma: I48444:18543;1629:26262.borderRadius)
    paddingHorizontal: 16, // Padding exact (figma: layout_QVNBNO.padding.horizontal: 16px)
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Couleur exacte (figma: fill_CG5E61)
  },
  inputError: {
    borderColor: '#FF5726', // Couleur d'erreur du thème
  },
  input: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontSize: 16, // Taille exacte (figma: style_XRWGCM)
    color: '#212121', // Couleur exacte (figma: fill_GYJR03)
  },
  visibilityToggle: {
    padding: 8,
  },
  visibilityToggleText: {
    fontFamily: 'Urbanist',
    color: '#3F51B2', // Couleur primaire exacte
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontFamily: 'Urbanist',
    fontSize: 14, // Taille exacte pour les messages d'erreur
    color: '#FF5726', // Couleur d'erreur exacte
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15, // Espacement exact avant le bouton
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20, // Taille exacte (figma: I40432:41597;3273:21373.dimensions)
    height: 20, // Taille exacte (figma: I40432:41597;3273:21373.dimensions)
    borderWidth: 1,
    borderColor: '#E0E0E0', // Couleur exacte (figma: stroke_DYDJ7R)
    borderRadius: 4, // Rayon exact
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: '#A4C73B', // Couleur exacte (figma: fill_K8YLVG)
    borderColor: '#A4C73B',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  rememberMeText: {
    fontFamily: 'Urbanist',
    fontSize: 14, // Taille exacte (figma: style_X6T4DM)
    color: '#212121', // Couleur exacte (figma: fill_GYJR03)
  },
  forgotPasswordText: {
    fontFamily: 'Urbanist',
    fontSize: 14, // Taille exacte
    fontWeight: '600', // Poids exact
    color: '#81A540', // Couleur exacte (figma green)
  },
  signInButton: {
    height: 56, // Hauteur exacte (figma: layout_HNMVRW)
    borderRadius: 1000, // Rayon exact (figma: I40432:41602;1629:22639.borderRadius)
    backgroundColor: '#81A540', // Couleur exacte (figma: fill_K8YLVG)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24, // Espacement exact
  },
  signInButtonDisabled: {
    backgroundColor: '#DADADA', // Couleur exacte (figma: fill_FP0V8Z)
  },
  signInButtonText: {
    fontFamily: 'Urbanist',
    fontSize: 16, // Taille exacte (figma: style_DPWWH1)
    fontWeight: '700', // Poids exact (figma: style_DPWWH1)
    letterSpacing: 0.2, // Espacement exact (figma: style_DPWWH1.letterSpacing: 1.25%)
    color: '#FFFFFF', // Couleur exacte (blanc)
    textTransform: 'uppercase', // Transformation de texte exacte
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5, // Espacement augmenté
    marginBottom: 20, // Marge inférieure ajoutée
  },
  signUpText: {
    fontFamily: 'Urbanist',
    fontSize: 14, // Taille exacte
    color: '#616161', // Couleur exacte
  },
  signUpLinkText: {
    fontFamily: 'Urbanist',
    fontSize: 14, // Taille exacte
    fontWeight: '600', // Poids exact
    color: '#A4C73B', // Couleur exacte (figma green)
    marginLeft: 4,
  },
  socialContainer: {
    width: '100%',
    gap: 13,
    marginTop: 3,
    marginBottom: 2,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  socialButton: {
    flex: 1,
    height: 56,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
