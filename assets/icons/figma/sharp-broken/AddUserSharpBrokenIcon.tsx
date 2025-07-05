import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AddUserSharpBrokenIcon component
 */
export const AddUserSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M10.2051 21.2494C7.62811 21.2564 5.21311 20.7744 3.16211 19.5234C4.18111 16.3014 6.94511 14.8104 10.2051 14.8184C13.4611 14.8104 16.2301 16.3054 17.2481 19.5234C16.0981 20.2254 14.8321 20.6854 13.4891 20.9524"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.293 8.66846V12.6785"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.338 10.6733H17.248"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.17 2.75C12.611 2.75 14.59 4.729 14.59 7.17C14.59 9.611 12.611 11.589 10.17 11.589C7.729 11.589 5.75 9.611 5.75 7.17C5.75 6.318 5.991 5.523 6.408 4.848"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default AddUserSharpBrokenIcon;
