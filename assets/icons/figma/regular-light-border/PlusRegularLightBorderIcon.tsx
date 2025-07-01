import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusRegularLightBorderIcon component
 */
export const PlusRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.0001 8.32727V15.6536" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.6668 11.9905H8.3335" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.6857 2H7.31429C4.04762 2 2 4.31208 2 7.58516V16.4148C2 19.6879 4.0381 22 7.31429 22H16.6857C19.9619 22 22 19.6879 22 16.4148V7.58516C22 4.31208 19.9619 2 16.6857 2Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PlusRegularLightBorderIcon;
