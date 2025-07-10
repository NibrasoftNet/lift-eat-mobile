import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag2CurvedTwoToneIcon component
 */
export const Bag2CurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.75 9.47142V6.43942C15.755 4.35142 14.066 2.65442 11.978 2.64942C9.88899 2.64542 8.19299 4.33442 8.18799 6.42242V9.47142"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.9502 14.2074C2.9502 8.91344 5.2052 7.14844 11.9692 7.14844C18.7332 7.14844 20.9882 8.91344 20.9882 14.2074C20.9882 19.5004 18.7332 21.2654 11.9692 21.2654C5.2052 21.2654 2.9502 19.5004 2.9502 14.2074Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Bag2CurvedTwoToneIcon;
