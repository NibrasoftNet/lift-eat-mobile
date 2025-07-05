import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image2CurvedBrokenIcon component
 */
export const Image2CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12C21.25 5.063 18.937 2.75 12 2.75C5.063 2.75 2.75 5.063 2.75 12Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.1202 14.6667C20.2392 13.7607 18.9932 11.9297 16.7042 11.9297C14.4152 11.9297 14.3652 15.9677 12.0292 15.9677C9.69219 15.9677 8.75119 14.5967 7.22819 15.3127C6.72519 15.5487 6.25319 16.0177 5.84619 16.5407"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.5991 8.78444C10.5991 9.75744 9.81115 10.5454 8.83815 10.5454C7.86615 10.5454 7.07715 9.75744 7.07715 8.78444C7.07715 7.81144 7.86615 7.02344 8.83815 7.02344"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Image2CurvedBrokenIcon;
