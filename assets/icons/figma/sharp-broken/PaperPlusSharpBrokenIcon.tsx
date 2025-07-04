import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperPlusSharpBrokenIcon component
 */
export const PaperPlusSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.3418 14.4111H9.40283" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.8726 16.8809V11.9419" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.9122 21.25H19.9252V8.068L14.8182 2.75H4.5752V21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3418 5.30469V8.64969H19.4488" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperPlusSharpBrokenIcon;
