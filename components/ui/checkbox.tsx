'use client';

import React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

// Import du checkbox de gluestack-ui
import {
  Checkbox as GluestackCheckbox,
  CheckboxIndicator as GluestackCheckboxIndicator,
  CheckboxIcon as GluestackCheckboxIcon,
  CheckboxLabel as GluestackCheckboxLabel,
  CheckboxGroup as GluestackCheckboxGroup,
} from '@gluestack-ui/themed';

// Exporter les composants pour une utilisation dans l'application
export const Checkbox = GluestackCheckbox;
export const CheckboxIndicator = GluestackCheckboxIndicator;
export const CheckboxIcon = GluestackCheckboxIcon;
export const CheckboxLabel = GluestackCheckboxLabel;
export const CheckboxGroup = GluestackCheckboxGroup;
