import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { AlertCircleIcon, ArrowLeftIcon } from '@/components/ui/icon';
import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForgetPasswordFormData,
  forgetPasswordSchema,
} from '@/utils/validation/auth/forget-schema.validation';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { useMutation } from '@tanstack/react-query';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useToast } from '@/components/ui/toast';

export default function ForgetPasswordModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: ForgetPasswordFormData) => {
      return Promise.resolve({
        status: 200,
        result: data,
      });
    },
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      const res = await mutateAsync(data);
      console.log('Reset result', res);
      setShowModal(false);
      router.push('/reset-password');
    } catch (error: any) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Error"
              description={error.toString()}
            />
          );
        },
      });
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent className="w-[90%]">
        <ModalHeader className="flex-col items-start gap-0.5">
          <Heading>Forgot password?</Heading>
          <Text size="sm">No worries, we’ll send you reset instructions</Text>
        </ModalHeader>
        <ModalBody className="mb-4">
          <FormControl isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input className="w-full">
                  <InputField
                    type="text"
                    placeholder="email"
                    value={value}
                    onChangeText={onChange}
                  />
                </Input>
              )}
            />
            {errors.email && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.email.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter className="flex-col items-start">
          <Button
            className="w-full h-12  justify-center items-center my-4"
            size="sm"
            onPress={handleSubmit(onSubmit)}
          >
            <ButtonText>Send</ButtonText>
          </Button>
          <Button
            variant="link"
            size="sm"
            onPress={() => {
              setShowModal(false);
            }}
            className="gap-1"
          >
            <ButtonIcon as={ArrowLeftIcon} />
            <ButtonText>Back to login</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
