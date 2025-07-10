import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star2SharpTwoToneIcon component
 */
export const Star2SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 2.88867V21.3887"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 12.1387L3 12.1387"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.791 5.59814L5.70954 18.6796"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.791 18.6792L5.70954 5.59772"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star2SharpTwoToneIcon;
