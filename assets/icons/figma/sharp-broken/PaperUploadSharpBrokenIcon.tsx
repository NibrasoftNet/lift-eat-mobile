import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUploadSharpBrokenIcon component
 */
export const PaperUploadSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M8.9112 21.3887H19.9252V8.20667L14.8182 2.88867H4.5752V21.3887" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.1147 10.6196V18.4656" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.52783 13.2066C9.85783 13.2066 11.1148 12.0346 11.1148 10.6196" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.7017 13.2066C12.3717 13.2066 11.1147 12.0346 11.1147 10.6196" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3438 5.44238V8.78838H19.4507" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperUploadSharpBrokenIcon;
