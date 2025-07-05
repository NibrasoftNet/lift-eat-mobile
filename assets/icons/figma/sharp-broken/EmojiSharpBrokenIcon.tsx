import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EmojiSharpBrokenIcon component
 */
export const EmojiSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 2.88867C17.359 2.88867 21.5 7.02967 21.5 12.1387C21.5 17.2477 17.359 21.3887 12.25 21.3887C7.141 21.3887 3 17.2477 3 12.1387C3 8.97067 4.592 6.17467 7.02 4.50767"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.498 12.6895C16.498 15.0355 14.596 16.9375 12.25 16.9375C9.90395 16.9375 8.00195 15.0355 8.00195 12.6895"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EmojiSharpBrokenIcon;
