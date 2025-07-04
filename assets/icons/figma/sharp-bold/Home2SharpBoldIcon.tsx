import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Home2SharpBoldIcon component
 */
export const Home2SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.1466 2.33203L3.30664 8.68603V21.945H10.2056V16.866H14.3276V21.945H21.1926V8.68303L12.1466 2.33203Z" fill={color} />
  </Svg>
);

export default Home2SharpBoldIcon;
