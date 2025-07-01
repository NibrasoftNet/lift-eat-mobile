import Box from '@/components-new/ui/atoms/base/Box';
import Text from '@/components-new/ui/atoms/base/Text';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Link } from 'expo-router';

export const QueryStateHandler = <T,>({
  isLoading,
  isFetching,
  isRefetching,
  isPending,
  isFetchedAfterMount,
  data,
  children,
}: {
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  isRefetching: boolean | false;
  isFetchedAfterMount?: boolean;
  data: T | T[] | undefined | null;
  children: React.ReactNode;
}) => {
  const theme = useAppTheme();
  if (data === null || data === undefined) {
    if (
      isPending ||
      isFetching ||
      isLoading ||
      isRefetching ||
      isFetchedAfterMount
    ) {
      return (
        <Box flex={1} justifyContent="center" alignItems="center" px={16}>
          <ActivityIndicator size="large" color={theme.color('secondary')} />
          <Text variant="body" mt={8}>Please Wait</Text>
        </Box>
      );
    }
    return (
      <Box flex={1} justifyContent="center" alignItems="center" px={16}>
        <Box bg={theme.colors.background} px={24} py={32} rounded="lg" shadow="md" alignItems="center">
          <Text variant="h3" mb={4}>Data Not Found</Text>
          <Text variant="body" mb={12}>No result has been found</Text>
          <Link href="/loginNew">
            <Text variant="button" color={theme.color('secondary')}>Back to login</Text>
          </Link>
        </Box>
      </Box>
    );
  }
  if (data) {
    return <>{children}</>;
  }
};
