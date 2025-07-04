import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ImageCurvedBrokenIcon component
 */
export const ImageCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M6.0708 16.459C6.0708 16.459 6.8828 14.822 8.0648 14.822C9.2468 14.822 9.8508 16.197 11.1608 16.197C12.4698 16.197 13.9388 12.749 15.4228 12.749C16.9048 12.749 17.9708 15.14 17.9708 15.14" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.1389 9.10487C10.1389 9.96487 9.44193 10.6629 8.58093 10.6629C7.72093 10.6629 7.02393 9.96487 7.02393 9.10487C7.02393 8.24487 7.72093 7.54688 8.58093 7.54688" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.531 20.972C19.747 20.179 21.25 17.592 21.25 12C21.25 5.063 18.937 2.75 12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ImageCurvedBrokenIcon;
