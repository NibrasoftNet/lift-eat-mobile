import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareSharpBulkIcon component
 */
export const InfoSquareSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path d="M2.5 22.2847H22V2.78467H2.5V22.2847Z" fill={color} />
    <Path
      d="M11.4997 9.48877H12.9997V7.98877H11.4897L11.4997 9.48877Z"
      fill={color}
    />
    <Path d="M12.9937 17.2848H11.4937V11.7848H12.9937V17.2848Z" fill={color} />
  </Svg>
);

export default InfoSquareSharpBulkIcon;
