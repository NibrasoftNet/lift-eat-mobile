import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleCurvedBoldIcon component
 */
export const TimeCircleCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.441 13.517H16.428L11.899 13.444C11.489 13.437 11.161 13.103 11.161 12.694V7.846C11.161 7.432 11.497 7.096 11.911 7.096C12.325 7.096 12.661 7.432 12.661 7.846V11.955L16.453 12.017C16.867 12.024 17.197 12.365 17.191 12.779C17.184 13.189 16.849 13.517 16.441 13.517ZM12.25 2.25C6.874 2.25 2.5 6.624 2.5 12C2.5 17.376 6.874 21.75 12.25 21.75C17.626 21.75 22 17.376 22 12C22 6.624 17.626 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default TimeCircleCurvedBoldIcon;
