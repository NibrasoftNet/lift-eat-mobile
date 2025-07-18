import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3RegularBoldIcon component
 */
export const ArrowUp3RegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.5899 11.8585C6.71614 12.0925 6.95618 12.2384 7.21726 12.2384H11.2827V20.2657C11.2827 20.671 11.604 21 12 21C12.3959 21 12.7172 20.671 12.7172 20.2657V12.2384H16.7827C17.0447 12.2384 17.2848 12.0925 17.4101 11.8585C17.5372 11.6245 17.5286 11.3386 17.39 11.1125L12.6073 3.34267C12.4753 3.12924 12.2467 3 12 3C11.7532 3 11.5247 3.12924 11.3927 3.34267L6.60998 11.1125C6.5373 11.2319 6.5 11.368 6.5 11.5041C6.5 11.6255 6.5306 11.7479 6.5899 11.8585Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp3RegularBoldIcon;
