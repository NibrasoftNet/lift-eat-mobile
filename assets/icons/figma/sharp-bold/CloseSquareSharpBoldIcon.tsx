import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareSharpBoldIcon component
 */
export const CloseSquareSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.711 14.9237L14.65 15.9847L12.249 13.5857L9.849 15.9817L8.789 14.9207L11.188 12.5257L8.789 10.1277L9.85 9.06667L12.25 11.4657L14.651 9.06867L15.711 10.1307L13.311 12.5257L15.711 14.9237ZM12.25 2.78467C6.874 2.78467 2.5 7.15867 2.5 12.5347C2.5 17.9107 6.874 22.2847 12.25 22.2847C17.626 22.2847 22 17.9107 22 12.5347C22 7.15867 17.626 2.78467 12.25 2.78467Z" fill={color} />
  </Svg>
);

export default CloseSquareSharpBoldIcon;
