import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GameRegularTwotoneIcon component
 */
export const GameRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.1795 16.0027H17.0725"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.84819 12.314V16.059"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.7591 14.1868H6.93799"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.3661 12.428H15.259"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.4283 21.9625C13.4231 22.0134 10.473 22.0113 7.57275 21.9625C4.3535 21.9625 2 19.6663 2 16.5112V11.8616C2 8.70651 4.3535 6.41029 7.57275 6.41029C10.4889 6.36044 13.4411 6.36148 16.4283 6.41029C19.6476 6.41029 22 8.70755 22 11.8616V16.5112C22 19.6663 19.6476 21.9625 16.4283 21.9625Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.07227 2C8.07227 2.74048 8.68475 3.34076 9.44029 3.34076H10.4968C11.6624 3.34492 12.6065 4.27026 12.6118 5.41266V6.08771"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GameRegularTwotoneIcon;
