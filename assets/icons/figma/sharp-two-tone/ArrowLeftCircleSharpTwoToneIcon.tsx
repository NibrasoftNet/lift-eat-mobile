import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleSharpTwoToneIcon component
 */
export const ArrowLeftCircleSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.75C7.142 2.75 3 6.891 3 12C3 17.108 7.142 21.25 12.25 21.25C17.358 21.25 21.5 17.108 21.5 12C21.5 6.891 17.358 2.75 12.25 2.75Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.6924 8.52881L10.2064 11.9998L13.6924 15.4708"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeftCircleSharpTwoToneIcon;
