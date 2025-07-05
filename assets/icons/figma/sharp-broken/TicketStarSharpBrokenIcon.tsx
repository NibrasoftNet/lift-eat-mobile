import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketStarSharpBrokenIcon component
 */
export const TicketStarSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M8.261 5.13477H3V10.6248C4.115 10.6248 5.013 11.4338 5.013 12.5358C5.013 13.6368 4.115 14.5238 3 14.5238V19.9348H21.5V14.5238C20.385 14.5238 19.487 13.6368 19.487 12.5358C19.487 11.4338 20.385 10.5468 21.5 10.5468V5.13477H14.141"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2495 9.20801L13.2335 11.072L15.3095 11.432L13.8405 12.943L14.1405 15.029L12.2495 14.099L10.3585 15.029L10.6585 12.943L9.18945 11.432L11.2665 11.072L12.2495 9.20801Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TicketStarSharpBrokenIcon;
