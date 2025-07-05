import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleCurvedBrokenIcon component
 */
export const ArrowUpCircleCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.831 20.912C19.82 20.053 21.25 17.458 21.25 12C21.25 5.063 18.94 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4708 13.4421C15.4708 13.4421 13.0808 9.95605 12.0008 9.95605C10.9208 9.95605 8.53076 13.4421 8.53076 13.4421"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpCircleCurvedBrokenIcon;
