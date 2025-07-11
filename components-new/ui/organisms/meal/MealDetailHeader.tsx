import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../atoms/base';
import { useTheme, ThemeInterface } from '../../../../themeNew';
import { CloseSquareRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';
import { EditRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/EditRegularBoldIcon';
import { DeleteRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DeleteRegularBoldIcon';
import { HeartRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/HeartRegularBoldIcon';
import { useRouter } from 'expo-router';
import { Image as RNImage } from 'react-native';
import { resolveStaticImage } from '@/utils/resolveStaticImage';

interface MealDetailHeaderProps {
  /** ID du repas */
  mealId: string | number;
  /** Titre du repas */
  title: string;
  /** URL de l'image */
  imageUrl: string;
  /** Calories */
  calories: number;
  /** Statut favori */
  isFavorite: boolean;
  /** Indique si la mutation de favori est en cours */
  favoriteLoading?: boolean;
  /** Callback pour basculer le statut favori */
  onToggleFavorite: () => void;
  /** Fonction callback pour éditer le repas */
  onEdit?: () => void;
  /** Fonction callback pour supprimer le repas */
  onDelete?: () => void;
  /** Hauteur de l'en-tête */
  height?: number;
}

/**
 * Composant MealDetailHeader
 * Affiche l'en-tête de la page de détail d'un repas avec image, titre et boutons d'action
 * Respecte strictement la convention d'importation des icônes SVG
 */
const MealDetailHeader: React.FC<MealDetailHeaderProps> = ({
  mealId,
  title,
  imageUrl,
  calories,
  isFavorite,
  favoriteLoading = false,
  onToggleFavorite,
  onEdit,
  onDelete,
  height = 250,
}) => {
  const theme = useTheme();
  const router = useRouter();

  // Couleurs
  const textColor = '#FFFFFF';
  const iconColor = '#FFFFFF';

  // Gestionnaire pour le retour en arrière
  const handleGoBack = () => {
    router.back();
  };

  // Gestionnaire pour l'édition du repas
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      // Navigation par défaut vers l'écran d'édition
      router.push(`/(root)/(tabs)/meals/my-meals/edit/${mealId}`);
    }
  };

  // Gestionnaire pour la suppression du repas
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {/* En-tête avec navigation */}
      <View style={styles.navbar}>
        {/* Bouton de retour */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <CloseSquareRegularBoldIcon width={24} height={24} color="#8BC255" />
        </TouchableOpacity>

        {/* Boutons d'action à droite (éditer, favoris, supprimer) */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <EditRegularBoldIcon width={24} height={24} color="#8BC255" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log('[FavoriteIcon] Press detected');
              onToggleFavorite();
            }}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <ActivityIndicator
                size="small"
                color={isFavorite ? '#A4C73B' : '#BDBDBD'}
              />
            ) : (
              <HeartRegularBoldIcon
                width={24}
                height={24}
                color={isFavorite ? '#A4C73B' : '#BDBDBD'}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <DeleteRegularBoldIcon width={24} height={24} color="#F54336" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image centrée */}
      <View style={styles.imageContainer}>
        <RNImage
          source={resolveStaticImage(imageUrl, require('@/assets/images/logo_no_bg.png'))}
          style={styles.centeredImage}
          resizeMode="contain"
        />
      </View>

      {/* Titre centré */}
      <View style={styles.titleContainerCentered}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeInterface) => {
  const isDark = theme.isDark;
  return StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#F7FBF1 ',
    },
    navbar: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      height: 48,
    },
    imageContainer: {
      width: 320,
      height: 320,
      borderRadius: 20,
      backgroundColor: '#F7FBF1',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#F7FBF1',
      borderStyle: 'dotted',
      alignSelf: 'center',
      marginBottom: 16,
      overflow: 'hidden',
      marginTop: 20,
    },
    centeredImage: {
      width: '100%',
      height: '100%',
    },
    titleContainerCentered: {
      padding: 16,
      width: '100%',
      alignItems: 'center',
    },
    backButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 20,
    },
    titleContainer: {
      padding: 16,
      paddingBottom: 24,
    },
    title: {
      fontFamily: 'Urbanist',
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      textAlign: 'center',
    },
    calories: {
      fontFamily: 'Urbanist',
      fontSize: 18,
      fontWeight: '500',
      color: '#757575',
      marginTop: 4,
    },
  });
};

export default MealDetailHeader;
