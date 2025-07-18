import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleRegularBoldIcon component
 */
export const ArrowUpCircleRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2C17.52 2 22 6.49 22 12L21.9962 12.2798C21.8478 17.6706 17.4264 22 12 22C6.49 22 2 17.52 2 12C2 6.49 6.49 2 12 2ZM8 13.98C8.3 14.27 8.77 14.27 9.06 13.97L12 11.02L14.94 13.97C15.23 14.27 15.71 14.27 16 13.98C16.3 13.68 16.3 13.21 16 12.92L12.53 9.43C12.39 9.29 12.2 9.21 12 9.21C11.8 9.21 11.61 9.29 11.47 9.43L8 12.92C7.85 13.06 7.78 13.25 7.78 13.44C7.78 13.64 7.85 13.83 8 13.98Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCircleRegularBoldIcon;
