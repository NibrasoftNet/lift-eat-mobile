import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareSharpTwoToneIcon component
 */
export const ArrowRightSquareSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.5 21.25L21.5 2.75L3 2.75L3 21.25L21.5 21.25Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.5883 12L8.16406 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.5723 8.25205L16.3363 12L12.5723 15.748"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightSquareSharpTwoToneIcon;
