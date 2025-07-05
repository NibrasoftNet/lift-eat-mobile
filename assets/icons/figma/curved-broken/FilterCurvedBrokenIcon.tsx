import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterCurvedBrokenIcon component
 */
export const FilterCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.4837 17.2441H4.01074"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.5449 17.2454C14.5449 19.2874 15.2259 19.9674 17.2669 19.9674C19.3079 19.9674 19.9889 19.2874 19.9889 17.2454C19.9889 15.2034 19.3079 14.5234 17.2669 14.5234"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.5166 6.75488H19.9876"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.45474 6.75423C9.45474 4.71323 8.77374 4.03223 6.73374 4.03223C4.69174 4.03223 4.01074 4.71323 4.01074 6.75423C4.01074 8.79623 4.69174 9.47623 6.73374 9.47623"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default FilterCurvedBrokenIcon;
