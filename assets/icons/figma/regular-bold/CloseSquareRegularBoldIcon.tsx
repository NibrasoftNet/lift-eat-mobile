import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareRegularBoldIcon component
 */
export const CloseSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.67 1.99921H16.34C19.73 1.99921 22 4.37921 22 7.91921V16.0902C22 19.6202 19.73 21.9992 16.34 21.9992H7.67C4.28 21.9992 2 19.6202 2 16.0902V7.91921C2 4.37921 4.28 1.99921 7.67 1.99921ZM15.01 14.9992C15.35 14.6602 15.35 14.1102 15.01 13.7702L13.23 11.9902L15.01 10.2092C15.35 9.87021 15.35 9.31021 15.01 8.97021C14.67 8.62921 14.12 8.62921 13.77 8.97021L12 10.7492L10.22 8.97021C9.87 8.62921 9.32 8.62921 8.98 8.97021C8.64 9.31021 8.64 9.87021 8.98 10.2092L10.76 11.9902L8.98 13.7602C8.64 14.1102 8.64 14.6602 8.98 14.9992C9.15 15.1692 9.38 15.2602 9.6 15.2602C9.83 15.2602 10.05 15.1692 10.22 14.9992L12 13.2302L13.78 14.9992C13.95 15.1802 14.17 15.2602 14.39 15.2602C14.62 15.2602 14.84 15.1692 15.01 14.9992Z"
      fill={color}
    />
  </Svg>
);

export default CloseSquareRegularBoldIcon;
