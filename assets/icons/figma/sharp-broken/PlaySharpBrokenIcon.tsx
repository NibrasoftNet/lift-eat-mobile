import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlaySharpBrokenIcon component
 */
export const PlaySharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.5 12.604C21.5 17.713 17.358 21.854 12.25 21.854C7.141 21.854 3 17.713 3 12.604C3 7.495 7.141 3.354 12.25 3.354C15.443 3.354 18.258 4.972 19.92 7.432"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.1711 12.5988L10.6641 9.73682V15.4608L15.1711 12.5988Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PlaySharpBrokenIcon;
