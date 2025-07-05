import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SendCurvedBoldIcon component
 */
export const SendCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.7156 2.74155C21.6686 2.65355 21.5976 2.58155 21.5096 2.53455C19.4236 1.42455 6.94457 5.29255 3.71658 7.15455C2.87558 7.63955 2.50058 8.20955 2.60358 8.84555C2.90058 10.6876 7.86357 12.0836 10.5566 12.7086L15.6136 7.65255C15.9066 7.35955 16.3816 7.35955 16.6746 7.65255C16.9676 7.94556 16.9676 8.42055 16.6746 8.71355L11.5686 13.8176C12.2096 16.5386 13.5906 21.3536 15.4036 21.6456C15.4716 21.6566 15.5396 21.6626 15.6066 21.6626C16.1606 21.6626 16.6606 21.2826 17.0936 20.5326C18.9556 17.3076 22.8266 4.83055 21.7156 2.74155Z"
      fill={color}
    />
  </Svg>
);

export default SendCurvedBoldIcon;
