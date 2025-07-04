import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box } from '../atoms/base';

interface TestLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const TestLayout: React.FC<TestLayoutProps> = ({ children }) => {
  const theme = useAppTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.color('background') }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Box
          bg={theme.color('background')}
          style={styles.content}
          rounded='md'
          shadow='md'
        >
          {children}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default TestLayout;
