import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownload1SharpBrokenIcon component
 */
export const PaperDownload1SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M8.2022 21.25H19.9252V8.068L14.8182 2.75H4.5752V21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.1138 16.3273V10.2383" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.4775 14.521L11.1135 16.895L8.74951 14.521" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3418 5.30469V8.64969H19.4488" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperDownload1SharpBrokenIcon;
