import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartCurvedLightBorderIcon component
 */
export const HeartCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M2.92202 12.4459C1.84902 9.09595 3.10402 4.93095 6.62102 3.79895C8.47102 3.20195 10.754 3.69995 12.051 5.48895C13.274 3.63395 15.623 3.20595 17.471 3.79895C20.987 4.93095 22.249 9.09595 21.177 12.4459C19.507 17.7559 13.68 20.5219 12.051 20.5219C10.423 20.5219 4.64802 17.8179 2.92202 12.4459Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.7886 7.56348C16.9956 7.68748 17.7506 8.64448 17.7056 9.98548" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default HeartCurvedLightBorderIcon;
