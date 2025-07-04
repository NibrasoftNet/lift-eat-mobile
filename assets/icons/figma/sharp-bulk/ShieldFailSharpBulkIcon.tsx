import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldFailSharpBulkIcon component
 */
export const ShieldFailSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M3.88184 3.09277V12.6428C3.88184 19.5028 12.0228 22.0468 12.1048 22.0708L12.2498 22.1148L12.3948 22.0708C12.4768 22.0468 20.6178 19.5028 20.6178 12.6428V3.09277H3.88184Z" fill={color} />
    <Path d="M14.1616 14.6738L15.2226 13.6128L13.2956 11.6858L15.2226 9.75875L14.1616 8.69775L12.2346 10.6248L10.3076 8.69775L9.24756 9.75875L11.1746 11.6858L9.24756 13.6128L10.3076 14.6738L12.2346 12.7468L14.1616 14.6738Z" fill={color} />
  </Svg>
);

export default ShieldFailSharpBulkIcon;
