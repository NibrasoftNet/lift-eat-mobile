import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ScanSharpBulkIcon component
 */
export const ScanSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M22.2502 13.3203H15.3052"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.4686 13.3193V20.7543H15.7656"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.712 13.3203H2.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.03125 13.3193V20.7543H8.76325"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.4686 9.31043V4.31543H15.7656"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.03125 9.31043V4.31543H8.76325"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ScanSharpBulkIcon;
