import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image2CurvedLightBorderIcon component
 */
export const Image2CurvedLightBorderIcon = ({
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
      d="M21.1203 14.6667C20.2393 13.7607 18.9933 11.9297 16.7043 11.9297C14.4153 11.9297 14.3653 15.9677 12.0293 15.9677C9.69231 15.9677 8.75131 14.5967 7.22831 15.3127C5.70631 16.0277 4.46631 18.8737 4.46631 18.8737"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.5987 8.78444C10.5987 9.75744 9.81066 10.5454 8.83766 10.5454C7.86566 10.5454 7.07666 9.75744 7.07666 8.78444C7.07666 7.81144 7.86566 7.02344 8.83766 7.02344C9.81066 7.02344 10.5987 7.81144 10.5987 8.78444Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Image2CurvedLightBorderIcon;
