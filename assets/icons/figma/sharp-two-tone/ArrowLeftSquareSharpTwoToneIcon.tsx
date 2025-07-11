import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareSharpTwoToneIcon component
 */
export const ArrowLeftSquareSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M3 21.25L3 2.75L21.5 2.75L21.5 21.25L3 21.25Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.9117 12L16.3359 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9277 8.25205L8.16373 12L11.9277 15.748"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeftSquareSharpTwoToneIcon;
