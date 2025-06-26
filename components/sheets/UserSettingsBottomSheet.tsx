import React, { Dispatch, SetStateAction } from 'react';
import { Icon } from '../ui/icon';
import {
  Drum,
  LucideIcon,
  PencilRuler,
  SquareAsterisk,
  Weight,
} from 'lucide-react-native';
import { Text } from '../ui/text';
import { Button, ButtonText } from '../ui/button';
import { UserOrmPros } from '@/db/schema';
import { RelativePathString, useRouter } from 'expo-router';
import useSessionStore from '@/utils/store/sessionStore';
import BottomSheet from '@/components/ui/bottom-sheet';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  link: RelativePathString;
}

const menuItems: MenuItemProps[] = [
  {
    title: 'Profile',
    icon: PencilRuler,
    link: `/profile` as RelativePathString,
  },
  { title: 'BMI', icon: Weight, link: '/details' as RelativePathString },
  {
    title: 'Preference',
    icon: Drum,
    link: '/preference' as RelativePathString,
  },
  {
    title: 'Password',
    icon: SquareAsterisk,
    link: '/newPassword' as RelativePathString,
  },
];

const UserSettingsBottomSheet = ({
  showUserSettingsDrawer,
  setShowUserSettingsDrawer,
  user,
}: {
  showUserSettingsDrawer: boolean;
  setShowUserSettingsDrawer: Dispatch<SetStateAction<boolean>>;
  user: UserOrmPros;
}) => {
  const router = useRouter();
  const handleUserLinks = (item: MenuItemProps) => {
    item.title === 'Password'
      ? router.push(`/new-password`)
      : item.title === 'Profile'
        ? router.push(`/profile/${user?.id!}`)
        : item.title === 'BMI'
          ? router.push(`/details/edit/${user?.id!}`)
          : item.title === 'Preference'
            ? router.push(`/preference/edit/${user?.id!}`)
            : router.push(`/analytics`);
    setShowUserSettingsDrawer(false);
  };
  return (
    <BottomSheet
      open={showUserSettingsDrawer}
      setOpen={setShowUserSettingsDrawer}
      height="sm"
      // Optional customizations:
      className="gap-4"
      // overlayClassName="bg-gray-900"
      // handleClassName="bg-gray-400"
    >
      <VStack>
        <HStack className="w-full justify-around">
          <Pressable
            className="flex flex-col items-center justify-center bg-transparent"
            onPress={() => handleUserLinks(menuItems[0])}
          >
            <Icon as={menuItems[0].icon} />
            <Text>{menuItems[0].title}</Text>
          </Pressable>
          <Pressable
            className="flex flex-col items-center justify-center bg-transparent"
            onPress={() => handleUserLinks(menuItems[1])}
          >
            <Icon as={menuItems[1].icon} />
            <Text>{menuItems[1].title}</Text>
          </Pressable>
          <Pressable
            className="flex flex-col items-center justify-center bg-transparent"
            onPress={() => handleUserLinks(menuItems[2])}
          >
            <Icon as={menuItems[2].icon} />
            <Text>{menuItems[2].title}</Text>
          </Pressable>
          <Pressable
            className="flex flex-col items-center justify-center bg-transparent"
            onPress={() => handleUserLinks(menuItems[3])}
          >
            <Icon as={menuItems[3].icon} />
            <Text>{menuItems[3].title}</Text>
          </Pressable>
        </HStack>
        <Button
          onPress={() => {
            setShowUserSettingsDrawer(false);
          }}
          className="w-full"
        >
          <ButtonText>CLose</ButtonText>
        </Button>
      </VStack>
    </BottomSheet>
  );
};

export default UserSettingsBottomSheet;
