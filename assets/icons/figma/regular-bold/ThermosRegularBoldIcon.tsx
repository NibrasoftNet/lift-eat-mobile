import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ThermosRegularBoldIcon component
 */
export const ThermosRegularBoldIcon = ({ color = "#EA1E61", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 115 56"
    fill="none"
    {...props}
  >
    <Path d="M100.38 40.2411C95.9293 40.2411 92.3212 36.633 92.3212 32.182C92.3212 27.731 95.9293 24.1229 100.38 24.1229C104.831 24.1229 108.44 27.731 108.44 32.182C108.44 36.633 104.831 40.2411 100.38 40.2411ZM114.592 12.7448L111.38 9.11054H111.384V7.5503H107.204L109.259 0.679344L106.988 -2.67029e-05L104.729 7.5503H88.9435V9.07729L86.0141 12.7448H86V52.093H89.1158L86 52.096L89.0423 56H111.403L114.578 52.093H114.602V12.7448H114.592Z" fill={color} />
  </Svg>
);

export default ThermosRegularBoldIcon;
