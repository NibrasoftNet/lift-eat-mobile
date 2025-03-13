import React from 'react';
import { View } from 'react-native';
import RulerPicker from '@/components/ui/ruler-picker/RulerPicker';

export default function CompanyPlans() {
  const handleValueChange = (value: number) => {
    console.log('Selected Value:', value);
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <RulerPicker
        initialValue={70}
        minValue={10}
        maxValue={200}
        step={1}
        unit="Kg"
        onValueChange={handleValueChange}
      />
    </View>
  );
}
