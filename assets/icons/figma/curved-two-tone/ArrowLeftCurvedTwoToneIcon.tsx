import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCurvedTwoToneIcon component
 */
export const ArrowLeftCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M4.25 12.2744L19.25 12.2744" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.3003 18.299C10.3003 18.299 4.25029 15.038 4.25029 12.276C4.25029 9.512 10.3003 6.25 10.3003 6.25" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftCurvedTwoToneIcon;
