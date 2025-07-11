import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleCurvedBrokenIcon component
 */
export const MoreCircleCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21.25C5.063 21.25 2.75 18.937 2.75 12C2.75 5.063 5.063 2.75 12 2.75C18.937 2.75 21.25 5.063 21.25 12C21.25 17.786 19.641 20.355 15.081 21.049"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.204 13.9004H15.213"
      fill='none'
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M9.19521 13.9004H9.20421"
      fill='none'
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M12.204 9.90039H12.213"
      fill='none'
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

export default MoreCircleCurvedBrokenIcon;
