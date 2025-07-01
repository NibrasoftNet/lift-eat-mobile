import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleSharpBulkIcon component
 */
export const MoreCircleSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M6.469 14.3477C4.281 14.3477 2.5 16.1277 2.5 18.3167C2.5 20.5047 4.281 22.2847 6.469 22.2847C8.657 22.2847 10.438 20.5047 10.438 18.3167C10.438 16.1277 8.657 14.3477 6.469 14.3477Z" fill={color} />
    <Path d="M18.0315 14.3477C15.8435 14.3477 14.0625 16.1277 14.0625 18.3167C14.0625 20.5047 15.8435 22.2847 18.0315 22.2847C20.2195 22.2847 22.0005 20.5047 22.0005 18.3167C22.0005 16.1277 20.2195 14.3477 18.0315 14.3477Z" fill={color} />
    <Path d="M16.2187 6.75367C16.2187 4.56567 14.4387 2.78467 12.2497 2.78467C10.0617 2.78467 8.28174 4.56567 8.28174 6.75367C8.28174 8.94167 10.0617 10.7227 12.2497 10.7227C14.4387 10.7227 16.2187 8.94167 16.2187 6.75367Z" fill={color} />
  </Svg>
);

export default MoreCircleSharpBulkIcon;
