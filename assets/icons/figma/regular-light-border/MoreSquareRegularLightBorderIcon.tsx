import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareRegularLightBorderIcon component
 */
export const MoreSquareRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.334 2.75012H7.665C4.644 2.75012 2.75 4.88912 2.75 7.91612V16.0841C2.75 19.1111 4.634 21.2501 7.665 21.2501H16.333C19.364 21.2501 21.25 19.1111 21.25 16.0841V7.91612C21.25 4.88912 19.364 2.75012 16.334 2.75012Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.9393 12.0131H15.9483"
      fill='none'
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M11.9301 12.0131H11.9391"
      fill='none'
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M7.92128 12.0131H7.93028"
      fill='none'
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

export default MoreSquareRegularLightBorderIcon;
