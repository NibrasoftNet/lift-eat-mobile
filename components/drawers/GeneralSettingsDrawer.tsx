import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '../ui/drawer';
import { HStack } from '../ui/hstack';
import { Icon } from '../ui/icon';
import {
  ChevronDown,
  CircleHelp,
  Earth,
  Newspaper,
  Settings,
  ShieldAlert,
} from 'lucide-react-native';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { Button, ButtonText } from '../ui/button';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../ui/select';
import { generalSettingsDrawerUIService } from '@/utils/services/ui/general-settings-drawer-ui.service';
import { GeneralSettingsMenuItem } from '@/utils/interfaces/drawer.interface';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Mappage des noms d'icônes aux composants d'icônes
const iconMapping: Record<string, any> = {
  CircleHelp: CircleHelp,
  ShieldAlert: ShieldAlert,
  Newspaper: Newspaper,
  Earth: Earth,
  Settings: Settings,
};

// Composant pour afficher un élément du menu des paramètres
const GeneralMenuItem = ({ item }: { item: GeneralSettingsMenuItem }) => {
  // Utiliser le callback pour gérer l'action de l'élément
  const handlePress = useCallback(() => {
    // Utiliser le service pour gérer l'action du menu
    generalSettingsDrawerUIService.handleMenuAction(item.action, () => {
      logger.info(LogCategory.UI, `Menu action '${item.action}' completed`);
    });
  }, [item.action]);

  // Obtenir le composant d'icône correspondant au nom d'icône
  const IconComponent = iconMapping[item.icon] || Settings; // Fallback sur Settings si l'icône n'est pas trouvée

  return (
    <Pressable
      onPress={handlePress}
      className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-2 mb-2"
    >
      <Text className="text-xl">{item.title}</Text>
      <Icon as={IconComponent} size="xl" />
    </Pressable>
  );
};

function GeneralSettingsDrawer({
  showGeneralSettingsDrawer,
  setShowGeneralSettingsDrawer,
}: {
  showGeneralSettingsDrawer: boolean;
  setShowGeneralSettingsDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  // État pour la langue sélectionnée
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ux');

  // Gestionnaire de changement de langue
  const handleLanguageChange = useCallback((lang: string) => {
    setSelectedLanguage(lang);
    generalSettingsDrawerUIService.changeLanguage(lang);
  }, []);
  return (
    <Drawer
      isOpen={showGeneralSettingsDrawer}
      onClose={() => {
        setShowGeneralSettingsDrawer(false);
      }}
      size="lg"
      anchor="left"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <HStack space="md" className="pb-4 w-full border-b-2 border-blue-500">
            <Icon as={Settings} size="xl" />
            <Text size="xl">Settings</Text>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          {/* Sélecteur de langue utilisant le service pour obtenir les langues disponibles */}
          <Pressable>
            <Select
              selectedValue={selectedLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger
                variant="underlined"
                size="md"
                className="flex w-full item-center justify-between h-12"
              >
                <SelectInput placeholder="Select Language" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {/* Utiliser le service pour générer les options de langues */}
                  {generalSettingsDrawerUIService
                    .getAvailableLanguages()
                    .map((lang) => (
                      <SelectItem
                        key={lang.value}
                        label={lang.label}
                        value={lang.value}
                      />
                    ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Pressable>

          {/* Utiliser le service pour générer les éléments du menu */}
          {generalSettingsDrawerUIService
            .getGeneralMenuItems()
            .map((item: GeneralSettingsMenuItem) => (
              <GeneralMenuItem key={item.action} item={item} />
            ))}
        </DrawerBody>
        <DrawerFooter>
          <Button
            onPress={() => {
              setShowGeneralSettingsDrawer(false);
            }}
            className="flex-1"
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default GeneralSettingsDrawer;
