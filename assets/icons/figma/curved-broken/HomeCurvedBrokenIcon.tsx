import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HomeCurvedBrokenIcon component
 */
export const HomeCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.09277 16.1357H14.9078"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0001 22C4.37306 22 2.41406 22 2.41406 13.713C2.41406 8.082 3.02806 8.475 6.33306 5.41C7.77906 4.246 10.0291 2 11.9721 2C13.9141 2 16.2091 4.235 17.6681 5.41C20.9731 8.475 21.5861 8.082 21.5861 13.713C21.5861 20.228 20.3751 21.621 16.1521 21.919"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HomeCurvedBrokenIcon;
