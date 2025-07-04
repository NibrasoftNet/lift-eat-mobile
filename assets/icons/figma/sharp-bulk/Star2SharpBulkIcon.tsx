import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star2SharpBulkIcon component
 */
export const Star2SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M13.2783 1.88867H11.2214V11.1104H2V13.1675H11.2214V22.3887H13.2783V13.1675H22.5V11.1104H13.2783V1.88867Z" fill={color} />
    <Path d="M20.2247 5.61801L18.7703 4.16357L12.2496 10.6843L5.72902 4.16375L4.27441 5.61836L10.795 12.1389L4.27459 18.6593L5.72902 20.1137L12.2494 13.5933L18.7701 20.114L20.2247 18.6594L13.704 12.1387L20.2247 5.61801Z" fill={color} />
  </Svg>
);

export default Star2SharpBulkIcon;
