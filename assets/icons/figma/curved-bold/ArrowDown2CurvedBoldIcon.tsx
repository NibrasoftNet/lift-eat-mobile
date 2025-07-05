import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2CurvedBoldIcon component
 */
export const ArrowDown2CurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2499 16.5001C8.9839 16.5001 5.1289 10.2601 4.3899 9.00912C4.1079 8.53412 4.2659 7.92112 4.7409 7.64012C5.2169 7.35712 5.8299 7.51712 6.1099 7.99112C7.6649 10.6161 10.6899 14.5001 12.2499 14.5001C13.8119 14.5001 16.8369 10.6161 18.3899 7.99112C18.6709 7.51712 19.2859 7.35712 19.7589 7.64012C20.2339 7.92012 20.3919 8.53312 20.1099 9.00912C19.3709 10.2601 15.5159 16.5001 12.2499 16.5001Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDown2CurvedBoldIcon;
