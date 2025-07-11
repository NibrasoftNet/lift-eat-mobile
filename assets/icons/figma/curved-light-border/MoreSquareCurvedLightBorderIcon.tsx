import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareCurvedLightBorderIcon component
 */
export const MoreSquareCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.75 12C2.75 5.063 5.063 2.75 12 2.75C18.937 2.75 21.25 5.063 21.25 12C21.25 18.937 18.937 21.25 12 21.25C5.063 21.25 2.75 18.937 2.75 12Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M15.9935 12H16.0025" fill='none' stroke={color} strokeWidth="2" />
    <Path d="M11.9945 12H12.0035" fill='none' stroke={color} strokeWidth="2" />
    <Path d="M7.9955 12H8.0045" fill='none' stroke={color} strokeWidth="2" />
  </Svg>
);

export default MoreSquareCurvedLightBorderIcon;
