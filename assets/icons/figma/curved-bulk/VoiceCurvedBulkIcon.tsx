import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceCurvedBulkIcon component
 */
export const VoiceCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M19.3842 13.4062H5.11621C4.70221 13.4062 4.36621 13.7422 4.36621 14.1562C4.36621 14.5703 4.70221 14.9062 5.11621 14.9062H6.13121C6.47321 17.7083 8.69821 19.9332 11.5002 20.2752V21.9782C11.5002 22.3922 11.8362 22.7282 12.2502 22.7282C12.6642 22.7282 13.0002 22.3922 13.0002 21.9782V20.2752C15.8032 19.9332 18.0272 17.7083 18.3692 14.9062H19.3842C19.7982 14.9062 20.1342 14.5703 20.1342 14.1562C20.1342 13.7422 19.7982 13.4062 19.3842 13.4062Z" fill={color} />
    <Path d="M6.58008 11.4015H17.9191C18.1961 11.4015 18.4191 11.1775 18.4191 10.9015V8.64752C18.4191 5.24652 15.6521 2.47852 12.2491 2.47852C8.84808 2.47852 6.08008 5.24652 6.08008 8.64752V10.9015C6.08008 11.1775 6.30408 11.4015 6.58008 11.4015Z" fill={color} />
  </Svg>
);

export default VoiceCurvedBulkIcon;
