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
import { generalSettingsDrawerService } from '@/utils/services/general-settings-drawer.service';
import { GeneralSettingsMenuItem } from '@/utils/interfaces/drawer.interface';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Mappage des noms d'icu00f4nes aux composants d'icu00f4nes
const iconMapping: Record<string, any> = {
  'CircleHelp': CircleHelp,
  'ShieldAlert': ShieldAlert,
  'Newspaper': Newspaper,
  'Earth': Earth,
  'Settings': Settings,
};

// Composant pour afficher un u00e9lu00e9ment du menu des paramètres
const GeneralMenuItem = ({ item }: { item: GeneralSettingsMenuItem }) => {
  // Utiliser le callback pour gu00e9rer l'action de l'u00e9lu00e9ment
  const handlePress = useCallback(() => {
    // Utiliser le service pour gu00e9rer l'action du menu
    generalSettingsDrawerService.handleMenuAction(item.action, () => {
      logger.info(LogCategory.UI, `Menu action '${item.action}' completed`);
    });
  }, [item.action]);
  
  // Obtenir le composant d'icu00f4ne correspondant au nom d'icu00f4ne
  const IconComponent = iconMapping[item.icon] || Settings; // Fallback sur Settings si l'icu00f4ne n'est pas trouvge
  
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
  // u00c9tat pour la langue su00e9lectionnu00e9e
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ux');
  
  // Gestionnaire de changement de langue
  const handleLanguageChange = useCallback((value: string) => {
    setSelectedLanguage(value);
    generalSettingsDrawerService.changeLanguage(value);
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
                  {generalSettingsDrawerService.getAvailableLanguages().map((lang) => (
                    <SelectItem key={lang.value} label={lang.label} value={lang.value} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Pressable>
          
          {/* Utiliser le service pour générer les éléments du menu */}
          {generalSettingsDrawerService.getGeneralMenuItems().map((item) => (
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
            <ButtonText>CLose</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default GeneralSettingsDrawer;
