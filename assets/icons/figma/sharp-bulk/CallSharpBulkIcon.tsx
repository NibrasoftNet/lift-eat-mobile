import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSharpBulkIcon component
 */
export const CallSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M8.58241 10.8049C8.73941 11.2999 9.27541 12.7169 10.5584 13.9999L6.38741 16.8779C3.53841 13.6019 1.96941 9.55793 2.48341 6.81493L2.54141 6.65593C3.45041 5.09193 4.61241 3.93193 6.19441 3.00393L6.58441 2.77393L10.2814 7.85393L8.58241 10.8049Z"
      fill={color}
    />
    <Path
      d="M13.9407 16.15L16.8857 14.455L22.1137 18.31L21.8987 18.695C21.0017 20.297 19.8377 21.461 18.2357 22.359L18.1327 22.417L18.0137 22.422C17.8337 22.431 17.6537 22.434 17.4737 22.434C13.4897 22.434 9.4787 20.432 6.3877 16.878L10.5587 14C11.9257 15.367 13.4207 15.97 13.9407 16.15Z"
      fill={color}
    />
  </Svg>
);

export default CallSharpBulkIcon;
