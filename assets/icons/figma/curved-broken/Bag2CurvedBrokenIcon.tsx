import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag2CurvedBrokenIcon component
 */
export const Bag2CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.7807 9.51439V6.48239C15.7857 4.39439 14.0968 2.69739 12.0087 2.69239C9.91975 2.68839 8.22375 4.37739 8.21875 6.46539V9.51439"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 21.3084C5.23596 21.3084 2.98096 19.5434 2.98096 14.2504C2.98096 8.95641 5.23596 7.19141 12 7.19141C18.764 7.19141 21.019 8.95641 21.019 14.2504C21.019 18.5014 19.564 20.4774 15.487 21.0894"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Bag2CurvedBrokenIcon;
