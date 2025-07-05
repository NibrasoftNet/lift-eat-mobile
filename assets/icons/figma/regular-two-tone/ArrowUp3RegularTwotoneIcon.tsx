import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3RegularTwotoneIcon component
 */
export const ArrowUp3RegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.7485 11.3002L11.7485 20.2502"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.7495 11.3003L11.7485 3.36329L6.74751 11.3003L16.7495 11.3003Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUp3RegularTwotoneIcon;
