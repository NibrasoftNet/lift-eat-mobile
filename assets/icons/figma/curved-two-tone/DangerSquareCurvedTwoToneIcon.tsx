import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerSquareCurvedTwoToneIcon component
 */
export const DangerSquareCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.75 12C2.75 5.063 5.063 2.75 12 2.75C18.937 2.75 21.25 5.063 21.25 12C21.25 18.937 18.937 21.25 12 21.25C5.063 21.25 2.75 18.937 2.75 12Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9955 15.5H12.0045"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 8.10449V11.9995"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DangerSquareCurvedTwoToneIcon;
