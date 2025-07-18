import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2RegularBrokenIcon component
 */
export const ArrowUp2RegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M5.32166 16.3291C4.99896 16.5802 4.53642 16.5535 4.24169 16.256C3.92017 15.9303 3.91907 15.4005 4.24059 15.0725L11.4172 7.74651L11.5013 7.67131C11.6477 7.55732 11.8234 7.5 11.9999 7.5C12.2095 7.5 12.4202 7.58254 12.5804 7.74428C12.903 8.06998 12.9041 8.5998 12.5826 8.92773L5.40597 16.2538L5.32166 16.3291ZM19.7572 16.2559C19.4357 16.5805 18.9145 16.5827 18.5929 16.2537L13.8283 11.3882L13.7549 11.3023C13.5103 10.9734 13.5358 10.5033 13.8316 10.2048C13.9918 10.043 14.2025 9.96049 14.4121 9.96049C14.6228 9.96049 14.8345 10.043 14.9948 10.207L19.7605 15.0724L19.8339 15.1584C20.0785 15.4873 20.0529 15.9573 19.7572 16.2559Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp2RegularBrokenIcon;
