import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3CurvedTwoToneIcon component
 */
export const ArrowLeft3CurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.3 11.8936L20.25 11.8936"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.64613 11.8998C3.64613 13.1558 10.0101 17.1708 10.7321 16.4488C11.4541 15.7268 11.5231 8.14181 10.7321 7.35081C9.94014 6.55981 3.64613 10.6448 3.64613 11.8998Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeft3CurvedTwoToneIcon;
