/**
 * CreateMealButton - Bouton pour créer un nouveau repas
 * Conforme au design Figma visible sur l'écran Meals
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { ThemeInterface } from '@/themeNew';
import { Text } from '../../atoms/base';
import { useTranslation } from 'react-i18next';
import { PlusRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface CreateMealButtonProps {
  /** Callback appelé lors du clic sur le bouton */
  onPress?: () => void;
}

/**
 * Bouton pour créer un nouveau repas
 * Avec icône + et texte "Crée un repas"
 */
const CreateMealButton: React.FC<CreateMealButtonProps> = ({ onPress }) => {
  // Wrap the original onPress to inject logging
  const handlePress = () => {
    logger.info(LogCategory.USER, 'CreateMealButton pressed');
    if (onPress) {
      onPress();
    } else {
      logger.warn(
        LogCategory.USER,
        'CreateMealButton pressed but onPress is undefined',
      );
    }
  };
  const { t } = useTranslation();
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const styles = React.useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark],
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={t('meal.form.submit.create')}
    >
      <View style={styles.content}>
        <PlusRegularBoldIcon width={20} height={20} color={'#FFFFFF'} />
        <Text variant="body" style={[styles.text, { color: '#FFFFFF' }]}>
          {t('meal.form.submit.create')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) =>
  StyleSheet.create({
    container: {
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      flex: 1,
      backgroundColor: '#A4C73B',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginLeft: 8,
      fontSize: 14,
      fontFamily: 'Urbanist-SemiBold',
    },
  });

export default CreateMealButton;
