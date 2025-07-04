import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleRegularLightBorderIcon component
 */
export const DangerTriangleRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M4.81409 20.4368H19.1971C20.7791 20.4368 21.7721 18.7267 20.9861 17.3527L13.8001 4.78775C13.0091 3.40475 11.0151 3.40375 10.2231 4.78675L3.02509 17.3518C2.23909 18.7258 3.23109 20.4368 4.81409 20.4368Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.995 16.5H12.005" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M12.0024 13.4147V10.3147" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DangerTriangleRegularLightBorderIcon;
