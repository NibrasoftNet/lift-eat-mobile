import { View, Text } from 'react-native';

export type BadgeProps = {
  label?: string;
  children?: React.ReactNode;
  variant?: 'solid' | 'outline';
  color?: string;
  className?: string;
};

const Badge = ({ label, children, variant = 'solid', color = 'primary', className = '' }: BadgeProps) => {
  const baseStyles = 'px-2 py-1 rounded-full items-center justify-center';
  const variantStyles = variant === 'solid' 
    ? `bg-${color}-500 text-white` 
    : `border border-${color}-500 text-${color}-500`;

  return (
    <View className={`${baseStyles} ${variantStyles} ${className}`}>
      <Text className="text-xs font-medium">{children || label}</Text>
    </View>
  );
};

export default Badge;
