import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketCurvedTwoToneIcon component
 */
export const TicketCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M13.3593 17.5439V19.7641" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.3593 14.5435V9.25488" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.3593 3.59961V6.25486" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 14.0504C18.8093 14.0504 18.8093 9.94867 21.5 9.94867C21.5 5.19622 21.5 3.5 12 3.5C2.5 3.5 2.5 5.19622 2.5 9.94867C5.19074 9.94867 5.19074 14.0504 2.5 14.0504C2.5 18.8038 2.5 20.5 12 20.5C21.5 20.5 21.5 18.8038 21.5 14.0504Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TicketCurvedTwoToneIcon;
