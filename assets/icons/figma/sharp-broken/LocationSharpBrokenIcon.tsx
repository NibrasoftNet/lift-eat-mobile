import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationSharpBrokenIcon component
 */
export const LocationSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.7367 10.8068C14.7367 9.43285 13.6237 8.31885 12.2507 8.31885C10.8767 8.31885 9.76367 9.43285 9.76367 10.8068C9.76367 12.1788 10.8767 13.2928 12.2507 13.2928"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2496 2.75C16.3696 2.75 19.8366 6.445 19.7096 10.597C19.5256 16.632 12.2496 21.25 12.2496 21.25C12.2496 21.25 4.9736 16.511 4.7906 10.597C4.7076 7.926 6.1126 5.445 8.2226 4.014"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LocationSharpBrokenIcon;
