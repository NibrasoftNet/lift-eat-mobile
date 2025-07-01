import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleSharpLightBorderIcon component
 */
export const DangerTriangleSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M21.5 20.3479L21.1369 20.825H3.32879L3 20.3479L12.1794 4.24463H12.3255L21.5 20.3479Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2612 17.3385H12.2703" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2677 14.5506V11.7495" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DangerTriangleSharpLightBorderIcon;
