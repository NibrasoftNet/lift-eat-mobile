import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter3SharpBoldIcon component
 */
export const Filter3SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M2.75 3.39502V7.80302L9.5 14.69V21.813L15 19.663V14.69L21.75 7.80302V3.39502H2.75Z"
      fill={color}
    />
  </Svg>
);

export default Filter3SharpBoldIcon;
