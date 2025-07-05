import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DeleteSharpBrokenIcon component
 */
export const DeleteSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2495 12.854V17.507"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.26698 22.1038H6.20198L4.87598 8.25684H19.624L18.297 22.1038H12.221"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.06201 3.604H16.438"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DeleteSharpBrokenIcon;
