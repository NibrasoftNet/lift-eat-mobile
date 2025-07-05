import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LogoutSharpTwoToneIcon component
 */
export const LogoutSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M13.0493 16.7637L13.0493 21.3887L2.52538 21.3887L2.52538 2.88867L13.0493 2.88867L13.0493 7.51367"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.9746 12.1396L8.03534 12.1396"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.3789 7.54414C17.3789 9.90662 19.4595 12.1396 21.9744 12.1396"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.3789 16.7352C17.3789 14.3727 19.4595 12.1396 21.9744 12.1396"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LogoutSharpTwoToneIcon;
