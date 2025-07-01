import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowCurvedTwoToneIcon component
 */
export const ShowCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.1643 12.0516C15.1643 13.7976 13.7483 15.2136 12.0023 15.2136C10.2563 15.2136 8.84033 13.7976 8.84033 12.0516C8.84033 10.3046 10.2563 8.88965 12.0023 8.88965C13.7483 8.88965 15.1643 10.3046 15.1643 12.0516Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.75049 12.052C2.75049 15.332 6.89249 19.354 12.0025 19.354C17.1115 19.354 21.2545 15.335 21.2545 12.052C21.2545 8.769 17.1115 4.75 12.0025 4.75C6.89249 4.75 2.75049 8.772 2.75049 12.052Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ShowCurvedTwoToneIcon;
