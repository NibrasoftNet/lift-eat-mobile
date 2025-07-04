import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareRegularBoldIcon component
 */
export const TickSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.67 1.99991H16.34C19.73 1.99991 22 4.37991 22 7.91991V16.0909C22 19.6199 19.73 21.9999 16.34 21.9999H7.67C4.28 21.9999 2 19.6199 2 16.0909V7.91991C2 4.37991 4.28 1.99991 7.67 1.99991ZM11.43 14.9899L16.18 10.2399C16.52 9.89991 16.52 9.34991 16.18 8.99991C15.84 8.65991 15.28 8.65991 14.94 8.99991L10.81 13.1299L9.06 11.3799C8.72 11.0399 8.16 11.0399 7.82 11.3799C7.48 11.7199 7.48 12.2699 7.82 12.6199L10.2 14.9899C10.37 15.1599 10.59 15.2399 10.81 15.2399C11.04 15.2399 11.26 15.1599 11.43 14.9899Z"
      fill={color}
    />
  </Svg>
);

export default TickSquareRegularBoldIcon;
