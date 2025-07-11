import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscountSharpBrokenIcon component
 */
export const DiscountSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M9.90771 14.6688L14.3827 10.1938"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.3158 14.6064H14.3238"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.96476 10.2539H9.97176"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.134 15.1932C4.66 14.1622 3.936 13.2442 3 12.5342C5.019 11.0042 6.054 8.50318 5.709 5.99418C8.219 6.33918 10.719 5.30318 12.25 3.28418C13.781 5.30318 16.281 6.33918 18.791 5.99418C18.618 7.24918 18.791 8.50118 19.259 9.63118"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.4995 12.5347C19.4805 14.0657 18.4455 16.5657 18.7905 19.0757C16.2805 18.7307 13.7805 19.7657 12.2495 21.7847C10.7185 19.7657 8.2185 18.7307 5.7085 19.0757"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DiscountSharpBrokenIcon;
