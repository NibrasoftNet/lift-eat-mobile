import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChartSharpTwoToneIcon component
 */
export const ChartSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M17.0865 14.1489V16.9924" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.41367 10.9624V16.9922" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2506 8.07715V16.9923" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 21.7847L21.5 3.28467L3 3.28467L3 21.7847L21.5 21.7847Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ChartSharpTwoToneIcon;
