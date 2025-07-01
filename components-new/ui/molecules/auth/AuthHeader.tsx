import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Text from '@/components-new/ui/atoms/base/Text';
import LogoIcon from '@/assets/icons/LogoIcon';

interface AuthHeaderProps {
  title: string;
  description: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, description }) => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <LogoIcon size={80} />
      </View>
      <View style={styles.textContainer}>
        <Text variant="h1" style={styles.title}>{title}</Text>
        <Text variant="body" style={styles.subtitle}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 24,
    },
    logo: {
      width: 80,
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    textContainer: {
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: 'Urbanist-Bold',
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: 0.2,
    },
    subtitle: {
      textAlign: 'center',
      color: '#757575',
      fontFamily: 'Urbanist-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
  });
