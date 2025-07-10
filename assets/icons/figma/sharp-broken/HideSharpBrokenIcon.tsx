import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HideSharpBrokenIcon component
 */
export const HideSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M8.99293 17.1194L9.13793 16.4294"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 7.93359C19.539 12.0616 16.056 14.5386 12.248 14.5386H12.252C8.444 14.5386 4.961 12.0616 3 7.93359"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4274 17.1195L14.5824 14.2095"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.4275 13.3745L20.9515 13.9135"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.58121 11.8022L3.47021 13.9132"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HideSharpBrokenIcon;
