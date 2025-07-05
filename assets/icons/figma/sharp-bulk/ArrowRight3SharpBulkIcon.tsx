import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3SharpBulkIcon component
 */
export const ArrowRight3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M21.25 11L3.25024 11L3.25024 13L21.25 13L21.25 11Z" fill={color} />
    <Path
      d="M20.2509 13C16.58 13 13.5908 9.78058 13.5908 6.33995L13.5908 5.33995L15.5908 5.33995L15.5908 6.33995C15.5908 8.71881 17.7268 11 20.2509 11L21.2509 11L21.2509 13L20.2509 13Z"
      fill={color}
    />
    <Path
      d="M20.2509 11C16.58 11 13.5908 14.2194 13.5908 17.66L13.5908 18.66L15.5908 18.66L15.5908 17.66C15.5908 15.2812 17.7268 13 20.2509 13L21.2509 13L21.2509 11L20.2509 11Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRight3SharpBulkIcon;
