import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareCurvedLightBorderIcon component
 */
export const ArrowRightSquareCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21.25C18.937 21.25 21.25 18.937 21.25 12C21.25 5.063 18.937 2.75 12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.3218 8.24805C12.3218 8.24805 16.0858 10.776 16.0858 12C16.0858 13.224 12.3218 15.748 12.3218 15.748"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.0861 12H7.91406"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightSquareCurvedLightBorderIcon;
