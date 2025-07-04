import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadRegularTwotoneIcon component
 */
export const UploadRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M7.38948 8.98403H6.45648C4.42148 8.98403 2.77148 10.634 2.77148 12.669V17.544C2.77148 19.578 4.42148 21.228 6.45648 21.228H17.5865C19.6215 21.228 21.2715 19.578 21.2715 17.544V12.659C21.2715 10.63 19.6265 8.98403 17.5975 8.98403L16.6545 8.98403" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.0215 2.19044V14.2314" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.10645 5.1189L12.0214 2.1909L14.9374 5.1189" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default UploadRegularTwotoneIcon;
