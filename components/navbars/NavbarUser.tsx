import { useState } from 'react';
import { HStack } from '../ui/hstack';
import { Icon } from '../ui/icon';
import { Gem, Settings, UserIcon } from 'lucide-react-native';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { UserOrmPros } from '@/db/schema';
import UserSettingsBottomSheet from '@/components/sheets/UserSettingsBottomSheet';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { AvatarImage } from '../ui/avatar';
import { Colors } from '@/utils/constants/Colors';
import GeneralSettingsBottomSheet from '@/components/sheets/GeneralSettingsBottomSheet';

export default function NavbarUser({ user }: { user: UserOrmPros }) {
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
          <Box className="w-12 h-12 rounded-lg">
            {user.profileImage ? (
              <AvatarImage
                source={{
                  uri: `${user.profileImage}`,
                }}
              />
            ) : (
              <UserIcon size={30} color={Colors.blue.background} />
            )}
          </Box>
        </Button>
        <Button
          className="flex w-32 items-center px-2 justify-between h-12 bg-transparent drop-shadow-2xl shadow-blue-500 border-2 border-tertiary-500 rounded-2xl"
          onPress={() => {
            console.log('pro version');
          }}
        >
          <ButtonIcon as={Gem} size={30} color={Colors.amber.background} />
          <ButtonText size="lg" className="text-tertiary-500">
            L&A Pro
          </ButtonText>
        </Button>
        <Button
          className="w-16 h-16 bg-transparent focus:bg-transparent hover:bg-transparent active:bg-transparent"
          onPress={() => {
            setShowGeneralSettingsDrawer(true);
          }}
        >
          <ButtonIcon as={Settings} className="w-10 h-10 text-black" />
        </Button>
      </HStack>
      <UserSettingsBottomSheet
        showUserSettingsDrawer={showUserSettingsDrawer}
        setShowUserSettingsDrawer={setShowUserSettingsDrawer}
        user={user}
      />
      <GeneralSettingsBottomSheet
        showGeneralSettingsDrawer={showGeneralSettingsDrawer}
        setShowGeneralSettingsDrawer={setShowGeneralSettingsDrawer}
      />
    </>
  );
}
