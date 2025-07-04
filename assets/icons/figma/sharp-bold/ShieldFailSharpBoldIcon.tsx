import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldFailSharpBoldIcon component
 */
export const ShieldFailSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.2228 13.6128L14.1618 14.6738L12.2348 12.7468L10.3078 14.6738L9.24784 13.6128L11.1748 11.6858L9.24784 9.75877L10.3078 8.69777L12.2348 10.6248L14.1618 8.69777L15.2228 9.75877L13.2958 11.6858L15.2228 13.6128ZM3.88184 3.09277V12.6428C3.88184 19.5028 12.0228 22.0468 12.1048 22.0708L12.2498 22.1148L12.3948 22.0708C12.4768 22.0468 20.6178 19.5028 20.6178 12.6428V3.09277H3.88184Z" fill={color} />
  </Svg>
);

export default ShieldFailSharpBoldIcon;
