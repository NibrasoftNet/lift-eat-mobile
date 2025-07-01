import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

export interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  size?: number;
}

interface MenuItemProps {
  icon: React.FC<IconProps>;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

/**
 * Composant MenuItem conforme au design Figma
 * Extrait du Figma Kit: node-id=3404-17376
 */
const MenuItem: React.FC<MenuItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onPress 
}) => {
  const theme = useAppTheme();
  
  // Couleurs du design Figma
  const iconColor = isActive ? theme.color('primary') : '#9E9E9E';

  return (
    <Pressable 
      style={styles.pressable} 
      onPress={onPress}
    >
      <View style={styles.container}>
        <Icon 
          width={24}
          height={24}
          color={iconColor} 
        />
        <Text 
          style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}
        >
          {label.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    flex: 1,
  },
  container: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.2, // 2% letter spacing from Figma
  },
  activeLabel: {
    fontFamily: 'Urbanist-Bold',
    color: '#A1CE50', // Couleur primaire du design Figma
  },
  inactiveLabel: {
    fontFamily: 'Urbanist-Medium',
    color: '#9E9E9E', // Couleur inactive du design Figma
  },
});

export default MenuItem;
