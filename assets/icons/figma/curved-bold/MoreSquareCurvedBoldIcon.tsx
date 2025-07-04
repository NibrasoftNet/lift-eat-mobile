import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareCurvedBoldIcon component
 */
export const MoreSquareCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.253 13.5347C15.701 13.5347 15.249 13.0877 15.249 12.5347C15.249 11.9817 15.692 11.5347 16.244 11.5347H16.253C16.805 11.5347 17.253 11.9817 17.253 12.5347C17.253 13.0877 16.805 13.5347 16.253 13.5347ZM12.254 13.5347C11.702 13.5347 11.25 13.0877 11.25 12.5347C11.25 11.9817 11.693 11.5347 12.245 11.5347H12.254C12.806 11.5347 13.254 11.9817 13.254 12.5347C13.254 13.0877 12.806 13.5347 12.254 13.5347ZM8.254 13.5347C7.702 13.5347 7.25 13.0877 7.25 12.5347C7.25 11.9817 7.693 11.5347 8.245 11.5347H8.254C8.806 11.5347 9.254 11.9817 9.254 12.5347C9.254 13.0877 8.806 13.5347 8.254 13.5347ZM12.25 2.78467C5.051 2.78467 2.5 5.33667 2.5 12.5347C2.5 19.7327 5.051 22.2847 12.25 22.2847C19.449 22.2847 22 19.7327 22 12.5347C22 5.33667 19.449 2.78467 12.25 2.78467Z" fill={color} />
  </Svg>
);

export default MoreSquareCurvedBoldIcon;
