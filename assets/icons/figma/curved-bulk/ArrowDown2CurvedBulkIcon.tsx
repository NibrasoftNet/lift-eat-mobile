import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2CurvedBulkIcon component
 */
export const ArrowDown2CurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 16.5001C15.5161 16.5001 19.3711 10.2603 20.1099 9.00936C20.252 8.76961 20.2822 8.4952 20.2168 8.24617C20.1523 8.00057 19.9946 7.77938 19.7588 7.64022C19.2861 7.35701 18.6709 7.51717 18.3901 7.99129C16.8369 10.6163 13.812 14.5001 12.25 14.5001V16.5001Z"
      fill={color}
    />
    <Path
      d="M12.2499 14.5001C12.2499 14.5001 12.2499 14.5001 12.2499 14.5001C10.6899 14.5001 7.6649 10.6161 6.1099 7.99112C5.8299 7.51712 5.2169 7.35712 4.7409 7.64012C4.2659 7.92112 4.1079 8.53412 4.3899 9.00912C5.1289 10.2601 8.9839 16.5001 12.2499 16.5001C12.2499 16.5001 12.2499 16.5001 12.2499 16.5001V14.5001Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDown2CurvedBulkIcon;
