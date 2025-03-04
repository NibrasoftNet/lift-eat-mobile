import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

export default function ScannerLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarPosition: "top",
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderBottomWidth: 1,
                        borderBottomColor: "#E5E5E5",
                        height: 50,
                        paddingTop: 5,
                        paddingBottom: 5,
                    },
                    tabBarItemStyle: {
                        paddingTop: 5,
                        paddingBottom: 5,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "600",
                        marginTop: 5,
                    },
                    tabBarActiveTintColor: "#007AFF",
                    tabBarInactiveTintColor: "#8E8E93",
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Scan",
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="barcode-scan" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        title: "Search",
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="search" size={24} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
