import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleRegularBulkIcon component
 */
export const ArrowLeftCircleRegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12 22.0002C6.485 22.0002 2 17.5142 2 12.0002C2 6.48624 6.485 2.00024 12 2.00024C17.514 2.00024 22 6.48624 22 12.0002C22 17.5142 17.514 22.0002 12 22.0002Z" fill={color} />
    <Path d="M13.4425 16.2209C13.2515 16.2209 13.0595 16.1479 12.9135 16.0019L9.42652 12.5319C9.28552 12.3909 9.20652 12.1999 9.20652 11.9999C9.20652 11.8009 9.28552 11.6099 9.42652 11.4689L12.9135 7.99695C13.2065 7.70495 13.6805 7.70495 13.9735 7.99895C14.2655 8.29295 14.2645 8.76795 13.9715 9.05995L11.0185 11.9999L13.9715 14.9399C14.2645 15.2319 14.2655 15.7059 13.9735 15.9999C13.8275 16.1479 13.6345 16.2209 13.4425 16.2209Z" fill={color} />
  </Svg>
);

export default ArrowLeftCircleRegularBulkIcon;
