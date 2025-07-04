import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3RegularBoldIcon component
 */
export const ArrowDown3RegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.4101 12.1415C17.2839 11.9075 17.0438 11.7616 16.7827 11.7616H12.7173V3.73429C12.7173 3.32896 12.396 3 12 3C11.6041 3 11.2828 3.32896 11.2828 3.73429V11.7616H7.21731C6.95527 11.7616 6.71523 11.9075 6.58995 12.1415C6.46275 12.3755 6.47136 12.6614 6.61003 12.8875L11.3927 20.6573C11.5247 20.8708 11.7533 21 12 21C12.2468 21 12.4753 20.8708 12.6073 20.6573L17.39 12.8875C17.4627 12.7681 17.5 12.632 17.5 12.4959C17.5 12.3745 17.4694 12.2521 17.4101 12.1415Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDown3RegularBoldIcon;
