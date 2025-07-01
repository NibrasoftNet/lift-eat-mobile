import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WalletSharpBulkIcon component
 */
export const WalletSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.9722 14.3688C15.9722 15.3138 16.8522 16.0838 17.9312 16.0848H22.5052V12.6538H17.9312C16.8512 12.6538 15.9722 13.4238 15.9722 14.3688Z" fill={color} />
    <Path d="M1.99414 21.8699V5.34424H3.49414V5.35093H18.6231V5.34424H20.1231V5.35093H22.5051V11.1529H17.9311C16.0241 11.1539 14.4721 12.5959 14.4721 14.3689C14.4741 16.1409 16.0251 17.5829 17.9311 17.5839H22.5051V21.8749H2.24414V21.8699H1.99414ZM6.55908 11.1689H13.4921V9.66895H6.55908V11.1689Z" fill={color} />
    <Path d="M20.123 5.34424V2.12598L1.99414 2.125V5.34424H3.49414V3.625L18.623 3.62598V5.34424H20.123Z" fill={color} />
  </Svg>
);

export default WalletSharpBulkIcon;
