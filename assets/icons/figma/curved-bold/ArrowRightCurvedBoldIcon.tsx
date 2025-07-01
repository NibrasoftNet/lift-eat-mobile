import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCurvedBoldIcon component
 */
export const ArrowRightCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M20.75 11.9996C20.75 8.80157 15.273 5.68757 14.175 5.09557C13.688 4.83257 13.082 5.01457 12.82 5.50157C12.559 5.98657 12.739 6.59357 13.226 6.85557C15.057 7.84457 17.48 9.58157 18.385 11.0006H4.75C4.197 11.0006 3.75 11.4476 3.75 12.0006C3.75 12.5526 4.197 13.0006 4.75 13.0006H18.383C17.477 14.4196 15.056 16.1566 13.226 17.1446C12.739 17.4076 12.559 18.0136 12.82 18.4996C13.001 18.8346 13.346 19.0246 13.701 19.0246C13.861 19.0246 14.024 18.9866 14.175 18.9046C15.272 18.3126 20.745 15.2006 20.75 12.0026C20.75 12.0016 20.75 11.9996 20.75 11.9996Z" fill={color} />
  </Svg>
);

export default ArrowRightCurvedBoldIcon;
