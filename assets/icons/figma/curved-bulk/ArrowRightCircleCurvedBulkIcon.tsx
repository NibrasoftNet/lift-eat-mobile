import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleCurvedBulkIcon component
 */
export const ArrowRightCircleCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M10.8112 16.2209C10.9582 16.2209 11.1052 16.1779 11.2352 16.0889C12.6562 15.1119 15.0402 13.2819 15.0402 11.9989C15.0402 10.7159 12.6562 8.88694 11.2352 7.91094C10.8922 7.67694 10.4262 7.76294 10.1922 8.10494C9.95825 8.44594 10.0452 8.91294 10.3852 9.14794C11.9692 10.2359 13.4452 11.5829 13.5422 11.9689C13.4452 12.4149 11.9692 13.7629 10.3852 14.8529C10.0442 15.0879 9.95825 15.5549 10.1922 15.8959C10.3382 16.1079 10.5722 16.2209 10.8112 16.2209Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightCircleCurvedBulkIcon;
