import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Voice2CurvedTwoToneIcon component
 */
export const Voice2CurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9901 21.2622V19.2178"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.60352 13.832C6.60352 16.8065 9.01462 19.2176 11.99 19.2176C14.9645 19.2176 17.3756 16.8065 17.3756 13.832"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.21191 13.8324H18.7675"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.3756 10.7397V8.59844C17.3756 5.62399 14.9645 3.21289 11.99 3.21289C9.01462 3.21289 6.60352 5.62399 6.60352 8.59844V10.7397"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.4971 10.4516H13.482"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.491 7.68203H11.4878"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Voice2CurvedTwoToneIcon;
