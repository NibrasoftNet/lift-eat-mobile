import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star2SharpBoldIcon component
 */
export const Star2SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M22.5 11.1387H14.664L20.205 5.59767L18.791 4.18367L13.25 9.72467V1.88867H11.25V9.72367L5.71 4.18367L4.296 5.59767L9.837 11.1387H2V13.1387H9.837L4.296 18.6797L5.71 20.0937L11.25 14.5537V22.3887H13.25V14.5517L18.791 20.0927L20.205 18.6787L14.665 13.1387H22.5V11.1387Z" fill={color} />
  </Svg>
);

export default Star2SharpBoldIcon;
