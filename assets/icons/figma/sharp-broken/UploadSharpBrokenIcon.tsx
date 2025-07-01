import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadSharpBrokenIcon component
 */
export const UploadSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.8804 11.3389H21.5004V21.8629H9.73242" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.813 21.8629H3V11.3389H7.62" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 2.41406V16.3531" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.66016 7.01006C10.0202 7.01006 12.2502 4.92906 12.2502 2.41406" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.85 7.01006C14.48 7.01006 12.25 4.92906 12.25 2.41406" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default UploadSharpBrokenIcon;
