import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3SharpBulkIcon component
 */
export const ArrowLeft3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M3.25098 11L21.2507 11L21.2507 13L3.25098 13L3.25098 11Z"
      fill={color}
    />
    <Path
      d="M4.25011 13C7.92102 13 10.9102 9.78058 10.9102 6.33995L10.9102 5.33995L8.91016 5.33995L8.91016 6.33995C8.91016 8.71881 6.77413 11 4.25011 11L3.25011 11L3.25011 13L4.25011 13Z"
      fill={color}
    />
    <Path
      d="M4.25011 11C7.92102 11 10.9102 14.2194 10.9102 17.66L10.9102 18.66L8.91016 18.66L8.91016 17.66C8.91016 15.2812 6.77413 13 4.25011 13L3.25011 13L3.25011 11L4.25011 11Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft3SharpBulkIcon;
