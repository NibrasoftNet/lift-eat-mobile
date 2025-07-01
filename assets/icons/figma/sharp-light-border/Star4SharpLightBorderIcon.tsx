import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star4SharpLightBorderIcon component
 */
export const Star4SharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.75C13.8358 7.03544 17.2146 10.4142 21.5 12C17.2146 13.5858 13.8358 16.9646 12.25 21.25C10.6642 16.9646 7.28544 13.5858 3 12C7.28544 10.4142 10.6642 7.03544 12.25 2.75Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Star4SharpLightBorderIcon;
