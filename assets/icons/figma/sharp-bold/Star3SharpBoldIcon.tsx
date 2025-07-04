import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star3SharpBoldIcon component
 */
export const Star3SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.1386 9.11306L12.2496 1.31006L9.36157 9.11306L1.55957 12.0001L9.36157 14.8871L12.2496 22.6901L15.1386 14.8871L22.9406 12.0001L15.1386 9.11306Z" fill={color} />
  </Svg>
);

export default Star3SharpBoldIcon;
