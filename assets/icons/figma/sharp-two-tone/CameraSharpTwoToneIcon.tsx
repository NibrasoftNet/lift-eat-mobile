import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CameraSharpTwoToneIcon component
 */
export const CameraSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.29 3.99219L17.022 6.69755H21.5L21.5 20.0082H3.00001L3 6.69755H7.478L9.20901 3.99219H15.29Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.1771 10.5352H18.1861" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.4283 13.2142C15.4283 11.4582 14.0053 10.0352 12.2493 10.0352C10.4933 10.0352 9.07031 11.4582 9.07031 13.2142C9.07031 14.9702 10.4933 16.3932 12.2493 16.3932C14.0053 16.3932 15.4283 14.9702 15.4283 13.2142Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CameraSharpTwoToneIcon;
