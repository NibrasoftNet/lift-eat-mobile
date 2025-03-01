import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Stack } from 'expo-router';
import MealsList from '@/components/meals/MealsList';
import { RecipeList } from '@/components/meals/RecipeList';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider } from 'native-base';

const TabButton = ({ title, count, isActive, onPress, icon }: { 
  title: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
  icon: React.ReactNode;
}) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      styles.tabButton,
      isActive && styles.activeTabButton
    ]}
  >
    <View style={styles.tabContent}>
      {icon}
      <Text style={[
        styles.tabText,
        isActive && styles.activeTabText
      ]}>
        {title}
      </Text>
    </View>
    <View style={styles.countBadge}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  </TouchableOpacity>
);

export default function MealsScreen() {
  const [activeTab, setActiveTab] = useState<'meals' | 'recipes'>('meals');

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Mes Repas',
            headerRight: () => (
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
            ),
          }}
        />

        <View style={styles.tabContainer}>
          <TabButton
            title="Repas"
            count={12}
            isActive={activeTab === 'meals'}
            onPress={() => setActiveTab('meals')}
            icon={<Ionicons name="restaurant" size={20} color={activeTab === 'meals' ? "#007AFF" : "#000"} />}
          />
          <TabButton
            title="Recettes"
            count={8}
            isActive={activeTab === 'recipes'}
            onPress={() => setActiveTab('recipes')}
            icon={<Ionicons name="book" size={20} color={activeTab === 'recipes' ? "#007AFF" : "#000"} />}
          />
        </View>

        {activeTab === 'meals' ? <MealsList /> : <RecipeList />}

        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.floatingButtonText}>
            {activeTab === 'meals' ? 'Nouveau Repas' : 'Nouvelle Recette'}
          </Text>
        </TouchableOpacity>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    marginRight: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#e6f2ff',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    color: '#007AFF',
  },
  countBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
