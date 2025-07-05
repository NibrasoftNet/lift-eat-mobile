import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareRegularBulkIcon component
 */
export const ArrowRightSquareRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.916 22.0001H16.084C19.623 22.0001 22 19.7241 22 16.3351V7.66512C22 4.27612 19.623 2.00012 16.084 2.00012H7.916C4.378 2.00012 2 4.27712 2 7.66612L2 16.3351C2 19.7241 4.378 22.0001 7.916 22.0001Z"
      fill={color}
    />
    <Path
      d="M12.8555 16.2794L16.6205 12.5314C16.9035 12.2494 16.9035 11.7504 16.6205 11.4674L12.8555 7.71943C12.5615 7.42743 12.0865 7.42843 11.7945 7.72243C11.5025 8.01643 11.5025 8.49043 11.7965 8.78343L14.2735 11.2504H7.91846C7.50346 11.2504 7.16846 11.5864 7.16846 12.0004C7.16846 12.4144 7.50346 12.7504 7.91846 12.7504H14.2735L11.7965 15.2164C11.6495 15.3634 11.5765 15.5554 11.5765 15.7484C11.5765 15.9394 11.6495 16.1314 11.7945 16.2774C12.0865 16.5704 12.5615 16.5714 12.8555 16.2794Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightSquareRegularBulkIcon;
