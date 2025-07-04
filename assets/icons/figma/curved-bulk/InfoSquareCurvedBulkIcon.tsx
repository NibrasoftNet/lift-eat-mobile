import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareCurvedBulkIcon component
 */
export const InfoSquareCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.78516C5.052 2.78516 2.5 5.33716 2.5 12.5352C2.5 19.7332 5.052 22.2852 12.25 22.2852C19.448 22.2852 22 19.7332 22 12.5352C22 5.33716 19.448 2.78516 12.25 2.78516Z" fill={color} />
    <Path d="M12.2461 9.78516H12.2551C12.6691 9.78516 13.0011 9.44916 13.0011 9.03516C13.0011 8.62116 12.6601 8.28516 12.2461 8.28516C11.8321 8.28516 11.4961 8.62116 11.4961 9.03516C11.4961 9.44916 11.8321 9.78516 12.2461 9.78516Z" fill={color} />
    <Path d="M12.2501 17.1802C12.6641 17.1802 13.0001 16.8442 13.0001 16.4302V12.5352C13.0001 12.1212 12.6641 11.7852 12.2501 11.7852C11.8361 11.7852 11.5001 12.1212 11.5001 12.5352V16.4302C11.5001 16.8442 11.8361 17.1802 12.2501 17.1802Z" fill={color} />
  </Svg>
);

export default InfoSquareCurvedBulkIcon;
