import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCurvedBoldIcon component
 */
export const ArrowDownCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.7496 12.57C18.2626 12.306 17.6566 12.49 17.3956 12.975C16.4346 14.757 14.6686 17.217 13.2446 18.133V4.5C13.2446 3.947 12.7976 3.5 12.2446 3.5C11.6916 3.5 11.2446 3.947 11.2446 4.5V18.128C9.8246 17.218 8.0916 14.802 7.1046 12.975C6.8426 12.49 6.2376 12.308 5.7506 12.57C5.2646 12.832 5.0826 13.438 5.3456 13.924C5.9346 15.02 9.0356 20.472 12.2336 20.497C12.2376 20.497 12.2406 20.5 12.2446 20.5C12.2456 20.5 12.2476 20.499 12.2486 20.499C12.2506 20.499 12.2526 20.5 12.2556 20.5C15.4506 20.5 18.5636 15.022 19.1546 13.924C19.4176 13.438 19.2356 12.832 18.7496 12.57Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownCurvedBoldIcon;
