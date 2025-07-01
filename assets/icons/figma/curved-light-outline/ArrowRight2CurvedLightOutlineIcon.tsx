import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2CurvedLightOutlineIcon component
 */
export const ArrowRight2CurvedLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M8.501 19.7507C8.631 19.7507 8.762 19.7177 8.882 19.6467C9.636 19.1997 16.25 15.1917 16.25 12.0007C16.25 8.81067 9.637 4.80167 8.882 4.35467C8.527 4.14367 8.065 4.26167 7.855 4.61867C7.644 4.97567 7.762 5.43567 8.118 5.64667C10.682 7.16567 14.75 10.2337 14.75 12.0007C14.75 13.7707 10.682 16.8377 8.118 18.3547C7.762 18.5657 7.644 19.0257 7.855 19.3827C7.995 19.6187 8.244 19.7507 8.501 19.7507Z" fill={color} />
  </Svg>
);

export default ArrowRight2CurvedLightOutlineIcon;
