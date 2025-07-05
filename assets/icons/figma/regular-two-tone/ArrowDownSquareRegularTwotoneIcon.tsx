import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareRegularTwotoneIcon component
 */
export const ArrowDownSquareRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.666 21.25H16.335C19.355 21.25 21.25 19.111 21.25 16.084V7.916C21.25 4.889 19.365 2.75 16.335 2.75H7.666C4.636 2.75 2.75 4.889 2.75 7.916V16.084C2.75 19.111 4.636 21.25 7.666 21.25Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 16.0861V7.91406"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.748 12.3223L12 16.0863L8.25195 12.3223"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDownSquareRegularTwotoneIcon;
