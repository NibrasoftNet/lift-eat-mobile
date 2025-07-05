import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
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
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { userSettingsDrawerUIService } from '@/utils/services/ui/user-settings-drawer-ui.service';
import { MenuItem } from '@/utils/interfaces/drawer.interface';

// Utiliser le service pour obtenir les éléments du menu
// Cette variable sert de mappage pour convertir les noms d'icônes en composants
const iconMapping: Record<string, any> = {
  Compass: Compass,
  PencilRuler: PencilRuler,
  Weight: Weight,
  Drum: Drum,
  SquareAsterisk: SquareAsterisk,
};

const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const router = useRouter();
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  // Utilisation du service pour gérer la navigation vers les différentes pages de paramètres
  const handleNavigation = useCallback(() => {
    // Vérifier l'authentification
    if (!userId) {
      logger.warn(
        LogCategory.AUTH,
        'Attempting to navigate to settings while not authenticated',
      );
      // Utiliser un chemin valide pour Expo Router au lieu de la racine simple
      router.push('/(root)/(auth)/login');
      return;
    }

    // Utiliser le service pour obtenir l'URL de navigation
    const navigationUrl = userSettingsDrawerUIService.getNavigationUrl(
      item.tag,
      userId,
    );
    // Utiliser la navigation type-safe de Expo Router
    if (item.tag === 'analytics') {
      router.push('/analytics' as any);
    } else if (item.tag === 'profile') {
      router.push(`/profile/${userId}` as any);
    } else if (item.tag === 'details') {
      router.push(`/details/edit/${userId}` as any);
    } else if (item.tag === 'preference') {
      router.push(`/preference/edit/${userId}` as any);
    } else if (item.tag === 'newPassword') {
      router.push('/new-password' as any);
    }
  }, [item.tag, userId, router]);

  // Utiliser le mapping d'icônes pour obtenir le composant correspondant au nom d'icône
  const IconComponent = iconMapping[item.icon] || User; // Fallback sur User si l'icône n'est pas trouvée

  return (
    <Pressable
      onPress={handleNavigation}
      className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-4 mb-2"
    >
      <Text className="text-xl">{item.title}</Text>
      <Icon as={IconComponent} size="xl" />
    </Pressable>
  );
};

const UserSettingsDrawer = ({
  showUserSettingsDrawer,
  setShowUserSettingsDrawer,
  user: initialUser,
}: {
  showUserSettingsDrawer: boolean;
  setShowUserSettingsDrawer: Dispatch<SetStateAction<boolean>>;
  user?: UserOrmPros;
}) => {
  // Obtenir l'ID utilisateur de manière standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  // État local pour stocker les données utilisateur
  const [user, setUser] = React.useState<UserOrmPros | null>(
    initialUser || null,
  );

  // Charger les données utilisateur quand le drawer s'ouvre et qu'il n'y a pas d'utilisateur initial
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        logger.warn(
          LogCategory.AUTH,
          'User not authenticated when accessing settings drawer',
        );
        setShowUserSettingsDrawer(false);
        return;
      }

      if (initialUser) {
        setUser(initialUser);
        return;
      }

      try {
        // Utiliser le service pour récupérer les données utilisateur
        const userData = await userSettingsDrawerUIService.fetchUserData(
          userId,
        );
        if (userData) {
          setUser(userData);
        } else {
          logger.error(LogCategory.USER, 'Failed to get user details');
          setShowUserSettingsDrawer(false);
        }
      } catch (error) {
        logger.error(
          LogCategory.USER,
          `Error fetching user details: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        setShowUserSettingsDrawer(false);
      }
    };

    if (showUserSettingsDrawer) {
      fetchUserData();
    }
  }, [showUserSettingsDrawer, userId, setShowUserSettingsDrawer, initialUser]);
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
              data={userSettingsDrawerUIService.getMenuItems()}
              renderItem={({ item }) => <MenuItemComponent item={item} />}
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
