import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleSharpBrokenIcon component
 */
export const DangerTriangleSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M18.866 15.7251L21.5 20.3481L21.137 20.8251H3.329L3 20.3481L12.179 4.24414H12.326L16.167 10.9871" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2601 17.3384H12.2691" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2676 14.551V11.75" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DangerTriangleSharpBrokenIcon;
