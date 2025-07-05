import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoCurvedBrokenIcon component
 */
export const VideoCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.4679 13.3232C21.4029 14.9982 21.2229 16.4392 20.9409 16.7402C20.5119 17.2072 18.0269 15.7972 16.1689 14.3502"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.1694 9.63558C18.0084 8.17858 20.4744 6.76858 20.9414 7.27358C21.2144 7.56658 21.3824 8.74358 21.4544 10.1756"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.36123 18.6201C3.54823 17.9301 2.53223 15.9841 2.53223 12.0001C2.53223 6.80715 4.25723 5.07715 9.43323 5.07715C14.6092 5.07715 16.3332 6.80715 16.3332 12.0001C16.3332 17.1911 14.6092 18.9231 9.43323 18.9231"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VideoCurvedBrokenIcon;
