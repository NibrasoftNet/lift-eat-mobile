import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphSharpLightBorderIcon component
 */
export const GraphSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M18.4764 13.4962C18.4764 15.0297 18.0216 16.5289 17.1696 17.804C16.3176 19.0791 15.1066 20.0729 13.6898 20.6598C12.273 21.2466 10.714 21.4002 9.20987 21.101C7.70578 20.8018 6.32418 20.0634 5.23979 18.979C4.1554 17.8946 3.41692 16.513 3.11774 15.0089C2.81855 13.5048 2.97211 11.9458 3.55897 10.5289C4.14584 9.11211 5.13967 7.90112 6.41478 7.04912C7.68988 6.19712 9.189 5.74237 10.7226 5.74237L10.7226 13.4962H18.4764Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.7773 2.75018C15.8337 2.75018 17.8059 3.5671 19.26 5.02122C20.7141 6.47535 21.5311 8.44756 21.5311 10.504L13.7773 10.504L13.7773 2.75018Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default GraphSharpLightBorderIcon;
