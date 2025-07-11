import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleCurvedBrokenIcon component
 */
export const ArrowDownCircleCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.12 21.043C19.652 20.341 21.25 17.771 21.25 12C21.25 5.063 18.94 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.53076 10.5586C8.53076 10.5586 10.9208 14.0446 12.0008 14.0446C13.0808 14.0446 15.4708 10.5586 15.4708 10.5586"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDownCircleCurvedBrokenIcon;
