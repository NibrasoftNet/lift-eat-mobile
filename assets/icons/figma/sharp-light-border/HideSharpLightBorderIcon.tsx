import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HideSharpLightBorderIcon component
 */
export const HideSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.5 8.01066C19.539 12.1387 16.056 14.6152 12.248 14.6152H12.252C8.444 14.6152 4.961 12.1387 3 8.01066"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.99338 17.1971L9.83789 14.2876"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4265 17.1971L14.582 14.2876"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.8398 11.8794L20.951 13.9905"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.58105 11.8794L3.46995 13.9905"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HideSharpLightBorderIcon;
