import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareRegularBoldIcon component
 */
export const ArrowUpSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22 7.92V16.09C22 19.62 19.729 22 16.34 22H7.67C4.28 22 2 19.62 2 16.09V7.92C2 4.38 4.28 2 7.67 2H16.34C19.729 2 22 4.38 22 7.92ZM11.25 9.73V16.08C11.25 16.5 11.59 16.83 12 16.83C12.42 16.83 12.75 16.5 12.75 16.08V9.73L15.22 12.21C15.36 12.35 15.56 12.43 15.75 12.43C15.939 12.43 16.13 12.35 16.28 12.21C16.57 11.92 16.57 11.44 16.28 11.15L12.53 7.38C12.25 7.1 11.75 7.1 11.47 7.38L7.72 11.15C7.43 11.44 7.43 11.92 7.72 12.21C8.02 12.5 8.49 12.5 8.79 12.21L11.25 9.73Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareRegularBoldIcon;
