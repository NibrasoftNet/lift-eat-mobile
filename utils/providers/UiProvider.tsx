import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

interface UIContextValue {
  screenHeight: number;
  screenWidth: number;
}

export const UIContext = React.createContext<UIContextValue | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { height, width } = Dimensions.get('window');

  return (
    <UIContext.Provider value={{ screenHeight: height, screenWidth: width }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}
      </GestureHandlerRootView>
    </UIContext.Provider>
  );
};