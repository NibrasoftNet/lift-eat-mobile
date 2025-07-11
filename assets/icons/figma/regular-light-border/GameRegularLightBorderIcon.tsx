import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GameRegularLightBorderIcon component
 */
export const GameRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.1795 16.0025H17.0725"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.84819 12.314V16.059"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.7591 14.1868H6.93799"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.3661 12.4281H15.259"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.4283 21.9626C13.4231 22.0135 10.473 22.0114 7.57275 21.9626C4.3535 21.9626 2 19.6664 2 16.5113V11.8617C2 8.70664 4.3535 6.41041 7.57275 6.41041C10.4889 6.36056 13.4411 6.3616 16.4283 6.41041C19.6476 6.41041 22 8.70767 22 11.8617V16.5113C22 19.6664 19.6476 21.9626 16.4283 21.9626Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.07227 2C8.07227 2.74048 8.68475 3.34076 9.44029 3.34076H10.4968C11.6624 3.34492 12.6065 4.27026 12.6118 5.41266V6.08771"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GameRegularLightBorderIcon;
