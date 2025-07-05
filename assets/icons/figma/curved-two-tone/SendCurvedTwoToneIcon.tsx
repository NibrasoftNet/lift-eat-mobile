import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SendCurvedTwoToneIcon component
 */
export const SendCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.4931 12.438C11.4931 12.438 -0.483595 9.96037 3.67835 7.55782C7.1905 5.53052 19.2945 2.04497 20.9855 2.94557C21.8861 4.63657 18.4005 16.7405 16.3732 20.2527C13.9707 24.4146 11.4931 12.438 11.4931 12.438Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.4932 12.4377L20.9856 2.94531"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SendCurvedTwoToneIcon;
