import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoveryRegularLightOutlineIcon component
 */
export const DiscoveryRegularLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.2116 11.212L10.1646 14.559L13.5106 13.511L14.5586 10.164L11.2116 11.212ZM9.02057 16.452C8.82457 16.452 8.63257 16.375 8.48957 16.233C8.29257 16.035 8.22057 15.744 8.30457 15.479L9.89757 10.39C9.97057 10.154 10.1546 9.97101 10.3886 9.89801L15.4776 8.30501C15.7446 8.22001 16.0346 8.29301 16.2326 8.49001C16.4296 8.68801 16.5016 8.97901 16.4176 9.24401L14.8256 14.333C14.7526 14.568 14.5676 14.752 14.3336 14.825L9.24457 16.418C9.17057 16.441 9.09457 16.452 9.02057 16.452Z" fill={color} />
    <Path d="M2 2H22.7218V22.7217H2V2Z" fill={"white"} />
    <Path d="M12.361 3.5C7.475 3.5 3.5 7.476 3.5 12.361C3.5 17.247 7.475 21.222 12.361 21.222C17.247 21.222 21.222 17.247 21.222 12.361C21.222 7.476 17.247 3.5 12.361 3.5ZM12.361 22.722C6.648 22.722 2 18.074 2 12.361C2 6.648 6.648 2 12.361 2C18.074 2 22.722 6.648 22.722 12.361C22.722 18.074 18.074 22.722 12.361 22.722Z" fill={color} />
  </Svg>
);

export default DiscoveryRegularLightOutlineIcon;
