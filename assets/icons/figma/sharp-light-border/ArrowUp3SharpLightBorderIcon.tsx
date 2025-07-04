import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3SharpLightBorderIcon component
 */
export const ArrowUp3SharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.2495 4L12.2495 19.9998" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.58946 9.66016C9.49921 9.66016 12.2495 7.09758 12.2495 4.00011" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.9096 9.66016C14.9998 9.66016 12.2495 7.09758 12.2495 4.00011" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUp3SharpLightBorderIcon;
