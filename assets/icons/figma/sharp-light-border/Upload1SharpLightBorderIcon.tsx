import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Upload1SharpLightBorderIcon component
 */
export const Upload1SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2497 3.23101L12.2497 16.0088"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.875 10.9946L21.5 10.9946L21.5 21.5186L3 21.5186L3 10.9946L7.625 10.9946"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.9751 5.771L12.2501 2.48143L15.5261 5.771"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Upload1SharpLightBorderIcon;
