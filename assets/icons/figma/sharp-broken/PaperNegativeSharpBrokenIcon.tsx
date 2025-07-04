import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperNegativeSharpBrokenIcon component
 */
export const PaperNegativeSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.3423 14.4111H9.40234" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.12971 21.25H19.9247V8.068L14.8177 2.75H4.57471V21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3413 5.30469V8.64969H19.4483" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperNegativeSharpBrokenIcon;
