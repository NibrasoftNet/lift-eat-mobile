import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlaySharpLightBorderIcon component
 */
export const PlaySharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 3.354C17.3578 3.354 21.5 7.49523 21.5 12.604C21.5 17.7128 17.3578 21.854 12.25 21.854C7.14122 21.854 3 17.7128 3 12.604C3 7.49523 7.14122 3.354 12.25 3.354Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.1713 12.5994L10.6641 9.7373V15.4615L15.1713 12.5994Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PlaySharpLightBorderIcon;
