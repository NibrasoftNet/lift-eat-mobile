import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2CurvedLightOutlineIcon component
 */
export const ArrowLeft2CurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.499 19.7507C15.369 19.7507 15.238 19.7177 15.118 19.6467C14.364 19.1997 7.75 15.1917 7.75 12.0007C7.75 8.81067 14.363 4.80167 15.118 4.35467C15.473 4.14367 15.935 4.26167 16.145 4.61867C16.356 4.97567 16.238 5.43567 15.882 5.64667C13.318 7.16567 9.25 10.2337 9.25 12.0007C9.25 13.7707 13.318 16.8377 15.882 18.3547C16.238 18.5657 16.356 19.0257 16.145 19.3827C16.005 19.6187 15.756 19.7507 15.499 19.7507Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft2CurvedLightOutlineIcon;
