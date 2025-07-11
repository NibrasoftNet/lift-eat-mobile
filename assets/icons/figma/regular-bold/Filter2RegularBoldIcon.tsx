import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter2RegularBoldIcon component
 */
export const Filter2RegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4.12819 2H19.8718C21.0476 2 22 2.98105 22 4.19225V5.72376C22 6.31133 21.7704 6.87557 21.3627 7.28708L14.8577 13.867C14.7454 13.9816 14.5931 14.0452 14.4355 14.0441L8.98893 14.0272C8.82317 14.0272 8.66564 13.9561 8.55238 13.832L2.57452 7.25738C2.20489 6.85117 2 6.31451 2 5.7577V4.19332C2 2.98211 2.95238 2 4.12819 2ZM9.2801 15.8241L14.1347 15.839C14.4374 15.8401 14.6824 16.0935 14.6824 16.4043V19.1353C14.6824 19.4471 14.5053 19.7293 14.2294 19.8597L9.8227 21.9289C9.71974 21.9767 9.61061 22 9.50147 22C9.35629 22 9.21112 21.9576 9.08448 21.8738C8.86311 21.7274 8.72927 21.475 8.72927 21.2046V16.3894C8.72927 16.0766 8.97637 15.8231 9.2801 15.8241Z"
      fill={color}
    />
  </Svg>
);

export default Filter2RegularBoldIcon;
