import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import logo from "../../assets/images/react-logo.png";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as yup from "yup";
import {useRouter} from "expo-router";

export default function Login() {
  const router = useRouter()
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });

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
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: 50,
      backgroundColor: "#f1f1f1",
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: "100%",
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
    errorText: {
      color: "red",
      alignSelf: "flex-start",
      marginBottom: 10,
      marginTop: -20,
      fontSize: 12,
    },
  });
  const submit = (values: { email: any; password: any }) => {
    Alert.alert(
      "Form submitted",
      `Email: ${values.email}, Password: ${values.password}`
    );
  };

  const handlePress = () => {
    console.log("button pressed");
  };
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.description}>
        Let’s sign in to your account and start your calorie management
      </Text>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email: "", password: "" }}
        onSubmit={submit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
            </View>
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
            </View>
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              disabled={!isValid}
              onPress={handlePress}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('./register')}
            >
              <Text style={styles.signUp}>
                Don't have an account?{" "}
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}
