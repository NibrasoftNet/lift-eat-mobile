import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUpload1SharpBrokenIcon component
 */
export const PaperUpload1SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M8.3642 21.25H19.9252V8.068L14.8182 2.75H4.5752V21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.1143 10.8057V16.8947" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.478 12.6118L11.114 10.2378L8.75098 12.6118" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3423 5.30469V8.64969H19.4503" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperUpload1SharpBrokenIcon;
