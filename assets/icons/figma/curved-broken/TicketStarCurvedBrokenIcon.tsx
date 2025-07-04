import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketStarCurvedBrokenIcon component
 */
export const TicketStarCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.331 3.47461C2.60498 3.55661 2.60498 5.28861 2.60498 9.94061C5.26598 9.94061 5.26598 14.0546 2.60498 14.0546C2.60498 18.8226 2.60498 20.5246 12 20.5246C21.395 20.5246 21.395 18.8226 21.395 14.0546C18.734 14.0546 18.734 9.94061 21.395 9.94061C21.395 5.62761 21.395 3.82361 14.439 3.51961" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.8972 12.8374C14.0382 12.2514 15.1752 12.0184 15.0002 11.3344C14.8242 10.6514 13.5612 11.0914 13.1542 10.7064C12.7482 10.3214 12.6832 9.23145 12.0002 9.23145C11.3172 9.23145 11.2522 10.3214 10.8462 10.7064C10.4392 11.0914 9.17619 10.6514 9.00019 11.3344C8.82519 12.0184 9.96219 12.2514 10.1032 12.8374C10.2432 13.4234 9.54919 14.2484 10.1422 14.6594C10.7362 15.0684 11.3752 14.1414 12.0002 14.1414C12.6252 14.1414 13.2642 15.0684 13.8582 14.6594" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TicketStarCurvedBrokenIcon;
