import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSharpTwoToneIcon component
 */
export const ArrowUpSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 5.09976V19.5"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.2746 10.5498L12.2506 4.4998L6.22559 10.5498"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpSharpTwoToneIcon;
