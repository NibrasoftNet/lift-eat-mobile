import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Box, Text } from '@/components-new/ui/atoms';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/themeNew';
import { scannerPagesService } from '@/utils/services/pages/scanner-pages.service';
import ScanResultCard from '@/components-new/ui/organisms/meal/ScanResultCard';
import { ProductResult } from '@/utils/api/OpenFoodFactsService';

const ProductDetailsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { code } = useLocalSearchParams<{ code: string }>();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [product, setProduct] = useState<ProductResult | null>(null);

  const loadProduct = async () => {
    if (!code) return;
    const res = await scannerPagesService.getProductDetails(String(code));
    if (res.success && res.productResult) setProduct(res.productResult);
  };

  useEffect(() => {
    loadProduct();
  }, [code]);

  if (!product || (product.calories ?? 0) === 0) {
    return (
      <Box style={styles.container} flex={1} alignItems="center" justifyContent="center">
        <Text color={theme.color('blueGrey')} align="center">
          {t('meal.scanner.noNutrition', 'No nutritional information available for this product.')}
        </Text>
      </Box>
    );
  }

  return (
    <Box style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: theme.space('2xl') }}>
      <ScanResultCard
        imageUrl={typeof product.image === 'object' && product.image && 'uri' in (product.image as any) ? (product.image as any).uri : ''}
        name={product.name}
        calories={product.calories}
        macros={{ carbs: product.carbs, protein: product.protein, fat: product.fats }}
        onAdd={() => router.back()}
        brands={product.brands}
        categories={product.categories}
        nutriscoreGrade={product.nutriscore_grade}
        barcode={product.code}
        sugars={product.sugars}
        allergens={product.allergens}
      />
      </ScrollView>
    </Box>
  );
};

const createStyles = (theme: any) => StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: theme.colors.background } });

export default ProductDetailsScreen;