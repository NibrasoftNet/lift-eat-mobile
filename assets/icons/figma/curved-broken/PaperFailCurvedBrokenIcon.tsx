import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperFailCurvedBrokenIcon component
 */
export const PaperFailCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.995 21.25C18.295 21.25 20.395 18.94 20.395 12C20.395 10.58 20.305 9.35 20.115 8.3L14.445 2.9C13.715 2.8 12.895 2.75 11.995 2.75C5.70498 2.75 3.60498 5.07 3.60498 12C3.60498 17.627 4.98598 20.21 8.86098 20.986" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.5505 14.714L10.0845 11.248" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.0854 14.714L13.5514 11.248" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.8892 5.49414C13.8892 7.35214 15.3952 8.85714 17.2532 8.85714H20.2042" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperFailCurvedBrokenIcon;
