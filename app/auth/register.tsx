import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import logo from "../../assets/images/react-logo.png";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormControlError,
  FormControlLabel,
} from "../../components/ui/form-control";
import { VStack } from "@/components/ui/vstack";

export default function Register() {


  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data: { email: string; password: string }) => {
    Alert.alert("Form submitted", `Email: ${data.email}, Password: ${data.password}`);
  };

  return (
    <VStack>
      {/* <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.description}>
        Let’s sign in to your account and start your calorie management
      </Text> */}

      {/* <FormControl isInvalid={!!errors.email}>
        <FormControlLabel>Email</FormControlLabel>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          {...control.register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Please enter a valid email",
            },
          })}
        />
        {errors.email && <FormControlError></FormControlError>}
      </FormControl>

      <FormControl isInvalid={!!errors.password}>
        <FormControlLabel>Password</FormControlLabel>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          {...control.register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && <FormControlError></FormControlError>}
      </FormControl> */}

      {/* <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.signUp}>
          Don't have an account?{" "}
          <Text style={styles.signUpLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity> */}
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    color: "black",
    alignSelf: "flex-start",
  },
  description: {
    fontSize: 20,
    marginBottom: 40,
    alignSelf: "flex-start",
    color: "gray",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    color: "#000",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#38D1D3",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#a3d9db",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  signUp: {
    color: "#000",
  },
  signUpLink: {
    color: "#38D1D3",
  },
});

