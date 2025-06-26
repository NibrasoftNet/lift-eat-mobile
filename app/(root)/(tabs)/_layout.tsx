import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Colors } from '@/utils/constants/Colors';
import { Icon } from '@/components/ui/icon';
import {
  ChartNoAxesCombined,
  Flame,
  MessageSquareText,
  Notebook,
  ScanQrCode,
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.background,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={ChartNoAxesCombined} className="w-8 h-8" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={ChartNoAxesCombined} className="w-8 h-8" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
