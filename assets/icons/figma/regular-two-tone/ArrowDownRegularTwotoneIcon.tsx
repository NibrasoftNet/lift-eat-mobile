import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownRegularTwotoneIcon component
 */
export const ArrowDownRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.2739 19.75V4.75"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.2985 13.7002L12.2745 19.7502L6.24951 13.7002"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDownRegularTwotoneIcon;
