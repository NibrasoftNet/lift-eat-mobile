import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareCurvedBoldIcon component
 */
export const ArrowUpSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.419 12.3C16.29 12.387 16.145 12.428 16.001 12.428C15.76 12.428 15.523 12.312 15.378 12.097C14.585 10.917 13.669 9.819 13 9.194V16.086C13 16.5 12.664 16.836 12.25 16.836C11.836 16.836 11.5 16.5 11.5 16.086V9.187C10.838 9.81 9.919 10.912 9.122 12.097C8.892 12.44 8.427 12.532 8.081 12.3C7.738 12.07 7.647 11.603 7.878 11.26C8.705 10.029 10.788 7.164 12.25 7.164C13.712 7.164 15.795 10.029 16.622 11.26C16.854 11.603 16.762 12.07 16.419 12.3ZM12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.198 5.052 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareCurvedBoldIcon;
