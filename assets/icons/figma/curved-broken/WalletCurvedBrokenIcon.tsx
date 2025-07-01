import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WalletCurvedBrokenIcon component
 */
export const WalletCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M21.157 14.4219H17.271C15.855 14.4219 14.708 13.2739 14.708 11.8579C14.708 10.4429 15.855 9.29492 17.271 9.29492H18.879" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.7081 11.7998H17.4111" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.5918 7.89062H11.6518" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.60471 20.1049C4.00771 19.2039 2.69971 16.8029 2.69971 11.9999C2.69971 5.59494 5.02471 3.46094 12.0007 3.46094C18.9757 3.46094 21.3007 5.59494 21.3007 11.9999C21.3007 18.4029 18.9757 20.5389 12.0007 20.5389" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default WalletCurvedBrokenIcon;
