import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceCurvedTwoToneIcon component
 */
export const VoiceCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.0337 21.4997V19.3477" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.36475 13.6787C6.36475 16.8097 8.90275 19.3477 12.0337 19.3477C15.1657 19.3477 17.7037 16.8097 17.7037 13.6787" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M4.8999 13.6787H19.1679" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.7037 10.423V8.169C17.7037 5.038 15.1657 2.5 12.0337 2.5C8.90275 2.5 6.36475 5.038 6.36475 8.169V10.423" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VoiceCurvedTwoToneIcon;
