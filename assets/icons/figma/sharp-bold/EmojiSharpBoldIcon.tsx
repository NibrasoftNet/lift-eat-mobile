import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EmojiSharpBoldIcon component
 */
export const EmojiSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M17.248 12.6897C17.248 15.4457 15.006 17.6877 12.25 17.6877C9.494 17.6877 7.252 15.4457 7.252 12.6897V11.9397H8.752V12.6897C8.752 14.6187 10.321 16.1877 12.25 16.1877C14.179 16.1877 15.748 14.6187 15.748 12.6897V11.9397H17.248V12.6897ZM12.25 2.38867C6.874 2.38867 2.5 6.76267 2.5 12.1387C2.5 17.5147 6.874 21.8887 12.25 21.8887C17.626 21.8887 22 17.5147 22 12.1387C22 6.76267 17.626 2.38867 12.25 2.38867Z" fill={color} />
  </Svg>
);

export default EmojiSharpBoldIcon;
