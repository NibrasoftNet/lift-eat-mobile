import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSharpTwoToneIcon component
 */
export const EditSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.3506 3.604L21.25 8.50339L8.14939 21.604L3.25461 21.5994L3.25 16.7046L16.3506 3.604Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.5722 21.5987L3.25488 21.5981"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EditSharpTwoToneIcon;
