import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
import { IconProps } from '../../molecules/menu/MenuItem';

interface HeaderBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.FC<IconProps>;
  onRightIconPress?: () => void;
  darkMode?: boolean;
}

/**
 * HeaderBar component
 * 
 * Implémente la barre d'en-tête de l'application avec titre et boutons optionnels.
 * Design conforme à Figma - reproduit fidèlement les dimensions et styles.
 */
const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightIcon: RightIcon,
  onRightIconPress,
  darkMode = true,
}) => {
  const insets = useSafeAreaInsets();
  
  const bgColor = darkMode 
    ? 'bg-[rgba(24,26,32,0.85)]' 
    : 'bg-white';
  
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const iconColor = darkMode ? '#FFFFFF' : '#212121';

  return (
    <View 
      className={`w-full ${bgColor} backdrop-blur-xl`}
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 10) }
      ]}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          {showBackButton && (
            <Pressable 
              onPress={onBackPress}
              className="mr-4 p-1"
            >
              <ArrowLeftRegularBoldIcon 
                width={24} 
                height={24} 
                color={iconColor} 
              />
            </Pressable>
          )}
          
          <Text className={`font-urbanist-bold text-xl ${textColor}`}>
            {title}
          </Text>
        </View>
        
        {RightIcon && (
          <Pressable 
            onPress={onRightIconPress}
            className="p-1"
          >
            <RightIcon 
              width={24} 
              height={24} 
              color={iconColor} 
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default HeaderBar;
