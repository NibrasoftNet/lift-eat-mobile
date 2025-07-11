/**
 * Register - Écran d'inscription selon design Figma
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=40432-39018
 *
 * Intégration avec Clerk pour l'authentification et Convex pour le stockage
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, Link } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

// Intégration avec Clerk pour l'authentification
import { useSignUp } from '@clerk/clerk-expo';

// Services de logging et services utilisateur
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { authPagesService } from '@/utils/services/pages/auth-pages.service';

// Composants UI
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import TitleAndDescription from '@/components-new/ui/molecules/auth/TitleAndDescription';
import { SocialLoginGroup } from '@/components-new/ui/molecules/auth/SocialLoginGroup';
import ContinueWithDivider from '@/components-new/ui/molecules/auth/ContinueWithDivider';
import Text from '@/components-new/ui/atoms/base/Text';
import Input from '@/components-new/ui/atoms/inputs/Input';
import Checkbox from '@/components-new/ui/atoms/inputs/Checkbox';

// Validation et API
import {
  RegisterFormData,
  registerSchema,
} from '@/utils/validation/auth/register-schema.validation';
import { z } from 'zod';
import { useToast } from '@/components-new/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

// Intégration avec Convex pour le stockage
import { useMutation as useConvexMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Type any pour contourner les erreurs de typage avec anyApi
// La référence exacte à la fonction est gérée à l'exécution

// Icônes nécessaires
import { ShowRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ShowRegularBoldIcon';
import { HideRegularBoldIcon } from '@/assets/icons/figma/regular-bold/HideRegularBoldIcon';
import { ArrowLeftRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
import { LockRegularTwotoneIcon } from '../../../assets/icons/figma/regular-two-tone/LockRegularTwotoneIcon';
import { MessageRegularTwotoneIcon } from '../../../assets/icons/figma/regular-two-tone/MessageRegularTwotoneIcon';

import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/clerk-expo';
import { OnboardingService } from '../../../utils/services/core/onboarding.service';
import useSessionStore from '../../../utils/store/sessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '@/utils/providers/UserContextProvider';

export default function Register() {
  const theme = useAppTheme();
  const router = useRouter();
  const toast = useToast();
  const { setUser } = useSessionStore();
  const { setCurrentUser } = useUserContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  // Hooks Clerk pour l'inscription
  const { isLoaded, signUp, setActive } = useSignUp();

  // Utilisation directe de l'API Convex pour créer un utilisateur
  // anyApi est utilisé par Convex, nous devons utiliser l'approche dynamique
  const createUser = useConvexMutation('users:createUser' as any);

  // Vérifier que l'utilisateur n'est pas déjà inscrit
  useEffect(() => {
    if (isLoaded && signUp.status === 'complete') {
      // Si l'inscription est déjà complète, rediriger vers l'accueil
      router.replace('/');
    }
  }, [isLoaded, signUp, router]);

  // Formulaire avec validations
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      // Valeur par défaut pour le champ name maintenant optionnel
      name: undefined,
    },
  });

  // Importer le service utilisateur pour la création dans SQLite
  const userService = authPagesService;

  // Mutation pour l'inscription
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      if (!isLoaded || !signUp) {
        throw new Error("Le service d'authentification n'est pas disponible");
      }

      if (!agreeToTerms) {
        throw new Error("Vous devez accepter les conditions d'utilisation");
      }

      try {
        console.log(
          "[DEBUG - REGISTER] Tentative d'inscription avec email:",
          data.email,
        );
        logger.info(LogCategory.AUTH, 'Tentative inscription', {
          email: data.email,
        });

        // PHASE 1: Création du compte utilisateur dans Clerk
        // ---------------------------------------------------
        // Clerk gère l'authentification, et nous ne créons pas l'utilisateur
        // dans SQLite ici - cela sera fait APRES la vérification du code OTP
        // dans verification.tsx

        // Initialiser le processus d'inscription avec Clerk
        const signUpAttempt = await signUp.create({
          emailAddress: data.email,
          password: data.password,
        });

        console.log(
          "[DEBUG - REGISTER] Processus d'inscription initié dans Clerk:",
          signUpAttempt.status,
        );
        logger.info(
          LogCategory.AUTH,
          "Processus d'inscription initié dans Clerk",
          {
            email: data.email,
            status: signUpAttempt.status,
          },
        );

        // Préparer la vérification de l'email
        console.log(
          "[DEBUG - REGISTER] Préparation de l'envoi du code de vérification pour:",
          data.email,
        );
        logger.info(LogCategory.AUTH, `Préparation OTP pour ${data.email}`);

        try {
          // Envoyer un code de vérification à l'utilisateur par email
          await signUp.prepareEmailAddressVerification({
            strategy: 'email_code',
          });
          console.log(
            '[DEBUG - REGISTER] Code de vérification envoyé avec succès!',
          );
          logger.info(
            LogCategory.AUTH,
            `OTP envoyé avec succès pour ${data.email}`,
          );
        } catch (prepareError) {
          console.error(
            "[DEBUG - REGISTER] Erreur lors de l'envoi du code de vérification:",
            prepareError,
          );
          logger.error(LogCategory.AUTH, 'Erreur envoi OTP', {
            email: data.email,
            error:
              prepareError instanceof Error
                ? prepareError.message
                : String(prepareError),
          });
          throw new Error(
            "Impossible d'envoyer le code de vérification: " +
              (prepareError instanceof Error
                ? prepareError.message
                : 'Erreur inconnue'),
          );
        }

        // IMPORTANT: Nous retournons uniquement les informations de base
        // L'utilisateur n'est PAS encore créé dans Clerk, cela se produira
        // après la vérification du code OTP
        // La création dans SQLite sera également faite à ce moment-là
        return {
          success: true,
          email: data.email,
          name: data.name || data.email.split('@')[0],
          // Note: à ce stade, nous n'avons pas d'ID utilisateur - il sera généré
          // après la vérification OTP
        };
      } catch (error: any) {
        console.error(
          "[DEBUG - REGISTER] Erreur lors de l'inscription:",
          error,
        );
        logger.error(LogCategory.AUTH, 'Échec inscription', {
          error: error.message || 'Erreur inconnue',
          email: data.email,
        });
        throw new Error(error.message || "Erreur lors de l'inscription");
      }
    },
    onSuccess: (result) => {
      console.log(
        "[DEBUG - REGISTER:onSuccess] Processus d'inscription initié:",
        result,
      );

      // Afficher un toast de succès
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={id as string}
            color={ToastTypeEnum.SUCCESS}
            title="Vérification requise"
            description="Un code de vérification a été envoyé à votre adresse email."
          />
        ),
      });

      // IMPORTANT: À ce stade, nous n'avons pas encore d'ID utilisateur
      // L'utilisateur n'est pas encore créé dans Clerk (il sera créé après vérification)
      // et donc pas encore dans SQLite non plus

      // Log pour debug
      logger.info(
        LogCategory.AUTH,
        'Redirection vers la page de vérification',
        {
          email: result.email,
          name: result.name,
        },
      );

      // Rediriger vers la page de vérification par email
      router.replace('/verification');
    },
    onError: (error: Error) => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={id as string}
            color={ToastTypeEnum.ERROR}
            title="Erreur"
            description={error.message || "Une erreur s'est produite"}
          />
        ),
      });
    },
  });

  // Fonction de soumission du formulaire
  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  // Clerk SSO hook
  const { startSSOFlow } = useSSO();

  /**
   * Lance un flux SSO (Google / Apple / Facebook)
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
        // Création ou récupération de l'utilisateur côté SQLite et persistance
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
    } catch (error) {
      console.error('Erreur SSO', error);
    }
  };

  // Handlers pour SocialLoginGroup
  const handleGoogleSignIn = () => signInWithSSO('oauth_google');
  const handleAppleSignIn = () => signInWithSSO('oauth_apple');
  const handleFacebookSignIn = () => signInWithSSO('oauth_facebook');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Bouton retour */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeftRegularBoldIcon width={24} height={24} color="#000" />
          </TouchableOpacity>

          {/* En-tête avec titre et description */}
          <TitleAndDescription
            title="Join Nutrio Today ✨"
            description="Create a Nutrio account to track your meals, stay active, and achieve your health goals."
          />

          {/* Formulaire d'inscription */}
          <View style={styles.formContainer}>
            {/* Champ Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    variant="filledLight"
                    placeholder="Enter your email"
                    placeholderTextColor="#9E9E9E"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    width="100%"
                    px={20}
                    py={10}
                    rounded={10}
                    leftIcon={
                      <MessageRegularTwotoneIcon size={20} color="#81A540" />
                    }
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    variant="filledLight"
                    placeholder="Enter your password"
                    placeholderTextColor="#9E9E9E"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    width="100%"
                    px={20}
                    py={10}
                    rounded={10}
                    leftIcon={
                      <LockRegularTwotoneIcon size={20} color="#81A540" />
                    }
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <HideRegularBoldIcon size={20} color="#3F51B2" />
                        ) : (
                          <ShowRegularBoldIcon size={20} color="#3F51B2" />
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

            {/* Conditions d'utilisation */}
            <View style={styles.termsContainer}>
              <Checkbox
                checked={agreeToTerms}
                onChange={(checked) => setAgreeToTerms(checked)}
              />
              <Text style={styles.termsText}>
                I agree to Nutrio{' '}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </View>
          </View>

          {/* Lien de connexion */}
          <View style={styles.signInContainer}>
            <Text style={styles.normalText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/loginNew')}>
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>

          {/* Section alternative */}
          <View style={styles.alternativeSection}>
            <ContinueWithDivider text="or continue with" />

            {/* Boutons sociaux */}
            <SocialLoginGroup
              onGooglePress={handleGoogleSignIn}
              onApplePress={handleAppleSignIn}
              showFacebook={true}
              onFacebookPress={handleFacebookSignIn}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bouton Sign up (fixed en bas) */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.7}
          disabled={isPending}
        >
          <Text style={styles.buttonText}>
            {isPending ? 'Signing up...' : 'Sign up'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Espace pour le bouton fixe en bas
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
    width: '100%',
    maxWidth: 430,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  formContainer: {
    gap: 24,
    marginTop: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 16,
    color: '#212121',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Urbanist',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  termsText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    color: '#212121',
    marginLeft: 8,
  },
  termsLink: {
    color: '#81A540',
    fontWeight: '600',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  signUpButton: {
    backgroundColor: '#81A540', // Couleur exacte du Figma
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  alternativeSection: {
    gap: 24,
    marginTop: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  normalText: {
    fontFamily: 'Urbanist',
    fontWeight: '400',
    fontSize: 16,
    color: '#616161',
  },
  linkText: {
    fontFamily: 'Urbanist',
    fontWeight: '600',
    fontSize: 16,
    color: '#81A540',
  },
});
