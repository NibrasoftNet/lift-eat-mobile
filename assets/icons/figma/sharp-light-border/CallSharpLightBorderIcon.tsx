import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSharpLightBorderIcon component
 */
export const CallSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M18.0667 21.8417C8.91748 22.2605 2.10415 11.8871 3.05077 6.82576C3.91931 5.33331 5.03257 4.22792 6.52252 3.354L9.76304 7.80524L8.11965 10.6593C8.11965 10.6593 8.57344 12.5647 10.2814 14.2726C12.074 16.0652 14.0736 16.6133 14.0736 16.6133L16.9277 14.9699L21.5385 18.3699C20.6807 19.9025 19.5992 20.9839 18.0667 21.8417Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallSharpLightBorderIcon;
