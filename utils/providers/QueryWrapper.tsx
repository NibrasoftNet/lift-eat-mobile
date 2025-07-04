import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';

import Text from '@/components-new/ui/atoms/base/Text';

import { Link } from 'expo-router';
import React from 'react';

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
  if (data === null || data === undefined) {
    if (
      isPending ||
      isFetching ||
      isLoading ||
      isRefetching ||
      isFetchedAfterMount
    ) {
      return (
        <View className="flex-1 w-full items-center justify-center gap-2">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text variant="body" className="text-primary-500">Please wait…</Text>
        </View>
      );
    }
    return (
      <View className="flex-1 w-full items-center justify-center">
        <View className="m-3 p-6 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg items-center justify-center">
          <Text variant="h2" className="mb-1">
            Data Not Found
          </Text>
          <Text variant="body" className="text-gray-500 dark:text-gray-400">No result has been found</Text>
          <Link href="/intro">
            <Text variant="body" className="text-primary-500 underline">Back to login</Text>
          </Link>
        </View>
      </View>
    );
  }
  if (data) {
    return <>{children}</>;
  }
};
