import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketRegularTwotoneIcon component
 */
export const TicketRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.8496 4.25024V6.67024"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.8496 17.76V19.784"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.8496 14.3247V9.50366"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.7021 20C20.5242 20 22 18.5426 22 16.7431V14.1506C20.7943 14.1506 19.8233 13.1917 19.8233 12.001C19.8233 10.8104 20.7943 9.85039 22 9.85039L21.999 7.25686C21.999 5.45745 20.5221 4 18.7011 4H5.29892C3.47789 4 2.00104 5.45745 2.00104 7.25686L2 9.93485C3.20567 9.93485 4.17668 10.8104 4.17668 12.001C4.17668 13.1917 3.20567 14.1506 2 14.1506V16.7431C2 18.5426 3.4758 20 5.29787 20H18.7021Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TicketRegularTwotoneIcon;
