import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Logout1SharpBoldIcon component
 */
export const Logout1SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M18.4809 7.6646L17.4229 8.7276L19.9569 11.2496H13.7549V12.7496H19.9569L17.4229 15.2736L18.4819 16.3366L22.8369 11.9996L18.4809 7.6646Z" fill={color} />
    <Path d="M7.49535 11.25L13.7549 11.2496L13.7554 2.25H2.23535V21.75H13.7554L13.7549 12.7496L7.49535 12.75V11.25Z" fill={color} />
  </Svg>
);

export default Logout1SharpBoldIcon;
