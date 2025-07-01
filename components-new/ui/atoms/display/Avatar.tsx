/**
 * Avatar - Composant d'affichage de profil
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=433-884
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './../base/Box';
import Text from './../base/Text';
// Importer l'icône d'édition
import { EditRegularBoldIcon } from '@/assets/icons/figma/regular-bold/EditRegularBoldIcon';

// Types pour les variantes du composant Avatar
type AvatarType = 'online' | 'offline' | 'edit' | 'default';
type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  // Source de l'image
  source: ImageSourcePropType;
  // Apparence
  type?: AvatarType;
  size?: AvatarSize;
  badge?: React.ReactNode;
  // Actions
  onPress?: () => void;
  onEditPress?: () => void;
  // Style
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<any>; // Utilisation de any pour contourner l'erreur de type
  // Thème
  darkMode?: boolean;
}

/**
 * Avatar - Composant pour afficher une image de profil avec différentes variantes
 * Basé sur les spécifications Figma (node-id=433-884)
 */
const Avatar: React.FC<AvatarProps> = ({
  // Source de l'image
  source,
  // Apparence
  type = 'default',
  size = 'medium',
  badge,
  // Actions
  onPress,
  onEditPress,
  // Style
  containerStyle,
  imageStyle,
  // Thème
  darkMode = false,
}) => {
  const theme = useAppTheme();

  // Déterminer la taille de l'avatar selon la propriété size
  let avatarSize;
  let indicatorSize;
  let indicatorBorderWidth;
  let editIconSize;

  switch (size) {
    case 'small':
      avatarSize = 40; // Valeur exacte du Figma
      indicatorSize = 10;
      indicatorBorderWidth = 1;
      editIconSize = 12;
      break;
    case 'large':
      avatarSize = 96; // Valeur exacte du Figma
      indicatorSize = 20;
      indicatorBorderWidth = 2;
      editIconSize = 20;
      break;
    case 'medium':
    default:
      avatarSize = 64; // Valeur exacte du Figma
      indicatorSize = 15;
      indicatorBorderWidth = 1.6; // Valeur exacte du Figma
      editIconSize = 16;
      break;
  }

  // Déterminer la couleur de l'indicateur de statut
  let indicatorColor;
  switch (type) {
    case 'online':
      indicatorColor = theme.color('success'); // Vert pour online
      break;
    case 'offline':
      indicatorColor = theme.color('blueGrey'); // Gris pour offline
      break;
    default:
      indicatorColor = 'transparent';
      break;
  }

  // Rendre le contenu de l'avatar
  const renderAvatar = () => (
    <View style={[styles.container, containerStyle]}>
      {/* Image de l'avatar */}
      <Image
        source={source}
        style={[
          styles.image,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2, // Cercle parfait
          },
          imageStyle as any,
        ]}
        resizeMode="cover"
      />

      {/* Indicateur de statut (online/offline) */}
      {(type === 'online' || type === 'offline') && (
        <View
          style={[
            styles.indicator,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: indicatorSize / 2,
              backgroundColor: indicatorColor,
              borderWidth: indicatorBorderWidth,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}

      {/* Bouton d'édition */}
      {type === 'edit' && (
        <TouchableOpacity
          style={[
            styles.editButton,
            {
              width: indicatorSize * 1.8,
              height: indicatorSize * 1.8,
              borderRadius: (indicatorSize * 1.8) / 2,
              backgroundColor: theme.color('error'),
              right: -2,
              bottom: -2,
            },
          ]}
          onPress={onEditPress}
        >
          <EditRegularBoldIcon size={editIconSize} color="white" />
        </TouchableOpacity>
      )}

      {/* Badge personnalisé */}
      {badge && <View style={styles.badgeContainer}>{badge}</View>}
    </View>
  );

  // Rendre l'avatar avec ou sans interaction
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
    position: 'relative',
    alignSelf: 'flex-start',
  },
  image: {
    backgroundColor: '#E0E0E0', // Couleur de fond par défaut
  },
  indicator: {
    position: 'absolute',
    borderColor: 'white', // Bordure blanche comme dans Figma
  },
  editButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  badgeContainer: {
    position: 'absolute',
    right: -4,
    top: -4,
  },
});

export default Avatar;
