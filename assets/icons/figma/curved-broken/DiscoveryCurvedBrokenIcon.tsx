import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoveryCurvedBrokenIcon component
 */
export const DiscoveryCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12C21.25 6.402 19.744 3.815 15.516 3.025"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.69824 15.3022L10.2722 10.2722L15.3022 8.69824L13.7282 13.7272L11.8882 14.3032"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DiscoveryCurvedBrokenIcon;
