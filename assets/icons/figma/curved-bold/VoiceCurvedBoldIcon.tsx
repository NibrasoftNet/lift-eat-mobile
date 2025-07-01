import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceCurvedBoldIcon component
 */
export const VoiceCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M6.58051 11.402H17.9195C18.1965 11.402 18.4195 11.178 18.4195 10.902V8.648C18.4195 5.247 15.6525 2.479 12.2495 2.479C8.84851 2.479 6.08051 5.247 6.08051 8.648V10.902C6.08051 11.178 6.30451 11.402 6.58051 11.402Z" fill={color} />
    <Path d="M19.3842 13.4068H5.11621C4.70221 13.4068 4.36621 13.7428 4.36621 14.1568C4.36621 14.5708 4.70221 14.9068 5.11621 14.9068H6.13121C6.47321 17.7088 8.69821 19.9338 11.5002 20.2758V21.9788C11.5002 22.3928 11.8362 22.7288 12.2502 22.7288C12.6642 22.7288 13.0002 22.3928 13.0002 21.9788V20.2758C15.8032 19.9338 18.0272 17.7088 18.3692 14.9068H19.3842C19.7982 14.9068 20.1342 14.5708 20.1342 14.1568C20.1342 13.7428 19.7982 13.4068 19.3842 13.4068Z" fill={color} />
  </Svg>
);

export default VoiceCurvedBoldIcon;
