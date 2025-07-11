import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareRegularBoldIcon component
 */
export const InfoSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.67 1.99921H16.34C19.73 1.99921 22 4.37921 22 7.91921V16.0902C22 19.6202 19.73 21.9992 16.34 21.9992H7.67C4.28 21.9992 2 19.6202 2 16.0902V7.91921C2 4.37921 4.28 1.99921 7.67 1.99921ZM11.99 9.06021C11.52 9.06021 11.13 8.66921 11.13 8.19021C11.13 7.70021 11.52 7.31021 12.01 7.31021C12.49 7.31021 12.88 7.70021 12.88 8.19021C12.88 8.66921 12.49 9.06021 11.99 9.06021ZM12.87 15.7802C12.87 16.2602 12.48 16.6502 11.99 16.6502C11.51 16.6502 11.12 16.2602 11.12 15.7802V11.3602C11.12 10.8792 11.51 10.4802 11.99 10.4802C12.48 10.4802 12.87 10.8792 12.87 11.3602V15.7802Z"
      fill={color}
    />
  </Svg>
);

export default InfoSquareRegularBoldIcon;
