import { Text, Image, View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import logo from "../../assets/images/react-logo.png";
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
import React from "react";

export default function Login() {
  const [isInvalidPassword, setIsInvalidPassword] = React.useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = React.useState(false);
  const [passwordValue, setPasswordValue] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const handleSubmit = () => {
    if (passwordValue.length < 6) {
      setIsInvalidPassword(true);
    } else {
      setIsInvalidPassword(false);
    }
    if (emailValue.length < 6) {
      setIsInvalidEmail(true);
    } else {
      setIsInvalidEmail(false);
    }
  };

  return (
    <VStack className="w-full p-4">
      <Image
        source={logo}
        className="h-50 w-50 object-contain mb-5"
        style={{ alignSelf: "center" }}
      />
      <Text className="text-4xl mb-10 text-black self-start">Login</Text>
      <Text className="text-2xl mb-10 text-gray-600 self-start">
        Let’s sign up to your account and start your calorie management
      </Text>
      <FormControl isInvalid={isInvalidEmail}>
        <FormControlLabel>
          <FormControlLabelText>Email</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            type="text"
            placeholder="email"
            value={emailValue}
            onChangeText={(text) => setEmailValue(text)}
          />
        </Input>

        {isInvalidEmail && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              At least 6 characters are required.
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={isInvalidPassword}>
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1 w-full">
          <InputField
            type="password"
            placeholder="password"
            value={passwordValue}
            onChangeText={(text) => setPasswordValue(text)}
          />
        </Input>

        {isInvalidPassword && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              At least 6 characters are required.
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <Button
        className="w-full h-12 bg-teal-400 rounded-3xl justify-center items-center mb-5 mt-4"
        size="sm"
        onPress={handleSubmit}
      >
        <ButtonText>Submit</ButtonText>
      </Button>

      <Text className="text-black">
        Don't have an account? <Text className="text-teal-400">Sign Up</Text>
      </Text>
    </VStack>
  );
}
