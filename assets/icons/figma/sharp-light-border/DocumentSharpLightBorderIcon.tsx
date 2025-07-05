import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentSharpLightBorderIcon component
 */
export const DocumentSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M10.9381 13.3931H8.62207"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.6918 9.22904H8.62207"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Rect
      x="3.87695"
      y="2.75"
      width="16.7465"
      height="18.5"
      fill={none}
      stroke={color}
    />
  </Svg>
);

export default DocumentSharpLightBorderIcon;
