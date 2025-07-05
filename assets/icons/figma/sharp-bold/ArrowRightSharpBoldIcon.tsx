import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSharpBoldIcon component
 */
export const ArrowRightSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M13.4885 4.56152L12.0775 5.97852L17.1205 10.9995H3.5415V12.9995H17.1195L12.0775 18.0215L13.4885 19.4385L20.9585 11.9995L13.4885 4.56152Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightSharpBoldIcon;
