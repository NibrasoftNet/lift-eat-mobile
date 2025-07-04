import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ImageCurvedTwoToneIcon component
 */
export const ImageCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M6.0708 16.459C6.0708 16.459 6.8828 14.822 8.0648 14.822C9.2468 14.822 9.8508 16.197 11.1608 16.197C12.4698 16.197 13.9388 12.749 15.4228 12.749C16.9048 12.749 17.9708 15.14 17.9708 15.14" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.1394 9.10487C10.1394 9.96487 9.44241 10.6629 8.58141 10.6629C7.72141 10.6629 7.02441 9.96487 7.02441 9.10487C7.02441 8.24487 7.72141 7.54688 8.58141 7.54688C9.44241 7.54788 10.1394 8.24487 10.1394 9.10487Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.75049 12C2.75049 18.937 5.06349 21.25 12.0005 21.25C18.9375 21.25 21.2505 18.937 21.2505 12C21.2505 5.063 18.9375 2.75 12.0005 2.75C5.06349 2.75 2.75049 5.063 2.75049 12Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ImageCurvedTwoToneIcon;
