import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleSharpBoldIcon component
 */
export const MoreCircleSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M6.469 14.3475C4.281 14.3475 2.5 16.1275 2.5 18.3165C2.5 20.5045 4.281 22.2845 6.469 22.2845C8.657 22.2845 10.438 20.5045 10.438 18.3165C10.438 16.1275 8.657 14.3475 6.469 14.3475Z" fill={color} />
    <Path d="M18.0315 14.3475C15.8435 14.3475 14.0625 16.1275 14.0625 18.3165C14.0625 20.5045 15.8435 22.2845 18.0315 22.2845C20.2195 22.2845 22.0005 20.5045 22.0005 18.3165C22.0005 16.1275 20.2195 14.3475 18.0315 14.3475Z" fill={color} />
    <Path d="M16.219 6.75367C16.219 4.56567 14.439 2.78467 12.25 2.78467C10.062 2.78467 8.28198 4.56567 8.28198 6.75367C8.28198 8.94167 10.062 10.7227 12.25 10.7227C14.439 10.7227 16.219 8.94167 16.219 6.75367Z" fill={color} />
  </Svg>
);

export default MoreCircleSharpBoldIcon;
