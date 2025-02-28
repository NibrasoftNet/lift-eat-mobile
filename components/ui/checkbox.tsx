import React from 'react';
import { Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CheckboxProps {
    value: boolean;
    onChange: (value: boolean) => void;
    accessibilityLabel?: string;
}

export const Checkbox = ({ value, onChange, accessibilityLabel }: CheckboxProps) => {
    return (
        <Pressable
            onPress={() => onChange(!value)}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: value }}
            className={`w-6 h-6 rounded border-2 justify-center items-center ${
                value ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'
            }`}
        >
            {value && <FontAwesome name="check" size={14} color="white" />}
        </Pressable>
    );
};
