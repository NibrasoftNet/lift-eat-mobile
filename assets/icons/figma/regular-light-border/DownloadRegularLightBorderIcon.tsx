import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadRegularLightBorderIcon component
 */
export const DownloadRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.1221 15.4361L12.1221 3.39514" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.0381 12.5084L12.1221 15.4364L9.20609 12.5084" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.7551 8.12805H17.6881C19.7231 8.12805 21.3721 9.77705 21.3721 11.8131V16.6971C21.3721 18.7271 19.7271 20.3721 17.6971 20.3721L6.55707 20.3721C4.52207 20.3721 2.87207 18.7221 2.87207 16.6871V11.8021C2.87207 9.77305 4.51807 8.12805 6.54707 8.12805L7.48907 8.12805" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DownloadRegularLightBorderIcon;
