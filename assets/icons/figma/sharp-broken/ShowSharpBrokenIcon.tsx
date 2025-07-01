import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowSharpBrokenIcon component
 */
export const ShowSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.2494 11.1641C13.9954 11.1641 15.4114 12.5791 15.4114 14.3261C15.4114 16.0721 13.9954 17.4871 12.2494 17.4871C10.5034 17.4871 9.08838 16.0721 9.08838 14.3261" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 14.3252C19.539 10.1972 16.056 7.72119 12.248 7.72119H12.252C8.444 7.72119 4.961 10.1972 3 14.3252" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ShowSharpBrokenIcon;
