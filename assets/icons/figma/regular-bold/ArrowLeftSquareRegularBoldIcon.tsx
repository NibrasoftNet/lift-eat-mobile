import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareRegularBoldIcon component
 */
export const ArrowLeftSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.92 2H16.09C19.62 2 22 4.271 22 7.66V16.33C22 19.72 19.62 22 16.09 22H7.92C4.38 22 2 19.72 2 16.33V7.66C2 4.271 4.38 2 7.92 2ZM9.73 12.75H16.08C16.5 12.75 16.83 12.41 16.83 12C16.83 11.58 16.5 11.25 16.08 11.25H9.73L12.21 8.78C12.35 8.64 12.43 8.44 12.43 8.25C12.43 8.061 12.35 7.87 12.21 7.72C11.92 7.43 11.44 7.43 11.15 7.72L7.38 11.47C7.1 11.75 7.1 12.25 7.38 12.53L11.15 16.28C11.44 16.57 11.92 16.57 12.21 16.28C12.5 15.98 12.5 15.51 12.21 15.21L9.73 12.75Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSquareRegularBoldIcon;
