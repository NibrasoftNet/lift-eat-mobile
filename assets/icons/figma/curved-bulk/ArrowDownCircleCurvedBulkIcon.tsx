import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleCurvedBulkIcon component
 */
export const ArrowDownCircleCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.25C5.052 2.25 2.5 4.801 2.5 12C2.5 19.198 5.052 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.801 19.448 2.25 12.25 2.25Z" fill={color} />
    <Path d="M12.2496 14.7947C13.5326 14.7947 15.3616 12.4057 16.3376 10.9817C16.5716 10.6397 16.4846 10.1727 16.1436 9.93971C15.8006 9.70571 15.3336 9.79371 15.1016 10.1337C14.0136 11.7207 12.6666 13.1987 12.2796 13.2957C11.8336 13.1987 10.4866 11.7207 9.3986 10.1337C9.1666 9.79371 8.6966 9.70571 8.3566 9.93971C8.0146 10.1727 7.9276 10.6397 8.1616 10.9817C9.1376 12.4057 10.9666 14.7947 12.2496 14.7947Z" fill={color} />
  </Svg>
);

export default ArrowDownCircleCurvedBulkIcon;
