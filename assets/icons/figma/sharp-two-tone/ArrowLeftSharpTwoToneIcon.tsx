import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSharpTwoToneIcon component
 */
export const ArrowLeftSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M5.34976 12L19.75 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.7998 18.0246L4.7498 12.0006L10.7998 5.97559"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeftSharpTwoToneIcon;
