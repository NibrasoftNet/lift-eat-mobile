import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2CurvedBulkIcon component
 */
export const ArrowUp2CurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.25 7.49992C15.5161 7.49992 19.3711 13.7397 20.1099 14.9906C20.252 15.2304 20.2822 15.5048 20.2168 15.7538C20.1523 15.9994 19.9946 16.2206 19.7588 16.3598C19.2861 16.643 18.6709 16.4828 18.3901 16.0087C16.8369 13.3837 13.812 9.49992 12.25 9.49992V7.49992Z" fill={color} />
    <Path d="M12.2499 9.49988C12.2499 9.49988 12.2499 9.49988 12.2499 9.49988C10.6899 9.49988 7.6649 13.3839 6.1099 16.0089C5.8299 16.4829 5.2169 16.6429 4.7409 16.3599C4.2659 16.0789 4.1079 15.4659 4.3899 14.9909C5.1289 13.7399 8.9839 7.49988 12.2499 7.49988C12.2499 7.49988 12.2499 7.49988 12.2499 7.49988V9.49988Z" fill={color} />
  </Svg>
);

export default ArrowUp2CurvedBulkIcon;
