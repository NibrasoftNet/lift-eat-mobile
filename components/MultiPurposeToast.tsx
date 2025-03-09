import { Toast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { GetToastColor } from '@/utils/utils';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import React from 'react';

export type ToastTypeProps = {
  id: string;
  color: ToastTypeEnum;
  title: string;
  description: string;
};

export default function MultiPurposeToast({
  id,
  color,
  title,
  description,
}: ToastTypeProps) {
  return (
    <Toast
      nativeID={id}
      style={{ backgroundColor: GetToastColor[color] }}
      className={`flex rounded-b-xl rounded-t-none p-4 gap-3 w-screen mt-0`}
    >
      <VStack className="w-full justify-center items-center">
        <Heading
          size="sm"
          className="text-white text-xl font-semibold text-center"
        >
          {title}
        </Heading>
        <Text
          size="sm"
          className="text-white text-lg font-semibold text-center"
        >
          {description}
        </Text>
      </VStack>
    </Toast>
  );
}
