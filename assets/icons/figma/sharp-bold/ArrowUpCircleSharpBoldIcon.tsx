import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleSharpBoldIcon component
 */
export const ArrowUpCircleSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.717 14.502L12.25 11.019L8.783 14.502L7.72 13.444L12.25 8.893L16.78 13.444L15.717 14.502ZM12.25 2.25C6.874 2.25 2.5 6.624 2.5 12C2.5 17.376 6.874 21.75 12.25 21.75C17.626 21.75 22 17.376 22 12C22 6.624 17.626 2.25 12.25 2.25Z" fill={color} />
  </Svg>
);

export default ArrowUpCircleSharpBoldIcon;
