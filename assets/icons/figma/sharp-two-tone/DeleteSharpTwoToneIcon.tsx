import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DeleteSharpTwoToneIcon component
 */
export const DeleteSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M4.87598 8.00684H19.6236L18.2973 21.8542H6.20222L4.87598 8.00684Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.25 12.6035L12.25 17.2566"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.06152 3.354H16.4382"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DeleteSharpTwoToneIcon;
