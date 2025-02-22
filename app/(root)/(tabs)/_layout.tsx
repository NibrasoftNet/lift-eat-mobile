import { Tabs } from "expo-router";
import React from "react";
import {  View } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.background,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 50,
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="analytics" size={32} color={color} />          ),
        }}
      />

      <Tabs.Screen
        name="plans"
        options={{
            tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="meals"
        options={{
          title: "",
          tabBarIcon: () => (
              <View
                  style={{
                      width: 65,
                      height: 65,
                      backgroundColor: Colors.light.background,
                      borderRadius: 35,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: -40,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 5,
                  }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: Colors.primary.background,
                    borderRadius: 35,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Ionicons name="hardware-chip-outline" size={32} color="#fff" />
                </View>
              </View>
          ),
        }}
      />

      <Tabs.Screen
        name="scanner"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="qrcode" size={32} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favoris"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stopwatch-outline" size={32} color={color} />),
        }}
      />
    </Tabs>
  );
}
