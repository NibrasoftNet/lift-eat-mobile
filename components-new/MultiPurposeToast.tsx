// @ts-nocheck
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useTheme } from '@/themeNew';

export interface MultiPurposeToastProps {
  id: string;
  color: ToastTypeEnum;
  title: string;
  description?: string;
}

// Composant toast générique réutilisable
const MultiPurposeToast: React.FC<MultiPurposeToastProps> = ({
  id,
  color,
  title,
  description,
}) => {
  const theme = useTheme?.();

  const backgroundColor = useMemo(() => {
    switch (color) {
      case ToastTypeEnum.SUCCESS:
        return theme?.color?.('success') ?? '#4CAF50';
      case ToastTypeEnum.ERROR:
        return theme?.color?.('error') ?? '#EF4444';
      case ToastTypeEnum.INFOS:
      default:
        return theme?.color?.('primary') ?? '#3B82F6';
    }
  }, [color, theme]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginHorizontal: 16,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          backgroundColor,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 4,
        },
        title: {
          fontSize: 16,
          fontWeight: '700',
          color: '#FFFFFF',
          marginBottom: description ? 4 : 0,
        },
        description: {
          fontSize: 14,
          color: '#FFFFFF',
        },
      }),
    [backgroundColor, description],
  );

  return (
    <View style={styles.container} testID={id}>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
};

export default MultiPurposeToast;
