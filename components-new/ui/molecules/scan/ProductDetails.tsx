import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/themeNew';
import { useTranslation } from 'react-i18next';

export interface ProductDetailsProps {
  imageUrl: string;
  name: string;
  brands?: string;
  categories?: string;
  nutritionFacts?: Array<{ label: string; value: string }>;
}

/**
 * Affiche les détails d'un produit scanné.
 * Conçu comme un composant « molecule » (MCP Presenter layer)
 * Utilise uniquement des composants natifs et StyleSheet.create.
 */
const ProductDetails: React.FC<ProductDetailsProps> = ({
  imageUrl,
  name,
  brands,
  categories,
  nutritionFacts = [],
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        {brands && <Text style={styles.brands}>{brands}</Text>}
      </View>

      {/* Categories */}
      {categories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('scanner.productDetails.categories')}</Text>
          <Text style={styles.sectionContent}>{categories}</Text>
        </View>
      )}

      {/* Nutrition facts */}
      {nutritionFacts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('scanner.productDetails.nutritionFacts')}</Text>
          {nutritionFacts.map((item) => (
            <View key={item.label} style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>{item.label}</Text>
              <Text style={styles.nutritionValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      padding: 24,
      backgroundColor: theme.color('background') ?? '#FFFFFF',
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 12,
      backgroundColor: '#ECECEC',
    },
    name: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.color('primary') ?? '#000000',
      textAlign: 'center',
    },
    brands: {
      fontSize: 16,
      color: theme.color('blueGrey') ?? '#666666',
      marginTop: 4,
      textAlign: 'center',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.color('primary') ?? '#000',
    },
    sectionContent: {
      fontSize: 16,
      color: theme.color('blueGrey') ?? '#333',
    },
    nutritionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    nutritionLabel: {
      fontSize: 16,
      color: theme.color('blueGrey') ?? '#333',
    },
    nutritionValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.color('primary') ?? '#000',
    },
  });

export default ProductDetails;
