import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareCurvedBoldIcon component
 */
export const TickSquareCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.341 10.6917L11.591 15.4377C11.45 15.5787 11.26 15.6577 11.061 15.6577C10.862 15.6577 10.671 15.5787 10.53 15.4377L8.159 13.0647C7.866 12.7717 7.866 12.2967 8.159 12.0037C8.453 11.7107 8.928 11.7127 9.22 12.0037L11.061 13.8467L15.28 9.63067C15.573 9.33767 16.048 9.33867 16.341 9.63067C16.634 9.92367 16.634 10.3987 16.341 10.6917ZM12.25 2.78467C5.052 2.78467 2.5 5.33667 2.5 12.5347C2.5 19.7327 5.052 22.2847 12.25 22.2847C19.448 22.2847 22 19.7327 22 12.5347C22 5.33667 19.448 2.78467 12.25 2.78467Z" fill={color} />
  </Svg>
);

export default TickSquareCurvedBoldIcon;
