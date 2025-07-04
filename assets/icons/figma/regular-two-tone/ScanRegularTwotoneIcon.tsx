import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ScanRegularTwotoneIcon component
 */
export const ScanRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M22.6315 13.0143H1.5" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.7501 13.0144V17.5454C20.7501 19.3735 19.2541 20.8705 17.425 20.8705H15.7812" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.38135 13.0144V17.5495C3.38135 19.3818 4.86582 20.8674 6.69811 20.8695L8.37849 20.8705" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.7501 8.7779V6.82514C20.7501 4.996 19.2541 3.5 17.425 3.5H15.7812" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.38135 8.7779V6.82095C3.38135 4.98867 4.86582 3.50314 6.69811 3.50105L8.37849 3.5" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ScanRegularTwotoneIcon;
