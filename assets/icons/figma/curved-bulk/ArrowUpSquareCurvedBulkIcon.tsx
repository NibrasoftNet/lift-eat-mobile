import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareCurvedBulkIcon component
 */
export const ArrowUpSquareCurvedBulkIcon = ({
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
      d="M16.0007 12.4281C16.1447 12.4281 16.2897 12.3871 16.4187 12.3001C16.7617 12.0701 16.8537 11.6031 16.6217 11.2601C15.7947 10.0291 13.7117 7.16406 12.2497 7.16406C10.7877 7.16406 8.70472 10.0291 7.87772 11.2601C7.64672 11.6031 7.73772 12.0701 8.08072 12.3001C8.42672 12.5321 8.89172 12.4401 9.12172 12.0971C9.91872 10.9121 10.8377 9.81006 11.4997 9.18706V16.0861C11.4997 16.5001 11.8357 16.8361 12.2497 16.8361C12.6637 16.8361 12.9997 16.5001 12.9997 16.0861V9.19406C13.6687 9.81906 14.5847 10.9171 15.3777 12.0971C15.5227 12.3121 15.7597 12.4281 16.0007 12.4281Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareCurvedBulkIcon;
