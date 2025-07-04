import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareSharpTwoToneIcon component
 */
export const EditSquareSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M13.1826 7.89014L16.9834 11.6909L6.82034 21.854L3.0231 21.8505L3.01953 18.0532L13.1826 7.89014Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.1826 7.89014L16.9834 11.6909L6.82034 21.854L3.0231 21.8505L3.01953 18.0532L13.1826 7.89014Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.7432 14.0972L10.757 11.111" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.01927 12.0504V3.354H21.4805V21.854H12.9437" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default EditSquareSharpTwoToneIcon;
