import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleRegularLightBorderIcon component
 */
export const ArrowLeftCircleRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12 2.75024C6.892 2.75024 2.75 6.89124 2.75 12.0002C2.75 17.1082 6.892 21.2502 12 21.2502C17.108 21.2502 21.25 17.1082 21.25 12.0002C21.25 6.89124 17.108 2.75024 12 2.75024Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.4424 8.52905L9.95638 12.0001L13.4424 15.4711" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftCircleRegularLightBorderIcon;
