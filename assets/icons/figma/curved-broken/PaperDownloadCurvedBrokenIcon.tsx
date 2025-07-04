import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownloadCurvedBrokenIcon component
 */
export const PaperDownloadCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.995 21.25C18.295 21.25 20.395 18.94 20.395 12C20.395 10.58 20.305 9.35 20.115 8.3L14.445 2.9C13.715 2.8 12.895 2.75 11.995 2.75C5.70498 2.75 3.60498 5.07 3.60498 12C3.60498 17.205 4.78598 19.806 8.02998 20.781" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.6152 16.0176V9.97656" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.27002 13.6621L11.615 16.0171L13.96 13.6621" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.8892 5.49414C13.8892 7.35214 15.3952 8.85714 17.2532 8.85714H20.2042" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperDownloadCurvedBrokenIcon;
