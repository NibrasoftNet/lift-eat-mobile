import React from "react";
import { Image, ImageBackground } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import {app_logo, login_background} from "@/constants/images";
import { Card } from "@/components/ui/card";

export default function Login() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    console.log("Form Data:", data);
  };

  return (
    <ImageBackground
        source={login_background}
        className="size-full object-cover"
        blurRadius={5}
        >
        <VStack className="size-full p-4 items-center justify-center gap-4">
            <Image
                source={app_logo}
                className="h-48 w-48 object-contain mb-5 rounded-xl"
                style={{ alignSelf: "center" }}
            />
            <Card className="flex w-full bg-transparent items-center justify-center gap-4">
                <Text className="text-center text-4xl font-bold text-black">Login</Text>
                <Text className="text-center text-2xl font-semibold text-gray-600">Login to your account</Text>
            </Card>
            <Card className="w-full bg-transparent rounded-2xl border pb-6 gap-4">
              <FormControl isInvalid={!!errors.email}>
                <FormControlLabel>
                  <FormControlLabelText>Email</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: "Email is required", minLength: 6 }}
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
                      {errors.email.message || "At least 6 characters are required."}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormControlLabel>
                  <FormControlLabelText>Password</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Password is required", minLength: 6 }}
                  render={({ field: { onChange, value } }) => (
                      <Input className="w-full">
                      <InputField
                        type="password"
                        placeholder="password"
                        value={value}
                        onChangeText={onChange}
                      />
                    </Input>
                  )}
                />
                {errors.password && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      {errors.password.message || "At least 6 characters are required."}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </Card>
          <Button
            className="w-full h-12  justify-center items-center my-4"
            size="sm"
            onPress={handleSubmit(onSubmit)}
          >
            <ButtonText>Submit</ButtonText>
          </Button>

          <Text className="text-black">
            Don't have an account? <Text className="text-amber-500 text-lg font-semibold underline" onPress={() => router.push("./register")}>Sign Up</Text>
          </Text>
        </VStack>
    </ImageBackground>
  );
}