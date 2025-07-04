import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3CurvedLightBorderIcon component
 */
export const ArrowUp3CurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.1064 11.3L12.1064 20.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.1002 3.64613C10.8442 3.64613 6.82919 10.0101 7.55119 10.7321C8.27319 11.4541 15.8582 11.5231 16.6492 10.7321C17.4402 9.94014 13.3552 3.64613 12.1002 3.64613Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUp3CurvedLightBorderIcon;
