import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/base';
import { useTheme } from '../../../../themeNew';
import { ThemeInterface } from '../../../../themeNew';
import { ChartRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ChartRegularBoldIcon';
import { InfoCircleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/InfoCircleRegularBoldIcon';
import { TimeCircleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/TimeCircleRegularBoldIcon';
import { CategoryRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CategoryRegularBoldIcon';

interface GeneralInfoItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}

interface GeneralInfoSectionProps {
  /** Type de repas (ex: Déjeuner, Dîner) */
  mealType: string;
  /** Type de cuisine (ex: Italienne, Française) */
  cuisineType: string;
  /** Mode sombre */
  isDarkMode?: boolean;
}

/**
 * Composant GeneralInfoSection
 * Affiche les informations générales d'un repas avec icônes
 * Respecte strictement la convention d'importation des icônes SVG
 */
const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  mealType,
  cuisineType,
  isDarkMode = false,
}) => {
  const theme = useTheme();
  const isDark = isDarkMode || theme.isDark;
  const styles = React.useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  // Couleurs selon le thème
  const textColor = isDark ? '#FFFFFF' : '#212121';
  const secondaryTextColor = isDark ? '#CDCDCD' : '#757575';
  const iconColor = isDark ? '#FFFFFF' : '#212121';

  // Préparation des items d'information
  const infoItems: GeneralInfoItem[] = [
    {
      icon: (
        <ChartRegularBoldIcon 
          width={20} 
          height={20} 
          color= '#A4C73B' 
        />
      ),
      label: 'Type',
      value: mealType,
    },
    {
      icon: (
        <CategoryRegularBoldIcon 
          width={20} 
          height={20} 
          color={'#A4C73B'} 
        />
      ),
      label: 'Cuisine',
      value: cuisineType,
    },
  ];
  
  return (
    <View style={styles.container}>
      {infoItems.map((item, index) => (
        <View 
          key={`info-item-${index}`} 
          style={[
            styles.itemContainer,
            index < infoItems.length - 1 ? styles.itemWithDivider : null,
          ]}
        >
          <View style={styles.iconContainer}>
            {item.icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>
              {item.label}
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
              {item.value}{item.unit || ''}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) =>
  StyleSheet.create({
    container: {
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#EEEEEE',
    },
    itemContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemWithDivider: {
      borderRightWidth: 1,
      borderRightColor: isDark ? '#333333' : '#EEEEEE',
    },
    iconContainer: {
      marginBottom: 8,
      alignItems: 'center',
      justifyContent: 'center',
      height: 12,
    },
    textContainer: {
      alignItems: 'center',
    },
    label: {
      fontFamily: 'Urbanist',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    value: {
      fontFamily: 'Urbanist',
      fontSize: 14,
      fontWeight: '700',
    },
  });

export default GeneralInfoSection;
