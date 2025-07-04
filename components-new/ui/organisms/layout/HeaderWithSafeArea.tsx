import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBar } from '../navigation';
import { IconProps } from '../../molecules/menu/MenuItem';

interface HeaderWithSafeAreaProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.FC<IconProps>;
  onRightIconPress?: () => void;
  darkMode?: boolean;
}

/**
 * HeaderWithSafeArea component
 * 
 * Composant qui encapsule HeaderBar avec une gestion automatique de la SafeArea.
 * Assure la compatibilité avec tous les dispositifs, y compris ceux avec encoche.
 * 
 * Reproduction fidèle du design Figma sans modification personnelle.
 */
const HeaderWithSafeArea: React.FC<HeaderWithSafeAreaProps> = (props) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HeaderBar {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  },
});

export default HeaderWithSafeArea;
