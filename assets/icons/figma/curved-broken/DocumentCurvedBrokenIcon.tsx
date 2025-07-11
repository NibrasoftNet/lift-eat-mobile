import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentCurvedBrokenIcon component
 */
export const DocumentCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.595 15.6973H8.375"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.595 11.9375H8.375"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.13 8.17676H8.375"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.0169 7.848C19.1749 4.104 16.8159 2.75 11.9999 2.75C5.70689 2.75 3.60889 5.063 3.60889 12C3.60889 18.937 5.70689 21.25 11.9999 21.25C18.2939 21.25 20.3909 18.937 20.3909 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DocumentCurvedBrokenIcon;
