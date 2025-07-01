import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SwapCurvedLightBorderIcon component
 */
export const SwapCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.9058 19.4276V6.80957" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.9851 15.3281C20.9851 15.3281 18.8151 19.4281 16.9071 19.4281C14.9991 19.4281 12.8291 15.3281 12.8291 15.3281" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.979 4.60059V17.2186" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.8999 8.69961C2.8999 8.69961 5.0689 4.59961 6.9779 4.59961C8.8859 4.59961 11.0559 8.69961 11.0559 8.69961" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default SwapCurvedLightBorderIcon;
