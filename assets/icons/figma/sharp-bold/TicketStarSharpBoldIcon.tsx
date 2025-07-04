import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketStarSharpBoldIcon component
 */
export const TicketStarSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M14.724 15.9278L12.249 14.7108L9.774 15.9278L10.167 13.1968L8.244 11.2188L10.962 10.7488L12.249 8.30877L13.537 10.7488L16.254 11.2188L14.331 13.1968L14.724 15.9278ZM21.5 11.0458H22V4.63477H2.5V11.1238H3C3.863 11.1238 4.513 11.7308 4.513 12.5358C4.513 13.3558 3.834 14.0238 3 14.0238H2.5V20.4348H22V14.0238H21.5C20.665 14.0238 19.987 13.3558 19.987 12.5358C19.987 11.7138 20.665 11.0458 21.5 11.0458Z" fill={color} />
  </Svg>
);

export default TicketStarSharpBoldIcon;
