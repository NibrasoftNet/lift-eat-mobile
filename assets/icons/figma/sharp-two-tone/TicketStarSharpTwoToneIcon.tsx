import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketStarSharpTwoToneIcon component
 */
export const TicketStarSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M21.5 19.9348V14.5241C20.3848 14.5241 19.4866 13.6371 19.4866 12.5357C19.4866 11.4343 20.3848 10.5464 21.5 10.5464V5.13477H3V10.6245C4.11525 10.6245 5.01343 11.4343 5.01343 12.5357C5.01343 13.6371 4.11525 14.5241 3 14.5241V19.9348H21.5Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2491 9.20801L13.2326 11.0721L15.3094 11.4315L13.8404 12.9429L14.1404 15.0291L12.2491 14.0991L10.3577 15.0291L10.6577 12.9429L9.18874 11.4315L11.2655 11.0721L12.2491 9.20801Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TicketStarSharpTwoToneIcon;
