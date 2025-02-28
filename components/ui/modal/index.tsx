import React from 'react';
import RNModal from 'react-native-modal';
import { View, ViewStyle } from 'react-native';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const Modal = {
    Root: ({ isVisible, onClose, children, style }: ModalProps) => (
        <RNModal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            style={style}
            useNativeDriver
            hideModalContentWhileAnimating
        >
            {children}
        </RNModal>
    ),
    Content: ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
        <View style={[{ backgroundColor: 'white', padding: 20, borderRadius: 8 }, style]}>
            {children}
        </View>
    ),
    Header: ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
        <View style={[{ marginBottom: 15 }, style]}>{children}</View>
    ),
    Body: ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
        <View style={style}>{children}</View>
    ),
    Footer: ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
        <View style={[{ marginTop: 15 }, style]}>{children}</View>
    ),
};
