import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from 'lucide-react-native';
import { Link } from 'expo-router';

export const QueryStateHandler = <T,>({
  isLoading,
  isFetching,
  isFetchedAfterMount,
  data,
  children,
}: {
  isLoading: boolean;
  isFetching: boolean;
  isFetchedAfterMount: boolean;
  data: T | T[] | undefined | null;
  children: React.ReactNode;
}) => {
  if (!data) {
    if (isFetchedAfterMount || isFetching || isLoading) {
      return (
        <VStack className="size-full items-center justify-center gap-2">
          <Spinner />
          <Text size="md">Please Wait</Text>
        </VStack>
      );
    }
    return (
      <VStack className="size-full items-center justify-center">
        <Card
          size="md"
          variant="elevated"
          className="m-3 items-center justify-center"
        >
          <Heading size="md" className="mb-1">
            Data Not Found
          </Heading>
          <Text size="sm">Login again to get access to your profile</Text>
          <Link href="/login" className="px-4 py-2 rounded-lg">
            <Text size="sm">Back to login</Text>
          </Link>
        </Card>
      </VStack>
    );
  }

  return <>{children}</>;
};
