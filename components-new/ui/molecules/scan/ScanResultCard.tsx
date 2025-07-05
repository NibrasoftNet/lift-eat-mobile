import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useTheme } from '@/themeNew';
import { HeartRegularBoldIcon } from '@/assets/icons/figma/regular-bold';
import { InfoCircleRegularBoldIcon } from '@/assets/icons/figma/regular-bold';
import Text from '@/components-new/ui/atoms/base/Text';
import Box from '@/components-new/ui/atoms/base/Box';
import CircleProgress from './CircleProgress';
import { useTranslation } from 'react-i18next';

interface ScanResultCardProps {
  product: {
    image: string;
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    isFavorite: boolean;
  };
  onAdd: () => void;
  onToggleFavorite: () => void;
  onDetails: () => void;
}

const ScanResultCard: React.FC<ScanResultCardProps> = ({
  product,
  onAdd,
  onToggleFavorite,
  onDetails,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box style={styles.container}>
      {/* Image du produit */}
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        borderRadius={12}
      />

      {/* Cercle nutritionnel */}
      <Box style={styles.circleContainer}>
        <CircleProgress
          calories={product.calories}
          carbs={product.carbs}
          protein={product.protein}
          fat={product.fat}
          size={120}
          strokeWidth={8}
        />
      </Box>

      {/* Informations du produit */}
      <Box style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>

        {/* Boutons */}
        <Box style={styles.buttonContainer}>
          {/* Bouton Details */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.secondary }]}
            onPress={onDetails}
          >
            <InfoCircleRegularBoldIcon
              width={24}
              height={24}
              color={theme.colors.primary}
            />
            <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
              {t('common.details')}
            </Text>
          </TouchableOpacity>

          {/* Bouton Favori */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={onToggleFavorite}
          >
            <HeartRegularBoldIcon
              width={24}
              height={24}
              color={
                product.isFavorite
                  ? theme.colors.primary
                  : theme.colors.secondary
              }
            />
          </TouchableOpacity>

          {/* Bouton Add */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.success }]}
            onPress={onAdd}
          >
            <Text
              style={[styles.buttonText, { color: theme.colors.secondary }]}
            >
              {t('common.add')}
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  infoContainer: {
    gap: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ScanResultCard;
