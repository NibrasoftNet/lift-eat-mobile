import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSharpTwoToneIcon component
 */
export const ArrowRightSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.1502 12L4.75 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.7002 5.97541L19.7502 11.9994L13.7002 18.0244"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightSharpTwoToneIcon;
