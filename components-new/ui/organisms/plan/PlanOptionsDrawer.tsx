import React, { useMemo } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Text } from '../../atoms/base';
import Icon from '@/components-new/ui/atoms/display/Icon';
import { CircleX, Eye, Pencil, Trash2, Star } from 'lucide-react-native';

export interface PlanOptionsDrawerProps {
  /** Controls the visibility of the drawer */
  visible: boolean;
  /** Disable the edit option */
  disableEdit?: boolean;
  /** Disable the delete option */
  disableDelete?: boolean;
  /** Callback when user closes the drawer (tap outside or on X icon) */
  onClose: () => void;
  /** Callback when user selects \"Details\" */
  onDetail?: () => void;
  /** Callback when user selects \"Edit\" */
  onEdit?: () => void;
  /** Callback when user selects "Delete" */
  onDelete?: () => void;
  /** Disable the set current option */
  disableSetCurrent?: boolean;
  /** Callback when user selects "Set Current" */
  onSetCurrent?: () => void;
}

const PlanOptionsDrawer: React.FC<PlanOptionsDrawerProps> = ({
  visible,
  disableEdit = false,
  disableDelete = false,
  onClose,
  disableSetCurrent = false,
  onSetCurrent,
  onDetail,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  /** Execute action then close */
  const handlePress = (cb?: () => void) => (e: GestureResponderEvent) => {
    cb?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay as ViewStyle}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container as ViewStyle}>
          {/* Handle */}
          <View style={styles.handle as ViewStyle} />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn as ViewStyle}
            onPress={onClose}
          >
            <Icon as={CircleX} size="xl" color={theme.color('primary')} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title as TextStyle}>Plan Options</Text>

          {/* Divider */}
          <View style={styles.divider as ViewStyle} />

          {/* Options */}
          <View style={styles.optionList as ViewStyle}>
            <TouchableOpacity
              style={styles.optionRow as ViewStyle}
              onPress={handlePress(onDetail)}
            >
              <View style={styles.iconWrapper as ViewStyle}>
                <Icon as={Eye} size="md" color="#1A96F0" />
              </View>
              <Text
                style={[styles.optionLabel as TextStyle, { color: '#1A96F0' }]}
              >
                Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionRow as ViewStyle,
                disableEdit && (styles.disabled as ViewStyle),
              ]}
              onPress={!disableEdit ? handlePress(onEdit) : undefined}
              disabled={disableEdit}
            >
              <View style={styles.iconWrapper as ViewStyle}>
                <Icon
                  as={Pencil}
                  size="md"
                  color={disableEdit ? theme.color('blueGrey') : '#FF981F'}
                />
              </View>
              <Text
                style={[styles.optionLabel as TextStyle, { color: '#FF981F' }]}
              >
                Edit
              </Text>
            </TouchableOpacity>

            {/* Set current */}
            <TouchableOpacity
              style={[
                styles.optionRow as ViewStyle,
                disableSetCurrent && (styles.disabled as ViewStyle),
              ]}
              onPress={!disableSetCurrent ? handlePress(onSetCurrent) : undefined}
              disabled={disableSetCurrent}
            >
              <View style={styles.iconWrapper as ViewStyle}>
                <Icon
                  as={Star}
                  size="md"
                  color={disableSetCurrent ? theme.color('blueGrey') : theme.color('green')}
                />
              </View>
              <Text
                style={[styles.optionLabel as TextStyle, { color: theme.color('green') }]}
              >
                Set current
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionRow as ViewStyle,
                disableDelete && (styles.disabled as ViewStyle),
              ]}
              onPress={!disableDelete ? handlePress(onDelete) : undefined}
              disabled={disableDelete}
            >
              <View style={styles.iconWrapper as ViewStyle}>
                <Icon
                  as={Trash2}
                  size="md"
                  color={disableDelete ? theme.color('blueGrey') : '#F54336'}
                />
              </View>
              <Text
                style={[styles.optionLabel as TextStyle, { color: '#F54336' }]}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: theme.color('background'),
      borderTopLeftRadius: theme.radius('lg'),
      borderTopRightRadius: theme.radius('lg'),
      paddingTop: theme.space('md'),
      paddingBottom: theme.space('xl'),
      paddingHorizontal: theme.space('xl'),
    },
    handle: {
      width: 38,
      height: 3,
      borderRadius: 100,
      backgroundColor: theme.color('backgroundGrey'),
      alignSelf: 'center',
      marginBottom: theme.space('lg'),
    },
    closeBtn: {
      position: 'absolute',
      top: theme.space('md'),
      right: theme.space('md'),
      padding: theme.space('sm'),
    },
    title: {
      ...(theme.textStyle.urbanist('h3') as TextStyle),
      color: theme.color('primary'),
      textAlign: 'center',
      marginBottom: theme.space('lg'),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.color('backgroundGrey'),
      marginBottom: theme.space('md'),
    },
    optionList: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    optionRow: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.space('sm'),
      flexDirection: 'column',
    },
    iconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.space('xs'),
    },
    optionLabel: {
      ...(theme.textStyle.urbanist('caption') as TextStyle),
      color: theme.color('primary'),
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.4,
    },
  });

export default PlanOptionsDrawer;
