import { Toast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { GetToastColor } from '@/utils/utils';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

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
      className={`flex rounded-b-xl p-4 gap-3 w-full shadow-hard-2`}
    >
      <VStack className="gap-4 p-4 w-full">
        <Heading size="sm" className="text-white text-xl font-semibold">
          <Text>{title}</Text>
        </Heading>
        <Text size="sm" className="text-white text-lg font-semibold">
          {description}
        </Text>
      </VStack>
    </Toast>
  );
}
