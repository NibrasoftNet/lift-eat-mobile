import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2RegularBrokenIcon component
 */
export const ArrowLeft2RegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.2559 4.24279C16.5805 4.56431 16.5827 5.08555 16.2537 5.40707L11.3882 10.1717L11.3023 10.2451C10.9734 10.4897 10.5033 10.4642 10.2048 10.1684C10.043 10.0082 9.96049 9.79753 9.96049 9.58794C9.96049 9.37725 10.043 9.16546 10.207 9.00525L15.0724 4.2395L15.1584 4.16609C15.4873 3.92149 15.9573 3.94706 16.2559 4.24279ZM16.3291 18.6783C16.5802 19.001 16.5535 19.4636 16.256 19.7583C15.9303 20.0798 15.4005 20.0809 15.0725 19.7594L7.74651 12.5828L7.67131 12.4987C7.55732 12.3523 7.5 12.1766 7.5 12.0001C7.5 11.7905 7.58254 11.5798 7.74428 11.4196C8.06998 11.097 8.5998 11.0959 8.92773 11.4174L16.2538 18.594L16.3291 18.6783Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft2RegularBrokenIcon;
