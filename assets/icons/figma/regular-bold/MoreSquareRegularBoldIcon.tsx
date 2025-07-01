import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareRegularBoldIcon component
 */
export const MoreSquareRegularBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M7.67 1.99991H16.34C19.73 1.99991 22 4.37991 22 7.91991V16.0899C22 19.6199 19.73 21.9999 16.34 21.9999H7.67C4.28 21.9999 2 19.6199 2 16.0899V7.91991C2 4.37991 4.28 1.99991 7.67 1.99991ZM7.52 13.1999C6.86 13.1999 6.32 12.6599 6.32 11.9999C6.32 11.3399 6.86 10.8009 7.52 10.8009C8.18 10.8009 8.72 11.3399 8.72 11.9999C8.72 12.6599 8.18 13.1999 7.52 13.1999ZM10.8 11.9999C10.8 12.6599 11.34 13.1999 12 13.1999C12.66 13.1999 13.2 12.6599 13.2 11.9999C13.2 11.3399 12.66 10.8009 12 10.8009C11.34 10.8009 10.8 11.3399 10.8 11.9999ZM15.28 11.9999C15.28 12.6599 15.82 13.1999 16.48 13.1999C17.14 13.1999 17.67 12.6599 17.67 11.9999C17.67 11.3399 17.14 10.8009 16.48 10.8009C15.82 10.8009 15.28 11.3399 15.28 11.9999Z" fill={color} />
  </Svg>
);

export default MoreSquareRegularBoldIcon;
