import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3CurvedBrokenIcon component
 */
export const ArrowRight3CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.6482 12.0029H3.69824"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.5716 13.9623C19.5686 13.1813 20.3016 12.4223 20.3016 11.9923C20.3016 10.7323 13.9376 6.72228 13.2156 7.44228C12.4936 8.16228 12.4246 15.7523 13.2156 16.5423C13.5166 16.8423 14.6086 16.4413 15.8496 15.7583"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRight3CurvedBrokenIcon;
