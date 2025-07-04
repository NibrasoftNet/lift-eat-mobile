import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DrinkBottleRegularBoldIcon component
 */
export const DrinkBottleRegularBoldIcon = ({ color = "#607D8A", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 50"
    fill="none"
    {...props}
  >
    <Path d="M24.458 136.027H24.0256V134.828H24.458V136.027ZM24.4669 122.055V133.915H24.0493V122.055H15.728V112.582H24.0493V110.691V110.462V100.936H24.4669V110.462V110.691V112.582H26.9218V100.355C26.9218 100.158 26.8507 99.9685 26.7204 99.8208L20.3655 91.525V83H18.18H17.7417H15.5563V91.525L9.20136 99.8208C9.07107 99.9685 9 100.158 9 100.355V139.788C9 140.457 9.5419 141 10.2112 141H15.3372H20.5846H25.7106C26.3799 141 26.9218 140.457 26.9218 139.788V122.055H24.4669Z" fill={color} />
  </Svg>
);

export default DrinkBottleRegularBoldIcon;
