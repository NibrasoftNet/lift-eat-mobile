import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3RegularTwotoneIcon component
 */
export const ArrowRight3RegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12.7 11.7488H3.75" fill='none' stroke={color} strokeWidth="1.5" />
    <Path
      d="M12.7002 16.7498L20.6372 11.7488L12.7002 6.74776V16.7498Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRight3RegularTwotoneIcon;
