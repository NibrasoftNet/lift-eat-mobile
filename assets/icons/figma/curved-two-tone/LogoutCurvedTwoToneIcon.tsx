import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LogoutCurvedTwoToneIcon component
 */
export const LogoutCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.791 12.1211H9.75"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.8643 9.20508L21.7923 12.1211L18.8643 15.0371"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3599 7.63C16.0299 4.05 14.6899 2.75 9.35986 2.75C2.25886 2.75 2.25886 5.06 2.25886 12C2.25886 18.94 2.25886 21.25 9.35986 21.25C14.6899 21.25 16.0299 19.95 16.3599 16.37"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LogoutCurvedTwoToneIcon;
