import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image3SharpBrokenIcon component
 */
export const Image3SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M5.51172 18.5068L7.39572 16.0018H7.50972L10.3357 18.5378H10.5407L14.8567 12.2568H15.0137L18.1867 16.7328" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.89729 7.12354C10.0323 7.12454 10.9523 8.04454 10.9533 9.17854C10.9533 10.3145 10.0333 11.2345 8.89729 11.2345C7.76329 11.2345 6.84229 10.3145 6.84229 9.17854" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 14.549V3.354H3V21.854H21.5V18.824" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Image3SharpBrokenIcon;
