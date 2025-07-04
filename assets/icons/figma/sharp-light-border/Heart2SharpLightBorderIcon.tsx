import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Heart2SharpLightBorderIcon component
 */
export const Heart2SharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M21.4999 9.77398C21.49 7.23812 20.1596 4.85331 17.5366 4.00833C15.7355 3.42712 13.7736 3.75034 12.25 5.93781C10.7264 3.75034 8.76447 3.42712 6.96339 4.00833C4.34014 4.85341 3.00971 7.23866 3.00008 9.77485C2.97582 14.8186 8.08662 18.6781 12.2487 20.5228L12.25 20.5223L12.2513 20.5228C16.4136 18.678 21.5248 14.8181 21.4999 9.77398Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.9932 11.4287C15.223 12.7515 13.8533 13.8216 12.2696 13.7942C10.6858 13.8216 9.3161 12.7515 8.5459 11.4287" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Heart2SharpLightBorderIcon;
