import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareSharpBoldIcon component
 */
export const TickSquareSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.7193 15.8427L12.5043 16.2237H11.6643L11.4113 15.8877C11.3963 15.8647 9.9093 13.6427 7.9873 12.4267L7.3523 12.0267L8.1543 10.7587L8.7873 11.1587C10.1723 12.0337 11.3223 13.3117 12.0003 14.1647C13.0653 12.5597 15.5593 9.21667 19.3843 6.50567C17.5973 4.24367 14.8363 2.78467 11.7373 2.78467C6.3613 2.78467 1.9873 7.15867 1.9873 12.5347C1.9873 17.9107 6.3613 22.2847 11.7373 22.2847C17.1133 22.2847 21.4873 17.9107 21.4873 12.5347C21.4873 10.7977 21.0253 9.16967 20.2263 7.75567C15.3933 11.2017 12.7483 15.7917 12.7193 15.8427Z"
      fill={color}
    />
  </Svg>
);

export default TickSquareSharpBoldIcon;
