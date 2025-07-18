import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3RegularBrokenIcon component
 */
export const ArrowLeft3RegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.2384 16.7827V12.7174L20.2658 12.7174C20.6711 12.7174 21 12.396 21 12.0001C21 11.6042 20.6711 11.2828 20.2658 11.2828L12.2384 11.2828V7.21745C12.2384 6.95637 12.0935 6.71537 11.8585 6.58913C11.6246 6.46289 11.3387 6.4715 11.1136 6.61017L3.34361 11.3928C3.12922 11.5248 3 11.7534 3 12.0001C3 12.2468 3.12922 12.4754 3.34361 12.6074L8.17866 15.5825C8.52031 15.7939 8.97455 15.6935 9.1909 15.3588C9.40627 15.0231 9.30348 14.5803 8.95986 14.3689L5.11258 12.0001L10.7699 8.51615L10.7699 16.7827C10.7699 17.1787 11.0989 17.5 11.5042 17.5C11.9094 17.5 12.2384 17.1787 12.2384 16.7827Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft3RegularBrokenIcon;
