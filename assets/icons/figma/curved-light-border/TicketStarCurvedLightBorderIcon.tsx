import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketStarCurvedLightBorderIcon component
 */
export const TicketStarCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.4399 13.9942C18.7789 13.9942 18.7789 9.87976 21.4399 9.87976C21.4399 5.11261 21.4399 3.41113 12.0449 3.41113C2.6499 3.41113 2.6499 5.11261 2.6499 9.87976C5.3109 9.87976 5.3109 13.9942 2.6499 13.9942C2.6499 18.7623 2.6499 20.4638 12.0449 20.4638C21.4399 20.4638 21.4399 18.7623 21.4399 13.9942Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0451 9.1709C11.3621 9.1709 11.2971 10.2604 10.8911 10.646C10.4841 11.0306 9.22112 10.591 9.04512 11.2741C8.87012 11.9581 10.0071 12.1902 10.1481 12.7766C10.2881 13.363 9.59412 14.1872 10.1871 14.5984C10.7811 15.0076 11.4201 14.0802 12.0451 14.0802C12.6701 14.0802 13.3091 15.0076 13.9031 14.5984C14.4971 14.1872 13.8021 13.363 13.9421 12.7766C14.0831 12.1902 15.2201 11.9581 15.0451 11.2741C14.8691 10.591 13.6061 11.0306 13.1991 10.646C12.7931 10.2604 12.7281 9.1709 12.0451 9.1709Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TicketStarCurvedLightBorderIcon;
