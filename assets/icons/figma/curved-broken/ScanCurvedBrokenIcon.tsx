import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ScanCurvedBrokenIcon component
 */
export const ScanCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22.5662 12.8301H12.8672"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.45059 12.8301H1.43359"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.75004 21.02C5.27004 20.44 3.55004 18.73 2.98004 15.25L2.97904 15.254C2.85804 14.534 2.78904 13.724 2.76904 12.834"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.2285 12.834C21.2085 13.724 21.1385 14.534 21.0185 15.254L21.0205 15.25C20.4495 18.73 18.7295 20.44 15.2495 21.02"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.25 2.97949C18.73 3.54949 20.45 5.26949 21.02 8.74949"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.97998 8.74949C3.54998 5.26949 5.26998 3.54949 8.74998 2.97949"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ScanCurvedBrokenIcon;
