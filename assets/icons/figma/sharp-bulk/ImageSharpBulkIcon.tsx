import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ImageSharpBulkIcon component
 */
export const ImageSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M2.5 22.354H22V2.854H2.5V22.354Z" fill={color} />
    <Path d="M18.742 19.0639L18.888 19.0319L19.069 18.8019L15.018 12.0069H14.656L11.693 15.9399L8.54102 14.3509L8.16202 14.3239L5.74902 18.7919L5.92102 19.0639H18.742Z" fill={color} />
    <Path d="M10.928 8.71592C10.928 7.52092 9.95402 6.54692 8.75702 6.54492C7.56102 6.54492 6.58702 7.51792 6.58702 8.71592C6.58702 9.91192 7.56102 10.8859 8.75702 10.8859C9.95402 10.8859 10.928 9.91192 10.928 8.71592Z" fill={color} />
  </Svg>
);

export default ImageSharpBulkIcon;
