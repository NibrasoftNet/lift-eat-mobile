import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ScanCurvedLightBorderIcon component
 */
export const ScanCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M22.5822 12.8008H1.4502" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.76616 20.9907C5.28616 20.4107 3.56616 18.7007 2.99616 15.2207L2.99516 15.2247C2.87416 14.5047 2.80516 13.6947 2.78516 12.8047" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.2446 12.8037C21.2246 13.6937 21.1546 14.5037 21.0346 15.2237L21.0366 15.2197C20.4656 18.6997 18.7456 20.4097 15.2656 20.9897" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.2661 2.9502C18.7461 3.5202 20.4661 5.2402 21.0361 8.7202" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.99609 8.7202C3.56609 5.2402 5.28609 3.5202 8.76609 2.9502" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ScanCurvedLightBorderIcon;
