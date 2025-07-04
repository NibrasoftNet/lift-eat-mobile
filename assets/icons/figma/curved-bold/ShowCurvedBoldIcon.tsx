import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowCurvedBoldIcon component
 */
export const ShowCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 10.1915C10.92 10.1915 9.83804 11.2735 9.83804 12.6035C9.83804 13.9335 10.92 15.0155 12.25 15.0155C13.58 15.0155 14.662 13.9335 14.662 12.6035C14.662 11.2735 13.58 10.1915 12.25 10.1915Z" fill={color} />
    <Path d="M12.25 16.5158C10.093 16.5158 8.33805 14.7608 8.33805 12.6038C8.33805 10.4468 10.093 8.69176 12.25 8.69176C14.407 8.69176 16.162 10.4468 16.162 12.6038C16.162 14.7608 14.407 16.5158 12.25 16.5158ZM12.25 4.80176C6.84805 4.80176 2.49805 9.06976 2.49805 12.6038C2.49805 16.1378 6.84805 20.4058 12.25 20.4058C17.652 20.4058 22.002 16.1378 22.002 12.6038C22.002 9.06976 17.652 4.80176 12.25 4.80176Z" fill={color} />
  </Svg>
);

export default ShowCurvedBoldIcon;
