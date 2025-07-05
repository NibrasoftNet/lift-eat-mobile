import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketStarSharpBulkIcon component
 */
export const TicketStarSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.5 11.0458H22V4.63477H2.5V11.1238H3C3.863 11.1238 4.513 11.7308 4.513 12.5358C4.513 13.3558 3.834 14.0238 3 14.0238H2.5V20.4348H22V14.0238H21.5C20.665 14.0238 19.987 13.3558 19.987 12.5358C19.987 11.7138 20.665 11.0458 21.5 11.0458Z"
      fill={color}
    />
    <Path
      d="M12.2491 14.7106L14.7241 15.9276L14.3311 13.1966L16.2541 11.2186L13.5371 10.7486L12.2491 8.30859L10.9621 10.7486L8.24414 11.2186L10.1671 13.1966L9.77414 15.9276L12.2491 14.7106Z"
      fill={color}
    />
  </Svg>
);

export default TicketStarSharpBulkIcon;
