import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3SharpTwoToneIcon component
 */
export const ArrowLeft3SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M4.24951 12L20.2493 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.90967 17.66C9.90967 14.7503 7.34709 12 4.24962 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.90967 6.33995C9.90967 9.2497 7.34709 12 4.24962 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeft3SharpTwoToneIcon;
