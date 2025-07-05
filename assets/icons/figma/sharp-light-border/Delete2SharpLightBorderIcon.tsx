import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Delete2SharpLightBorderIcon component
 */
export const Delete2SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M4.36914 6.58984H20.1303L18.7129 21.389H5.78654L4.36914 6.58984Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.251 11.5024L12.251 16.4753"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.7268 6.13601L15.6581 2.88867H8.84314L7.77441 6.13601"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Delete2SharpLightBorderIcon;
