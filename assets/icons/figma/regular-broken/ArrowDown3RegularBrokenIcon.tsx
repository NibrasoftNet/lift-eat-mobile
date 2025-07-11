import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3RegularBrokenIcon component
 */
export const ArrowDown3RegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.7827 11.7616H12.7174V3.73421C12.7174 3.32893 12.396 3 12.0001 3C11.6042 3 11.2828 3.32893 11.2828 3.73421V11.7616H7.21745C6.95637 11.7616 6.71537 11.9065 6.58913 12.1415C6.46289 12.3754 6.4715 12.6613 6.61017 12.8864L11.3928 20.6564C11.5248 20.8708 11.7534 21 12.0001 21C12.2468 21 12.4754 20.8708 12.6074 20.6564L15.5825 15.8213C15.7939 15.4797 15.6935 15.0255 15.3588 14.8091C15.0231 14.5937 14.5803 14.6965 14.3689 15.0401L12.0001 18.8874L8.51615 13.2301H16.7827C17.1787 13.2301 17.5 12.9011 17.5 12.4958C17.5 12.0906 17.1787 11.7616 16.7827 11.7616Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDown3RegularBrokenIcon;
