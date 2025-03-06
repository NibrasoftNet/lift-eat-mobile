import { useState } from 'react';
import { HStack } from '../ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Icon } from '../ui/icon';
import { Gem, Settings, User } from 'lucide-react-native';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { UserPros } from '../../db/schema';
import UserSettingsDrawer from '@/components/drawers/UserSettingsDrawer';
import GeneralSettingsDrawer from '@/components/drawers/GeneralSettingsDrawer';

export default function NavbarUser({ user }: { user: UserPros }) {
  const [showUserSettingsDrawer, setShowUserSettingsDrawer] =
    useState<boolean>(false);
  const [showGeneralSettingsDrawer, setShowGeneralSettingsDrawer] =
    useState<boolean>(false);

  return (
    <>
      <HStack className="items-center h-20 w-full justify-between border-b-2 border-blue-500 px-4">
        <Button
          className="w-12 h-12 rounded-lg bg-transparent drop-shadow-2xl shadow-blue-500 border border-amber-500"
          onPress={() => {
            setShowUserSettingsDrawer(true);
          }}
        >
          <Avatar className="w-12 h-12 rounded-lg">
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
          className="flex w-32 items-center px-2 justify-between h-12 bg-transparent drop-shadow-2xl shadow-blue-500 border-2 rounded-2xl"
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
          action="secondary"
          className="w-16 h-16 bg-transparent focus:bg-transparent hover:bg-transparent active:bg-transparent"
          onPress={() => {
            setShowGeneralSettingsDrawer(true);
          }}
        >
          <ButtonIcon as={Settings} className="w-10 h-10 text-black" />
        </Button>
      </HStack>
      <UserSettingsDrawer
        showUserSettingsDrawer={showUserSettingsDrawer}
        setShowUserSettingsDrawer={setShowUserSettingsDrawer}
        user={user}
      />
      <GeneralSettingsDrawer
        showGeneralSettingsDrawer={showGeneralSettingsDrawer}
        setShowGeneralSettingsDrawer={setShowGeneralSettingsDrawer}
      />
    </>
  );
}
