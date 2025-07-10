import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareRegularTwotoneIcon component
 */
export const ArrowRightSquareRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.25 16.334V7.665C21.25 4.645 19.111 2.75 16.084 2.75H7.916C4.889 2.75 2.75 4.635 2.75 7.665L2.75 16.334C2.75 19.364 4.889 21.25 7.916 21.25H16.084C19.111 21.25 21.25 19.364 21.25 16.334Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.0861 12H7.91406"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.3223 8.25205L16.0863 12L12.3223 15.748"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightSquareRegularTwotoneIcon;
