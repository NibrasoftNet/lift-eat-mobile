import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketSharpBulkIcon component
 */
export const TicketSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M13.7981 6.8211H13.211V4.1001H2.5V10.5901H3C3.863 10.5901 4.513 11.1961 4.513 12.0011C4.513 12.8211 3.834 13.4891 3 13.4891H2.5V19.9001H13.211V17.5781H13.7981V15.0871H13.211V9.1281H13.7981V6.8211Z"
      fill={color}
    />
    <Path
      d="M13.7979 17.5781H14.7107V19.8999H21.9998V13.4893H21.4998C20.6658 13.4893 19.9868 12.8213 19.9868 12.001C19.9868 11.1802 20.6658 10.5122 21.4998 10.5122H21.9998V4.1001H14.7107V6.82129H13.7979V9.12793H14.7107V15.0869H13.7979V17.5781Z"
      fill={color}
    />
  </Svg>
);

export default TicketSharpBulkIcon;
