import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * StarSharpLightBorderIcon component
 */
export const StarSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.75C13.4203 7.28687 16.9631 10.8297 21.5 12C16.9631 13.1703 13.4203 16.7131 12.25 21.25C11.0797 16.7131 7.53687 13.1703 3 12C7.53687 10.8297 11.0797 7.28687 12.25 2.75Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.0013 2.75C19.0013 3.8975 20.3206 5.24836 21.4996 5.24836C20.2752 5.24836 19.0013 6.58523 19.0013 7.74671C19.0013 6.57766 17.648 5.24836 16.5029 5.24836C17.6934 5.24836 19.0013 3.8975 19.0013 2.75Z" fill={color} />
  </Svg>
);

export default StarSharpLightBorderIcon;
