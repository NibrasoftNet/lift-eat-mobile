import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCurvedLightBorderIcon component
 */
export const ArrowUpCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.7256 4.25L11.7256 19.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.701 10.3008C5.701 10.3008 8.962 4.25078 11.724 4.25078C14.488 4.25078 17.75 10.3008 17.75 10.3008"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpCurvedLightBorderIcon;
