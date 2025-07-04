import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderCurvedBulkIcon component
 */
export const FolderCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M20.5416 7.25362C19.4446 6.07162 18.0456 6.09962 16.8126 6.12162C16.0396 6.13562 15.3086 6.15062 14.7866 5.85262C14.1416 5.48562 13.9186 5.06962 13.6596 4.58662C13.3736 4.05262 13.0496 3.44762 12.1686 2.97162C10.5426 2.09562 8.63365 1.92462 6.16165 2.43462C3.71865 2.93462 2.13965 5.09962 2.13965 7.94962V14.0156C2.13965 21.2876 6.33065 21.8506 12.2496 21.8506C17.9776 21.8506 22.3596 21.2736 22.3596 13.9886C22.3596 12.2036 22.3596 9.21562 20.5416 7.25362Z" fill={color} />
    <Path d="M7.44531 15.4756H17.0383C17.4523 15.4756 17.7883 15.1396 17.7883 14.7256C17.7883 14.3116 17.4523 13.9756 17.0383 13.9756H7.44531C7.03131 13.9756 6.69531 14.3116 6.69531 14.7256C6.69531 15.1396 7.03131 15.4756 7.44531 15.4756Z" fill={color} />
  </Svg>
);

export default FolderCurvedBulkIcon;
