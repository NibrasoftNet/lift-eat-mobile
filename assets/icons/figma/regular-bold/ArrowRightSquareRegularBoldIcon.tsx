import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareRegularBoldIcon component
 */
export const ArrowRightSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.08 22H7.91C4.38 22 2 19.729 2 16.34V7.67C2 4.28 4.38 2 7.91 2H16.08C19.62 2 22 4.28 22 7.67V16.34C22 19.729 19.62 22 16.08 22ZM14.27 11.25H7.92C7.5 11.25 7.17 11.59 7.17 12C7.17 12.42 7.5 12.75 7.92 12.75H14.27L11.79 15.22C11.65 15.36 11.57 15.56 11.57 15.75C11.57 15.939 11.65 16.13 11.79 16.28C12.08 16.57 12.56 16.57 12.85 16.28L16.62 12.53C16.9 12.25 16.9 11.75 16.62 11.47L12.85 7.72C12.56 7.43 12.08 7.43 11.79 7.72C11.5 8.02 11.5 8.49 11.79 8.79L14.27 11.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightSquareRegularBoldIcon;
