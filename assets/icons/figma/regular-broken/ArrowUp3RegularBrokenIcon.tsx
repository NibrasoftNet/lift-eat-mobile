import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3RegularBrokenIcon component
 */
export const ArrowUp3RegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.21725 12.2384L11.2826 12.2384V20.2658C11.2826 20.6711 11.604 21 11.9999 21C12.3958 21 12.7172 20.6711 12.7172 20.2658V12.2384H16.7826C17.0436 12.2384 17.2846 12.0935 17.4109 11.8585C17.5371 11.6246 17.5285 11.3387 17.3898 11.1136L12.6072 3.34361C12.4752 3.12922 12.2466 3 11.9999 3C11.7532 3 11.5246 3.12922 11.3926 3.34361L8.41746 8.17866C8.20611 8.52031 8.30652 8.97455 8.64124 9.1909C8.97692 9.40627 9.4197 9.30348 9.63105 8.95986L11.9999 5.11258L15.4838 10.7699L7.21725 10.7699C6.82133 10.7699 6.5 11.0989 6.5 11.5042C6.5 11.9094 6.82133 12.2384 7.21725 12.2384Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp3RegularBrokenIcon;
