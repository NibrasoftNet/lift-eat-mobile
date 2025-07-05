/**
 * Verification - Écran de vérification du code envoyé par email
 * Permet de valider l'inscription via un code reçu par email
 * Intégration avec Clerk pour l'authentification
 */

import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { UserContext, User } from '@/utils/providers/UserContextProvider';
import { authRegistrationService } from '@/utils/services/pages/auth-registration.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Composants UI
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import TitleAndDescription from '@/components-new/ui/molecules/auth/TitleAndDescription';
import Text from '@/components-new/ui/atoms/base/Text';
import { useToast } from '@/components-new/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

// Icônes nécessaires
import { ArrowLeftRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';

export default function Verification() {
  const theme = useAppTheme();
  const router = useRouter();
  const toast = useToast();
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Récupérer le contexte utilisateur pour le mettre à jour
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(
      'UserContext doit être utilisé dans un UserContextProvider',
    );
  }
  const { setCurrentUser } = userContext;

  // Clerk hooks pour la vérification
  const { isLoaded, signUp, setActive } = useSignUp();

  // Fonction pour gérer la soumission du code
  const handleVerify = async () => {
    if (!isLoaded) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur"
              description="Le service d'authentification n'est pas disponible"
            />
          );
        },
      });
      return;
    }

    if (!verificationCode || verificationCode.length < 6) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur"
              description="Veuillez entrer un code de vérification valide"
            />
          );
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        '[DEBUG - VERIFICATION] Tentative de vérification avec code:',
        verificationCode,
      );
      console.log('[DEBUG - VERIFICATION] État actuel de signUp:', {
        status: signUp.status,
        emailAddress: signUp.emailAddress,
        createdUserId: signUp.createdUserId,
      });

      // Vérifier le code avec Clerk
      console.log(
        '[DEBUG - VERIFICATION] Appel de attemptEmailAddressVerification',
      );
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log('[DEBUG - VERIFICATION] Résultat de verification:', {
        status: completeSignUp.status,
        createdSessionId: completeSignUp.createdSessionId || 'non disponible',
      });

      if (completeSignUp.status !== 'complete') {
        // La vérification a échoué
        throw new Error(
          'Échec de la vérification. Veuillez réessayer avec un code valide.',
        );
      }

      // 1. Après la vérification réussie, vérifier si nous avons l'ID Clerk
      const clerkUserId = signUp.createdUserId;
      if (!clerkUserId) {
        throw new Error(
          'ID utilisateur Clerk non disponible après vérification',
        );
      }

      // 2. Activer la session pour l'utilisateur authentifié
      try {
        await setActive({ session: completeSignUp.createdSessionId });
        logger.info(LogCategory.AUTH, "Session activée pour l'utilisateur", {
          clerkId: clerkUserId,
          email: signUp.emailAddress,
        });
      } catch (error) {
        console.warn("Erreur lors de l'activation de la session:", error);
        logger.warn(LogCategory.AUTH, 'Erreur activation session', {
          error: error instanceof Error ? error.message : String(error),
        });
        // Continuer le processus même si l'activation échoue
      }

      // 3. Utiliser le service d'inscription pour finaliser le processus
      // IMPORTANT: C'est ICI que nous synchronisons avec SQLite, après que le code OTP est confirmé
      const registrationResult =
        await authRegistrationService.finalizeRegistration(
          clerkUserId,
          signUp.emailAddress || '',
          '', // Le nom sera généré à partir de l'email par le service
        );

      // Vérifier le résultat de l'inscription
      if (!registrationResult.success || !registrationResult.userId) {
        // Log détaillé pour débogage
        console.error(
          '[DEBUG - VERIFICATION] Échec finalisation inscription:',
          registrationResult,
        );
        logger.error(LogCategory.AUTH, 'Échec finalisation inscription', {
          error: registrationResult.error,
          result: JSON.stringify(registrationResult),
          clerkId: clerkUserId,
        });

        // Afficher une alerte mais continuer (l'utilisateur est authentifié dans Clerk)
        toast.show({
          placement: 'top',
          render: ({ id }) => {
            const toastId = 'toast-' + id;
            return (
              <MultiPurposeToast
                id={toastId}
                color={ToastTypeEnum.INFOS}
                title="Attention"
                description="Votre compte a été vérifié, mais certaines données n'ont pas pu être enregistrées."
              />
            );
          },
        });
      } else {
        // SUCCÈS : Mettre à jour le contexte utilisateur avec l'ID SQLite valide
        console.log('[DEBUG - VERIFICATION] Utilisateur créé avec succès:', {
          sqliteId: registrationResult.userId,
          clerkId: clerkUserId,
        });

        setCurrentUser({
          id: registrationResult.userId,
          name: registrationResult.name || '',
          email: registrationResult.email || '',
          clerkId: registrationResult.clerkId, // Ajouter le clerkId au contexte utilisateur
        });

        // Persister l'ID dans AsyncStorage pour les futures sessions
        try {
          // 1. Sauvegarder dans AsyncStorage
          await AsyncStorage.setItem(
            'userId',
            String(registrationResult.userId),
          );
          console.log(
            '[DEBUG - VERIFICATION] ID utilisateur sauvegardé dans AsyncStorage:',
            registrationResult.userId,
          );

          // 2. Mettre à jour le SessionStore Zustand (CRUCIAL pour synchroniser toutes les sources d'état)
          try {
            // Importer useSessionStore si ce n'est pas déjà fait
            const useSessionStore =
              require('@/utils/store/sessionStore').default;

            // Mettre à jour le user dans le store de session avec le nouvel ID
            useSessionStore.setState({
              user: {
                id: registrationResult.userId,
                email: registrationResult.email || '',
              },
            });

            console.log(
              '[DEBUG - VERIFICATION] Session store (Zustand) mis à jour avec ID utilisateur:',
              registrationResult.userId,
            );
          } catch (sessionError) {
            console.error(
              '[DEBUG - VERIFICATION] Erreur lors de la mise à jour du session store:',
              sessionError,
            );
            // Ne pas interrompre le flux même si la mise à jour du store échoue
          }

          logger.info(
            LogCategory.AUTH,
            'ID utilisateur sauvegardé dans AsyncStorage',
            {
              userId: registrationResult.userId,
            },
          );
        } catch (error) {
          console.error(
            "[DEBUG - VERIFICATION] Erreur lors de la sauvegarde de l'ID utilisateur:",
            error,
          );
          logger.error(LogCategory.AUTH, 'Erreur sauvegarde ID utilisateur', {
            error: error instanceof Error ? error.message : String(error),
          });
          // Continuer malgré l'erreur de stockage
        }

        // Afficher un message de succès
        toast.show({
          placement: 'top',
          render: ({ id }) => {
            const toastId = 'toast-' + id;
            return (
              <MultiPurposeToast
                id={toastId}
                color={ToastTypeEnum.SUCCESS}
                title="Vérification réussie"
                description="Votre compte a été vérifié avec succès!"
              />
            );
          },
        });
      }

      // Rediriger vers le processus d'onboarding
      setTimeout(() => router.replace('/onboarding/onboarding-step1'), 1500);
    } catch (error: any) {
      // Afficher l'erreur
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur"
              description={
                error.message ||
                'Une erreur est survenue lors de la vérification'
              }
            />
          );
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour renvoyer un nouveau code
  const handleResendCode = async () => {
    if (!isLoaded) {
      console.log('[DEBUG - RESEND] Service Clerk non chargé');
      return;
    }

    console.log('[DEBUG - RESEND] Tentative de renvoi du code OTP');
    console.log('[DEBUG - RESEND] État actuel de signUp:', {
      status: signUp.status,
      emailAddress: signUp.emailAddress,
      createdUserId: signUp.createdUserId,
    });

    try {
      // Préparer une nouvelle vérification d'email
      console.log('[DEBUG - RESEND] Appel de prepareEmailAddressVerification');
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      console.log('[DEBUG - RESEND] Nouveau code OTP envoyé avec succès');

      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Code envoyé"
              description="Un nouveau code a été envoyé à votre adresse email"
            />
          );
        },
      });
    } catch (error: any) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur"
              description={
                error.message || "Impossible d'envoyer un nouveau code"
              }
            />
          );
        },
      });
    }
  };

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
            title="Verification Code"
            description="Please enter the verification code sent to your email address to complete your registration."
          />

          {/* Champ de code de vérification */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Verification Code</Text>

            {/* Nouveau composant OTP avec cases individuelles */}
            <View style={styles.otpContainer}>
              {/* Génération de 6 cases pour le code OTP */}
              {Array(6)
                .fill(0)
                .map((_, index) => {
                  // Récupérer le chiffre à cette position (s'il existe)
                  const digit = verificationCode[index] || '';
                  // Déterminer si cette case est active (la dernière avec une valeur ou la prochaine vide)
                  const isActive = index === verificationCode.length;
                  // Déterminer si cette case a une valeur
                  const hasValue = index < verificationCode.length;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.otpDigitContainer,
                        isActive && styles.otpDigitContainerActive,
                        hasValue && styles.otpDigitContainerFilled,
                      ]}
                      // Focus sur le TextInput quand on touche une case
                      onPress={() => {
                        // Le TextInput invisible pourrait être référencé ici pour un focus
                      }}
                    >
                      <Text style={styles.otpDigitText}>{digit}</Text>
                    </TouchableOpacity>
                  );
                })}
            </View>

            {/* Input invisible qui gère le clavier et la saisie */}
            <TextInput
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={6}
              value={verificationCode}
              onChangeText={setVerificationCode}
              autoFocus
            />

            {/* Lien pour renvoyer le code */}
            <View style={styles.resendContainer}>
              <Text style={styles.normalText}>Didn't receive a code? </Text>
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.linkText}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bouton Verify (fixed en bas) */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Verifying...' : 'Verify'}
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
    width: '100%',
    gap: 24,
    marginTop: 8,
  },
  inputLabel: {
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  // Styles pour le nouveau composant OTP
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Espacement égal entre les éléments
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  otpDigitContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5, // Forme circulaire
    backgroundColor: '#F5F5F5', // Fond gris par défaut
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigitContainerActive: {
    backgroundColor: 'transparent', // Fond transparent pour la case active
    borderColor: '#81A540', // Couleur verte du thème Lift
    borderWidth: 2,
    borderRadius: 8, // Forme rectangulaire avec coins arrondis
  },
  otpDigitContainerFilled: {
    backgroundColor: '#FFFFFF', // Fond blanc pour les cases remplies
    borderRadius: 22.5, // Maintenir la forme circulaire
    // Ombre légère pour donner du relief
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  otpDigitText: {
    fontSize: 20,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#212121',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: '100%',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  normalText: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 14,
    color: '#616161',
  },
  linkText: {
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 14,
    color: '#81A540',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  verifyButton: {
    backgroundColor: '#81A540',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Urbanist_700Bold',
    fontSize: 16,
    color: 'white',
  },
});
