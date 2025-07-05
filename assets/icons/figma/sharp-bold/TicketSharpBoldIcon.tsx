import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketSharpBoldIcon component
 */
export const TicketSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M13.211 15.0871H14.711V9.1281H13.211V15.0871ZM21.5 10.5121H22V4.1001H14.711V6.8211H13.211V4.1001H2.5V10.5901H3C3.863 10.5901 4.513 11.1961 4.513 12.0011C4.513 12.8211 3.834 13.4891 3 13.4891H2.5V19.9001H13.211V17.5781H14.711V19.9001H22V13.4891H21.5C20.666 13.4891 19.987 12.8211 19.987 12.0011C19.987 11.1801 20.666 10.5121 21.5 10.5121Z"
      fill={color}
    />
  </Svg>
);

export default TicketSharpBoldIcon;
