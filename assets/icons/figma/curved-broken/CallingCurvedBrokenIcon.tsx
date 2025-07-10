import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallingCurvedBrokenIcon component
 */
export const CallingCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.6558 2.375C18.3568 2.786 21.2808 5.706 21.6968 9.407"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.6558 5.91797C16.4268 6.26197 17.8108 7.64697 18.1558 9.41797"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.00316 15.9239C1.10616 9.02494 2.08616 5.86594 2.81416 4.84794C2.90716 4.68394 5.20916 1.23694 7.67816 3.25894C13.8042 8.30494 6.04816 7.59094 11.1922 12.7359C16.3382 17.8809 15.6232 10.1249 20.6692 16.2499C22.6912 18.7189 19.2442 21.0219 19.0812 21.1139C18.1932 21.7489 15.6752 22.5769 10.4662 18.1979"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallingCurvedBrokenIcon;
