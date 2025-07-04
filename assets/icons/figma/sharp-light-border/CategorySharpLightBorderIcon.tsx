import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CategorySharpLightBorderIcon component
 */
export const CategorySharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Rect x="13.8574" y="14.3936" width="7" height="7" fill={none} stroke={color} />
    <Rect x="2.85742" y="14.3936" width="7" height="7" fill={none} stroke={color} />
    <Rect x="2.85742" y="3.39355" width="7" height="7" fill={none} stroke={color} />
    <Rect x="14.8818" y="2.60645" width="7" height="7" fill={none} stroke={color} />
  </Svg>
);

export default CategorySharpLightBorderIcon;
