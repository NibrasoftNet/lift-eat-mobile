import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallMissedSharpBoldIcon component
 */
export const CallMissedSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.0357 11.1712L18.4617 8.74523L20.8887 11.1712L21.9487 10.1102L19.5227 7.68523L21.9487 5.25923L20.8887 4.19823L18.4617 6.62423L16.0357 4.19823L14.9747 5.25923L17.4017 7.68523L14.9747 10.1102L16.0357 11.1712Z" fill={color} />
    <Path d="M16.8854 14.4549L13.9404 16.1499C13.4204 15.9699 11.9254 15.3669 10.5584 13.9999C9.27536 12.7169 8.73936 11.2999 8.58236 10.8049L10.2814 7.85393L6.58336 2.77393L6.19336 3.00393C4.61136 3.93193 3.45036 5.09293 2.54136 6.65593L2.48336 6.81493C1.96936 9.55893 3.53936 13.6029 6.38936 16.8799C9.47936 20.4319 13.4904 22.4339 17.4734 22.4339C17.6534 22.4339 17.8334 22.4309 18.0134 22.4219L18.1324 22.4169L18.2354 22.3589C19.8374 21.4609 21.0014 20.2969 21.8984 18.6949L22.1134 18.3099L16.8854 14.4549Z" fill={color} />
  </Svg>
);

export default CallMissedSharpBoldIcon;
