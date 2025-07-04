import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownloadSharpBrokenIcon component
 */
export const PaperDownloadSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M8.8642 21.3887H19.9252V8.20667L14.8182 2.88867H4.5752V21.3887" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.1133 17.6717V9.82568" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.52637 15.0845C9.85637 15.0845 11.1134 16.2555 11.1134 17.6715" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.7003 15.0845C12.3703 15.0845 11.1133 16.2555 11.1133 17.6715" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3423 5.44238V8.78838H19.4493" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperDownloadSharpBrokenIcon;
