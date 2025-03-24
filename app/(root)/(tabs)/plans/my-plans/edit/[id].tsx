import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { CircleChevronLeft } from 'lucide-react-native';
import React from 'react';
import { VStack } from '@/components/ui/vstack';

const EditSinglePlan = () => {
  return (
    <VStack className="flex-1 w-full p-4">
      <Link href="/plans/my-plans" asChild>
        <Pressable>
          <Icon as={CircleChevronLeft} className="w-10 h-10 text-black" />
        </Pressable>
      </Link>
      <Text>Delete single plan form</Text>;
    </VStack>
  );
};

export default EditSinglePlan;
