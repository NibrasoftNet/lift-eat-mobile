import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { LayoutGrid, LayoutList } from 'lucide-react-native';

export type ViewMode = 'list' | 'grid';

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <HStack className="bg-white rounded-lg p-1">
      <Pressable
        onPress={() => onToggle('list')}
        className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100' : ''}`}
      >
        <Icon
          as={LayoutList}
          size="sm"
          className={viewMode === 'list' ? 'text-primary-600' : 'text-gray-400'}
        />
      </Pressable>
      <Pressable
        onPress={() => onToggle('grid')}
        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100' : ''}`}
      >
        <Icon
          as={LayoutGrid}
          size="sm"
          className={viewMode === 'grid' ? 'text-primary-600' : 'text-gray-400'}
        />
      </Pressable>
    </HStack>
  );
}
