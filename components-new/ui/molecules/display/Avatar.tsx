import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ImageSourcePropType } from 'react-native';

interface AvatarProps {
  // Image source
  source?: ImageSourcePropType;
  // Nom pour le fallback
  name?: string;
  // Dimensions
  size?: number;
  // Style
  containerStyle?: any;
  // Fonction de rappel
  onPress?: () => void;
  // Style de bordure
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Composant Avatar amélioré
 * Permet d'afficher une image ou une lettre de fallback dans un cercle
 * Conçu selon les standards Figma
 */
const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 100,
  containerStyle,
  onPress,
  borderColor = '#E0E0E0',
  borderWidth = 2,
}) => {
  // Initialiales pour le fallback
  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.slice(0, 2).toUpperCase();
  };

  const renderAvatar = () => (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          borderWidth,
        },
        containerStyle,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#6C5CE7',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: size * 0.4, // Taille de police proportionnelle
            }}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {renderAvatar()}
    </TouchableOpacity>
  ) : (
    renderAvatar()
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default Avatar;
