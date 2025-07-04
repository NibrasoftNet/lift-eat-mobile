import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleCurvedTwoToneIcon component
 */
export const ArrowDownCircleCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M2.75049 12C2.75049 18.937 5.06349 21.25 12.0005 21.25C18.9375 21.25 21.2505 18.937 21.2505 12C21.2505 5.063 18.9375 2.75 12.0005 2.75C5.06349 2.75 2.75049 5.063 2.75049 12Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.52881 10.5576C8.52881 10.5576 10.9208 14.0436 12.0008 14.0436C13.0808 14.0436 15.4708 10.5576 15.4708 10.5576" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDownCircleCurvedTwoToneIcon;
