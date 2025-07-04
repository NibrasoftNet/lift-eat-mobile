/**
 * Modal - Composant de fenêtre modale
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=2766-23998
 */

import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Modal as RNModal,
  Dimensions,
  Platform,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';


interface ModalProps {
  // État
  visible: boolean;
  // Style
  dark?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  // Contenu
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  // Actions
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonPress?: () => void;
  onSecondaryButtonPress?: () => void;
  // Contrôle
  onClose?: () => void;
  onBackdropPress?: () => void;
}

/**
 * Modal - Composant de fenêtre modale avec différents thèmes
 * Basé sur les spécifications Figma (node-id=2766-23998)
 */
const Modal: React.FC<ModalProps> = ({
  // État
  visible,
  // Style
  dark = false,
  containerStyle,
  modalStyle,
  titleStyle,
  descriptionStyle,
  // Contenu
  title,
  description,
  icon,
  children,
  // Actions
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  // Contrôle
  onClose,
  onBackdropPress,
}) => {
  const appTheme = useAppTheme();
  const { width } = Dimensions.get('window');
  
  // Couleurs selon le thème
  const backgroundColor = dark ? '#1F222A' : '#FFFFFF'; // Couleurs exactes du Figma
  const textColor = dark ? '#FFFFFF' : '#212121'; // Couleurs exactes du Figma
  const secondaryTextColor = dark ? '#9E9E9E' : '#757575'; // Couleurs exactes du Figma
  const primaryButtonBgColor = appTheme.color('primary'); // Couleur du thème
  const secondaryButtonBgColor = dark ? '#35383F' : '#F5F5F5'; // Couleurs exactes du Figma
  
  // Largeur de la modale (340px selon Figma)
  const modalWidth = Math.min(340, width - 40);
  
  // Gérer l'appui sur le fond
  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress();
    }
  };
  
  // Rendre les boutons d'action
  const renderButtons = () => {
    if (!primaryButtonText && !secondaryButtonText) return null;
    
    return (
      <Box style={styles.buttonsContainer}>
        {secondaryButtonText && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              { backgroundColor: secondaryButtonBgColor },
            ]}
            onPress={onSecondaryButtonPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                { color: textColor },
              ]}
            >
              {secondaryButtonText}
            </Text>
          </TouchableOpacity>
        )}
        
        {primaryButtonText && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: primaryButtonBgColor },
            ]}
            onPress={onPrimaryButtonPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                { color: '#FFFFFF' },
              ]}
            >
              {primaryButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </Box>
    );
  };
  
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <View
          style={[
            styles.modalContainer,
            {
              width: modalWidth,
              backgroundColor,
            },
            modalStyle,
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <Box style={styles.contentContainer}>
              {/* Icône (optionnelle) */}
              {icon && (
                <Box style={styles.iconContainer}>
                  {icon}
                </Box>
              )}
              
              {/* Contenu principal */}
              <Box style={styles.mainContent}>
                {/* Titre (optionnel) */}
                {title && (
                  <Text
                    style={[
                      styles.title,
                      { color: textColor },
                      titleStyle as TextStyle,
                    ]}
                  >
                    {title}
                  </Text>
                )}
                
                {/* Description (optionnelle) */}
                {description && (
                  <Text
                    style={[
                      styles.description,
                      { color: secondaryTextColor },
                      descriptionStyle as TextStyle,
                    ]}
                  >
                    {description}
                  </Text>
                )}
                
                {/* Contenu personnalisé (optionnel) */}
                {children}
              </Box>
              
              {/* Boutons d'action (optionnels) */}
              {renderButtons()}
            </Box>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opacité exacte du Figma
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 16, // Rayon exact du Figma
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    padding: Platform.OS === 'ios' ? 32 : 28, // Padding exact du Figma
    paddingTop: 40, // Padding top exact du Figma
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32, // Espacement exact du Figma
  },
  mainContent: {
    gap: 16, // Espacement exact du Figma
    marginBottom: 32, // Espacement exact du Figma
  },
  title: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontSize: 20, // Taille exacte du Figma
    fontWeight: '700', // Poids exact du Figma
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontSize: 16, // Taille exacte du Figma
    fontWeight: '400', // Poids exact du Figma
    textAlign: 'center',
    lineHeight: 24, // Hauteur de ligne exacte du Figma
  },
  buttonsContainer: {
    gap: 12, // Espacement exact du Figma
  },
  button: {
    height: 56, // Hauteur exacte du Figma
    borderRadius: 16, // Rayon exact du Figma
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    // Styles spécifiques au bouton principal
  },
  secondaryButton: {
    // Styles spécifiques au bouton secondaire
  },
  buttonText: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontSize: 16, // Taille exacte du Figma
    fontWeight: '700', // Poids exact du Figma
  },
});

export default Modal;
