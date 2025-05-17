import React, { createContext, useContext } from 'react';
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import { tv } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

// =========== Types ===========
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarVariant = 'circle' | 'rounded' | 'square';

// Avatar context to share size and variant
type AvatarContextType = {
  size: AvatarSize;
  variant: AvatarVariant;
};

// Avatar component props
interface AvatarProps {
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// AvatarImage component props
interface AvatarImageProps {
  source: ImageSourcePropType;
  alt?: string;
  className?: string;
  style?: StyleProp<ImageStyle>;
  onError?: () => void;
}

// AvatarFallbackText component props
interface AvatarFallbackTextProps {
  text?: string;
  className?: string;
  style?: StyleProp<TextStyle>;
}

// AvatarBadge component props
interface AvatarBadgeProps {
  status?: 'online' | 'offline' | 'busy' | 'away';
  color?: string;
  size?: number | string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

// =========== Context ===========
const AvatarContext = createContext<AvatarContextType>({
  size: 'md',
  variant: 'circle',
});

// =========== Styles ===========
const avatar = tv({
  slots: {
    container:
      'relative flex items-center justify-center bg-gray-200 overflow-hidden',
    fallbackText: 'text-gray-600 font-medium',
  },
  variants: {
    size: {
      xs: {
        container: 'w-6 h-6',
        fallbackText: 'text-xs',
      },
      sm: {
        container: 'w-8 h-8',
        fallbackText: 'text-xs',
      },
      md: {
        container: 'w-10 h-10',
        fallbackText: 'text-sm',
      },
      lg: {
        container: 'w-12 h-12',
        fallbackText: 'text-base',
      },
      xl: {
        container: 'w-16 h-16',
        fallbackText: 'text-lg',
      },
      '2xl': {
        container: 'w-20 h-20',
        fallbackText: 'text-xl',
      },
    },
    variant: {
      circle: {
        container: 'rounded-full',
      },
      rounded: {
        container: 'rounded-lg',
      },
      square: {
        container: 'rounded-none',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'circle',
  },
});

const avatarBadge = tv({
  base: 'absolute border-2 border-white rounded-full bg-gray-300',
  variants: {
    status: {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
    },
    size: {
      xs: 'w-1.5 h-1.5 right-0 bottom-0',
      sm: 'w-2 h-2 right-0 bottom-0',
      md: 'w-2.5 h-2.5 right-0 bottom-0',
      lg: 'w-3 h-3 right-0 bottom-0',
      xl: 'w-3.5 h-3.5 right-0 bottom-0',
      '2xl': 'w-4 h-4 right-0 bottom-0',
    },
  },
  defaultVariants: {
    status: 'offline',
    size: 'md',
  },
});

// =========== Components ===========

// Main Avatar component
const Avatar = React.forwardRef<View, AvatarProps>(
  ({ size = 'md', variant = 'circle', className, style, children }, ref) => {
    const slots = avatar({ size, variant });

    return (
      <AvatarContext.Provider value={{ size, variant }}>
        <View
          ref={ref}
          className={cn(slots.container(), className)}
          style={style}
        >
          {children}
        </View>
      </AvatarContext.Provider>
    );
  },
);

Avatar.displayName = 'Avatar';

// Avatar Image component
const AvatarImage = React.forwardRef<Image, AvatarImageProps>(
  ({ source, alt, className, style, onError }, ref) => {
    return (
      <Image
        ref={ref}
        source={source}
        accessibilityLabel={alt}
        className={cn('w-full h-full', className)}
        style={style}
        onError={onError}
      />
    );
  },
);

AvatarImage.displayName = 'AvatarImage';

// Avatar Fallback Text component
const AvatarFallbackText = React.forwardRef<Text, AvatarFallbackTextProps>(
  ({ text, className, style }, ref) => {
    const { size } = useContext(AvatarContext);
    const slots = avatar({ size });

    // Generate initials from text
    const initials = text
      ? text
          .split(' ')
          .map((word) => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : '';

    return (
      <Text
        ref={ref}
        className={cn(slots.fallbackText(), className)}
        style={style}
      >
        {initials}
      </Text>
    );
  },
);

AvatarFallbackText.displayName = 'AvatarFallbackText';

// Avatar Badge component
const AvatarBadge = React.forwardRef<View, AvatarBadgeProps>(
  ({ status, color, size: badgeSize, className, style }, ref) => {
    const { size } = useContext(AvatarContext);
    const badgeStyles = avatarBadge({ status, size });

    return (
      <View
        ref={ref}
        className={cn(badgeStyles, className)}
        style={[{ backgroundColor: color }, style]}
      />
    );
  },
);

AvatarBadge.displayName = 'AvatarBadge';

// Re-export all components
export { Avatar, AvatarImage, AvatarFallbackText, AvatarBadge };
