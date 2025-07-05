import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HomeSharpBulkIcon component
 */
export const HomeSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.00586L1.12598 11.5379L2.10298 12.6769L3.84298 11.1859V21.9939H20.66V11.1879L22.397 12.6769L23.374 11.5379L12.25 2.00586Z"
      fill={color}
    />
    <Path d="M13 17.1068H11.5V12.1978H13V17.1068Z" fill={color} />
  </Svg>
);

export default HomeSharpBulkIcon;
