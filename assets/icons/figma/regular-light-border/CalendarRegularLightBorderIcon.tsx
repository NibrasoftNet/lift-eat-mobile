import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CalendarRegularLightBorderIcon component
 */
export const CalendarRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.442 17.1962H16.4512"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0045 17.1962H12.0137"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.55769 17.1962H7.56695"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.442 13.3097H16.4512"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0045 13.3097H12.0137"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.55769 13.3097H7.56695"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.09277 9.40421H20.9167"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M16.0438 2V5.29078" fill='none' stroke={color} strokeWidth="1.5" />
    <Path d="M7.96564 2V5.29078" fill='none' stroke={color} strokeWidth="1.5" />
    <Path
      d="M16.2383 3.57922H7.77096C4.83427 3.57922 3 5.21516 3 8.22225V17.2719C3 20.3263 4.83427 22 7.77096 22H16.229C19.175 22 21 20.3546 21 17.3475V8.22225C21.0092 5.21516 19.1842 3.57922 16.2383 3.57922Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CalendarRegularLightBorderIcon;
