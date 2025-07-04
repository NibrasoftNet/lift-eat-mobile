import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2RegularLightBorderIcon component
 */
export const ArrowLeft2RegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.5 19L8.5 12L15.5 5" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeft2RegularLightBorderIcon;
