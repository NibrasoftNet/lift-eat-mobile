import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphCurvedBrokenIcon component
 */
export const GraphCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.9 10.5984C18.362 10.4744 19.852 10.1404 20.435 9.68138C23.293 7.43038 15.906 0.844375 13.646 3.44637C13.037 4.14737 12.743 8.04037 13.198 9.63837"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.94799 20.2226C4.54699 18.9186 2.91699 16.3746 2.91699 13.4516C2.91699 8.15156 8.14599 4.76156 9.64499 6.26056C10.508 7.12356 9.53599 11.1846 11.084 12.7326C12.632 14.2816 17.021 12.8036 18.105 13.8876C19.189 14.9716 16.315 21.1526 10.619 21.1526"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GraphCurvedBrokenIcon;
