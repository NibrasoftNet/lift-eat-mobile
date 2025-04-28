import React, { Dispatch, SetStateAction, useMemo, useEffect } from 'react';
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
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

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
  const router = useRouter();
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  // Gestion de la navigation vers les différentes pages de paramètres
  const renderItem = ({ item }: { item: any }) => {
    // Vérifier l'authentification
    if (!userId) {
      logger.warn(LogCategory.AUTH, 'Attempting to navigate to settings while not authenticated');
      // Utiliser un chemin valide pour Expo Router au lieu de la racine simple
      router.push('/(root)/(auth)/login');
      return null;
    }
    
    return (
      <Pressable
        onPress={() =>
          item.tag === 'newPassword'
            ? router.push(`/new-password`)
            : item.tag === 'profile'
              ? router.push(`/profile/${userId}`)
              : item.tag === 'details'
                ? router.push(`/details/edit/${userId}`)
                : item.tag === 'preference'
                  ? router.push(`/preference/edit/${userId}`)
                  : router.push(`/analytics`)
        }
        className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-4 mb-2"
      >
        <Text className="text-xl">{item.title}</Text>
        <Icon as={item.icon} size="xl" />
      </Pressable>
    );
  };

  return renderItem({ item });
};

const UserSettingsDrawer = ({
  showUserSettingsDrawer,
  setShowUserSettingsDrawer,
}: {
  showUserSettingsDrawer: boolean;
  setShowUserSettingsDrawer: Dispatch<SetStateAction<boolean>>;
}) => {
  // Obtenir l'ID utilisateur de manière standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  
  // État local pour stocker les données utilisateur
  const [user, setUser] = React.useState<UserOrmPros | null>(null);
  
  // Charger les données utilisateur quand le drawer s'ouvre
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        logger.warn(LogCategory.AUTH, 'User not authenticated when accessing settings drawer');
        setShowUserSettingsDrawer(false);
        return;
      }
      
      try {
        const result = await sqliteMCPServer.getUserDetailsViaMCP(userId);
        if (result.success && result.user) {
          setUser(result.user);
        } else {
          logger.error(LogCategory.USER, `Failed to get user details: ${result.error}`);
          setShowUserSettingsDrawer(false);
        }
      } catch (error) {
        logger.error(LogCategory.USER, `Error fetching user details: ${error instanceof Error ? error.message : String(error)}`);
        setShowUserSettingsDrawer(false);
      }
    };
    
    if (showUserSettingsDrawer) {
      fetchUserData();
    }
  }, [showUserSettingsDrawer, userId, setShowUserSettingsDrawer]);
  // Si aucun utilisateur n'est chargé, ne rien afficher
  if (!user) {
    return null;
  }
  
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
            <ButtonText>Close</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserSettingsDrawer;
