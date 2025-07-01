import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowSharpTwoToneIcon component
 */
export const ShowSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.2576 14.3261C15.2576 16.0721 13.8416 17.4871 12.0956 17.4871C10.3496 17.4871 8.93457 16.0721 8.93457 14.3261C8.93457 12.5791 10.3496 11.1641 12.0956 11.1641C13.8416 11.1641 15.2576 12.5791 15.2576 14.3261Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.3467 14.3253C19.3857 10.1972 15.9027 7.7207 12.0947 7.7207H12.0987C8.29068 7.7207 4.80768 10.1972 2.84668 14.3253" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ShowSharpTwoToneIcon;
