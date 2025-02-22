import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function PlansLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarPosition: "top", // Move tabs to the top
                tabBarStyle: {
                    backgroundColor: "white",
                    elevation: 0, // Remove shadow on Android
                    borderBottomWidth: 1, // Add bottom border
                    borderBottomColor: "#ddd",
                    height: 80,
                },
            }}
        >
            {/* Mine Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "My Plans",
                    tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={24} color={color} />,
                }}
            />

            {/* Community Tab */}
            <Tabs.Screen
                name="community"
                options={{
                    title: "Community",
                    tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
                }}
            />

            {/* Company Tab */}
            <Tabs.Screen
                name="company"
                options={{
                    title: "Lift eat",
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="warehouse" size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}
