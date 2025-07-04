import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

// Design system – atomic components
import TitleAndDescription from '@/components-new/ui/molecules/auth/TitleAndDescription';
import Text from '@/components-new/ui/atoms/base/Text';
import Input from '@/components-new/ui/atoms/inputs/Input';

// Icons (import direct depuis Figma SVG)
import { ArrowLeftRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
import { ShowRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ShowRegularBoldIcon';
import { HideRegularBoldIcon } from '@/assets/icons/figma/regular-bold/HideRegularBoldIcon';
import { LockRegularTwotoneIcon } from '@/assets/icons/figma/regular-two-tone/LockRegularTwotoneIcon';

// Validation schema (on réutilise celui de "new-password" sans l'ancien mot de passe)
import { passwordSchema } from '@/utils/validation/auth/password-schema.validation';

// Toasts unifiés
import { useToast } from '@/components-new/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

// Schéma dédié à la réinitialisation (pas d'ancien mot de passe)
const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordNew() {
  const theme = useAppTheme();
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      // TODO: intégrer l'appel API réel
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={id as string}
            color={ToastTypeEnum.SUCCESS}
            title="Password updated"
            description="You can now sign in with your new password"
          />
        ),
      });
      router.replace('/loginNew');
    },
    onError: (error: Error) => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={id as string}
            color={ToastTypeEnum.ERROR}
            title="Error"
            description={error.message}
          />
        ),
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutateAsync(data);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftRegularBoldIcon
            width={24}
            height={24}
            color={theme.color('primary')}
          />
        </TouchableOpacity>

        {/* En-tête */}
        <TitleAndDescription
          title="Reset password"
          description="Create a strong password for your account"
        />

        {/* Formulaire */}
        <View style={styles.formContainer}>
          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="filledLight"
                  placeholder="Enter your password"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  error={errors.newPassword?.message}
                  width="100%"
                  px={20}
                  py={10}
                  rounded={10}
                  leftIcon={<LockRegularTwotoneIcon size={20} color="#81A540" />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
            {errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword.message}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="filledLight"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!showConfirm}
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmNewPassword?.message}
                  width="100%"
                  px={20}
                  py={10}
                  rounded={10}
                  leftIcon={<LockRegularTwotoneIcon size={20} color="#81A540" />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? (
                        <HideRegularBoldIcon size={20} color="#3F51B2" />
                      ) : (
                        <ShowRegularBoldIcon size={20} color="#3F51B2" />
                      )}
                    </TouchableOpacity>
                  }
                />
              )}
            />
            {errors.confirmNewPassword && (
              <Text style={styles.errorText}>{errors.confirmNewPassword.message}</Text>
            )}
          </View>
        </View>

        {/* Bouton mise à jour */}
        <TouchableOpacity
          style={[styles.updateButton, isPending && styles.updateButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          <Text style={styles.updateButtonText}>Update Password</Text>
        </TouchableOpacity>

        {/* Lien connexion */}
        <View style={styles.loginLinkContainer}>
          <Text variant="caption" color={theme.color('blueGrey')}>
            Back to
          </Text>
          <TouchableOpacity onPress={() => router.replace('/loginNew')}> 
            <Text variant="caption" semibold color={theme.color('successLighter')} style={{ marginLeft: 4 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  formContainer: {
    gap: 24,
    marginTop: 32,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  errorText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    color: '#FF5726',
    marginTop: 4,
  },
  updateButton: {
    height: 56,
    borderRadius: 1000,
    backgroundColor: '#81A540',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  updateButtonDisabled: {
    backgroundColor: '#DADADA',
  },
  updateButtonText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  loginLinkContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
