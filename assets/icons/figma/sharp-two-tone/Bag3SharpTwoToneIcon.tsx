import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag3SharpTwoToneIcon component
 */
export const Bag3SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.2694 9.90072V6.6775C16.2694 4.46206 14.4739 2.66654 12.2595 2.66654C10.0441 2.65697 8.24004 4.44399 8.23047 6.65942V6.6775V9.90072"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.25 21.6108C17.3586 21.6108 21.5 17.4695 21.5 12.3608L21.5 7.4234L3 7.4234L3 12.3608C3 17.4695 7.14137 21.6108 12.25 21.6108V21.6108Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Bag3SharpTwoToneIcon;
