import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UserCurvedBrokenIcon component
 */
export const UserCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M8.92863 20.0614C7.18963 19.7644 5.99463 19.1114 5.99463 17.8214C5.99463 15.8594 8.74363 14.1514 12.0006 14.1514C15.2396 14.1514 18.0066 15.8434 18.0066 17.8044C18.0066 19.7654 15.2576 20.2734 12.0006 20.2734" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.9702 13.4512C20.7242 13.4512 22.2222 14.6402 22.2222 15.7022C22.2222 16.3272 21.7052 17.0082 20.9212 17.1922" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.02983 13.4512C3.27583 13.4512 1.77783 14.6402 1.77783 15.7022C1.77783 16.3272 2.29483 17.0082 3.07983 17.1922" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.3891 10.2983C19.6261 9.96727 20.5381 8.83927 20.5381 7.49627C20.5381 6.09527 19.5451 4.92527 18.2231 4.65527" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.61143 10.2983C4.37343 9.96727 3.46143 8.83927 3.46143 7.49627C3.46143 6.09527 4.45543 4.92527 5.77643 4.65527" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.2679 3.72559C9.49189 4.06759 8.15089 5.63059 8.15089 7.50559C8.14489 9.62359 9.85489 11.3476 11.9739 11.3546H12.0009C14.1269 11.3546 15.8509 9.63159 15.8509 7.50559C15.8509 6.12159 15.1189 4.90759 14.0219 4.22859" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default UserCurvedBrokenIcon;
