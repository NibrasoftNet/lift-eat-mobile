import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterCurvedTwoToneIcon component
 */
export const FilterCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.4842 17.2442H4.01172"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.5454 17.2452C14.5454 19.287 15.2263 19.967 17.2672 19.967C19.3081 19.967 19.989 19.287 19.989 17.2452C19.989 15.2034 19.3081 14.5234 17.2672 14.5234C15.2263 14.5234 14.5454 15.2034 14.5454 17.2452Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.5171 6.75499H19.9887"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.4557 6.75402C9.4557 4.71312 8.77481 4.03223 6.73391 4.03223C4.69213 4.03223 4.01123 4.71312 4.01123 6.75402C4.01123 8.79581 4.69213 9.47581 6.73391 9.47581C8.77481 9.47581 9.4557 8.79581 9.4557 6.75402Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default FilterCurvedTwoToneIcon;
