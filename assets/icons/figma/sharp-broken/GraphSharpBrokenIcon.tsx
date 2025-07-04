import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphSharpBrokenIcon component
 */
export const GraphSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M5.23975 18.9792C4.15475 17.8952 3.41675 16.5132 3.11775 15.0092C2.81875 13.5052 2.97175 11.9462 3.55875 10.5292C4.14575 9.11219 5.13975 7.90119 6.41475 7.04919C7.68975 6.19719 9.18875 5.74219 10.7228 5.74219V13.4962H18.4757C18.4757 15.0302 18.0218 16.5292 17.1698 17.8042C16.3178 19.0792 15.1067 20.0732 13.6897 20.6602C12.2727 21.2472 10.7138 21.4002 9.20975 21.1012" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.7769 10.504V2.75C15.8339 2.75 17.8059 3.567 19.2599 5.021C20.7139 6.475 21.5309 8.448 21.5309 10.504H17.5479" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default GraphSharpBrokenIcon;
