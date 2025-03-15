import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Link } from 'expo-router';
import React from 'react';

export const QueryStateHandler = <T,>({
  isLoading,
  isFetching,
  isRefetching,
  isPending,
  data,
  children,
}: {
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  isRefetching?: boolean | false;
  data: T | T[] | undefined | null;
  children: React.ReactNode;
}) => {
  if (data === null || data === undefined) {
    if (isPending || isFetching || isLoading || isRefetching) {
      return (
        <VStack className="w-full h-full items-center justify-center gap-2">
          <Spinner />
          <Text size="md">Please Wait</Text>
        </VStack>
      );
    }
    return (
      <VStack className="w-full h-full items-center justify-center">
        <Card
          size="md"
          variant="elevated"
          className="m-3 items-center justify-center"
        >
          <Heading size="md" className="mb-1">
            Data Not Found
          </Heading>
          <Text size="sm">Login again to get access to your profile</Text>
          <Link href="/login">
            <Text size="sm">Back to login</Text>
          </Link>
        </Card>
      </VStack>
    );
  }

  return <>{children}</>;
};
