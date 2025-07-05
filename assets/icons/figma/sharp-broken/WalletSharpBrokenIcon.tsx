import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WalletSharpBrokenIcon component
 */
export const WalletSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.0317 16.7098H17.8057C16.3097 16.7088 15.0977 15.6058 15.0967 14.2438C15.0967 12.8828 16.3097 11.7788 17.8057 11.7788H21.8797"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.49414 21.2501H2.61914V5.72607H21.8801V21.2501H10.6021"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.2481 2.751L2.61914 2.75V21.25"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.18457 10.2939H12.6176"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WalletSharpBrokenIcon;
