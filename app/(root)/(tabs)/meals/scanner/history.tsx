import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Box, Text } from '@/components-new/ui/atoms';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/themeNew';
import { scannerPagesService } from '@/utils/services/pages/scanner-pages.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { ScanHistoryItem } from '@/types/scanhistory.types';

const ScannerHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  const loadHistory = async () => {
    if (userId === null) {
      // Utilisateur non connecté : pas d'historique
      setHistory([]);
      return;
    }
    const res = await scannerPagesService.getHistory(userId);
    if (res.success && res.data?.data) {
      setHistory(res.data.data);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <Text style={styles.title}>{t('meal.scanner.history.title')}</Text>
      </Box>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.push({
                pathname: '/meals/scanner/product/[code]',
                params: { code: item.barcode },
              })
            }
          >
            <Text style={styles.itemCode}>{item.barcode}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Box style={styles.separator} />}
      />
    </Box>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 16, backgroundColor: theme.colors.surface },
    title: { fontSize: 24, fontWeight: '600', color: theme.colors.text },
    item: { padding: 16 },
    itemCode: { fontSize: 14, color: theme.colors.textSecondary },
    itemName: { fontSize: 16, fontWeight: '500', color: theme.colors.text },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: 16,
    },
  });

export default ScannerHistoryScreen;
