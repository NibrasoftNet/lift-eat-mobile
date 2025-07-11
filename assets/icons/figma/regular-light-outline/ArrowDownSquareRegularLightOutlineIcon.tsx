import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareRegularLightOutlineIcon component
 */
export const ArrowDownSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.666 3.5C5.136 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.136 20.5 7.666 20.5H16.335C18.865 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.865 3.5 16.335 3.5H7.666ZM16.335 22H7.666C4.277 22 2 19.622 2 16.084V7.916C2 4.378 4.277 2 7.666 2H16.335C19.724 2 22 4.378 22 7.916V16.084C22 19.622 19.724 22 16.335 22Z"
      fill={color}
    />
    <Path
      d="M12 16.8358C11.586 16.8358 11.25 16.4998 11.25 16.0858V7.91382C11.25 7.49982 11.586 7.16382 12 7.16382C12.414 7.16382 12.75 7.49982 12.75 7.91382V16.0858C12.75 16.4998 12.414 16.8358 12 16.8358Z"
      fill={color}
    />
    <Path
      d="M12.0002 16.837C11.8012 16.837 11.6092 16.758 11.4692 16.616L7.72119 12.852C7.42819 12.558 7.43019 12.083 7.72319 11.791C8.01719 11.5 8.49119 11.498 8.78319 11.793L12.0002 15.024L15.2172 11.793C15.5102 11.498 15.9842 11.5 16.2772 11.791C16.5702 12.083 16.5722 12.558 16.2792 12.852L12.5312 16.616C12.3912 16.758 12.1992 16.837 12.0002 16.837Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSquareRegularLightOutlineIcon;
