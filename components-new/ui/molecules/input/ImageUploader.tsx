/**
 * ImageUploader - Composant pour sélectionner une image depuis la caméra ou la galerie
 * Utilisé dans l'écran de création de repas et autres écrans nécessitant une sélection d'image
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

// Import des composants atoms
import Box from '@/components-new/ui/atoms/base/Box';
import Text from '@/components-new/ui/atoms/base/Text';

// Import des icônes SVG Figma selon les conventions du projet
import { CameraRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CameraRegularBoldIcon';
import { ImageRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ImageRegularBoldIcon';

// Interface des props du composant
export interface ImageUploaderProps {
  imageUri: string | null;
  onImageChange: (uri: string | null) => void;
  placeholder?: string;
  size?: number; // Taille de l'avatar en pixels
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUri,
  onImageChange,
  placeholder = 'Ajouter une image',
  size = 120,
}) => {
  const theme = useAppTheme();
  const [loading, setLoading] = useState(false);

  // Demander les permissions pour accéder à la galerie
  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à votre galerie de photos.',
          [{ text: 'OK' }],
        );
        return false;
      }
      return true;
    }
    return true;
  };

  // Demander les permissions pour accéder à la caméra
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à votre caméra.',
          [{ text: 'OK' }],
        );
        return false;
      }
      return true;
    }
    return true;
  };

  // Sélectionner une image depuis la galerie
  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection d'image:", error);
      Alert.alert(
        'Erreur',
        "Une erreur est survenue lors de la sélection de l'image.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prendre une photo avec la caméra
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la prise de photo.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Afficher les options (caméra ou galerie)
  const showOptions = () => {
    Alert.alert('Ajouter une image', 'Choisissez une source', [
      {
        text: 'Prendre une photo',
        onPress: takePhoto,
      },
      {
        text: 'Choisir depuis la galerie',
        onPress: pickImage,
      },
      {
        text: 'Annuler',
        style: 'cancel',
      },
    ]);
  };

  // Supprimer l'image sélectionnée
  const removeImage = () => {
    Alert.alert(
      "Supprimer l'image",
      'Êtes-vous sûr de vouloir supprimer cette image ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => onImageChange(null),
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <Box alignItems="center">
      {/* Zone de sélection d'image */}
      <TouchableOpacity
        onPress={imageUri ? removeImage : showOptions}
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderColor: theme.colors.blueGrey,
            backgroundColor: imageUri
              ? 'transparent'
              : theme.colors.backgroundGrey,
          },
        ]}
        disabled={loading}
      >
        {imageUri ? (
          // Affichage de l'image sélectionnée
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          // Affichage du placeholder
          <Box flex={1} alignItems="center" justifyContent="center" p={3}>
            <ImageRegularBoldIcon
              width={size * 0.4}
              height={size * 0.4}
              color={theme.colors.blueGrey}
            />
            <Text
              variant="caption"
              color={theme.colors.blueGrey}
              align="center"
              mt={2}
            >
              {placeholder}
            </Text>
          </Box>
        )}
      </TouchableOpacity>

      {/* Bouton de caméra pour une nouvelle prise de photo */}
      {imageUri && (
        <TouchableOpacity
          onPress={showOptions}
          style={[
            styles.cameraButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <CameraRegularBoldIcon width={20} height={20} color="white" />
        </TouchableOpacity>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ImageUploader;
