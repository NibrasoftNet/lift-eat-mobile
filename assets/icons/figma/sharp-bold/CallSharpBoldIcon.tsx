import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSharpBoldIcon component
 */
export const CallSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.8854 14.4549L13.9404 16.1499C13.4204 15.9699 11.9254 15.3669 10.5584 13.9999C9.27541 12.7169 8.73941 11.2999 8.58241 10.8049L10.2814 7.85393L6.58441 2.77393L6.19441 3.00393C4.61241 3.93193 3.45041 5.09193 2.54141 6.65593L2.48341 6.81493C1.96941 9.55793 3.53841 13.6019 6.38741 16.8779C9.47841 20.4319 13.4894 22.4339 17.4734 22.4339C17.6534 22.4339 17.8334 22.4309 18.0134 22.4219L18.1324 22.4169L18.2354 22.3589C19.8374 21.4609 21.0014 20.2969 21.8984 18.6949L22.1134 18.3099L16.8854 14.4549Z" fill={color} />
  </Svg>
);

export default CallSharpBoldIcon;
