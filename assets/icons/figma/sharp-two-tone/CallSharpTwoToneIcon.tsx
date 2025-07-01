import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSharpTwoToneIcon component
 */
export const CallSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M10.2814 14.2726C8.57344 12.5647 8.11965 10.6593 8.11965 10.6593L9.76304 7.80524L6.52252 3.354C5.03257 4.22792 3.91931 5.33331 3.05077 6.82576C2.54837 9.51197 4.23176 13.6945 7.29008 16.9658" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.2813 14.2725C12.0739 16.0651 14.0736 16.6132 14.0736 16.6132L16.9277 14.9698L21.5384 18.3698C20.6806 19.9024 19.5992 20.9838 18.0667 21.8416C13.7732 22.0381 9.99418 19.8581 7.29004 16.9656" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallSharpTwoToneIcon;
