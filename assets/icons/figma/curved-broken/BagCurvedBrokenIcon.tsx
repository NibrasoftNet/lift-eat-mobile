import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagCurvedBrokenIcon component
 */
export const BagCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.9395 11.3545H14.8935"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.10845 11.3545H9.06245"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3304 6.85032C16.3304 4.46432 14.3964 2.53032 12.0104 2.53032C9.62439 2.51932 7.68239 4.44532 7.67139 6.83132V6.85032"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0003 21.4701C5.49225 21.4701 4.74325 19.4201 3.28225 14.0031C1.81625 8.56913 4.75725 6.53613 12.0003 6.53613C19.2433 6.53613 22.1843 8.56913 20.7183 14.0031C19.5703 18.2601 18.8613 20.4381 15.4513 21.1751"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BagCurvedBrokenIcon;
