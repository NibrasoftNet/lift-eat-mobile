import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2CurvedBoldIcon component
 */
export const ArrowUp2CurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M5.2489 16.4995C5.0759 16.4995 4.8999 16.4545 4.7409 16.3595C4.2659 16.0795 4.1079 15.4665 4.3899 14.9905C5.1289 13.7395 8.9839 7.49951 12.2499 7.49951C15.5159 7.49951 19.3709 13.7395 20.1099 14.9905C20.3919 15.4655 20.2339 16.0785 19.7589 16.3595C19.2859 16.6435 18.6709 16.4825 18.3899 16.0085C16.8349 13.3835 13.8099 9.49951 12.2499 9.49951C10.6869 9.49951 7.6629 13.3835 6.1099 16.0085C5.9239 16.3235 5.5909 16.4995 5.2489 16.4995Z" fill={color} />
  </Svg>
);

export default ArrowUp2CurvedBoldIcon;
