import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

// Design system – atomic components
import TitleAndDescription from '@/components-new/ui/molecules/auth/TitleAndDescription';
import Input from '@/components-new/ui/atoms/inputs/Input';
import Button from '@/components-new/ui/atoms/inputs/Button';

// Icons (import direct depuis Figma SVG)
import { ArrowLeftRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
import { ShowRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ShowRegularBoldIcon';
import { HideRegularBoldIcon } from '@/assets/icons/figma/regular-bold/HideRegularBoldIcon';

// Validation schema
import {
  newPasswordSchema,
  NewPasswordFormData,
} from '@/utils/validation/auth/new-password-schema.validation';

// Toasts unifiés
import { useToast } from '@/components-new/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

export default function NewPasswordNew() {
  const theme = useAppTheme();
  const router = useRouter();
  const toast = useToast();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: NewPasswordFormData) => {
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
            description="Your password has been changed"
          />
        ),
      });
      router.back();
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

  const onSubmit = (data: NewPasswordFormData) => {
    mutateAsync(data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bouton retour */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeftRegularBoldIcon
            width={24}
            height={24}
            color={theme.color('primary')}
          />
        </TouchableOpacity>

        {/* En-tête */}
        <TitleAndDescription
          title="Change password"
          description="Update your account credentials"
        />

        {/* Formulaire */}
        <View style={styles.formContainer}>
          {/* Ancien mot de passe */}
          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Old password"
                placeholder="••••••••"
                secureTextEntry={!showOld}
                value={value}
                onChangeText={onChange}
                error={errors.oldPassword?.message}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                    {showOld ? (
                      <HideRegularBoldIcon
                        width={20}
                        height={20}
                        color={theme.color('blueGrey')}
                      />
                    ) : (
                      <ShowRegularBoldIcon
                        width={20}
                        height={20}
                        color={theme.color('blueGrey')}
                      />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          />

          {/* Nouveau mot de passe */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="New password"
                placeholder="••••••••"
                secureTextEntry={!showNew}
                value={value}
                onChangeText={onChange}
                error={errors.newPassword?.message}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                    {showNew ? (
                      <HideRegularBoldIcon
                        width={20}
                        height={20}
                        color={theme.color('blueGrey')}
                      />
                    ) : (
                      <ShowRegularBoldIcon
                        width={20}
                        height={20}
                        color={theme.color('blueGrey')}
                      />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          />

          {/* Confirmation */}
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirm password"
                placeholder="••••••••"
                secureTextEntry={!showConfirm}
                value={value}
                onChangeText={onChange}
                error={errors.confirmNewPassword?.message}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <HideRegularBoldIcon
                        width={20}
                        height={20}
                        color={theme.color('blueGrey')}
                      />
                    ) : (
                      <ShowRegularBoldIcon
                        width={20}
                        height={20}
                        color={theme.color('blueGrey')}
                      />
                    )}
                  </TouchableOpacity>
                }
              />
            )}
          />
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Button
            variant="ghost"
            size="lg"
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            size="lg"
            style={styles.updateButton}
            isLoading={isPending}
            onPress={handleSubmit(onSubmit)}
          >
            Update
          </Button>
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
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
  },
  updateButton: {
    flex: 1,
  },
});
