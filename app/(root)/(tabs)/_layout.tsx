import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/utils/constants/Colors';
import { useUserContext } from '@/utils/providers/UserContextProvider';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Import des icônes SVG Figma curved-light-border (format qui fonctionne bien avec les onglets)
import { HomeCurvedLightBorderIcon } from '@/assets/icons/figma/curved-light-border/HomeCurvedLightBorderIcon';
import { MessageCurvedLightBorderIcon } from '@/assets/icons/figma/curved-light-border/MessageCurvedLightBorderIcon';
import { ChartCurvedLightBorderIcon } from '@/assets/icons/figma/curved-light-border/ChartCurvedLightBorderIcon';
import { ActivityCurvedLightBorderIcon } from '@/assets/icons/figma/curved-light-border/ActivityCurvedLightBorderIcon';
import { DocumentCurvedLightBorderIcon } from '@/assets/icons/figma/curved-light-border/DocumentCurvedLightBorderIcon';

export default function TabLayout() {
  const { currentUser, refreshUser } = useUserContext();
  const { t } = useTranslation();
  const [userId, setUserId] = useState<number | null>(null);
  
  // Récupération de l'ID utilisateur au chargement - une seule fois
  useEffect(() => {
    // Utiliser une référence pour éviter des appels multiples
    let isInitialized = false;
    
    async function initializeUser() {
      // Si déjà initialisé, ne pas continuer
      if (isInitialized) return;
      isInitialized = true;
      
      try {
        // Récupérer l'ID utilisateur depuis AsyncStorage
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const storedUserId = await AsyncStorage.getItem('userId');
        
        // Récupérer également l'ID utilisateur depuis le session store comme alternative
        const useSessionStore = require('@/utils/store/sessionStore').default;
        const sessionUser = useSessionStore.getState().user;
        
        // Utiliser l'ID utilisateur stocké dans AsyncStorage, puis celui du session store
        const sessionUserId = storedUserId ? parseInt(storedUserId, 10) : (sessionUser?.id || 1);
        console.log('[DEBUG - TABS] ID utilisateur récupéré:', sessionUserId, 
          'Source:', storedUserId ? 'AsyncStorage' : (sessionUser?.id ? 'SessionStore' : 'Valeur par défaut'));
        
        if (sessionUserId && sessionUserId !== userId) {
          setUserId(sessionUserId);
          // Forcer le chargement des données utilisateur avec l'ID de la session
          await refreshUser(sessionUserId);
          console.log('Données utilisateur rafraîchies avec l\'ID de session:', sessionUserId);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des données utilisateur:', error);
      }
    }
    
    // Appeler la fonction async
    initializeUser();
    
    // Tableau de dépendances vide pour exécuter ce useEffect une seule fois au montage
  }, []);
  
  // helper to pop to tab root
  const createTabListener = () => ({ navigation, route }: any) => ({
    tabPress: () => {
      if (navigation.isFocused()) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: route.name }],
          }),
        );
      }
    },
  });

  return (
    <>
      <StatusBar style="auto" />
      
      <Tabs
        initialRouteName="meals"
        screenOptions={{
          tabBarActiveTintColor: Colors.primary.tabIconSelected,
          headerShown: false,
          tabBarStyle: {
            paddingTop: 5,
            paddingBottom: 5,
            height: 60,
          },
        }}
      >
        {/* Assistant Tab */}
        <Tabs.Screen
          name="assistant/index"
          options={{
            tabBarLabel: ({ focused, color }) => (
              <Text style={{ color, fontSize: 10, fontWeight: focused ? 'bold' : 'normal' }}>
                {t('tab.assistant')}
              </Text>
            ),
            tabBarIcon: ({ focused, color }) => (
              <MessageCurvedLightBorderIcon width={24} height={24} color={color} />
            ),
          }}
          listeners={createTabListener()}
        />
        
        {/* Plans Tab */}
        <Tabs.Screen
          name="plans"
          options={{
            tabBarLabel: ({ focused, color }) => (
              <Text style={{ color, fontSize: 10, fontWeight: focused ? 'bold' : 'normal' }}>
                {t('tab.plans')}
              </Text>
            ),
            tabBarIcon: ({ focused, color }) => (
              <DocumentCurvedLightBorderIcon width={24} height={24} color={color} />
            ),
          }}
          listeners={createTabListener()}
        />
        
        {/* Meals Tab */}
        <Tabs.Screen
          name="meals"
          options={{
            tabBarLabel: ({ focused, color }) => (
              <Text style={{ color, fontSize: 10, fontWeight: focused ? 'bold' : 'normal' }}>
                {t('tab.meals')}
              </Text>
            ),
            tabBarIcon: ({ focused, color }) => (
              <HomeCurvedLightBorderIcon width={24} height={24} color={color} />
            ),
          }}
          listeners={createTabListener()}
        />
        
        {/* Progress Tab */}
        <Tabs.Screen
          name="progress/index"
          options={{
            tabBarLabel: ({ focused, color }) => (
              <Text style={{ color, fontSize: 10, fontWeight: focused ? 'bold' : 'normal' }}>
                {t('tab.progress')}
              </Text>
            ),
            tabBarIcon: ({ focused, color }) => (
              <ActivityCurvedLightBorderIcon width={24} height={24} color={color} />
            ),
          }}
          listeners={createTabListener()}
        />
        
        {/* Analytics Tab */}
        <Tabs.Screen
          name="analytics/index"
          options={{
            tabBarLabel: ({ focused, color }) => (
              <Text style={{ color, fontSize: 10, fontWeight: focused ? 'bold' : 'normal' }}>
                {t('tab.analytics')}
              </Text>
            ),
            tabBarIcon: ({ focused, color }) => (
              <ChartCurvedLightBorderIcon width={24} height={24} color={color} />
            ),
          }}
          listeners={createTabListener()}
        />
      </Tabs>
    </>
  );
}
