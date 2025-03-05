import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { useQuery } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { HStack } from '@/components/ui/hstack';
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Link } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import {
  Drum,
  Gem,
  PencilRuler,
  Settings,
  User,
  Weight,
} from 'lucide-react-native';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Pressable } from '@/components/ui/pressable';

export default function Progress() {
  const [showUserDrawer, setShowUserDrawer] = useState<boolean>(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);

  const drizzleDb = useDrizzleDb();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const result = await drizzleDb.query.users.findFirst();
      // console.log('List of users', result);
      return result;
    },
  });

  if (!user) {
    return (
      <VStack className="size-full items-center justify-center">
        <Card
          size="md"
          variant="elevated"
          className="m-3 items-center justify-center"
        >
          <Heading size="md" className="mb-1">
            User Not found
          </Heading>
          <Text size="sm">Login again to get access to your profile</Text>
          <Link href="/login" className="px-4 py-2 rounded-lg">
            <Text size="sm">Back to login</Text>
          </Link>
        </Card>
      </VStack>
    );
  }

  return (
    <>
      <VStack>
        <HStack className="items-center h-28 w-full justify-between border-b-2 border-blue-500 px-4">
          <Button
            className="w-16 h-16 rounded-lg bg-transparent drop-shadow-2xl shadow-blue-500 border border-amber-500"
            onPress={() => {
              setShowUserDrawer(true);
            }}
          >
            <Avatar className="w-16 h-16 rounded-lg">
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
            </Avatar>
          </Button>
          <Button
            className="flex w-36 items-center px-2 justify-between h-16 bg-transparent drop-shadow-2xl shadow-blue-500 border-2 rounded-2xl"
            onPress={() => {
              console.log('pro version');
            }}
          >
            <ButtonIcon as={Gem} className="w-8 h-8 text-black" />
            <ButtonText size="lg" className="text-black">
              L&A Pro
            </ButtonText>
          </Button>
          <Button
            className="w-16 h-16 bg-transparent drop-shadow-2xl shadow-blue-500"
            onPress={() => {
              setShowSettingsDrawer(true);
            }}
          >
            <ButtonIcon as={Settings} className="w-12 h-12 text-blue-500" />
          </Button>
        </HStack>
      </VStack>
      <Drawer
        isOpen={showUserDrawer}
        onClose={() => {
          setShowUserDrawer(false);
        }}
        size="lg"
        anchor="right"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <HStack
              space="md"
              className="pb-4 w-full border-b-2 border-blue-500"
            >
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
            <Pressable
              onPress={() => console.log('General')}
              className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
            >
              <Text className="text-xl">Edit profile</Text>
              <Icon as={PencilRuler} size="xl" />
            </Pressable>
            <Pressable
              onPress={() => console.log('details')}
              className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
            >
              <Text className="text-xl">BMI data</Text>
              <Icon as={Weight} size="xl" />
            </Pressable>
            <Pressable
              onPress={() => console.log('preference')}
              className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
            >
              <Text className="text-xl">Preference</Text>
              <Icon as={Drum} size="xl" />
            </Pressable>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onPress={() => {
                setShowUserDrawer(false);
              }}
              className="flex-1"
            >
              <ButtonText>CLose</ButtonText>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={showSettingsDrawer}
        onClose={() => {
          setShowSettingsDrawer(false);
        }}
        size="lg"
        anchor="left"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <HStack
              space="md"
              className="pb-4 w-full border-b-2 border-blue-500"
            >
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
            <Pressable
              onPress={() => console.log('General')}
              className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
            >
              <Text className="text-xl">Edit profile</Text>
              <Icon as={PencilRuler} size="xl" />
            </Pressable>
            <Pressable
              onPress={() => console.log('General')}
              className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
            >
              <Text className="text-xl">BMI data</Text>
              <Icon as={Weight} size="xl" />
            </Pressable>
            <Pressable
              onPress={() => console.log('General')}
              className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
            >
              <Text className="text-xl">Preference</Text>
              <Icon as={Drum} size="xl" />
            </Pressable>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onPress={() => {
                setShowSettingsDrawer(false);
              }}
              className="flex-1"
            >
              <ButtonText>CLose</ButtonText>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
