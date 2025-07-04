import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoCurvedLightBorderIcon component
 */
export const VideoCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.1514 9.67253C17.9895 8.21539 20.4561 6.80587 20.9228 7.31063C21.6942 8.1392 21.6276 16.0249 20.9228 16.7773C20.4942 17.244 18.0085 15.8344 16.1514 14.3868" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.51416 12.0371C2.51416 6.84473 4.23892 5.11426 9.41511 5.11426C14.5904 5.11426 16.3151 6.84473 16.3151 12.0371C16.3151 17.2285 14.5904 18.96 9.41511 18.96C4.23892 18.96 2.51416 17.2285 2.51416 12.0371Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VideoCurvedLightBorderIcon;
