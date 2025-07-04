import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * QRSharpBoldIcon component
 */
export const QRSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M6.15 18.279H7.65V16.689H6.15V18.279ZM2.75 21.639H11.06V13.329H2.75V21.639Z" fill={color} />
    <Path d="M16.85 18.279H18.35V16.689H16.85V18.279ZM13.44 21.639H21.75V13.329H13.44V21.639Z" fill={color} />
    <Path d="M14.9443 4.13818H17.3753V2.63818H13.4443V8.25718H14.9443V4.13818Z" fill={color} />
    <Path d="M13.445 10.943H17.165V9.44298H13.445V10.943Z" fill={color} />
    <Path d="M18.5483 2.63818V4.13818H20.2503V5.83918H21.7503V2.63818H18.5483Z" fill={color} />
    <Path d="M20.25 9.44277H18.548V10.9428H21.75V7.01277H20.25V9.44277Z" fill={color} />
    <Path d="M15.7676 5.00288V8.72188H19.0966V7.22188H17.2676V5.00288H15.7676Z" fill={color} />
    <Path d="M19.6934 4.99307L18.1934 5.00307V6.50307H19.6934V4.99307Z" fill={color} />
    <Path d="M6.15 7.58898H7.65V5.98898H6.15V7.58898ZM2.75 10.939H11.06V2.63898H2.75V10.939Z" fill={color} />
  </Svg>
);

export default QRSharpBoldIcon;
