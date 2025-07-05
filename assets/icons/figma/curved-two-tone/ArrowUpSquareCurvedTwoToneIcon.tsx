import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareCurvedTwoToneIcon component
 */
export const ArrowUpSquareCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.25 12C21.25 5.063 18.937 2.75 12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 7.91394L12 16.0859"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.24805 11.6777C8.24805 11.6777 10.776 7.91373 12 7.91373C13.224 7.91373 15.748 11.6777 15.748 11.6777"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpSquareCurvedTwoToneIcon;
