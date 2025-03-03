import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Colors } from '@/utils/constants/Colors';
import { Icon } from '@/components/ui/icon';
import {
  AlarmClockPlus,
  Atom,
  ChartNoAxesCombined,
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
        name="plans"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={Notebook} className="w-8 h-8" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="meals"
        options={{
          tabBarIcon: () => (
            <View
              style={{
                width: 65,
                height: 65,
                backgroundColor: Colors.light.background,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: -40,
                shadowColor: '#000',
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Icon as={Atom} className="w-8 h-8 text-white" />
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="scanner"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={ScanQrCode} className="w-8 h-8" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={AlarmClockPlus} className="w-8 h-8" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
