import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DeleteCurvedBrokenIcon component
 */
export const DeleteCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.5988 9.59766C18.5988 15.8267 19.2948 19.4047 15.9668 20.6917"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9897 21.2417C4.2247 21.2417 5.4027 17.6167 5.4027 9.59766"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.0748 6.52344H3.9248"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4249 6.52381C15.4249 6.52381 15.9539 2.75781 11.9989 2.75781C10.2699 2.75781 9.39787 3.47881 8.96387 4.28981"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DeleteCurvedBrokenIcon;
