import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/themeNew';
import CircularNutritionProgress from '@/components-new/ui/molecules/tracking/CircularNutritionProgress';

import scanPagesService from '@/utils/services/pages/scan-pages.service';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

export interface MacroInfo {
  carbs: number;
  protein: number;
  fat: number;
}

export interface ScanResultCardProps {
  imageUrl: string;
  name: string;
  calories: number;
  macros: MacroInfo;
  onAdd?: () => void;


  brands?: string;
  categories?: string;
  nutriscoreGrade?: string;
  barcode?: string;
  sugars?: number;
  allergens?: string;
}

const ScanResultCard: React.FC<ScanResultCardProps> = ({
  imageUrl,
  name,
  calories,
  macros,
  onAdd,
  brands,
  categories,
  nutriscoreGrade,
  barcode,
  sugars,
  allergens,
}) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const toast = useToast();

  const { carbs, protein, fat } = macros;

  const gradeColor = useMemo(() => {
    if (!nutriscoreGrade) return theme.color('primary');
    switch (nutriscoreGrade.toUpperCase()) {
      case 'A':
        return '#4CAF50'; // Green
      case 'B':
        return '#8BC34A'; // Light Green
      case 'C':
        return '#FFC107'; // Amber
      case 'D':
        return '#FF9800'; // Orange
      case 'E':
        return '#F44336'; // Red
      default:
        return theme.color('primary');
    }
  }, [nutriscoreGrade, theme]);

  const handleAdd = async () => {
    if (!onAdd) {
      console.log('Adding scanned product to catalogue');
    }
    try {
      const op = await scanPagesService.addScannedIngredient({
        name,
        calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        image: imageUrl,
      } as any);

      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = `toast-${id}`;
          return (
            <MultiPurposeToast
              id={toastId}
              color={op.data?.alreadyExists ? ToastTypeEnum.INFOS : ToastTypeEnum.SUCCESS}
              title={op.data?.alreadyExists ? 'Déjà présent' : 'Ajouté !'}
              description={op.message || ''}
            />
          );
        },
      });
      onAdd?.();
    } catch (e) {
      console.error(e);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => (
          <MultiPurposeToast
            id={`toast-${id}`}
            color={ToastTypeEnum.ERROR}
            title={'Erreur'}
            description={e instanceof Error ? e.message : 'Une erreur est survenue'}
          />
        ),
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>

      {/* Name */}
      <Text style={styles.name}>{name}</Text>

      {/* Divider */}
      <View style={styles.divider} />
      {/* Additional details */}
      {(brands || categories || nutriscoreGrade || barcode) && (
        <View style={styles.detailsContainer}>
          {nutriscoreGrade && (
            <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>{t('meal.scanner.productDetails.nutriScore')}: </Text>
            <Text style={{ color: gradeColor, fontWeight: '700', fontSize:20 }}>{nutriscoreGrade.toUpperCase()}</Text>
          </Text>
          )}
          {brands && (
            <Text style={styles.detailText}><Text style={styles.detailLabel}>{t('meal.scanner.productDetails.brands')}: </Text>{brands}</Text>
          )}
          {categories && (
            <Text style={styles.detailText}><Text style={styles.detailLabel}>{t('meal.scanner.productDetails.categories')}: </Text>{categories}</Text>
          )}
          {sugars !== undefined && (
            <Text style={styles.detailText}><Text style={styles.detailLabel}>{t('meal.scanner.productDetails.sugars')}: </Text>{sugars} g</Text>
          )}
          {allergens && (
            <Text style={styles.detailText}><Text style={styles.detailLabel}>{t('meal.scanner.productDetails.allergens')}: </Text>{allergens}</Text>
          )}
          {barcode && (
            <Text style={styles.detailText}><Text style={styles.detailLabel}>{t('meal.scanner.productDetails.barcode')}: </Text>{barcode}</Text>
          )}
        </View>
      )}
      {/* Macronutrients overview */}
      <View style={styles.sectionRow}>
        <CircularNutritionProgress
          calories={calories}
          carbs={carbs}
          protein={protein}
          fat={fat}
          size={100}
          showDetails={true}
        />
      </View>



      {/* Add button */}
      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>{t('common.add')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.color('background') ?? '#FFFFFF',
      borderRadius: 8,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    header: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 12,
    },
    image: {
      width: 200,
      height: 160,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#A4C73B',
      borderStyle: 'dotted',
      alignSelf: 'center',
      marginBottom: 16,
      overflow: 'hidden',
      marginTop:20,
    },
    favoriteBtn: {
      position: 'absolute',
      right: 0,
      top: 0,
      padding: 4,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.color('titre') ?? '#000000',
      marginBottom: 16,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: 'successLighter',
      marginBottom: 16,
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 24,
    },
    detailsContainer: {
      width: '100%',
      marginBottom: 24,
    },
    detailText: {
      fontSize: 16,
      color: theme.color('primary') ?? '#000000',
      marginBottom: 4,
    },
    detailLabel: {
      fontWeight: '700',
      color: theme.color('titre') ?? '#666666',
    },

    addBtn: {
      width: '100%',
      paddingVertical: 14,
      backgroundColor: theme.color('success') ?? '#A1CE50',
      borderRadius: 8,
      alignItems: 'center',
    },
    addBtnText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },
  });

export default ScanResultCard;
