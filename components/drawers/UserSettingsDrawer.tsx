import React, { Dispatch, SetStateAction } from 'react';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '../ui/drawer';
import { HStack } from '../ui/hstack';
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '../ui/avatar';
import { Icon } from '../ui/icon';
import { Compass, Drum, PencilRuler, User, Weight } from 'lucide-react-native';
import { VStack } from '../ui/vstack';
import { Heading } from '../ui/heading';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { Button, ButtonText } from '../ui/button';
import { UserPros } from '../../db/schema';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import useSessionStore from '@/utils/store/sessionStore';

const menuItems = [
  {
    title: 'Edit profile',
    icon: PencilRuler,
    link: '/details',
  },
  { title: 'BMI data', icon: Weight, link: '/details/edit' },
  { title: 'Preference', icon: Drum, link: '/preference' },
  { title: 'Analytics', icon: Compass, link: '/preference' },
];

const MenuItem = ({ item }: { item: (typeof menuItems)[0] }) => {
  const { user } = useSessionStore();
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        item.title === 'Edit profile'
          ? router.push(`/details/edit/${user.id}`)
          : router.push(`/preference`)
      }
      className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-4 mb-2"
    >
      <Text className="text-xl">{item.title}</Text>
      <Icon as={item.icon} size="xl" />
    </Pressable>
  );
};

const UserSettingsDrawer = ({
  showUserSettingsDrawer,
  setShowUserSettingsDrawer,
  user,
}: {
  showUserSettingsDrawer: boolean;
  setShowUserSettingsDrawer: Dispatch<SetStateAction<boolean>>;
  user: UserPros;
}) => {
  return (
    <Drawer
      isOpen={showUserSettingsDrawer}
      onClose={() => {
        setShowUserSettingsDrawer(false);
      }}
      size="lg"
      anchor="right"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <HStack space="md" className="pb-4 w-full border-b-2 border-blue-500">
            <Avatar>
              <AvatarFallbackText>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallbackText>
              {user.profileImage ? (
                <AvatarImage
                  source={{
                    uri: `data:image/jpeg;base64,${user.profileImage}`,
                  }}
                />
              ) : (
                <AvatarFallbackText>
                  <Icon as={User} size="lg" className="stroke-white" />
                </AvatarFallbackText>
              )}
              <AvatarBadge />
            </Avatar>
            <VStack>
              <Heading size="sm">{user.name}</Heading>
              <Text size="sm">{user.email}</Text>
            </VStack>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <DrawerBody>
            <FlashList
              data={menuItems}
              renderItem={({ item }) => <MenuItem item={item} />}
              estimatedItemSize={5} // Optimize for performance
            />
          </DrawerBody>
        </DrawerBody>
        <DrawerFooter>
          <Button
            onPress={() => {
              setShowUserSettingsDrawer(false);
            }}
            className="flex-1"
          >
            <ButtonText>CLose</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserSettingsDrawer;
