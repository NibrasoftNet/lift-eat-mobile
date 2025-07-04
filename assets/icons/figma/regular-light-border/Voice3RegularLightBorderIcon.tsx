import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Voice3RegularLightBorderIcon component
 */
export const Voice3RegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.0004 22V18.839" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.0003 14.8481V14.8481C9.75618 14.8481 7.93848 13.0218 7.93848 10.7682V6.08095C7.93848 3.82732 9.75618 2 12.0003 2C14.2433 2 16.0611 3.82732 16.0611 6.08095V10.7682C16.0611 13.0218 14.2433 14.8481 12.0003 14.8481Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20 10.8007C20 15.2395 16.418 18.8383 12 18.8383C7.58093 18.8383 4 15.2395 4 10.8007" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.0703 10.0934H16.0604" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.0688 6.75579H16.0584" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Voice3RegularLightBorderIcon;
