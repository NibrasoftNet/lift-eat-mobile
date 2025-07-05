import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useToast, Toast, ToastDescription } from '@gluestack-ui/themed';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { CloseIcon } from '@/components/ui/icon';
import { forgetSchema } from '../../utils/validation/auth/forget-schema.validation';
import { ResetPasswordData } from '../../utils/interfaces/auth.interface';
import { useModalContext } from '../../utils/providers/ModalProvider';
import { forgetPasswordModalUIService } from '../../utils/services/ui/forget-password-modal-ui.service';
import { FormInput } from '../forms/FormInput';

export function ForgetPasswordModal() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onClose } = useModalContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(forgetSchema),
    defaultValues: forgetPasswordModalUIService.getDefaultValues(),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const result = await forgetPasswordModalUIService.submitForm(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id}>
            <ToastDescription>Email envoyé avec succès</ToastDescription>
          </Toast>
        ),
      });
      forgetPasswordModalUIService.handleSuccessNavigation(router, onClose);
    },
    onError: (error) => {
      forgetPasswordModalUIService.handleError(error, toast);
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    await mutateAsync(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading className="text-xl">Mot de passe oublié</Heading>
          <ModalCloseButton>
            <CloseIcon />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text>
            Entrez votre email pour recevoir les instructions de
            réinitialisation
          </Text>
          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="Entrez votre email"
            error={errors.email?.message}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-transparent border border-gray-300 mr-3"
            onPress={() => {
              reset();
              onClose();
            }}
          >
            <ButtonText>Annuler</ButtonText>
          </Button>
          <Button
            className="bg-primary-500"
            onPress={handleSubmit(onSubmit)}
            isDisabled={isPending}
          >
            <ButtonText>Envoyer</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
