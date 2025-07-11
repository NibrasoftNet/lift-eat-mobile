import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoverySharpTwoToneIcon component
 */
export const DiscoverySharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M9.26663 14.9844L9.26562 14.9847L10.3374 10.0869L15.2341 9.01539L15.2351 9.01514L14.1634 13.9129L9.26663 14.9844Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="12.25" cy="12" r="9.25" fill='none' stroke={color} />
  </Svg>
);

export default DiscoverySharpTwoToneIcon;
