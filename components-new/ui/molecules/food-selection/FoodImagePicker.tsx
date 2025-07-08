import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../../atoms/base';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { CameraCurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/CameraCurvedBoldIcon';
import { ImageCurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/ImageCurvedBoldIcon';
import { ArrowLeft3CurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/ArrowLeft3CurvedBoldIcon';
import { resolveStaticImage } from '@/utils/resolveStaticImage';

// Emoji icon support removed

// Type pour les différentes sources d'images
export type ImageSource = {
  type: 'image' | 'none';
  value: string; // Nom de l'icône ou URI de l'image
  component?: React.FC<{ size?: number }>; // Composant SVG optionnel avec size optionnel
};

interface FoodImagePickerProps {
  onImageSelected: (imageSource: ImageSource) => void;
  initialImage?: ImageSource;
  isDarkMode?: boolean;
}

/**
 * Composant FoodImagePicker
 *
 * Permet à l'utilisateur de sélectionner une image pour un repas à partir de 2 sources :
 * 1. Appareil photo du téléphone
 * 2. Galerie de photos
 */
const FoodImagePicker: React.FC<FoodImagePickerProps> = ({
  onImageSelected,
  initialImage,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageSource | undefined>(
    initialImage || { type: 'none', value: '' },
  );

  const theme = useAppTheme();

  // Couleurs exactes du design Figma
  // Utilisation du thème global pour la couleur de fond
  const backgroundColor =
    theme?.colors?.background || (isDarkMode ? '#212121' : '#FFFFFF');
  const textPrimaryColor = isDarkMode ? '#FFFFFF' : '#212121';
  const textSecondaryColor = isDarkMode ? '#9E9E9E' : '#616161';
  const accentColor = '#A1CE50'; // Couleur verte utilisée dans l'app
  // Utilise une couleur secondaire du thème pour les cartes/options
  const cardBackgroundColor = isDarkMode ? '#333333' : '#F7FBF1';
  const borderColor = isDarkMode ? '#424242' : '#E0E0E0';

  // Fonction pour prendre une photo
  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(t('meal.form.permission.cameraRequired'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newImageSource: ImageSource = {
          type: 'image',
          value: result.assets[0].uri,
        };
        setSelectedImage(newImageSource);
        onImageSelected(newImageSource);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
    }
  };

  // Fonction pour sélectionner une image depuis la galerie
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(t('meal.form.permission.galleryRequired'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newImageSource: ImageSource = {
          type: 'image',
          value: result.assets[0].uri,
        };
        setSelectedImage(newImageSource);
        onImageSelected(newImageSource);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Erreur lors du choix de l'image:", error);
    }
  };

  // Rendu de l'image sélectionnée
  const renderSelectedImage = () => {
    if (!selectedImage || selectedImage.type === 'none') {
      return (
        <View
          style={[
            styles.placeholder,
            { backgroundColor: cardBackgroundColor, borderColor },
          ]}
        >
          <Text style={{ color: textSecondaryColor }}>
            {t('meal.form.image.selectTitle')}
          </Text>
        </View>
      );
    }

    if (selectedImage.type === 'image') {
      return (
        <Image
          source={resolveStaticImage(selectedImage.value)}
          style={styles.selectedImage}
        />
      );
    }

    return (
      <View
        style={[
          styles.placeholder,
          { backgroundColor: cardBackgroundColor, borderColor },
        ]}
      >
        <Text style={{ color: textSecondaryColor }}>
          {t('meal.form.image.unsupported')}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        {renderSelectedImage()}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: borderColor, backgroundColor },
            ]}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.backButton}
            >
              <ArrowLeft3CurvedBoldIcon
                width={24}
                height={24}
                color={textPrimaryColor}
              />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textPrimaryColor }]}>
              {t('meal.form.image.selectTitle')}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: cardBackgroundColor },
              ]}
              onPress={takePhoto}
            >
              <CameraCurvedBoldIcon
                width={150}
                height={150}
                color={accentColor}
              />
              <Text style={[styles.optionText, { color: textPrimaryColor }]}>
                {t('meal.form.image.camera')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: cardBackgroundColor },
              ]}
              onPress={pickImage}
            >
              <ImageCurvedBoldIcon
                width={150}
                height={150}
                color={accentColor}
              />
              <Text style={[styles.optionText, { color: textPrimaryColor }]}>
                {t('meal.form.image.gallery')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imageContainer: {
    width: 198,
    height: 158,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  modalTitle: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  optionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  optionButton: {
    width: '60%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
  },
  optionText: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  iconsScrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  iconButton: {
    width: '31%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
    borderRadius: 12,
    padding: 8,
    // Ombre portée pour effet "carte" sur l'emoji
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default FoodImagePicker;
