import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeUpRegularLightBorderIcon component
 */
export const VolumeUpRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M17.0811 8.31445C18.3924 10.6051 18.3924 13.4026 17.0811 15.6861" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.5845 5.90393C22.1345 9.57495 22.1429 14.4173 19.5845 18.0955" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.50185 12.0001C2.49906 13.2298 2.44419 14.907 3.20494 15.5339C3.91453 16.1187 4.41395 15.968 5.70945 16.0631C7.00587 16.1591 9.74195 19.97 11.8512 18.7646C12.9393 17.9089 13.0202 16.1151 13.0202 12.0001C13.0202 7.88515 12.9393 6.09135 11.8512 5.23571C9.74195 4.02938 7.00587 7.84121 5.70945 7.93717C4.41395 8.03225 3.91453 7.88157 3.20494 8.46635C2.44419 9.09328 2.49906 10.7705 2.50185 12.0001Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VolumeUpRegularLightBorderIcon;
