import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2CurvedLightOutlineIcon component
 */
export const ArrowDown2CurvedLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M19.7507 8.501C19.7507 8.631 19.7177 8.762 19.6467 8.882C19.1997 9.636 15.1917 16.25 12.0007 16.25C8.81067 16.25 4.80167 9.637 4.35467 8.882C4.14367 8.527 4.26167 8.065 4.61867 7.855C4.97567 7.644 5.43567 7.762 5.64667 8.118C7.16567 10.682 10.2337 14.75 12.0007 14.75C13.7707 14.75 16.8377 10.682 18.3547 8.118C18.5657 7.762 19.0257 7.644 19.3827 7.855C19.6187 7.995 19.7507 8.244 19.7507 8.501Z" fill={color} />
  </Svg>
);

export default ArrowDown2CurvedLightOutlineIcon;
