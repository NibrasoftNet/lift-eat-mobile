import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCurvedBoldIcon component
 */
export const ArrowUpCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.1546 10.075C18.5656 8.98 15.4636 3.527 12.2666 3.502C12.2626 3.502 12.2586 3.5 12.2556 3.5C12.2536 3.5 12.2526 3.501 12.2516 3.501C12.2486 3.501 12.2466 3.5 12.2446 3.5C9.04963 3.5 5.93563 8.977 5.34463 10.075C5.08263 10.561 5.26363 11.168 5.75063 11.429C5.90163 11.512 6.06363 11.55 6.22363 11.55C6.58063 11.55 6.92463 11.359 7.10463 11.024C8.06563 9.242 9.83163 6.783 11.2556 5.867V19.5C11.2556 20.053 11.7026 20.5 12.2556 20.5C12.8076 20.5 13.2556 20.053 13.2556 19.5V5.871C14.6756 6.781 16.4086 9.197 17.3946 11.024C17.6566 11.51 18.2616 11.69 18.7496 11.429C19.2356 11.168 19.4176 10.561 19.1546 10.075Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCurvedBoldIcon;
