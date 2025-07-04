import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleCurvedBrokenIcon component
 */
export const DangerTriangleCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.0002 21C5.50618 21 2.95718 20.539 2.54418 18.203C2.13018 15.868 4.77418 11.477 5.58818 10.029C8.31318 5.184 10.1642 3 12.0002 3C13.8362 3 15.6872 5.184 18.4122 10.029C19.2262 11.477 21.8702 15.868 21.4562 18.203C21.1532 19.922 19.6912 20.626 16.3502 20.878" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.996 15.8945H12.005" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12 8.5V12.395" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DangerTriangleCurvedBrokenIcon;
