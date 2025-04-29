import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  useToast,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Text,
  Button,
  ButtonText,
  CloseIcon,
  Toast,
  ToastDescription,
} from "@gluestack-ui/themed";
import { forgetSchema } from "../../utils/validation/auth/forget-schema.validation";
import { ResetPasswordData } from "../../utils/interfaces/auth.interface";
import { useModalContext } from "../../utils/providers/ModalProvider";
import { forgetPasswordModalService } from "../../utils/services/ui/ui-forget-password-modal.service";
import { FormInput } from "../forms/FormInput";

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
    defaultValues: forgetPasswordModalService.getDefaultValues(),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const result = await forgetPasswordModalService.submitForm(data);
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
      forgetPasswordModalService.handleSuccessNavigation(router, onClose);
    },
    onError: (error) => {
      forgetPasswordModalService.handleError(error, toast);
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
          <Heading size="lg">Mot de passe oublié</Heading>
          <ModalCloseButton>
            <CloseIcon />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text>
            Entrez votre email pour recevoir les instructions de réinitialisation
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
            variant="outline"
            action="secondary"
            mr="$3"
            onPress={() => {
              reset();
              onClose();
            }}
          >
            <ButtonText>Annuler</ButtonText>
          </Button>
          <Button
            action="primary"
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
