import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareCurvedTwoToneIcon component
 */
export const CloseSquareCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.3941 9.59473L9.60205 14.3867"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4001 14.3928L9.6001 9.59277"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12C21.25 5.063 18.937 2.75 12 2.75C5.063 2.75 2.75 5.063 2.75 12Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CloseSquareCurvedTwoToneIcon;
