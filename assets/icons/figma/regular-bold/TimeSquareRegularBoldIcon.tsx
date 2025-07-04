import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareRegularBoldIcon component
 */
export const TimeSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.67 2.00012H16.34C19.73 2.00012 22 4.37912 22 7.91912V16.0891C22 19.6201 19.73 22.0001 16.34 22.0001H7.67C4.28 22.0001 2 19.6201 2 16.0891V7.91912C2 4.37912 4.28 2.00012 7.67 2.00012ZM15.58 15.8101C15.83 15.8101 16.08 15.6801 16.22 15.4401C16.44 15.0891 16.32 14.6291 15.96 14.4101L12.4 12.2901V7.66912C12.4 7.26012 12.07 6.91912 11.65 6.91912C11.24 6.91912 10.9 7.26012 10.9 7.66912V12.7201C10.9 12.9801 11.04 13.2301 11.27 13.3601L15.19 15.7001C15.31 15.7801 15.45 15.8101 15.58 15.8101Z"
      fill={color}
    />
  </Svg>
);

export default TimeSquareRegularBoldIcon;
