import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleSharpTwoToneIcon component
 */
export const TimeCircleSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.5 12C21.5 17.109 17.359 21.25 12.25 21.25C7.141 21.25 3 17.109 3 12C3 6.891 7.141 2.75 12.25 2.75C17.359 2.75 21.5 6.891 21.5 12Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.6821 14.9422L11.9121 12.6932V7.84619"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TimeCircleSharpTwoToneIcon;
