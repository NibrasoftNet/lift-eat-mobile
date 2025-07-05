import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useTheme } from '@/themeNew';
import Box from '@/components-new/ui/atoms/base/Box';
import Text from '@/components-new/ui/atoms/base/Text';
import { scannerPagesService } from '@/utils/services/pages/scanner-pages.service';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { GetScanHistoryResult } from '@/utils/mcp/interfaces/scan-history-interfaces';
import { ScanHistoryItem, ScanHistoryProps } from '@/types/scanhistory.types';
import { useTranslation } from 'react-i18next';

/**
 * Composant ScanHistory — liste l'historique des scans récents
 * Se limite à l'affichage, délègue la logique (stockage) au service pages ou store.
 */
const ScanHistory: React.FC<ScanHistoryProps> = ({
  userId,
  onSelect,
  onClear,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [data, setData] = useState<OperationResult<GetScanHistoryResult>>({
    success: false,
    error: t('common.loading'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await scannerPagesService.getHistory(userId);
        setData(result);
      } catch (error) {
        console.error('Error fetching scan history:', error);
        setData({
          success: false,
          error: t('scanner.history.loadError'),
        });
      }
    };

    fetchData();
  }, [userId]);

  const items = data.success ? data.data?.data || [] : [];

  return (
    <Box style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('scanner.history.title')}</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearBtn}>{t('common.clear')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => onSelect?.(item)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDate}>
              {new Date(item.scannedAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
        contentContainerStyle={styles.listContent}
      />
    </Box>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.color('background') ?? '#FFF',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.color('primary') ?? '#000',
    },
    clearBtn: {
      fontSize: 14,
      color: theme.color('error') ?? '#FF5726',
    },
    listContent: {
      gap: 8,
    },
    item: {
      padding: 12,
      backgroundColor: theme.color('overlayGrey') ?? '#EEE',
      borderRadius: 8,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.color('primary') ?? '#000',
    },
    itemDate: {
      fontSize: 12,
      color: theme.color('blueGrey') ?? '#666',
      marginTop: 4,
    },
  });

export default ScanHistory;
