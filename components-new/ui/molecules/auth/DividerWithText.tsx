import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Text from '@/components-new/ui/atoms/base/Text';

interface DividerWithTextProps {
  text: string;
}

export const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text variant="body" style={styles.text}>{text}</Text>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: '#E0E0E0',
    },
    text: {
      marginHorizontal: 16,
      color: '#757575',
      fontFamily: 'Urbanist-Regular',
      fontSize: 14,
    },
  });
