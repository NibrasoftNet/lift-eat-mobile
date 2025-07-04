import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Globe, Pencil, Trash2 } from 'lucide-react-native';

export interface MenuItemPlanProps {
  /** Disable Select Current row if the plan is already current */
  disabledSelect?: boolean;
  /** Callback when user selects "Select Current" */
  onSelectCurrent?: () => void;
  /** Callback when user presses Edit */
  onEdit?: () => void;
  /** Callback when user presses Delete */
  onDelete?: () => void;
  /** Optional override for container style */
  style?: object;
}

/**
 * MenuItemPlan – dropdown list for Plan actions
 * Default options: ["Select Current", "Edit Plan", "Delete Plan"]
 */
const MenuItemPlan: React.FC<MenuItemPlanProps> = ({
  disabledSelect,
  onSelectCurrent,
  onEdit,
  onDelete,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {[
        {
          label: 'Select Current',
          icon: Globe,
          onPress: onSelectCurrent,
          disabled: disabledSelect,
        },
        {
          label: 'Edit',
          icon: Pencil,
          onPress: onEdit,
          disabled: false,
        },
        {
          label: 'Delete',
          icon: Trash2,
          onPress: onDelete,
          disabled: false,
        },
      ].map((row, idx, arr) => (
        <React.Fragment key={row.label}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={row.disabled ? 1 : 0.8}
            onPress={row.disabled ? undefined : row.onPress}
          >
            <Icon as={row.icon} size="sm" color={row.disabled ? '#BDBDBD' : '#212121'} />
            <Text style={[styles.label, row.disabled && styles.disabledLabel]}>
              {row.label}
            </Text>
          </TouchableOpacity>
          {idx !== arr.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    minWidth: 160, // wider to keep labels on single line
    maxWidth: 200,
    right: 32,
    top: 399,
    borderRadius: 10,
    // iOS shadow
    shadowColor: 'rgba(4, 6, 15, 0.08)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 100,
    // Android elevation
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minHeight: 24,
  },
  label: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2,
    color: '#212121',
    textAlign: 'left',
  },
  disabledLabel: {
    color: '#BDBDBD'
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
  },
});

export default MenuItemPlan;
