import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareRegularLightBorderIcon component
 */
export const CloseSquareRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.3955 9.59497L9.60352 14.387"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.3971 14.3899L9.60107 9.5929"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63549 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CloseSquareRegularLightBorderIcon;
