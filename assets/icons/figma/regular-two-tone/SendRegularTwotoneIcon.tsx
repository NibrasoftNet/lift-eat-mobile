import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SendRegularTwotoneIcon component
 */
export const SendRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.7121 7.72681L9.89111 13.5478" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.8912 13.548L3.0762 9.381C2.1832 8.835 2.3642 7.488 3.3702 7.197L19.4602 2.549C20.3752 2.284 21.2212 3.138 20.9472 4.05L16.1732 20.014C15.8742 21.014 14.5332 21.186 13.9912 20.294L9.8912 13.548" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default SendRegularTwotoneIcon;
