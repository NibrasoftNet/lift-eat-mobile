import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';

const flags = [
  { lang: 'fr-FR', name: 'France' },
  { lang: 'en-US', name: 'Usa' },
];

export default function Community() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem('language', lang);
    await i18n.changeLanguage(lang);
  };

  return (
    <VStack className="size-full items-center justify-center gap-4 p-4">
      <ThemedText style={styles.text}>{t('language')}</ThemedText>
      <HStack className="gap-2">
        {flags.map(({ lang, name }) => (
          <Button
            key={name}
            onPress={() => changeLanguage(lang)}
            className={`w-24 h-10 ${currentLanguage === lang ? 'bg-blue-500' : 'bg-gray-400'}`}
          >
            <ButtonText className="text-white text-center">{name}</ButtonText>
          </Button>
        ))}
      </HStack>
      <Text>{t('home.title')}</Text>
      <Text>{t('home.subtitle')}</Text>
      <Text className="text-center">{t('home.description')}</Text>
      <Text className="text-center">{t('home.learnMore')}</Text>
    </VStack>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    lineHeight: 32,
    marginTop: -6,
  },
});
