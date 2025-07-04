import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FlashRegularBoldIcon – généré depuis Figma
 */
export const FlashRegularBoldIcon = ({ color = '#FFFFFF', size = 28, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none" {...props}>
    <Path
      d="M5.897 3.787a.875.875 0 1 0-1.295 1.176l4.293 4.723L4.61 14.28a.875.875 0 0 0 .328 1.422l6.304 2.364-1.6 8.012a.875.875 0 0 0 1.498.766l6.766-7.25 4.197 4.616A.873.873 0 0 0 23.55 24a.876.876 0 0 0-.152-.967L5.898 3.787Zm6.065 19.62 1.146-5.73a.875.875 0 0 0-.547-.99l-5.78-2.172 3.295-3.53 6.647 7.313-4.76 5.108Zm-.077-15.641a.874.874 0 0 1-.043-1.237l5.018-5.377a.875.875 0 0 1 1.498.765l-1.604 8.025 6.303 2.364a.874.874 0 0 1 .328 1.416l-2.439 2.613a.875.875 0 0 1-1.28-1.193l1.553-1.657-5.775-2.166a.875.875 0 0 1-.547-.99l1.145-5.73-2.917 3.125a.875.875 0 0 1-1.24.042Z"
      fill={color}
    />
  </Svg>
);

export default FlashRegularBoldIcon;
