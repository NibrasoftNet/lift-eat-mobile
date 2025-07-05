import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2CurvedBoldIcon component
 */
export const ArrowLeft2CurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.749 19.9995C15.576 19.9995 15.4 19.9545 15.24 19.8595C13.99 19.1195 7.75 15.2615 7.75 11.9995C7.75 8.73849 13.989 4.87949 15.24 4.13949C15.717 3.85849 16.33 4.01549 16.61 4.48949C16.892 4.96549 16.734 5.57849 16.26 5.85949C13.635 7.41549 9.75 10.4425 9.75 11.9995C9.75 13.5595 13.634 16.5855 16.26 18.1395C16.734 18.4205 16.892 19.0335 16.61 19.5095C16.424 19.8245 16.091 19.9995 15.749 19.9995Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft2CurvedBoldIcon;
