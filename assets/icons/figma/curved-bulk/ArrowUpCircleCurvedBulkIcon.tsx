import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleCurvedBulkIcon component
 */
export const ArrowUpCircleCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.199 5.052 21.75 12.25 21.75C19.449 21.75 22 19.199 22 12C22 4.802 19.449 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M15.1014 13.867C15.3334 14.207 15.8024 14.295 16.1434 14.061C16.4854 13.828 16.5724 13.361 16.3374 13.019C15.3624 11.595 13.5334 9.20703 12.2494 9.20703C10.9664 9.20703 9.13736 11.595 8.16236 13.019C7.92736 13.361 8.01436 13.828 8.35636 14.061C8.48636 14.15 8.63336 14.193 8.77936 14.193C9.01836 14.193 9.25336 14.079 9.39836 13.867C10.4864 12.28 11.8324 10.802 12.2194 10.705C12.6654 10.802 14.0124 12.28 15.1014 13.867Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCircleCurvedBulkIcon;
