import React from "react";
import { Text, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import logo from "../../../assets/images/react-logo.png";
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
export default function Register() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("Form Data:", data);
  };

  return (
    <VStack className="w-full p-4">
      <Image
        source={logo}
        className="h-50 w-50 object-contain mb-5"
        style={{ alignSelf: "center" }}
      />
      <Text className="text-4xl mb-10 text-black self-start">Register</Text>
      <Text className="text-2xl mb-10 text-gray-600 self-start">
        Create your account and start managing your calories
      </Text>

      {/* Name Field */}
      <FormControl isInvalid={!!errors.name}>
        <FormControlLabel>
          <FormControlLabelText>Name</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required", minLength: 3 }}
          render={({ field: { onChange, value } }) => (
            <Input className="my-1">
              <InputField
                type="text"
                placeholder="Name"
                value={value}
                onChangeText={onChange}
              />
            </Input>
          )}
        />
        {errors.name && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              {errors.name.message || "At least 3 characters are required."}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Email Field */}
      <FormControl isInvalid={!!errors.email}>
        <FormControlLabel>
          <FormControlLabelText>Email</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required", minLength: 6 }}
          render={({ field: { onChange, value } }) => (
            <Input className="my-1">
              <InputField
                type="text"
                placeholder="Email"
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

      {/* Password Field */}
      <FormControl isInvalid={!!errors.password}>
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required", minLength: 6 }}
          render={({ field: { onChange, value } }) => (
            <Input className="my-1">
              <InputField
                type="password"
                placeholder="Password"
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

      {/* Submit Button */}
      <Button
        className="w-full h-12 bg-teal-400 rounded-3xl justify-center items-center mb-5 mt-4"
        size="sm"
        onPress={handleSubmit(onSubmit)}
      >
        <ButtonText>Register</ButtonText>
      </Button>

      <Text className="text-black">
        Already have an account?{" "}
        <Text className="text-teal-400" onPress={() => router.push("./login")}>
          Login
        </Text>
      </Text>
    </VStack>
  );
}
