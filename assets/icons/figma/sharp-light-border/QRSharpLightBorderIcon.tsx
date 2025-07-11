import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * QRSharpLightBorderIcon component
 */
export const QRSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.5977 17.437L17.5977 17.5342"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.90234 17.437L6.90234 17.5342"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.1943 10.1942H16.4145M20.9999 7.76367V10.1942H19.2985M20.9999 5.09006V3.38867H19.2985M16.6249 3.38867H14.1943V7.5084"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.5176 5.75427V7.97266H18.3467"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.9434 5.74439L18.9434 5.75439"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.90234 6.74262L6.90234 6.83984"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Rect
      x="14.1943"
      y="14.083"
      width="6.80556"
      height="6.80556"
      fill='none'
      stroke={color}
    />
    <Rect
      x="3.5"
      y="14.083"
      width="6.80556"
      height="6.80556"
      fill='none'
      stroke={color}
    />
    <Rect
      x="3.5"
      y="3.38867"
      width="6.80556"
      height="6.80556"
      fill='none'
      stroke={color}
    />
  </Svg>
);

export default QRSharpLightBorderIcon;
