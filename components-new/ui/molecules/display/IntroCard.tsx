import React from 'react';
import Box from '@/components-new/ui/atoms/base/Box';
import Text from '@/components-new/ui/atoms/base/Text';

interface IntroCardProps {
  title: string;
  description: string;
}

/**
 * IntroCard – simple informational card used on intro screen.
 * Utilise les nouveaux composants `Box` et `Text` du design system.
 */
const IntroCard: React.FC<IntroCardProps> = ({ title, description }) => {
  return (
    <Box
      bg="#FFFFFF"
      px={24}
      py={32}
      rounded="lg"
      shadow="md"
      alignItems="center"
    >
      <Text variant="h2" mb={8} align="center">
        {title}
      </Text>
      <Text variant="body" align="center">
        {description}
      </Text>
    </Box>
  );
};

export default IntroCard;
