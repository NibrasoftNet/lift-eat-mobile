import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareRegularLightBorderIcon component
 */
export const ArrowRightSquareRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M21.25 16.3341V7.66512C21.25 4.64512 19.111 2.75012 16.084 2.75012H7.916C4.889 2.75012 2.75 4.63512 2.75 7.66512L2.75 16.3341C2.75 19.3641 4.889 21.2501 7.916 21.2501H16.084C19.111 21.2501 21.25 19.3641 21.25 16.3341Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.0861 12.0001H7.91406" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.3223 8.25217L16.0863 12.0002L12.3223 15.7482" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowRightSquareRegularLightBorderIcon;
