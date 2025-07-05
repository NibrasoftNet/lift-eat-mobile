import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareSharpBoldIcon component
 */
export const ArrowDownSquareSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 17.149L7.439 12.32L8.502 11.262L11.5 14.271V7.164H13V14.271L15.998 11.262L17.061 12.32L12.25 17.149ZM2.5 21.75H22V2.25H2.5V21.75Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSquareSharpBoldIcon;
