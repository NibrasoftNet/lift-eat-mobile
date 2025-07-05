import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordSharpBrokenIcon component
 */
export const PasswordSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M10.9424 12H17.2604V13.852"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M14.4326 13.852V12" fill={none} stroke={color} strokeWidth="1.5" />
    <Path
      d="M10.9394 12.0004C10.9394 13.0234 10.1104 13.8524 9.08735 13.8524C8.06435 13.8524 7.23535 13.0234 7.23535 12.0004C7.23535 10.9774 8.06435 10.1484 9.08735 10.1484H9.09035C10.1114 10.1494 10.9394 10.9784 10.9394 12.0004Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.845 21.25H21.5V2.75H3V21.25H5.196"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PasswordSharpBrokenIcon;
