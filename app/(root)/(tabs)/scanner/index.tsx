import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const tabs = [
  { id: 1, title: "Scanner", route: "/scanner" },
  { id: 2, title: "Foods", route: "/scanner/Foods" },
  { id: 3, title: "Meals", route: "/plans" },
];

export default function Scanner() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabPress = (tabId: number, route: string) => {
    setActiveTab(tabId);
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <VStack space="md" className="flex-1 bg-white">
      {/* Top Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => handleTabPress(tab.id, tab.route)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <VStack space="lg" className="flex-1 px-4">
        <Heading className="text-typography-900">Scanner Content</Heading>
        <Text>Scan your plants or QR codes here</Text>
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 8,
    marginTop: 50,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary.background,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
});
