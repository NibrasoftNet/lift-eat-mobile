import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoveryRegularLightBorderIcon component
 */
export const DiscoveryRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.27002 14.9519L9.8627 9.8627L14.9519 8.27002L13.3593 13.3593L8.27002 14.9519Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="11.611" cy="11.611" r="9.61098" fill='none' stroke={color} />
  </Svg>
);

export default DiscoveryRegularLightBorderIcon;
