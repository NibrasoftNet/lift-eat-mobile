import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import CancelButton from '@/components-new/ui/organisms/DeleteDrawer/CancelButton';
import DeleteButton from '@/components-new/ui/organisms/DeleteDrawer/DeleteButton';

export interface DeleteConfirmationDrawerProps {
  open: boolean;
  title?: string;
  description?: string; // alias de confirmationText
  additionalText?: string;
  subject?: string;
  /** Show loading state on Delete button */
  isLoading?: boolean;
  onCancel?: () => void;
  onConfirm?: (subject: string) => void;
}

const DeleteConfirmationDrawer: React.FC<DeleteConfirmationDrawerProps> = ({
  open,
  title,
  description,
  additionalText = 'This action cannot be undone.',
  subject = 'item',
  onCancel,
  onConfirm,
  isLoading,
}) => {
  const computedTitle = title ?? `Delete ${subject}`;
  const computedConfirmation =
    description ?? `Sure you want to delete this ${subject}?`;

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.handle} />

          <Text style={styles.title}>{computedTitle}</Text>

          <View style={styles.divider} />

          <View style={styles.messageWrapper}>
            <Text style={styles.confirmation}>{computedConfirmation}</Text>
            <Text style={styles.additional}>{additionalText}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.buttonRow}>
            <CancelButton onPress={onCancel} />
            <View style={{ width: 16 }} />
            <DeleteButton
              onPress={() => (isLoading ? undefined : onConfirm?.(subject))}
              label={isLoading ? 'Deleting...' : undefined}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 36,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 351,
  },
  handle: {
    width: 38,
    height: 3,
    borderRadius: 100,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 34,
    color: '#DD3B3B',
    textAlign: 'center',
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  messageWrapper: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  confirmation: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  additional: {
    fontFamily: 'Urbanist',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    color: '#616161',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});

export default DeleteConfirmationDrawer;
