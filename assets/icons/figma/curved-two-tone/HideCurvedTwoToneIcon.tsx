import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HideCurvedTwoToneIcon component
 */
export const HideCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M6.42 17.7298C4.19 16.2698 2.75 14.0698 2.75 12.1398C2.75 8.85984 6.89 4.83984 12 4.83984C14.09 4.83984 16.03 5.50984 17.59 6.54984" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.8496 8.61035C20.7406 9.74035 21.2596 10.9904 21.2596 12.1404C21.2596 15.4204 17.1096 19.4404 11.9996 19.4404C11.0896 19.4404 10.2006 19.3104 9.36963 19.0804" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.76584 14.3667C9.17084 13.7777 8.83784 12.9747 8.84084 12.1377C8.83684 10.3927 10.2488 8.97469 11.9948 8.97169C12.8348 8.96969 13.6408 9.30269 14.2348 9.89669" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.1093 12.6992C14.8753 13.9912 13.8643 15.0042 12.5723 15.2412" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.8917 4.25L4.11768 20.024" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default HideCurvedTwoToneIcon;
