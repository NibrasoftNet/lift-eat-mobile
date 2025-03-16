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
import {
  Compass,
  Drum,
  PencilRuler,
  SquareAsterisk,
  User,
  Weight,
} from 'lucide-react-native';
import { VStack } from '../ui/vstack';
import { Heading } from '../ui/heading';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { Button, ButtonText } from '../ui/button';
import { UserOrmPros } from '@/db/schema';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import useSessionStore from '@/utils/store/sessionStore';

const menuItems = [
  { title: 'Analytics', icon: Compass, tag: 'analytics' },
  {
    title: 'Edit profile',
    icon: PencilRuler,
    tag: 'profile',
  },
  { title: 'BMI data', icon: Weight, tag: 'details' },
  { title: 'Preference', icon: Drum, tag: 'preference' },
  { title: 'Change Password', icon: SquareAsterisk, tag: 'newPassword' },
];

const MenuItem = ({ item }: { item: (typeof menuItems)[0] }) => {
  const { user } = useSessionStore();
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        item.tag === 'newPassword'
          ? router.push(`/new-password`)
          : item.tag === 'profile'
            ? router.push(`/profile/${user?.id!}`)
            : item.tag === 'details'
              ? router.push(`/details/edit/${user?.id!}`)
              : item.tag === 'preference'
                ? router.push(`/preference/edit/${user?.id!}`)
                : router.push(`/analytics`)
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
  user: UserOrmPros;
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
                    uri: `${user.profileImage}`,
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
