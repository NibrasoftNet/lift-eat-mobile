import { Tabs } from "expo-router";
import React from "react";
import {  View } from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const COLOR_PLUS = "#38D1D3";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLOR_PLUS,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          height: 70,
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
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favoris"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="plans"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: COLOR_PLUS,
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
              <MaterialIcons name="add" size={32} color="#fff" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="files"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <AntDesign name="filetext1" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
