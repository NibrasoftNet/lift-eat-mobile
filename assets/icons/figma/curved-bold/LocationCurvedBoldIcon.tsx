import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationCurvedBoldIcon component
 */
export const LocationCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.26 13.573C10.681 13.573 9.397 12.289 9.397 10.71C9.397 9.131 10.681 7.847 12.26 7.847C13.839 7.847 15.124 9.131 15.124 10.71C15.124 12.289 13.839 13.573 12.26 13.573ZM12.25 2.5C7.839 2.5 4.25 6.133 4.25 10.599C4.25 16.007 8.904 21.5 12.25 21.5C15.595 21.5 20.25 16.007 20.25 10.599C20.25 6.133 16.661 2.5 12.25 2.5Z" fill={color} />
  </Svg>
);

export default LocationCurvedBoldIcon;
