import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareSharpBulkIcon component
 */
export const ArrowDownSquareSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M2.5 21.75H22V2.25H2.5V21.75Z" fill={color} />
    <Path
      d="M7.43896 12.3201L12.25 17.1491L17.061 12.3201L15.998 11.2621L13 14.2711V7.16406H11.5V14.2711L8.50196 11.2621L7.43896 12.3201Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSquareSharpBulkIcon;
