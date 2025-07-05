import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareCurvedBulkIcon component
 */
export const ArrowLeftSquareCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.198 5.052 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M9.43716 12.7507H16.3402C16.7542 12.7507 17.0902 12.4147 17.0902 12.0007C17.0902 11.5867 16.7542 11.2507 16.3402 11.2507H9.44016C10.0652 10.5827 11.1652 9.6677 12.3472 8.8757C12.6922 8.6457 12.7832 8.1797 12.5532 7.8357C12.3232 7.4907 11.8572 7.3977 11.5132 7.6297C10.2792 8.4557 7.41016 10.5347 7.41016 12.0007C7.41016 13.4667 10.2782 15.5487 11.5122 16.3757C11.6412 16.4617 11.7852 16.5027 11.9292 16.5027C12.1712 16.5027 12.4082 16.3867 12.5532 16.1707C12.7832 15.8267 12.6922 15.3597 12.3482 15.1297C11.1812 14.3467 10.0682 13.4177 9.43716 12.7507Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSquareCurvedBulkIcon;
